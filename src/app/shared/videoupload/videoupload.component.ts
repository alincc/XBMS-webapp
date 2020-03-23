import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';
import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi, FilesdlcrApi } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  videos;
  selected;
}

@Component({
  selector: 'app-videoupload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.scss']
})
export class VideouploadComponent implements OnInit {

  uploader: FileUploader;
  errorMessage: string;
  allowedMimeType = ['video/mp4', 'video/mpeg4', 'video/mov', 'video/avi', 'video/wmv', 'video/quicktime'];
  maxFileSize = 500 * 1024 * 1024;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public Files: Files[];
  public newFiles: Files = new Files();
  public showdropbox = true;
  public showgallery = false;
  public selectedimage;
  public videos = [];
  public filetype;
  public converting = false;


  @Input('option') option: Relations; //get id for image gallery
  @Input('account') account: Account;
  @Output() imgurl = new EventEmitter(); //send url img back

  constructor(
    public filesdlcrApi: FilesdlcrApi,
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
      maxFileSize: this.maxFileSize,
    });
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.clearQueue();
    this.uploader.onAfterAddingAll = (files) => {
      files.forEach(fileItem => {
        fileItem.file.name = fileItem.file.name.replace(/ /g, '-');
        //console.log(fileItem)
        this.filetype = fileItem.file.type;
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

    this.relationsApi.getFiles(this.option.id,
      {
        where: { type: 'video' }
      }).subscribe((files: Files[]) => {
        this.videos = files;

        this.showdropbox = false;
        // this.showgallery = true;
        if (this.Files === undefined) {
        }

        // console.log(this.imagesNew)
        const dialogRef = this.dialog.open(dialogvideogallerycomponent, {
          width: '600px',
          data: { videos: this.videos, selected: this.selectedimage }
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
      });
  }

  setimage(url) {
    this.showdropbox = false;
    this.showgallery = false;
    this.imgurl.emit(url);
  }

  // set constiable and upload + save reference in Publications
  async setupload(name, size) {
    // set upload url
    let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
    this.uploader.setOptions({ url: urluse });
    name = await this.checkName(name);

    // set download url or actual url for publishing
    let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name
    imgurl = imgurl.replace(/ /g, '-'),
      // imgurl = encodeURI(imgurl);
      // define the file settings
      this.newFiles.size = size,
      this.newFiles.name = name,
      this.newFiles.url = imgurl,
      this.newFiles.createdate = new Date(),
      this.newFiles.type = 'video',
      this.newFiles.companyId = this.account.companyId,
      // check if container exists and create

      this.uploadFile(imgurl);
  }


  checkName(name) {
    return new Promise(async (resolve, reject) => {
      this.relationsApi.getFiles(this.option.id, { where: { name: name } })
        .subscribe(res => {
          let newname = name;
          if (res.length > 0) {
            const ext = '.' + name.substr(name.lastIndexOf('.') + 1);
            name.replace(ext, '');
            let name1 = name + '-1'
            newname = name1 + ext;
            console.log(newname);
          }

          resolve(newname);
        });
    });
  }


  uploadFile(url) {
    this.uploader.uploadAll();
    this.uploader.onCompleteItem = (item, response, status, header) => {
      if (status === 200) {
        this.converting = true;
        // if (this.filetype === 'video/quicktime') {
        url = url.replace('http://localhost:3000', 'https://api.xbms.io')
        this.fileApi.convertVideo2mp4(this.option.id, url).subscribe((res) => {
          console.log(res)
          this.newFiles.name = this.newFiles.name.replace('.mov', '.mp4');
          this.newFiles.url = this.newFiles.url.replace('.mov', '.mp4');
          this.newFiles.size = res;
          this.uploadFileToStore();
          this.converting = false;
        });
        // } else {
        //   this.uploadFileToStore();
        // }

      }
    }
  }

  uploadFileToStore() {
    this.relationsApi.createFiles(this.option.id, this.newFiles)
      .subscribe(res => {
        console.log(res), this.setimage(res.url)
      })
  }

}




import { StockVideo } from './stockvideo'

@Component({
  selector: 'dialog-videogallery',
  templateUrl: 'dialog-videogallery.html',
  styleUrls: ['./videoupload.component.scss']
})

export class dialogvideogallerycomponent implements OnInit {

  //public fileVideo = StockVideo;
  //public existingIcons = [];

  public video = StockVideo;
  public stockvideos = [];
  public stockvideosArray = [];
  public stockvideosSliceMin = 0;
  public stockvideosSlice = 12;

  public accountvideos = [];
  public accountvideosArray = [];
  public fromaccountSliceMin = 0;
  public fromaccountSlice = 12;


  constructor(
    public dialogRef: MatDialogRef<dialogvideogallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {

    this.data.videos.forEach((element, index) => {
      const iconurl = element.url;
      const previewurl = element.url + '#t=0.5';
      const filename = iconurl.replace(/^.*[\\\/]/, '');
      const ext = filename.substr(filename.lastIndexOf('.') + 1);
      const url = iconurl;
      const fileimage = url.replace(ext, 'jpg'); // set preview image
      let elobj = {
        url: iconurl,
        name: filename,
        preview: previewurl,
        fileimage: fileimage
      }
      if (index < 12) { this.accountvideos.push(elobj) }
      this.accountvideosArray.push(elobj);
    });


    this.video.forEach((element, index) => {
      const iconurl = element;
      const previewurl = element + '#t=0.5';
      const filename = iconurl.replace(/^.*[\\\/]/, '');
      const ext = filename.substr(filename.lastIndexOf('.') + 1);
      const url = iconurl;
      const fileimage = url.replace(ext, 'jpg'); // set preview image
      let elobj = {
        url: iconurl,
        name: filename,
        preview: previewurl,
        fileimage: fileimage
      }
      if (index < 12) { this.stockvideos.push(elobj); }
      this.stockvideosArray.push(elobj);
    });
  }

  next(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromaccountSlice < this.accountvideosArray.length) {
          this.fromaccountSlice = this.fromaccountSlice + 12;
          this.fromaccountSliceMin = this.fromaccountSliceMin + 12;
          this.accountvideos = this.accountvideosArray.slice(this.fromaccountSliceMin, this.fromaccountSlice)

        }
      }
      case 'standardvideos': {
        if (this.stockvideosSlice < this.stockvideosArray.length) {
          this.stockvideosSlice = this.stockvideosSlice + 12;
          this.stockvideosSliceMin = this.stockvideosSliceMin + 12;
          this.stockvideos = this.stockvideosArray.slice(this.stockvideosSliceMin, this.stockvideosSlice)

        }
      }
    }
  }

  before(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromaccountSliceMin > 0) {
          this.fromaccountSlice = this.fromaccountSlice - 12;
          this.fromaccountSliceMin = this.fromaccountSliceMin - 12;
          this.accountvideos = this.accountvideosArray.slice(this.fromaccountSliceMin, this.fromaccountSlice)

        }
      }
      case 'standardvideos': {
        if (this.stockvideosSliceMin > 0) {
          this.stockvideosSlice = this.stockvideosSlice - 12;
          this.stockvideosSliceMin = this.stockvideosSliceMin - 12;
          this.stockvideos = this.stockvideosArray.slice(this.stockvideosSliceMin, this.stockvideosSlice)

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
