import { Component, OnInit, Input  } from '@angular/core';
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
  
  getFacebook(): void {
    this.RelationsApi.getFacebook(this.option.id)
      .subscribe((Facebook: Facebook[]) => this.Facebook = Facebook);
  }

  createFacebookAds(): void {
    this.FacebookApi.adssdk().subscribe(
      res => {console.log(res)}
    )

  }

  createAdwordsAds(): void {

  }

  createTwitterAds(): void {

  }


}
