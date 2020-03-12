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
import { BaseChartDirective } from 'ng2-charts';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChartType } from 'chart.js';

export class Chart {
  data: Array<any>;
  label: string;
}

export interface DataObject {
  type: string;
  startdate: Date;
  enddate: Date;
  dimension: string;
  data_set: Array<Chart>;
  data_labels: Array<Object>;
  charttype: string;
  colorscheme: string;
  chartsize: string;
}


export function createDataObject(type, startdate, enddate, charttype, dimension): {
  type: string;
  startdate: Date;
  enddate: Date;
  dimension: string;
  data_set: Array<Chart>;
  data_labels: Array<Object>;
  charttype: string;
  colorscheme: string;
  chartsize: string;
} {
  let newDataObject = {
    type: type,
    startdate: startdate,
    enddate: enddate,
    dimension: dimension,
    data_set: [],
    data_labels: [],
    charttype: charttype,
    colorscheme: 'greycolors',
    chartsize: '45%',
  }
  return newDataObject;
}

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

  private analytics_ids = 'ga:154403562'; // add user to analytics account 
  private analytics_metrics = 'ga:users';


  public dashboardsetup = [];
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaLegend = true;
  public RelationsNum: any;
  public CallsNum: any;
  public PublicationsNum: any;
  public Calls: Calls[];
  public errorMessage
  public Account: Account;
  public Relations: Relations[];
  public logger: Logger[];
  public Mailing = [];
  public mailstatsspinner = false;
  public GoogleanalyticsModel: Googleanalytics[];
  public Websitetracker: Websitetracker[];
  public WebsitetrackerFullList: Websitetracker[];
  public analytics_startdate: string;
  public analytics_enddate: string;
  public analytics_dimensions: string;
  public Googleanalytics2: any;
  public Googleanalyticsreturn2: any;
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
  public selectedanalytics: Googleanalytics;
  public options = [];
  public option: Relations;
  public mailStatsTimeSelected;
  public storedNumbers = [];
  public failedNumbers = [];
  public twitterselected;
  public Twitter: Twitter[];
  public filteredRelations: Relations[];

  //  Doughnut
  public doughnutChartLabels: string[];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartData: any[] = [];

  public barChart2Labels: string[];
  public barChart2Type: string = 'bar';
  public barChart2Legend: boolean = true;
  public barChart2Data: any[];

  mailStatsTime = [
    { value: '12m', viewValue: 'Year/months' },
    { value: '365d', viewValue: 'Year/days' },
    { value: '30d', viewValue: 'Month' },
    { value: '7d', viewValue: 'Week' },
    { value: '1d', viewValue: 'Day' }
  ];


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


  public greycolors = [{ //  grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#23549D',
    pointHoverBackgroundColor: '#23549D',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];

  public barChartColors: Array<any> = [this.greycolors];
  public doughnutChartColors: Array<any> = [this.greycolors];
  public barChart2Colors: Array<any> = [this.greycolors];
  public lineChartColors: Array<any> = [this.greycolors];
  public MailChartColors: Array<any> = [this.greycolors];
  barChartManagerData: any[] = [];
  barChartManagerLabels: any[] = ['Relations', 'Calls'];
  public barChartDataChannel: any[] = [];
  public barChartDataChannelLabels: any[] = ['linkedin', 'twitter', 'instagram', 'facebook', 'pinterest'];

  public barChartData: any[] = [
    { data: [], labels: 'Publications' },
    { data: [], labels: 'Mailings' },
    { data: [], labels: 'Videos/Animations' },
    { data: [], labels: 'Images' }
  ];

  //  lineChart
  public lineChartData: Array<any> = [{ data: [], label: 'Website Visitors' }];
  public lineChartLabels: Array<any>;
  public lineChartOptions: any = { responsive: true };
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

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

  public MailChartData = [];
  public MailChartLabels: Array<any>; // dates only 
  public MailChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public MailChartLegend: boolean = true;
  public MailChartType: string = 'line';


  public barChartChannelLabels: string[] = ['Social Messages'];
  public Marketingplannerevents: Marketingplannerevents[];
  public facebookfeed;
  public changenow = true;

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

  }

  public speedDialFabButtons = [
    {
      icon: 'website',
      tooltip: 'Add new Website data'
    },
    {
      icon: 'google',
      tooltip: 'Add google analytics'
    },
    {
      icon: 'mail',
      tooltip: 'Add mailing data'
    },
    {
      icon: 'relation',
      tooltip: 'Add CRM data'
    },
    {
      icon: 'social',
      tooltip: 'Add Channel data'
    }
  ];

  onSpeedDialFabClicked(btn) {
    // console.log(btn.tooltip);
    if (btn.tooltip === 'Add new Website data') { this.addNewWebsiteData() }
    if (btn.tooltip === 'Add google analytics') { this.addNewAnalyticsData() }
    if (btn.tooltip === 'Add mailing data') { this.addNewMailingData() }
    if (btn.tooltip === 'Add CRM data') { this.addNewCRMData() }
    if (btn.tooltip === 'Add Channel data') { this.addNewChannelData() }
  }

  addNewWebsiteData() {
    let newData = createDataObject('websitedata', '30daysAgo', 'today', 'table', undefined);
    this.dashboardsetup.push(newData);
    this.buildDashboard();
  }

  addNewAnalyticsData() {
    let newData = createDataObject('googleanalytics', '30daysAgo', 'today', 'line', 'ga:date');
    this.dashboardsetup.push(newData);
    this.buildDashboard();
  }

  addNewMailingData() {
    this.buildDashboard()
  }

  addNewCRMData() {
    this.buildDashboard()
  }

  addNewChannelData() {
    this.buildDashboard()
  }


  detectchange(): void {
    console.log('detect change')
    this.changenow = false;
    setTimeout(() => { this.changenow = true }, 10);
  }

  ngOnInit(): void {
    if (this.AccountApi.isAuthenticated() === false) { this.router.navigate(['login']) }
    if (this.AccountApi.getCurrentToken() === undefined) { this.router.navigate(['login']) }
    // this.setFilter();
    this.getCurrentUserInfo();
  }


  //  get currentuserinfo for api
  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account;
      // this.getWebsiteTracker();
      // this.getLogs();
      // this.getTwitterAccount();


      this.CompanyApi.getRelations(this.Account.companyId,
        { fields: { id: true, relationname: true, domain: true } }
      )
        .subscribe((relations: Relations[]) => {
          this.Relations = relations,
            //this.getrelationsEntry();
            this.getAdsMailing();
          if (this.Account.standardrelation !== undefined) {
            this.RelationsApi.findById(this.Account.standardrelation)
              .subscribe((rel: Relations) => {
                this.option = rel;
                console.log(rel);
                this.onSelectRelation(rel, null);
                this.getAnalyticsAccounts();
                this.buildDashboard();
              })
          }
          if (this.Account.standardGa) {
            this.GoogleanalyticsApi.findById(this.Account.standardGa)
              .subscribe((googleanalytics: Googleanalytics) => {
                this.selectedanalytics = googleanalytics;
              })
          }
        });
    })
  }

  // this.selectedanalytics.id, this.analytics_ids2, this.analytics_startdate2 this.analytics_enddate2, this.analytics_dimensions2, this.analytics_metrics2
  getAnalyticsData(startdate, enddate, dimension) {
    return new Promise(async (resolve, reject) => {
      this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, startdate, enddate, dimension, this.analytics_metrics)
        .subscribe(data => {
          resolve(data);
        }, error => console.error(error));
    });
  }

  async setChartLineData(resdata, graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      const newset: Chart = { data: [], label: '' };
      graph.data_labels = [];
      for (let i = 0; i < resdata.rows.length; i++) {
        const item = resdata.rows[i]
        const txt2 = item[0].slice(0, 4) + '-' + item[0].slice(4, 12);
        const txt3 = txt2.slice(0, 7) + '-' + txt2.slice(7, 13);
        newset.data.push(item[1])
        graph.data_labels.push(txt3);
      }

      graph.data_set = [newset]
      resolve(graph);
    });
  }

  setChartType(resdata, graph: DataObject) {
    resdata.rows.forEach((item) => {
      const newset: Chart = { data: item[0], label: item[1] }
      graph.data_set.push(newset);
      graph.data_labels.push(item[0]);
    });
    return
  }




  async buildDashboard() {

    console.log(this.dashboardsetup);

    if (this.selectedanalytics) {
      for (let i = 0; i < this.dashboardsetup.length; i++) {
        let dashitem = this.dashboardsetup[i];

        console.log('build dashboard', dashitem.type);

        switch (dashitem.type) {
          case 'googleanalytics': {
            let resdata = await this.getAnalyticsData(dashitem.startdate, dashitem.enddate, dashitem.dimension);
            dashitem = await this.setChartLineData(resdata, dashitem);
            console.log(dashitem);
            break
          }
          case 'followups': {
            this.getFollowups();
            break
          }
          case 'mailingstatistics': {
            this.getMailStats();
            break
          }
          case 'relationstatistics': {
            this.countRelations();
            break
          }
          case 'channel': {
            this.countChannels();
            break
          }
          default: {
            console.error('no chart type or incorrect value')
          }
        }

      }

      setTimeout(() => { this.detectchange() }, 2000);

      //by source
      this.analytics_ids = 'ga:154403562'; // add user to analytics account 
      this.analytics_metrics = 'ga:users';


      this.analytics_startdate = '30daysAgo';
      this.analytics_enddate = 'today';
      this.analytics_dimensions = 'ga:medium';

      this.analytics_startdate2 = '30daysAgo';
      this.analytics_enddate2 = 'today';
      this.analytics_dimensions2 = 'ga:date';

      this.analytics_startdate3 = '30daysAgo';
      this.analytics_enddate3 = 'today';
      this.analytics_dimensions3 = 'ga:region';

      // this.getAnalyticsLine(); // by source
      // this.getAnalytics(); // by date
      // this.getAnalytics3(); // by region
    }

  }

  getTwitterAccount(): void {
    this.RelationsApi.getTwitter(this.option.id)
      .subscribe((Twitter: Twitter[]) => {
        if (Twitter.length > 0) {
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
          } else { this.twitterselected = { sourceType: 'url', url: 'https://twitter.com/' + this.Twitter[0].screenname }; }
        }
      });
  }

  //  select relation --> get info for all tabs
  onSelectRelation(option, i): void {
    this.AccountApi.addStdRelation(this.Account.id, option.id).subscribe();

  }

  getLogs(): void {
    this.CompanyApi.getLogger(this.Account.companyId,
      { order: 'id DESC' }).subscribe((logger: Logger[]) => {
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
          )));
      });
  }

  findWebsiteTrackerByIP(Websitetracker): void {
    this.RelationsApi.getWebsitetracker(this.option.id, {
      where: { IP: Websitetracker.IP },
      order: 'date DESC', limit: 20
    }).subscribe(filteredList => {
      this.WebsitetrackerFullList = filteredList;
    })
  }

  markisp(i): void {
    this.Websitetracker[i].isp = true
    this.RelationsApi.updateByIdWebsitetracker(this.option.id, this.Websitetracker[i].id, this.Websitetracker[i])
      .subscribe(res => this.getWebsiteTracker());
    // this.WebsitetrackerApi.update({where: {IP: this.Websitetracker[i].IP}}, {isp: true})
    // .subscribe(res => this.getWebsiteTracker());
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

  public getAnalyticsAccounts(): void {
    this.RelationsApi.getGoogleanalytics(this.option.id)
      .subscribe((GoogleanalyticsModel: Googleanalytics[]) => {
        this.GoogleanalyticsModel = GoogleanalyticsModel
      });
  }

  public countChannels() {
    this.barChartDataChannel = [];
    this.barChartDataChannelLabels.forEach(typeCh => {
      this.RelationsApi.countChannels(this.option.id, { 'type': typeCh }).subscribe(res => {
        this.barChartDataChannel.push({ data: [res.count], labels: typeCh });
      });
    });
    console.log(this.barChartDataChannel)
  }

  public countManagerData() {
    let TotalNumber = [];
    this.CompanyApi.countRelations(this.Account.companyId).subscribe(res => {
      TotalNumber.push({ data: [res.count], labels: 'Relations' }),
        this.CompanyApi.countCalls(this.Account.companyId).subscribe(res => {
          TotalNumber.push({ data: [res.count], labels: 'Calls' }),
            this.barChartManagerData = TotalNumber;
        });
    });
  }


  public countRelations() {
    let TotalNumber = [];
    // use count include?? open issue for loopback --> create hook instead to package as one call or move to automation
    this.CompanyApi.countPublications(this.Account.companyId).subscribe(res => {
      TotalNumber.push(res.count),
        this.RelationsApi.countMarketingplannerevents(this.Account.standardrelation).subscribe(res => {
          TotalNumber.push(res.count),
            this.RelationsApi.countFiles(this.Account.standardrelation, { 'type': 'video' }).subscribe(res => {
              TotalNumber.push(res.count),
                this.RelationsApi.countFiles(this.Account.standardrelation, { 'type': 'image' }).subscribe(res => {
                  TotalNumber.push(res.count)
                })
            })
          //this.getNumbers(TotalNumber);
          this.barChartData = TotalNumber
          //this.detectchange();
        }, error => console.log('Could not load Marketing', error));
    });

  }

  public getAnalytics() {
    this.googleanalyticsreturn = [];
    let Googleanalyticsnumbers = [];
    let Googleanalyticsnames = [];
    this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, this.analytics_startdate,
      this.analytics_enddate, this.analytics_dimensions, this.analytics_metrics)
      .subscribe((data) => {

        data.rows.forEach((item, index) => {
          Googleanalyticsnumbers.push(item[1]);
          const analyticsobject = { 'name': item[0], 'value': item[1] }
          this.googleanalyticsreturn.push(analyticsobject);
          Googleanalyticsnames.push(item[0]);
        }),
          //console.log(this.googleanalyticsreturn);
          // get array even and uneven split
          //this.getDoughnutNumbers(Googleanalyticsnames, Googleanalyticsnumbers); // Doughnut
          this.doughnutChartLabels = [];
        this.doughnutChartLabels = Googleanalyticsnames;
        this.doughnutChartData = [];
        this.doughnutChartData = Googleanalyticsnumbers;
        // import to update for ngx charts
        this.googleanalyticsreturn = [...this.googleanalyticsreturn];
      }, error => console.log('Could not load Analytics', error));
  }

  public getAnalytics3() {
    let Googleanalyticsnumbers3 = [];
    let Googleanalyticsnames3 = [];
    this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids3, this.analytics_startdate3,
      this.analytics_enddate3, this.analytics_dimensions3, this.analytics_metrics3)
      .subscribe((data) => {
        const googleanalyticsreturn = data
        googleanalyticsreturn.rows.forEach((item, index) => {
          Googleanalyticsnumbers3.push(item[1]);
          Googleanalyticsnames3.push(item[0]);
        }),
          // get array even and uneven split
          //this.get1Numbers(Googleanalyticsnames3, Googleanalyticsnumbers3);
          this.barChart2Labels = Googleanalyticsnames3;
        this.barChart2Data = Googleanalyticsnumbers3;
      }, error => console.log('Could not load Analytics', error));
  }

  public getAnalyticsLine() {
    this.lineChartLabels = [];
    this.lineChartData = [];
    this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids2, this.analytics_startdate2,
      this.analytics_enddate2, this.analytics_dimensions2, this.analytics_metrics2)
      .subscribe(data => {
        data.rows.forEach((item) => {
          const txt2 = item[0].slice(0, 4) + '-' + item[0].slice(4, 12);
          const txt3 = txt2.slice(0, 7) + '-' + txt2.slice(7, 13);
          this.lineChartData.push(item[1]);
          this.lineChartLabels.push(txt3);
        });
      }, error => console.log('Could not load Analytics', error));
  }

  getMailStats(domain?): void {
    let SDomain;
    if (domain) {
      SDomain = domain
      //console.log(domain)
    } else {
      SDomain = this.option.domain
    }
    this.mailstatsspinner = true;
    //  set d/m/h 
    let data;
    if (this.mailStatsTimeSelected == undefined) {
      data = '7d';
    } else { data = this.mailStatsTimeSelected.value }
    this.MailingApi.getstats(this.Account.companyId, SDomain, data).subscribe(res => {
      const mailingstats = res.res;
      console.log('mailingstats:', mailingstats)

      // set accepted mails
      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.accepted.outgoing);
      });

      // set accepted labels/Dates
      mailingstats[0].stats.forEach(element => {
        const time = element.time.slice(0, 16)
        this.MailChartLabels = time
      });

      // set accepted mails
      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.delivered.total); // smtp/html
      });


      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.opened.total);
      });


      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.clicked.total);
      });

      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.unsubscribed.total);
      });


      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.complained.total);
      });


      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.stored.total);
      });


      mailingstats[0].stats.forEach(element => {
        this.MailChartData.push(element.failed.permanent.total);
      });

      // this.getMailChart(acceptedNumbers, deliveredNumbers, openedNumbers, clickedNumbers, unsubscribedNumbers, complainedNumbers,
      //   storedNumbers, failedNumbers, acceptedLabel)
    }
    );
  }

  searchGoQuick(value): void {
    let searchterm = value.trim();
    this.CompanyApi.getRelations(this.Account.companyId,
      {
        where:
        {
          or: [{ "relationname": { "regexp": searchterm + '/i' } },
          { "address1": { "regexp": searchterm + '/i' } },
          { "city": { "regexp": searchterm + '/i' } }
          ]
        },
        order: 'relationname ASC'
      })
      .subscribe((Relations: Relations[]) => {
        this.filteredRelations = Relations;
        //console.log(this.filteredRelations)
      });
  }

  //display name in searchbox
  displayFnRelation(relation?: Relations): string | undefined {
    return relation ? relation.relationname : undefined;
  }


  //  events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  //  events
  public chart2Clicked(e: any): void {
    console.log(e);
  }

  public chart2Hovered(e: any): void {
    console.log(e);
  }

  //  events
  public MailChartClicked(e: any): void {
    console.log(e);
  }

  public MailChartHovered(e: any): void {
    console.log(e);
  }

  //  events
  public chartClicked2(e: any): void {
    console.log(e);
  }

  public chartHovered2(e: any): void {
    console.log(e);
  }

  //  events
  public chart3Clicked(e: any): void {
    console.log(e);
  }

  public chart3Hovered(e: any): void {
    console.log(e);
  }


}