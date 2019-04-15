import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Relations, BASE_URL } from '../../shared';
import { Component, OnInit, Input, Inject } from '@angular/core';

@Component({
    selector: 'text-editor-dialog',
    templateUrl: 'text-editor-dialog.html',
  })
  
  export class TextEditorDialog {
      
    public CKEDITOR: any;
    constructor(
      public dialogRef: MatDialogRef<TextEditorDialog>,
      @Inject(MAT_DIALOG_DATA) public data: String,
      @Inject(MAT_DIALOG_DATA) public id: String) {}
  
  
      onRequestCkEvent(evt): void {
        evt.stop(); // stop event and set data manual see above
        //console.log('fileuploadresponse', evt)
        const url = BASE_URL + '/api/Containers/' + this.id + '/download/'
        const data1 = evt.data;
        data1.url = url + data1.fileLoader.fileName;
        this.CKEDITOR.tools.callFunction(1, data1.url);
      };
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }