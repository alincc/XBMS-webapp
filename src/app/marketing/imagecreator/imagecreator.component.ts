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
    z: number,
    width: string;
    height: string;
    position: 'absolute';
  };
  src: string;
  posx: number;
  poxy: number;
  setpos: object;
}

export class shape {
  type: 'shape';
  style: {
    z: number,
    width: string;
    height: string;
    position: 'absolute';
    'background-color': string;
  };
  src: string;
  posx: number;
  poxy: number;
  setpos: object;
}

export class text {
  content: string;
  type: 'text';
  style: {
    z: number,
    width: string;
    height: string;
    position: 'absolute';
    'font-size': string;
    'font-style': string;
  }
  posx: number;
  poxy: number;
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
  public imagename: string;

  public canvas = {
    width: '600px',
    height: '1000px',
    'background-color': '#ffffff',
    position: 'relative'
  }
  public moveitem = false;
  public selectedImage: image;

  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };


  constructor(
    private filesApi: FilesApi,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
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
    let newz =1
    if (this.images.length > 0){
      let newz = this.images.length;
    } 
    
    let img: image = {
      type: 'image',
      style: {
        z: newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      poxy: 50,
      setpos: {'x':50, 'y':50}
    }
    this.images.push(img);
  }

  addNewShape(): void {
    let newz =1
    if (this.images.length > 0){
      let newz = this.images.length;
    } 
    let img: shape = {
      type: 'shape',
      style: {
        z: newz,
        width: "200px",
        height: "200px",
        position: 'absolute',
        'background-color': '#000000'
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 50,
      poxy: 50,
      setpos: {'x':50, 'y':50}
    }
    this.images.push(img);
  }

  addNewText(): void {
    let newz = 1
    if (this.images.length > 0){
      let newz = this.images.length;
    } 
    let txt: text = {
      type: 'text',
      style: {
        z: newz,
        width: "auto",
        height: "auto",
        position: 'absolute',
        'font-size': '20px',
        'font-style': 'open-sans'
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 20,
      poxy: 50,
      setpos: {'x':20, 'y':50}
    }
    this.images.push(txt);
  }

  setImage(event, i): void {
    this.images[i].src = event;
    //this.images.length
  }


  onStart(event) {
    //console.log('started output:', event);
  }

  onStop(event, i) {
    //console.log('stopped output:', event);
  }

  onMoving(event, i) {
    this.images[i].posy = event.y;
    this.images[i].posx = event.x;
  }

  onMoveEnd(event, i) {

  }

  onResizeStart(e, i){
    //console.log(e)
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
    //console.log(e.currentIndex, e.previousIndex);
    this.images[e.currentIndex].style.z = this.images.length - e.currentIndex;
    console.log(this.images[e.currentIndex].style.z);
    this.detectchange()
  }


}



  // mousedownevent(e): void {
  //   this.shiftX = e.clientX;
  //   this.shiftY = e.clientY;
  //   console.log(e);
  //   this.moveitem = true;

  // }

  // mouseupevent(e): void {
  //   console.log(e);
    
  // }

  // selectImage(image: image): void {
  //   console.log(image);
  //   this.selectedImage = image;
  // }

  // dragevent(image: image): void {
  //   //console.log(e);
  //   this.selectedImage = image;

  // }

  // dragendevent(e, i): void {
  //   let x = e.clientX - this.shiftX;
  //   let y = e.clientY - this.shiftY;
  //   let y2 = this.images[i].style.top;
  //   let x2 = this.images[i].style.left;
  //   x2 = x2.replace('px', '');
  //   y2 = y2.replace('px', '');
  //   x =  x + +x2;
  //   y =  y + +y2;
  //   this.images[i].style.top = y + 'px';
  //   this.images[i].style.left = x + 'px';
  //   this.detectchange()
  // }
