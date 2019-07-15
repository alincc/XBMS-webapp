import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';


@Component({
    selector: 'confirm-dialog',
    template: `
    <div style="max-height: calc(100vh - 200px); overflow-y: auto;">
        <p style="font-family: Roboto, Arial, sans-serif;">{{ title }}</p>
        <p style="font-family: Roboto, Arial, sans-serif;">{{ message }}</p>
        <button style="background-color: white;" mat-button type="button"
        (click)="dialogRef.close(true)">OK</button>
        <button style="background-color: white;" mat-button type="button"
        (click)="dialogRef.close()">Cancel</button>
        <div class="mailpreview" [innerHTML]="preview"></div>
    </div>
    `
})
export class ConfirmDialog {

    public title: string;
    public message: string;
    public preview;
    //public htmlpreview = this.sanitizer.bypassSecurityTrustHtml(this.preview);
    
    constructor(
        
        public dialogRef: MatDialogRef<ConfirmDialog>) {

    }

}