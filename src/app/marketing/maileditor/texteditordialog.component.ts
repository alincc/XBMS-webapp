import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Relations, BASE_URL } from '../../shared';
import { Component, OnInit, Input, Inject } from '@angular/core';

@Component({
    selector: 'text-editor-dialog',
    templateUrl: 'text-editor-dialog.html',
  })
  
  export class TextEditorDialog {
     public CKEDITOR: any;
     public ckconfig = {
      extraPlugins: 'emoji,font,spacingsliders,colorbutton,colordialog',
      colorButton_enableMore: 'true',
      toolbarCanCollapse: 'true',
      width: '100%',
      font_names: 'Baloo Bhai;SandBrush/Sandbrush;Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;'+
      'Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;'+
      'Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif;Roboto/Roboto;Open Sans/Open Sans;' +
      'Shipwreck/Shipwreck;WesternOld/WesternOld;IndustrialOld/IndustrialOld;Hillpark/Hillpark;',
      toolbarStartupExpanded: 'false',
      contentsCss: 'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',}

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