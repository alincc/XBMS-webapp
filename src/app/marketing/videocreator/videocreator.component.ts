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
import { MatSnackBar, AnimationDurations } from '@angular/material';
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

export class vectoranimationtype {
  svganimationtype: string;
  drawcolor: string;
  linethickness: string;
  repeat: number;
  yoyo: boolean;
  fillright: string;
  fillleft: string;
  drawright: string;
  drawleft: string;
  start_time: number; //delay
  end_time: number;
  duration: number;
  hideimage: boolean;
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
    'stroke-width': string;
    stroke: string;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: number;
  animation: animationtype[];
  vectors: vectorelement[];
  vectoranimation: vectoranimationtype[];
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
  public counter = 60;
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

  private setreplay = false;

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

        if (elm.type === 'vector') { //vector animation
          setTimeout(() => {
            // add vector efffects
            elm.vectoranimation.forEach(vecani => {
              if (vecani.svganimationtype === 'draw') { this.drawVector(elm, vecani) }
              if (vecani.svganimationtype === 'morph') { this.createMorph(elm, vecani) }
            });
          }, 300) // mininmum needed for dom to process
        }
        this.addEffect(elm); //normal animatoin

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
      duration: 2.5,
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

  copyEffect(i) {
    const curan = this.selectedelement.animation[i];
    let neweffect: animationtype = {
      start_time: curan.start_time, //delayt
      end_time: curan.end_time,
      anim_type: curan.anim_type,
      duration: curan.duration,
      ease: '',
      posx: curan.posx,
      posy: curan.posy,
      rotationcycle: curan.rotationcycle,
      travellocX: curan.travellocX,
      travellocY: curan.travellocY,
      scalesize: curan.scalesize,
      skewY: curan.skewY,
      skewX: curan.skewY
    };
    this.selectedelement.animation.push(neweffect);
  }

  copyElement(i, element) {
    if (element.type === 'image') { }
    if (element.type === 'text') { }
    if (element.type === 'shape') { }
    if (element.type === 'vector') { }
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
    }, 300);
  }

  drawVector(vector, animation: vectoranimationtype) {
    return new Promise(async (resolve, reject) => {
      //console.log(vector, animation)
      // vector.style.stroke = animation.drawcolor;
      // vector.style['stroke-width'] = animation.linethickness;
      //vector.style['opacity'] = 0;
      let list = vector.vectors[0].pathids;
      // let fromvac = document.getElementById(list[3]);
      // this.setDrawAni(fromvac, 1);

      for (const pathid of list) {
        //console.log(pathid);
        let fromvac = document.getElementById(pathid);
        //console.log(fromvac);
        //await 
        this.setDrawAni(fromvac, animation);
      }
      resolve();
    });
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

  onMovingAnimationEl(event, i, animation) {
    console.log(event, i, animation);
    animation.start_time = event.x / 10;
    // html (movingOffset)="onMovingAnimationEl($event, i, animation)"
    //  [style.left]="animation.start_time * 10 + 'px'"
  }

  onResizeAnimationEl(event, i, animation) {
    console.log(event, i, animation);
    animation.duration = event.size.width / 10;
    // html (movingOffset)="onMovingAnimationEl($event, i, animation)"
  }

  onMovingTimeline(event, i) {
    // console.log(i); 
    this.currenttime = event.x / 10;
    // console.log(this.currenttime); 
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
      duration: 2.5,
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
    let vectanim: vectoranimationtype[] = [{
      svganimationtype: 'draw',
      drawcolor: 'red',
      linethickness: '5px',
      repeat: 0,
      yoyo: false,
      fillright: '100%',
      fillleft: '0%',
      drawright: '0%',
      drawleft: '0%',
      start_time: 0, //delayt
      end_time: 10,
      duration: 2.5,
      hideimage: false
    }]
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
        opacity: 1,
        'stroke-width': '',
        stroke: ''
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      animation: [],
      id: newelnr,
      vectors: vectors,
      svgcombi: '',
      vectoranimation: vectanim,
      // from, 4, {drawSVG:0, repeat:10, yoyo:true}, 4)

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
      duration: 2.5,
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
      duration: 2.5,
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
      duration: 2.5,
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
      this.primairytimeline.play(this.currenttime);
      clearTimeout(this.t); //to make sure there is no second loop
      this.t = setInterval(() => { this.incrementSeconds() }, 100);
    }, 300);
  }

  stopFunc() {
    console.log('stop')
    //clearTimeout(this.t);

    if (this.t) {
      clearTimeout(this.t);
      this.t = null;
    }

    this.currenttime = 0;
    this.primairytimeline.pause();
    this.primairytimeline.progress(0);
    this.primairytimeline.timeScale(1);
    if (this.canvas.videourl) {
      this.videoPlayer.pause();
      this.videoPlayer.currentTime = 0;
    }

    // console.log(this.currenttime);
    this.detectchange();
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
    clearTimeout(this.t);
  }

  setReplay() {
    if (this.setreplay === true) {
      this.setreplay = false;
    } else {
      this.setreplay = true;
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
    this.currenttime = this.currenttime + 0.1;
    // console.log(this.currenttime, this.t);
    if (this.currenttime >= this.counter) {
      if (this.setreplay === false) {
        this.pauseFunc();
      } else {
        this.currenttime = 0;
        this.playFunc()
      }
    }
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

  addNewVectorAnimation(i, element: vectoranimation) {
    let vectanim: vectoranimationtype[] = [{
      svganimationtype: 'draw',
      drawcolor: 'red',
      linethickness: '5px',
      repeat: 0,
      yoyo: false,
      fillright: '100%',
      fillleft: '0%',
      drawright: '0%',
      drawleft: '0%',
      start_time: 0, //delayt
      end_time: 10,
      duration: 2.5,
      hideimage: false
    }]
    this.animationarray[i].vectoranimation.push(vectanim);
  }

  deleteVectorSrc(idx, element) {
    this.selectedelement.vectors.splice(idx, 1);
    this.combineSVGs(element);
  }

  async combineSVGs(element) {
    return new Promise(async (resolve, reject) => {
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
        //console.log(vectstring);
        let pathidar;
        let newvectstring;
        pathidar = vectstring.match(/id="(.*?)"/g); //get ids
        newvectstring = await this.grabPaths(vectstring, pathidar);
        pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
        //console.log( newvectstring);
        newvectstring = await this.renumberSvgIds(newvectstring, vect.idx, pathidar); // set ids
        pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
        //console.log( newvectstring);
        pathidar = await this.cleantags(pathidar);
        //console.log(pathidar);
        element.vectors[index].pathids = pathidar;
        total.push(newvectstring);
        ++index;
      }
      total.push('</svg>');
      let childrenst = total.join('');
      //console.log(childrenst);
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



  async createMorph(element: vectoranimation, animation: animationtype) {
    // create vector animation foreach path vector 1 to 2, 2 to 3 etc..
    // add appear and dissapear effect for if the paths are uneven 

    let vectors: vectorelement[];
    vectors = element.vectors;

    let i1 = 0;
    let i2 = 0;
    let set2 = 1;
    console.log(vectors);
    for (const vector of vectors) {
      if (i1 < vectors.length) {

        // for if there paths in vector 1 then 2 
        if (vectors[set2].pathids.length > vector.pathids.length) {
          let exti = 0
          for (const extrvect of vectors[set2].pathids) {
            if (exti > vector.pathids.length - 1) {
              let aniset;
              let fromexvac = document.getElementById(extrvect);
              console.log(fromexvac, extrvect)
              aniset = { autoAlpha: 0 };

              let style = fromexvac.getAttribute("style"); //style="fill:#7a7b7c;fill-opacity:1;fill-rule:nonzero;stroke:none"
              console.log(style);
              if (style) {
                style = style + ';opacity:0';
                fromexvac.setAttribute("style", style);
              } else {
                fromexvac.setAttribute("style", 'opacity:0');
              }
              // let fromset = { 'fill-opacity': 0 };
              // let toset = { 'fill-opacity': 1 };
              // this.primairytimeline.fromTo(fromexvac, animation.duration, fromset, toset, animation.start_time);
            }
            ++exti
          }
        }

        for (const pathid of vector.pathids) {

          // if there more parths in vector 2 then 1
          if (i2 >= vectors[set2].pathids.length) {
            let aniset

            let fromvac = document.getElementById(pathid);
            console.log(fromvac);
            aniset = { 'fill-opacity': 0 };
            this.primairytimeline.to(fromvac, animation.duration, aniset, animation.start_time);
          } else {

            let fromvac = document.getElementById(pathid);
            let pathid2 = vectors[set2].pathids[i2];
            let tovec = document.getElementById(pathid2);

           // if (i1 > 0) {
              //tovec.style.display = "none"; // hide element is not first vector
              let style = tovec.getAttribute("style"); //style="fill:#7a7b7c;fill-opacity:1;fill-rule:nonzero;stroke:none"
              console.log(style);
              if (style) {
                style = style + ';display:none';
                tovec.setAttribute("style", style);
              } else {
                tovec.setAttribute(style, 'display:none');
              }
              // let fromset = { autoAlpha: 0 };
              // let fromset = { display: 'none' };
              //this.primairytimeline.from(fromvac, animation.duration, fromset, 1)
            //}
            // if (i2 === 0) {
            //   this.primairytimeline.to(fromvac, animation.duration, { morphSVG: tovec }, animation.start_time)
            // }
            console.log(fromvac, tovec);
            await this.setMorphAni(fromvac, tovec, animation);
          }
          ++i2;
        }
      }

      ++i1;
      ++set2;
    }
  }



  // tl.staggerFromTo(shapes, 1, {drawSVG:"100%"}, {drawSVG:"50% 50%"}, 0.1)
  // .fromTo(shapes, 0.1, {drawSVG:"0%"}, {drawSVG:"10%", immediateRender:false}, "+=0.1")
  // .staggerTo(shapes, 1, {drawSVG:"90% 100%"}, 0.5)
  // .to(shapes, 1, {rotation:360, scale:0.5, drawSVG:"100%", stroke:"white", strokeWidth:6, transformOrigin:"50% 50%"})
  // .staggerTo(shapes, 0.5, {stroke:"red", scale:1.5, opacity:0}, 0.2)

  setDrawAni(from, animation: vectoranimationtype) {
    // fillright: '100%',
    // fillleft: '0%',
    // drawright: '100%',
    // drawleft: '0%',
    let animationdrawto = animation.fillleft + ' ' + animation.fillright;
    let animationdrawfrom = animation.drawleft + ' ' + animation.drawright;
    let hideelement = 0;

    if (animation.hideimage === true) {
      hideelement = 0;
    } else { hideelement = 1 }

    let fromset =
    {
      drawSVG: animationdrawfrom,
      repeat: animation.repeat,
      stroke: animation.drawcolor,
      strokeWidth: animation.linethickness,
      'fill-opacity': hideelement
      //yoyo: animation.yoyo
    };

    let toset =
    {
      drawSVG: animationdrawto,
      // delay: animation.start_time
    };

    this.primairytimeline.fromTo(from, animation.duration, fromset, toset, animation.start_time);
    // this.primairytimeline.to(from, animation.duration, 
    // {rotation:360, scale:0.5, drawSVG:"100%", 
    // stroke:"white", strokeWidth:6, transformOrigin:"50% 50%"})
    return
  }

  svgDeleteBackground(element, idx) {
    //console.log(element, idx)
    let newsvgs;
    let pathid = element.vectors[idx].pathids[0];
    element.vectors[idx].pathids.splice(0, 1);
    let svgstring = element.svgcombi.changingThisBreaksApplicationSecurity;
    let n, l;
    let nstring = '<path id="' + pathid;
    n = svgstring.indexOf(nstring)
    l = svgstring.indexOf('</path>', n)
    l = l + 7;
    // console.log(l, n )
    if (n !== -1) {
      let x = svgstring.substring(n, l);
      newsvgs = svgstring.replace(x, '');
      element.svgcombi = this.sanitizer.bypassSecurityTrustHtml(newsvgs);
      //console.log('BG deleted', newsvgs, element);
    } else { console.log('bg not found') }


  }

  // setSvgOpacity(element) {
  //   console.log('opacity', element);
  //   if (element.hideimage === false ){
  //     element.hideimage = true;
  //   } else {element.hideimage = false}
  //   let svgstring = element.svgcombi.changingThisBreaksApplicationSecurity;
  //   if (element.hideimage === true) {
  //     let newstring = svgstring.replace(/fill-opacity: 0/g, 'fill-opacity: 1');
  //     newstring = newstring.replace(/fill-opacity:0/g, 'fill-opacity:1');
  //     element.svgcombi = this.sanitizer.bypassSecurityTrustHtml(newstring);
  //   } 
  //   if (element.hideimage === false) {
  //     let newstring = svgstring.replace(/fill-opacity: 1/g, 'fill-opacity: 0');
  //     newstring = newstring.replace(/fill-opacity:1/g, 'fill-opacity:0');
  //     element.svgcombi = this.sanitizer.bypassSecurityTrustHtml(newstring);
  //   }
  // }

  async setMorphAni(from, to, animation: animationtype) {
    console.log(from, to, animation);

    let fromset = {
      
    }

    let toset = {
      morphSVG: {
        shape: to,
        type: "rotational",
        origin: "20% 60%"
      },
      ease: Power1.easeInOut
    };

    // this.primairytimeline.fromTo(from, animation.duration, toset, animation.start_time);
    this.primairytimeline.to(from, animation.duration, { morphSVG: to }, animation.start_time);
    // this.primairytimeline.to(to, animation.duration, {opacity}, animation.start_time);
    return
  }

  async normalizepath(idx, originalsize) {
    return new Promise((resolve, reject) => {
      // example originalsize = {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
      let idto = document.getElementById(idx);
      let p = idto.getElementsByTagName("path");
      //console.log(p);
      let bxn
      for (let index = 0; index < p.length; index++) {
        let idto2 = document.getElementById(p[index].id);
        //console.log(idto2);
        let transf = p[index].getAttribute("transform");
        //let transf = window.getComputedStyle(p[index]).transform;
        //console.log(transf);
        if (transf !== null) {
          //transf = transf.toString(); //.replace('matrix(');
          //console.log(transf);
          transf = transf.replace('matrix(', '');
          transf = transf.replace(')', '');
          bxn = transf.split(',');
          //console.log(bxn);
          if (bxn[0] !== '1' || bxn[0] === undefined) {

            let topangle;

            if (originalsize.width > originalsize.height) {
              topangle = 500 / originalsize.width
            } else {
              topangle = 500 / originalsize.height
            }

            // let newscale1 = originalsize.width - 500;
            let newscale1 = 500 / originalsize.width;
            newscale1 = newscale1 * bxn[0];
            // let newscale2 = originalsize.width - 500;
            let newscale2 = 500 / originalsize.width;
            newscale2 = newscale2 * bxn[3];

            const matrix = 'matrix(' + newscale1 + ',' + bxn[1] + ',' + bxn[2] + ',' + newscale2 + ',' + bxn[4] + ',' + 500
              + ')';
            const scale = 'scale(' + bxn[0] + ')';
            //p[index].removeAttribute("transform");
            p[index].setAttribute("transform", matrix);

            if (p[index].id === '') {
              p[index].setAttribute("id", "child-" + index);
            }
            const h = originalsize.width; // * newscale1;
            const w = originalsize.height; // * newscale1;
            //console.log(p[index].attributes['d'].value);
            const normalizedPath = normalize({
              //viewBox: '0 0 ' + w + ' ' + h,
              viewBox: '0 0 500 500',
              path: p[index].attributes['d'].value,//'M150.883 169.12c11.06-.887 20.275-7.079 24.422-17.256',
              min: 0,
              max: 500, // * (1 + newscale1),
              asList: false
            })
            p[index].setAttribute("d", normalizedPath);
          }
        }
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

  grabPaths(svgstring, pathidar) {
    return new Promise((resolve, reject) => {
      let svgarray = [];
      for (const element of pathidar) {
        let n = svgstring.indexOf('<path ');
        let lx = svgstring.indexOf('</path>'); //<defs
        let l = lx + 7;
        if (n !== -1) {
          svgarray.push(svgstring.substring(n, l));
          svgstring = svgstring.replace(svgstring.substring(n, l), '');
          //console.log(n, l);
        }
      }
      //console.log(svgarray, svgstring);
      svgstring = svgarray.join('');
      resolve(svgstring)
    });
  }



  deleteMetaSvg(svgstring) {
    return new Promise((resolve, reject) => {
      let n = svgstring.indexOf('<metadata');
      let lx = svgstring.indexOf('</metadata>'); //<defs
      let l = lx + 11;
      if (n !== -1) {
        svgstring = svgstring.replace(svgstring.substring(n, l), '');
      }

      // "stroke: none;"
      svgstring = svgstring.replace(/stroke:none/g, '');
      svgstring = svgstring.replace(/stroke: none/g, '');

      n = svgstring.indexOf('<defs');
      lx = svgstring.indexOf('</defs>'); //<defs
      l = lx + 7;
      if (n !== -1) {
        svgstring = svgstring.replace(svgstring.substring(n, l), '');
      }

      resolve(svgstring)
    })
  }


  deleteVectorGroup(idx) {
    return new Promise(async (resolve, reject) => {
      // this works don't ask why
      let groupElement;
      let idto = document.getElementById(idx);
      let g;
      g = idto.getElementsByTagName("g");
      for (let index = 0; index < g.length; index++) {  // ---> g.length
        g[index].setAttribute("id", idx + index + 'g');
        let sg = idx + index + 'g';
        groupElement = SVG.get(sg);
        if (typeof groupElement.ungroup === "function") {
          //console.log('found g id', groupElement);
          groupElement.ungroup(groupElement.parent());
        }
      }

      let p;
      p = idto.getElementsByTagName("path");
      for (let index = 0; index < p.length; index++) {
        p[index].setAttribute("id", "child-" + index);
      }
      resolve();
    });
  }

  onshowemoji(i) {
    if (this.showemoji) { this.showemoji = false } else {
      this.showemoji = true;
    }
  }

  setemoji(event, i, element) {
    const bufStr = String.fromCodePoint(parseInt(event.emoji.unified, 16));
    element.content = element.content + bufStr;
    this.onshowemoji(i)

  }

}