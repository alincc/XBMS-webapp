import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TimelineMax, TweenLite } from 'gsap';
import * as MorphSVGPlugin from '../../../assets/js/MorphSVGPlugin';
import * as DrawSVGPlugin from '../../../assets/js/DrawSVGPlugin';
import { TimelineLite, Back, Power1, SlowMo } from 'gsap';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as normalize from 'normalize-svg-coords';
const plugins = [DrawSVGPlugin, MorphSVGPlugin]; //needed for GSAP 

export class animationtype {
  start_time: number; //delayt
  end_time: number;
  anim_type: string;
  duration: number;
  ease: string;
  posx: number;
  posy: number;
  rotationcycle: number;
  travellocX: number;
  travellocY: number;
  scalesize: number;
  skewY: number;
  skewX: number;
}


export class imageanimation {
  type: 'image';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    opacity: 1;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: number;
  animation: animationtype[];
}

export class vectoranimation {
  type: 'vector';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    opacity: 1;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: number;
  animation: animationtype[];
  vectors: vectorelement[];
  svgcombi: SafeHtml;
}

export class vectorelement {
  idx: string;
  src: string;
  duration: number;
  start_time: number;
  pathids: [];
}

export class shapeanimation {
  type: 'shape';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    'background-color': string;
    opacity: 1;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: number;
  animation: animationtype[];
}

export class textanimation {

  content: string;
  type: 'text';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    'font-size': string;
    'font-style': string;
    'font-weight': string;
    'font-family': string;
    opacity: 1;
  }
  posx: number;
  posy: number;
  setpos: object;
  id: number;
  animation: animationtype[];
}


@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss']
})

export class VideocreatorComponent implements AfterViewInit {

  @ViewChild('progressbar', { static: false }) progressbar: ElementRef;

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  @Input() company: Company = new Company;

  videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer', { static: false })
  set mainVideoEl(el: ElementRef) {
    if (el !== undefined) {
      this.videoPlayer = el.nativeElement;
    }
  }

  public t;
  public counter = 4;
  public currenttime = 0;
  public animationarray = []; //array with style and position settings;
  public animationelements = []; //arrat with the actual greensock animations

  public play = false;
  public menu = new TimelineMax({ paused: true, reversed: true });
  public primairytimeline = new TimelineMax({ paused: true, reversed: true });
  progressbarline = new TimelineMax({ paused: true, reversed: true });


  public listviewxsshow = false;
  public showprogressbar = false;
  public uploader: FileUploader;
  public newFiles: Files = new Files();
  public changenow = true;
  public changevideo = true;
  public shiftX = 0;
  public shiftY = 0;
  public editablevideo: Files;
  public editablevideos: Files[];
  public canvas = {
    width: '600px',
    height: '500px',
    'background-color': '#ffffff',
    position: 'relative',
    videourl: '',
    loop: false
  }
  public moveitem = false;
  public selectedImage: imageanimation;
  public showemoji = false;
  public newz = 1;
  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  watcher: Subscription;
  activeMediaQuery;
  public selectedelement;
  public elementname;
  private MorphSVGPlugin = MorphSVGPlugin;
  private largesthbox;
  private largestwbox;

  constructor(
    private sanitizer: DomSanitizer,
    private relationsApi: RelationsApi,
    private filesApi: FilesApi,
    public snackBar: MatSnackBar,
    public ngZone: NgZone,
    public media: MediaObserver,
  ) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change;
    });
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    //wait for option.id
    const currentItem: SimpleChange = changes.option;

    if (currentItem !== undefined) {
      if (currentItem.currentValue.id !== undefined) {

      }
    }
  }

  formatLabel(value: number | null) {
    if (!value) {
      return this.counter;
    }
    if (value >= 60) {
      return Math.round(value / 60) + 'm';
    } else {
      return value + 's'
    }
  }

  onSliderChange(e) {
    this.counter = e.value;
  }

  converttovideo() {
    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    this.filesApi.createvideo(this.option.id, this.option.companyId,
      this.elementname, this.canvas, this.animationarray, this.counter)
      .subscribe(
        res => { console.log }
      );
  }

  onSelectElement(element): void {
    this.selectedelement = element;
    //console.log(this.selectedelement);
  }

  async detectchange() {
    //console.log('run check', this.animationarray);
    this.animationarray.forEach(elm => {
      if (elm.posx > 0) {
        elm.setpos = { 'x': elm.posx, 'y': elm.posy };
      }
    })
    // force dom update
    this.changenow = false;
    setTimeout(() => { this.changenow = true; return });
    // wait for dom update to finish otherwise it will create the effects on the old dom
    setTimeout(() =>
      this.animationarray.forEach(elm => {
        this.addEffect(elm);
        if (elm.type === 'vector') {
          setTimeout(() => {
            // add vector efffects
            this.createMorph(elm.vectors)
          }, 300) // mininmum needed for dom to process
        }
      })
    );

  }

  onchangevideo() {
    if (this.canvas.videourl) { this.canvas['background-color'] = 'transparent' }
    this.changevideo = false;
    setTimeout(() => this.changevideo = true);
  }

  addAnimation(i, element) {
    let duration = element.duration;
    let startime = element.start_time
    let anitype = element.anim_type;
    let rotationcycle = element.rotationcycle;
    let scalesize = element.scalesize;
    let skewY = element.skewY;
    let skewX = element.skewX;
    //let travellocY = element.posy;
    //let travellocX = element.posx;
    let aniset;
    if (anitype === 'rotation') {
      aniset = { rotation: rotationcycle, ease: "Expo.easeInOut" }
    }
    if (anitype === 'translate') {
      aniset = { rotation: '30', ease: "Expo.easeInOut" }
    }
    if (anitype === 'bounce') {
      aniset = { ease: 'Bounce.easeOut', y: element.travellocY, x: element.travellocX }
    }
    if (anitype === 'scale') {
      aniset = { scale: scalesize }
    }
    if (anitype === 'appear') {
      this.selectedelement.style.opacity = 0;
      aniset = { opacity: 1 };
    }
    if (anitype === 'disappear') {
      aniset = { opacity: 0 }, { opacity: 1 };
    }
    if (anitype === 'move') {
      aniset = { y: element.travellocY, x: element.travellocX }
    }
    if (anitype === 'skew') {
      aniset = { skewY: skewY, skewX: skewX }
    }

    this.primairytimeline.to(i, duration, aniset, startime);
    //console.log(duration, aniset, startime);
  }


  addEffect(element): void {
    console.log(element);
    let id = document.getElementById(element.id);
    //console.log(id);
    element.animation.forEach(animationsection => {
      this.addAnimation(id, animationsection);
    });
  }

  addNewEffect(element): void {
    let newanimation: animationtype = {
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      ease: '',
      posx: this.selectedelement.posx,
      posy: this.selectedelement.posy,
      rotationcycle: 30,
      travellocX: this.selectedelement.posy + 300,
      travellocY: this.selectedelement.posx,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50
    }
    this.selectedelement.animation.push(newanimation)
  }

  deleteEffect(i) {
    //reset opacity 
    if (this.selectedelement.animation[i].anim_type === 'appear') {
      this.selectedelement.style.opacity = 1;
      // console.log('delete opacity')
    }
    this.selectedelement.animation.splice(i, 1);
  }

  getEditFile() {
    this.relationsApi.getFiles(this.option.id, { where: { template: { "neq": null } } })
      .subscribe((files: Files[]) => {
        this.editablevideos = files;
        //console.log('received files', this.editableimages);
      });
  }

  setImage(event, i): void {
    setTimeout(() => {
      this.animationarray[i].src = event;
      //else new file not uploaded yet  
    }, 500);
  }

  setVector(event, i, idx): void {
    this.animationarray[i].vectors[idx].src = event;
    let vect = this.animationarray[i].vectors[idx].idx;

    //wait a few seconds as it takes a moment to fetch the file (no cb available)
    let originalsize; // {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
    setTimeout(async () => {
      await this.deleteVectorGroup(vect);
      originalsize = await this.getViewBox(vect);
      await this.normalizepath(vect, originalsize);
      await this.combineSVGs(this.animationarray[i]);
      //await this.createMorph(this.animationarray[i].vector);
      console.log(originalsize);
    }, 300);
  }

  getViewBox(vect) {
    return new Promise((resolve, reject) => {
      let set = document.getElementById(vect);
      let doc = set.getElementsByTagName('svg');
      let element = SVG.get(doc[0].id);
      //element.draggable()
      var box = element.viewbox();
       console.log(element.rbox());
      //element.viewbox(bbox.x, bbox.y, bbox.width, bbox.height);
      resolve(box);
    });
  }

  centeralign(element) {
    let id = element.id;
    for (const vector of element.vectors) {
      for (const el of vector.pathids) {

        console.log(el)
        let element = SVG.get(el);

        var bbox = element.bbox()
        var svg = document.getElementById('svg2');

        console.log(bbox, svg)

        var viewBox = svg.getAttribute('viewBox');
        let viewboxnew = viewBox.split(' ');

        var cx = parseFloat(viewboxnew[0]) + (parseFloat(viewboxnew[2]) / 2);
        var cy = parseFloat(viewboxnew[1]) + (parseFloat(viewboxnew[3]) / 2);

        console.log(cx, bbox.y, bbox.width);
        console.log(cy, bbox.x, bbox.height);
        var x = cx - bbox.x - (bbox.width / 2);
        var y = cy - bbox.y - (bbox.height / 2);
        var matrix = '1 0 0 1 ' + x + ' ' + y;

        console.log(matrix);

        element.attr('transform', 'matrix(' + matrix + ')');
      }
    }

  }

  onMoving(event, i) {
    this.animationarray[i].posy = event.y;
    this.animationarray[i].posx = event.x;
  }

  onResizing(e, i) {
    this.animationarray[i].style.width = e.size.width + 'px';
    this.animationarray[i].style.height = e.size.height + 'px';
  }

  addNewVector(): void {
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'el';
    } else {
      newelnr = this.animationarray.length + 'el';
    }

    let vectorid = newelnr + 'vect-' + 1;
    //let elname = 'el' + newelnr;
    this.newz = this.newz + 1;
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 30,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50
    }];
    // do not add animation from beginning with morph SVG's 
    let vectors: vectorelement[] = [{
      src: '',
      idx: vectorid,
      duration: 1,
      start_time: undefined,
      pathids: []
    }]
    let vector: vectoranimation = {
      type: 'vector',
      style: {
        'z-index': this.newz,
        width: "200px",
        height: "200px",
        position: 'absolute',
        opacity: 1
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      animation: [],
      id: newelnr,
      vectors: vectors,
      svgcombi: ''
    }
    this.animationarray.push(vector);
    this.detectchange();
  }


  addNewImage(): void {
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'el';
    } else {
      newelnr = this.animationarray.length + 'el';
    }
    //let elname = 'el' + newelnr;
    this.newz = this.newz + 1;
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 30,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50
    }];
    let img: imageanimation = {
      type: 'image',
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        opacity: 1
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      animation: anim,
      id: newelnr
    }
    this.animationarray.push(img);
    this.detectchange();
    //this.addAnimation(newelnr, img);
  }

  addNewShape(): void {
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'el';
    } else {
      newelnr = this.animationarray.length + 'el';
    }
    this.newz = this.newz + 1;
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 30,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50
    }];
    let img: shapeanimation = {
      type: 'shape',
      style: {
        'z-index': this.newz,
        width: "200px",
        height: "200px",
        position: 'absolute',
        'background-color': '#000000',
        opacity: 1
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      animation: anim,
      id: newelnr
    }
    this.animationarray.push(img);
    this.detectchange();
    //this.addAnimation(newelnr, img);
  }

  addNewText(): void {
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0; //+ 'el';
    } else {
      newelnr = this.animationarray.length;// + 'el';
    }
    //let elname = '#element' + newelnr;
    this.newz = this.newz + 1;
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 30,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50
    }];
    let txt: textanimation = {
      type: 'text',
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        'font-size': '20px',
        'font-family': 'Open Sans',
        'font-style': '',
        'font-weight': '',
        opacity: 1
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      posy: 50,
      setpos: { 'x': 20, 'y': 50 },
      animation: anim,
      id: newelnr
    }
    this.animationarray.push(txt);
    this.detectchange();
    //this.addAnimation(newelnr, txt);
  }


  menuClick() {
    this.menu.reversed() ? this.menu.play() : this.menu.reverse();
    return //console.log('clicked');
  }

  playFunc() {
    this.detectchange();
    console.log('play');
    //this.progressbarline.play();

    setTimeout(() => {

      if (this.canvas.videourl) {
        this.videoPlayer.play();
      }
      if (this.canvas.loop) {
        this.videoPlayer.loop = true;
      }
      this.primairytimeline.play();
      this.t = setInterval(() => { this.incrementSeconds() }, 1000);
    }, 300);
  }

  stopFunc() {
    console.log('stop')
    clearTimeout(this.t);
    this.currenttime = 0;
    this.primairytimeline.pause();
    this.primairytimeline.progress(0);
    this.primairytimeline.timeScale(1);
    if (this.canvas.videourl) {
      this.videoPlayer.pause();
      this.videoPlayer.currentTime = 0;
    }
    //this.progressbarline.reverse();
    //this.primairytimeline.reverse();
    //this.progressbar.reversed() ?
    //this.progressbarline.progress(0);
  }

  pauseFunc() {
    this.primairytimeline.pause();
    if (this.canvas.videourl) {
      this.videoPlayer.pause();
    }
  }

  reverseFunc() {
    this.primairytimeline.reverse();
    if (this.canvas.videourl) {
      this.videoPlayer.playbackRate = 1.0;
    }
  }

  fastforwardFunc() {
    this.primairytimeline.timeScale(5);
  }

  incrementSeconds() {
    this.currenttime = this.currenttime + 1;
    //console.log(this.currenttime);
  }

  drop(e) {
    //console.log(e);
    this.swapElement(this.animationarray, e.currentIndex, e.previousIndex);
    this.animationarray.forEach((img, i) => {
      img.style['z-index'] = i + 1;
    })
    this.detectchange()
  }

  swapElement(array, indexA, indexB) {
    var tmp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = tmp;
  }

  loadEditableImage() {
    //console.log(this.editablevideo.template)
    this.animationarray = this.editablevideo.template;
    this.canvas = this.editablevideo.canvas[0];
    //console.log(this.animationarray, this.canvas);
    this.detectchange();
  }

  setbold(img) {
    if (img.style['font-weight'] === 'bold') {
      img.style['font-weight'] = '';
    } else {
      img.style['font-weight'] = 'bold';
    }
    this.detectchange();
  }

  setitalic(img) {
    if (img.style['font-style'] === 'italic') {
      img.style['font-style'] = '';
    } else {
      img.style['font-style'] = 'italic';
    }
    this.detectchange();
  }

  deleteitem(i) {
    this.animationarray.splice(i, 1);
  }

  swiperight(e) {
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    this.listviewxsshow = false;
  }

  setVideo(event) {
    //console.log(event);
    this.canvas.videourl = event;
    this.onchangevideo();
  }

  handleSVG(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', parent.style.width);
    svg.setAttribute('height', parent.style.height);
    return svg;
  }

  previewSVG(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    return svg;
  }

  previewSVGBig(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    return svg;
  }

  addNewVectorSrc(i, element: vectoranimation) {
    const addnr = element.vectors.length + 1
    let idnr = element.id + 'vec-' + addnr;
    let newVector: vectorelement = {
      src: '',
      idx: idnr,
      duration: 1,
      start_time: undefined,
      pathids: []
    }
    this.animationarray[i].vectors.push(newVector);
  }

  deleteVectorSrc(idx, element) {
    this.selectedelement.vectors.splice(idx, 1);
    this.combineSVGs(element);
  }

  async combineSVGs(element) {
    return new Promise(async (resolve, reject) => {
      //const draw = SVG('drawing');
      let idnew;
      let total = [];
      let startstr = '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"' +
        ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"' +
        ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">';
      //console.log('morph added to vector');

      total.push(startstr);
      let index = 0;
      //console.log('before vect desc:', element.vectors);
      for (const vect of element.vectors) {
        idnew = document.getElementById(vect.idx); // get document

        let vectstring;
        //console.log(idnew); // check null ref error
        if (idnew.childNodes[0] !== null) {
          vectstring = idnew.childNodes[0].innerHTML;
        } else {
          vectstring = idnew.childNodes.innerHTML;
        }
        vectstring = await this.deleteMetaSvg(vectstring); //delete background
        //pathidar.splice(0, 1); no need as fetch new list anyway
        let pathidar = vectstring.match(/id="\S+/g); //get ids
        const newvectstring = await this.renumberSvgIds(vectstring, vect.idx, pathidar); // set ids
        let pathidar2 = newvectstring.match(/id="\S+/g); //get ids
        pathidar2 = await this.cleantags(pathidar2);
        element.vectors[index].pathids = pathidar2;
        total.push(newvectstring);
        ++index;
      }
      //console.log('loop done')
      total.push('</svg>');
      let childrenst = total.join('');
      element.svgcombi = this.sanitizer.bypassSecurityTrustHtml(childrenst);
      resolve();
    });
  }

  async cleantags(paths) {
    let newpaths = [];
    for (const path of paths) {
      let newpath = path.replace(/id=/g, '');
      let finalpath = newpath.replace(/"/g, '');
      newpaths.push(finalpath);
    };
    return newpaths
  }

  async setPos(vectors) {
    var matrix = '1 0 0 1 0 0';
    for (const vector of vectors) {
      for (const idel of vector.pathids) {
        //console.log(idel);
        let el = document.getElementById(idel);
        el.setAttribute('transform', 'matrix(' + matrix + ')');
      };
    }
  }



  async createMorph(vectors: vectorelement[]) {
    // create vector animation foreach path vector 1 to 2, 2 to 3 etc..
    //this.setPos(vectors);
    //console.log('morph', vectors)
    let i1 = 1;
    let i2 = 0;
    let set2 = i1;

    for (const vector of vectors) {

      if (i1 < vectors.length) {

        if (vectors[set2].pathids.length > vector.pathids.length) {
          let exti = 0
          for (const extrvect of vectors[set2].pathids) {
            if (exti > vector.pathids.length - 1) {
              let aniset;
              let fromexvac = document.getElementById(extrvect);
              //aniset = { autoAlpha: 0 };
              fromexvac.style.opacity = '0';

              aniset = { opacity: 1 };
              this.primairytimeline.to(fromexvac, 1, aniset, 1);
            }
            ++exti
          }
        }

        for (const pathid of vector.pathids) {

          if (i2 >= vectors[set2].pathids.length) {
            let aniset

            let fromvac = document.getElementById(pathid);
            aniset = { autoAlpha: 0 };
            this.primairytimeline.to(fromvac, 0, aniset, 1);
          } else {

            let fromvac = document.getElementById(pathid);
            //fromvac.style.display = 'block';
            //fromvac.style.margin = 'auto';

            let pathid2 = vectors[set2].pathids[i2];
            let tovec = document.getElementById(pathid2);
            //console.log(tovec);

            if (i1 > 0) {
              tovec.style.display = "none"; // hide element is not first vector
            }
            if (i2 === 0) {
              this.primairytimeline.to(fromvac, 1, { morphSVG: tovec })
            }
            //console.log(pathidclean, pathidclean2);
            //await this.setMorphAni(fromvac, tovec, set2);
            await this.setDrawAni(fromvac, 1);
          }
          ++i2;
        }
      }

      ++i1;
      ++set2;
    }
  }

  async setDrawAni(from, time) {
    this.primairytimeline.to(from, 2, { drawSVG: 0 }, 0.1);
    this.primairytimeline.staggerFromTo(from, 1, {drawSVG:"100%"}, {drawSVG:"50% 50%"}, 0.1)
  }

  async setMorphAni(from, to, time) {
    //console.log(from, to);
    var overlap = "1";
    this.primairytimeline.to(from, time, { morphSVG: to, }, overlap)
    // this.primairytimeline.to(from, 1, {
    //   morphSVG: {
    //     shape: to,
    //     type: "rotational",
    //     origin: "20% 60%"
    //   },
    //   ease: Power1.easeInOut
    // });
    // this.primairytimeline.to(from, 1, { morphSVG: to, type:"rotational", origin:"20% 60%"  }, 1)
    return
  }

  async normalizepath(idx, originalsize) {
    return new Promise((resolve, reject) => {
      // example originalsize = {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
      let idto = document.getElementById(idx);
      let p = idto.getElementsByTagName("path");
      let bxn
      for (let index = 0; index < p.length; index++) {
        let transf = window.getComputedStyle(p[index]).transform;
        //console.log(transf);
        if (transf !== undefined) {

          transf = transf; //.replace('matrix(');
          //console.log(transf);
          transf = transf.replace('matrix(', '');
          transf = transf.replace(')', '');
          bxn = transf.split(', ');

          if (bxn[0] !== 1){
            let newscale1 = originalsize.width - 500;
            newscale1 = newscale1 / originalsize.width;
            newscale1 = newscale1 * bxn[0];
            let newscale2 = originalsize.width - 500;
            newscale2 = newscale2 / originalsize.width;
            newscale2 = newscale2 * bxn[3];
  
            const matrix = 'matrix(' +  newscale1 + ', ' + bxn[1] + ', ' + bxn[2] + ', ' + newscale2 + ', ' + bxn[4] +', ' + 500 +')';
            const scale = 'scale(' + bxn[0] + ')';
            p[index].removeAttribute("transform");
            p[index].setAttribute("transform", matrix);
  
            if (p[index].id === '') {
              p[index].setAttribute("id", "child-" + index);
            }
            const h = originalsize.width; // * newscale1;
            const w = originalsize.height; // * newscale1;
  
            // console.log(originalsize);
            const normalizedPath = normalize({
              viewBox: '0 0 ' + h + ' ' + h,
              //viewBox: '0 0 500 500',
              path: p[index].attributes['d'].value,//'M150.883 169.12c11.06-.887 20.275-7.079 24.422-17.256',
              min: 0,
              max: 500 * (1+ newscale1),
              asList: false
            })
  
            p[index].setAttribute("d", normalizedPath);
          }

     

        }
        //console.log(idto);
        resolve();
      }
    });
  }


  async renumberSvgIds(svgstring, idx, pathidar) {
    // string startin with id="path14" id vect id + indexnr 
    let newsvgstring = svgstring;
    let index = 0;
    //let final;

    for (const element of pathidar) {
      let ind = index + 1;
      let newid = 'id="' + idx + ind + '"';
      newsvgstring = await this.runloop(newsvgstring, element, newid);
      ++index;
    };
    //console.log(newsvgstring);
    return newsvgstring;
  }

  async runloop(newsvgstring, element, newid) {
    newsvgstring = newsvgstring.replace(element, newid);
    return newsvgstring
  }




  deleteMetaSvg(svgstring) {
    return new Promise((resolve, reject) => {
      let n = svgstring.indexOf('<metadata');
      let lx = svgstring.indexOf('</metadata>'); //<defs
      let l = lx + 11;
      if (n !== -1){
        svgstring = svgstring.replace(svgstring.substring(n, l), '');
      }
    

      n = svgstring.indexOf('<defs');
      lx = svgstring.indexOf('</defs>'); //<defs
      l = lx + 7;
      if (n !== -1){
        svgstring = svgstring.replace(svgstring.substring(n, l), '');
      }


      n = svgstring.indexOf('<path');
      lx = svgstring.indexOf('</path>'); //<defs
      l = lx + 7;
      if (n !== -1){
        svgstring = svgstring.replace(svgstring.substring(n, l), '');
      }


      resolve(svgstring)
    })
  }


  deleteVectorGroup(idx) {
    return new Promise((resolve, reject) => {
      // this works don't ask why
      let idto = document.getElementById(idx);
      var viewBox = idto.getAttribute('viewBox');

      let g;
      let p = idto.getElementsByTagName("path");
      //console.log(p);
      for (let index = 0; index < p.length; index++) {
        if (p[index].id === '') {
          p[index].setAttribute("id", "child-" + index);
        }
      }

      g = idto.getElementsByTagName("g");
      //console.log(g);
      for (let index = 0; index < g.length; index++) {
        //g[index].setAttribute('transform', 'matrix(' + matrix + ')');
        let groupElement

        if (g[index].id === '') {
          g[index].setAttribute("id", "child-" + index);
          let sg = "child-" + index;
          groupElement = SVG.get(sg);
          //console.log('found g id', groupElement);
          groupElement.ungroup(groupElement.parent());
        } else {
          let sg = g[0].id;
          groupElement = SVG.get(sg);
          //console.log('found g id', groupElement);
          groupElement.ungroup(groupElement.parent());
        }
      }
      resolve(viewBox);
    });
  }

}