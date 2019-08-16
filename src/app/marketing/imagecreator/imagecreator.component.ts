import { Component, OnInit, Input } from '@angular/core';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { NgModule, HostListener } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { Array } from 'core-js';
import { ViewChild, ElementRef } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
//import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {Subscription} from 'rxjs';

export class image {
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
}

export class shape {
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
}

export class text {
  content: string;
  type: 'text';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
    'font-size': string;
    'font-style': string;
  }
  posx: number;
  posy: number;
  setpos: object;
}


export class chart {
  charttype: string;
  src: string;
  label: Label[] = [];
  data: ChartDataSets[];
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
  type: 'chart';
  style: {
    'z-index': number,
    width: string;
    height: string;
    position: 'absolute';
  }
  posx: number;
  posy: number;
  setpos: object;
}

@Component({
  selector: 'app-imagecreator',
  templateUrl: './imagecreator.component.html',
  styleUrls: ['./imagecreator.component.scss']
})



export class ImagecreatorComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  @Input() company: Company = new Company;

  public listviewxsshow = false;
  public showprogressbar = false;
  public uploader: FileUploader;
  public newFiles: Files = new Files();
  public images = [];
  public changenow = true;
  public shiftX = 0;
  public shiftY = 0;
  public aspectRatio = true;
  public imagename = 'New Image';
  public editableimage: Files;
  public editableimages: Files[];
  public context: CanvasRenderingContext2D;
  public canvas = {
    width: '600px',
    height: '1000px',
    'background-color': '#ffffff',
    position: 'relative'
  }
  public moveitem = false;
  public selectedImage: image;
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
    public media: MediaObserver,
    private relationsApi: RelationsApi,
    private filesApi: FilesApi,
    public snackBar: MatSnackBar,
  ) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change;
      //console.log(this.activeMediaQuery)
    });
  }

  ngOnInit() { }


  getEditFile() {
    this.relationsApi.getFiles(this.option.id, { where: { template: { "neq":  null } } })
      .subscribe((files: Files[]) => {
        this.editableimages = files;
        console.log('received files', this.editableimages);
      });
  }

  detectchange(): void {
    console.log('run check');
    this.images.forEach(img => {
      if (img.posx > 0) {
        img.setpos = { 'x': img.posx, 'y': img.posy };
        //  img.style.transform = 'translate('+ img.posx + ' px, '+ img.posy + 'px)';
      }

    })
    console.log(this.images)
    this.changenow = false;
    setTimeout(() => this.changenow = true);
  }

  addcell(i, i1, i2): void {
    this.images[i].data[i1].data.push(0);
  }

  addLabel(i, i1): void {
    this.images[i].label.push("new label");
  }

  addgraph(i, i1): void {
    this.images[i].data.push({ data: [0, 0, 0], labels: 'new label' });
    this.images[i].colors.push(
      { // grey
        backgroundColor: '#232222',
        borderColor: '#232222',
        pointBackgroundColor: '#232222',
        pointBorderColor: '#fff'
      }
    )
  }

  deletegraph(i): void {
    let del = this.images[i].data.length - 1;
    this.images[i].data.splice(del, 1);
    this.detectchange();
  }

  detectchangerowcell(i, i1, i2, cell): void {
    this.images[i].data[i1].data[i2] = cell;
    this.detectchange();
  }

  detectchangerowlabel(i, i1, labelnew): void {
    this.images[i].data[i1].label = labelnew;
    this.detectchange();
  }

  detectchangeLabel(i, i1, label): void {
    this.images[i].label[i1] = label;
    this.detectchange();
  }

  detectchangetype(i, type): void {
    this.images[i].charttype = type;
    this.detectchange();
  }

  deletelabel(i, i1) {
    let del = this.images[i].label.length - 1;
    this.images[i].label.splice(del, 1);
    this.detectchange();
  }

  deletecell(i, i1) {
    let del = this.images[i].data[i1].data.length - 1;
    this.images[i].data[i1].data.splice(del, 1);
    this.detectchange();
  }

  addNewImage(): void {
    this.newz = this.newz + 1;
    let img: image = {
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
      setpos: { 'x': 50, 'y': 50 }
    }
    this.images.push(img);
  }

  addNewShape(): void {
    this.newz = this.newz + 1;
    let img: shape = {
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
      setpos: { 'x': 50, 'y': 50 }
    }
    this.images.push(img);
  }

  addNewText(): void {
    this.newz = this.newz + 1;
    let txt: text = {
      type: 'text',
      style: {
        'z-index': this.newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        'font-size': '20px',
        'font-style': 'open-sans'
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      posy: 50,
      setpos: { 'x': 20, 'y': 50 }
    }
    this.images.push(txt);
  }



  addNewChart(): void {
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
    ]
    let chart: chart = {
      src: '',
      charttype: 'line',
      label: ['January', 'February', 'March'],
      data: [
        { data: [65, 59, 40], label: 'Series A' },
        { data: [28, 27, 90], label: 'Series B' }
      ],
      //options: 
      colors: colorset,
      legend: true,
      type: 'chart',
      style: {
        'z-index': this.newz,
        width: '400px',
        height: '400px',
        position: 'absolute'
      },
      posx: 20,
      posy: 50,
      setpos: { 'x': 20, 'y': 50 }
    }
    this.images.push(chart);
    console.log(chart);
  }

  setImage(event, i): void {
    setTimeout(() => {
      this.images[i].src = event;
      //else new file not uploaded yet  
    }, 500);
  }

  onMoving(event, i) {
    this.images[i].posy = event.y;
    this.images[i].posx = event.x;
  }

  onResizing(e, i) {
    this.images[i].style.width = e.size.width + 'px';
    this.images[i].style.height = e.size.height + 'px';
  }

  OnSaveImage() {
    this.showprogressbar = true;
    let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';

    // this.uploader.setOptions({ url: urluse });
    this.uploader = new FileUploader({ url: urluse });
    let i = 0;
    this.images.forEach((img, index) => {
      if (img.type === 'chart') {
        let idn = "graph" + index;
        let canvas = <HTMLCanvasElement>document.getElementById(idn);
        canvas.toBlob((blob1) => {
          let image = blob1;
          let name = Math.random().toString(36).substring(7) + '.png';
          // set upload url
          let date: number = new Date().getTime();
          let blob: Blob = new Blob([image]);
          //let fileFromBlob: File = new File([blob], name);
          // contents must be an array of strings, each representing a line in the new file
          let file = new File([blob], name, { type: "image/png", lastModified: date });
          let fileItem = new FileItem(this.uploader, file, {});
          this.uploader.queue.push(fileItem);
          fileItem.upload();


          this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
          // set download url or actual url for publishing
          let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name;
          imgurl = imgurl.replace(/ /g, '-'),
            //img.src = imgurl;
            this.images[index].src = imgurl;
          // define the file settings
          this.newFiles.name = name,
            this.newFiles.url = imgurl,
            this.newFiles.createdate = new Date(),
            this.newFiles.type = 'marketing',
            this.newFiles.companyId = this.Account.companyId,
            // check if container exists and create
            this.relationsApi.createFiles(this.option.id, this.newFiles)
              .subscribe(res => {
                ++i; if (i === this.images.length) { this.convertchartdata() }
                console.log(res);
              });
        };

        }, 'image/png', 1);
      } else { ++i; if (i === this.images.length) { this.convertchartdata() } }
    });
  }

  convertchartdata(): void {
    let i = 0;

    this.images.forEach((img, index) => {
      if (img.type === 'chart') {
        //img.data = undefined;
        img.data.forEach(dataelement => {
          dataelement._meta = undefined;
        });
        ++i;
        if (i === this.images.length){
          console.log(this.images)
          this.uploadFinalImages(this.images) 
        }
      } else {
        ++i;
        if (i === this.images.length){
          console.log(this.images)
          this.uploadFinalImages(this.images) 
        }
      }
    });
  
  }

  uploadFinalImages(imgup) {
    this.filesApi.createimage(
      this.option.id, this.Account.companyId, this.imagename, this.canvas, imgup)
      .subscribe(res => {
        this.showprogressbar = false;
        // console.log(res);
        this.snackBar.open(res, undefined, {
          duration: 2000,
          panelClass: 'snackbar-class'
        });
      })
  }

  resetImage(): void{
    this.images = [];
    this.canvas = {
      width: '600px',
      height: '1000px',
      'background-color': '#ffffff',
      position: 'relative'
    }
  }


  deleteitem(i) {
    this.images.splice(i, 1);
  }

  drop(e) {
    console.log(e);

    this.swapElement(this.images, e.currentIndex, e.previousIndex);
    this.images.forEach((img, i) => {
      img.style['z-index'] = i + 1;
    })

    this.detectchange()
  }

  swapElement(array, indexA, indexB) {
    var tmp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = tmp;
  }


  setemoji(event, i) {
    // console.log(event);
    const bufStr = String.fromCodePoint(parseInt(event.emoji.unified, 16));
    // console.log(bufStr);
    this.images[i].content = this.images[i].content + bufStr;
    this.onshowemoji(i)

  }

  onshowemoji(i) {
    if (this.showemoji) { this.showemoji = false } else {
      this.showemoji = true;
    }
  }

  loadEditableImage() {
    console.log(this.editableimage.template)
    this.images = this.editableimage.template;
    this.canvas = this.editableimage.canvas[0];
    console.log(this.images, this.canvas);
    this.detectchange();
  }


  swiperight(e) {
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    this.listviewxsshow = false;
  }


}
