import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { ContainerApi, Files, Relations, RelationsApi, Company, Account } from '../sdk';
import { BASE_URL, API_VERSION } from '../base.api'

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})

export class FileuploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: URL });
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


  @Input('option') option: Relations; //get id for image gallery
  @Input('account') account: Account;
  @Output() imgurl = new EventEmitter(); //send url img back

  constructor(
    public ContainerApi: ContainerApi,
    public relationsApi: RelationsApi
    ) { }

  ngOnInit() {}

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
    this.showgallery = true;
    this.ContainerApi.getFiles(this.option.id).subscribe((files: Files[]) => {
      this.Files = files,
        this.Files.forEach((file, index) => {
          // console.log(file, index);
          const modalImage = { img: BASE_URL + '/api/Containers/' + this.option.id + '/download/' + file.name };
          const modal = new Image(index, modalImage, null)
          this.imagesNew.push(modal)
        }),
        this.images = this.imagesNew;
        console.log(this.imagesNew)
    });
  }

  setimage(url){
    this.showdropbox = false;
    this.showgallery = false;
    this.imgurl.emit(url);
  }


  // set constiable and upload + save reference in Publications
  setupload(name): void {
    //set upload url
      let urluse = BASE_URL + '/api/Containers/' + this.option.id + '/upload';
      this.uploader.setOptions({ url: urluse });
    //set download url or actual url for publishing
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
