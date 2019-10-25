import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TimelineMax, TweenLite, Power0 } from 'gsap';
import * as MorphSVGPlugin from '../../../assets/js/MorphSVGPlugin';
import * as DrawSVGPlugin from '../../../assets/js/DrawSVGPlugin';
import * as SplitText from '../../../assets/js/SplitText';
import * as physicsProps from '../../../assets/js/PhysicsPropsPlugin'
import * as physics2D from '../../../assets/js/Physics2DPlugin'
import { TimelineLite, Back, Power1, SlowMo, Elastic, Bounce, Circ, Sine, Power3 } from 'gsap';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar, AnimationDurations } from '@angular/material';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as normalize from 'normalize-svg-coords';
const plugins = [DrawSVGPlugin, MorphSVGPlugin, SplitText, physics2D]; //needed for GSAP 
import { CanvasWhiteboardComponent } from 'ng2-canvas-whiteboard';
import { fonts } from '../../shared/listsgeneral/fonts';

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
  easetype: any;
  fromto: string;
  transformOriginX: string;
  transformOriginY: string;
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
  easetype: any;
  fromto: string;
}

export class splittexttype {
  textanimationtype: string;
  repeat: number;
  start_time: number; //delay
  end_time: number;
  duration: number;
  x: number;
  y: number;
  fromto: string;
  easetype: any;
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
  id: string;
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
  id: string;
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
  easetype: any;
  fromto: string;
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
  id: string;
  animation: animationtype[];
}

export class whiteboardanimation {
  type: 'whiteboard';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: string;
    'background-color': string;
    opacity: 1;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: string;
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
    padding: string;
    opacity: 1;
  }
  posx: number;
  posy: number;
  setpos: object;
  id: string;
  splittextanimation: splittexttype[];
  animation: animationtype[];
}

@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss'],
  viewProviders: [CanvasWhiteboardComponent]
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

  public whiteboard = false;
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
    'background-image': '',
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

  public Fonts = fonts;
  watcher: Subscription;
  activeMediaQuery;
  public selectedelement;
  public elementname;
  private MorphSVGPlugin = MorphSVGPlugin;
  private SplitText = SplitText;
  private largesthbox;
  private largestwbox;
  public setreplay = false;
  //this.webkitspeech.onresult = ($event) => { this.onresult($event) };

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
  private myFuncSvg = this.initVectors.bind(this);

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
    console.log('run check', this.animationarray);
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
        if (elm.type === 'text') {
          setTimeout(() => {
            elm.splittextanimation.forEach((textani: splittexttype) => {
              if (textani.textanimationtype) { this.createSplitText(elm, textani) }
            });
          }, 300) // mininmum needed for dom to process
        }
        this.addEffect(elm); //normal animatoin
      })
    );
  }

  createSplitText(elm: textanimation, textani: splittexttype) {

    let splittextwhere = textani.textanimationtype;
    let id = document.getElementById(elm.id);
    let splitText = new SplitText.SplitText(id, { type: textani.textanimationtype })
    let toset = {
      y: 100,
      autoAlpha: 0
    }

    let char = splitText.chars;
    let word = splitText.words;
    let line = splitText.lines;

    let setto;
    let lenghtarr;
    if (textani.textanimationtype === 'chars') { setto = char; lenghtarr = char.length }
    if (textani.textanimationtype === 'words') { setto = word; lenghtarr = word.length }
    if (textani.textanimationtype === 'lines') { setto = line; lenghtarr = line.length }

    let dura = textani.duration / lenghtarr;
    // stagger durationis for each stag (word line character etc.. )
    // this.primairytimeline.to(splitText.chars, textani.duration, toset, textani.start_time);
    //this.primairytimeline.staggerTo(setto, 1, { opacity:0, cycle:{ y:[20, -20], rotationX:[-90, 90]} }, 0.01, "erase+=1.5");

    //{physicsProps:{
    //  x:{velocity:100, acceleration:200},
    //  y:{velocity:-200, friction:0.1}

    //{physics2D:{
    //  velocity:300, angle:-60, acceleration:50, accelerationAngle:18}}

    let ease = this.selectEaseType(textani.easetype);

    if (textani.fromto === 'from') {
      this.primairytimeline.staggerFrom(setto, textani.duration, { x: textani.y, y: textani.x, autoAlpha: 0, ease: ease }, 0.1, textani.start_time)
    }
    if (textani.fromto === 'to') {
      this.primairytimeline.staggerTo(setto, textani.duration, { x: textani.y, y: textani.x, autoAlpha: 0, ease: ease }, 0.1, textani.start_time)
    }

  }

  selectEaseType(type) {
    let ease;
    switch (type) {
      case 'bounce':
        ease = Bounce.easeOut;
        break;
      case 'elastic':
        ease = Elastic.easeOut.config(1, 0.3)
        break;
      case 'circle':
        ease = Circ.easeOut
        break;
      case 'sine':
        ease = Sine.easeOut
        break;
      case 'over':
        ease = Back.easeOut.config(1.7)
        break;
      case 'linear':
        ease = Power3.easeOut
        break;
      case 'easy':
        ease = Power0.easeOut
        break;
      case 'slowmotion':
        ease = SlowMo.ease.config(0.7, 0.7, false)
      default:
        ease = Bounce.easeOut;
    }
    return ease
  }

  onchangevideo() {
    if (this.canvas.videourl) { this.canvas['background-color'] = 'transparent' }
    this.changevideo = false;
    setTimeout(() => this.changevideo = true);
  }

  addAnimation(iset, element: animationtype) {
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

    let ease = this.selectEaseType(element.easetype);
    if (anitype === 'rotation') {
      let orgin = element.transformOriginX + ' ' + element.transformOriginY
      aniset = { rotation: rotationcycle, ease: ease, transformOrigin: orgin }
    }
    if (anitype === 'translate') {
      aniset = { rotation: '30', ease: ease }
    }
    if (anitype === 'scale') {
      aniset = { scale: scalesize, ease: ease }
    }
    if (anitype === 'appear') {
      this.selectedelement.style.opacity = 0;
      aniset = { opacity: 1 };
    }
    if (anitype === 'disappear') {
      aniset = { opacity: 0 }, { opacity: 1 };
    }
    if (anitype === 'move') {
      aniset = { y: element.travellocY, x: element.travellocX, ease: ease }
    }
    if (anitype === 'skew') {
      aniset = { skewY: skewY, skewX: skewX, ease: ease }
    }
    if (anitype === 'fountain') {
      //let dots = this.primairytimeline;
      var dots = new TimelineLite()
      let qty = 80;
      let duration = 2.5;
      let colors = ["#91e600", "#84d100", "#73b403", "#528003"];

      for (let i = 0; i < qty; i++) {
        let cln = iset.cloneNode(true);
        console.log(cln);
        let parent = iset.parentElement;
        parent.append(cln);
        //let color = colors[(Math.random() * colors.length) | 0];
        let delay = Math.random() * duration;
        if (element.fromto === 'from') {
          this.primairytimeline.from(cln, duration, { physics2D: { velocity: Math.random() * 400 + 150, angle: Math.random() * 40 + 250, gravity: 500 } }, delay);
        }
        if (element.fromto === 'to') {
          this.primairytimeline.to(cln, duration, { physics2D: { velocity: Math.random() * 400 + 150, angle: Math.random() * 40 + 250, gravity: 500 } }, delay);
        }

      }
    }


    if (anitype !== 'fountain') {

      if (element.fromto === 'from') {
        this.primairytimeline.from(iset, duration, aniset, startime);
      }

      if (element.fromto === 'to') {
        this.primairytimeline.to(iset, duration, aniset, startime);
      }
    }

  }


  addEffect(element): void {
    let id = document.getElementById(element.id);
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
      skewX: 50,
      easetype: 'bounce',
      fromto: 'from',
      transformOriginX: '50%',
      transformOriginY: '200px'
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
    let neweffect = JSON.parse(JSON.stringify(curan));
    this.selectedelement.animation.push(neweffect);
  }

  copyElement(i, element) {
    const curel = element;
    let newElement = JSON.parse(JSON.stringify(curel));
    this.animationarray.push(newElement);
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
    console.log(event, i, idx);
    this.animationarray[i].vectors[idx].src = event;
    let vect = this.animationarray[i].vectors[idx].idx;
  }

  initVectors(e, i, idx, vectorid) {
    return new Promise(async (resolve, reject) => {
      console.log('set vectors', e, i, idx, vectorid);
      let vect = this.animationarray[i].vectors[idx].idx;
      let originalsize; // {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
      await this.deleteVectorGroup(e);
      originalsize = await this.getViewBox(e);
      await this.normalizepath(e, originalsize);
      await this.combineSVGs(this.animationarray[i]);
      resolve();
    })
  }


  drawVector(vector, animation: vectoranimationtype) {
    return new Promise(async (resolve, reject) => {
      let list = vector.vectors[0].pathids;
      for (const pathid of list) {
        let fromvac = document.getElementById(pathid);
        this.setDrawAni(fromvac, animation);
      }
      resolve();
    });
  }


  getViewBox(vect) {
    return new Promise((resolve, reject) => {
      console.log('get/set viewbox')
      // let set = vect;//document.getElementById(vect);
      let doc = vect; // set.getElementsByTagName('svg');
      if (doc !== undefined) {
        if (doc.id === undefined) {

        }
        doc.setAttribute("id", '3knrk2l');
        let element = SVG.get(doc.id);
        console.log(element);
        //element.draggable()
        var box = element.viewbox();
        if (box === undefined) {
          box.viewbox(0, 0, 500, 500)
        }

        //console.log(element.rbox());
        //element.viewbox(bbox.x, bbox.y, bbox.width, bbox.height);

        console.log(box);
        resolve(box);
      } else {
        resolve();
      }

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

  addNewVector(src?, height?, width?, svgcombi?, posx?, posy?): void {
    let svgc = this.sanitizer.bypassSecurityTrustHtml('');
    if (svgcombi) { svgc = this.sanitizer.bypassSecurityTrustHtml(svgcombi) }
    let newsrc = '';
    let newheight = 'auto';
    let newwidth = 'auto';
    let posxset = 0;
    let posyset = 0;
    let vectanim = [];
    if (posx) { posyset = posy };
    if (posy) { posxset = posx };
    if (src) { newsrc = src };
    if (height) { newheight = height };
    if (width) { newwidth = width };
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
      anim_type: '',
      duration: 2.5,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 30,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.5,
      skewY: 50,
      skewX: 50,
      easetype: '',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '200px'
    }];
    // only add if new svg not split from 
    if (!svgcombi) {
      vectanim = [{
        svganimationtype: '',
        drawcolor: 'blue',
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
        hideimage: false,
        easetype: 'linear',
        fromto: 'to'
      }]
    }
    // do not add animation from beginning with morph SVG's 
    let vectors: vectorelement[] = [{
      src: newsrc,
      idx: vectorid,
      duration: 1,
      start_time: undefined,
      pathids: [],
      easetype: 'bounce',
      fromto: 'to'
    }]
    let vector: vectoranimation = {
      type: 'vector',
      style: {
        'z-index': this.newz,
        width: newwidth,
        height: newheight,
        position: 'absolute',
        opacity: 1,
        'stroke-width': '',
        stroke: ''
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: posxset,
      posy: posyset,
      setpos: { 'x': 0, 'y': 0 },
      animation: [],
      id: newelnr,
      vectors: vectors,
      svgcombi: svgc,
      vectoranimation: vectanim,
      // from, 4, {drawSVG:0, repeat:10, yoyo:true}, 4)
    }
    //console.log(vector);
    this.animationarray.push(vector);
    if (!svgcombi) {
      this.detectchange();
    } else {

    }

  }

  addVectorAnimation(element: vectoranimation){
    let vectanim = [{
      svganimationtype: '',
      drawcolor: 'blue',
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
      hideimage: false,
      easetype: 'linear',
      fromto: 'to'
    }]
    element.vectoranimation = vectanim;
  }

  deleteVectorAnimation(iv) {
    this.selectedelement.vectoranimation.splice(iv, 1);
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
      skewX: 50,
      easetype: Bounce.easeOut,
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '200px'
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
      setpos: { 'x': 0, 'y': 0 },
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
      skewX: 50,
      easetype: 'bounce',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '200px'
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
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr
    }
    this.animationarray.push(img);
    this.detectchange();
    //this.addAnimation(newelnr, img);
  }

  addNewWhiteboard(): void {
   
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
      skewX: 50,
      easetype: 'bounce',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '200px'
    }];
    let whiteboard: whiteboardanimation = {
      type: 'whiteboard',
      style: {
        'z-index': 100,
        width: this.canvas.width,
        height: this.canvas.height,
        position: '',
        'background-color': '',
        opacity: 1
      },
      src: '',
      posx: 0,
      posy: 0,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr
    }
    if (this.whiteboard === false){
      this.animationarray.push(whiteboard);
      this.whiteboard = true;
    }
  
    this.detectchange();
    setTimeout(() => {
      let wb = document.getElementById(newelnr);
      // let cv = wb.getElementsByClassName('canvas');
      let cv1 = wb.getElementsByClassName('canvas_whiteboard');
      let cv2 = wb.getElementsByClassName('incomplete_shapes_canvas_whiteboard');
      cv1[0].setAttribute('width', this.canvas.width);
      cv1[0].setAttribute('height', this.canvas.height);
      cv2[0].setAttribute('width', this.canvas.width);
      cv2[0].setAttribute('height', this.canvas.height);
      // for (let index = 0; index < cv.length; index++) {
      // cv[index].setAttribute('width', this.canvas.width);
      // cv[index].setAttribute('height', this.canvas.height);
      // // by class canvas_whiteboard incomplete_shapes_canvas_whiteboard
      // }
      
    }, 300) // mininmum needed for dom to process
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
      skewX: 50,
      easetype: 'bounce',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '200px'
    }];
    let splittext: splittexttype[] = [{
      textanimationtype: '',
      repeat: 0,
      start_time: 0, //delay
      end_time: 10,
      duration: 2.5,
      x: 0,
      y: 100,
      fromto: 'from',
      easetype: 'bounce'
    }]
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
        opacity: 1,
        padding: '15px' //neccarry to get all fonts
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      posy: 50,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      splittextanimation: splittext
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
    // this.detectchange();
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
    // this.detectchange();
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
    this.animationarray = this.editablevideo.template;
    this.canvas = this.editablevideo.canvas[0];
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
    this.canvas.videourl = event;
    this.onchangevideo();
  }

  setBackground(event) {
    this.canvas['background-image'] = 'url(' + event + ')';
  }

  handleSVG(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', parent.style.width);
    svg.setAttribute('height', parent.style.height);
    return svg;
  }

  previewSVG(svg: SVGElement, parent): SVGElement {
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    //svg.setAttribute('viewBox', '0 0 500 500');
    return svg;
  }

  previewSVGBig(svg: SVGElement, parent): SVGElement {
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    //svg.setAttribute('viewBox', '0 0 500 500');
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
      pathids: [],
      easetype: 'bounce',
      fromto: 'to'
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
      hideimage: false,
      easetype: 'linear',
      fromto: 'to'
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
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">';
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

    for (const vector of vectors) {
      if (i1 < vectors.length - 1) {
        let fintime = animation.start_time + animation.duration;
        let set2length = vectors[set2].pathids.length;

        for (const pathid of vector.pathids) {
          let fromvac = document.getElementById(pathid);

          if (i2 >= set2length) {  // if there more parths in vector 2 then 1
            this.primairytimeline.to(fromvac, 1, { opacity: 0 }, animation.start_time);
          } else {

            let pathid2 = vectors[set2].pathids[i2];
            let tovec = document.getElementById(pathid2); //get element
            // hidden is needed for the morph animation but we also need to show the original on finish 
            // opacity can make it appear more gratually which visibility can not
            this.primairytimeline.set(tovec, { opacity: 0 }, 0);
            this.primairytimeline.to(tovec, 1, { opacity: 1 }, fintime);
            this.primairytimeline.set(tovec, { visibility: 'hidden' }, 0);
            this.primairytimeline.set(tovec, { visibility: 'visible' }, fintime);

            await this.setMorphAni(fromvac, tovec, animation);
          }
          ++i2;
        }

        if (set2length > vector.pathids.length) { // for if there paths in vector 1 then 2 
          let exti = 0
          for (const extrvect of vectors[set2].pathids) {
            if (exti > vector.pathids.length - 1) {
              let fromexvac = document.getElementById(extrvect);

              // reset connected to another path from svg 2 
              let resetindex = exti - vector.pathids.length;
              let resettovec = document.getElementById(vectors[set2].pathids[resetindex]);
              // await this.setMorphAni(fromexvac, resettovec, animation);
              this.primairytimeline.to(fromexvac, animation.duration, { morphSVG: resettovec }, animation.start_time);

              // hide the paths that are not connected to another path form svg 2 
              // this.primairytimeline.set(fromexvac, { opacity: 0 }, 0);
              // this.primairytimeline.to(fromexvac, animation.duration, { opacity: 1 }, animation.start_time);
            }
            ++exti
          }
        }


      }

      ++i1;
      ++set2;
    }
  }

  async getLargestSvgPath(vector) {
    let longestEl = document.getElementById(vector[0]);
    let longestElD = longestEl['d'].length
    for (const element of vector) {
      let el = document.getElementById(element);
      if (el['d'].length > longestEl) {
        longestEl = longestEl;
      }
    };

  }



  // tl.staggerFromTo(shapes, 1, {drawSVG:"100%"}, {drawSVG:"50% 50%"}, 0.1)
  // .fromTo(shapes, 0.1, {drawSVG:"0%"}, {drawSVG:"10%", immediateRender:false}, "+=0.1")
  // .staggerTo(shapes, 1, {drawSVG:"90% 100%"}, 0.5)
  // .to(shapes, 1, {rotation:360, scale:0.5, drawSVG:"100%", stroke:"white", strokeWidth:6, transformOrigin:"50% 50%"})
  // .staggerTo(shapes, 0.5, {stroke:"red", scale:1.5, opacity:0}, 0.2)

  setDrawAni(from, animation: vectoranimationtype) {
    let animationdrawto = animation.fillleft + ' ' + animation.fillright;
    let animationdrawfrom = animation.drawleft + ' ' + animation.drawright;
    let hideelement = 0;
    let ease = animation.easetype;

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
      ease: ease
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
    // console.log(from, to, animation);
    let ease = this.selectEaseType(animation.easetype);
    let fintime = animation.start_time + animation.duration;
    let fromset = {}
    let toset = {
      morphSVG: {
        shape: to,
        type: "rotational",
        origin: "20% 60%"
      },
      ease: ease
    };

    // this.primairytimeline.fromTo(from, animation.duration, toset, animation.start_time);
    this.primairytimeline.to(from, animation.duration, { morphSVG: to, ease: ease }, animation.start_time);
    this.primairytimeline.to(to, 1, { opacity: 1 }, fintime);
    this.primairytimeline.to(from, 1, { opacity: 0 }, fintime);
    // this.primairytimeline.to(to, animation.duration, {opacity}, animation.start_time);
    return
  }

  async normalizepath(idx, originalsize) {
    return new Promise((resolve, reject) => {
      // example originalsize = {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
      let idto = idx;
      let p = idto.getElementsByTagName("path");
      console.log(p);
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
            });
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
      let idto = idx; //document.getElementById(idx);
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

  seperatePaths(idx, vector: vectorelement, element: vectoranimation) {
    vector.pathids.forEach(pid => {
      let svgel = document.getElementById(pid);
      let s = new XMLSerializer(); // convert to string
      let svgstring = s.serializeToString(svgel);
      //console.log(svgstring);
      let newsvgarray = [
        '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"' +
        ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"' +
        ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
        svgstring, '</svg>'
      ]
      let newsvg = newsvgarray.join('');
      this.addNewVector(null, element.style.height, element.style.width, newsvg, element.posx, element.posy);
    });
    //this.deleteVectorSrc(idx, vector);
    this.detectchange();
  }


  onCanvasSave(e, i) {
    let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
    this.uploader = new FileUploader({ url: urluse });
    let name = Math.random().toString(36).substring(7) + '.png';
    let date: number = new Date().getTime();
    let data = e.replace('data:image/png;base64,', '');
    let b64Data, contentType = '', sliceSize = 512;
    b64Data = data;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    // contents must be an array of strings, each representing a line in the new file
    let file = new File([blob], name, { type: "image/png", lastModified: date });
    let fileItem = new FileItem(this.uploader, file, {});
    this.uploader.queue.push(fileItem);
    // fileItem.upload();
    this.uploader.uploadAll();

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status === 200) {
        // set download url or actual url for publishing
        let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name;
        let setimgurl = 'https://xbmsapi.eu-gb.mybluemix.net/api/Containers/' + this.option.id + '/download/' + name;
        imgurl = imgurl.replace(/ /g, '-'),
          // define the file settings
          this.newFiles.name = name,
          this.newFiles.url = setimgurl,
          this.newFiles.createdate = new Date(),
          this.newFiles.type = 'tmp',
          this.newFiles.companyId = this.Account.companyId,
          // check if container exists and create
          this.relationsApi.createFiles(this.option.id, this.newFiles)
            .subscribe(res => {
              // create SVG png
              console.log(res);
              setTimeout(() => {
                this.filesApi.converteps2svg(this.option.id, this.Account.companyId, res.url, name, true)
                  .subscribe(resp => {
                    //this.setimage(res.url) 
                    // set SVG as new element
                    this.addNewVector(resp.url, this.canvas.height, this.canvas.width);
                    // delete whiteboard
                    console.log(resp);
                    this.deleteitem(i);
                    this.whiteboard = false;
                  });
              }, 300);
            });
      }
    };
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

  resetVideo() {

  }

  newItem() {

  }

  loadEditableVideo() {

  }

}