import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Account,
  AccountApi,
  CallsApi,
  Calls,
  CompanyApi,
  LoopBackConfig,
  RelationsApi,
  Relations,
  PublicationsApi,
  BASE_URL,
  API_VERSION,
  Googleanalytics,
  GoogleanalyticsApi,
  MailingApi,
  Websitetracker,
  WebsitetrackerApi,
  MarketingplannereventsApi,
  Marketingplannerevents,
  TwitterApi,
  FacebookApi,
  LinkedinApi,
  PinterestApi
} from '../shared/';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-returnpage',
  templateUrl: './returnpage.component.html',
  styleUrls: ['./returnpage.component.scss']
})


export class ReturnpageComponent implements OnInit, OnDestroy {
  private id: any;
  private sub: any;
  private code: any;
  private source: any;
  private state: any;
  private oauth_token: any;
  private oauth_verifier: any;
  response: any;

  constructor(
    private route: ActivatedRoute,
    public TwitterApi: TwitterApi,
    public PinterestApi: PinterestApi,
    public FacebookApi: FacebookApi,
    public LinkedinApi: LinkedinApi,
    public MarketingplannereventsApi: MarketingplannereventsApi,
    public WebsitetrackerApi: WebsitetrackerApi,
    public MailingApi: MailingApi,
    public CompanyApi: CompanyApi,
    public AccountApi: AccountApi,
    public RelationsApi: RelationsApi,
    public CallsApi: CallsApi,
    public PublicationsApi: PublicationsApi,
    public GoogleanalyticsApi: GoogleanalyticsApi,
    public router: Router,
  ) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  //http://127.0.0.1:3000/api/twitters/sessioncallback?id=5bd9487c98bd933943310f1f&oauth_token=26FBNgAAAAAA3FwUAAABZsjDKCg&oauth_verifier=xCPmfOrB2iFPYVtrzku5BHsQu4cE7waX
  ngOnInit() {
    //let params: any 
    this.route.queryParams
      //.filter(params => params)
      .subscribe(params => {
        this.id = params['id'];
        this.source = params['source'];
        this.oauth_token = params['oauth_token'];
        this.oauth_verifier = params['oauth_verifier'];
        this.code = params['code']; //linkedin state
        this.state = params['state'];
      });

      //facebook returns string instead of parameter so convert this here:  typeof this.state === 'string'
      console.log(this.state);
      let stateT = JSON.parse(this.state);
      if (typeof stateT === 'object'){
        console.log(stateT);

        this.source = stateT.source;
        this.id = stateT.id;
      }

      console.log(this.code, this.id, this.source);


    if (this.source === 'twitter') {
      this.TwitterApi
        .sessioncallback(this.id, this.oauth_token, this.oauth_verifier)
        .subscribe(res => this.response = res);
    }

    else if (this.source === 'facebook') {
      this.FacebookApi
        .sessioncallback(this.id, this.code)
        .subscribe(res => this.response = res);
    }

    else if (this.source === 'linkedin') {
      this.LinkedinApi.linkedinaccesstoken(this.id, this.code, this.state)
        .subscribe(res => this.response = 'linkedin account atted');
    }

    else if (this.source === 'pinterest') {
      this.PinterestApi
        .sessioncallback(this.id, this.code, this.state)
        .subscribe(res => this.response = res.res);
    }

    else this.response = "Source undefined"


  }


  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

}
