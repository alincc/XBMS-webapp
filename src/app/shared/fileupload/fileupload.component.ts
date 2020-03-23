import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';

import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


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
  uploader: FileUploader;
  errorMessage: string;
  allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
  maxFileSize = 10 * 1024 * 1024;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  // public buttonsConfigFull: ButtonsConfig;
  public images = [];
  public imagesNew = [];
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
          let ext = file.name.split('.').pop();
          if (ext === 'gif' || ext === "jpeg" || ext === "jpg" || ext === "bmp" || ext === "png") {
            const modalImage = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + file.name;
            //const modal = {index, modalImage}
            this.imagesNew.push(modalImage)
          }
        }),
        this.images = this.imagesNew;
    });

    this.uploader.onAfterAddingAll = (files) => {
      files.forEach(fileItem => {
        fileItem.file.name = fileItem.file.name.replace(/ /g, '-');
      });
    };

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
      data: { img: this.images, selected: this.selectedimage }
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


  // set constiable and upload + save reference in Publications
  setupload(name, size): void {
    // set upload url
    let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
    this.uploader.setOptions({ url: urluse });

    // set download url or actual url for publishing
    let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name
    imgurl = imgurl.replace(/ /g, '-'),
      // imgurl = encodeURI(imgurl);
      // define the file settings
      this.newFiles.size = size,
      this.newFiles.name = name,
      this.newFiles.url = imgurl,
      this.newFiles.createdate = new Date(),
      this.newFiles.type = 'image',
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
      .subscribe(res => {
        console.log(res), this.setimage(res.url)
        // this.imgurl.emit(res.url)
      });
  }

}

import { Icons } from './filelist';
import { IconsIso } from './filelistiso';


@Component({
  selector: 'dialog-gallery',
  templateUrl: 'dialog-gallery.html',
  styleUrls: ['./fileupload.component.scss']
})

export class dialoggallerycomponent implements OnInit {
  public fileIcons = Icons;
  public existingIcons = [];
  public icons = Icons;
  public isoIcons = IconsIso;
  public existingIsoIcons = [];


  public fromaccountslice = 11;
  public standardiconsslice = 35;
  public isoiconslice = 11;
  public fromaccountsliceMin = 0;
  public standardiconssliceMin = 0;
  public isoiconsliceMin = 0;

  public accountimages = [];
  public fromaccountarray = [];
  public standardiconsarray = [];
  public isoiconarray = [];

  constructor(
    public dialogRef: MatDialogRef<dialoggallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.icons.forEach((element, i) => {
      const iconurl = BASE_URL + element;
      if (i < 36) { this.existingIcons.push(iconurl) };
      this.standardiconsarray.push(iconurl);
    });

    this.isoIcons.forEach((iso, i) => {
      const isourl = BASE_URL + iso;
      if (i < 12) { this.existingIsoIcons.push(isourl) };
      this.isoiconarray.push(isourl);
    })

    this.data.img.forEach((iso, i) => {
      //const isourl = BASE_URL + iso;
      if (i < 12) { this.accountimages.push(iso) };
      this.fromaccountarray.push(iso);
    })
  }

  next(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromaccountslice < this.fromaccountarray.length) {
          this.fromaccountslice = this.fromaccountslice + 12;
          this.fromaccountsliceMin = this.fromaccountsliceMin + 12;
          this.accountimages = this.fromaccountarray.slice(this.fromaccountsliceMin, this.fromaccountslice)
         
        }
      }
      case 'standardicons': {
        if (this.standardiconsslice < this.standardiconsarray.length) {
          this.standardiconsslice = this.standardiconsslice + 36;
          this.standardiconssliceMin = this.standardiconssliceMin + 36;
          this.existingIcons = this.standardiconsarray.slice(this.standardiconssliceMin, this.standardiconsslice)
         
        }
      }
      case 'isoicon': {
        if (this.isoiconslice < this.isoiconarray.length) {
          this.isoiconslice = this.isoiconslice + 12;
          this.isoiconsliceMin = this.isoiconsliceMin + 12;
          this.existingIsoIcons = this.isoiconarray.slice(this.isoiconsliceMin, this.isoiconslice)
          
        }
      }
    }
  }

  before(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromaccountsliceMin > 0 ) {
          this.fromaccountslice = this.fromaccountslice - 12;
          this.fromaccountsliceMin = this.fromaccountsliceMin - 12;
          this.accountimages = this.fromaccountarray.slice(this.fromaccountsliceMin, this.fromaccountslice)
          
        }
      }
      case 'standardicons': {
        if (this.standardiconssliceMin > 0) {
          this.standardiconsslice = this.standardiconsslice - 36;
          this.standardiconssliceMin = this.standardiconssliceMin - 36;
          this.existingIcons = this.standardiconsarray.slice(this.standardiconssliceMin, this.standardiconsslice)
          
        }
      }
      case 'isoicon': {
        if (this.isoiconsliceMin > 0) {
          this.isoiconslice = this.isoiconslice - 12;
          this.isoiconsliceMin = this.isoiconsliceMin - 12;
          this.existingIsoIcons = this.isoiconarray.slice(this.isoiconsliceMin, this.isoiconslice)
          
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