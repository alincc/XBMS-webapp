import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class codesnippetService {
    public title: string;
    public message: string;
    public preview;

    constructor(private dialog: MatDialog ) {
    }

    public confirm(title: string, message: string, codesnippet?: string): Observable<boolean> {

        let dialogRef: MatDialogRef<CodesnippetDialog>;
        dialogRef = this.dialog.open(CodesnippetDialog);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.codesnippet = codesnippet;
        return dialogRef.afterClosed();
    }
}


@Component({
    selector: 'Codesnippet-dialog',
    template: `
    <div style="max-height: calc(100vh - 200px); overflow-y: auto;">
        <p style="font-weight:bold; font-family: Roboto, Arial, sans-serif;">{{ title }}</p>
        <p style="font-family: Roboto, Arial, sans-serif;">{{ message }}</p>
        <button style="background-color: white;" mat-button type="button"
        (click)="dialogRef.close(true)">OK</button>
        <button style="background-color: white;" mat-button type="button"
        (click)="copy(codesnippet)">Copy</button>
        <div style="margin: 10px">
          <p style="font-size: 10pt; font-family: Roboto, Arial, sans-serif;">{{ codesnippet }}</p>
        </div>
    </div>
    `
})

export class CodesnippetDialog {
    public title: string;
    public message: string;
    public codesnippet: string;
    public snackBar: MatSnackBar;

    constructor(
        public dialogRef: MatDialogRef<CodesnippetDialog>) {
    }

    public copy(inputElement) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = inputElement;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        // this.snackBar.open("Code copied", undefined, {
        //     duration: 2000,
        //     panelClass: 'snackbar-class'
        // });
    }
}




