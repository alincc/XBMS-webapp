import { ChangeDetectionStrategy, Output, EventEmitter, Component, OnDestroy, OnInit } from '@angular/core';
//import { FileUploader } from "ng2-file-upload/ng2-file-upload";
import { FileUploader } from 'ng2-file-upload';
import { read, IWorkBook } from "ts-xlsx";
import { WorkSheet } from "xlsx";
import { Observable, Subject, Subscription } from "rxjs";
import * as XLSX from 'xlsx';
import {map, switchMap} from 'rxjs/operators';

const URL = "http://localhost:3000/api/containers/tmp/upload";


export interface UploadResult {
  result: "failure" | "success";
  payload: any;
}

@Component({
  selector: 'xlsx-file-upload',
  templateUrl: './xlsx-file-upload.component.html',
  //styleUrls: ['./xlsx-file-upload.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XlsxFileUploadComponent implements OnInit, OnDestroy {
  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  private subscription: Subscription;
  private filesSubject: Subject<File>;
  private _uploadedXls: Observable<{ result: string, payload: any }>;
  public showspinner = false;
  

  @Output()
  public uploadedXls: EventEmitter<UploadResult> = new EventEmitter();


  arrayBuffer:any;
  file:File;
  incomingfile(event) 
    {
    this.file= event.target.files[0]; 
    }
  
  Upload() {
      let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            worksheet.map((results: Array<any>) => {
              this.showspinner = false;
              return {result: 'success', payload: results};        
        }),
        fileReader.readAsArrayBuffer(this.file);
  }
}


  constructor() {
    this.filesSubject = new Subject();
    this._uploadedXls = this.filesSubject.asObservable()
    .pipe(
      switchMap((file: File) => {
        return new Observable<any>((observer) => {
          let reader: FileReader = new FileReader();
          reader.onload = (e) => {
            observer.next((e.target as any).result);
          };

          reader.readAsBinaryString(file);
          return () => {
            reader.abort();
          };
        })
      }),

        map((value: string) => {
          return read(value, {type: 'binary'});
        }),
        
        map((wb: IWorkBook) => {
        
          return wb.SheetNames.map((sheetName: string) => {
            let sheet: WorkSheet = wb.Sheets[sheetName];
            var sheet_name_list = wb.SheetNames;
            var output = (XLSX.utils.sheet_to_json(wb.Sheets[sheet_name_list[0]]))
            //console.log(output);
            return output;
          });
        }),
        
        map((results: Array<any>) => {
          this.showspinner = false;
          return {result: 'success', payload: results};
        })
        //.catch(e => Observable.of({result: 'failure', payload: e}));
      )
  }

  ngOnInit() {
    this.subscription = this._uploadedXls.subscribe(this.uploadedXls);
  }

  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public fileDropped(files: FileList): void {
    //console.log("upload started");
    if (this.showspinner == false) {this.showspinner = true;}
    for ( let i = 0 ; i < files.length ; i ++ ) {
      this.filesSubject.next(files[i]);
    }
  }

}