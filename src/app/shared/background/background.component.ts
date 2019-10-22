
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';
import {
  ButtonEvent,
  ButtonsConfig,
  Image,
  ImageModalEvent,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  PreviewConfig
} from '@ks89/angular-modal-gallery';
import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StockBackgrounds } from './stockbackgrounds';
import { StockBackgroundsAnimated } from './stockbackgroundanimated';

export interface DialogData {
  img;
  selected;
}


@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  public Files: Files[];
  public newFiles: Files = new Files();
  public showdropbox = true;
  public showgallery = false;
  public selectedbackground;
  public backgrounds = [];

  @Input('option') option: Relations; //get id for image gallery
  @Input('account') account: Account;
  @Output() imgurl = new EventEmitter(); //send url img back

  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public ContainerApi: ContainerApi,
    public relationsApi: RelationsApi,
    public fileApi: FilesApi
  ) { }

  ngOnInit() {
  }

  onOpenGallery() {
    //this.showdropbox = false;
    // this.showgallery = true;
    if (this.Files === undefined) {
    }

    // console.log(this.imagesNew)
    const dialogRef = this.dialog.open(dialogbackgroundgallerycomponent, {
      width: '600px',
      data: { img: this.backgrounds, selected: this.selectedbackground }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // this.animal = result;
      if (result) {
        this.setimage(result)
      } else {
        this.showdropbox = true;
      };
    })
  }

  setimage(url) {
    this.showdropbox = false;
    this.showgallery = false;
    this.imgurl.emit(url);
  }
}



@Component({
  selector: 'dialog-backgroundgallery',
  templateUrl: 'dialog-backgroundgallery.html',
  styleUrls: ['./background.component.scss']
})

export class dialogbackgroundgallerycomponent implements OnInit {

  //public fileVideo = StockVideo;
  public existingIcons = [];
  public background = StockBackgrounds;
  public animatedbackground = StockBackgroundsAnimated;
  public stockbackgrounds = [];
  public animatedbackgrounds = [];

  constructor(
    public dialogRef: MatDialogRef<dialogbackgroundgallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.background.forEach(element => {
      const iconurl = element;
      //const previewurl = element + '#t=0.5';
      var filename = iconurl.replace(/^.*[\\\/]/, '')
      this.stockbackgrounds.push({ url: iconurl, name: filename });
    });
    this.animatedbackground.forEach(element => {
      const iconurl = element;
      //const previewurl = element + '#t=0.5';
      var filename = iconurl.replace(/^.*[\\\/]/, '')
      this.animatedbackgrounds.push({ url: iconurl, name: filename });
    });
  }


  onNoClick(): void {
    this.data.selected = '';
    this.dialogRef.close();
  }

  selectedimage(img): void {
    this.data.selected = img;
  }

}