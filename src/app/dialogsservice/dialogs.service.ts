
import { Observable } from 'rxjs';
import { ConfirmDialog } from './confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class DialogsService {

    constructor(
       
        private dialog: MatDialog) { }

    public confirm(title: string, message: string, preview?: string): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;

        dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.preview = preview;
        //dialogRef.componentInstance.preview = this.sanitizer.bypassSecurityTrustHtml(preview);

        return dialogRef.afterClosed();
    }
}