import { Component, Inject } from '@angular/core';
import { Randomizer } from './randomize';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

export interface DialogData {
    name: string;
  }


  
@Component({
    selector: 'getname-dialog',
    templateUrl: 'dialog-getname-dialog.html',
  })

  export class DialogGetname {
  
    constructor(
      public dialogRef: MatDialogRef<DialogGetname>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
    this.data.name = ''
      this.dialogRef.close();
    }
  
  }