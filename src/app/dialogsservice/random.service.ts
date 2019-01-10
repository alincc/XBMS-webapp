
import { Observable } from 'rxjs';
import { RandomDialog } from './random-dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Randomizer } from './randomize';
import { RelationsApi, Relations } from '../shared'
import { timeconv } from '../shared/timeconv';

@Injectable()

export class RandomService {
  //animal: string;
  //name: string;
  public randomizer: Randomizer;
  public ready = false;

  constructor(
    public timeconv: timeconv,
    public RelationsApi: RelationsApi,
    public dialog: MatDialog) { }

  openDialog(accountid, template, mailinglist, campaignlist) {
    console.log(mailinglist)
    const dialogRef = this.dialog.open(RandomDialog, {
      width: '1000px',
      height: '600px',
      data: { mailingLists: mailinglist, templatemailing: template, campaignLists: campaignlist }
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.randomizer = result;

      this.randomizer.mailingLists = [];
      this.randomizer.Selmailinglists.forEach(indx => {
        this.randomizer.mailingLists.push(mailinglist[indx].id)
      });

      this.randomizer.campaignLists =[];
      this.randomizer.Selcampaignlists.forEach(indx => {
        this.randomizer.campaignLists.push(campaignlist[indx].id)
      });
      console.log('The dialog was closed', this.randomizer);
 
      this.RelationsApi.randomizemailing(
        accountid,
        this.randomizer.templatemailing.id,  
        this.randomizer.startdate,
        this.randomizer.enddate,
        this.randomizer.dayoftheweek,
        this.randomizer.starthour,
        this.randomizer.endhour,
        this.randomizer.mailingLists,
        this.randomizer.campaignLists,
        this.randomizer.timezone,
        this.randomizer.addtomailing
        ).subscribe(res => console.log(res))

      this.ready = true;
    });
  }
  // public startdate: Date;
  // public enddate: Date;
  // public dayoftheweek: string;
  // public starthour: string;
  // public endhour: string;
  // public campaignlists = [];
  // public templatemailingid: string; 

}