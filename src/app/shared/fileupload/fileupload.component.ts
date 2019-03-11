import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
const URL = 'http://localhost:3000/api/containers/tmp/upload';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor() { }

  ngOnInit() {
  }


      // file upload 1
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // file upload 2
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}
