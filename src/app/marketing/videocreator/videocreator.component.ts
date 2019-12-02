import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { gsap } from 'assets/js/all';
import { Physics2DPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper } from 'assets/js/all';
gsap.registerPlugin(Physics2DPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper);
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar, AnimationDurations } from '@angular/material';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as normalize from 'normalize-svg-coords';
const plugins = [DrawSVGPlugin, MorphSVGPlugin, SplitText, Physics2DPlugin, MotionPathPlugin, MotionPathHelper]; //needed for GSAP 
import { CanvasWhiteboardComponent } from 'ng2-canvas-whiteboard';
import { fonts } from '../../shared/listsgeneral/fonts';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { duration } from 'moment';
import { viewClassName } from '@angular/compiler';

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
}

export class vectorelement {
  idx: string;
  src: string;
  duration: number;
  start_time: number;
  pathids: string[];
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

  ngOnInit() {


  }

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
    console.log(svgtrans);

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
    });


  }

  createSplitText(elm: textanimation, textani: splittexttype) {
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

  stopSound(id, src){
    let audio = document.getElementById(id) as HTMLAudioElement;
    console.log(audio);
    audio.currentTime = 0;
    audio.pause();
  }

  seekSound(id, src, time){
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
    //console.log(event, i, idx);
    this.animationarray[i].vectors[idx].src = event;
    let vect = this.animationarray[i].vectors[idx].idx;
  }

  initVectors(e, i, idx, vectorid) {
    if (this.animationarray[i].svgcombi === '' || this.animationarray[i].morph) {
      return new Promise(async (resolve, reject) => {
        //console.log('set vectors', e, i, idx, vectorid);
        let vect = this.animationarray[i].vectors[idx].idx;
        let originalsize; // {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
        await this.deleteVectorGroup(e);
        originalsize = await this.getViewBox(e);
        await this.normalizepath(e, originalsize);
        await this.combineSVGs(this.animationarray[i]);
        resolve();
      })
    }
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
      //console.log('get/set viewbox')
      // let set = vect;//document.getElementById(vect);
      let doc = vect; // set.getElementsByTagName('svg');
      if (doc !== undefined) {
        if (doc.id === undefined) {

        }
        doc.setAttribute("id", '3knrk2l');
        let element = SVG.get(doc.id);
        //console.log(element);
        //element.draggable()
        var box = element.viewbox();
        if (box === undefined) {
          box.viewbox(0, 0, 500, 500)
        }

        //console.log(element.rbox());
        //element.viewbox(bbox.x, bbox.y, bbox.width, bbox.height);

        //console.log(box);
        resolve(box);
      } else {
        resolve();
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
    this.animationarray[i].posy = event.y;
    this.animationarray[i].posx = event.x;
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
    // if (originid){
    //   svgcombi = svgcombi.replace(originid, vectorid);
    //   console.log(originid, vectorid, svgcombi);
    // }
    if (svgcombi) { svgc = svgcombi }
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
      pathids: pathidar,
      easetype: 'elastic',
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
      selected: false,
      morph: false,
      transform: '',
      motionrotation: 0,
      //motioncor: 'path: d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"',
      motionpath: '<svg id="' + newelnr + 'mp" viewBox="-20 0 557 190" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37" /></svg>',
      // from, 4, {drawSVG:0, repeat:10, yoyo:true}, 4)

    }
    //console.log(vector);
    this.animationarray.push(vector);
    this.selectedelement = vector;

    if (!svgcombi) {
      this.detectchange(); // detect change when seperating entire svg 
    } else {
      let i = this.animationarray.length - 1;
      //this.combineSVGs(this.animationarray[i]);
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
      duration: 2.5,
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
      duration: 2.5,
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
        opacity: 1
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 0,
      posy: 0,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      transform: '',
      motionrotation: 0,
      //motioncor: 'path: d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"',
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
      duration: 2.5,
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
        class: ''
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      shape: 'square',
      transform: '',
      motionrotation: 0,
      //motioncor: 'path: d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"',
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
      duration: 2.5,
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
        opacity: 1
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
      duration: 2.5,
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
      duration: 2.5,
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
        padding: '15px' //neccarry to get all fonts
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

    if (this.canvas.audio){
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
    if (this.canvas.audio){
      this.stopSound('canvassound', null);
    }
  }

  pauseFunc() {
    this.primairytimeline.pause();
    if (this.canvas.videourl) {
      this.videoPlayer.pause();
    }
    clearTimeout(this.t);

    if (this.canvas.audio){
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
    this.animationarray.splice(i, 1);
    this.selectedelement = undefined;
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

  async combineSVG2(element) {
    //vectstring = await this.deleteMetaSvg(vectstring); //delete background

    // get paths array

    // for each path set new id 
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
        if (idnew === null) {
          vectstring = element.svgcombi;
        } else if (idnew.childNodes[0] !== null) {
          vectstring = idnew.childNodes[0].innerHTML;
        } else {
          vectstring = idnew.childNodes.innerHTML;
        }

        //console.log(vectstring);

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
            this.primairytimeline.to(fromvac, { opacity: 0 }, animation.start_time);
          } else {
            //console.log(vectors, set2, i2)
            let pathid2 = vectors[set2].pathids[i2];
            let tovec = document.getElementById(pathid2); //get element
            //console.log(tovec);
            // hidden is needed for the morph animation but we also need to show the original on finish 
            // opacity can make it appear more gratually which visibility can not
            this.primairytimeline.set(tovec, { opacity: 0 });
            this.primairytimeline.to(tovec, { duration: 1, opacity: 1 }, fintime);
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
              this.primairytimeline.to(fromexvac, { duration: animation.duration, morphSVG: resettovec }, animation.start_time);

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

  addWeatherEffect() {
    console.log(this.canvas.weather);
    let type = this.canvas.weather;
    gsap.set("#weathercontainer", { perspective: 600 })
    // gsap.set("img", { xPercent: "-50%", yPercent: "-50%" })

    let classtype;
    let total = 30;
    if (type === 'snow') { total = 60 }
    if (type === 'rain') { total = 60 }
    if (type === 'leaves') { total = 30 }
    let container = document.getElementById("weathercontainer");
    // container.removeChild   ---> ??
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
      duration: animation.duration,
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

    this.primairytimeline.fromTo(from, fromset, toset, animation.start_time);
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

  async setMorphAni(from, to, animation: animationtype) {
    //console.log(from, to, animation);
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
    this.primairytimeline.to(from, { duration: animation.duration, morphSVG: to, ease: ease }, animation.start_time);
    this.primairytimeline.to(to, { duration: 1, opacity: 1, }, fintime);
    this.primairytimeline.to(from, { duration: 1, opacity: 0 }, fintime);
    // this.primairytimeline.to(to, animation.duration, {opacity, delay: }, animation.start_time);
    return
  }

  async normalizepath(idx, originalsize) {
    return new Promise((resolve, reject) => {
      // example originalsize = {x: 0, y: 0, width: 1496, height: 1496, zoom: 0.06684491978609626}
      let idto = idx;
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

  deleteWhitespaceSVG(): void {
    var element = document.getElementById(this.selectedelement.id);
    var svg = element.getElementsByTagName("svg")[0];
    var bbox = svg.getBBox();
    var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
    svg.setAttribute("viewBox", viewBox);
    this.selectedelement.svgcombi = svg.outerHTML;
    // prompt("Copy to clipboard: Ctrl+C, Enter", svg.outerHTML);
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

  selectMultiplePaths() {
    //console.log(vector, idx, element);
    if (this.selectmultiplepaths === false) {
      this.removeVectorPathMultiSelection()
    } else {
      this.selectedVecPathmultiple.push(this.selectedVecPath);
    }
  }

  clickVectorPaths(e) {
    //console.log(e);
    if (e.target.localName !== 'svg') {

      if (this.selectmultiplepaths === false) {
        if (this.selectedVecPath === e.target) {
          this.removeVectorPathSelection();
        } else {
          this.removeVectorPathSelection();
          this.selectedVecPath = e.target;
          let style = this.selectedVecPath.getAttribute('style');
          let newstyle = style + '; outline: 5px dotted green;';
          this.selectedVecPath.setAttribute('style', newstyle);
        }
      }

      if (this.selectmultiplepaths === true) {
        // check if already selected 
        let exist = this.selectedVecPathmultiple.indexOf(e.target);
        if (exist !== -1) {
          // remove if exist 
          let revertoldstyle = e.target.getAttribute('style');
          let oldstyle = revertoldstyle.replace('; outline: 5px dotted green;', '');
          //console.log(oldstyle);
          e.target.setAttribute('style', oldstyle);
          this.selectedVecPathmultiple.splice(exist, 1);
        } else {
          // if not exists
          let style = e.target.getAttribute('style');
          let newstyle = style + '; outline: 5px dotted green;';
          e.target.setAttribute('style', newstyle);
          this.selectedVecPathmultiple.push(e.target);
        }
      }
    }
  }

  deleteSelectedVectorPath() {
    // delete from pathids
    if (this.selectmultiplepaths) {
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
      this.removeVectorPathSelection();
      this.selectedVecPath.remove();
      this.selectedVecPath = '';
      let idnew = document.getElementById(this.selectedelement.id); // get document
      let vectstring = idnew.innerHTML;
      this.selectedelement.svgcombi = vectstring;
    }
  }

  removeVectorPathMultiSelection() {
    let i = 0;
    let avele = this.selectedVecPathmultiple.length - 1;
    if (this.selectedVecPathmultiple.length > 0) {
      this.selectedVecPathmultiple.forEach(path => {
        let revertoldstyle = path.getAttribute('style');
        let oldstyle = revertoldstyle.replace('; outline: 5px dotted green;', '');
        //console.log(oldstyle);
        path.setAttribute('style', oldstyle);
        //console.log(i, avele);
        if (i === avele) {
          //this.selectedVecPathmultiple = [];
        }
        ++i;
      });

    }
  }


  removeVectorPathSelection() {
    if (this.selectedVecPath) {
      let revertoldstyle = this.selectedVecPath.getAttribute('style');
      let oldstyle = revertoldstyle.replace('; outline: 5px dotted green;', '');
      //console.log(oldstyle);
      this.selectedVecPath.setAttribute('style', oldstyle)
    }
  }

  combineVectors() {
    this.animationarray.forEach((element, index) => {
      if (element.type === 'vector') {
        if (element.selected === true) {
          // combineelement
          // deleteoriginal
        }
      }
    })
  }

  saveAsSeperateVector(): any {
    let svgstring;
    let pathidar = [];

    if (this.selectmultiplepaths) {
      this.removeVectorPathMultiSelection();
      let svgarray = [];

      let i = 0;
      let arraylenght = this.selectedVecPathmultiple.length - 1;
      this.selectedVecPathmultiple.forEach(element => {
        //console.log(element);

        let idx = this.animationarray.length + 1;
        let ind = i + 1;
        let newid = idx + 'elvect-' + ind;

        let oldid = element.getAttribute('id');
        console.log('old & new', oldid, newid);
        let svgel = element;
        let s = new XMLSerializer(); // convert to string
        let stringend = s.serializeToString(svgel);

        let finalstring = stringend.replace(oldid, newid);
        svgarray.push(finalstring);
        pathidar.push(newid);
        console.log(finalstring, pathidar);
        //console.log(i, arraylenght);
        if (i === arraylenght) {
          svgstring = svgarray.join('');
          //console.log(svgstring, svgarray);
          this.createnewsvg(svgstring, pathidar)
        }
        ++i
      });

    } else {
      this.removeVectorPathSelection();
      let svgel = this.selectedVecPath;
      let oldid = svgel.getAttribute('id');
      let s = new XMLSerializer(); // convert to string
      svgstring = s.serializeToString(svgel);
      let idx = this.animationarray.length + 1;
      let ind = 0 + 1;
      let newid = idx + 'elvect-' + ind;
      let finalstring = svgstring.replace(oldid, newid);

      svgstring.replace(oldid, newid);
      pathidar.push(newid);
      this.createnewsvg(svgstring, pathidar);
    }


  }

  createnewsvg(svgstring, pathidar) {
    console.log('start new svg')

    let newsvgarray = [
      '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"' +
      ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"' +
      ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" height="100%" width="100%"' +
      'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
      svgstring, '</svg>'
    ]
    let newsvg = newsvgarray.join('');
    //let originid = this.selectedVecPath.getAttribute('id');

    this.addNewVector(null, this.selectedelement.style.height, this.selectedelement.style.width, newsvg, this.selectedelement.posx, this.selectedelement.posy, pathidar); //, originid
    if (this.selectmultiplepaths) { this.selectedVecPathmultiple = []; }

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
    // let myJSON = await this.jsonVectors();
    let array = this.animationarray;
    let myJSON = JSON.stringify(array);
    //var aniarray = encodeURIComponent(myJSON);
    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    this.filesApi.creategif(this.option.id, this.option.companyId,
      this.elementname, this.canvas, myJSON, this.counter)
      .subscribe(
        res => {
          //console.log(res);
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

    console.log(this.newFiles);
  }

}