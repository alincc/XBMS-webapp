import { Component, OnInit, Input } from '@angular/core';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi
} from '../../shared';
import { NgModule, HostListener } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';


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

@Component({
  selector: 'app-imagecreator',
  templateUrl: './imagecreator.component.html',
  styleUrls: ['./imagecreator.component.scss']
})



export class ImagecreatorComponent implements OnInit {
  // @HostListener('document:mousemove', ['$event'])
  // @HostListener('click', ['$event.target'])
  // @HostListener('mousedown', ['$event'])
  // @HostListener('mouseup', ['$event'])


  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  @Input() company: Company = new Company;

  public images = [];
  public changenow = true;
  public shiftX = 0;
  public shiftY = 0;
  public aspectRatio = true;
  public imagename= 'New Image';
  public editableimage: Files;
  public editableimages: Files[];

  public canvas = {
    width: '600px',
    height: '1000px',
    'background-color': '#ffffff',
    position: 'relative'
  }
  public moveitem = false;
  public selectedImage: image;
  public showemoji = false;
  public newz= 1;

  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };


  constructor(
    private relationsApi: RelationsApi,
    private filesApi: FilesApi,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(){}


  getEditFile() {
    this.relationsApi.getFiles(this.option.id, {where:{template: true}})
      .subscribe((files: Files[]) => {this.editableimages = files;
        console.log('received files', this.editableimages);
      });
  }

  detectchange(): void {
    console.log('run check');
     this.images.forEach(img => {
       if (img.posx > 0){
        img.setpos = {'x':img.posx, 'y':img.posy};
        //  img.style.transform = 'translate('+ img.posx + ' px, '+ img.posy + 'px)';
       }

     })
     console.log(this.images)
     this.changenow = false;
     setTimeout(() => this.changenow = true);
  }

  addNewImage(): void {
    this.newz= this.newz +1;  
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
      setpos: {'x':50, 'y':50}
    }
    this.images.push(img);
  }

  addNewShape(): void {
    this.newz= this.newz +1;  
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
      setpos: {'x':50, 'y':50}
    }
    this.images.push(img);
  }

  addNewText(): void {
    this.newz= this.newz +1;  
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
      setpos: {'x':20, 'y':50}
    }
    this.images.push(txt);
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

  onResizing(e, i){
    this.images[i].style.width = e.size.width + 'px';
    this.images[i].style.height = e.size.height + 'px'; 
  }

  OnSaveImage(){
    this.filesApi.createimage(this.option.id, this.Account.companyId, this.imagename, this.canvas, this.images)
    .subscribe(res => {
      console.log(res);
      this.snackBar.open(res, undefined, {
        duration: 2000,
        panelClass: 'snackbar-class'
      });
    })
  }

  deleteitem(i){
    this.images.splice(i, 1);
  }

  drop(e){
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

  loadEditableImage(){
    this.images = this.editableimage.template;
    this.canvas = this.editableimage.canvas;
    this.detectchange();
  }


}
