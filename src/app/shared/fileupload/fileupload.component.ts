import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';
import {
  ButtonEvent,
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  GridLayout,
  Image,
  ImageModalEvent,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  PreviewConfig
} from '@ks89/angular-modal-gallery';
import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


export interface DialogData {
  img;
  selected;
}

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})

export class FileuploadComponent implements OnInit {
  // public uploader: FileUploader = new FileUploader({ 
    
  //   url: URL });
    uploader:FileUploader;
    errorMessage: string;
    allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    maxFileSize = 10 * 1024 * 1024;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public PlainGalleryConfig: PlainGalleryConfig;
  public customButtonsConfig: ButtonsConfig;
  public ButtonEvent: ButtonEvent;
  public PreviewConfig: PreviewConfig;
  public ImageModalEvent: ImageModalEvent
  // public buttonsConfigFull: ButtonsConfig;
  public images: Image[] = [];
  public imagesNew: Image[] = [];
  public Files: Files[];
  public newFiles: Files = new Files();
  public showdropbox = true;
  public showgallery = false;
  public selectedimage;
 

  @Input('option') option: Relations; //get id for image gallery
  @Input('account') account: Account;
  @Output() imgurl = new EventEmitter(); //send url img back

  constructor(
    public dialog: MatDialog,
    public ContainerApi: ContainerApi,
    public relationsApi: RelationsApi,
    public fileApi: FilesApi
    ) { }



  ngOnInit() {
        // Clear the item queue (somehow they will upload to the old URL)
        this.uploader = new FileUploader({
          url: URL,
          allowedMimeType: this.allowedMimeType,
          // headers: [{name:'Accept', value:'application/json'}],
          // autoUpload: true,
          maxFileSize: this.maxFileSize,
        });
        this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
        this.uploader.clearQueue();
        this.relationsApi.getFiles(this.option.id).subscribe((files: Files[]) => {
          this.Files = files,
            this.Files.forEach((file, index) => {
              // console.log(file, index);
              const modalImage = { img: BASE_URL + '/api/Containers/' + this.option.id + '/download/' + file.name };
              const modal = new Image(index, modalImage, null)
              this.imagesNew.push(modal)
            }),
            this.images = this.imagesNew;
      });
  }

  onWhenAddingFileFailed(item, filter: any, options: any) {
    switch (filter.name) {
        case 'fileSize':
            this.errorMessage = `Maximum upload size exceeded (${item.size} of ${this.maxFileSize} allowed)`;
            break;
        case 'mimeType':
            const allowedTypes = this.allowedMimeType.join();
            this.errorMessage = `Type "${item.type} is not allowed. Allowed types: "${allowedTypes}"`;
            break;
        default:
            this.errorMessage = `Unknown error (filter is ${filter.name})`;
    }
}

      // file upload 1
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // file upload 2
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  onOpenGallery() {
    this.showdropbox = false;
    // this.showgallery = true;
    if (this.Files === undefined) {
  }

        // console.log(this.imagesNew)
      const dialogRef = this.dialog.open(dialoggallerycomponent, {
        width: '600px',
        data:{ img: this.images, selected: this.selectedimage }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        // this.animal = result;
        if (result){
        this.setimage(result)} else {
          this.showdropbox = true;
        };
      }) 
    
  }

  setimage(url){
    this.showdropbox = false;
    this.showgallery = false;
    this.imgurl.emit(url);
  }


  // set constiable and upload + save reference in Publications
  setupload(name): void {
    // set upload url
      let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
      this.uploader.setOptions({ url: urluse });
    // set download url or actual url for publishing
      let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name
      imgurl = imgurl.replace(/ /g, '%20'),
      // define the file settings
    this.newFiles.name = name,
      this.newFiles.url = imgurl,
      this.newFiles.createdate = new Date(),
      this.newFiles.type = 'marketing',
      this.newFiles.companyId = this.account.companyId,
      // check if container exists and create
      this.ContainerApi.findById(this.option.id)
        .subscribe(res => this.uploadFile(),
          error =>
            this.ContainerApi.createContainer({ name: this.option.id })
              .subscribe(res => this.uploadFile()));
  }

  uploadFile(): void {
      this.uploader.uploadAll();
      this.relationsApi.createFiles(this.option.id, this.newFiles)
        .subscribe(res => 
          {console.log(res), this.setimage(res.url)
            // this.imgurl.emit(res.url)
          });
  }

}

import { Icons } from './filelist'

@Component({
  selector: 'dialog-gallery',
  templateUrl: 'dialog-gallery.html',
  styleUrls: ['./fileupload.component.scss']
})

export class dialoggallerycomponent implements OnInit {
  public fileIcons = Icons;
  public existingIcons = [];
  public icons = Icons;

  constructor(
    public dialogRef: MatDialogRef<dialoggallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit(){
      this.icons.forEach(element => {
        let iconurl = BASE_URL + element;
        this.existingIcons.push(iconurl);
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