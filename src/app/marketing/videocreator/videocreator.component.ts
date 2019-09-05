import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TimelineMax, TweenLite } from 'gsap';
import { TimelineLite, Back, Power1, SlowMo } from 'gsap';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material';

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
    if (el !== undefined){
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

  constructor(
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

  onSliderChange(e){
    this.counter = e.value;
  }

  converttovideo() {
    this.filesApi.createvideo(this.option.id, this.option.companyId, 
      this.elementname, this.canvas, this.animationarray, this.counter)
    .subscribe(
      res => { console.log }
    );
  }

  onSelectElement(element): void {
    this.selectedelement = element;
    console.log(this.selectedelement);
  }

  detectchange(): void {
    console.log('run check', this.animationarray);
    this.animationarray.forEach(elm => {
      if (elm.posx > 0) {
        elm.setpos = { 'x': elm.posx, 'y': elm.posy };
      }
    })
    console.log(this.animationarray)
    // force dom update
    this.changenow = false;
    setTimeout(() => this.changenow = true);
    // wait for dom update to finish otherwise it will create the effects on the old dom
    setTimeout(() =>
      this.animationarray.forEach(elm => {
        this.addEffect(elm);
      })
    );
  }

  onchangevideo(){
    if (this.canvas.videourl){this.canvas['background-color'] = 'transparent'}
    this.changevideo = false;
    setTimeout(() => this.changevideo = true);
  }

  addAnimation(i, element) {
    let duration = element.duration;
    let startime = element.start_time
    let anitype = element.anim_type;
    let rotationcycle = element.rotationcycle;
    let scalesize = element.scalesize;
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
      aniset = {scale: scalesize}
    }
    if (anitype === 'appear') {
      this.selectedelement.style.opacity = 0;
      aniset = {opacity:1};
    }
    if (anitype === 'disappear') {
      aniset = {opacity:0}, {opacity:1};
    }
    if (anitype === 'move') {
      aniset = {y: element.travellocY, x: element.travellocX }
    }  
    this.primairytimeline.to(i, duration, aniset, startime);
    console.log(duration, aniset, startime);
  }


  addEffect(element): void {
    let id = document.getElementById(element.id);
    console.log(id);
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
      travellocX: this.selectedelement.posy+ 300,
      travellocY: this.selectedelement.posx,
      scalesize: 0.5
    }
    this.selectedelement.animation.push(newanimation)
  }

  deleteEffect(i) {
    //reset opacity 
    if ( this.selectedelement.animation[i].anim_type === 'appear') {
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

  onMoving(event, i) {
    this.animationarray[i].posy = event.y;
    this.animationarray[i].posx = event.x;
  }

  onResizing(e, i) {
    this.animationarray[i].style.width = e.size.width + 'px';
    this.animationarray[i].style.height = e.size.height + 'px';
  }


  addNewImage(): void {
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'element';
    } else {
      newelnr = this.animationarray.length + 'element';
    }
    //let elname = 'element' + newelnr;
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
      scalesize: 0.5
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
      newelnr = 0 + 'element';
    } else {
      newelnr = this.animationarray.length + 'element';
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
      scalesize: 0.5
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
      newelnr = 0; //+ 'element';
    } else {
      newelnr = this.animationarray.length;// + 'element';
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
      scalesize: 0.5
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
    return console.log('clicked');
  }

  playFunc() {
    this.detectchange();
    console.log('play');
    //this.progressbarline.play();

    setTimeout(() => {

    if (this.canvas.videourl){
      this.videoPlayer.play();
    }
    if (this.canvas.loop){
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
    if (this.canvas.videourl){
      this.videoPlayer.pause();
    }
    //this.progressbarline.reverse();
    //this.primairytimeline.reverse();
    //this.progressbar.reversed() ?
    //this.progressbarline.progress(0);
  }

  pauseFunc() {
    this.primairytimeline.pause();
    if (this.canvas.videourl){
      this.videoPlayer.pause();
    }
  }

  reverseFunc() {
    this.primairytimeline.reverse();
    if (this.canvas.videourl){
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
    console.log(e);
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
    console.log(this.editablevideo.template)
    this.animationarray = this.editablevideo.template;
    this.canvas = this.editablevideo.canvas[0];
    console.log(this.animationarray, this.canvas);
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


}