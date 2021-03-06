import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { gsap } from 'assets/js/all';
import { CustomBounce, CustomEase, Physics2DPlugin, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper, Draggable } from 'assets/js/all';
gsap.registerPlugin(Physics2DPlugin, CustomEase, CustomBounce, Draggable, InertiaPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, MotionPathHelper);
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material/snack-bar';
declare const SVG: any;
import '@svgdotjs/svg.draggable.js'
const plugins = [Draggable, CustomEase, CustomBounce, InertiaPlugin, DrawSVGPlugin, MorphSVGPlugin, ScrambleTextPlugin, SplitText, Physics2DPlugin, MotionPathPlugin, MotionPathHelper]; //needed for GSAP
import { fonts } from '../../shared/listsgeneral/fonts';
import svgDragSelect from "svg-drag-select";
import { codesnippetService } from '../../dialogsservice/codesnippet-dialog.component';
import { debounceTime } from 'rxjs/operators';
import { HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import PathEditor from 'assets/js/utils/PathEditor';
import {
  chart, animationtype, vectoranimationtype, vectoranimation, vectorcombinator, vectorelement,
  splittexttype, shapeanimation, imageanimation, textanimation
} from './videocreator.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGetname } from '../../dialogsservice/dialog.getname'
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { BackgroundComponent } from '../../shared/background/background.component';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss']
})

export class VideocreatorComponent implements OnInit {

  @ViewChild('progressbar') progressbar: ElementRef;
  @Input() Account: Account;
  @Input() SelectedRelation: Relations;
  @Input() option: Relations;
  @Input() company: Company;

  videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer')
  set mainVideoEl(el: ElementRef) {
    if (el !== undefined) {
      this.videoPlayer = el.nativeElement;
    }
  }
  public videourl: string;
  public zoomfactor = 1;
  public selectedvideoformat: string;
  public editfigure = false;
  public closewhiteboard = false;
  public standardpath = 'linear';
  public edittext = false;
  public draggableObject;
  public pathHelper: MotionPathHelper;
  public pathEditor: PathEditor;
  public snaptogrid = false;
  public snaptogridwidth = 20;
  public snaptogridheight = 20;
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
    width: '1024px',
    height: '576px',
    'background-color': '#ffffff',
    'background-image': '',
    position: 'relative',
    videourl: '',
    loop: false,
    weather: '',
    audio: '',
    top: '',
    left: '',
    hovereffect: true
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
  public name;
  private MorphSVGPlugin = MorphSVGPlugin;
  private SplitText = SplitText;
  public setreplay = false;
  public selectedVecPath;
  public selectmultiplepaths = false;
  public selectedVecPathmultiple = [];
  public editpath = false;
  public dragselectvectpath = false;
  public standardvector;
  public dragselectiontrue = false;
  public cancelDragSelect?: () => void;
  public dragAreaOverlay;
  public snippetcode: string;
  public systembusy = false;
  public history = [];
  public currenthistoryversion = 0;
  public boxshadow = false;
  public destroy = false;
  public backgroundComponent: BackgroundComponent;
  public selectableanimationarray = [];
  public selectablevectorarray = [];
  private routeSub: any;

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
    private relationsApi: RelationsApi,
    private filesApi: FilesApi,
    public snackBar: MatSnackBar,
    public media: MediaObserver,
    public dialogsService: DialogsService,
    public http: HttpClient,
    public router: Router
  ) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change;
    });
  }

  ngOnDestroy() {
    this.destroy = true;
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

    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.animationarray.length > 0) {
          this.dialogsService
            .confirm('Save data?', 'Any unsaved data will be lost')
            .subscribe(res => {
              this.routeSub.unsubscribe();
              if (res) {
                if (this.newFiles.id) {
                  this.saveVideo();
                } else {
                  this.saveVideoAs();
                }
              }
            });
        }
      }
    });
  }

  KeyPress(evtobj) {
    //console.log(evtobj)
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) { this.historyBack() } // windows
    else if (evtobj.keyCode == 89 && evtobj.ctrlKey) { this.historyForward() } // windows
    else if (evtobj.keyCode == 90 && evtobj.metaKey && !evtobj.shiftKey) { this.historyBack() } // mac
    else if (evtobj.keyCode == 90 && evtobj.metaKey && evtobj.shiftKey) { this.historyForward() } // mac
    else { this.keyinput.next(evtobj) }
  }

  async saveToLocalStorageHistory(setnr?) {
    if (!this.destroy) { // check destroy is not triggered same time as save to storage

      // check if is actually a newer version check last with new is similar
      // triggers on mouseup event set debounce time if triggered to fast see ngoninit
      // clean chart area for JSON 
      let meta = [];
      for (let i = 0; i < this.animationarray.length; i++) {
        meta.push([])
        if (this.animationarray[i].type === 'chart') {
          for (let y = 0; y < this.animationarray[i].data.length; y++) {
            let meta1 = this.animationarray[i].data[y]._meta;
            let meta2 = this.animationarray[i].productiondata[y]._meta;
            meta[i].push(meta1);
            meta[i].push(meta2);
            delete this.animationarray[i].data[y]._meta;
            delete this.animationarray[i].productiondata[y]._meta;
          }
        }
      }

      //console.log('save', this.animationarray);
      let jsonaniarray = JSON.stringify(this.animationarray); // ,this.getCircularReplacer()
      let jsonaniarraylast = JSON.stringify(this.history[this.currenthistoryversion]);
      if (this.currenthistoryversion < this.history.length - 1) {
        this.history = this.history.splice(this.currenthistoryversion + 1, this.history.length - 1)
      }
      if (jsonaniarray !== jsonaniarraylast) {
        this.currenthistoryversion = this.currenthistoryversion + 1;
        this.history.push(jsonaniarray);
      }

      // restore chart area meta function
      this.restoreChart(meta);
    }
  }

  // circular chart data._meta
  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };


  historyBack() {
    console.log('ctrl-z', this.currenthistoryversion)
    // if not last or not empty and if is new;
    if (this.currenthistoryversion > 0) {
      this.currenthistoryversion = this.currenthistoryversion - 1;
      let storedback = this.history[this.currenthistoryversion];
      // console.log(this.history, this.currenthistoryversion, storedback);
      this.animationarray = JSON.parse(storedback);
      this.detectchange();
    }
  }

  historyForward() {
    console.log('ctrl-y', this.currenthistoryversion)
    // if not latest or not empty
    let histlast = this.history.length - 1;
    if (this.currenthistoryversion < histlast) {
      this.currenthistoryversion = this.currenthistoryversion + 1;
      let storedback = this.history[this.currenthistoryversion]
      this.animationarray = JSON.parse(storedback);
      this.detectchange();
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   //wait for option.id
  //   const currentItem: SimpleChange = changes.option;
  //   if (currentItem !== undefined) {
  //     if (currentItem.currentValue.id !== undefined) {
  //       this.getEditFile()
  //     }
  //   }
  // }

  changevideoformat() {
    let setvideo = this.selectedvideoformat.split(' x ');
    this.canvas.width = setvideo[0];
    this.canvas.height = setvideo[1];
    this.onchangecanvas();
  }

  editMotionPath(animation) {
    this.zoomfactor = 1;
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
    //console.log('select element', event, element);
    if (this.vectorcombiedit && element.type !== 'vectorcombi' && !this.editfigure) {
      this.selectitem(element);
    }
    if (!this.vectorcombiedit && !this.editfigure) {
      this.selectitem(element);
    }

    if (this.editfigure) {
      this.draggableObject.disable();
    }

    if (element.type === 'vectorcombi') {
      this.selectableanimationarray = this.animationarray.filter(item => item.type !== 'vectorcombi')
    }

    if (element.type === 'vector') {
      this.selectablevectorarray = this.animationarray.filter(item => item.type === 'vector')
    }

  }

  selectitem(element) {
    if (!this.selectedelement) { this.selectedelement = element }

    // manual close editpath to prevent interuptions in path check if selectedelement is not already selected
    // set dragpath, whiteboard, ?
    if (this.editpath === false && this.selectedelement.id !== element.id) {
      if (this.selectedelement.type === 'vector' && this.selectedelement.svgcombi !== '') {
        this.removeVectorPathSelection();
        this.removeVectorPathMultiSelection();
      }
      if (this.whiteboard) { this.deletewhiteboard() }
      this.edittext = false;
      this.selectedVecPath = '';
      this.setDragSelect(false);
      if (element.style['box-shadow'] === '') { this.boxshadow = false } else { this.boxshadow = true }
      this.selectedelement = element;
    }
  }

  resetVectorCombiEdit(element) {
    this.vectorcombiedit = false;
    this.detectchange();
  }

  setBoxShadow() {
    if (this.boxshadow) {
      this.selectedelement.style['box-shadow'] = ' 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)';
    } else {
      this.selectedelement.style['box-shadow'] = '';
    }
    this.detectchange();
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

  async resetPath(animation) {
    this.stopFunc();
    let h = parseInt(this.canvas.height, 10);
    let w = parseInt(this.canvas.width, 10);
    let pathset = document.getElementById(this.selectedelement.id + 'p')

    switch (this.standardpath) {
      case 'linear': {
        let editpath = 'M282.457,480.74 C282.457,480.74 280.457,217.529 279.888,139.457   ';
        this.selectedelement.clippath = editpath;
        pathset.setAttribute('d', editpath);
        break
      }
      case 'circle': {
        let circw = (w - 10) / 2;
        let circh = (h - 10) / 2;
        let newsvgpath = '<ellipse cx="' + circw + '" cy="' + circw + '" rx="' + circh + '" ry="' + circh + '" id="' + this.selectedelement.id + 'p" style="opacity: 0;" />';
        pathset.outerHTML = newsvgpath;
        MorphSVGPlugin.convertToPath("circle, rect, ellipse, line, polygon, polyline");
        pathset = document.getElementById(this.selectedelement.id + 'p')
        console.log(pathset);
        break
      }
      case 'square': {
        let editpath = 'M 10,10 L' + (w - 50) + ',10 L' + (w - 50) + ',' + (h - 50) + ' L10,' + (h - 50) + ' z';;
        this.selectedelement.clippath = editpath;
        pathset.setAttribute('d', editpath);
        break
      }
    }
    let newpath = pathset.getAttribute('d')
    this.setNewMotionPath(newpath)
    await new Promise(resolve => setTimeout(resolve, 400));
    this.editMotionPath(animation);
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
    if (this.whiteboard) { this.deletewhiteboard() }
    this.primairytimeline = gsap.timeline({ paused: true, reversed: true });
    if (this.editpath === true) {
      this.saveNewMotionPath();
    }
    // force dom update
    this.changenow = false;
    setTimeout(() => { this.changenow = true }, 10);
    await new Promise(resolve => setTimeout(resolve, 100));
    // wait for dom update to finish otherwise it will create the effects on the old dom
    if (this.canvas.weather !== '') { this.addWeatherEffect() };

    for (let i = 0; i < this.animationarray.length; i++) {
      const elm = this.animationarray[i];
      this.setPosition(elm);

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
      this.addEffect(elm); //normal animatoin
    }

  }

  setChartData(elm) {
    elm.productiondata = elm.data;
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
      case 'power1':
        ease = 'power1.out'
        break;
      case 'power2':
        ease = 'power2.out'
        break;
      case 'power3':
        ease = 'power3.out'
        break;
      case 'easy':
        ease = 'power0.out'
        break;
      case 'slowmotion':
        ease = 'slow(0.7, 0.7, false)'
      case 'rough':
        ease = 'rough'
      case 'none':
        ease = 'none'
      default:
        ease = 'none';
    }
    return ease
  }

  onchangecanvas() {
    if (this.canvas.videourl) { this.canvas['background-color'] = 'transparent' }
    this.animationarray.forEach(element => {
      // let w = this.canvas.width.replace('px', '');
      // let h = this.canvas.height.replace('px', '');
      // let newview = '0 0 ' + w + ' ' + h;
      // var regex = /viewBox="(.*?)"/;
      // var strToMatch = element.motionpath;
      // var matched = regex.exec(strToMatch);
      element.motionpath = this.createMotionPath(element.id);
      //element.motionpath.replace(matched[1], newview);
      //console.log(element);
    });


    if (this.zoomfactor !== 1) {
      // let element = document.getElementById('containernormal');
      // let rect = element.getBoundingClientRect();
      let scale = this.zoomfactor - 1;
      let w = parseInt(this.canvas.width) / 2;
      let h = parseInt(this.canvas.height) / 2;
      this.canvas.left = w * scale + 'px';
      this.canvas.top = h * scale + 'px';
    }

    if (this.zoomfactor === 1) {
      this.canvas.left = '0px';
      this.canvas.top = '0px';
    }

    this.changevideo = false;
    setTimeout(() => this.changevideo = true);

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
        autoAlpha: 0, ease: ease, repeat: repeat, yoyo: element.yoyo
      };
    }

    if (anitype === 'bounce') {
      //Create a custom bounce ease:
      CustomBounce.create("myBounce", { strength: 0.6, squash: 3, squashID: "myBounce-squash" });
      let orgin = element.transformOriginX + ' ' + element.transformOriginY;
      let rotate;
      if (!element.rotationkeeppos) {
        gsap.set(iset, { xPercent: element.travellocX, yPercent: element.travellocY, transformOrigin: orgin, autoAlpha: 1 }); // tranformorgin to set offset??
        rotate = element.rotationcycle
      } else {
        gsap.set(iset, { xPercent: element.travellocX, yPercent: element.travellocY, autoAlpha: 1 }); // tranformorgin to set offset??
        rotate = false;
      }
      let svgset = document.getElementById(elementA.id + 'p');
      //do the bounce by affecting the "y" property.
      this.primairytimeline.from(iset, {
        duration: duration,
        //y:550,
        repeat: repeat, yoyo: element.yoyo,
        motionPath: {
          path: svgset,
          autoRotate: rotate,
          align: svgset//'self'
        },
        ease: "myBounce"
      }, starttime);

      //and do the squash/stretch at the same time:
      this.primairytimeline.to(iset, { duration: duration, scaleY: 0.5, scaleX: 1.3, ease: "myBounce-squash", transformOrigin: "center bottom" }, starttime);
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

    if (anitype === '3drotate') {
      aniset = {
        duration: duration,
        rotationX: element.transformOriginX, rotationY: element.transformOriginY, ease: ease, repeat: repeat, yoyo: element.yoyo
      }
    }

    if (anitype !== 'fountain' && anitype !== 'followminions' && anitype !== 'bounce') {
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
      rotationkeeppos: true
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

  async copyElement(i, element) {
    const curel = element;
    let newElement = JSON.parse(JSON.stringify(curel));
    // redo all ids
    let newelnr = this.animationarray.length + 'el';
    newElement.id = newelnr;
    this.newz = this.newz + 1;
    newElement.style['z-index'] = this.newz;
    newElement.groupmember = false;

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

    newElement.motionpath = newElement.motionpath.replace(this.selectedelement.id, newElement.id)
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

  setExistingVector(e, i, idx): void {

    let docset = document.getElementById(e.value.id);
    let vectorid = e.value.vectors[0].idx;

    let svgdiv = document.getElementById(vectorid);
    let svg = svgdiv.getElementsByTagName('svg')[0].outerHTML;

    setTimeout(() => {
      console.log(docset, e, i, idx);
      this.animationarray[i].vectors[idx].object = svg;
      this.initVectors(docset, i, idx, vectorid)
    }, 500);
  }

  async initVectors(e, i, idx, vectorid) {
    //this.systembusy = true;
    //console.log(e, i, idx, vectorid);

    // rename class names to prevent clashes in classnames
    var className = e.getElementsByTagName("style");
    let svgstring = e.outerHTML;
    //console.log(className[0].sheet.cssRules);
    if (className.length > 0) {
      for (let i = 0; i < className[0].sheet.cssRules.length; i++) {
        let element = className[0].sheet.cssRules[i];
        let clname: string = element.selectorText; //CSSStyleRule
        let newclname: string = clname + '-xbms-' + vectorid;
        element.selectorText = newclname;
        let searchnewclname = newclname.substring(1);
        let clsearchname = clname.substring(1);
        let re = new RegExp(clsearchname, 'g');
        svgstring = svgstring.replace(re, searchnewclname);
      }
      //console.log(svgstring);
      e.outerHTML = svgstring;
    }

    if (this.animationarray[i].svgcombi === '' || this.animationarray[i].morph) {
      return new Promise(async (resolve, reject) => {
        let getview;
        let originalsize;
        let newsize;
        let newsizestring = e.getAttribute('viewBox');

        // convert all svgs and all other then paths (website wide)
        await MorphSVGPlugin.convertToPath("circle, rect, ellipse, line, polygon, polyline");

        if (this.animationarray[i].morph) {
          getview = document.getElementById('previewboxtitle' + i);
          //console.log('getview', getview, 'previewboxtitle' + i)
        } else {
          getview = document.getElementById('previewbox'); //was +i
        }

        if (newsizestring !== null) {
          let newarray = newsizestring.split(' ');
          newsize = { x: newarray[0], y: newarray[1], width: newarray[2], height: newarray[3] }
        } else {
          newsize = { x: 0, y: 0, width: 1000, height: 1000 };
        }

        let svgdiv = document.getElementById(vectorid);
        let svg = svgdiv.getElementsByTagName('svg')[0];
        console.log(svg);

        if (getview !== null) {
          //let svgview = getview.getElementsByTagName('svg');
          let originalsizestring = svg.getAttribute("viewBox");
          let origarray = originalsizestring.split(' ');
          originalsize = { x: origarray[0], y: origarray[1], width: origarray[2], height: origarray[3] }
        } else {
          originalsize = newsize;
        }

        await this.removeclipPath(svg);
        await this.deleteVectorGroup(svg, vectorid);
        //console.log("vector groups deleted");
        await this.resizeVector(originalsize, newsize, idx, svg);
        //consolelog("vector resized");
        await this.combineSVGs(this.animationarray[i], originalsize);
        //console.log("vectors combined");
        //this.systembusy = false;

      })
    }

  }

  removeclipPath(svg) {

    let clippaths = svg.getElementsByTagName('clipPath');
    //console.log(clippaths);
    var index;
    for (index = clippaths.length - 1; index >= 0; index--) {
      clippaths[index].parentNode.removeChild(clippaths[index]);
    }
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
    // check if animation path needs to be updated
    let animationmove = idel.animation.filter(obj => {
      return obj.anim_type === 'move'
    });
    let animationbounce = idel.animation.filter(obj => {
      return obj.anim_type === 'bounce'
    });
    if (animationmove.length > 0 || animationbounce.length > 0) {
      if (idel.groupmember) {
        let boundposition = document.getElementById('myBounds').getBoundingClientRect();

        // get the actual position on the screen / relative
        let relx = document.getElementById(idel.id).getBoundingClientRect().left - boundposition.left;
        let rely = document.getElementById(idel.id).getBoundingClientRect().top - boundposition.top;
        let path = await document.getElementById(idel.id + 'p');
        let rawpath = await MotionPathPlugin.getRawPath(path);
        let newpath = await MotionPathPlugin.transformRawPath(rawpath, 1, 0, 0, 1, relx, rely);
        let stringpath = await MotionPathPlugin.rawPathToString(newpath);
        this.setNewMotionPath(stringpath);
      } else {
        let path = await document.getElementById(idel.id + 'p');
        let rawpath = await MotionPathPlugin.getRawPath(path);
        let newpath = await MotionPathPlugin.transformRawPath(rawpath, 1, 0, 0, 1, newx, newy);
        let stringpath = await MotionPathPlugin.rawPathToString(newpath);
        this.setNewMotionPath(stringpath);
      }
    }

    // check if combi item
    if (idel.groupmember) {
      //console.log('update combibox')
      this.updateCombiBox(idel);
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
    if (el) {
      let element = el as Draggable;
      if (typeof element.disable === 'function') {
        element.disable();
      }
    }
  }

  setDraggable(event, idel) {
    // Draggable does not recognise ts angular so changes are direct dom js related
    // drag selectionbox should be off and vectorcombinator should be off
    if (this.dragselectvectpath === false && this.vectorcombiedit === false && !idel.groupmember && !this.cropimages) {
      this.setMovable(event, idel);
    } else { this.disableDraggable(); }

    if (!this.dragselectvectpath && this.vectorcombiedit && idel.groupmember) {
      this.setMovable(event, idel);
    }

  }


  async setGrid() {
    //await this.removeGrid();
    const myNode = document.getElementById("snapgrid");
    myNode.innerHTML = '';

    if (this.snaptogrid) {
      let gridHeight = this.snaptogridheight;
      let gridWidth = this.snaptogridwidth;
      let gridColumns = parseInt(this.canvas.width, 10) / gridWidth;
      let gridRows = parseInt(this.canvas.height, 10) / gridHeight;

      let docset = document.getElementById('snapgrid');
      //console.log('set grid', docset, gridRows, gridColumns)
      for (let i = 0; i < gridRows * gridColumns; i++) {
        let y = Math.floor(i / gridColumns) * gridHeight;
        let x = (i * gridWidth) % (gridColumns * gridWidth);
        var divi = document.createElement("div");
        divi.className = 'gridcells';
        divi.id = 'gridcell' + i;
        divi.style.width = (gridWidth - 1) + 'px';
        divi.style.height = (gridHeight - 1) + 'px';
        divi.style.top = y + 'px';
        divi.style.left = x + 'px';
        docset.appendChild(divi);
      }
    }
  }

  setMovable(event, idel) {
    let element = document.getElementById(idel.id);
    //let inertia = false;
    let snapw = this.snaptogridwidth;
    let snaph = this.snaptogridheight;
    let dragfunc;
    let throwfunc;

    let snap = {
      x: function (value) {
        return Math.round(value / snapw) * snapw;
      },
      y: function (value) {
        return Math.round(value / snaph) * snaph;
      }
    }

    if (!this.snaptogrid) {
      snap = undefined;
      dragfunc = this.setMoveableItem;
      throwfunc = undefined;
    } else {
      dragfunc = undefined;
      throwfunc = this.setMoveableItem;
    }

    if (event.target.id === idel.id + 'rotatehandle') {
      this.setRotate(event, idel)
    } else {
      this.draggableObject = new Draggable(element, {
        type: "x,y",
        snap: snap,
        onThrowCompleteParams: [idel, snapw, snaph],
        onThrowComplete: throwfunc,
        onDragEnd: dragfunc,
        onDragEndParams: [idel, snapw, snaph],
        inertia: this.snaptogrid,
        edgeResistance: 0.95,
        //liveSnap: this.snaptogrid,
        //snap: snap,
        //bounds: '#myBounds',
      });
    }
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

  updateCombiBox(element) {
    // filter elements for correct vectorcombi
    for (let i = 0; i < this.animationarray.length; i++) {
      let animation = this.animationarray[i];
      if (animation.type === 'vectorcombi') {
        this.combiBoxCalculator(animation);
      }
    }
    // calculate new position
  }

  async combiBoxCalculator(vectorcombi: vectorcombinator) {
    //console.log('is combiboxcalculator')
    let vectors = vectorcombi.vectors;
    let boundposition = document.getElementById('myBounds').getBoundingClientRect();

    // get the actual position on the screen
    let x = document.getElementById(vectors[0].id).getBoundingClientRect().left - boundposition.left;
    let y = document.getElementById(vectors[0].id).getBoundingClientRect().top - boundposition.top;

    // calculate new width/height
    let widthcalc = document.getElementById(vectors[0].id).getBoundingClientRect().right;
    let heightcalc = document.getElementById(vectors[0].id).getBoundingClientRect().bottom;
    let resetvaluex = 0;
    let resetvaluey = 0;

    for (let k = 0; k < vectors.length; k++) {
      //console.log(vectors[k])
      let testx = document.getElementById(vectors[k].id).getBoundingClientRect().left - boundposition.left;
      let testy = document.getElementById(vectors[k].id).getBoundingClientRect().top - boundposition.top;
      let testright = document.getElementById(vectors[k].id).getBoundingClientRect().right;
      let testbottom = document.getElementById(vectors[k].id).getBoundingClientRect().bottom;
      //console.log('pos combibox', testright, widthcalc);
      if (testx < x) { x = testx; resetvaluex = k }
      if (testy < y) { y = testy; resetvaluey = k }
      if (testright > widthcalc) { widthcalc = testright }
      if (testbottom > heightcalc) { heightcalc = testbottom }
    }

    let widthcalcfin = (widthcalc - boundposition.left) - x;
    let heightcalcfin = (heightcalc - boundposition.top) - y;
    vectorcombi.style.width = widthcalcfin + 'px';
    vectorcombi.style.height = heightcalcfin + 'px';
    vectorcombi.posx = x;
    vectorcombi.posy = y;

    // new position combi
    let diffposx = vectors[resetvaluex].posx;
    let diffposy = vectors[resetvaluey].posy;
    //console.log('diff position', diffposx, diffposy);

    // compensate for new combi position. 
    for (let k = 0; k < vectors.length; k++) {
      vectors[k].posx = vectors[k].posx - diffposx;
      vectors[k].posy = vectors[k].posy - diffposy;
    }

    this.detectchange();
  }


  onSetCombiBox(i, element, newel) {
    let vectorcombi: vectorcombinator = this.animationarray[i];
    // this.combiBoxCalculator(vectorcombi);
    this.updateCombiBox(element);
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
      groupname: '',
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
      motionpath: this.createMotionPath(newelnr)
    }
    this.animationarray.push(newvectorcombi);
  }


  async dropVectorGroup(value, element, i) {
    let newel = value.value;
    //if (newel.type === 'vector') {
    let found = false;
    newel.groupmember = true;
    for (let i = 0; i > element.vectors.length; i++) {
      if (JSON.stringify(element.vectors[i]) === JSON.stringify(newel)) {
        found = true;
      }
    }

    if (found === false) {
      element.vectors.push(newel);
      this.onSetCombiBox(i, element, newel);
    }
    //}
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
      rotationkeeppos: true
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
      scale: 0,
      object: ''
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
        'box-shadow': ''
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
      motionpath: this.createMotionPath(newelnr)
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
      rotationkeeppos: true
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
        'clip-path': '',
        'box-shadow': ''
      },
      clippath: '',
      src: '',
      posx: 0,
      posy: 0,
      setpos: { 'x': 0, 'y': 0 },
      animation: anim,
      id: newelnr,
      transform: '',
      rotation: 0,
      motionrotation: 0,
      grey: false,
      blur: false,
      motionpath: this.createMotionPath(newelnr),
    }
    this.animationarray.push(img);
    this.selectedelement = img;
    this.detectchange();
  }

  createMotionPath(newelnr) {
    let motionpath = '<svg id="' + newelnr + 'mp" style="width:' + this.canvas.width + ' height=' + this.canvas.height + ';" viewBox="0 0 ' + parseInt(this.canvas.width) + ' ' + parseInt(this.canvas.height) + '" class="path-edit"><path id="' + newelnr + 'p" style="opacity: 0;"' +
      ' d="M282.457,480.74 C282.457,480.74 280.457,217.529 279.888,139.457   " /></svg>'
    return motionpath
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
      rotationkeeppos: true
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
        'box-shadow': ''
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
      motionpath: this.createMotionPath(newelnr)

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
    let colorset = [
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
    let lineChartOptions = {
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
      rotationkeeppos: true
    }];
    let chart = {
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
      motionpath: this.createMotionPath(newelnr)
    }
    this.animationarray.push(chart);
    console.log(this.animationarray[this.animationarray.length - 1]);
  }

  editFigurePath(): void {
    //console.log(this.selectedVecPath)
    if (this.selectedVecPath) {
      this.editfigure = true;
      this.draggableObject.disable();
      this.pathEditor = PathEditor.create(this.selectedVecPath);
    }
  }

  saveFigurePath(): void {
    this.editfigure = false;
    this.removePathEditor();
    this.saveSVG();
  }

  addNewFigure(): void {
    //this.cancelDragSelect();
    let docset = document.getElementById('svgElement');
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let strPath = 'M282.457,480.74 C282.457,480.74 280.457,217.529 279.888,139.457 ';
    path.setAttribute("d", strPath);
    path.setAttribute("id", 'svgElementPath');
    docset.appendChild(path);
    let pathset = document.getElementById('svgElementPath');
    this.pathEditor = PathEditor.create(pathset);
  }

  startDraw(): void {
    //console.log(this.shapedraw);
    this.zoomfactor = 1;
    if (this.shapedraw === 'figure') {
      this.addNewFigure();
    } else {
      this.startNewWhiteboard();
    }
  }

  addNewWhiteboard(): void {
    if (this.whiteboard === false) {
      this.whiteboard = true;
    }
  }


  startNewWhiteboard(): void {
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


  async savewhiteboard() {
    var svgElement = document.getElementById("svgElement");
    if (this.closewhiteboard) {
      let path = svgElement.getElementsByTagName('path');
      for (let i = 0; i < path.length; i++) {
        let d = path[i].getAttribute('d');
        let newd = d + ' z';
        path[i].setAttribute('d', newd);
      }
    }
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

    this.deletewhiteboard();
    this.removePathEditor();
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
      rotationkeeppos: true
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
        'box-shadow': ''
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
      motionpath: this.createMotionPath(newelnr)
    }
    this.animationarray.push(txt);
    this.selectedelement = txt;
    this.detectchange();
  }

  deleteTextAnimation(iv) {
    this.selectedelement.splittextanimation.splice(iv, 1);
  }

  async imageCropPath() {
    // this.selectedelement.style['clip-path'] = 'url(#' + this.selectedelement.id + 'cropclip)'
    this.selectedelement.style['clip-path'] = '';
    this.cropimages = true;
    let pathset = document.getElementById(this.selectedelement.id + 'croppath');
    let docset = document.getElementById(this.selectedelement.id);
    let svg = document.getElementById(this.selectedelement.id + 'crop');
    let editpath;
    let h = docset.getBoundingClientRect().height;
    let w = docset.getBoundingClientRect().width;
    let viewbox = '0 0 ' + w + ' ' + h;
    svg.setAttribute('viewBox', viewbox);
    // if not clippath present set to current size box 
    if (!this.selectedelement.clippath) {
      //editpath = 'M0,0 L300,0 L300,300 L0,300z'
      // editpath = 'M 10,10 L' + (w - 10) + ',10 L' + (w - 10) + ',' + (h - 10) + ' L10,' + (h - 10) + ' z';
      // this.selectedelement.clippath = editpath;
      // pathset.setAttribute('d', editpath);
      this.resetImageCropPath()
    } else {
      editpath = this.selectedelement.clippath;
    }
    docset.style['clip-path'] = '';
    this.pathEditor = PathEditor.create(pathset);
  }

  resetImageCropPath() {
    let pathset = document.getElementById(this.selectedelement.id + 'croppath');
    let docset = document.getElementById(this.selectedelement.id);
    let svg = document.getElementById(this.selectedelement.id + 'crop');
    let h = docset.getBoundingClientRect().height;
    let w = docset.getBoundingClientRect().width;
    switch (this.standardpath) {
      case 'linear': {
        let editpath = 'M282.457,480.74 C282.457,480.74 280.457,217.529 279.888,139.457   ';
        this.selectedelement.clippath = editpath;
        pathset.setAttribute('d', editpath);
        break
      }
      case 'circle': {
        let circw = (w - 10) / 2;
        let circh = (h - 10) / 2;
        let newsvgpath = '<ellipse cx="' + circw + '" cy="' + circw + '" rx="' + circh + '" ry="' + circh + '" id="' + this.selectedelement.id + 'croppath" style="opacity: 0;" />';
        pathset.outerHTML = newsvgpath;
        MorphSVGPlugin.convertToPath("circle, rect, ellipse, line, polygon, polyline");
        break
      }
      case 'square': {
        let editpath = 'M 10,10 L' + (w - 10) + ',10 L' + (w - 10) + ',' + (h - 10) + ' L10,' + (h - 10) + ' z';;
        this.selectedelement.clippath = editpath;
        pathset.setAttribute('d', editpath);
        break
      }
    }
  }

  async imageSaveCropPath() {
    if (this.cropimages) {
      let pathset = document.getElementById(this.selectedelement.id + 'croppath');
      let rawpath = await MotionPathPlugin.getRawPath(pathset);
      let stringpath;
      let style = pathset.getAttribute('transform');
      if (style) {
        style = style.replace('matrix(', '');
        style = style.replace('matrix(', '');
        style = style.replace(')', '');
        style = style.replace(/,/g, ' ');
        let newmatrix = style.split(' ').map(Number);
        let testpath2 = await MotionPathPlugin.transformRawPath(rawpath, newmatrix[0], newmatrix[1], newmatrix[2], newmatrix[3], newmatrix[4], newmatrix[5]);
        stringpath = await MotionPathPlugin.rawPathToString(testpath2);
      } else {
        stringpath = await MotionPathPlugin.rawPathToString(rawpath);
      }
      this.selectedelement.clippath = stringpath;
      this.selectedelement.style['clip-path'] = 'url(#' + this.selectedelement.id + 'cropclip)'
      this.cropimages = false;
      this.detectchange();
    }
  }

  imageRemoveCrop() {
    this.selectedelement.style['clip-path'] = ''
    this.cropimages = false;
    this.detectchange();
  }

  async playFunc() {
    console.log('play', this.animationarray);
    // clean up edits
    this.removeVectorPathMultiSelection();
    this.removeVectorPathSelection();
    this.vectorcombiedit = false;
    this.selectedelement = '';
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
    this.primairytimeline.pause(0);
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
    this.vectorcombiedit = false;
    this.animationarray[i].vectors.forEach(element => {
      element.groupmember = false;
    });
    this.animationarray.splice(i, 1);
    this.detectchange();
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
    this.http.get(event, { responseType: 'blob' }).subscribe(blob => {
      var urlCreator = window.URL;
      this.videourl = urlCreator.createObjectURL(blob);
    })
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
      scale: 0,
      object: ''
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

  async deleteVectorSrc(i, idx, element) {
    this.selectedelement.vectors.splice(idx, 1);
    this.selectedelement.svgcombi = '';
    for (let i = 0; i < this.selectedelement.vectors.length; i++) {
      let vector: vectorelement = this.selectedelement.vectors[i];
      let e = document.getElementById('');
      let vectorid = vector.idx;
      await this.initVectors(e, i, idx, vectorid);
    }
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
        // pathidar = vectstring.match(/id="(.*?)"/g); //get ids
        // newvectstring = await this.GrabPaths(vectstring, pathidar);
        newvectstring = await this.getPath(vect.idx);

        //newvectstring = vectstring;

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

    // await this.combineSVGs(element); // takes to long to rebuild

    for (let i1 = 0; i1 < vectors.length - 1; i1++) {
      let fromvector = vectors[i1];
      let tovector = vectors[i1 + 1];
      let fintime = animation.start_time + animation.duration + (animation.duration * i1);
      let fintimehalf = animation.duration / 0.9;
      let starttime = animation.start_time + (animation.duration * i1) + (1 * i1);
      let repeat = animation.repeat;
      let yoyo = animation.yoyo;

      //console.log(yoyo);
      // if vector 1 has less paths then vector 2
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
              if (checkifexit == null) {
                const newElement = fromel.cloneNode(true) as HTMLElement;
                newElement.setAttribute('id', newid);
                svgnew.insertAdjacentElement('afterbegin', newElement)
                //svgnew.appendChild(newElement);
                vectornewpath = document.getElementById('0elvect-res' + ix);
              } else {
                vectornewpath = checkifexit;
              }
            }
            //this.primairytimeline.set()
            if (repeat !== -1) {
              this.primairytimeline.set(vectornewpath, { morphSVG: { shape: vectornewpath }, autoAlpha: 1 }, 0); //reset to original
              this.primairytimeline.fromTo(toel, { autoAlpha: 0 }, { duration: fintimehalf, autoAlpha: 1, repeat: repeat, yoyo: yoyo }, fintime - 1);
              this.primairytimeline.to(vectornewpath, { duration: 1, autoAlpha: 0, repeat: repeat, yoyo: yoyo }, fintime);
            }
            if (repeat === -1) {
              this.primairytimeline.set(toel, { autoAlpha: 0 }, 0); //reset to original
              this.primairytimeline.set(vectornewpath, { autoAlpha: 1 }, 0); //reset to original
            }

            this.primairytimeline.to(vectornewpath, {
              duration: animation.duration, morphSVG: {
                shape: toel,
                //type: "rotational",
                //origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
              }, ease: ease, repeat: repeat, yoyo: yoyo
            }, starttime);

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

          // always reset morph element
          this.primairytimeline.set(fromel, {
            morphSVG: {
              shape: fromel,
            }
          });
          if (repeat !== -1) {
            this.primairytimeline.set(fromel, { morphSVG: { shape: fromel }, autoAlpha: 1 }, 0); //reset to original
            this.primairytimeline.fromTo(toel, { autoAlpha: 0 }, { duration: fintimehalf, autoAlpha: 1, repeat: repeat, yoyo: yoyo }, fintime - 1);
            this.primairytimeline.to(fromel, { duration: 1, autoAlpha: 0, repeat: repeat, yoyo: yoyo }, fintime);
            this.primairytimeline.to(fromel, {
              duration: animation.duration,
              morphSVG: {
                shape: toel,
                //type: "rotational",
                //origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
              }, ease: ease, repeat: repeat
            }, starttime);
          }
          if (repeat === -1) {
            let ease2 = ease.replace('in', 'out')
            this.primairytimeline.set(toel, { autoAlpha: 0 }, 0); //reset to original
            this.primairytimeline.set(fromel, { autoAlpha: 1 }, 0); //reset to original
            this.primairytimeline.to(fromel, {
              duration: animation.duration / 2,
              morphSVG: {
                shape: toel,
              }, ease: ease, repeat: repeat
            }, starttime);
            this.primairytimeline.to(fromel, {
              delay: animation.duration / 2,
              repeatDelay: animation.duration / 2,
              duration: animation.duration / 2,
              morphSVG: {
                shape: fromel,
              }, ease: ease2, repeat: repeat
            }, starttime);
          }

          this.primairytimeline.to(fromel, {
            duration: animation.duration,
            morphSVG: {
              shape: toel,
              //type: "rotational",
              //origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
            }, ease: ease, repeat: repeat
          }, starttime);


        } else { // (i2 > tovector.pathids.length)
          // vector 1 is larger then vector 2
          let frompathid = fromvector.pathids[i2];
          let sindex = Math.floor(Math.random() * tovector.pathids.length); //connect to random paths;
          let topathid = tovector.pathids[sindex];
          let fromel = document.getElementById(frompathid);
          let toel = document.getElementById(topathid);

          if (repeat !== -1) {
            this.primairytimeline.set(fromel, { morphSVG: { shape: fromel }, autoAlpha: 1 }, 0); //reset to original
            this.primairytimeline.fromTo(toel, { autoAlpha: 0 }, { duration: fintimehalf, autoAlpha: 1, repeat: repeat, yoyo: yoyo }, fintime - 1);
            this.primairytimeline.to(fromel, { duration: 1, autoAlpha: 0, repeat: repeat, yoyo: yoyo }, fintime);
          }
          if (repeat === -1) {
            this.primairytimeline.set(toel, { autoAlpha: 0 }, 0); //reset to original
            this.primairytimeline.set(fromel, { autoAlpha: 1 }, 0); //reset to original
          }
          this.primairytimeline.to(fromel, {
            duration: animation.duration, morphSVG: {
              shape: toel,
              //type: "rotational",
              //origin: "50% 50%" //or "20% 60%,35% 90%" if there are different values for the start and end shapes.
            }, ease: ease, repeat: repeat, yoyo: yoyo
          }, starttime);

        }
      }
    }
  }

  addWeatherEffect() {
    let type = this.canvas.weather;
    let classtype;
    let total = 30;
    let aggrenr = parseInt(this.canvas.width) * parseInt(this.canvas.height);
    let averagesize = Math.round(aggrenr / (600 * 500));
    if (type === 'flies') { total = 40 * averagesize }
    if (type === 'stars') { total = 100 * averagesize }
    if (type === 'snow') { total = 60 * averagesize }
    if (type === 'celebrations') { total = 60 * averagesize }
    if (type === 'rain') { total = 60 * averagesize }
    if (type === 'leaves') { total = 50 * averagesize }
    if (type === 'sun') { total = 90 * averagesize } // also depends on the angle this case is 90 degrees
    if (type === 'clouds') { total = 20 * averagesize }
    if (type === 'butterfly') { total = 15 * averagesize }
    let container = document.getElementById("weathercontainer");
    // container.removeChild   ---> ??
    container.innerHTML = '';
    let randomcolors = ['dodgerblue', 'red', 'yellow', 'green', 'purple']
    let w = container.offsetWidth;
    let h = container.offsetHeight;
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
      let setid = 'divPar' + i;
      Div.setAttribute('id', setid);

      if (this.canvas.hovereffect) {
        Div.addEventListener("mouseenter", (e) => {
          //console.log(e);
          this.primairytimeline.to(e.target, { duration: '5', y: this.R(0, w), x: this.R(0, h), ease: 'none' }, this.currenttime); //repeat: -1,  yoyo: true
        })
      }

      if (type === 'snow') {
        gsap.set(Div, { attr: { class: 'snow' }, x: this.R(0, canvasposR), y: -100, z: this.R(-200, 200), rotationZ: this.R(0, 180), rotationX: this.R(0, 360) });
      }
      if (type === 'celebrations') {
        //let yset = h * -1; // this.R(yset, 0)
        let randomy = this.RandomInt(0, 5);
        let color = randomcolors[randomy];
        Div.setAttribute('style', 'background-color: ' + color);
        gsap.set(Div, { attr: { class: 'celebrations' }, x: this.R(0, canvasposR), y: -100, z: this.R(-200, 200), rotationZ: this.R(0, 180), rotationX: this.R(0, 360) });
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
      if (type === 'stars') {
        let scale = this.R(0.2, 1.5);
        gsap.set(Div, { attr: { class: 'stars' }, scale: scale, x: this.R(0, parseInt(this.canvas.width, 10)), y: this.R(0, parseInt(this.canvas.height, 10)) });
        this.canvas["background-color"] = 'transparent';
      }
      if (type === 'flies') {
        let scale = this.R(0.2, 1.5);
        gsap.set(Div, { attr: { class: 'flies' }, scale: scale, x: this.R(0, parseInt(this.canvas.width, 10)), y: this.R(0, parseInt(this.canvas.height, 10)) });
      }

      if (type === "butterfly") {
        // butterfly
        let butterfly = document.createElement('div');
        butterfly.className = "butterfly";
        Div.appendChild(butterfly);
        let wing1 = document.createElement('div');
        wing1.className = "wing";
        butterfly.appendChild(wing1);
        let bit1 = document.createElement('div');
        bit1.className = "bit";
        wing1.appendChild(bit1);
        let bit2 = document.createElement('div');
        bit2.className = "bit";
        wing1.appendChild(bit2);
        let wing2 = document.createElement('div');
        wing2.className = "wing";
        butterfly.appendChild(wing2);
        let bit3 = document.createElement('div');
        bit3.className = "bit";
        wing2.appendChild(bit3);
        let bit4 = document.createElement('div');
        bit4.className = "bit";
        wing2.appendChild(bit4);

        let randomy = this.RandomInt(0, 5);
        let color = randomcolors[randomy];
        let bits = Div.getElementsByClassName('bit')
        for (let i = 0; i < bits.length; i++) {
          bits[i].setAttribute('style', 'background-color: ' + color);
        }
        let scale = this.R(0.1, 0.3);
        let calcscale = (scale - 1);
        let w2 = parseInt(this.canvas.width) / 2;
        let h2 = parseInt(this.canvas.height) / 2;
        let mw = w2 * calcscale;
        let mh = h2 * calcscale;

        gsap.set(Div, { scale: scale, x: this.R(mw, (w + mw)), y: this.R(mh, h) });   //  compensate for scale   
        let movex = '+=' + this.R((mw * 2), (w + mw)); // mw * 2 increases travellenght 
        let movey = '+=' + this.R((mh * 2), h);
        this.primairytimeline.to(Div, { duration: this.R(5, 15), scale: scale, ease: 'none', repeat: -1, yoyo: true }, this.R(0, 10));
        this.primairytimeline.to(Div, { duration: this.R(5, 15), y: movey, ease: 'none', repeat: -1, yoyo: true }, 0);
        this.primairytimeline.to(Div, { duration: this.R(5, 15), x: movex, rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'none' }, 0);
      }

      if (type === 'clouds') { this.animclouds(Div, h, w); }
      if (type === 'snow') { this.animsnow(Div, h); }
      if (type === 'celebrations') { this.animceleb(Div, h, w); }
      if (type === 'rain') { this.animrain(Div, h); }
      if (type === 'leaves') { this.animleaves(Div, h); }
      if (type === 'sun') {
        let angle = (270 + i) * (Math.PI / 180);
        let xa = w - (Math.cos(angle) * w); // w
        let ya = -1 * (Math.sin(angle) * h); // h
        gsap.set(Div, { attr: { class: 'sunray' }, x: w + 10, y: -10, rotation: i + "_short", });
        this.animsun(Div, ya, xa);
      }
      if (type === 'flies') {
        this.animflies(Div, h, w);
      }
      if (type === 'stars') { this.animstars(Div); }
      if (type === 'butterfly') { this.animbutterfly(Div, h, w); }

      container.appendChild(Div);
    }
  }

  animbutterfly(elm: HTMLDivElement, h, w) {
    let customease = CustomEase.create("custom", "M0,0,C0,0,0.256,0.014,0.432,0.176,0.608,0.338,0.436,0.638,0.638,0.842,0.792,0.998,1,1,1,1");
    let leftwing = elm.getElementsByClassName('wing')[0];
    let rightwing = elm.getElementsByClassName('wing')[1];
    this.primairytimeline.fromTo(leftwing, { rotationY: -20 }, {
      rotationY: 90, duration: 0.25, transformOrigin: '700% 50%', repeat: -1, yoyo: true,
      ease: customease
    }, 0);
    this.primairytimeline.fromTo(rightwing, { rotationY: 200 }, {
      rotationY: 90, duration: 0.25, repeat: -1, yoyo: true,
      ease: customease
    }, 0);
    let butterfly = elm.getElementsByClassName('butterfly')[0];
    this.primairytimeline.fromTo(butterfly, { y: 0 }, { y: -5, duration: 0.25, repeat: -1, yoyo: true, ease: customease }, 0); //set body animation
  }

  animflies(elm, h, w) {
    let minw = (w * -1) / 2;
    let minh = (h * -1) / 2;
    let movex = '+=' + this.R(minw, (w / 2));
    let movey = '+=' + this.R(minh, (h / 2));
    let scale = this.R(0.2, 1.5);
    this.primairytimeline.to(elm, { duration: this.R(5, 20), scale: scale, ease: 'none', repeat: -1, yoyo: true }, this.R(0, 10));
    this.primairytimeline.to(elm, { duration: this.R(0, 20), autoAlpha: 0.1, ease: 'none', repeat: -1, yoyo: true }, this.R(0, 10));
    this.primairytimeline.to(elm, { duration: this.R(5, 20), y: movey, ease: 'none', repeat: -1, yoyo: true }, 0);
    this.primairytimeline.to(elm, { duration: this.R(5, 20), x: movex, rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'none' }, 0);
  }


  animstars(elm) {
    let scale = this.R(0.2, 1.5);
    this.primairytimeline.to(elm, { duration: 10, scale: scale, ease: 'none', repeat: -1, yoyo: true, delay: this.R(0, 10) }, this.R(0, 10));
    this.primairytimeline.to(elm, { duration: 5, autoAlpha: 0, ease: 'none', repeat: -1, yoyo: true, delay: this.R(0, 10) }, this.R(0, 10));
  }

  animsun(elm, h, w) {
    this.primairytimeline.to(elm, { duration: 10, y: h, x: w, ease: 'linear.none', repeat: -1, delay: 0 }, this.R(0, 10));
  }

  animclouds(elm, h, w) {
    this.primairytimeline.to(elm, { duration: 15, x: '+=200', ease: 'linear.none', repeat: -1, delay: 0 }, 0);
  } // y: h, '+=' + w

  animsnow(elm, h) {
    let randomstart = this.R(0, 25)
    this.primairytimeline.to(elm, { duration: this.R(15, 30), y: h + 100, ease: 'linear.none', repeat: -1, delay: 0 }, randomstart);
    this.primairytimeline.to(elm, { duration: this.R(8, 8), x: '+=100', rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, randomstart);
    this.primairytimeline.to(elm, { duration: this.R(2, 8), rotationX: this.R(0, 360), rotationY: this.R(0, 360), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, randomstart);
  };

  animceleb(elm, h, w) {
    let minw = (w * -1) / 2;
    let movex = '+=' + this.R(minw, (w / 2));
    let randomstart = this.R(0, 25)
    this.primairytimeline.to(elm, { duration: this.R(20, 30), y: h + 100, ease: 'linear.none', repeat: -1, delay: 0 }, randomstart);
    this.primairytimeline.to(elm, { duration: this.R(8, 15), x: movex, rotationZ: this.R(0, 180), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, randomstart);
    this.primairytimeline.to(elm, { duration: this.R(8, 15), rotationX: this.R(0, 360), rotationY: this.R(0, 360), repeat: -1, yoyo: true, ease: 'sine.out', delay: 0 }, randomstart);
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

  RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }


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
    // console.log(svgstring, idx, pathidar);
    let newsvgstring = svgstring;
    let index = 0;
    let r = Math.random().toString(36).substring(7); // add random sring
    for (const element of pathidar) {
      let ind = index + 1;
      let newid = 'id="' + idx + ind + r + '"';
      newsvgstring = await this.runloop(newsvgstring, element, newid);
      ++index;
    };
    return newsvgstring;
  }

  // Moved to server
  // async renumberSvgIds(svgstring, idx, pathidar): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     let jsonaniarray = JSON.stringify(pathidar);
  //     let data = {
  //       svgstring: svgstring,
  //       pathidar: jsonaniarray,
  //       idx: idx
  //     }
  //     this.filesApi.renumberSvgIds(data)
  //       .subscribe((newsvgstring: string) => {
  //         resolve(newsvgstring);
  //       });
  //   });
  // }

  getPath(vectorid) {
    let svgdiv = document.getElementById(vectorid);
    //let svg = svgdiv.getElementsByTagName('svg')[0];
    let paths = svgdiv.getElementsByTagName('path');
    //console.log(paths)
    let newpaths = [];
    for (let y = 0; y < paths.length; y++) {
      let ohtml = paths[y].outerHTML;
      newpaths.push(ohtml)
    };
    //console.log(clippaths);
    let pathjoin = newpaths.join('');
    return pathjoin;
  }

  async GrabPaths(vectstring, pathidar): Promise<string> {
    return new Promise((resolve, reject) => {
      let jsonidar = JSON.stringify(pathidar)
      let data = {
        vectstring: vectstring,
        jsonidar: jsonidar
      }
      this.filesApi.grabPaths(data).subscribe(res => {
        resolve(res);
      });
    });
  }


  async runloop(newsvgstring, element, newid) {
    newsvgstring = newsvgstring.replace(element, newid);
    return newsvgstring
  }

  // grabPaths(svgstring, pathidar) {
  //   return new Promise((resolve, reject) => {
  //     let svgarray = [];
  //     // const element of pathidar
  //     for (let i = 0; i < pathidar.length; i++) {
  //       let n = svgstring.indexOf('<path ');
  //       let lx = svgstring.indexOf('</path>'); //<defs
  //       let l = lx + 7;
  //       if (n !== -1) {
  //         svgarray.push(svgstring.substring(n, l));
  //         svgstring = svgstring.replace(svgstring.substring(n, l), '');
  //       }
  //     }
  //     svgstring = svgarray.join('');
  //     resolve(svgstring)
  //   });
  // }

  // Moved to server 


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

  async deleteVectorGroup(svg, id) {
    return new Promise(async (resolve, reject) => {
      let groupElement;
      let e = svg;//document.getElementById(id);
      let g = e.getElementsByTagName("g");
      if (g.length === 0) { resolve() }
      //if (g.length < 1000) {
      //console.log("çheck groups")
      for (let index = 0; index < g.length; index++) {  // ---> g.length
        g[index].setAttribute("id", id + index + 'g');

        let sg = id + index + 'g';
        groupElement = SVG.get(sg);
        if (typeof groupElement.ungroup === "function") {
          groupElement.ungroup(groupElement.parent());
        }
        if (index === g.length) { resolve() }
      }
    })
  }

  async resizeVector(originalsize, newsize, idx, svg) {
    return new Promise(async (resolve, reject) => {
      let e = svg;

      let scale;
      let newtranssize;
      if (newsize.height > newsize.width) {
        newtranssize = originalsize.height / newsize.height;
      } else {
        newtranssize = originalsize.width / newsize.width;
      }
      let x = parseInt(originalsize.x, 10);
      let y = parseInt(originalsize.y, 10);
      let x2 = parseInt(newsize.x, 10) * -1;
      let y2 = parseInt(newsize.y, 10) * -1;
      let newx = x; // - x2;
      let newy = y; // - y2;

      if (originalsize.x === newsize.x) {
        newx = 0;
      }
      if (originalsize.y === newsize.y) {
        newy = 0;
      }

      scale = Number((newtranssize).toFixed(8));
      let p = e.getElementsByTagName("path");
      //console.log(newx, newy, scale, p)
      let rawpath;
      for (let index = 0; index < p.length; index++) {

        p[index].setAttribute("id", "child-" + index + idx); // keep in case there is no ID set
        let rawpath1 = await MotionPathPlugin.getRawPath(p[index]);
        if (newx === 0 && newy === 0) {
          rawpath = rawpath1;
        } else {
          rawpath = await MotionPathPlugin.transformRawPath(rawpath1, 1, 0, 0, 1, x2, y2); // remove viewport x and y of newpath otherwise it will scale on the wrong viewport
        }
        let svgsizearray = [scale, 0, 0, scale, newx, newy];
        let newmatrix;
        let transf = p[index].getAttribute('transform'); // there is transform on the element we need remove it
        //console.log(svgsizearray)
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
      var viewBox = [bbox.x - 5, bbox.y - 5, bbox.width + 5, bbox.height + 5].join(" ");
      svg.setAttribute("viewBox", viewBox);
      this.selectedelement.svgcombi = svg.outerHTML;
      this.detectchange();
    }, 300);

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
    if (this.dragselectvectpath === true && this.dragselectiontrue === false && !this.editfigure) {
      this.dragSelect(this.selectedelement.id); // activate drag
    } else if (this.dragselectiontrue === false && !this.editfigure) { // check if drag is not in progress
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
    // if (this.selectedVecPathmultiple.length > 0) {
    //   this.selectedVecPathmultiple.forEach((path, index) => {
    //     this.deletePathSelClass(path)
    //     this.selectedVecPathmultiple.splice(index, 1)
    //   });
    // }
    let allselectedclass = document.getElementsByClassName('data-selected');
    for (let i = 0; i < allselectedclass.length; ++i) {
      allselectedclass[i].classList.remove('data-selected');
    }
    this.selectedVecPathmultiple = [];
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

      const dialogRef = this.dialog.open(DialogGetname, {
        width: '250px',
        data: { name: this.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        let name = result+ '.svg' ;
        console.log(name)
        if (!name) { name = Math.random().toString(36).substring(7) + '.svg' }
        let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
        this.uploader = new FileUploader({ url: urluse });
        let date: number = new Date().getTime();
        let data = url;
        let contentType = '';
        const blob = new Blob([data], { type: contentType });
        // contents must be an array of strings, each representing a line in the new file
        let file = new File([blob], name, { type: "image/svg+xml", lastModified: date });
        let fileItem = new FileItem(this.uploader, file, {});
        this.uploader.queue.push(fileItem);
        let size = this.uploader.queue[0].file.size;
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
              this.newFiles.size = size
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
    });
    }

  onshowemoji(i) {
      if(this.showemoji) { this.showemoji = false } else {
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

    // clean chart area for JSON 
    let meta = [];
    for (let i = 0; i < this.animationarray.length; i++) {
      meta.push([])
      if (this.animationarray[i].type === 'chart') {
        for (let y = 0; y < this.animationarray[i].data.length; y++) {
          let meta1 = this.animationarray[i].data[y]._meta;
          let meta2 = this.animationarray[i].productiondata[y]._meta;
          meta[i].push(meta1);
          meta[i].push(meta2);
          delete this.animationarray[i].data[y]._meta;
          delete this.animationarray[i].productiondata[y]._meta;
        }
      }
    }

    if (this.name === undefined) { this.name = Math.random().toString(36).substring(7); }
    // check file name exist or is overwriting new 
    this.relationsApi.getFiles(this.option.id, { where: { name: this.name } })
      .subscribe((res => {
        if (res.length > 0 && !this.newFiles.id) { this.name = this.name + '1' }
        let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + this.name;
        let screenshoturl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + this.name + '-screenshot.png';
        let setimgurl = 'https://api.xbms.io/api/Containers/' + this.option.id + '/download/' + this.name;
        imgurl = imgurl.replace(/ /g, '-'),
          // define the file settings
          this.newFiles.name = this.name;
        this.newFiles.url = setimgurl;
        this.newFiles.createdate = new Date();
        this.newFiles.type = 'video';
        this.newFiles.companyId = this.Account.companyId;
        this.newFiles.canvas = [this.canvas];
        this.newFiles.template = this.animationarray;
        this.newFiles.counter = this.counter;
        this.newFiles.companyId = this.Account.companyId;
        this.newFiles.screenshot = screenshoturl;

        if (this.newFiles.id) {
          this.relationsApi.updateByIdFiles(this.newFiles.relationsId, this.newFiles.id, this.newFiles).subscribe(res => {
            this.snackBar.open("video saved!", undefined, {
              duration: 2000,
              panelClass: 'snackbar-class'
            });
            // restore chart area meta function
            this.restoreChart(meta);
          });
        } else {
          this.relationsApi.createFiles(this.option.id, this.newFiles).subscribe(res => {
            this.snackBar.open("video saved!", undefined, {
              duration: 2000,
              panelClass: 'snackbar-class'
            });
            // restore chart area meta function
            this.restoreChart(meta);
          });
        }
      }));

  }

  restoreChart(meta) {
    for (let i = 0; i < this.animationarray.length; i++) {
      if (this.animationarray[i].type === 'chart') {
        for (let y = 0; y < this.animationarray[i].data.length; y++) {
          this.animationarray[i].data[y]._meta = meta[i][0];
          this.animationarray[i].productiondata[y]._meta = meta[i][1];
        }
      }
    }
  }

  async saveVideoAs() {

    let meta = [];
    for (let i = 0; i < this.animationarray.length; i++) {
      meta.push([])
      if (this.animationarray[i].type === 'chart') {
        for (let y = 0; y < this.animationarray[i].data.length; y++) {
          let meta1 = this.animationarray[i].data[y]._meta;
          let meta2 = this.animationarray[i].productiondata[y]._meta;
          meta[i].push(meta1);
          meta[i].push(meta2);
          delete this.animationarray[i].data[y]._meta;
          delete this.animationarray[i].productiondata[y]._meta;
        }
      }
    }

    const dialogRef = this.dialog.open(DialogGetname, {
      width: '250px',
      data: { name: this.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      let name = result;
      console.log(name)
      if (name) {
        this.relationsApi.getFiles(this.option.id, { where: { name: this.name } })
          .subscribe(res => {
            if (res.length > 0) { name = name + '-1' }
            let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name;
            let setimgurl = 'https://api.xbms.io/api/Containers/' + this.option.id + '/download/' + name;
            imgurl = imgurl.replace(/ /g, '-'),
              // define the file settings
              this.newFiles.name = name;
            this.newFiles.url = setimgurl;
            this.newFiles.createdate = new Date();
            this.newFiles.type = 'video';
            this.newFiles.companyId = this.Account.companyId;
            this.newFiles.canvas = [this.canvas];
            this.newFiles.template = this.animationarray;
            this.newFiles.counter = this.counter;
            this.newFiles.companyId = this.Account.companyId;
            this.newFiles.id = undefined;
            this.newFiles.screenshot = name + '-screenshot.png';

            this.relationsApi.createFiles(this.option.id, this.newFiles).subscribe((res: Files) => {
              this.name = name;
              this.newFiles.id = res.id
              this.snackBar.open("video saved!", undefined, {
                duration: 2000,
                panelClass: 'snackbar-class'
              });
              this.restoreChart(meta);

            });

          });
      } else {
        this.restoreChart(meta);
      }
    });
  }

  createVideoCodeSnippet() {
    if (this.newFiles.id) {
      this.dialogsService
        .confirm('Implement code', 'Do you want to save as seperate video?')
        .subscribe(res => {
          if (res) { this.saveVideoAs() } else {
            this.saveVideo();
          }
          let myJSON = JSON.stringify(this.canvas);
          let canvasjson = encodeURIComponent(myJSON);
          let url = 'https://dlcr.xbms.io?id=' + this.newFiles.id + '&canvas=' + canvasjson + '&repeat=false&remote=true';
          //this.snippetcode = '<iframe scrolling="no" width="' + this.canvas.width + '" height="' + this.canvas.height + '" src="' + url + 'counter="' + this.counter + '"></iframe>';
          
          let w = parseInt(this.canvas.width);
          let h = parseInt(this.canvas.height);
          console.log(w, h)
          let aspectratio =  (h / w) * 100;
          let containerstyle =  'overflow:hidden; padding-top:'+aspectratio+'%; position: relative;';
          let iframestyle = 'border:0; height:100%; left:0; position:absolute; top:0; width:100%;';
          
          //let url = 'https://dlcr.xbms.io?id=' + this.editablevideo.id + '&canvas=' + canvasjson + '&repeat=false&remote=true';
          this.snippetcode = '<div style="'+ containerstyle +'">'+
          '<iframe style="'+ iframestyle +'" scrolling="no" frameborder="0" allowfullscreen src="' + url +
           '"></iframe></div>'; 
          
          this.codesnippetService.confirm('Copy Code', 'Copy code and input in your website', this.snippetcode).subscribe()
        });
    }
  }

  downloadAsJSON() {
    let meta = [];
    for (let i = 0; i < this.animationarray.length; i++) {
      meta.push([])
      if (this.animationarray[i].type === 'chart') {
        for (let y = 0; y < this.animationarray[i].data.length; y++) {
          let meta1 = this.animationarray[i].data[y]._meta;
          let meta2 = this.animationarray[i].productiondata[y]._meta;
          meta[i].push(meta1);
          meta[i].push(meta2);
          delete this.animationarray[i].data[y]._meta;
          delete this.animationarray[i].productiondata[y]._meta;
        }
      }
    }

    let downloadjson = {
      name: this.name,
      canvas: [this.canvas],
      animationarray: this.animationarray,
      counter: this.counter,
    }
    let downloadstring = JSON.stringify(downloadjson);
    // create downloadable string
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(downloadstring);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", this.name + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    this.restoreChart(meta);
  }

  loadVideo() {
    this.dialogsService
      .confirm('Load video', 'Do you want to load this video?')
      .subscribe(res => {
        if (res) {
          this.loadEditableVideo();
        }
      });
  }

  async converttovideo() {
    if (this.newFiles.id) {
      this.dialogsService
        .confirm('Implement code', 'Do you want to save as seperate video?')
        .subscribe(res => {
          if (res) { this.saveVideoAs() } else {
            this.saveVideo();
          }
          this.removeVectorPathSelection();
          this.removeVectorPathMultiSelection();
          let array = this.animationarray;
          let myJSON = JSON.stringify(array);
          this.canvas.videourl = this.canvas.videourl.replace('http://localhost:3000', 'https://api.xbms.io')
          //var aniarray = encodeURIComponent(myJSON);
          if (this.name === undefined) { this.name = Math.random().toString(36).substring(7); }
          this.filesApi.createvideo(this.option.id, this.option.companyId,
            this.name, this.canvas, myJSON, this.counter)
            .subscribe(
              res => {
                //console.log(res);
                this.saveVideo()
              }
            );
        });
    }
  }

  async converttogif() {
    if (this.newFiles.id) {
      this.dialogsService
        .confirm('Implement code', 'Do you want to save as seperate video?')
        .subscribe(res => {
          if (res) { this.saveVideoAs() } else {
            this.saveVideo();
          }
        });
    }
    this.canvas.videourl = this.canvas.videourl.replace('http://localhost:3000', 'https://api.xbms.io')
    this.removeVectorPathSelection();
    this.removeVectorPathMultiSelection();
    let array = this.animationarray;
    let myJSON = JSON.stringify(array);
    if (this.name === undefined) { this.name = Math.random().toString(36).substring(7); }
    this.filesApi.creategif(this.option.id, this.option.companyId,
      this.name, this.canvas, myJSON, this.counter)
      .subscribe(
        res => {
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

  resetVideo() {
    this.dialogsService
      .confirm('Reset', 'Do you want to reset this video?')
      .subscribe(res => {
        if (res) {
          const myNode = document.getElementById('weathercontainer');
          myNode.innerHTML = '';
          this.newFiles = this.editablevideo;
          this.name = this.editablevideo.name;
          this.canvas = this.editablevideo.canvas[0];
          this.animationarray = this.editablevideo.template;
          this.counter = this.editablevideo.counter;
          this.detectchange();
        }
      });
  }

  newVideo() {
    this.name = '';
    this.canvas = {
      width: '600px',
      height: '500px',
      'background-color': '#ffffff',
      'background-image': '',
      position: 'relative',
      videourl: '',
      loop: false,
      weather: '',
      audio: '',
      top: '',
      left: '',
      hovereffect: false
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
    this.name = this.editablevideo.name;
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
    element.classList.add('data-selected');
  }

  deletePathSelClass(element) {
    element.classList.remove('data-selected');
  }

  addcell(i1, i2): void {
    this.selectedelement.data[i1].data.push(0);
    this.selectedelement.productiondata[i1].data.push(0);
  }

  addLabel(i1): void {
    this.selectedelement.label.push("new label");
  }

  addgraph(i1): void {
    this.selectedelement.data.push({ data: [0, 0, 0], labels: 'new label' });
    this.selectedelement.productiondata.push({ data: [0, 0, 0], labels: 'new label' });
    this.selectedelement.colors.push(
      { // grey
        backgroundColor: '#232222',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      }
    )
  }

  deletegraph(): void {
    let del = this.selectedelement.data.length - 1;
    this.selectedelement.data.splice(del, 1);
    this.selectedelement.productiondata.splice(del, 1);
    this.detectchange();
  }

  detectchangerowcell(i1, i2, cell): void {
    this.selectedelement.data[i1].data[i2] = cell;
    let max = Math.max(... this.selectedelement.data[i1]);
    let min = Math.min(... this.selectedelement.data[i1]);
    if (max < cell) {
      this.selectedelement.lineChartOptions.scales.yAxes[0].ticks.suggestedMax = cell;
      this.selectedelement.lineChartOptions.scales.yAxes[0].ticks.suggestedMin = min;
    }
    if (min > cell) {
      this.selectedelement.lineChartOptions.scales.yAxes[0].ticks.suggestedMin = cell;
      this.selectedelement.lineChartOptions.scales.yAxes[0].ticks.suggestedMax = max; // throws error if not
    }
    //this.selectedelement.productiondata[i1].data[i2] = 0;
    this.detectchange();
  }

  detectchangerowlabel(i1, labelnew): void {
    this.selectedelement.data[i1].label = labelnew;
    this.selectedelement.productiondata[i1].label = labelnew;
    this.detectchange();
  }

  detectchangeLabel(i1, label): void {
    this.selectedelement.label[i1] = label;
    this.detectchange();
  }

  detectchangetype(type): void {
    this.selectedelement.charttype = type;
    this.detectchange();
  }

  deletelabel(i1) {
    let del = this.selectedelement.label.length - 1;
    this.selectedelement.label.splice(del, 1);
    this.detectchange();
  }

  deletecell(i1) {
    let del = this.selectedelement.data[i1].data.length - 1;
    this.selectedelement.data[i1].data.splice(del, 1);
    this.selectedelement.productiondata[i1].data.splice(del, 1);
    this.detectchange();
  }

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
    }
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

  movePartUp(i1, combi) {
    if (i1 > 0) {
      this.swapElement(combi, (i1 - 1), i1);
      combi.forEach((part, i) => {
        part.style['z-index'] = i;
      })
      this.detectchange();
      console.log(i1, combi);
    }
  }


  movePartDown(i1, combi) {
    if ((combi.length - 1) > i1) {
      this.swapElement(combi, (i1 + 1), i1);
      combi.forEach((part, i) => {
        part.style['z-index'] = i;
      })
      this.detectchange();
      console.log(i1, combi);
    }
  }



}