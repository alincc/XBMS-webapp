import { Component, OnInit, Input } from '@angular/core';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi
} from '../../shared';
import { NgModule, HostListener } from '@angular/core'


export class image {
  type: 'image';
  style: {
    width: string;
    height: string;
    position: 'absolute';
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
    private filesApi: FilesApi
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
    let img: image = {
      type: 'image',
      style: {
        width: "auto",
        height: "auto",
        position: 'absolute',
        //transform : 'translate(10px, 10px)'
      },
      src: '',
      posx: 0,
      poxy: 0,
      setpos: {'x':0, 'y':0}
    }
    this.images.push(img);
  }

  addNewText(): void {
    let txt: text = {
      type: 'text',
      style: {
        width: "auto",
        height: "auto",
        position: 'absolute',
        'font-size': '20px',
        'font-style': 'open-sans'
        //transform : 'translate(10px, 10px)'
      },
      content: 'write here',
      posx: 0,
      poxy: 0,
      setpos: {'x':0, 'y':0}
    }
    this.images.push(txt);
  }

  setImage(event, i): void {
    this.images[i].src = event;
    //this.images.length
  }


  onStart(event) {
    console.log('started output:', event);
  }

  onStop(event, i) {
    console.log('stopped output:', event);
  }

  onMoving(event, i) {
    this.images[i].posy = event.y;
    this.images[i].posx = event.x;
  }

  onMoveEnd(event, i) {

  }

  onResizeStart(e, i){
    console.log(e)
  }

  onResizing(e, i){
    this.images[i].style.width = e.size.width + 'px';
    this.images[i].style.height = e.size.height + 'px'; 
  }

  OnSaveImage(){
    //let canvas = Object.assign({}, this.canvas);
    //let images = Object.assign({}, this.images);
    this.filesApi.createimage(this.option.id, this.Account.companyId, this.canvas, this.images)
    .subscribe(res => {
      console.log(res)
    })
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
