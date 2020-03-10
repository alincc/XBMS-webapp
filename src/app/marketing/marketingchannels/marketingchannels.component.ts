
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
  Pinterest,
  PinterestApi,
  timezones,
} from '../../shared/';
import { MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment-timezone';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { timeconv } from '../../shared/timeconv';
// import { MarketingComponent } from '../marketing.component'
'../../shared/speed-dial-fab/speed-dial-fab.component';

@Component({
  selector: 'app-marketingchannels',
  templateUrl: './marketingchannels.component.html',
  styleUrls: ['./marketingchannels.component.scss']
})
export class MarketingchannelsComponent implements OnInit {

  @Input() Account: Account;
  @Input() SelectedRelation: Relations;
  @Input() option: Relations;

  public options = [];
  public timezones = timezones;
  public Channels: Channels[];
  public newChannel: Channels = new Channels();
  public selectedChannel: Channels;
  selectedOption = false;
  public companypage = [];
  public selectcompanypage;
  public selectpinterestboard;
  public pinterestboard = [];

  public linkedintoggle = false;
  public twittertoggle = false;
  public instagramtoggle = false;
  public facebooktoggle = false;
  public pinteresttoggle = false;

  public errorMessage;

  public twitteroption: Twitter = new Twitter();
  public linkedinoption: Linkedin = new Linkedin();
  public facebookoption: Facebook = new Facebook();
  public pinterestoption: Pinterest = new Pinterest();

  public Twitter: Twitter[];
  public Linkedin: Linkedin[];
  public Facebook: Facebook[];
  public Pinterest: Pinterest[];

  public convertdate;
  public date;
  public time;
  public localdate;
  public toggletextview = false;
  public waitingforfbpages = false;
  public listviewxsshow = false;


  constructor(
    // public MarketingComponent: MarketingComponent,
    public timeconv: timeconv,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public RelationsApi: RelationsApi,
    public TwitterApi: TwitterApi,
    public LinkedinApi: LinkedinApi,
    public FacebookApi: FacebookApi,
    public PinterestApi: PinterestApi
  ) { }

  ngOnInit() {
    // if (this.option.id) {
    //   this.getChannels();
    // }
  }

  swiperight(e) {
    console.log('swipe right')
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    this.listviewxsshow = false;
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
    this.pinteresttoggle = false;
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

  newfacebook(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "facebook" })
      .subscribe(res => { this.selectedChannel = res, this.facebooktoggle = true })
  }

  newinstagram(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "instagram" })
      .subscribe(res => { this.selectedChannel = res, this.instagramtoggle = true })
  }

  
  newpinterest(): void {
    this.toggleback();
    this.RelationsApi.createChannels(this.option.id, { type: "pinterest" })
      .subscribe(res => { this.selectedChannel = res, this.pinteresttoggle = true })
  }

  // toggle different media forms
  onSelectChannels(Channels: Channels): void {
    this.selectedChannel = Channels;
    // this.twitteroption = null;
    this.linkedintoggle = false;
    this.twittertoggle = false;
    this.instagramtoggle = false;
    this.pinteresttoggle = false;
    this.facebooktoggle = false;

    if (this.selectedChannel.type === "linkedin") {
      this.linkedintoggle = true;
      if (this.selectedChannel.userid) {
        this.linkedinoption = this.findLinkedin(this.Linkedin, this.selectedChannel.userid);
      } else {this.linkedinoption = new Linkedin();
        ;}
      if (this.selectedChannel.companypage) {
        this.getLinkedinCompany();
      } else {this.selectcompanypage = '';}
    }

    if (this.selectedChannel.type === "pinterest") {
      this.pinteresttoggle = true;
      if (this.selectedChannel.userid) {
        this.pinterestoption = this.findPinterest(this.Pinterest, this.selectedChannel.userid);
      } else {this.pinterestoption = new Pinterest();
        ;}
      if (this.selectedChannel.companypage) {
        this.getPinterestBoard();
      } else {this.selectcompanypage = '';}
    }

    if (this.selectedChannel.type === "facebook") {
      this.facebooktoggle = true;
      if (this.selectedChannel.userid) {
        this.facebookoption = this.findFacebook(this.Facebook, this.selectedChannel.userid);
      } else {this.facebookoption = new Facebook();
        ;}
      if (this.selectedChannel.companypage) {
        this.getFBAccountInfo();
      } else {this.selectcompanypage = '';}
    }

    if (this.selectedChannel.type === "twitter") {
      this.twittertoggle = true;
      if (this.selectedChannel.userid) {
        this.twitteroption = this.findTwitter(this.Twitter, this.selectedChannel.userid);
        console.log(this.twitteroption);
      } else {this.twitteroption = new Twitter();}
      if (this.selectedChannel.send){
        this.TwitterApi.gettweetinfo(
          this.twitteroption.AccessToken, this.twitteroption.AccessTokenSecret, 
          this.selectedChannel.channelsendid).subscribe(res => {
            if (res.errors){
              console.log(res.errors)
            } else {
              this.selectedChannel.shared = res[0].retweet_count;
              this.selectedChannel.likes = res[0].favorite_count;
            }
          })
      }
    }

    if (this.selectedChannel.type === "instagram") { this.instagramtoggle = true }
  }

  findLinkedinComp(companypages, id) {
    for (const item of companypages) {
      if (item.$URN === id) {
        return item
      }
    }
  }

  findLinkedin(Linkedin, id) {
    for (const item of Linkedin) {
      if (item.id === id) {
        return item
      }
    }
  }

  findFacebook(Facebook, id) {
    for (const item of Facebook) {
      if (item.id === id) {
        return item
      }
    }
  }

  findPinterest(Pinterest, id) {
    for (const item of Pinterest) {
      if (item.id === id) {
        return item
      }
    }
  }

  findTwitter(Twitter, id) {
    for (const item of Twitter) {
      if (item.id === id) {
        return item
      }
    }
  }

  getChannels(): void {
    this.RelationsApi.getChannels(this.option.id,
      {
        order: 'id DESC',
      })
      .subscribe((Channels: Channels[]) => this.Channels = Channels);
    this.getTwitter();
    this.getLinkedin();
    this.getFacebook();
    this.getPinterest();
    // this.getInstagram(); use facebook graph
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
    // if (this.selectedChannel.type === 'twitter') { this.selectedChannel.channelsendaccountid = this.twitteroption.id }
    // if (this.selectedChannel.type === 'facebook') { this.selectedChannel.channelsendaccountid = this.facebookoption.id }
    // if (this.selectedChannel.type === 'linkedin') { this.selectedChannel.channelsendaccountid = this.selectedChannel.channelsendaccountid } //set to companyId.. 
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
      this.deleteChannelInstance(this.selectedChannel.id);
      // this.twitteroption = null;
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
          this.twitteroption.AccessTokenSecret, ChannelInst.channelsendid).subscribe(
            res => {console.log(res);}
          );
      }
      if (ChannelInst.type === "linkedin" && ChannelInst.send === true) {
        this.LinkedinApi.deleteshare(this.linkedinoption.accesstoken,
          ChannelInst.channelsendid).subscribe();
      }
      if (ChannelInst.type === "facebook" && ChannelInst.send === true) {
        this.FacebookApi.delete(this.facebookoption.AccessToken,
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
      console.log(res);
      this.selectedChannel.userid = this.twitteroption.id;
      this.selectedChannel.channelsendid = res.id_str,
        this.selectedChannel.send = true;
      this.saveChannel();
    });
  }

  getPinterest(): void {
    this.RelationsApi.getPinterest(this.option.id)
      .subscribe((Pinterest: Pinterest[]) => this.Pinterest = Pinterest);
  }

  getPinterestBoard(): void {
    this.waitingforfbpages = true;
    setTimeout(() => {
      console.log(this.pinterestoption);
      this.PinterestApi.getboards(this.pinterestoption.AccessToken)
        .subscribe(res => {console.log(res)
        this.pinterestboard = res.res;
        this.waitingforfbpages = false;
      });
    }, 500);

  }

  getPinterstPins(): void {
    let url = this.selectpinterestboard.url;
    url = url.replace('https://www.pinterest.com/', '');
    let name = url.substring(0, url.indexOf("/")); 
    this.PinterestApi.getpins(this.pinterestoption.AccessToken, name, this.selectpinterestboard.name).subscribe(
      res => {console.log(res)}
    );
  }

  posttoPinterestBoard(): void {
    let url = this.selectpinterestboard.url;
    url = url.replace('https://www.pinterest.com/', '');
    let name = url.substring(0, url.indexOf("/")); 
    console.log(this.selectpinterestboard, name);
    this.PinterestApi.pin(this.pinterestoption.AccessToken, 
      name, this.selectpinterestboard.name, this.selectedChannel.text, this.selectedChannel.title, 
      null, null, this.selectedChannel.pictureurl).subscribe(
        res => { console.log(res)}
      )
  }

  getLinkedin(): void {
    this.RelationsApi.getLinkedin(this.option.id)
      .subscribe((Linkedin: Linkedin[]) => this.Linkedin = Linkedin);
  }

  getAdssdk(): void {

  }

  getLinkedinCompany(): void {
    if (this.linkedinoption.accesstoken) {
      this.LinkedinApi.linkedinadmincompanypage(this.linkedinoption.accesstoken)
        .subscribe(res => {
          if (res.errorCode !== undefined) {
            this.openSnackBar(res.message + ' please renew account');
          } else {
            this.companypage = res;
            if (this.selectedChannel.companypage){
              this.selectcompanypage = this.findLinkedinComp(this.companypage, this.selectedChannel.companypage);
            }
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
    this.selectedChannel.channelsendaccountid = this.selectcompanypage.$URN;
    // console.log(this.selectedChannel.channelsendaccountid);
    this.saveChannel();
    this.LinkedinApi.linkedinsharecompanyupdate(
      this.linkedinoption.accesstoken,
      this.selectedChannel.channelsendaccountid, // account used to send message
      this.selectedChannel.text,
      this.selectedChannel.title,
      this.selectedChannel.title,
      this.selectedChannel.shareurl,
      this.selectedChannel.pictureurl
    ).subscribe(res => {
      console.log(res);
      if (this.selectcompanypage){
        this.selectedChannel.companypage = this.selectcompanypage.$URN;
        this.selectedChannel.userid = this.linkedinoption.id;
      };
      this.selectedChannel.send = true;
      this.selectedChannel.channelsendid = res.id;
      this.saveChannel();
    });
  }

  updateChannel(): void {
    if (this.selectedChannel.type === 'linkedin'){
      this.updateLinkedinMessage();
    }
    if (this.selectedChannel.type === 'twitter'){
      this.updateTwitterMessage();
    }
    if (this.selectedChannel.type === 'facebook'){
      this.updateFacebookMessage();
    }
  }

  updateTwitterMessage(): void {

  }

  updateFacebookMessage(): void {

  }

  updatePinterestMessage(): void {

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

  postToFacebook(): void {
    this.FacebookApi.post(this.facebookoption.AccessToken, this.selectedChannel.text)
    .subscribe(
      res => {console.log(res);}
    );
  }

  postToFacebookPage(): void {
    this.FacebookApi.postpage(this.selectcompanypage.access_token, this.selectcompanypage.id, this.selectedChannel.text)
    .subscribe(
      res => {
        console.log(res.id);
        this.selectedChannel.companypage = res.id;
        this.selectedChannel.userid = this.facebookoption.id;
        this.selectedChannel.send = true;
        this.saveChannel();
      }
    );
  }


  getFacebook(): void {
    this.RelationsApi.getFacebook(this.option.id)
      .subscribe((Facebook: Facebook[]) => this.Facebook = Facebook);
  }

 
  getFBAccountInfo(): void {
    this.waitingforfbpages = true;
    setTimeout(() => {
      this.FacebookApi.me(this.facebookoption.AccessToken).subscribe(
        res => {console.log(res.data),
        this.companypage = res.data
        this.waitingforfbpages = false;}
      ) 
    }, 500);
  }

  
  postToInstagram(): void {
    this.FacebookApi.posttoinstagram(
      this.selectcompanypage.access_token, 
      this.selectcompanypage.id,
      this.selectedChannel.pictureurl, 
      this.selectedChannel.text,
      this.selectedChannel.usertags)
    .subscribe(
      res => {
        console.log(res.id);
        this.selectedChannel.companypage = res.id;
        this.selectedChannel.userid = this.facebookoption.id;
        this.selectedChannel.send = true;
        this.saveChannel();
      }
    );
  }

  postVideoToInstragram(): void {
    this.FacebookApi.postvideoinstagram(
      this.selectcompanypage.access_token, 
      this.selectcompanypage.id, 
      this.selectedChannel.videourl,
      this.selectedChannel.text,
      null,
      null
      ).subscribe(res => {console.log(res)})
  }

  getInstagramMedia(): void {
    this.FacebookApi.getinstagrammedia(this.selectcompanypage.access_token, this.selectcompanypage.id)
    .subscribe(res => {
      console.log(res);
    })
  }

  searchChannels(name): void {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim();
    this.RelationsApi.getChannels({ where: { or: [{ newstitle: name }, { newstext: name }] } })
      .subscribe((Channels: Channels[]) => this.Channels = Channels,
        error => this.errorMessage = <any>error);
  }

  public speedDialFabButtons = [
    {
      svgIcon: 'xbms_facebook',
      tooltip: 'facebook'
    },
    {
      svgIcon: 'xbms_twitter',
      tooltip: 'twitter'
    },
    {
      svgIcon: 'xbms_linkedin',
      tooltip: 'linkedin'
    },
    {
      svgIcon: 'xbms_instagram',
      tooltip: 'instagram'
    },
    {
      svgIcon: 'xbms_pinterest',
      tooltip: 'pinterest'
    },
    // {
    //   svgIcon: 'xbms_xing',
    //   tooltip: 'xing'
    // },
    // {
    //   svgIcon: 'xbms_youtube',
    //   tooltip: 'youtube'
    // },
    // {
    //   svgIcon: 'xbms_web',
    //   tooltip: 'web'
    // },
    // {
    //   svgIcon: 'xbms_snapchat',
    //   tooltip: 'snapchat'
    // },
    // {
    //   svgIcon: 'xbms_vimeo',
    //   tooltip: 'vimeo'
    // },
    // {
    //   svgIcon: 'xbms_github',
    //   tooltip: 'github'
    // }

  ];

  onSpeedDialFabClicked(btn) {
    console.log(btn.tooltip);
    if (btn.tooltip === 'linkedin'){this.newlinkedin()}
    if (btn.tooltip === 'pinterest'){this.newpinterest()}
    if (btn.tooltip === 'twitter'){this.newtwitter()}
    if (btn.tooltip === 'facebook'){this.newfacebook()}
    if (btn.tooltip === 'instagram'){this.newinstagram()}

  }

  setImage(event) {
    console.log(event);
    this.selectedChannel.pictureurl = event; 
  }

  setVideo(event) {
    //console.log(event);
    this.selectedChannel.videourl = event; 
  }


}
