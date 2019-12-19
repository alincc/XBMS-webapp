import { Component, OnInit, Input, SimpleChange, SimpleChanges, NgZone } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { gsap } from 'assets/js/all';
import { Physics2DPlugin, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper, Draggable } from 'assets/js/all';
gsap.registerPlugin(Physics2DPlugin, Draggable, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper);
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar, AnimationDurations } from '@angular/material';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as normalize from 'normalize-svg-coords';
const plugins = [Draggable, InertiaPlugin, DrawSVGPlugin, MorphSVGPlugin,  ScrambleTextPlugin, SplitText, Physics2DPlugin, MotionPathPlugin, MotionPathHelper]; //needed for GSAP
import { CanvasWhiteboardComponent } from 'ng2-canvas-whiteboard';
import { fonts } from '../../shared/listsgeneral/fonts';
// import * as Rematrix from 'rematrix';
// import { AST_DWLoop } from 'terser';
// import { transform } from 'regexp-tree';
import svgDragSelect from "svg-drag-select"

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
  repeat: number;
  yoyo: boolean;
  audioeffectsrc: string;
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
  // motioncor: string;
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
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
  svgcombi: string;
  selected: boolean;
  morph: boolean;
  // motioncor: string;
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

export class vectorelement {
  idx: string;
  src: string;
  duration: number;
  start_time: number;
  pathids: string[];
  easetype: any;
  fromto: string;
  scale: number;
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
    'border-radius': string;
    class: string;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: string;
  shape: string;
  animation: animationtype[];
  //motioncor: string;
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
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
  //motioncor: string;
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss'],
  viewProviders: [CanvasWhiteboardComponent]
})

export class VideocreatorComponent implements OnInit {

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
  //public animationelements = []; //arrat with the actual greensock animations
  public play = false;
  //public menu = gsap.timeline({ paused: true, reversed: true });
  public primairytimeline = gsap.timeline({ paused: true, reversed: true });
  //private progressbarline = gsap.timeline({ paused: true, reversed: true });
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
    loop: false,
    weather: '',
    audio: ''
  }
  public moveitem = false;
  public selectedImage: imageanimation;
  public showemoji = false;
  public newz = 1;
  public inBounds = true;
  public edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  public Fonts = fonts;
  private watcher: Subscription;
  public activeMediaQuery;
  public selectedelement;
  public elementname;
  private MorphSVGPlugin = MorphSVGPlugin;
  private SplitText = SplitText;
  private largesthbox;
  private largestwbox;
  public setreplay = false;
  //this.webkitspeech.onresult = ($event) => { this.onresult($event) };
  public selectedVecPath;
  public selectmultiplepaths = false;
  public selectedVecPathmultiple = [];
  public editpath = false;
  //public svgDragSelect: svgDragSelect;
  public firstvectpathcorner: {
    width: undefined,
    height: undefined
  }

  public secondvectpathcorner: {
    width: undefined,
    height: undefined
  }

  public dragselectvectpath = false;
  public standardvector;
  public dragselectiontrue = false;
  public cancelDragSelect?: () => void;
  public dragAreaOverlay;




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
  //private myFuncSvg = this.initVectors.bind(this);

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    //wait for option.id
    const currentItem: SimpleChange = changes.option;

    if (currentItem !== undefined) {
      if (currentItem.currentValue.id !== undefined) {
        this.getEditFile()
      }
    }
  }


  editMotionPath() {
    this.editpath = true;
    this.setMotionPath(this.selectedelement.id);
    let docset = document.getElementById(this.selectedelement.id);
    //let docset = document.getElementsByClassName("astronaut");
    //console.log(docset);
  }

  setMotionPath(id) {
    let time = 0;
    if (this.editpath) {
      time = 300;
    }
    setTimeout(() => {
      //let docset = document.getElementsByClassName("astronaut");
      let docset = document.getElementById(id);
      let svgset = document.getElementById(id + 'p');
      //let p = docset.getElementsByTagName("path");
      //console.log(docset, svgset);
      //this.primairytimeline.set(docset, {xPercent: -50, yPercent: -50, transformOrigin: "50% 50%", scale: 0.5, autoAlpha: 1});
      this.primairytimeline.to(docset, {
        duration: 5,
        ease: "power1.inOut",
        immediateRender: true,
        motionPath: {
          path: svgset, //'id + p'
          autoRotate: 90
        }
      }, 0);
      if (this.editpath) {
        MotionPathHelper.create(docset);
      }
    }, time);
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

  onSelectElement(element): void {
    //this.detectchange();
    if (this.selectedelement) {
      if (element !== this.selectedelement && this.editpath === false) {
        // this.saveNewMotionPath(this.selectedelement);
        this.removeVectorPathSelection();
        this.removeVectorPathMultiSelection();
        this.selectedelement = element;
      }
    } else {
      this.selectedelement = element;
    }
  }

  saveNewMotionPath() {
    let newpath;
    let svgpath = document.getElementById(this.selectedelement.id + 'p');
    let rawpath = MotionPathPlugin.getRawPath(svgpath);
    let svgtrans = svgpath.getAttribute('transform');
    //console.log(svgtrans, rawpath);

    if (svgtrans !== null && svgtrans !== 'matrix(1 0 0 1 0 0)') {
      svgtrans = svgtrans.replace('matrix(', '');
      svgtrans = svgtrans.replace(')', '');
      let svgtransarray = svgtrans.split(' ').map(Number);
      rawpath = MotionPathPlugin.transformRawPath(rawpath, svgtransarray[0], svgtransarray[1], svgtransarray[2], svgtransarray[3], svgtransarray[4], svgtransarray[5]);
    }

    if (rawpath === undefined) {
      newpath = 'M9,100 C9,100 27.53,58.42 58.91,34.89';
    } else {
      newpath = MotionPathPlugin.rawPathToString(rawpath);
      //console.log(newpath);
    }

    let newsvgpath = '<svg id="' + this.selectedelement.id + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + this.selectedelement.id + 'p" style="opacity: 0; " d="' + newpath + '" /></svg>';
    this.selectedelement.motionpath = newsvgpath;
    this.editpath = false;
    //this.detectchange();
  }

  detectMorph(value) {
    //console.log(value)
    if (value === 'morph') {
      this.selectedelement.morph = true;
    } else {
      this.selectedelement.morph = false;
      this.selectedelement.vectors.splice(1, 1);
      this.detectchange();
    }
  }

  async detectchange() {
    //this.primairytimeline.clear();
    this.primairytimeline = gsap.timeline({ paused: true, reversed: true });

    console.log('run check', this.animationarray);
    if (this.editpath === true) {
      this.saveNewMotionPath();
    }
    this.animationarray.forEach(elm => {
      if (elm.posx > 0) {
        elm.setpos = { 'x': elm.posx, 'y': elm.posy };
      }
    });
    // force dom update
    this.changenow = false;
    setTimeout(() => { this.changenow = true; return });
    // wait for dom update to finish otherwise it will create the effects on the old dom
    setTimeout(() => {

      if (this.canvas.weather !== '') {
        //console.log('add weather')
        this.addWeatherEffect();

      }
      this.animationarray.forEach(elm => {
        if (elm.type === 'vector') { //vector animation
          setTimeout(() => {
            // add vector efffects
            elm.vectoranimation.forEach(vecani => {
              if (vecani.svganimationtype === 'draw') { this.drawVector(elm, vecani) }
              if (vecani.svganimationtype === 'morph') {
                if (elm.vectors.length > 1) {
                  this.createMorph(elm, vecani)
                }
              }
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
        this.createRotate(elm);
      })
    });
  }

  createSplitText(elm: textanimation, textani: splittexttype) {

    // if (textani.textanimationtype === 'scamble'){
    //   this.primairytimeline.to(setto, {duration: 1, scrambleText: elm.content}); 
    // }

    let splittextwhere = textani.textanimationtype;
    let id = document.getElementById(elm.id);
    let splitText = new SplitText(id, { type: textani.textanimationtype })
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

    let ease = this.selectEaseType(textani.easetype);
    if (textani.fromto === 'from') {
      this.primairytimeline.from(setto, { duration: textani.duration, x: textani.y, y: textani.x, autoAlpha: 0, ease: ease, stagger: 0.1, delay: textani.start_time }, 0)
    }
    if (textani.fromto === 'to') {
      this.primairytimeline.to(setto, { duration: textani.duration, x: textani.y, y: textani.x, autoAlpha: 0, ease: ease, stagger: 0.1, delay: textani.start_time }, 0)
    }

  }

  selectEaseType(type) {
    let ease;
    switch (type) {
      case 'bounce':
        ease = 'bounce.out';
        break;
      case 'elastic':
        ease = 'elastic.out(1, 0.3)'
        break;
      case 'circle':
        ease = 'circ.out'
        break;
      case 'sine':
        ease = 'sine.out'
        break;
      case 'over':
        ease = 'back.out(1.7)'
        break;
      case 'linear':
        ease = 'power3.out'
        break;
      case 'easy':
        ease = 'power0.out'
        break;
      case 'slowmotion':
        ease = 'slow(0.7, 0.7, false)'
      default:
        ease = '';
    }
    return ease
  }

  onchangevideo() {
    if (this.canvas.videourl) { this.canvas['background-color'] = 'transparent' }
    this.changevideo = false;
    setTimeout(() => this.changevideo = true);
  }

  onchangeaudio() {
    // ??
  }

  playSound(id, src, loop) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    console.log(id, audio);
    audio.play();
    audio.loop = loop;
  }

  pauseSound(id, src) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    console.log(audio);
    audio.pause();
  }

  stopSound(id, src) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    console.log(audio);
    audio.currentTime = 0;
    audio.pause();
  }

  seekSound(id, src, time) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    audio.currentTime = time;
  }


  addAnimation(iset, element: animationtype, elementA, i) {
    let duration = element.duration;
    let starttime = element.start_time;
    let endtime = element.end_time;
    let anitype = element.anim_type;
    let rotationcycle = element.rotationcycle;
    let scalesize = element.scalesize;
    let skewY = element.skewY;
    let skewX = element.skewX;
    let aniset;

    let ease = this.selectEaseType(element.easetype);
    let repeat = element.repeat;

    if (element.audioeffectsrc !== '') {
      this.primairytimeline.call(this.playSound, [elementA.id + i + 's', element.audioeffectsrc, false], starttime);
      this.primairytimeline.call(this.stopSound, [elementA.id + i + 's', element.audioeffectsrc, false], endtime);
      this.primairytimeline.eventCallback("onInterrupt", this.pauseSound, [elementA.id + i + 's', element.audioeffectsrc]);
    }

    if (anitype === 'rotation') {
      let orgin = element.transformOriginX + ' ' + element.transformOriginY
      aniset = {
        duration: duration, rotation: rotationcycle,
        ease: ease, transformOrigin: orgin,
        repeat: repeat, yoyo: element.yoyo
      }
    }
    if (anitype === 'scale') {
      aniset = {
        duration: duration,
        scale: scalesize, ease: ease, repeat: repeat, yoyo: element.yoyo
      }
    }
    if (anitype === 'appear') {
      this.selectedelement.style.opacity = 0;
      aniset = { duration: duration, opacity: 1 };
    }
    // if (anitype === 'disappear') {
    //   aniset = { duration: duration,  opacity: 0 }, { opacity: 1 };
    // }
    if (anitype === 'move') {
      // aniset = { duration: duration,
      //   y: element.travellocY, x: element.travellocX, ease: ease, repeat: repeat, yoyo: element.yoyo }
      //this.setMotionPath(elementA.id);
      let svgset = document.getElementById(elementA.id + 'p');
      aniset = {
        duration: duration,
        ease: ease,
        repeat: repeat,
        yoyo: element.yoyo,
        motionPath: {
          path: svgset, //'id + p'
          autoRotate: elementA.motionrotation,
          //immediateRender: true
        }
      }
    }

    if (anitype === 'skew') {
      aniset = {
        duration: duration,
        skewY: skewY, skewX: skewX, ease: ease, repeat: repeat, yoyo: element.yoyo
      }
    }

    if (anitype !== 'fountain' && anitype !== 'followminions') {
      //console.log(iset, aniset, starttime);
      if (element.fromto === 'from') {
        this.primairytimeline.from(iset, aniset, starttime);
      }
      if (element.fromto === 'to') {
        this.primairytimeline.to(iset, aniset, starttime);
      }
    }

    if (anitype === 'fountain') {
      let qty = 80;
      //let colors = ["#91e600", "#84d100", "#73b403", "#528003"];
      for (let i = 0; i < qty; i++) {
        let height = parseInt(this.canvas.height, 10);
        let width = parseInt(this.canvas.width, 10);
        let distanceH = height - elementA.posy;
        let distanceW = width - elementA.posx;
        let H, W;

        if (distanceH < elementA.posy) {
          H = distanceH;
        } else {
          H = elementA.posy;
        }

        if (distanceW < elementA.posx) {
          W = distanceW;
        } else {
          W = elementA.posx;
        }
        let cln = iset.cloneNode(true);
        // console.log(cln);
        let parent = iset.parentElement;
        parent.append(cln);
        //let color = colors[(Math.random() * colors.length) | 0];
        let delay = Math.random() * duration;
        if (element.fromto === 'from') {
          this.primairytimeline.from(cln, {
            duration: duration, delay: delay, repeat: repeat, yoyo: element.yoyo,
            physics2D: { velocity: Math.random() * W, angle: Math.random() * 40 + 250, gravity: H }
          }, starttime);
        }
        if (element.fromto === 'to') {
          this.primairytimeline.to(cln, {
            duration: duration, delay: delay, repeat: repeat, yoyo: element.yoyo,
            physics2D: { velocity: Math.random() * W, angle: Math.random() * 40 + 250, gravity: H }
          }, starttime);

        }
      }
    }

    if (anitype === 'followminions') {
      let minions = 20;
      let seperation = 0.17;
      let svgset2 = document.getElementById(elementA.id + 'p');

      this.primairytimeline.to(iset,
        {
          duration: duration,
          ease: ease, repeat: repeat, yoyo: element.yoyo, delay: seperation,
          motionPath: {
            path: svgset2, //'id + p'
            autoRotate: 90,
            //immediateRender: true
          }
        }, starttime);

      for (let i = 0; i < minions; i++) {
        //start creature animation every 0.12 seconds
        let cln = iset.cloneNode(true);
        //console.log(cln);
        let parent = iset.parentElement;
        parent.append(cln);

        if (element.fromto === 'from') {
          this.primairytimeline.to(cln,
            {
              duration: duration,
              ease: ease, repeat: repeat, yoyo: element.yoyo, delay: i + 1 * 0.17,
              motionPath: {
                path: svgset2, //'id + p'
                autoRotate: 90,
                //immediateRender: true
              }
            }, starttime);
        }

        if (element.fromto === 'to') {
          this.primairytimeline.to(cln,
            {
              duration: duration,
              ease: ease, repeat: repeat, yoyo: element.yoyo, delay: i * 0.17,
              motionPath: {
                path: svgset2, //'id + p'
                autoRotate: 90,
                //immediateRender: true
              }
            }, starttime);
        }
      }
    }

  }



  addEffect(element): void {
    let id = document.getElementById(element.id);
    let i = 0;
    element.animation.forEach(animationsection => {
      this.addAnimation(id, animationsection, element, i);
      ++i;
    });

  }

  addNewEffect(element): void {
    let newanimation: animationtype = {
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'scale',
      duration: 0.5,
      ease: '',
      posx: this.selectedelement.posx,
      posy: this.selectedelement.posy,
      rotationcycle: 360,
      travellocX: this.selectedelement.posy + 300,
      travellocY: this.selectedelement.posx,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
    }
    this.selectedelement.animation.push(newanimation);
    this.detectchange();
    //console.log(this.selectedelement);
  }

  deleteEffect(i) {
    //reset opacity
    if (this.selectedelement.animation[i].anim_type === 'appear') {
      //this.selectedelement.style.opacity = 1;
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
    // redo all ids

    let newelnr = this.animationarray.length + 'el';
    newElement.id = newelnr;

    if (element.type === 'vector') {
      let newVectorElement: vectoranimation = newElement;
      let i = 0;
      newVectorElement.vectors.forEach(vector => {
        let addnr = i + 1
        let idnr = newElement.id + 'vec-' + addnr;
        vector.idx = idnr;

        this.renumberSvgIds(newVectorElement.svgcombi, vector.idx, vector.pathids).then(newvectstring => {
          let pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
          //console.log( newvectstring);
          this.cleantags(pathidar).then(paths => {
            vector.pathids = [];
            paths.forEach((newpat: string) => {
              vector.pathids.push(newpat);
            })
          });
        }

        );
      })
    }

    this.animationarray.push(newElement);
    this.selectedelement = newElement;
  }

  getEditFile() {
    this.relationsApi.getFiles(this.option.id, { where: { template: { "neq": null }, type: 'video' } })
      .subscribe((files: Files[]) => {
        this.editablevideos = files;
      });
  }

  setImage(event, i): void {
    setTimeout(() => {
      this.animationarray[i].src = event;
    }, 500);
  }

  setVector(event, i, idx): void {
    setTimeout(() => {
      this.animationarray[i].vectors[idx].src = event;
    }, 500);
  }

  async initVectors(e, i, idx, vectorid) {
    console.log(e, i, idx, vectorid);
    if (this.animationarray[i].svgcombi === '' || this.animationarray[i].morph) {
      return new Promise(async (resolve, reject) => {
        let getview;
        let originalsize;
        let newsize;
        let newsizestring = e.getAttribute('viewBox');

        // convert all svgs and all other then paths (website wide)
        await MorphSVGPlugin.convertToPath("circle, rect, ellipse, line, polygon, polyline");

        if (this.animationarray[i].morph) {
          getview = document.getElementById('previewbox0');
        } else {
          getview = document.getElementById('previewbox' + i);
        }

        if (newsizestring !== null) {
          let newarray = newsizestring.split(' ');
          newsize = { x: newarray[0], y: newarray[1], width: newarray[2], height: newarray[3] }
        } else {
          newsize = { x: 0, y: 0, width: 1000, height: 1000 };
        }

        if (getview !== null) {
          let svgview = getview.getElementsByTagName('svg');
          let originalsizestring = svgview[0].getAttribute("viewBox");
          let origarray = originalsizestring.split(' ');
          originalsize = { x: origarray[0], y: origarray[1], width: origarray[2], height: origarray[3] }
        } else {
          originalsize = newsize;
        }

        await this.deleteVectorGroup(vectorid);
        console.log("vector groups deleted");
        await this.resizeVector(originalsize, newsize, idx, vectorid);
        console.log("vector resized");
        await this.combineSVGs(this.animationarray[i], originalsize);
        console.log("vectors combined");
        resolve();
      })
    }
  }


  drawVector(vector, animation: vectoranimationtype) {
    return new Promise(async (resolve, reject) => {

      if (vector.vectors.length > 0) {
        let list = vector.vectors[0].pathids;
        for (const pathid of list) {
          let fromvac = document.getElementById(pathid);
          this.setDrawAni(fromvac, animation);
        }
        resolve();
      } else {
        resolve();
      }
    });
  }


  getViewBox(vectid) {
    return new Promise((resolve, reject) => {

      let getview = document.getElementById(vectid);
      if (getview !== null) {
        let svgview = getview.getElementsByTagName('svg');
        let originalsizestring = svgview[0].getAttribute("viewBox");
        let origarray = originalsizestring.split(' ');
        let originalsize = { x: origarray[0], y: origarray[1], width: origarray[2], height: origarray[3] }
        resolve(originalsize);
      } else {
        let originalsize = { x: 0, y: 0, width: 500, height: 500 }
        resolve(originalsize);
      }
    });
  }

  onMovingAnimationEl(event, i, animation) {
    //console.log(event, i, animation);
    animation.start_time = event.x / 10;
    // html (movingOffset)="onMovingAnimationEl($event, i, animation)"
    //  [style.left]="animation.start_time * 10 + 'px'"
    //this.detectchange();
  }

  onResizeAnimationEl(event, i, animation) {
    //console.log(event, i, animation);
    animation.duration = event.size.width / 10;
    // html (movingOffset)="onMovingAnimationEl($event, i, animation)"
    //this.detectchange();
  }

  onMovingTimeline(event, i) {
    // console.log(i);
    this.currenttime = event.x / 10;
    // console.log(this.currenttime);
  }

  onMoving(event, i) {
    let idel = this.animationarray[i]
    idel.posy = event.y;
    idel.posx = event.x;
    //this.createRotate(this.animationarray[i]);
    let element = document.getElementById(idel.id);
    gsap.set(element, {
      x: idel.posX,
      y: idel.posY
    });
  }

  onResizing(e, i) {
    this.animationarray[i].style.width = e.size.width + 'px';
    this.animationarray[i].style.height = e.size.height + 'px';
  }

  onChangeShape(element) {
    element.style['border-radius'] = '';
    element.style.class = '';

    if (element.shape === 'round') {
      element.style['border-radius'] = '50%';
    }
    // if (element.shape === 'square') {
    //   element.style['border-radius'] = '0%';
    // }

    // if (element.shape === 'triangle') {
    //   element.style.class = 'triangle'
    // }

    if (element.shape === 'heart') {
      element.style.class = 'heart'
      element.style['background-color'] = 'rgba(0, 0, 0, 0)';
      element.style.width = element.style.height;
    }

    if (element.shape === 'star') {
      element.style.class = 'star-six'
      element.style['background-color'] = 'rgba(0, 0, 0, 0)';
    }
    this.detectchange();
  }

  addNewVector(src?, height?, width?, svgcombi?, posx?, posy?, pathidar?): void { //, originid?
    let svgc = '';
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
    if (svgcombi) { svgc = svgcombi }
    this.newz = this.newz + 1;
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: '',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 360,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: '',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
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
        duration: 3,
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
      pathids: pathidar,
      easetype: 'elastic',
      fromto: 'to',
      scale: 0
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
        stroke: '',
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
      selected: false,
      morph: false,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      motionpath: '<svg id="' + newelnr + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37" /></svg>',
    }
    this.animationarray.push(vector);
    this.onSelectElement(vector);
    if (src === null) {
      this.deleteWhitespaceSVG();
    }
    if (!svgcombi) {
      this.detectchange(); // detect change when seperating entire svg
    }
  }

  addVectorAnimation(element: vectoranimation) {
    let vectanim = {
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
      duration: 3,
      hideimage: false,
      easetype: 'linear',
      fromto: 'to'
    }
    element.vectoranimation.push(vectanim);
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
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 360,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
    }];
    let img: imageanimation = {
      type: 'image',
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        opacity: 1,
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 0,
      posy: 0,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      transform: '',
      rotation: 0,
      motionrotation: 0,

      motionpath: '<svg id="' + newelnr + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37" /></svg>',
    }
    this.animationarray.push(img);
    this.selectedelement = img;
    this.detectchange();
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
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 360,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
    }];
    let img: shapeanimation = {
      type: 'shape',
      style: {
        'z-index': this.newz,
        width: "200px",
        height: "200px",
        position: 'absolute',
        'background-color': '#000000',
        opacity: 1,
        'border-radius': '0%',
        class: '',
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      shape: 'square',
      transform: '',
      rotation: 0,
      motionrotation: 0,

      motionpath: '<svg id="' + newelnr + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37" /></svg>',

    }
    this.animationarray.push(img);
    this.selectedelement = img;
    this.detectchange();

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
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 360,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
    }];
    let whiteboard: whiteboardanimation = {
      type: 'whiteboard',
      style: {
        'z-index': 100,
        width: this.canvas.width,
        height: this.canvas.height,
        position: '',
        'background-color': '',
        opacity: 1,
      },
      src: '',
      posx: 0,
      posy: 0,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr
    }
    if (this.whiteboard === false) {
      this.animationarray.push(whiteboard);
      this.whiteboard = true;
    }

    this.detectchange();

    setTimeout(() => {
      let wb = document.getElementById(newelnr);
      let cv1 = wb.getElementsByClassName('canvas_whiteboard');
      let cv2 = wb.getElementsByClassName('incomplete_shapes_canvas_whiteboard');
      cv1[0].setAttribute('width', this.canvas.width);
      cv1[0].setAttribute('height', this.canvas.height);
      cv2[0].setAttribute('width', this.canvas.width);
      cv2[0].setAttribute('height', this.canvas.height);
    }, 300) // mininmum needed for dom to process

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
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: 360,
      travellocX: 300,
      travellocY: 0,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: ''
    }];
    let splittext: splittexttype[] = [{
      textanimationtype: '',
      repeat: 0,
      start_time: 0, //delay
      end_time: 10,
      duration: 3,
      x: 0,
      y: 100,
      fromto: 'to',
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
        padding: '15px', //neccarry to get all fonts,
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      posy: 50,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      splittextanimation: splittext,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      // motioncor: 'path: d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"',
      motionpath: '<svg id="' + newelnr + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;" ' +
        ' d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37" /></svg>',

    }
    this.animationarray.push(txt);
    this.selectedelement = txt;
    this.detectchange();

  }

  deleteTextAnimation(iv) {
    this.selectedelement.splittextanimation.splice(iv, 1);
  }

  playFunc() {
    //console.log(this.primairytimeline);
    //this.saveNewMotionPath();
    this.editpath = false;
    this.removeVectorPathMultiSelection();
    this.removeVectorPathSelection();

    if (this.currenttime === 0) {
      this.detectchange();
    }

    if (this.canvas.audio) {
      this.playSound('canvassound', null, this.canvas.loop);
      this.primairytimeline.eventCallback("onComplete", this.stopSound, [this.selectedelement.id, null]);
    }

    console.log('play', this.primairytimeline.time());
    //this.progressbarline.play();
    // clean up for play
    this.selectedVecPath = false;
    clearTimeout(this.t); //to make sure there is no second loop

    setTimeout(() => {

      if (this.canvas.videourl) {
        this.videoPlayer.play();
      }
      if (this.canvas.loop) {
        this.videoPlayer.loop = true;
      }
      if (this.currenttime === 0) {
        this.primairytimeline.play(0);
      } else {
        this.primairytimeline.resume();
      }
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
    this.primairytimeline.restart();
    this.primairytimeline.pause();
    //this.primairytimeline.progress(0);
    this.primairytimeline.timeScale(1);

    if (this.canvas.videourl) {
      this.videoPlayer.pause();
      this.videoPlayer.currentTime = 0;
    }
    this.detectchange();
    if (this.canvas.audio) {
      this.stopSound('canvassound', null);
    }
  }

  pauseFunc() {
    this.primairytimeline.pause();
    if (this.canvas.videourl) {
      this.videoPlayer.pause();
    }
    clearTimeout(this.t);

    if (this.canvas.audio) {
      this.pauseSound('canvassound', null);
    }
  }

  setReplay() {
    if (this.setreplay === true) {
      this.setreplay = false;
    } else {
      this.setreplay = true;
    }
  }

  reverseFunc() {
    clearTimeout(this.t);
    this.t = setInterval(() => { this.deleteSeconds() }, 100);
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

  deleteSeconds() {
    if (this.currenttime > 0) {
      this.currenttime = this.currenttime - 0.1;
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
    if (this.animationarray[i].type === 'whiteboard') {
      this.whiteboard = false;
    }
    this.removeVectorPathMultiSelection();
    this.removeVectorPathSelection()
    this.animationarray.splice(i, 1);
    this.selectedelement = '';
    //console.log(this.animationarray);
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

  setAudio(event, animation) {
    console.log('audio file', event, animation)
    animation.audioeffectsrc = event;
    // delete this.onchangeaudio();
  }

  setAudioCanvas(event) {
    console.log('audio canvas file', event)
    this.canvas.audio = event;
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
      easetype: 'elastic',
      fromto: 'to',
      scale: 0
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
      duration: 3,
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


  async combineSVGs(element, newsize?) {
    return new Promise(async (resolve, reject) => {
      let idnew;
      let total = [];
      let h = 500, w = 500;
      let startstr;
      let originalsize = newsize; //await this.getViewBox('previewbox0');
      //console.log(originalsize);
      if (originalsize) {
        h = originalsize['width']; // * newscale1;
        w = originalsize['height']; // * newscale1;
      }
      startstr = '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="0 0 ' + h + ' ' + w + '" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">';
      //console.log('morph added to vector');
      total.push(startstr);

      let index = 0;
      //console.log('before vect desc:', element.vectors);

      for (const vect of element.vectors) {
        idnew = document.getElementById(vect.idx); // get document

        let vectstring;
        if (idnew === null) {
          vectstring = element.svgcombi;
        } else if (idnew.childNodes[0] !== null) {
          vectstring = idnew.childNodes[0].innerHTML;
        } else {
          vectstring = idnew.childNodes.innerHTML;
        }

        let pathidar;
        let newvectstring;
        pathidar = vectstring.match(/id="(.*?)"/g); //get ids
        newvectstring = await this.grabPaths(vectstring, pathidar);
        pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
        //console.log( newvectstring, pathidar);
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
      element.svgcombi = childrenst;
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
    let ease = this.selectEaseType(animation.easetype);


    for (let i1 = 0; i1 < vectors.length - 1; i1++) {
      let fromvector = vectors[i1];
      let tovector = vectors[i1 + 1];
      let fintime = animation.start_time + animation.duration + (animation.duration * i1);
      let fintimehalf = animation.duration / 0.9;
      let starttime = animation.start_time + (animation.duration * i1) + (1 * i1);


      // if vector 1 hess less paths then vector 2
      if (vectors[i1].pathids.length < vectors[i1 + 1].pathids.length) {
        for (let ix = 0; ix < vectors[i1 + 1].pathids.length; ix++) {
          // copy random vector paths to connect to empty paths
          if (ix >= vectors[i1].pathids.length) {

            let topathid = vectors[i1 + 1].pathids[ix];
            let toel = document.getElementById(topathid);
            let vectornewpath = document.getElementById('0elvect-res' + ix);
            //console.log(vectornewpath);
            if (vectornewpath === null) {
              const sindex = Math.floor(Math.random() * fromvector.pathids.length); //connect to random paths;
              const frompathid = fromvector.pathids[sindex];
              const fromel = document.getElementById(frompathid);
              const svgnew = fromel.parentElement;// vectornew.getElementsByTagName('svg');
              const newElement = fromel.cloneNode(true) as HTMLElement;
              newElement.setAttribute('id', '0elvect-res' + ix);
              svgnew.insertAdjacentElement('afterbegin', newElement)
              //svgnew.appendChild(newElement);
              vectornewpath = document.getElementById('0elvect-res' + ix);
            }
            this.primairytimeline.to(vectornewpath, {
              duration: animation.duration, morphSVG: {
                shape: toel,
                type: "rotational",
                origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
              }, ease: ease
            }, starttime);
            this.primairytimeline.fromTo(toel, { opacity: 0 }, { duration: fintimehalf, opacity: 1 }, fintime - 1);
            this.primairytimeline.to(vectornewpath, { duration: 1, opacity: 0 }, fintime);
          }
        }
      }

      for (let i2 = 0; i2 < fromvector.pathids.length; i2++) {
        // vector 1 is eqeal or smaller then vector 2
        //console.log(i2+1, fromvector.pathids.length);
        if (i2 < tovector.pathids.length) {
          let frompathid = fromvector.pathids[i2];
          let topathid = tovector.pathids[i2];
          let fromel = document.getElementById(frompathid);
          let toel = document.getElementById(topathid);

          this.primairytimeline.to(fromel, {
            duration: animation.duration, morphSVG: {
              shape: toel,
              type: "rotational",
              origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
            }, ease: ease
          }, starttime);
          this.primairytimeline.fromTo(toel, { opacity: 0 }, { duration: fintimehalf, opacity: 1 }, fintime - 1);
          this.primairytimeline.to(fromel, { duration: 1, opacity: 0 }, fintime);

        } else { // (i2 > tovector.pathids.length)
          // vector 1 is larger then vector 2
          let frompathid = fromvector.pathids[i2];
          let sindex = Math.floor(Math.random() * tovector.pathids.length); //connect to random paths;
          let topathid = tovector.pathids[sindex];
          let fromel = document.getElementById(frompathid);
          let toel = document.getElementById(topathid);
          //console.log('bigger vector', toel, sindex);
          this.primairytimeline.to(fromel, {
            duration: animation.duration, morphSVG: {
              shape: toel,
              type: "rotational",
              origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
            }, ease: ease
          }, starttime);
          this.primairytimeline.fromTo(toel, { opacity: 0 }, { duration: fintimehalf, opacity: 1 }, fintime - 1);
          this.primairytimeline.to(fromel, { duration: 1, opacity: 0 }, fintime);
        }
      }
    }
  }



  addWeatherEffect() {
    console.log(this.canvas.weather);
    let type = this.canvas.weather;

    let classtype;
    let total = 30;
    if (type === 'snow') { total = 60 }
    if (type === 'rain') { total = 60 }
    if (type === 'leaves') { total = 50 }
    let container = document.getElementById("weathercontainer");
    // container.removeChild   ---> ??
    container.innerHTML = '';

    let w = window.innerWidth;
    let h = container.offsetHeight;
    let LeafL = window.innerHeight;
    let LeafR = window.innerWidth;
    let canvasposL = 0;
    let canvasposR = container.offsetWidth;
    let heightani = h * -1;
    let heightanibottom = heightani - 100; // total area from above the square to lower edge
    let heightanitop = heightanibottom * 2;

    //console.log(heightanibottom, heightanitop);

    for (let i = 0; i < total; i++) {
      var Div = document.createElement('div');
      if (type === 'snow') {
        gsap.set(Div, { attr: { class: 'snow' }, x: this.R(0, canvasposR), y: this.R(h, heightanitop), z: this.R(-200, 200), rotationZ: this.R(0, 180), rotationX: this.R(0, 360) });
      }
      if (type === 'rain') {
        gsap.set(Div, { attr: { class: 'rain' }, x: this.R(0, canvasposR), y: this.R(heightanibottom, heightanitop), z: this.R(-200, 200), rotation: "-20_short", });
      }
      if (type === 'leaves') {
        classtype = 'leaves' + Math.floor(this.R(1, 4));
        gsap.set(Div, { attr: { class: classtype }, x: this.R(0, canvasposR), y: this.R(h, heightanitop), z: this.R(-200, 200), rotationZ: this.R(0, 180), rotationX: this.R(0, 360) });
      }

      container.appendChild(Div);
      if (type === 'snow') { this.animsnow(Div, h); }
      if (type === 'rain') { this.animrain(Div, h); }
      if (type === 'leaves') { this.animleaves(Div, h); }
    }
  }

  animsnow(elm, h) {
    this.primairytimeline.to(elm, { duration: this.R(15, 30), y: h + 100, ease: 'linear.none', repeat: -1, delay: 0 }, 0);
    this.primairytimeline.to(elm, { duration: this.R(8, 8), x: '+=100', rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, 0);
    this.primairytimeline.to(elm, { duration: this.R(2, 8), rotationX: this.R(0, 360), rotationY: this.R(0, 360), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, 0);
  };

  // element, time(speed),
  animrain(elm, h) {
    this.primairytimeline.to(elm, { duration: this.R(2, 4), y: h, x: '+=100', ease: 'linear.none', repeat: -1, delay: 0 }, 0);
  };

  animleaves(elm, h) {
    this.primairytimeline.to(elm, { duration: this.R(20, 30), y: h + 100, ease: 'linear.none', repeat: -1, delay: 0 }, 0);
    this.primairytimeline.to(elm, { duration: this.R(4, 8), x: '+=100', rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, 0);
    this.primairytimeline.to(elm, { duration: this.R(2, 8), rotationX: this.R(0, 360), rotationY: this.R(0, 360), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, 0);
  }



  R(min, max) { return min + Math.random() * (max - min) };

  setDrawAni(from, animation: vectoranimationtype) {
    let animationdrawto = animation.fillleft + ' ' + animation.fillright;
    let animationdrawfrom = animation.drawleft + ' ' + animation.drawright;
    let hideelement = 0;
    //let ease = animation.easetype;
    let ease = this.selectEaseType(animation.easetype);

    if (animation.hideimage === true) {
      hideelement = 0;
    } else { hideelement = 1 }

    let fromset =
    {
      drawSVG: animationdrawfrom,
      duration: animation.duration,
      repeat: animation.repeat,
      stroke: animation.drawcolor,
      strokeWidth: animation.linethickness,
      'fill-opacity': hideelement,
      ease: ease,
      yoyo: animation.yoyo
    };

    let toset =
    {
      drawSVG: animationdrawto,
      duration: animation.duration,
      repeat: animation.repeat,
      stroke: animation.drawcolor,
      strokeWidth: animation.linethickness,
      'fill-opacity': hideelement,
      ease: ease,
      yoyo: animation.yoyo
    };

    this.primairytimeline.fromTo(from, fromset, toset, animation.start_time);

    return
  }

  svgDeleteBackground(element, idx) {
    //console.log(element, idx)
    let newsvgs;
    let pathid = element.vectors[idx].pathids[0];
    element.vectors[idx].pathids.splice(0, 1);
    let svgstring = element.svgcombi;
    let n, l;
    let nstring = '<path id="' + pathid;
    n = svgstring.indexOf(nstring)
    l = svgstring.indexOf('</path>', n)
    l = l + 7;
    // console.log(l, n )
    if (n !== -1) {
      let x = svgstring.substring(n, l);
      newsvgs = svgstring.replace(x, '');
      element.svgcombi = newsvgs;
      //console.log('BG deleted', newsvgs, element);
    } else { console.log('bg not found') }

  }


  async normalizepath(viewbox, path, scale, max) {
    return new Promise((resolve, reject) => {
      let h = viewbox.height * scale;
      let w = viewbox.width * scale;
      const normalizedPath = normalize({
        viewBox: '0 0 ' + h + ' ' + w,
        path: path,
        min: 0,
        max: h,
        asList: false
      })

      //console.log(normalizedPath)

      resolve(normalizedPath) // normalizedPath
    })
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

  async deleteVectorGroup(id) {
    return new Promise(async (resolve, reject) => {
      let groupElement;
      let e = document.getElementById(id);
      let g = e.getElementsByTagName("g");
      console.log(g)
      for (let index = 0; index < g.length; index++) {  // ---> g.length
        g[index].setAttribute("id", id + index + 'g');
        let sg = id + index + 'g';
        groupElement = SVG.get(sg);
        if (typeof groupElement.ungroup === "function") {
          //console.log('found g id', groupElement);
          groupElement.ungroup(groupElement.parent());
        }
      }
      resolve();
    })
  }

  async resizeVector(originalsize, newsize, i, id) {
    return new Promise(async (resolve, reject) => {
      let e = document.getElementById(id);

      // transform to size
      let scale;
      let newtranssize;
      //console.log(newsize, originalsize, bbox);
      if (newsize.height < newsize.width) {
        if (newsize < originalsize) {
          newtranssize = newsize.height / originalsize.height;
        } else {
          newtranssize = originalsize.height / newsize.height;
        }
      } else {
        if (newsize < originalsize) {
          newtranssize = newsize.width / originalsize.width;
        } else {
          newtranssize = originalsize.width / newsize.width;
        }
      }

      scale = Number((newtranssize).toFixed(8));
      let p = e.getElementsByTagName("path");
      for (let index = 0; index < p.length; index++) {

        p[index].setAttribute("id", "child-" + index + i); // keep in case there is no ID set
        let rawpath = await MotionPathPlugin.getRawPath(p[index]);
        let svgsizearray = [scale, 0, 0, scale, 0, 0]
        let newmatrix;
        let transf = p[index].getAttribute('transform');

        if (transf !== null) {
          let style = transf;
          style = style.replace('matrix(', '');
          style = style.replace('matrix(', '');
          style = style.replace(')', '');
          style = style.replace(/,/g, ' ');
          newmatrix = style.split(' ').map(Number);

          let testpath2 = await MotionPathPlugin.transformRawPath(rawpath, newmatrix[0], newmatrix[1], newmatrix[2], newmatrix[3], newmatrix[4], newmatrix[5]);
          let testpath3 = await MotionPathPlugin.transformRawPath(testpath2, svgsizearray[0], svgsizearray[1], svgsizearray[2], svgsizearray[3], svgsizearray[4], svgsizearray[5]);
          let stringpath = await MotionPathPlugin.rawPathToString(testpath3);
          p[index].setAttribute('d', stringpath);
          p[index].removeAttribute("transform");

        } else {
          let testpath3 = await MotionPathPlugin.transformRawPath(rawpath, svgsizearray[0], svgsizearray[1], svgsizearray[2], svgsizearray[3], svgsizearray[4], svgsizearray[5]);
          let stringpath = await MotionPathPlugin.rawPathToString(testpath3);
          p[index].setAttribute('d', stringpath);
          p[index].removeAttribute("transform");
        }
      }
      resolve();
    });
  }

  createRotate(idel) {
    let element = document.getElementById(idel.id);
    let handle = document.getElementById(idel.id + 'rotatehandle');
    Draggable.create(element, {
      type: "rotation",
      trigger: handle,
      onDragEndParams: [idel],
      onDragEnd:
        function (idl) {
          idl.rotation = this.rotation;
        }
    });
  }

  deleteWhitespaceSVG(): void {
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    setTimeout(() => {
      console.log('delete whitespace', this.selectedelement);
      var element = document.getElementById(this.selectedelement.id);
      var svg = element.getElementsByTagName("svg")[0];
      var bbox = svg.getBBox();
      var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
      svg.setAttribute("viewBox", viewBox);
      this.selectedelement.svgcombi = svg.outerHTML;
    }, 1000);
  }

  async seperatePaths(idx, vector: vectorelement, element: vectoranimation) {
    vector.pathids.forEach(pid => {
      let svgel = document.getElementById(pid);
      let s = new XMLSerializer(); // convert to string
      let svgstring = s.serializeToString(svgel);
      //let elev = document.getElementById(this.selectedelement.id);
      let h = 500, w = 500;
      let originalsize = this.getViewBox(this.selectedelement.id);
      console.log(originalsize);
      if (originalsize) {
        h = originalsize['width']; // * newscale1;
        w = originalsize['height']; // * newscale1;
      }

      let newsvgarray = [
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="0 0 ' + h + ' ' + w + '" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
        svgstring, '</svg>'
      ]
      let newsvg = newsvgarray.join('');
      this.addNewVector(null, element.style.height, element.style.width, newsvg, element.posx, element.posy);
    });
    //this.deleteVectorSrc(idx, vector);
    //this.detectchange();
  }

  selectMultiplePaths() {
    //console.log(vector, idx, element);
    this.dragselectvectpath = false;
    this.dragselectiontrue = false;
    this.cancelDragSelect();
    if (this.selectmultiplepaths === false) {
      this.removeVectorPathMultiSelection()
    } else {
      this.selectmultiplepaths === true;
      this.selectedVecPathmultiple.push(this.selectedVecPath);
    }
  }

  selectPathSelectionBox() {
    let svg = document.getElementById(this.selectedelement.id);
    let p = svg.getElementsByTagName('path');
    for (let i = 0; i < p.length; i++) {
      let posstring = p[i].getBBox();
      console.log(posstring);
    }
  }

  clickVectorPaths(e) {
    //console.log('clickVectorPaths', this.dragselectvectpath, this.dragselectiontrue);

    if (this.dragselectvectpath === true && this.dragselectiontrue === false) {
      this.dragSelect(this.selectedelement.id);
    } else if (this.dragselectiontrue === false) {
      if (e.target.localName !== 'svg') {
        if (this.selectmultiplepaths === false) {
          if (this.selectedVecPath === e.target) {
            this.removeVectorPathSelection();
          } else {
            this.removeVectorPathSelection();
            this.selectedVecPath = e.target;
            this.setPathSelClass(e.target);
            // this.selectedVecPath.style.outline = '1px dotted green';
          }
        }
        if (this.selectmultiplepaths === true) {
          this.selectedVecPath = e.target; // keep is connected to the ng view
          // check if already selected
          let exist = this.selectedVecPathmultiple.indexOf(e.target);
          //console.log(exist, e.target);
          if (exist !== -1) {
            e.target.style.outline = null;
            this.deletePathSelClass(e.target); 
            this.selectedVecPathmultiple.splice(exist, 1);
          } else {
            // if not exists
            //e.target.style.outline = '1px dotted green';
            this.setPathSelClass(e.target);
            this.selectedVecPathmultiple.push(e.target);
            //console.log(this.selectedVecPathmultiple);
          }
        }
      }
    }

  }

  deleteSelectedVectorPath() {
    // delete from pathids
    if (this.dragselectiontrue){
      this.cancelDragSelect();
      this.dragselectiontrue = false;
    }
    if (this.selectmultiplepaths || this.dragselectvectpath) {
      if (this.dragselectvectpath){this.cancelDragSelect;}
      this.selectedVecPathmultiple.forEach(selectionvecpath => {
        this.selectedelement.vectors.forEach(element => {
          let index = element.pathids.indexOf(selectionvecpath.id);
          if (index > -1) {
            element.pathids.splice(index, 1);
          }
        });
        // delete actual path and save
        this.removeVectorPathMultiSelection();
        selectionvecpath.remove();
        selectionvecpath = '';
        let idnew = document.getElementById(this.selectedelement.id); // get document
        let vectstring = idnew.innerHTML;
        this.selectedelement.svgcombi = vectstring;
      })
    } else {
      this.selectedelement.vectors.forEach(element => {
        let index = element.pathids.indexOf(this.selectedVecPath.id);
        if (index > -1) {
          element.pathids.splice(index, 1);
        }
      });
      // delete actual path and save
      this.selectedVecPath.remove();
      this.selectedVecPath = '';
      let idnew = document.getElementById(this.selectedelement.id); // get document
      let vectstring = idnew.innerHTML;
      this.selectedelement.svgcombi = vectstring;
      this.removeVectorPathSelection();
    }
  }

  removeVectorPathMultiSelection() {
    if (this.dragselectiontrue){
      this.cancelDragSelect();
      this.dragselectiontrue = false;
    }
    if (this.selectedVecPathmultiple.length > 0) {
      this.selectedVecPathmultiple.forEach((path, index) => {
        //path.style.outline = null;
        this.deletePathSelClass(path)
        this.selectedVecPathmultiple.splice(index, 1)
      });
    }
  }


  removeVectorPathSelection() {
    if (this.dragselectiontrue){
      this.cancelDragSelect();
      this.dragselectiontrue = false;
    }
    if (this.selectedVecPath) {
      this.deletePathSelClass(this.selectedVecPath)
      this.selectedVecPath = null;
    }
  }

  saveAsSeperateVector(): any {
    if (this.dragselectiontrue){
      this.cancelDragSelect();
      this.dragselectiontrue = false;
    }
    let svgstring;
    let pathidar = [];

    if (this.selectmultiplepaths || this.dragselectvectpath) {
      // this.removeVectorPathMultiSelection();
      console.log('seperate multipaths', this.selectedVecPathmultiple)
      let svgarray = [];
      let i = 0;
      let arraylenght = this.selectedVecPathmultiple.length - 1;
      this.selectedVecPathmultiple.forEach(element => {
        //console.log(element);
        let idx = this.animationarray.length + 1;
        let ind = i + 1;
        let newid = idx + 'elvect-' + ind;
        let oldid = element.getAttribute('id');
        let svgel = element;
        this.deletePathSelClass(svgel);
        let s = new XMLSerializer(); // convert to string
        let stringend = s.serializeToString(svgel);
        //let cleanstring = stringend.replace('outline: 1px dotted green;', '');

        let finalstring = stringend.replace(oldid, newid);
        svgarray.push(finalstring);
        pathidar.push(newid);
        if (i === arraylenght) {
          svgstring = svgarray.join('');
          this.createnewsvg(svgstring, pathidar);
          this.removeVectorPathMultiSelection();
        }
        ++i
      });

    } else {
      let svgel = this.selectedVecPath;
      this.deletePathSelClass(svgel);
      let oldid = svgel.getAttribute('id');
      let s = new XMLSerializer(); // convert to string
      svgstring = s.serializeToString(svgel);
      let idx = this.animationarray.length + 1;
      let ind = 0 + 1;
      let newid = idx + 'elvect-' + ind;
      let finalstring = svgstring.replace(oldid, newid);
     // let cleanstring = finalstring.replace('outline: 1px dotted green;', '');
      finalstring.replace(oldid, newid);
      pathidar.push(newid);
      this.createnewsvg(finalstring, pathidar);
      this.removeVectorPathSelection();
    }
  }

  async createnewsvg(svgstring, pathidar) {
    console.log('start new svg')
    let h = 500, w = 500;
    let element = document.getElementById(this.selectedelement.id);
    let originalsize = await this.getViewBox(this.selectedelement.id);
    //console.log(originalsize);
    if (originalsize) {
      h = originalsize['width']; // * newscale1;
      w = originalsize['height']; // * newscale1;
    }

    let newsvgarray = [
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'viewBox="0 0 ' + h + ' ' + w + '" height="100%" width="100%"' +
      'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
      svgstring, '</svg>'
    ]
    let newsvg = newsvgarray.join('');
    this.addNewVector(null, this.selectedelement.style.height, this.selectedelement.style.width, newsvg, this.selectedelement.posx, this.selectedelement.posy, pathidar); //, originid
    this.removeVectorPathMultiSelection()
    this.removeVectorPathSelection();

  }

  async onSVGsave(url): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
      this.uploader = new FileUploader({ url: urluse });
      let name = Math.random().toString(36).substring(7) + '.svg';
      let date: number = new Date().getTime();
      let data = url;
      let contentType = '';
      const blob = new Blob([data], { type: contentType });
      // contents must be an array of strings, each representing a line in the new file
      let file = new File([blob], name, { type: "image/svg+xml", lastModified: date });
      let fileItem = new FileItem(this.uploader, file, {});
      this.uploader.queue.push(fileItem);
      // fileItem.upload();
      this.uploader.uploadAll();
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        if (status === 200) {
          // set download url or actual url for publishing
          let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name;
          let setimgurl: string;
          setimgurl = 'https://xbmsapi.eu-gb.mybluemix.net/api/Containers/' + this.option.id + '/download/' + name;
          imgurl = imgurl.replace(/ /g, '-'),
            // define the file settings
            this.newFiles.name = name,
            this.newFiles.url = setimgurl,
            this.newFiles.createdate = new Date(),
            this.newFiles.type = 'vector',
            this.newFiles.companyId = this.Account.companyId,
            // check if container exists and create
            this.relationsApi.createFiles(this.option.id, this.newFiles)
              .subscribe(res => {
                //console.log(res);
                this.snackBar.open("svg saved", undefined, {
                  duration: 2000,
                  panelClass: 'snackbar-class'
                });
                resolve(setimgurl);
              });
        }
      };
    });
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
              //console.log(res);
              setTimeout(() => {
                this.filesApi.converteps2svg(this.option.id, this.Account.companyId, res.url, name, true)
                  .subscribe(resp => {
                    //this.setimage(res.url)
                    // set SVG as new element
                    this.addNewVector(resp.url, this.canvas.height, this.canvas.width);
                    // delete whiteboard
                    this.snackBar.open("vector created", undefined, {
                      duration: 2000,
                      panelClass: 'snackbar-class'
                    });
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


  saveAsNewVector(element?) {
    let svgel;
    if (element === undefined) {
      svgel = document.getElementById(this.selectedelement.id).outerHTML;
      this.selectedelement.src = this.onSVGsave(svgel);
    } else {
      svgel = document.getElementById(element.id).outerHTML;
      element.src = this.onSVGsave(svgel);
    }
  }

  async saveVideo() {
    //console.log(this.animationarray);

    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + this.elementname;
    let setimgurl = 'https://xbmsapi.eu-gb.mybluemix.net/api/Containers/' + this.option.id + '/download/' + this.elementname;
    imgurl = imgurl.replace(/ /g, '-'),
      // define the file settings
      this.newFiles.name = this.elementname;
    this.newFiles.url = setimgurl;
    this.newFiles.createdate = new Date();
    this.newFiles.type = 'video';
    this.newFiles.companyId = this.Account.companyId;
    this.newFiles.canvas = [this.canvas];
    this.newFiles.template = this.animationarray;
    this.newFiles.counter = this.counter;
    this.newFiles.companyId = this.Account.companyId;

    if (this.newFiles.id) {
      this.relationsApi.updateByIdFiles(this.newFiles.relationsId, this.newFiles.id, this.newFiles).subscribe(res => {
        this.snackBar.open("video saved!", undefined, {
          duration: 2000,
          panelClass: 'snackbar-class'
        });
      });
    } else {
      this.relationsApi.createFiles(this.option.id, this.newFiles).subscribe(res => {
        this.snackBar.open("video saved!", undefined, {
          duration: 2000,
          panelClass: 'snackbar-class'
        });
      });
    }


  }

  async converttovideo() {
    // let myJSON = await this.jsonVectors();
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    let array = this.animationarray;
    let myJSON = JSON.stringify(array);
    //var aniarray = encodeURIComponent(myJSON);
    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    this.filesApi.createvideo(this.option.id, this.option.companyId,
      this.elementname, this.canvas, myJSON, this.counter)
      .subscribe(
        res => {
          //console.log(res);
          this.saveVideo()
        }
      );
  }

  async jsonVectors() {
    let newanimationarray = JSON.parse(JSON.stringify(this.animationarray));
    for (let index = 0; index < newanimationarray.length; index++) {
      if (newanimationarray[index].type === 'vector') {
        newanimationarray[index].svgcombi = JSON.stringify(newanimationarray[index].svgcombi);
        return newanimationarray
      }
    }
  }


  async converttogif() {
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    let array = this.animationarray;
    let myJSON = JSON.stringify(array);
    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    this.filesApi.creategif(this.option.id, this.option.companyId,
      this.elementname, this.canvas, myJSON, this.counter)
      .subscribe(
        res => {
          this.saveVideo()
        }
      );
  }

  resetVideo() {
    this.elementname = '';
    this.canvas = {
      width: '600px',
      height: '500px',
      'background-color': '#ffffff',
      'background-image': '',
      position: 'relative',
      videourl: '',
      loop: false,
      weather: '',
      audio: ''
    }
    this.animationarray = [];
    this.counter = 60;
    this.detectchange();
  }

  loadEditableVideo() {
    this.newFiles = this.editablevideo;
    this.elementname = this.editablevideo.name;
    this.canvas = this.editablevideo.canvas[0];
    this.animationarray = this.editablevideo.template;
    this.counter = this.editablevideo.counter;
    this.detectchange();
  }

  //https://github.com/luncheon/svg-drag-select
  dragSelect(id) {
    this.dragselectiontrue = true;
    let svgel = document.getElementById(id);
    let svgset = svgel.getElementsByTagName("svg")[0];

    const {
      cancel,           // cleanup funciton. please call `cancel()` when the select-on-drag behavior is no longer needed.
      dragAreaOverlay,
    } = svgDragSelect({
      svg: svgset,
      referenceElement: null,
      selector: "enclosure",
      onSelectionStart({ svg, pointerEvent, cancel }) {
        if (pointerEvent.button !== 0) {
          cancel()
          return
        }
        const selectedElements = svg.querySelectorAll('[data-selected]');
        for (let i = 0; i < selectedElements.length; i++) {
          selectedElements[i].removeAttribute('data-selected');
          let elclass = selectedElements[i].getAttribute('class');
          elclass = elclass.replace('data-selected', '')
          selectedElements[i].setAttribute('class', elclass);
        }
      },

      onSelectionChange({
        newlySelectedElements,    // `selectedElements - previousSelectedElements`
        newlyDeselectedElements,  // `previousSelectedElements - selectedElements`
      }) {
        newlyDeselectedElements.forEach(element => {
          element.removeAttribute('data-selected')
          let elclass = element.getAttribute('class');
          //console.log(elclass);
          elclass = elclass.replace('data-selected', '')
          element.setAttribute('class', elclass);
        });
        newlySelectedElements.forEach(element => {
          element.setAttribute('data-selected', '');
          let elclass = element.getAttribute('class');
          if (elclass !== null) {
            element.setAttribute('class', 'data-selected ' + elclass);
          } else {
            element.setAttribute('class', 'data-selected')
          }
        });
      },

      onSelectionEnd: event =>  {
        this.selectedVecPathmultiple = [];
        event.selectedElements.forEach(el => {
          this.selectedVecPathmultiple.push(el);
        });
      } 
    });

    this.cancelDragSelect = cancel;
    this.dragAreaOverlay = dragAreaOverlay;
  }

  setDragSelect() {
    if (this.dragselectvectpath === false){
      this.cancelDragSelect;
    }
  }

  setPathSelClass(element){
    let elclass = element.getAttribute('class');
    if (elclass !== null) {
      element.setAttribute('class', 'data-selected ' + elclass);
    } else {
      element.setAttribute('class', 'data-selected')
    }
  }

  deletePathSelClass(element){
    this.dragselectiontrue = false;
    this.dragselectvectpath = false;
    let elclass = element.getAttribute('class');
    if (elclass !== null){
      elclass = elclass.replace('data-selected', '')
      element.setAttribute('class', elclass);
    }

  }

}