import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TimelineMax } from 'gsap';
import { TimelineLite, Back, Power1, SlowMo } from 'gsap';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material';

export class imageanimation {
  type: 'image';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  start_time: number;
  end_time: number;
  anim_type: string;
  duration: number;
  id: number;
}

export class shapeanimation {
  type: 'shape';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    'background-color': string;
  };
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  start_time: number;
  end_time: number;
  anim_type: string;
  duration: number;
  id: number;
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
  }
  posx: number;
  posy: number;
  setpos: object;
  start_time: number;
  end_time: number;
  anim_type: string;
  duration: number;
  id: number;
}


@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss']
})

export class VideocreatorComponent implements AfterViewInit {
  @ViewChild('progressbar', { static: false }) progressbar: ElementRef;

  // @ViewChildren(LightsRowComponent)
  // public rows: QueryList<LightsRowComponent>;

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  @Input() company: Company = new Company;

  // @ViewChild('box1', { static: false }) box: ElementRef;
  // @ViewChildren('btn') btnContainers: QueryList<ElementRef>;

  public t;
  public counter = 1000;
  public currenttime = 0;

  public animationarray = []; //array with style and position settings;
  public animationelements = []; //arrat with the actual greensock animations

  public play = false;
  public menu = new TimelineMax({ paused: true, reversed: true });
  public primairytimeline = new TimelineMax({ paused: true, reversed: true });
  progressbarline =  new TimelineMax({ paused: true, reversed: true });

  public listviewxsshow = false;
  public showprogressbar = false;
  public uploader: FileUploader;
  public newFiles: Files = new Files();
  public changenow = true;
  public shiftX = 0;
  public shiftY = 0;
  public editablevideo: Files;
  public editablevideos: Files[];
  public canvas = {
    width: '600px',
    height: '500px',
    'background-color': '#ffffff',
    position: 'relative',
    videourl: ''
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
    
    if(currentItem !== undefined){
      if(currentItem.currentValue.id !== undefined){
        this.createMenuAnim();
      }
    }
  }


  detectchange(): void {
    console.log('run check', this.animationarray);
    this.animationarray.forEach(elm => {
      if (elm.posx > 0) {
        elm.setpos = { 'x': elm.posx, 'y': elm.posy };
      }
    })
    //console.log(this.animationarray)
    this.changenow = false;
    setTimeout(() => this.changenow = true);
    this.animationarray.forEach(elm => {
      this.addEffect(elm);
    })
  }

  addAnimation(i, element){
    let duration = element.duration;
    let anitype = element.anim_type;
    let aniset; 
    if (anitype === 'rotation'){
      aniset = { rotation: '30', ease: "Expo.easeInOut", onUpdate:this.updateFn('{self}'), onUpdateParams:['{self}']}
    }
    if (anitype === 'translate'){
      aniset = { rotation: '30', ease: "Expo.easeInOut", onUpdate:this.updateFn('{self}'), onUpdateParams:['{self}']}
    }
    this.primairytimeline.to(i, duration, aniset, 0);
    console.log(i);
  }

  updateFn(para) {
    console.log(para);
  }

  addEffect(element): void {
    let id = document.getElementById(element.id);
    console.log(id);
    this.addAnimation(id, element);
  }

  getEditFile() {
    this.relationsApi.getFiles(this.option.id, { where: { template: { "neq":  null } } })
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
    if (this.animationarray.length === -1 ){
      newelnr = 0 + 'element';
    } else {
      newelnr =  this.animationarray.length + 'element';
    }
    //let elname = 'element' + newelnr;
    this.newz = this.newz + 1;
    let img: imageanimation = {
      type: 'image',
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      start_time: 0,
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      id: newelnr
    }
    this.animationarray.push(img);
    this.detectchange();
    //this.addAnimation(newelnr, img);
  }

  addNewShape(): void {
    let newelnr;
    if (this.animationarray.length === -1 ){
      newelnr = 0 + 'element';
    } else {
      newelnr =  this.animationarray.length + 'element';
    }
    this.newz = this.newz + 1;
    let img: shapeanimation = {
      type: 'shape',
      style: {
        'z-index': this.newz,
        width: "200px",
        height: "200px",
        position: 'absolute',
        'background-color': '#000000'
      },
      src: '',
      posx: 50,
      posy: 50,
      setpos: { 'x': 50, 'y': 50 },
      start_time: 0,
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      id: newelnr
    }
    this.animationarray.push(img);
    this.detectchange();
    //this.addAnimation(newelnr, img);
  }

  addNewText(): void {
    let newelnr;
    if (this.animationarray.length === -1 ){
      newelnr = 0; //+ 'element';
    } else {
      newelnr =  this.animationarray.length;// + 'element';
    }
    //let elname = '#element' + newelnr;
    this.newz = this.newz + 1;
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
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      posy: 50,
      setpos: { 'x': 20, 'y': 50 },
      start_time: 0,
      end_time: 10,
      anim_type: 'rotation',
      duration: 0.5,
      id: newelnr
    }
    this.animationarray.push(txt);
    this.detectchange();
    //this.addAnimation(newelnr, txt);
  }


  createMenuAnim() {
    console.log("menu created");
    // this.menu.to("#topLine", .5, { rotation: '30', ease: "Expo.easeInOut" }, 0)
    // this.menu.to("#midLine", .5, { opacity: '0', ease: "Expo.easeInOut" }, 0)
    // this.menu.to("#botLine", .5, { rotation: '-30', ease: "Expo.easeInOut" }, 0)

    //this.progressbarline.to(this.progressbar.nativeElement, 0.2, { x: 100 });
    //this.progressbarline.to(this.progressbar.nativeElement, 1, { y: 50, delay: 1 });
    this.progressbarline.to(this.progressbar.nativeElement, 0.2, { opacity: 0 });
  }

  menuClick() {
    this.menu.reversed() ? this.menu.play() : this.menu.reverse();
    return console.log('clicked');
  }



  playFunc() {
    // this.animationarray.forEach((element, i) => {
    //   this.addAnimation(element.id, element);
    // })
    
    console.log('play')
    this.progressbarline.play();
    this.primairytimeline.play();
    this.t = setInterval(() => { this.incrementSeconds() }, 1000);
  }

  stopFunc() {
    console.log('stop')
    clearTimeout(this.t);
    this.currenttime = 0;
    this.progressbarline.reverse();
    this.primairytimeline.reverse(); 
    //this.progressbar.reversed() ?
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

  
  setbold(img){
    if (img.style['font-weight'] === 'bold'){
      img.style['font-weight'] = '';
    } else{
      img.style['font-weight'] = 'bold';
    }
    this.detectchange();
  }

  setitalic(img){
    if (img.style['font-style'] === 'italic'){
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



}