import { Component, OnInit, Input } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment-timezone';
import { DialogsService } from './../../dialogsservice/dialogs.service';
import { timeconv } from '../../shared/timeconv';

export class Facebookcampaign {
  id: string;
  name: string;
  adlabels: string;
  bid_strategy: string;
  budget_remaining: string;
  buying_type: string;
  created_time: string;
  daily_budget: string;
  effective_status: string;
  issues_info: string;
  lifetime_budget: string;
  objective: string;
  pacing_type: string;
  promoted_object: string;
  spend_cap: string;
  start_time: string;
  status: string;
  stop_time: string;
}

@Component({
  selector: 'app-marketingpromotions',
  templateUrl: './marketingpromotions.component.html',
  styleUrls: ['./marketingpromotions.component.scss']
})
export class MarketingpromotionsComponent implements OnInit {

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();

  public Twitter: Twitter[];
  public Linkedin: Linkedin[];
  public Facebook: Facebook[];
  public selectedFB: Facebook;

  public campaignsFB: Facebookcampaign[];
  public selectedCampaignFB: Facebookcampaign;


  constructor(
    public timeconv: timeconv,
    public dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    public RelationsApi: RelationsApi,
    public TwitterApi: TwitterApi,
    public LinkedinApi: LinkedinApi,
    public FacebookApi: FacebookApi,
  ) { }

  ngOnInit() {

  }

  getLinkedin(): void {
    this.RelationsApi.getLinkedin(this.option.id)
      .subscribe((Linkedin: Linkedin[]) => this.Linkedin = Linkedin);
  }

  getTwitter(): void {
    this.RelationsApi.getTwitter(this.option.id)
      .subscribe((Twitter: Twitter[]) => this.Twitter = Twitter)
  }

  getFacebookAds(): void {
    this.FacebookApi.adsget(this.selectedFB.AccessToken, this.selectedFB.AdsAccountId)
      .subscribe((campaigns: Facebookcampaign[]) => { this.campaignsFB = campaigns });
  }

  getFacebook(): void {
    this.RelationsApi.getFacebook(this.option.id)
      .subscribe((Facebook: Facebook[]) => this.Facebook = Facebook);
  }

  onselectFB(facebook: Facebook): void {
    this.selectedFB = facebook;
    console.log(this.selectedFB);
    this.getFacebookAds();
  }

  createFacebookAds(): void {
    this.FacebookApi.adsget(this.selectedFB.AccessToken, this.selectedFB.AdsAccountId).subscribe(
      res => { console.log(res) }
    )

  }

  createAdwordsAds(): void {

  }

  createTwitterAds(): void {

  }


}
