import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  LoggerApi,
  Logger,
  Account,
  AccountApi,
  CallsApi,
  Calls,
  CompanyApi,
  LoopBackConfig,
  RelationsApi,
  Relations,
  PublicationsApi,
  Googleanalytics,
  GoogleanalyticsApi,
  MailingApi,
  Websitetracker,
  WebsitetrackerApi,
  MarketingplannereventsApi,
  Marketingplannerevents,
  Twitter,
  TwitterApi,
  BASE_URL,
  API_VERSION
} from '../shared/';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view: any[] = [600, 400];
  colorScheme = {
    domain: ['#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b']
  };

  public RelationsNum: any;
  public CallsNum: any;
  public PublicationsNum: any;
  public Calls: Calls[];
  public errorMessage
  public TotalNumber = [];
  public returnnumber: any;
  public analyticsresult: any;
  public Account: Account = new Account();
  public Relations: Relations[];
  public logger: Logger[];
  public Mailing = [];
  public mailstatsspinner = false;
  public Googleanalyticsnumbers = [];
  public Googleanalyticsnames = [];
  public GoogleanalyticsModel: Googleanalytics[];
  public Websitetracker: Websitetracker[];
  public analytics_ids: string;
  public analytics_startdate: string;
  public analytics_enddate: string;
  public analytics_dimensions: string;
  public analytics_metrics: string;
  public Googleanalytics2: any;
  public Googleanalyticsreturn2: any;
  public Googleanalyticsnumbers2 = [];
  public Googleanalyticsnames2 = [];
  public Googleanalyticsnumbers3;
  public Googleanalyticsnames3;
  public analytics_ids2: string;
  public analytics_startdate2: string;
  public analytics_enddate2: string;
  public analytics_dimensions2: string;
  public analytics_metrics2: string;
  public analytics_ids3: string;
  public analytics_startdate3: string;
  public analytics_enddate3: string;
  public analytics_dimensions3: string;
  public analytics_metrics3: string;
  public googleanalyticsreturn: any[];
  public selectedanalytics: Googleanalytics = new Googleanalytics();
  public options = [];
  public option: Relations = new Relations();
  public mailingstats = [];
  public acceptedNumbers = [];
  public acceptedLabel = [];
  public deliveredNumbers = [];
  public deliveredLabels = [];
  public openedNumbers = [];
  public clickedNumbers = [];
  public unsubscribedNumbers = [];
  public complainedNumbers = [];
  public mailStatsTimeSelected;
  public storedNumbers = [];
  public failedNumbers = [];
  public twitterselected;
  public Twitter: Twitter[];

  mailStatsTime = [
    { value: '12m', viewValue: 'Year/months' },
    { value: '365d', viewValue: 'Year/days' },
    { value: '30d', viewValue: 'Month' },
    { value: '7d', viewValue: 'Week' },
    { value: '1d', viewValue: 'Day' }
  ];

  public Marketingplannerevents: Marketingplannerevents[];

  constructor(
    public loggerApi: LoggerApi,
    public TwitterApi: TwitterApi,
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
    this.analytics_ids = 'ga:154403562'; // add user to analytics account 
    this.analytics_startdate = '30daysAgo';
    this.analytics_enddate = 'today';
    this.analytics_dimensions = 'ga:medium';
    this.analytics_metrics = 'ga:users';

    this.analytics_ids2 = 'ga:154403562';
    this.analytics_startdate2 = '30daysAgo';
    this.analytics_enddate2 = 'today';
    this.analytics_dimensions2 = 'ga:date';
    this.analytics_metrics2 = 'ga:users';

    this.analytics_ids3 = 'ga:154403562'; // add user to analytics account 
    this.analytics_startdate3 = '30daysAgo';
    this.analytics_enddate3 = 'today';
    this.analytics_dimensions3 = 'ga:region';
    this.analytics_metrics3 = 'ga:users';
  }



  ngOnInit(): void {
    if (this.AccountApi.isAuthenticated() === false) { this.router.navigate(['login']) }
    if (this.AccountApi.getCurrentToken() === undefined) { this.router.navigate(['login']) }
    this.setFilter();
    this.getCurrentUserInfo();
  }


  //  get currentuserinfo for api
  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account,
        this.CompanyApi.getRelations(this.Account.companyId,
          { fields: { id: true, relationname: true } }
        )
          .subscribe((relations: Relations[]) => {
            this.Relations = relations,
              this.getrelationsEntry();
            this.getAdsMailing();
            if (this.Account.standardrelation !== undefined) {
              this.RelationsApi.findById(this.Account.standardrelation)
                .subscribe(rel => {
                  this.onSelectRelation(rel, null)
                  this.getWebsiteTracker();
                  this.getLogs();
                  this.getTwitterAccount();
                })
            }
            if (this.Account.standardGa) {
              this.GoogleanalyticsApi.findById(this.Account.standardGa)
                .subscribe((googleanalytics: Googleanalytics) => {
                  this.selectedanalytics = googleanalytics,
                    this.buildDashboard()
                })
            }
          });
    })
  }

  getTwitterAccount(): void {
    this.RelationsApi.getTwitter(this.option.id)
      .subscribe((Twitter: Twitter[]) => {
      this.Twitter = Twitter;
    if (Twitter[0].screenname === undefined) {
          this.TwitterApi.verifycredentials(this.Twitter[0].AccessToken, this.Twitter[0].AccessTokenSecret)
            .subscribe(res => {
              res = JSON.parse(res);
              this.twitterselected = { sourceType: 'url', url: 'https://twitter.com/' + res.screen_name };
              console.log(this.twitterselected, res);
              this.Twitter[0].screenname = res.screen_name;
              this.RelationsApi.updateByIdTwitter(this.option.id, this.Twitter[0].id, this.Twitter[0]).subscribe();
            });
          } else { this.twitterselected = { sourceType: 'url', url: 'https://twitter.com/' + this.Twitter[0].screenname };}
        });
}

//  select relation --> get info for all tabs
onSelectRelation(option, i): void {
  this.option = option;
  this.AccountApi.addStdRelation(this.Account.id, option.id).subscribe()
}

getLogs(): void {
  this.CompanyApi.getLogger(this.Account.companyId).subscribe((logger: Logger[]) => {
    this.logger = logger;
  })
}

deleteLog(i): void {
  this.CompanyApi.destroyByIdLogger(this.Account.companyId, this.logger[i].id)
    .subscribe(res => { this.getLogs(); });
}

getAdsMailing(): void {
  //  get the planned mailings looks shitty because the mailings of are 
  //  part of the marketingplannerevents 
  //  and are not directly related to the Relation.id itself 
  //  used include to get the related mailings and then run foreach on the events and a foreach for all the mailings

  this.Mailing = [];
  this.RelationsApi.getMarketingplannerevents(this.Account.standardrelation,
    {
      where: { scheduled: true },
      include: {
        relation: 'mailing',
        scope:
          { where: { and: [{ send: false }, { scheduled: true }] } }
      },
      order: 'date ASC'
    })
    .subscribe((Marketingplannerevents: Marketingplannerevents[]) => {
      this.Marketingplannerevents = Marketingplannerevents,
        this.Marketingplannerevents.forEach((item) => {
          const mailingsub = item.mailing;
          mailingsub.forEach((itemMailing) => {
            itemMailing.marketingplannereventsIds = item.name;
            this.Mailing.push(itemMailing)
          })
        })
      // console.log(this.Mailing);
      //  objects are being sorted
      this.Mailing = this.Mailing.sort((n1, n2) => {
        return this.naturalCompare(n1.date, n2.date)
      })
    })
}

//  don't try to understand this method, just use it as it is and you'll get the result
naturalCompare(a, b) {
  const ax = [], bx = [];

  a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || '']) });
  b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || '']) });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) { return nn };
  }

  return ax.length - bx.length;
}

getWebsiteTracker(): void {
  this.Websitetracker = [];
  //  limit is total entries, order is is important as first entry is in array ES6 move to server. 
  this.RelationsApi.getWebsitetracker(this.option.id, {
    where: { isp: false },
    order: 'date DESC', limit: 100
  })
    .subscribe((websitetracker: Websitetracker[]) => {
      this.Websitetracker = websitetracker.filter((WebsitetrackerFil, index, self) =>
        index === self.findIndex((t) => (
          t.IP === WebsitetrackerFil.IP
        )))
    })
}

markisp(i): void {
  this.Websitetracker[i].isp = true
    this.RelationsApi.updateByIdWebsitetracker(this.option.id, this.Websitetracker[i].id, this.Websitetracker[i])
    .subscribe(res => this.getWebsiteTracker());
}

buildDashboard(): void {
  //  delay for user input
  setTimeout(() => {
  this.countRelations(),
    this.getTask(),
    this.getFollowups(),
    this.getMailStats()
  if (this.selectedanalytics !== null) {
    this.getAnalyticsLine(), // 
      this.getAnalytics();
    this.getAnalytics3();
  }
}, 500);
  }

getTask(): void {
  this.CompanyApi.getCalls(this.Account.companyId, { where: {} })
}


getFollowups(): void {
  this.CompanyApi.getCalls(
    this.Account.companyId,
    {
      where: { and: [{ followup: true }, { followupdone: false }] },
      include: {
        relation: 'relations',
        scope: { fields: 'relationname' }
      },
      order: 'callbackdate ASC'
    })
    .subscribe((Calls: Calls[]) => this.Calls = Calls);
}


changeFollowUp(i): void {
  this.CompanyApi.updateByIdCalls(this.Account.companyId, this.Calls[i].id, { followupdone: true })
    .subscribe();
}


  public getAnalyticsAccounts(option, i): void {
  this.option = option;
  //  this.Account.standardrelation = option.id;
  //  const id = this.Account.id
  this.AccountApi.addStdRelation(this.Account.id, option.id)
    .subscribe(res => {
      this.buildDashboard(),
        this.RelationsApi.getGoogleanalytics(this.option.id)
          .subscribe((GoogleanalyticsModel: Googleanalytics[]) => {
            this.GoogleanalyticsModel = GoogleanalyticsModel
          })
    });
}

myControl: FormControl = new FormControl();
filteredOptions: Observable<string[]>;

//  compare filter search Relations
setFilter(): void {
  this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith<string | Relations>(''),
      map(value => typeof value === 'string' ? value : value.relationname),
      map(relationname => relationname ? this.filter(relationname) : this.options.slice())
    );
}

  //  filter and to lower case for search
  private filter(relationname: string): Relations[] {
  const filterValue = relationname.toLowerCase();
  return this.options.filter(option => option.relationname.toLowerCase().indexOf(filterValue) === 0);
}

//  set Relations and quick selections
getrelationsEntry(): void {
  this.options = []
    for(const relation of this.Relations) {
  this.options.push(relation);
}
  }

// display name in searchbox
displayFn(relation ?: Relations): string | undefined {
  return relation ? relation.relationname : undefined;
}




  // chart 1 Activities
  public barChartOptions: any = {
  scaleShowVerticalLines: false,
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
}
  public barChartLabels: string[] = ['Total Activities'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [
  { data: [], label: 'Relation' },
  { data: [], label: 'Calls' },
  { data: [], label: 'Publications' },
  { data: [], label: 'Mailings' }
];

  public barChartColors: Array < any > =[
  { //  grey --> deconsted using standard settings make option for user select
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'blue'
  }]

  //  events
  public chartClicked(e: any): void {
  console.log(e);
}

  public chartHovered(e: any): void {
  console.log(e);
}


@ViewChild('baseChartBar', {static: false}) chartBar: BaseChartDirective;

  public getNumbers(): void {
  const data1 = this.TotalNumber.slice(0);
  const data2 = this.TotalNumber.slice(1);
  const data3 = this.TotalNumber.slice(2);
  const data4 = this.TotalNumber.slice(3);
  //const clone = JSON.parse(JSON.stringify(this.barChartData));
  const clone = this.barChartData;
  clone[0].data = data1;
  clone[1].data = data2;
  clone[2].data = data3;
  clone[3].data = data4;
  this.barChartData = clone;
  // console.log(this.RelationsNum.count);
  /**
   * (My guess), for Angular to recognize the change in the dataset
   * it has to change the dataset constiable directly,
   * so one way around it, is to clone the data, change it and then
   * assign it;
   */
}

  public countRelations() {
  this.TotalNumber = [];
  // use count include?? open issue for loopback --> create hook instead to package as one call or move to automation
  this.CompanyApi.countRelations(this.Account.companyId).subscribe(count => {
    this.returnnumber = count
    this.TotalNumber.push(this.returnnumber.count),

      this.CompanyApi.countCalls(this.Account.companyId).subscribe(count => {
        this.returnnumber = count,
          this.TotalNumber.push(this.returnnumber.count),

          this.CompanyApi.countPublications(this.Account.companyId).subscribe(count => {
            this.returnnumber = count,
              this.TotalNumber.push(this.returnnumber.count),

              this.RelationsApi.countMarketingplannerevents(this.Account.standardrelation).subscribe(count => {
                this.returnnumber = count,
                  this.TotalNumber.push(this.returnnumber.count),

                  this.getNumbers();
              }, error => console.log('Could not load Marketing'));
          });
      });
  });
}

  // chart2 website analytics bar chart
  public barChart2Options: any = {
  scaleShowVerticalLines: false,
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
}
  public barChart2Labels: string[] = this.Googleanalyticsnames;
  public barChart2Type: string = 'bar';
  public barChart2Legend: boolean = true;

  public barChart2Data: any[] = [this.Googleanalyticsnames];

  public barChart2Colors: Array < any > =[
  { //  grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'blue'
  }]

  //  events
  public chart2Clicked(e: any): void {
  console.log(e);
}

  public chart2Hovered(e: any): void {
  console.log(e);
}


@ViewChild('baseChartBar2', {static: false}) baseChartBar2: BaseChartDirective;

  public get1Numbers(): void {
  this.barChart2Labels = [];
  this.barChart2Labels = this.Googleanalyticsnames3;


  if(this.baseChartBar2 !== undefined) {
  this.baseChartBar2.ngOnDestroy();
  this.baseChartBar2.labels = this.barChart2Labels;
  this.baseChartBar2.chart = this.baseChartBar2.getChartBuilder(this.baseChartBar2.ctx);
}

const data = this.Googleanalyticsnumbers3;//  update to new
const clone = JSON.parse(JSON.stringify(this.barChart2Data));
clone[0].data = data;
this.barChart2Data = clone;
  }

  public getAnalytics() {

  this.googleanalyticsreturn = [];
  this.Googleanalyticsnumbers = [];
  this.Googleanalyticsnames = [];
  this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, this.analytics_startdate,
    this.analytics_enddate, this.analytics_dimensions, this.analytics_metrics)
    .subscribe((data) => {
      const googleanalyticsreturn1 = data.rows
      googleanalyticsreturn1.forEach((item, index) => {
        this.Googleanalyticsnumbers.push(item[1]);
        const analyticsobject = { 'name': item[0], 'value': item[1] }
        this.googleanalyticsreturn.push(analyticsobject);
        this.Googleanalyticsnames.push(item[0]);
      }),
        console.log(this.googleanalyticsreturn);
      // get array even and uneven split
      // this.get1Numbers();
      this.getDoughnutNumbers(); // Doughnut
      // import to update for ngx charts
      this.googleanalyticsreturn = [...this.googleanalyticsreturn]
    }, error => console.log('Could not load Analytics'));
}



  //  lineChart
  public lineChartData: Array < any > =[
  { data: [], label: 'Website Visitors' }];
  public lineChartLabels: Array < any > = this.Googleanalyticsnames2;
  public lineChartOptions: any = {
  responsive: true
};
  public lineChartColors: Array < any > =[
  { //  grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';


  //  events
  public chart3Clicked(e: any): void {
  console.log(e);
}

  public chart3Hovered(e: any): void {
  console.log(e);
}


  public getAnalytics3() {
  this.Googleanalyticsnumbers3 = [];
  this.Googleanalyticsnames3 = [];
  this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids3, this.analytics_startdate3,
    this.analytics_enddate3, this.analytics_dimensions3, this.analytics_metrics3)
    .subscribe((data) => {
      const googleanalyticsreturn = data
      googleanalyticsreturn.rows.forEach((item, index) => {
        this.Googleanalyticsnumbers3.push(item[1]);
        this.Googleanalyticsnames3.push(item[0]);
      }),
        // get array even and uneven split
        this.get1Numbers();
      // this.getDoughnutNumbers(); // Doughnut
    }, error => console.log('Could not load Analytics'));
}


@ViewChild('baseChartLine', {static: false}) chartLine: BaseChartDirective;

  public get2Numbers(): void {

  this.lineChartLabels = [];
  this.lineChartLabels = this.Googleanalyticsnames2;

  // use to update label, yes this is the only way that works

  if(this.chartLine !== undefined) {
  this.chartLine.ngOnDestroy();
  this.chartLine.labels = this.lineChartLabels;
  this.chartLine.chart = this.chartLine.getChartBuilder(this.chartLine.ctx);
}

// same here
const data = this.Googleanalyticsnumbers2;//  update to new
const clone = JSON.parse(JSON.stringify(this.barChart2Data));
clone[0].data = data;
this.lineChartData = clone;
  }


  public getAnalyticsLine() {
  this.Googleanalyticsnames2 = [];
  this.Googleanalyticsnumbers2 = [];
  this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids2, this.analytics_startdate2,
    this.analytics_enddate2, this.analytics_dimensions2, this.analytics_metrics2)
    .subscribe((data) => {
      this.Googleanalyticsreturn2 = data,
        this.Googleanalytics2 = this.Googleanalyticsreturn2.rows,
        this.Googleanalytics2.forEach((item, index) => {
          const txt2 = item[0].slice(0, 4) + '-' + item[0].slice(4, 12);
          const txt3 = txt2.slice(0, 7) + '-' + txt2.slice(7, 13);

          this.Googleanalyticsnumbers2.push(item[1]);
          this.Googleanalyticsnames2.push(txt3);
        });
      // (this.Googleanalyticsnumbers2);
      // console.log(this.Googleanalyticsnames2);
      this.get2Numbers();
    }, error => console.log('Could not load Analytics'));
}


  //  Doughnut
  public doughnutChartLabels: string[] = this.Googleanalyticsnames;
  public doughnutChartType: string = 'doughnut';
  public doughnutChartData: any[] = [
  { data: [], label: 'Website visitors by Source' }, // for flex colors you need predetermine the arrays
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' },
  { data: [], label: 'Website visitors by Source' }];

  //  events
  public chartClicked2(e: any): void {
  console.log(e);
}

  public chartHovered2(e: any): void {
  console.log(e);
}

@ViewChild('baseChartDoughnut', {static: false}) chartDoughnut: BaseChartDirective;

  public getDoughnutNumbers() {
  this.doughnutChartLabels = [];
  this.doughnutChartLabels = this.Googleanalyticsnames;
  // console.log('names', this.Googleanalyticsnames);

  if (this.chartDoughnut !== undefined) {
    this.chartDoughnut.ngOnDestroy();
    this.chartDoughnut.labels = this.doughnutChartLabels;
    // this.chartDoughnut.labels = this.doughnutChartLabels;
    this.chartDoughnut.chart = this.chartDoughnut.getChartBuilder(this.chartDoughnut.ctx);
  }

  const data = this.Googleanalyticsnumbers;//  update to new
  const clone = JSON.parse(JSON.stringify(this.doughnutChartData));
  clone[0].data = data;
  this.doughnutChartData = clone;
}


  public doughnutChartColors: Array < any > =[
  { //  grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#23549D',
    pointHoverBackgroundColor: '#23549D',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }]

//  __________ Mailing Charts

getMailStats(): void {
  this.mailstatsspinner = true;
  //  set d/m/h 
  let data;
  if(this.mailStatsTimeSelected == undefined) {
  data = '7d';
} else { data = this.mailStatsTimeSelected.value }
this.MailingApi.getstats(data).subscribe(res => {
  this.mailingstats = res.res,
    // console.log('mailingstats:', this.mailingstats)

    this.acceptedNumbers = [],
    // set accepted mails
    this.mailingstats[0].stats.forEach(element => {
      this.acceptedNumbers.push(element.accepted.outgoing)
    });

  this.acceptedLabel = [],
    // set accepted labels/Dates
    this.mailingstats[0].stats.forEach(element => {
      const time = element.time.slice(0, 16)
      this.acceptedLabel.push(time)
    });

  this.deliveredNumbers = [],
    // set accepted mails
    this.mailingstats[1].stats.forEach(element => {
      this.deliveredNumbers.push(element.delivered.total) // smtp/html
    });

  this.openedNumbers = [],
    this.mailingstats[2].stats.forEach(element => {
      this.openedNumbers.push(element.opened.total)
    });

  this.clickedNumbers = [],
    this.mailingstats[3].stats.forEach(element => {
      this.clickedNumbers.push(element.clicked.total)
    });

  this.unsubscribedNumbers = [],
    this.mailingstats[4].stats.forEach(element => {
      this.unsubscribedNumbers.push(element.unsubscribed.total)
    });

  this.complainedNumbers = [],
    this.mailingstats[5].stats.forEach(element => {
      this.complainedNumbers.push(element.complained.total)
    });

  this.storedNumbers = [],
    this.mailingstats[6].stats.forEach(element => {
      this.storedNumbers.push(element.stored.total)
    });

  this.failedNumbers = [],
    this.mailingstats[7].stats.forEach(element => {
      this.failedNumbers.push(element.failed.permanent.total)
    });

  this.getMailChart()
}
);
  }

  public MailChartData: Array < any > =[
  { data: this.acceptedNumbers, label: 'Accepted Emails' },
  { data: this.deliveredNumbers, label: 'Delivered Emails' },
  { data: this.openedNumbers, label: 'Opened Emails' },
  { data: this.clickedNumbers, label: 'ClickedEmails' },
  { data: this.unsubscribedNumbers, label: 'Unsubscribed Emails' },
  { data: this.complainedNumbers, label: 'Complained Emails' },
  { data: this.storedNumbers, label: 'Stored' },
  { data: this.failedNumbers, label: 'Failed' },
];
  public MailChartLabels: Array < any > = this.acceptedLabel; // dates only 
  public MailChartOptions: any = {
  responsive: true
};

  public MailChartColors: Array < any > =[
  { //  grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
  public MailChartLegend: boolean = true;
  public MailChartType: string = 'line';


  //  events
  public MailChartClicked(e: any): void {
  console.log(e);
}

  public MailChartHovered(e: any): void {
  console.log(e);
}

@ViewChild('baseMailChart', {static: false}) MailchartLine: BaseChartDirective;

  public getMailChart(): void {

  this.MailChartLabels = [];
  this.MailChartLabels = this.acceptedLabel;

  // use to update label, yes this is the only way that works

  if(this.MailchartLine !== undefined) {
  this.MailchartLine.ngOnDestroy();
  this.MailchartLine.labels = this.MailChartLabels;
  this.MailchartLine.chart = this.MailchartLine.getChartBuilder(this.MailchartLine.ctx);
}

// same here
const data1 = this.acceptedNumbers;//  update to new
const data2 = this.deliveredNumbers; // for each dataset
const data3 = this.openedNumbers;
const data4 = this.clickedNumbers;
const data5 = this.unsubscribedNumbers;
const data6 = this.complainedNumbers;
const data7 = this.storedNumbers;
const data8 = this.failedNumbers;
const clone = JSON.parse(JSON.stringify(this.MailChartData));
clone[0].data = data1;
clone[1].data = data2;
clone[2].data = data3;
clone[3].data = data4;
clone[4].data = data5;
clone[5].data = data6;
clone[6].data = data6;
clone[7].data = data6;
this.MailChartData = clone;
this.mailstatsspinner = false;
  }




}