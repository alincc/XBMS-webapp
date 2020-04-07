
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi } from '../sdk';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { StockBackgrounds } from './stockbackgrounds'
import {  templatescreenshots, templates } from './stocktemplates';

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
  //public existingIcons = [];


  


  public templatesSet =  templatescreenshots;
  public templates = [];
  public templatesArray = [];
  public templatesSlice = 11;
  public templatesSliceMin = 0;

  public backgroundSet = StockBackgrounds;
  public stockbg = [];
  public stockbgArray = [];
  public stockbgSlice = 11;
  public stockbgSliceMin = 0;


  public URL = 'http://localhost:3000/api/containers/tmp/upload';

  constructor(
    public dialogRef: MatDialogRef<dialogbackgroundgallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.backgroundSet.forEach((element, index) => {
      const url = element;
      var filename = url.replace(/^.*[\\\/]/, '')
      if(index < 12){this.stockbg.push({ url: url, name: filename });}
      this.stockbgArray.push({ url: url, name: filename });
    });
    this.templatesSet.forEach((element, index) => {
      const url = element;
      var filename = url.replace(/^.*[\\\/]/, '')
      if(index < 12){this.templates.push({ url: url, name: filename });}
      this.templatesArray.push({ url: url, name: filename });
    });
  }

  next(galtype) {
    switch (galtype) {
      case 'templates': {
        if (this.templatesSlice < this.templatesArray.length -1 ) {
          this.templatesSlice = this.templatesSlice + 12;
          this.templatesSliceMin = this.templatesSliceMin + 12;
          this.templates = this.templatesArray.slice(this.templatesSliceMin, this.templatesSlice)

        }
      }
      case 'standardbackgrounds': {
        if (this.stockbgSlice < this.stockbgArray.length -1) {
          this.stockbgSlice = this.stockbgSlice + 12;
          this.stockbgSliceMin = this.stockbgSliceMin + 12
          this.stockbg = this.stockbgArray.slice(this.stockbgSliceMin, this.stockbgSlice)

        }
      }
    }
  }

  before(galtype) {
    switch (galtype) {
      case 'templates': {
        if (this.templatesSliceMin > 0) {
          this.templatesSlice = this.templatesSlice - 12;
          this.templatesSliceMin = this.templatesSliceMin - 12
          this.templates = this.templatesArray.slice(this.templatesSliceMin, this.templatesSlice)

        }
      }
      case 'standardbackgrounds': {
        if (this.stockbgSliceMin > 0) {
          this.stockbgSlice = this.stockbgSlice - 12;
          this.stockbgSliceMin = this.stockbgSliceMin - 12
          this.stockbg = this.stockbgArray.slice(this.stockbgSliceMin, this.stockbgSlice)

        }
      }
    }
  }


  onNoClick(): void {
    this.data.selected = '';
    this.dialogRef.close();
  }

  selectedimage(img): void {
    this.data.selected = img;
  }

}