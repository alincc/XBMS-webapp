import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { DialogsService } from './dialogsservice/dialogs.service';

@Injectable()
export class PwaService {
    public yesorno = false;
    public promptEvent;

    constructor(
        private swUpdate: SwUpdate,
        public dialogsService: DialogsService, ) {

        swUpdate.available.subscribe(event => {
            if (this.askUserToUpdate()) {
                window.location.reload();
            }
        });

        window.addEventListener('beforeinstallprompt', event => {
            this.promptEvent = event;
        });
    }

    askUserToUpdate() {
        this.dialogsService
            .confirm('update app', 'Do you wan to Update to the latest version of XBMS app?')
            .subscribe(res => this.yesorno = res);
            return this.yesorno;
    }



}