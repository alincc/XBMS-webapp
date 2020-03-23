import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';
import { ContainerApi, Files, Relations, RelationsApi, Company, Account, FilesApi } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface DialogData {
  img;
  selected;
}

@Component({
  selector: 'app-vectorupload',
  templateUrl: './vectorupload.component.html',
  styleUrls: ['./vectorupload.component.scss']
})
export class VectoruploadComponent implements OnInit {

  uploader: FileUploader;
  uploadersvg: FileUploader;
  errorMessage: string;
  errorMessageSvg: string;
  allowedMimeType = ['image/svg', 'image/svg+xml'];
  allowedMimeTypeSvg = [
    'image/eps', 'image/ai', 'application/postscript', 'image/jpg', 'image/jpeg', 'image/png', 'image/bmp'];
  //  'application/psd',
  //  'image/vnd.adobe.photoshop',
  //  'application/x-photoshop',
  //  'application/photoshop',
  //  'application/psd',
  //  'image/psd', 
  maxFileSize = 400 * 1024 * 1024;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public hasBaseDropZoneOverSvg = false;
  public hasAnotherDropZoneOverSvg = false;
  public Files: Files[];
  public newFiles: Files = new Files();
  public showdropbox = true;
  public showgallery = false;
  public selectedimage;
  public vector = [];


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
    // Clear the item queue (somehow they will upload to the old URL)
    this.setDropUpload();
    this.setDropSvgUpload();
  }

  setDropUpload() {
    this.uploader = new FileUploader({
      url: URL,
      allowedMimeType: this.allowedMimeType,
      maxFileSize: this.maxFileSize,
    });
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.clearQueue();
    this.relationsApi.getFiles(this.option.id,
      {
        where: { type: 'vector' }
      }).subscribe((files: Files[]) => {
        this.vector = files
      });

    this.uploader.onAfterAddingAll = (files) => {
      files.forEach(fileItem => {
        fileItem.file.name = fileItem.file.name.replace(/ /g, '-');
      });
    };
  }


  handleSVG(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    return svg;
  }

  setDropSvgUpload() {
    this.uploadersvg = new FileUploader({
      url: URL,
      allowedMimeType: this.allowedMimeTypeSvg,
      maxFileSize: this.maxFileSize,
    });
    this.uploadersvg.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingSvgFileFailed(item, filter, options);
    this.uploadersvg.clearQueue();
    this.uploadersvg.onAfterAddingAll = (files) => {
      files.forEach(fileItem => {
        fileItem.file.name = fileItem.file.name.replace(/ /g, '-');
      });
    };
  }

  dropped(e) {
    console.log(e, this.uploadersvg);

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

  onWhenAddingSvgFileFailed(item, filter: any, options: any) {
    switch (filter.name) {
      case 'fileSize':
        this.errorMessageSvg = `Maximum upload size exceeded (${item.size} of ${this.maxFileSize} allowed)`;
        break;
      case 'mimeType':
        const allowedTypes = this.allowedMimeTypeSvg.join();
        this.errorMessageSvg = `Type "${item.type} is not allowed. Allowed types: "${allowedTypes}"`;
        break;
      default:
        this.errorMessageSvg = `Unknown error (filter is ${filter.name})`;
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

  // file upload 1
  public fileOverBaseSvg(e: any): void {
    this.hasBaseDropZoneOverSvg = e;
  }

  // file upload 2
  public fileOverAnotherSvg(e: any): void {
    this.hasAnotherDropZoneOverSvg = e;
  }

  onOpenGallery() {
    this.showdropbox = false;
    // this.showgallery = true;
    if (this.Files === undefined) {
    }

    // console.log(this.imagesNew)
    const dialogRef = this.dialog.open(dialogvectorgallerycomponent, {
      width: '600px',
      data: { img: this.vector, selected: this.selectedimage }
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
      this.newFiles.type = 'vector',
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


  setSvgupload(name): void {
    // set upload url
    let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
    this.uploadersvg.setOptions({ url: urluse });

    // set download url or actual url for publishing
    let imgurl = BASE_URL + '/api/Containers/' + this.option.id + '/download/' + name
    imgurl = imgurl.replace(/ /g, '-'),
      // imgurl = encodeURI(imgurl);
      // define the file settings
      this.newFiles.name = name,
      this.newFiles.url = imgurl,
      this.newFiles.createdate = new Date(),
      this.newFiles.type = 'tmp',
      this.newFiles.companyId = this.account.companyId,
      // check if container exists and create
      this.ContainerApi.findById(this.option.id)
        .subscribe(res => this.uploadSvgFile(name),
          error =>
            this.ContainerApi.createContainer({ name: this.option.id })
              .subscribe(res => this.uploadSvgFile(name)));
  }

  uploadSvgFile(name): void {
    this.uploadersvg.uploadAll();

    this.uploadersvg.onCompleteItem = (item, response, status, header) => {
      if (status === 200) {
        this.relationsApi.createFiles(this.option.id, this.newFiles)
          .subscribe(res => {
            console.log(res), //this.setimage(res.url)
              this.fileApi.converteps2svg(this.option.id, this.account.companyId, res.url, name, false)
                .subscribe(res => { this.setimage(res.url) })
          });
      }
    }
  }
}


import { StockVector } from './stockvector'

@Component({
  selector: 'dialog-vectorgallery',
  templateUrl: 'dialog-vectorgallery.html',
  styleUrls: ['./vectorupload.component.scss']
})

export class dialogvectorgallerycomponent implements OnInit {

  //public fileVideo = StockVideo;

  public vector = StockVector;

  public fromfileArray = [];
  public fromfile = [];
  public fromfileSlice = 11;
  public fromfileSliceMin = 0;

  public stockvectors = [];
  public stockvectorsArray = [];
  public stockvectorsSlice = 11;
  public stockvectorsSliceMin = 0;


  constructor(
    public dialogRef: MatDialogRef<dialogvectorgallerycomponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.vector.forEach((element, i) => {
      const iconurl = element;
      //const previewurl = BASE_URL + element + '#t=0.5';
      var filename = iconurl.replace(/^.*[\\\/]/, '')
      if (i < 12) { this.stockvectors.push({ url: iconurl, name: filename }); }
      this.stockvectorsArray.push({ url: iconurl, name: filename });
    });

    this.data.img.forEach((element, i) => {
      if (i < 12) { this.fromfile.push(element); }
      this.fromfileArray.push(element);
    });
  }

  handleSVG(svg: SVGElement, parent): SVGElement {
    //console.log('Loaded SVG: ', svg, parent);
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    return svg;
  }

  onNoClick(): void {
    this.data.selected = '';
    this.dialogRef.close();
  }

  selectedimage(img): void {
    this.data.selected = img;
  }

  next(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromfileSlice < this.fromfileArray.length -1 ) {
          this.fromfileSlice = this.fromfileSlice + 12;
          this.fromfileSliceMin = this.fromfileSliceMin + 12;
          this.fromfile = this.fromfileArray.slice(this.fromfileSliceMin, this.fromfileSlice)

        }
      }
      case 'standardvectors': {
        if (this.stockvectorsSlice < this.stockvectorsArray.length -1) {
          this.stockvectorsSlice = this.stockvectorsSlice + 12;
          this.stockvectorsSliceMin = this.stockvectorsSliceMin + 12
          this.stockvectors = this.stockvectorsArray.slice(this.stockvectorsSliceMin, this.stockvectorsSlice)

        }
      }
    }
  }

  before(galtype) {
    switch (galtype) {
      case 'fromaccount': {
        if (this.fromfileSliceMin > 0) {
          this.fromfileSlice = this.fromfileSlice - 12;
          this.fromfileSliceMin = this.fromfileSliceMin - 12
          this.fromfile = this.fromfileArray.slice(this.fromfileSliceMin, this.fromfileSlice)

        }
      }
      case 'standardvectors': {
        if (this.stockvectorsSliceMin > 0) {
          this.stockvectorsSlice = this.stockvectorsSlice - 12;
          this.stockvectorsSliceMin = this.stockvectorsSliceMin - 12
          this.stockvectors = this.stockvectorsArray.slice(this.stockvectorsSliceMin, this.stockvectorsSlice)

        }
      }
    }
  }

}
