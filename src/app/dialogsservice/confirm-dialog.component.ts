import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';


@Component({
    selector: 'confirm-dialog',
    template: `
    <div style="max-height: calc(100vh - 200px); overflow-y: auto;">
        <p>{{ title }}</p>
        <p>{{ message }}</p>
        <div class="mailpreview" [innerHTML]="preview"></div>
        <button type="button" md-raised-button 
            (click)="dialogRef.close(true)">OK</button>
        <button type="button" md-button 
            (click)="dialogRef.close()">Cancel</button>
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