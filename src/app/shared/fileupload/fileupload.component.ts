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
import { ContainerApi, Files, Relations } from '../sdk';
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
  @Output() imgurl = new EventEmitter<String>(); //send url img back

  constructor(public ContainerApi: ContainerApi) { }

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


}
