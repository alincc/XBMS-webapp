import { Component, OnInit, Output, EventEmitter, Input, SimpleChange, SimpleChanges, NgZone } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { gsap } from 'assets/js/all';
import { Physics2DPlugin, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper, Draggable } from 'assets/js/all';
gsap.registerPlugin(Physics2DPlugin, Draggable, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper);
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar, MatDialog, AnimationDurations } from '@angular/material';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
const plugins = [Draggable, InertiaPlugin, DrawSVGPlugin, MorphSVGPlugin, ScrambleTextPlugin, SplitText, Physics2DPlugin, MotionPathPlugin, MotionPathHelper]; //needed for GSAP
import { fonts } from '../../shared/listsgeneral/fonts';
import svgDragSelect from "svg-drag-select";
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { codesnippetService } from '../../dialogsservice/codesnippet-dialog.component';
import { debounceTime } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Position } from 'angular2-draggable';

export class chart {
  type: 'chart';
  groupmember: false;
  start_time: number;
  charttype: string;
  src: string;
  posx: number;
  posy: number;
  setpos: object;
  id: string;
  animation: animationtype[];
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
  label: Label[] = [];
  data: ChartDataSets[];
  productiondata: ChartDataSets[];
  //options: 
  colors: Color[] = [
    { // grey
      backgroundColor: '#232222',
      borderColor: '#232222',
      pointBackgroundColor: '#232222',
      pointBorderColor: '#fff'
    }
  ]
  legend: true;
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    opacity: 1;
  }
  lineChartOptions: ChartOptions = {
    legend: {
      labels: {
        fontFamily: 'Open Sans',
        fontSize: 14,
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInQuad'
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [
        {
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'blue',
            fontSize: 12,
            fontFamily: 'Open Sans',
          }
        }
      ],
      yAxes: [
        {
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
            fontColor: 'blue',
            fontSize: 12,
            fontFamily: 'Open Sans',
          }
        }
      ]
    }
  }
}

export class animationtype {
  start_time: number; //delayt
  end_time: number;
  anim_type: string;
  duration: number;
  ease: string;
  posx: number;
  posy: number;
  rotationcycle: string;
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
  rotationkeeppos: boolean
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
  groupmember: false;
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
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

export class vectorcombinator {
  type: 'vectorcombi';
  groupmember: false;
  vectors: vectoranimation[];
  animation: animationtype[];
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    opacity: 1;
  }
  posx: number;
  posy: number;
  setpos: object;
  id: string;
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

export class vectoranimation {
  groupmember: false;
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
  groupmember: false;
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
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

export class textanimation {
  content: string;
  groupmember: false;
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
  motionpath: string;
  transform: string;
  motionrotation: number;
  rotation: number;
}

@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss']
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

  public edittext = false;
  public draggableObject;
  public pathHelper: MotionPathHelper;
  public snaptogrid = false;
  public snaptogridwidth = 50;
  public snaptogridheight = 50;
  public colorpick = 'white';
  public colorpickline = 'black';
  public linewidth = 2;
  public shapedraw = '';
  public vectorcombiedit = false;
  public whiteboard = false;
  public whiteboardcolor = "#000";
  public whiteboardstokewidth = 2;
  public whiteboardsmoothing = 8;
  public cropimages = false;
  public t; // actual counter
  public counter = 60;
  public currenttime = 0;
  public animationarray = []; //array with style and position settings;
  public play = false;
  public primairytimeline = gsap.timeline({ paused: true, reversed: true }); //gsap timeline control
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
  public selectedVecPath;
  public selectmultiplepaths = false;
  public selectedVecPathmultiple = [];
  public editpath = false;
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
  public snippetcode: string;
  public systembusy = false;
  public history = [];
  public currenthistoryversion = -1;

  @Input() debounceTime = 50;
  @Output() debounceKey = new EventEmitter();
  private keyinput = new Subject();
  private subscription: Subscription;

  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();
  private subscriptionclick: Subscription;

  constructor(
    public codesnippetService: codesnippetService,
    public dialog: MatDialog,
    //private sanitizer: DomSanitizer,
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

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.keyinput.next(event);
  }

  @HostListener('mouseup', ['$event'])
  clickEvent(event) {
    this.clicks.next(event);
  }
  ngOnInit() {
    this.subscription = this.keyinput
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.KeyPress(e));

    this.subscriptionclick = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.saveToLocalStorageHistory());
  }

  KeyPress(evtobj) {
    //console.log(evtobj)
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) { this.historyBack() } // windows
    else if (evtobj.keyCode == 89 && evtobj.ctrlKey) { this.historyForward() } // windows
    else if (evtobj.keyCode == 90 && evtobj.metaKey && !evtobj.shiftKey) { this.historyBack() } // mac
    else if (evtobj.keyCode == 90 && evtobj.metaKey && evtobj.shiftKey) { this.historyForward() } // mac
    else { this.keyinput.next(evtobj) }
  }

  saveToLocalStorageHistory(setnr?) {
    // check if is actually a newer version check last with new is similar
    // triggers on mouseup event set debounce time if triggered to fast see ngoninit
    let jsonaniarray = JSON.stringify(this.animationarray);
    let jsonaniarraylast = JSON.stringify(this.history[this.currenthistoryversion]);
    if (this.currenthistoryversion < this.history.length - 1) {
      this.history = this.history.splice(this.currenthistoryversion + 1, this.history.length - 1)
    }
    if (jsonaniarray !== jsonaniarraylast) {
      this.currenthistoryversion = this.currenthistoryversion + 1;
      this.history.push(this.animationarray);
    }
  }

  historyBack() {
    //console.log('ctrl-z', this.currenthistoryversion)
    // if not last or not empty and if is new; 
    if (this.currenthistoryversion !== 0) {
      this.currenthistoryversion = this.currenthistoryversion - 1;
      let storedback = this.history[this.currenthistoryversion];
      // console.log(this.history, this.currenthistoryversion, storedback);
      this.animationarray = storedback;
    }
  }

  historyForward() {
    //console.log('ctrl-y', this.currenthistoryversion)
    // if not latest or not empty 
    let histlast = this.history.length - 1;
    if (this.currenthistoryversion < histlast) {
      this.currenthistoryversion = this.currenthistoryversion + 1;
      let storedback = this.history[this.currenthistoryversion]
      this.animationarray = storedback;
    }
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

  editMotionPath(animation) {
    this.editpath = true;
    this.setMotionPath(this.selectedelement.id, this.selectedelement, animation);
    //let docset = document.getElementById(this.selectedelement.id);
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

  setEditText() {
    this.edittext = true;
    this.detectchange();
    //console.log('set edit text');
  }

  deSelectAll() {
    this.edittext = false;
    this.setDragSelect(false);
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    this.detectchange();
  }

  onSelectElement(event, element): void {
    //console.log('select element')

    if (!this.selectedelement) { this.selectedelement = element }
    // manual close editpath to prevent interuptions in path check if selectedelement is not already selected
    // set dragpath, whiteboard, ? 
    if (this.editpath === false && this.selectedelement.id !== element.id) {
      if (this.selectedelement.type === 'vector' && this.selectedelement.svgcombi !== '') {
        this.removeVectorPathSelection();
        this.removeVectorPathMultiSelection();
        this.vectorcombiedit = false;
      }
      if (this.whiteboard) { this.deletewhiteboard() }
      this.edittext = false;
      this.selectedVecPath = ';'
      this.setDragSelect(false);
      this.selectedelement = element;
    }
  }

  async setMotionPath(id, element, animation) {
    //this.stopFunc();
    this.removePathEditor();

    this.primairytimeline.kill();
    this.primairytimeline = gsap.timeline({ paused: true, reversed: true });
    const svgpath = document.getElementById(this.selectedelement.id + 'p');
    const docset = document.getElementById(id);

    let ease = this.selectEaseType(animation.easetype);
    let orgin = animation.transformOriginX + ' ' + animation.transformOriginY;

    let rotate;
    if (!animation.rotationkeeppos) {
      gsap.set(docset, {
        xPercent: animation.travellocX, yPercent: animation.travellocY,
        transformOrigin: orgin, autoAlpha: 1
      }); // tranformorgin to set offset??
      rotate = animation.rotationcycle
    } else {
      rotate = false;
      gsap.set(docset, {
        xPercent: animation.travellocX, yPercent: animation.travellocY, autoAlpha: 1,
      });
    }

    this.primairytimeline.to(docset, {
      duration: animation.duration,
      ease: ease,
      repeat: animation.repeat,
      yoyo: animation.yoyo,
      motionPath: {
        path: svgpath,
        //align: svgpath,  // do not use self
        autoRotate: rotate,
      }
    });

    this.pathHelper = MotionPathHelper.create(docset);
  }

  saveNewMotionPath(animation?) {
    // delete copy motion path button --> standard gsap edit see plugin

    if (!animation) { // no animation selected find motion 
      animation = this.selectedelement.animation.filter(obj => {
        return obj.anim_type === 'move'
      });
      if (animation.length > 0) {
        animation = animation[0]; // always returns array
      }
    }

    let id = this.selectedelement.id;
    let newpath = this.pathHelper.getString();//
    this.setNewMotionPath(newpath)
    this.editpath = false;
    this.primairytimeline.kill();
    this.primairytimeline = gsap.timeline({ paused: true, reversed: true });
    this.removePathEditor();
    this.stopFunc();

    setTimeout(() => {
      let element = document.getElementById(id);
      let position = element.getBoundingClientRect();
      let boundelement = document.getElementById('myBounds');
      let boundposition = boundelement.getBoundingClientRect();
      this.selectedelement.posx = position.left - boundposition.left - (position.width * (animation.travellocX / 100));
      this.selectedelement.posy = position.top - boundposition.top - (position.height * (animation.travellocY / 100));
      // console.log(position);
    }, 500)
  }

  setNewMotionPath(newpath) {
    let w = this.canvas.width.replace('px', '');
    let h = this.canvas.height.replace('px', '');
    let newview = '0 0 ' + w + ' ' + h;
    let newsvgpath = '<svg id="' + this.selectedelement.id + 'mp" viewBox="' + newview + '" class="path-edit"><path id="' + this.selectedelement.id + 'p" style="opacity: 0; " d="' + newpath + '" /></svg>';
    this.selectedelement.motionpath = newsvgpath;
  }

  removePathEditor() {
    const patheditor = document.getElementsByClassName('path-editor'); // path-editor
    const patheditorsel = document.getElementsByClassName('path-editor-selection'); // path-editor
    const elements = document.getElementsByClassName('copy-motion-path');
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }

    if (patheditor.length > 0) {
      for (let i = 0; i < patheditor.length; i++) {
        patheditor[i].parentNode.removeChild(patheditor[i]);
      }
    }

    if (patheditorsel.length > 0) {
      for (let i = 0; i < patheditorsel.length; i++) {
        patheditorsel[i].parentNode.removeChild(patheditorsel[i]);
      }
    }
  }

  resetPath() {
    let w = this.canvas.width.replace('px', '');
    let h = this.canvas.height.replace('px', '');
    let newview = '0 0 ' + w + ' ' + h;
    let newpath = 'M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  ';
    let newsvgpath = '<svg id="' + this.selectedelement.id + 'mp" viewBox="' + newview + '" class="path-edit"><path id="' + this.selectedelement.id + 'p" style="opacity: 0; " d="' + newpath + '" /></svg>';
    this.selectedelement.motionpath = newsvgpath;
  }

  detectMorph(value) {
    if (value === 'morph') {
      this.selectedelement.morph = true;
    } else {
      this.selectedelement.morph = false;
      this.selectedelement.vectors.splice(1, 1);
      this.detectchange();
    }
  }

  async detectchange() {
    //this.saveToLocalStorageHistory()

    this.systembusy = false;
    if (this.whiteboard) { this.deletewhiteboard() }
    this.primairytimeline = gsap.timeline({ paused: true, reversed: true });
    // console.log('run check', this.ani§mationarray);
    if (this.editpath === true) {
      this.saveNewMotionPath();
    }
    // force dom update
    this.changenow = false;
    setTimeout(() => { this.changenow = true }, 10);
    //setTimeout(() => {
    // setTimeout(async () => { this.changenow = true; return });
    await new Promise(resolve => setTimeout(resolve, 100));
    // wait for dom update to finish otherwise it will create the effects on the old dom
    if (this.canvas.weather !== '') { this.addWeatherEffect() };

    for (let i = 0; i < this.animationarray.length; i++) {
      const elm = this.animationarray[i];

      if (elm.type === 'chart') {
        elm.productiondata = [
          { data: [0, 0, 0], label: 'Series A' },
          { data: [0, 0, 0], label: 'Series B' }
        ];
        this.primairytimeline.call(this.setChartData, [elm], elm.start_time);
      }

      if (elm.type === 'vector') { //vector animation
        for (let i2 = 0; i2 < elm.vectoranimation.length; i2++) {
          const vecani = elm.vectoranimation[i2];
          if (vecani.svganimationtype === 'draw') { this.drawVector(elm, vecani) }
          if (vecani.svganimationtype === 'morph') {
            if (elm.vectors.length > 1) {
              this.createMorph(elm, vecani)
            }
          }
        }
      }

      if (elm.type === 'text') {
        for (let i3 = 0; i3 < elm.splittextanimation.length; i3++) {
          const textani: splittexttype = elm.splittextanimation[i3];
          if (textani.textanimationtype) { this.createSplitText(elm, textani) }
        }
      }

      //setTimeout(() => {
      this.setPosition(elm);
      this.addEffect(elm); //normal animatoin
      //}, 100);
    }

  }

  setChartData(elm) {
    elm.productiondata = elm.data;
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
    let lengtharr;
    if (textani.textanimationtype === 'chars') { setto = char; lengtharr = char.length }
    if (textani.textanimationtype === 'words') { setto = word; lengtharr = word.length }
    if (textani.textanimationtype === 'lines') { setto = line; lengtharr = line.length }
    let dura = textani.duration / lengtharr;
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

  onchangecanvas() {
    if (this.canvas.videourl) { this.canvas['background-color'] = 'transparent' }

    this.animationarray.forEach(element => {
      let w = this.canvas.width.replace('px', '');
      let h = this.canvas.height.replace('px', '');
      let newview = '0 0 ' + w + ' ' + h;
      //let id = element.id + 'mp';
      //let svg = document.getElementById(id);
      //svg.setAttribute('viewBox', newview);
      //element.motionpath = svg.outerHTML;
      var regex = /viewBox="(.*?)"/;
      var strToMatch = element.motionpath;
      var matched = regex.exec(strToMatch);
      //console.log(matched, newview);
      element.motionpath = element.motionpath.replace(matched[1], newview);
      //console.log(element);
    });
    this.changevideo = false;
    setTimeout(() => this.changevideo = true);

    // for (let i = 0; i < paths.length; i++){
    //   paths[i].setAttribute('viewbox', newview)
    // }
  }

  onchangeaudio() {
    // ??
  }

  playSound(id, src, loop) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    //console.log(id, audio);
    audio.play();
    audio.loop = loop;
  }

  pauseSound(id, src) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    //console.log(audio);
    audio.pause();
  }

  stopSound(id, src) {
    let audio = document.getElementById(id) as HTMLAudioElement;
    //console.log(audio);
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
      aniset = {
        duration: duration,
        autoAlpha: 1, ease: ease, repeat: repeat, yoyo: element.yoyo
      };
    }

    if (anitype === 'move') {
      let svgset = document.getElementById(elementA.id + 'p');
      let orgin = element.transformOriginX + ' ' + element.transformOriginY;

      let rotate;
      if (!element.rotationkeeppos) {
        gsap.set(iset, { xPercent: element.travellocX, yPercent: element.travellocY, transformOrigin: orgin, autoAlpha: 1 }); // tranformorgin to set offset??
        rotate = element.rotationcycle
      } else {
        gsap.set(iset, { xPercent: element.travellocX, yPercent: element.travellocY, autoAlpha: 1 }); // tranformorgin to set offset??
        rotate = false;
      }

      aniset = {
        duration: duration,
        ease: ease,
        repeat: repeat,
        yoyo: element.yoyo,
        immediateRender: true,
        motionPath: {
          path: svgset,
          autoRotate: rotate,
          align: svgset//'self'
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
      if (element.fromto === 'from') {
        this.primairytimeline.from(iset, aniset, starttime);
      }
      if (element.fromto === 'to') {
        this.primairytimeline.to(iset, aniset, starttime);
      }
    }

    if (anitype === 'fountain') {
      let qty = 80;
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
        let parent = iset.parentElement;
        parent.append(cln);
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

      // this.primairytimeline.to(iset,
      //   {
      //     duration: duration,
      //     ease: ease, repeat: repeat, yoyo: element.yoyo, delay: seperation,
      //     motionPath: {
      //       path: svgset2, //'id + p'
      //       autoRotate: 90,
      //       //immediateRender: true
      //     }
      //   }, starttime);

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
              x: elementA.posx,
              y: elementA.posy,
              ease: ease, repeat: repeat, yoyo: element.yoyo, delay: i + 1 * seperation,
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
              x: elementA.posx,
              y: elementA.posy,
              ease: ease, repeat: repeat, yoyo: element.yoyo, delay: i * seperation,
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
    let i = 0;
    let id = document.getElementById(element.id);
    // for (let i = 0; i < element.animation.length; i++) {
    //  console.log('effect')
    //   let animationsection = element.animation[i];
    //   this.addAnimation(id, animationsection, element, i);
    // }
    element.animation.forEach(animationsection => {
      this.addAnimation(id, animationsection, element, i);
      ++i;
    });

  }

  addNewEffect(element): void {
    if (this.whiteboard) { this.deletewhiteboard() }
    let rotationcycle = '0';
    if (this.selectedelement.rotation !== 0) {
      rotationcycle = this.selectedelement.rotation;
    }
    let newanimation: animationtype = {
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: this.selectedelement.posx,
      posy: this.selectedelement.posy,
      rotationcycle: rotationcycle,
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
    }
    this.selectedelement.animation.push(newanimation);
    this.detectchange();
    //console.log(this.selectedelement);
  }

  deleteEffect(i) {
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
      for (let y = 0; y < newVectorElement.vectors.length; y++) {
        let vector = newVectorElement.vectors[y];
        let addnr = y;
        let idnr = newElement.id + 'vec-' + addnr;
        vector.idx = idnr;

        this.renumberSvgIds(newVectorElement.svgcombi, vector.idx, vector.pathids).then(newvectstring => {
          let pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
          //console.log( newvectstring);
          this.cleantags(pathidar).then(paths => {
            vector.pathids = [];
            paths.forEach((newpat: string) => {
              vector.pathids.push(newpat);
            });
          });
        });
      }
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
    //console.log(e, i, idx, vectorid);
    this.systembusy = true;
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
          getview = document.getElementById('previewbox' + i); //was i 
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
        //console.log("vector groups deleted");
        await this.resizeVector(originalsize, newsize, idx, vectorid);
        //console.log("vector resized");
        await this.combineSVGs(this.animationarray[i], originalsize);
        //console.log("vectors combined");

        resolve();
      })
    }
    this.systembusy = false;
  }


  drawVector(vector, animation: vectoranimationtype) {
    return new Promise(async (resolve, reject) => {
      if (vector.vectors.length > 0) {
        let list = vector.vectors[0].pathids;
        let vecttmp = document.getElementById(vector.id);
        let vect = vecttmp.getElementsByTagName('svg')[0];
        for (const pathid of list) {
          let fromvac = vect.getElementById(pathid);
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

  onMovingAnimationChart(event, i, selectedelement) {
    selectedelement.start_time = event.x / 10;
    //this.saveToLocalStorageHistory();   
  }

  onResizeAnimationChart(event, iv, selectedelement) {
    selectedelement.lineChartOptions.animation.duration = event.size.width * 100;
    //this.saveToLocalStorageHistory();   
  }

  onMovingAnimationEl(event, i, animation) {
    animation.start_time = event.x / 10;
    //this.saveToLocalStorageHistory();   
  }

  onResizeAnimationEl(event, i, animation) {
    animation.duration = event.size.width / 10;
    //this.saveToLocalStorageHistory();   
  }

  onMovingTimeline(event, i) {
    this.currenttime = event.x / 10;
  }

  // onMoving(event, i, idy?) {
  //   let idel = this.animationarray[i];
  //   if (idy) { idel = idel.vectors[idy] }
  //   idel.posy = event.y;
  //   idel.posx = event.x;
  //   if (idy) { this.onSetCombiBox(i) }
  //   let animation =  idel.animation.filter(obj => {
  //     return obj.anim_type === 'move'
  //   });
  //  console.log(animation, idel)
  //   if (animation.length > 0){
  //     let rawpath = document.getElementById(this.selectedelement.id).getAttribute('d');
  //     let newpath = MotionPathPlugin.transformRawPath(rawpath, 1, 0, 0, 1, idel.posx, idel.posy);
  //    console.log(newpath);
  //     this.setNewMotionPath(newpath);
  //   }
  // }


  setPosition(idel) {
    //console.log('set pos', idel)
    //if animation is move --> path determines position
    let elm = document.getElementById(idel.id);
    gsap.set(elm, { x: idel.posx, y: idel.posy, rotation: idel.rotation });
  }

  private setMoveableItem = async (idel) => {

    let newy = this.draggableObject.y - idel.posy;
    let newx = this.draggableObject.x - idel.posx;
    idel.posy = this.draggableObject.y;
    idel.posx = this.draggableObject.x;
    //console.log(newy, newx);
    let animation = idel.animation.filter(obj => {
      return obj.anim_type === 'move'
    });
    if (animation.length > 0) {
      let path = await document.getElementById(idel.id + 'p');
      let rawpath = await MotionPathPlugin.getRawPath(path);
      let newpath = await MotionPathPlugin.transformRawPath(rawpath, 1, 0, 0, 1, newx, newy);
      let stringpath = await MotionPathPlugin.rawPathToString(newpath);
      this.setNewMotionPath(stringpath);
    }
    this.draggableObject.disable();
  }

  enableDraggable() {
    let el = document.getElementById(this.selectedelement.id) as unknown
    let element = el as Draggable;
    if (typeof element.disable === 'function') {
      element.enable();
    }
  }

  disableDraggable() {
    let el = document.getElementById(this.selectedelement.id) as unknown
    let element = el as Draggable;
    if (typeof element.disable === 'function') {
      element.disable();
    }
  }


  setDraggable(event, idel) {

    // Draggable does not recognise ts angular so changes are direct dom js related
    if (this.dragselectvectpath === false && this.vectorcombiedit === false) {
      // console.log('setdrag')
      let element = document.getElementById(idel.id);
      let snap, inertia = false;
      if (this.snaptogrid) {
        snap = {
          x: function (endValue) {
            return Math.round(endValue / this.snaptogridwidth) * this.snaptogridwidth;
          },
          y: function (endValue) {
            return Math.round(endValue / this.snaptogridheight) * this.snaptogridheight;
          }
        }
        inertia = true
      }


      if (event.target.id === idel.id + 'rotatehandle') {
        this.setRotate(event, idel)
      } else {
        this.draggableObject = new Draggable(element, {
          type: "x,y",
          onDragEndParams: [idel],
          onDragEnd: this.setMoveableItem,
          snap: snap
        });
      }
    } else { this.disableDraggable(); }
  }

  setRotate(event, idel) {
    let el = document.getElementById(idel.id) as unknown
    let element = el as Draggable;
    Draggable.create(element, {
      type: "rotation",
      onDragEndParams: [idel],
      onDragEnd:
        function (idl) {
          idl.rotation = this.rotation;
          this.disable();
        }
    })
  }


  onSetCombiBox(i) {
    let vectorcombi: vectorcombinator = this.animationarray[i];
    let vectors = vectorcombi.vectors;
    let x = vectors[0].posx;
    let y = vectors[0].posy;
    let widthcalc = parseInt(vectors[0].style.width, 10) + x;
    let heightcalc = parseInt(vectors[0].style.height, 10) + y;
    for (let k = 1; k < vectors.length; k++) {

      let width = parseInt(vectors[k].style.width, 10)
      let height = parseInt(vectors[k].style.height, 10)
      if (vectors[k].posx < x) { x = vectors[k].posx; }
      if (vectors[k].posy < y) { y = vectors[k].posy; }
      if (width + vectors[k].posx > widthcalc) { widthcalc = width + vectors[k].posx }
      if (height + vectors[k].posy > heightcalc) { heightcalc = height + vectors[k].posy }
    }
    let widthcalcfin = widthcalc - x;
    let heightcalcfin = heightcalc - y;
    vectorcombi.style.width = widthcalcfin + 'px';
    vectorcombi.style.height = heightcalcfin + 'px';
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

  addNewVectorCombi() {
    this.newz = this.newz + 1;
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'el';
    } else {
      newelnr = this.animationarray.length + 'el';
    }
    let newvectorcombi: vectorcombinator = {
      type: 'vectorcombi',
      groupmember: false,
      vectors: [],
      animation: [],
      style: {
        'z-index': this.newz,
        width: this.canvas.width,
        height: this.canvas.height,
        position: 'absolute',
        opacity: 1
      },
      posx: 0,
      posy: 0,
      setpos: {},
      id: newelnr,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',
    }
    this.animationarray.push(newvectorcombi);
  }

  addTooVectorCombi(value) {

    // console.log(value);
  }

  async dropVectorGroup(value, element, i) {
    let newel = value.value;
    if (newel.type === 'vector') {
      let found = false;
      newel.groupmember = true;
      for (let i = 0; i > element.vectors.length; i++) {
        if (JSON.stringify(element.vectors[i]) === JSON.stringify(newel)) {
          found = true;
        }
      }

      if (found === false) {
        element.vectors.push(newel);
      }

      //console.log(element, newel, found);
      this.onSetCombiBox(i)
    }
  }

  addNewVector(src?, height?, width?, svgcombi?, posx?, posy?, pathidar?): void { //, originid?

    let svgc = '';
    let newsrc = '';
    let newheight = '300px';
    let newwidth = '300px';
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

    let vectorid = newelnr + 'vec-' + 1;
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
      rotationcycle: '360',
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: '',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
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
      groupmember: false,
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
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',
    }
    this.animationarray.push(vector);
    this.onSelectElement(null, vector);
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
    if (this.whiteboard) { this.deletewhiteboard() }
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
      rotationcycle: '360',
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
    }];
    let img: imageanimation = {
      type: 'image',
      groupmember: false,
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        opacity: 1,
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
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',
    }
    this.animationarray.push(img);
    this.selectedelement = img;
    this.detectchange();
  }

  addNewShape(): void {
    if (this.whiteboard) { this.deletewhiteboard() }
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
      rotationcycle: '360',
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
    }];
    let img: shapeanimation = {
      groupmember: false,
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
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',

    }
    this.animationarray.push(img);
    this.selectedelement = img;
    this.detectchange();

  }

  addNewChart(): void {
    if (this.whiteboard) { this.deletewhiteboard() }
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0 + 'el';
    } else {
      newelnr = this.animationarray.length + 'el';
    }
    this.newz = this.newz + 1;
    let colorset: Color[] = [
      { // grey
        backgroundColor: '',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      },
      { // grey
        backgroundColor: '',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      }
    ];
    let lineChartOptions: ChartOptions = {
      legend: {
        labels: {
          fontFamily: 'Open Sans',
          fontSize: 14
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInQuad'
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        xAxes: [
          {
            gridLines: {
              color: 'rgba(0,0,0,0.3)',
            },
            ticks: {
              fontColor: 'black',
              fontFamily: 'Open Sans',
              fontSize: 12,
              suggestedMin: 0,
              suggestedMax: 100,
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              color: 'rgba(0,0,0,0.3)',
            },
            ticks: {
              fontColor: 'black',
              fontFamily: 'Open Sans',
              fontSize: 12,
              suggestedMin: 0,
              suggestedMax: 100,
            }
          }
        ]
      }
    };
    let anim: animationtype[] = [{
      start_time: 0, //delayt
      end_time: 10,
      anim_type: 'scale',
      duration: 3,
      ease: '',
      posx: 0,
      posy: 0,
      rotationcycle: '360',
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
    }];
    let chart: chart = {
      groupmember: false,
      start_time: 0,
      type: 'chart',
      src: '',
      charttype: 'line',
      id: newelnr,
      label: ['January', 'February', 'March'],
      data: [
        { data: [65, 59, 40], label: 'Series A' },
        { data: [28, 27, 90], label: 'Series B' }
      ],
      productiondata: [
        { data: [0, 0, 0], label: 'Series A' },
        { data: [0, 0, 0], label: 'Series B' }
      ],
      //options: 
      colors: colorset,
      legend: true,
      style: {
        'z-index': this.newz,
        width: '400px',
        height: '220px',
        position: 'absolute',
        opacity: 1
      },
      posx: 20,
      posy: 50,
      setpos: { 'x': 20, 'y': 50 },
      animation: anim,
      lineChartOptions: lineChartOptions,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',
    }
    this.animationarray.push(chart);
    //console.log(chart);
  }

  addNewWhiteboard(): void {
    if (this.whiteboard === false) {
      this.whiteboard = true;
      this.selectedelement = '';
      window.scrollTo(0, 0);

      setTimeout(() => {
        //  https://stackoverflow.com/questions/40324313/svg-smooth-freehand-drawing
        var bufferSize;
        var svgElement = document.getElementById("svgElement");
        var rect = svgElement.getBoundingClientRect();
        var path = null;
        var strPath;
        var buffer = []; // Contains the last positions of the mouse cursor
        let firstpoint;
        let firstpointcircle;
        let w = this.canvas.width.replace('px', '');
        let h = this.canvas.height.replace('px', '');
        let newview = '0 0 ' + w + ' ' + h;
        svgElement.setAttribute('viewBox', newview);

        svgElement.addEventListener("mousedown", (e) => {
          //bs = document.getElementById("cmbBufferSize") as unknown;
          bufferSize = this.whiteboardsmoothing;
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", this.whiteboardcolor);
          path.setAttribute("stroke-width", this.whiteboardstokewidth);
          buffer = [];
          var pt = getMousePosition(e);
          // console.log(e)
          appendToBuffer(pt);


          firstpoint = { x: pt.x, y: pt.y };

          switch (this.shapedraw) {
            case 'circle':
              strPath = 'M ' + rect.top + ' ' + rect.left +
                'm -' + 0 + ', 0' +
                'a' + 0 + ',' + 0 + ' 0 1,0' + 0 * 2 + ',0' +
                'a' + 0 + ',' + 0 + ' 0 1,0 -' + 0 * 2 + ',0'
              break;
            case 'rectangle':
              strPath = 'M ' + pt.x + ' ' + pt.y + ' H ' + pt.x + ' V ' + pt.y + ' H ' + pt.x + ' Z';
              //strPath = 'M ' + pt.x + ' ' + pt.y + ' H ' + pt.x + ' V ' + pt.y + ' H ' + 'Z';
              break;
            default:
              strPath = "M" + pt.x + " " + pt.y;
          }

          //strPath = "M" + pt.x + " " + pt.y;
          path.setAttribute("d", strPath);
          svgElement.appendChild(path);
        });

        svgElement.addEventListener("mousemove", (e) => {
          if (path) {
            switch (this.shapedraw) {
              case 'circle':
                updateSvgPathCircle(e);
                break;
              case 'rectangle':
                updateSvgPathRect(e);
                break;
              default:
                appendToBuffer(getMousePosition(e));
                updateSvgPath();
            }
          }
        });

        svgElement.addEventListener("mouseup", function () {
          if (path) {
            path = null;
          }
          if (firstpoint) {
            firstpoint = null;
          }
        });

        var getMousePosition = function (e) {
          return {
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
          }
        };

        var appendToBuffer = function (pt) {
          buffer.push(pt);
          while (buffer.length > bufferSize) {
            buffer.shift();
          }
        };

        var updateSvgPathCircle = function (e) {
          var pl = svgElement.getElementsByTagName('path').length;
          let ptl = getMousePosition(e);
          ptl.x = ptl.x / 1.5;
          ptl.y = ptl.y / 1.5;
          strPath = 'M ' + firstpoint.x + ' ' + firstpoint.y +
            'm ' + ptl.x / (-2) + ', 0' +
            'a' + ptl.x / 2 + ',' + ptl.x / 2 + ' 0 1,0 ' + ptl.x + ',0' +
            'a' + ptl.x / 2 + ',' + ptl.x / 2 + ' 0 1,0 ' + ptl.x * (-1) + ',0'
          path.setAttribute("d", strPath);
          path.setAttribute("id", pl + 1);
        }

        var updateSvgPathRect = function (e) {
          var pl = svgElement.getElementsByTagName('path').length;
          let ptl = getMousePosition(e);
          strPath = 'M ' + firstpoint.x + ' ' + firstpoint.y + ' H ' + ptl.x + ' V ' + ptl.y + ' H ' + firstpoint.x + ' Z';
          path.setAttribute("d", strPath);
          path.setAttribute("id", pl + 1);
        }

        // Calculate the average point, starting at offset in the buffer
        var getAveragePoint = function (offset) {
          var len = buffer.length;
          if (len % 2 === 1 || len >= bufferSize) {
            var totalX = 0;
            var totalY = 0;
            var pt, i;
            var count = 0;
            for (i = offset; i < len; i++) {
              count++;
              pt = buffer[i];
              totalX += pt.x;
              totalY += pt.y;
            }
            return {
              x: totalX / count,
              y: totalY / count
            }
          }
          return null;
        };

        var updateSvgPath = function () {
          var pt = getAveragePoint(0);
          var pl = svgElement.getElementsByTagName('path').length;

          if (pt) {
            // Get the smoothed part of the path that will not change
            strPath += " L" + pt.x + " " + pt.y;

            // Get the last part of the path (close to the current mouse position)
            // This part will change if the mouse moves again
            var tmpPath = "";
            for (var offset = 2; offset < buffer.length; offset += 2) {
              pt = getAveragePoint(offset);
              tmpPath += " L" + pt.x + " " + pt.y;
            }

            // Set the complete current path coordinates
            path.setAttribute("d", strPath + tmpPath);
            path.setAttribute("id", pl + 1);
          }
        };
      }, 300) // mininmum needed for dom to process
    }
  }

  async savewhiteboard() {
    var svgElement = document.getElementById("svgElement");

    // convert to proper type
    let svg = svgElement as unknown;
    let svg2 = svg as SVGAElement;
    var rect = svg2.getBBox();
    let height = rect.height + 'px';
    let width = rect.width + 'px';

    let newsvg = svgElement.outerHTML;
    let newelnr;
    if (this.animationarray.length === -1) {
      newelnr = 0; //+ 'el';
    } else {
      newelnr = this.animationarray.length;// + 'el';
    }

    // rename ids 
    let pathidar = svgElement.innerHTML.match(/id="(.*?)"/g); //get ids
    let idnr = newelnr + 'vec-' + 1;
    let newvectstring = await this.renumberSvgIds(newsvg, idnr, pathidar);
    let pathidarfinal = newvectstring.match(/id="(.*?)"/g); //get ids
    newvectstring = newvectstring.replace(pathidarfinal[0], 'id=svgDraw')
    pathidarfinal.splice(0, 1);

    for (let i = 0; i < pathidarfinal.length; i++) {
      pathidarfinal[i] = pathidarfinal[i].replace('id=', '');
      pathidarfinal[i] = pathidarfinal[i].replace(/"/g, '')
    }
    this.addNewVector(
      null,
      height,
      width,
      newvectstring,
      rect.x, rect.y, pathidarfinal);

    this.deletewhiteboard()
  }

  deletewhiteboard() {
    var svgElement = document.getElementById("svgElement");
    var new_element = svgElement.cloneNode(true);
    svgElement.parentNode.replaceChild(new_element, svgElement);
    this.whiteboard = false;
  }

  addNewText(): void {
    if (this.whiteboard) { this.deletewhiteboard() }
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
      rotationcycle: '360',
      travellocX: -50,
      travellocY: -50,
      scalesize: 0.8,
      skewY: 50,
      skewX: 50,
      easetype: 'elastic',
      fromto: 'to',
      transformOriginX: '50%',
      transformOriginY: '50%',
      repeat: 0,
      yoyo: false,
      audioeffectsrc: '',
      rotationkeeppos: false
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
      groupmember: false,
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
      },
      content: 'start writing',
      posx: 20,
      posy: 50,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      splittextanimation: splittext,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      motionpath: '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 600 500" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
        ' d="M15.458,45.741 C15.458,45.741 441.46,44.534 513.889,44.457  " /></svg>',
    }
    this.animationarray.push(txt);
    this.selectedelement = txt;
    this.detectchange();
  }

  deleteTextAnimation(iv) {
    this.selectedelement.splittextanimation.splice(iv, 1);
  }

  vectorcombieditSet(i) {
    this.animationarray[i].vectors.forEach(element => {
      //this.createRotate(element);
    });
  }

  async playFunc() {
    console.log('play', this.primairytimeline.time());
    // clean up edits 
    this.removeVectorPathMultiSelection();
    this.removeVectorPathSelection();
    this.vectorcombiedit = false;

    this.setDragSelect(false);
    if (this.currenttime === 0) { this.detectchange() }

    await new Promise(resolve => setTimeout(resolve, 400));
    if (this.canvas.audio) {
      this.playSound('canvassound', null, this.canvas.loop);
      this.primairytimeline.eventCallback("onComplete", this.stopSound, ['canvassound', null]);
    }
    // clean up for play
    // this.selectedVecPath = false; !! is object not boolean??
    clearTimeout(this.t); //to make sure there is no second loop
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
  }

  stopFunc() {
    console.log('stop')
    this.removeVectorPathMultiSelection();
    this.removeVectorPathSelection();

    if (this.t) {
      clearTimeout(this.t);
      this.t = null;
    }

    this.currenttime = 0;
    //this.primairytimeline.restart();
    this.primairytimeline.time(0)
    this.primairytimeline.pause();
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
  }

  deletevcgroup(i) {
    this.animationarray[i].vectors.forEach(element => {
      element.groupmember = false;
    });
    this.animationarray.splice(i, 1);
  }

  deleteitemvcgroup(i, idy) {
    this.animationarray[i].vectors[idy].groupmember = false;
    this.animationarray[i].vectors.splice(idy, 1)
  }

  swiperight(e) {
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    this.listviewxsshow = false;
  }

  setVideo(event) {
    this.canvas.videourl = event;
    this.onchangecanvas();
  }

  setAudio(event, animation) {
    //console.log('audio file', event, animation)
    animation.audioeffectsrc = event;
    // delete this.onchangeaudio();
  }

  setAudioCanvas(event) {
    //console.log('audio canvas file', event)
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
    return svg;
  }

  previewSVGBig(svg: SVGElement, parent): SVGElement {
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
      let total = []; // array to combine all parts
      let h = 500, w = 500, x = 0, y = 0;
      let startstr;
      let originalsize = newsize; // get original viewbox
      if (originalsize) {
        x = originalsize['x'];
        y = originalsize['y'];
        w = originalsize['width']; // * newscale1;
        h = originalsize['height']; // * newscale1;
      }
      startstr = '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox="' + x + ' ' + y + ' ' + w + ' ' + h + '" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">';
      total.push(startstr);

      for (let w = 0; w < element.vectors.length; w++) {
        let vect = element.vectors[w]
        idnew = document.getElementById(vect.idx);
        let defs = idnew.getElementsByTagName('defs');
        for (let y = 0; y < defs.length; y++) {
          let defstring = defs[y];
          total.push(defstring.outerHTML)
        }
      }

      let index = 0;

      for (let z = 0; z < element.vectors.length; z++) {
        let vect = element.vectors[z];
        idnew = document.getElementById(vect.idx); // get document
        const stylstr = idnew.getElementsByTagName('style');

        if (stylstr.length > 0) {
          total.push(stylstr[0].outerHTML);
        }

        //console.log(idnew);
        let vectstring;
        let svgset = idnew.getElementsByTagName('svg');
        if (idnew === null) {
          vectstring = element.svgcombi;
        } else if (svgset.length > 0) {
          vectstring = svgset[0].innerHTML; //was outerhtml 
        } else {
          console.log('can not load SVG', idnew)
        }

        //console.log(idnew, vectstring)

        let pathidar;
        let newvectstring;
        pathidar = vectstring.match(/id="(.*?)"/g); //get ids
        newvectstring = await this.grabPaths(vectstring, pathidar);
        pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
        newvectstring = await this.renumberSvgIds(newvectstring, vect.idx, pathidar); // set ids
        pathidar = newvectstring.match(/id="(.*?)"/g); //get ids
        pathidar = await this.cleantags(pathidar);
        element.vectors[index].pathids = pathidar;
        total.push(newvectstring);
        ++index;
      }
      total.push('</svg>');
      let childrenst = total.join('');
      element.svgcombi = childrenst;
      element.style.height = h + 'px';
      element.style.width = w + 'px';
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
              const newid = '0elvect-res' + ix;
              const checkifexit = document.getElementById(newid)
              if (checkifexit == null){
                const newElement = fromel.cloneNode(true) as HTMLElement;
                newElement.setAttribute('id', newid);
                svgnew.insertAdjacentElement('afterbegin', newElement)
                //svgnew.appendChild(newElement);
                vectornewpath = document.getElementById('0elvect-res' + ix);
              } else {
                vectornewpath = checkifexit;
              }
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
    let type = this.canvas.weather;
    let classtype;
    let total = 30;

    if (type === 'snow') { total = 60 }
    if (type === 'rain') { total = 60 }
    if (type === 'leaves') { total = 50 }
    if (type === 'sun') { total = 90 } // also depends on the angle this case is 90 degrees
    if (type === 'clouds') { total = 20 }
    let container = document.getElementById("weathercontainer");
    // container.removeChild   ---> ??
    container.innerHTML = '';

    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let LeafL = window.innerHeight;
    let LeafR = window.innerWidth;
    let canvasposL = 0;
    let canvasposR = container.offsetWidth;
    let heightani = h * -1;
    let heightanibottom = heightani - 100; // total area from above the square to lower edge
    let heightanitop = heightanibottom * 2;
    let widthaniside = (w * -1) * 2;

    if (type === 'sun') {
      let sun = document.createElement('div');
      this.primairytimeline.set(sun, { attr: { class: 'sun' }, x: w - 70, y: -30 });
      container.appendChild(sun);
    }

    const svgurl = 'https://api.xbms.io/api/Containers/5a2a4e745c2a7a06c443533f/download/2x0vzs.svg';

    for (let i = 0; i < total; i++) {
      let Div = document.createElement('div');
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
      if (type === 'clouds') {
        gsap.set(Div, { attr: { class: 'cloud' }, x: this.R(w, widthaniside), y: this.R(0, h * 0.1), z: this.R(-200, 200), scale: this.R(0.5, 1.5) });
      }
      if (type === 'clouds') { this.animclouds(Div, h, w); }
      if (type === 'snow') { this.animsnow(Div, h); }
      if (type === 'rain') { this.animrain(Div, h); }
      if (type === 'leaves') { this.animleaves(Div, h); }
      if (type === 'sun') {
        let angle = (270 + i) * (Math.PI / 180);
        let xa = w - (Math.cos(angle) * w); // w
        let ya = -1 * (Math.sin(angle) * h); // h
        gsap.set(Div, { attr: { class: 'sunray' }, x: w + 10, y: -10, rotation: i + "_short", });
        this.animsun(Div, ya, xa);
      }


      container.appendChild(Div);
    }
  }

  animsun(elm, h, w) {
    this.primairytimeline.to(elm, { duration: 10, y: h, x: w, ease: 'linear.none', repeat: -1, delay: 0 }, this.R(0, 10));
  }

  animclouds(elm, h, w) {
    this.primairytimeline.to(elm, { duration: 15, x: '+=200', ease: 'linear.none', repeat: -1, delay: 0 }, 0);
  } // y: h, '+=' + w

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

  async renumberSvgIds(svgstring, idx, pathidar) {
    let newsvgstring = svgstring;
    let index = 0;
    for (const element of pathidar) {
      let ind = index + 1;
      let newid = 'id="' + idx + ind + '"';
      newsvgstring = await this.runloop(newsvgstring, element, newid);
      ++index;
    };
    return newsvgstring;
  }

  async runloop(newsvgstring, element, newid) {
    newsvgstring = newsvgstring.replace(element, newid);
    return newsvgstring
  }

  grabPaths(svgstring, pathidar) {
    return new Promise((resolve, reject) => {
      let svgarray = [];
      // const element of pathidar
      for (let i = 0; i < pathidar.length; i++) {
        let n = svgstring.indexOf('<path ');
        let lx = svgstring.indexOf('</path>'); //<defs
        let l = lx + 7;
        if (n !== -1) {
          svgarray.push(svgstring.substring(n, l));
          svgstring = svgstring.replace(svgstring.substring(n, l), '');
        }
      }
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
      // svgstring = svgstring.replace(/stroke:none/g, '');
      // svgstring = svgstring.replace(/stroke: none/g, '');
      // n = svgstring.indexOf('<defs');
      // lx = svgstring.indexOf('</defs>'); //<defs
      // l = lx + 7;
      // if (n !== -1) {
      //   svgstring = svgstring.replace(svgstring.substring(n, l), '');
      // }
      resolve(svgstring)
    })
  }

  async deleteVectorGroup(id) {
    return new Promise(async (resolve, reject) => {
      let groupElement;
      let e = document.getElementById(id);
      let g = e.getElementsByTagName("g");
      if (g.length < 1000) {
        // console.log(g)
        for (let index = 0; index < g.length; index++) {  // ---> g.length
          g[index].setAttribute("id", id + index + 'g');
          let sg = id + index + 'g';
          groupElement = SVG.get(sg);
          if (typeof groupElement.ungroup === "function") {
            groupElement.ungroup(groupElement.parent());
          }
        }
      }
      resolve();
    })
  }

  async resizeVector(originalsize, newsize, idx, vectorid) {
    return new Promise(async (resolve, reject) => {
      let e = document.getElementById(vectorid);

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
      // console.log(e, p)
      for (let index = 0; index < p.length; index++) {

        p[index].setAttribute("id", "child-" + index + idx); // keep in case there is no ID set
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



  deleteWhitespaceSVG(): void {
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    setTimeout(() => {
      // console.log('delete whitespace', this.selectedelement);
      var element = document.getElementById(this.selectedelement.id);
      var svg = element.getElementsByTagName("svg")[0];
      var bbox = svg.getBBox();
      var viewBox = [bbox.x - 5, bbox.y - 5, bbox.width + 10, bbox.height + 10].join(" ");
      svg.setAttribute("viewBox", viewBox);
      this.selectedelement.svgcombi = svg.outerHTML;
    }, 1000);
  }

  async seperatePaths(idx, vector: vectorelement, element: vectoranimation) {
    this.removeVectorPathSelection();
    this.removeVectorPathSelection();
    vector.pathids.forEach(pid => {
      let svgel = document.getElementById(pid);
      let s = new XMLSerializer(); // convert to string
      let svgstring = s.serializeToString(svgel);
      let h = 500, w = 500, x = 0, y = 0;
      let originalsize = this.getViewBox(this.selectedelement.id);
      //console.log(originalsize);
      if (originalsize) {
        x = originalsize['x'];
        y = originalsize['y'];
        h = originalsize['width']; // * newscale1;
        w = originalsize['height']; // * newscale1;
      }

      let newsvgarray = [
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'viewBox"' + x + ' ' + y + ' ' + h + ' ' + w + '" height="100%" width="100%"' +
        'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
        svgstring, '</svg>'
      ]
      let newsvg = newsvgarray.join('');
      this.addNewVector(null, element.style.height, element.style.width, newsvg, element.posx, element.posy);
    });
  }

  selectMultiplePaths() {
    this.setDragSelect(false);
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
      //console.log(posstring);
    }
  }

  clickVectorPaths(e) {
    // console.log('select path', e);
    if (this.dragselectvectpath === true && this.dragselectiontrue === false) {
      this.dragSelect(this.selectedelement.id); // activate drag
    } else if (this.dragselectiontrue === false) { // check if drag is not in progress
      if (e.target.localName !== 'svg') {
        if (this.selectmultiplepaths === false) {
          if (this.selectedVecPath === e.target) {
            this.removeVectorPathSelection();
            this.setVectorColor(e);
          } else {
            this.removeVectorPathSelection();
            this.selectedVecPath = e.target;
            this.setPathSelClass(e.target);
            this.setVectorColor(e);
          }
        }
        if (this.selectmultiplepaths === true) {
          this.selectedVecPath = e.target; // keep is connected to the ng view
          // check if already selected
          let exist = this.selectedVecPathmultiple.indexOf(e.target);
          if (exist !== -1) {
            e.target.style.outline = null;
            this.deletePathSelClass(e.target);
            this.selectedVecPathmultiple.splice(exist, 1);
            this.setVectorColor(e);
          } else {
            // if not exists
            this.setPathSelClass(e.target);
            this.selectedVecPathmultiple.push(e.target);
            this.setVectorColor(e);
          }
        }
      }
    }
  }

  setVectorColor(e) {
    this.colorpick = e.target.style.fill;
    this.colorpickline = e.target.style.stroke;
    this.linewidth = e.target.style['stroke-width'];
  }

  async deleteSelectedVectorPath() {
    // delete from pathids
    this.setDragSelect(false);

    if (this.selectmultiplepaths || this.dragselectvectpath) {
      //if (this.dragselectvectpath) { this.cancelDragSelect(); }
      for (let i1 = 0; i1 < this.selectedVecPathmultiple.length; i1++) {
        let selectionvecpath = this.selectedVecPathmultiple[i1];
        for (let i2 = 0; i2 < this.selectedelement.length; i2++) {
          let element = this.selectedelement.vectors[i2];
          let index = element.pathids.indexOf(selectionvecpath.id);
          if (index > -1) {
            element.pathids.splice(index, 1);
          }
        }
        selectionvecpath.remove();
        selectionvecpath = '';
      }
      let idnew = document.getElementById(this.selectedelement.id); // get document
      let vectstring = idnew.innerHTML;
      this.selectedelement.svgcombi = vectstring;
      this.removeVectorPathMultiSelection();
    } else {
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
    this.setDragSelect(false);
    this.selectmultiplepaths = false;
    if (this.selectedVecPathmultiple.length > 0) {
      this.selectedVecPathmultiple.forEach((path, index) => {
        this.deletePathSelClass(path)
        this.selectedVecPathmultiple.splice(index, 1)
      });
    }
    if (this.selectedelement) {
      if (this.selectedelement.svgcombi) {
        this.saveSVG();
      }
    }
  }

  removeVectorPathSelection() {
    this.setDragSelect(false);
    this.selectmultiplepaths = false;
    if (this.selectedVecPath) {
      this.deletePathSelClass(this.selectedVecPath)
      this.selectedVecPath = '';
    }
    if (this.selectedelement) {
      //if (this.selectedelement.svgcombi !== '') {
      this.saveSVG();
      //}
    }
  }

  saveAsSeperateVector(): any {
    //this.setDragSelect(false)
    let svgstring;
    let pathidar = [];

    if (this.selectmultiplepaths || this.dragselectvectpath) {
      // this.removeVectorPathMultiSelection();
      // console.log('seperate multipaths', this.selectedVecPathmultiple)
      let svgarray = [];
      let i = 0;
      let arraylength = this.selectedVecPathmultiple.length - 1;

      //this.selectedelement.id
      let svggetdefs = document.getElementById(this.selectedelement.id)
      let defs = svggetdefs.getElementsByTagName('defs');


      for (let y = 0; y < defs.length; y++) {
        let defstring = defs[y];
        svgarray.push(defstring.outerHTML)
      }
      this.selectedVecPathmultiple.forEach(element => {
        //console.log(element);
        let svg = element as unknown;
        let svg2 = svg as SVGAElement;
        var rect = svg2.getBBox();
        let height = rect.height + 'px';
        let width = rect.width + 'px';

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
        if (i === arraylength) {
          svgstring = svgarray.join('');
          this.createnewsvg(svgstring, pathidar, rect, height, width);
          this.removeVectorPathMultiSelection();
        }
        ++i
      });

    } else {
      let svgel = this.selectedVecPath;

      let svg = svgel as unknown;
      let svg2 = svg as SVGAElement;
      var rect = svg2.getBBox();
      let height = rect.height + 'px';
      let width = rect.width + 'px';

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
      this.createnewsvg(svgstring, pathidar, rect, height, width);
      this.removeVectorPathSelection();
    }
  }

  setColorPath(color) {
    // colorpick
    if (this.selectmultiplepaths || this.dragselectvectpath) {
      this.selectedVecPathmultiple.forEach(element => {
        element.style.fill = color;
      })
    } else {
      this.selectedVecPath.setAttribute('fill', color);
      this.selectedVecPath.style.fill = color;
    }
  }

  setColorPathLine(color) {
    // colorpickline
    if (this.selectmultiplepaths || this.dragselectvectpath) {
      this.selectedVecPathmultiple.forEach(element => {
        element.style.stroke = color;
      })
    } else {
      this.selectedVecPath.setAttribute('stroke', color);
      this.selectedVecPath.style.stroke = color;
    }
  }

  setlinewidth(linewidth) {
    //console.log(linewidth, 'line w')
    if (this.selectmultiplepaths || this.dragselectvectpath) {
      this.selectedVecPathmultiple.forEach(element => {
        element.style['stroke-width'] = linewidth;
      })
    } else {
      this.selectedVecPath.setAttribute('stroke-width', linewidth);
      this.selectedVecPath.style['stroke-width'] = linewidth;
    }
  }

  saveSVG() {
    let idnew = document.getElementById(this.selectedelement.id); // get document
    if (idnew) {
      let vec = idnew.getElementsByTagName('svg');
      if (vec.length > 0) {
        let vectstring = vec[0].outerHTML;
        //console.log(vectstring)
        this.selectedelement.svgcombi = vectstring;
      }
    }
  }

  async createnewsvg(svgstring, pathidar, bbox, height, width) {
    //console.log('start new svg')
    let h = 500, w = 500, x = 0, y = 0;
    let element = document.getElementById(this.selectedelement.id);
    let originalsize = await this.getViewBox(this.selectedelement.id);
    //console.log(originalsize);
    if (originalsize) {
      x = originalsize['x'];
      y = originalsize['y'];
      h = originalsize['width']; // * newscale1;
      w = originalsize['height']; // * newscale1;
    }

    let newsvgarray = [
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'viewBox="' + x + ' ' + y + ' ' + h + ' ' + w + '" height="100%" width="100%"' +
      'id="svg2" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none">',
      svgstring, '</svg>'
    ]
    let newsvg = newsvgarray.join('');
    this.addNewVector(null, height, width, newsvg, bbox.x, bbox.y, pathidar); //, originid
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
          setimgurl = 'https://api.xbms.io/api/Containers/' + this.option.id + '/download/' + name;
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
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    let svgel;
    if (element === undefined) {
      let sv
      svgel = document.getElementById(this.selectedelement.id);
      let svg = svgel.getElementsByTagName('svg')[0].outerHTML;
      this.selectedelement.src = this.onSVGsave(svg);
      // console.log(svg)
    } else {
      svgel = document.getElementById(element.id);
      let svg = svgel.getElementsByTagName('svg')[0].outerHTML;
      element.src = this.onSVGsave(svg);
      // console.log(svg)
    }
  }

  async saveVideo() {
    //console.log(this.animationarray);

    if (this.elementname === undefined) { this.elementname = Math.random().toString(36).substring(7); }
    let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + this.elementname;
    let setimgurl = 'https://api.xbms.io.mybluemix.net/api/Containers/' + this.option.id + '/download/' + this.elementname;
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
    const myNode = document.getElementById('weathercontainer');
    myNode.innerHTML = '';
    this.detectchange();
  }

  loadEditableVideo() {
    const myNode = document.getElementById('weathercontainer');
    myNode.innerHTML = '';
    this.newFiles = this.editablevideo;
    this.elementname = this.editablevideo.name;
    this.canvas = this.editablevideo.canvas[0];
    this.animationarray = this.editablevideo.template;
    this.counter = this.editablevideo.counter;
    this.detectchange();
  }

  //https://github.com/luncheon/svg-drag-select
  dragSelect(id) {
    //this.removeVectorPathSelection();
    //this.disableDraggable(); 
    this.deletePathSelClass(this.selectedVecPath)
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

      onSelectionEnd: event => {
        this.selectedVecPathmultiple = [];
        event.selectedElements.forEach(el => {
          this.selectedVecPathmultiple.push(el);
        });
      }
    });

    this.cancelDragSelect = cancel;
    this.dragAreaOverlay = dragAreaOverlay;
  }

  setDragSelect(dragset) {
    if (dragset === false && this.dragselectiontrue === true) {
      this.cancelDragSelect();
      this.dragselectiontrue = false;
      this.dragselectvectpath = false
    }
  }

  setPathSelClass(element) {
    let elclass = element.getAttribute('class');
    if (elclass !== null) {
      element.setAttribute('class', 'data-selected ' + elclass);
    } else {
      element.setAttribute('class', 'data-selected')
    }
  }

  deletePathSelClass(element) {
    if (element) {
      let elclass = element.getAttribute('class');
      if (elclass !== null) {
        elclass = elclass.replace('data-selected', '')
        element.setAttribute('class', elclass);
      }
    }
  }

  addcell(i, i1, i2): void {
    this.animationarray[i].data[i1].data.push(0);
    this.animationarray[i].productiondata[i1].data.push(0);
  }

  addLabel(i, i1): void {
    this.animationarray[i].label.push("new label");
  }

  addgraph(i, i1): void {
    this.animationarray[i].data.push({ data: [0, 0, 0], labels: 'new label' });
    this.animationarray[i].productiondata.push({ data: [0, 0, 0], labels: 'new label' });
    this.animationarray[i].colors.push(
      { // grey
        backgroundColor: '#232222',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      }
    )
  }

  deletegraph(i): void {
    let del = this.animationarray[i].data.length - 1;
    this.animationarray[i].data.splice(del, 1);
    this.animationarray[i].productiondata.splice(del, 1);
    this.detectchange();
  }

  detectchangerowcell(i, i1, i2, cell): void {
    this.animationarray[i].data[i1].data[i2] = cell;
    let max = Math.max(... this.animationarray[i].data[i1]);
    let min = Math.min(... this.animationarray[i].data[i1]);
    if (max < cell) {
      this.animationarray[i].lineChartOptions.scales.yAxes[0].ticks.suggestedMax = cell;
      this.animationarray[i].lineChartOptions.scales.yAxes[0].ticks.suggestedMin = min;
    }
    if (min > cell) {
      this.animationarray[i].lineChartOptions.scales.yAxes[0].ticks.suggestedMin = cell;
      this.animationarray[i].lineChartOptions.scales.yAxes[0].ticks.suggestedMax = max; // throws error if not
    }
    //this.animationarray[i].productiondata[i1].data[i2] = 0;
    this.detectchange();
  }

  detectchangerowlabel(i, i1, labelnew): void {
    this.animationarray[i].data[i1].label = labelnew;
    this.animationarray[i].productiondata[i].label = labelnew;
    this.detectchange();
  }

  detectchangeLabel(i, i1, label): void {
    this.animationarray[i].label[i1] = label;
    this.detectchange();
  }

  detectchangetype(i, type): void {
    this.animationarray[i].charttype = type;
    this.detectchange();
  }

  deletelabel(i, i1) {
    let del = this.animationarray[i].label.length - 1;
    this.animationarray[i].label.splice(del, 1);
    this.detectchange();
  }

  deletecell(i, i1) {
    let del = this.animationarray[i].data[i1].data.length - 1;
    this.animationarray[i].data[i1].data.splice(del, 1);
    this.animationarray[i].productiondata[i1].data.splice(del, 1);
    this.detectchange();
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  createVideoCodeSnippet() {
    this.saveVideo();
    let myJSON = JSON.stringify(this.canvas);
    let canvasjson = encodeURIComponent(myJSON);
    let url = 'https://dlcr.xbms.io?id=' + this.newFiles.id + '&canvas=' + canvasjson + '&repeat=false&remote=true';
    this.snippetcode = '<iframe scrolling="no" width=' + this.canvas.width + ' height=' + this.canvas.height + ' src="' + url + '"></iframe>';
    this.codesnippetService.confirm('Copy Code', 'Copy code and input in your website', this.snippetcode).subscribe()
  }


  //   <button mat-mini-fab class="addbutton" matTooltip="Add image" (click)="addNewImage()" color="primary">
  //   <mat-icon>image</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add text" (click)="addNewText()" color="primary">
  //   <mat-icon>text_format</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add shape" (click)="addNewShape()" color="primary">
  //   <mat-icon>format_shapes</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add animated image" (click)="addNewVector()"
  //   color="primary">
  //   <mat-icon>wallpaper</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add drawing" (click)="addNewWhiteboard()"
  //   color="primary">
  //   <mat-icon>edit</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add Chart" (click)="addNewChart()" color="primary">
  //   <mat-icon>show_chart</mat-icon>
  // </button>
  // <button mat-mini-fab class="addbutton" matTooltip="Add Animation Group" (click)="addNewVectorCombi()"
  //   color="primary">
  //   <mat-icon>collections</mat-icon>
  // </button>

  public speedDialFabButtons = [
    {
      icon: 'image',
      tooltip: 'Add new image'
    },
    {
      icon: 'text_format',
      tooltip: 'Add new text'
    },
    {
      icon: 'square_foot',
      tooltip: 'Add new shape'
    },
    {
      icon: 'emoji_nature',
      tooltip: 'Add animated image'
    },
    {
      icon: 'edit',
      tooltip: 'Add drawing'
    },
    {
      icon: 'show_chart',
      tooltip: 'Add chart'
    },
    {
      icon: 'collections',
      tooltip: 'Add animation group'
    },
    // {
    //   svgIcon: 'xbms_web',
    //   tooltip: 'web'
    // },
    // {
    //   svgIcon: 'xbms_snapchat',
    //   tooltip: 'snapchat'
    // },
    // {
    //   svgIcon: 'xbms_vimeo',
    //   tooltip: 'vimeo'
    // },
    // {
    //   svgIcon: 'xbms_github',
    //   tooltip: 'github'
    // }

  ];

  onSpeedDialFabClicked(btn) {
    // console.log(btn.tooltip);
    if (btn.tooltip === 'Add new image') { this.addNewImage() }
    if (btn.tooltip === 'Add new text') { this.addNewText() }
    if (btn.tooltip === 'Add new shape') { this.addNewShape() }
    if (btn.tooltip === 'Add animated image') { this.addNewVector() }
    if (btn.tooltip === 'Add drawing') { this.addNewWhiteboard() }
    if (btn.tooltip === 'Add chart') { this.addNewChart() }
    if (btn.tooltip === 'Add animation group') { this.addNewVectorCombi() }

  }



}