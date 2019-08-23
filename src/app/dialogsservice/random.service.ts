
import { Observable } from 'rxjs';
import { RandomDialog } from './random-dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Randomizer } from './randomize';
import { RelationsApi, Relations } from '../shared'
import { timeconv } from '../shared/timeconv';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()

export class RandomService {
  public randomizer: Randomizer;
  public ready = false;

  constructor(
    public snackBar: MatSnackBar,
    public timeconv: timeconv,
    public RelationsApi: RelationsApi,
    public dialog: MatDialog) { }

  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: 'snackbar-class'
    });
  }

  openDialog(accountid, companyid, template, mailinglist, campaignlist, Mailing) {
    // console.log(mailinglist)
    const dialogRef = this.dialog.open(RandomDialog, {
      width: '1000px',
      height: '800px',
      data: { mailingLists: mailinglist, templatemailing: template, campaignLists: campaignlist, Mailing: Mailing }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.randomizer = result;
      // if no campaigns selected send selecte lists this will automatically create a campaign based on the list

      let lenghtcamlist = this.randomizer.Selcampaignlists.length;
      lenghtcamlist = +lenghtcamlist;
      if (!this.randomizer.randomize) {
        let list;
        let createnewcampaign = false;
        if (lenghtcamlist < 1) { 
          list = this.randomizer.Selmailinglists, createnewcampaign = true; } else {
          list = this.randomizer.Selcampaignlists
        }
        console.log(this.randomizer.Selmailinglists, list);
        if (list.length > 0) {
          this.RelationsApi.addmailingtocampaign(
            accountid,
            companyid,
            this.randomizer.templatemailing.id,
            this.randomizer.date,
            this.randomizer.time,
            list,
            this.randomizer.timezone,
            createnewcampaign,
            this.randomizer.followupmailing,
            this.randomizer.followupdays,
            this.randomizer.openclickedorall
          ).subscribe(res => { console.log(res), this.openSnackBar('Added To Campaigns') })
        } else { this.openSnackBar('no list or campaign selected') }
      } else {
        if (this.randomizer.followupdays === undefined) { this.randomizer.followupdays = 0 }
        this.RelationsApi.randomizemailing(
          accountid,
          companyid,
          this.randomizer.templatemailing.id,
          this.randomizer.startdate,
          this.randomizer.enddate,
          this.randomizer.dayoftheweek,
          this.randomizer.starthour,
          this.randomizer.endhour,
          this.randomizer.Selmailinglists,
          this.randomizer.Selcampaignlists,
          this.randomizer.timezone,
          this.randomizer.addtomailing,
          this.randomizer.followupmailing,
          this.randomizer.followupdays,
          this.randomizer.openclickedorall
        ).subscribe(res => { console.log(res), this.openSnackBar('Created Campaigns') })
      }
      this.ready = true;
    });
  }

}
