import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'WordpressUploadDialogComponent',
  templateUrl: 'wordpressupload-dialog.component.html',
})
export class WordpressUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<WordpressUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}