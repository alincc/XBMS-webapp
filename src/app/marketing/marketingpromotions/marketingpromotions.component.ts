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

@Component({
  selector: 'app-marketingpromotions',
  templateUrl: './marketingpromotions.component.html',
  styleUrls: ['./marketingpromotions.component.scss']
})
export class MarketingpromotionsComponent implements OnInit {

  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();

  constructor() { }

  ngOnInit() {
  }

}
