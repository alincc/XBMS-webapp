
import { Component, ViewChild, OnInit, HostBinding, Input } from '@angular/core';
import {
  Relations,
  RelationsApi,
  Account,
  Channels,
  Twitter,
  TwitterApi,
  Linkedin,
  LinkedinApi,
  Facebook,
  FacebookApi,
  timezones,
} from '../../shared/';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import * as moment from 'moment-timezone';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { timeconv } from '../../shared/timeconv';
// import { MarketingComponent } from '../marketing.component'
//  '../../shared/speed-dial-fab/speed-dial-fab.component';

@Component({
  selector: 'app-marketingchannels',
  templateUrl: './marketingchannels.component.html',
  styleUrls: ['./marketingchannels.component.scss']
})
export class MarketingchannelsComponent implements OnInit {

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();

  public options = [];
  public timezones = timezones;
  public Channels: Channels[];
  public newChannel: Channels = new Channels();
  public selectedChannel: Channels;
  selectedOption = false;
  public companypage = [];
  public selectcompanypage;

  public linkedintoggle = false;
  public twittertoggle = false;
  public instagramtoggle = false;
  public facebooktoggle = false;

  public errorMessage;

  public twitteroption: Twitter = new Twitter();
  public linkedinoption: Linkedin = new Linkedin();
  public facebookoption: Facebook = new Facebook();

  public Twitter: Twitter[];
  public Linkedin: Linkedin[];
  public Facebook: Facebook[];

  public convertdate;
  public date;
  public time;
  public localdate;
  public toggletextview = false;


  constructor(
    // public MarketingComponent: MarketingComponent,
    public timeconv: timeconv,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public RelationsApi: RelationsApi,
    public TwitterApi: TwitterApi,
    public LinkedinApi: LinkedinApi,
    public FacebookApi: FacebookApi,
  ) { }

  ngOnInit() {
    if (this.option.id) {
      this.getChannels();
    }
  }


  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: "snackbar-class"
    });
  }

  public toggleback() {
    this.twitteroption = null;
    this.linkedintoggle = false;
    this.twittertoggle = false;
    this.instagramtoggle = false;
  }

  newlinkedin(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "linkedin" })
      .subscribe(res => { this.selectedChannel = res, this.linkedintoggle = true })
  }

  newtwitter(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "twitter" })
      .subscribe(res => { this.selectedChannel = res, this.twittertoggle = true })
  }

  newinstagram(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "instagram" })
      .subscribe(res => { this.selectedChannel = res, this.instagramtoggle = true })
  }

  // toggle different media forms
  onSelectChannels(Channels: Channels): void {
    this.selectedChannel = Channels;
    this.twitteroption = null;
    this.linkedintoggle = false;
    this.twittertoggle = false;
    this.instagramtoggle = false;
    if (this.selectedChannel.type === "linkedin") { this.linkedintoggle = true }
    if (this.selectedChannel.type === "twitter") {
      this.twittertoggle = true,
        this.twitteroption = this.findTwitter(this.Twitter, this.selectedChannel.channelsendaccountid)
    }
    if (this.selectedChannel.type === "instagram") { this.instagramtoggle = true }
    if (this.selectedChannel.type === "facebook") { this.facebooktoggle = true }
  }

  findTwitter(Twitter, id) {
    // return Twitter.id === this.selectedChannel.channelsendaccountid;
    for (const item of Twitter) {
      if (item.id === id) {
        return item
      }
    }
  }

  getChannels(): void {
    this.RelationsApi.getChannels(this.option.id,
      {
        order: 'id ASC',
      })
      .subscribe((Channels: Channels[]) => this.Channels = Channels);
    this.getTwitter();
    this.getLinkedin();
    this.getFacebook();
    this.getInstagram();
  }

  scheduleChannel(): void {
    this.selectedChannel.scheduled = true;
    this.saveChannel();
  }


  saveChannel(): void {

    if (this.selectedChannel.date == null) {
      this.date = moment().format();
      this.selectedChannel.date = this.date
    }
    // timezone
    if (this.selectedChannel.timezone == null) {
      this.selectedChannel.timezone = moment.tz.guess();
    }

    // time
    if (this.selectedChannel.timeinterval == null) {
      this.time = moment().format("hh:mm")
      this.selectedChannel.timeinterval = this.time;
    }

    this.selectedChannel.date = this.timeconv.convertTime(this.selectedChannel.date, this.selectedChannel.timeinterval, this.selectedChannel.timezone);


    // this.date = moment().format();
    // set ID to sendaccountid for reference auth token
    if (this.selectedChannel.type === 'twitter') { this.selectedChannel.channelsendaccountid = this.twitteroption.id }
    if (this.selectedChannel.type === 'facebook') { this.selectedChannel.channelsendaccountid = this.facebookoption.id }
    if (this.selectedChannel.type === 'linkedin') { this.selectedChannel.channelsendaccountid = this.selectedChannel.channelsendaccountid } //set to companyId.. 
    // if (this.selectedChannel.type === 'instagram') {this.selectedChannel.channelsendaccountid = this.instagramoption.id}
    if (this.selectedChannel.recurrence === true) {
      //  if (this.selectedChannel.date === undefined) { this.selectedChannel.date = this.date; }
      //  this.selectedChannel.date = this.timeconv.convertTime(this.selectedChannel.date, this.selectedChannel.timeinterval, this.selectedChannel.timezone);
      //  this.selectedChannel.channelsendaccountid
      //  console.log(this.selectedChannel.date)
    }
    this.RelationsApi.updateByIdChannels(this.option.id, this.selectedChannel.id, this.selectedChannel)
      .subscribe();
    if (this.selectedChannel.relatedrecurrendevents !== undefined) {
      this.selectedChannel.relatedrecurrendevents.forEach(element => {
        this.RelationsApi.updateByIdChannels(this.option.id, element, this.selectedChannel)
          .subscribe();
      });
    }
    this.openSnackBar("Saved")
  }




  public openDialogDeleteChannel() {
    this.dialogsService
      .confirm('Delete scheduled Post', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteChannel(this.selectedOption);
      });
  }

  public deleteChannel(selectedOption): void {
    // delete all tweets  
    if (selectedOption == true) {
      // 
      if (this.selectedChannel.relatedrecurrendevents !== undefined) {
        this.selectedChannel.relatedrecurrendevents.forEach(element => {
          this.deleteChannelInstance(element.id);
        });
      }
      this.deleteChannelInstance(this.selectedChannel.id)
      this.twitteroption = null;
      this.linkedintoggle = false;
      this.twittertoggle = false;
      this.instagramtoggle = false;
      this.selectedChannel = null,
        // this.Channels.splice(i, 1), // delete only use new gethcannels? 
        this.getChannels();


    }
  }

  private deleteChannelInstance(id): void {
    // find related channel 
    this.RelationsApi.findByIdChannels(this.option.id, id).subscribe(ChannelInst => {
      console.log(ChannelInst)
      if (ChannelInst.type === "twitter" && ChannelInst.send === true) {
        this.TwitterApi.deletetweet(this.twitteroption.AccessToken,
          this.twitteroption.AccessTokenSecret, ChannelInst.channelsendid).subscribe();
      }
      if (ChannelInst.type === "linkedin" && ChannelInst.send === true) {
        this.LinkedinApi.deleteshare(this.linkedinoption.accesstoken,
          ChannelInst.channelsendid).subscribe();
      }
      this.RelationsApi.destroyByIdChannels(this.option.id, ChannelInst.id)
        .subscribe(res => {
          this.getChannels();
          this.openSnackBar("Alle Channels/Messages deleted");
        })
    })
  }


  getTwitter(): void {
    this.RelationsApi.getTwitter(this.option.id)
      .subscribe((Twitter: Twitter[]) => this.Twitter = Twitter)
  }

  postToTwitter(): void {
    this.TwitterApi.tweet(
      this.twitteroption.AccessToken,
      this.twitteroption.AccessTokenSecret,
      this.selectedChannel.text
    ).subscribe(res => {
      this.selectedChannel.channelsendid = res,
        this.selectedChannel.send = true;
      this.RelationsApi.updateByIdChannels(this.SelectedRelation.id, this.SelectedRelation)
        .subscribe();
    });
  }

  getLinkedin(): void {
    this.RelationsApi.getLinkedin(this.option.id)
      .subscribe((Linkedin: Linkedin[]) => this.Linkedin = Linkedin);
  }

  getLinkedinCompany(): void {
      if (this.linkedinoption.accesstoken) {
        this.LinkedinApi.linkedinadmincompanypage(this.linkedinoption.accesstoken)
          .subscribe(res => {
            if (res.errorCode !== undefined) {
              this.openSnackBar(res.message + ' please renew account');
            } else {
              this.companypage = res;
            }
          });
      }
  }

  getLinkedinAccount(): void {
    if (this.linkedinoption.accesstoken) {
      this.LinkedinApi.linkedinme(this.linkedinoption.accesstoken)
        .subscribe(res => {
          if (res.errorCode !== undefined) {
            this.openSnackBar(res.message + ' please renew account');
          } else {
            console.log(res);
          }
        });
    } else { console.log('token missing') }
  }

  // share to company linkedin page
  postToLinkedinCompanyPage(): void {
    // this.selectedChannel.channelsendaccountid = this.selectcompanypage.$URN;
    // console.log(this.selectedChannel.channelsendaccountid);
    this.saveChannel();
    this.LinkedinApi.linkedinsharecompanyupdate(
      this.linkedinoption.accesstoken,
      this.selectedChannel.channelsendaccountid,
      this.selectedChannel.text,
      this.selectedChannel.title,
      this.selectedChannel.title,
      this.selectedChannel.shareurl,
      this.selectedChannel.pictureurl
    ).subscribe(res => {
      console.log(res);
      this.selectedChannel.send = true;
      this.selectedChannel.channelsendid = res.activity;
      this.selectedChannel.companypage = this.linkedinoption.name;
      this.selectedChannel.userid = this.linkedinoption.id;
      this.saveChannel();
    });
  }

  scheduleLinkedinMessage(): void {
    this.selectedChannel.scheduled = true;
    this.selectedChannel.companypage = this.linkedinoption.name;
    this.selectedChannel.userid = this.linkedinoption.id;
    this.saveChannel();
  }

  updateLinkedinMessage(): void {
    this.LinkedinApi.findById(this.selectedChannel.userid).subscribe((linkedin: Linkedin) => {
      this.linkedinoption = linkedin;
      this.LinkedinApi.updateshare(this.linkedinoption.accesstoken, this.selectedChannel.channelsendid,
        this.selectedChannel.text)
        .subscribe(res => {
          this.saveChannel();
          console.log(res)
        });
    });
  };


postToLinkedinProfile(): void {

}



getFacebook(): void {
  this.RelationsApi.getFacebook(this.option.id)
    .subscribe((Facebook: Facebook[]) => this.Facebook = Facebook);
}

getInstagram(): void {
}


searchChannels(name): void {
  name = name.charAt(0).toUpperCase() + name.slice(1);
  name = name.trim();
  this.RelationsApi.getChannels({ where: { or: [{ newstitle: name }, { newstext: name }] } })
    .subscribe((Channels: Channels[]) => this.Channels = Channels,
      error => this.errorMessage = <any>error);
}



}
