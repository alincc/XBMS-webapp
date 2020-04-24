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
import { ChartType, ChartOptions } from 'chart.js';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogGetname } from './../dialogsservice/dialog.getname';
import { GoogleMapService } from '../shared/googlemapservice/googlemap.service';


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
  colorscheme: Array<Object>;
  chartsize: string;
  data_object: Array<Object>;
  color: string;
  showlabels: boolean;
  showlegend: boolean;
}


export function createDataObject(type, startdate, enddate, charttype, dimension): {
  type: string;
  startdate: Date;
  enddate: Date;
  dimension: string;
  data_set: Array<Chart>;
  data_labels: Array<Object>;
  charttype: string;
  colorscheme: Array<Object>;
  chartsize: string;
  data_object: Array<Object>;
  color: string;
  showlabels: boolean;
  showlegend: boolean;
  currentlabel: string;
} {
  let newDataObject = {
    type: type,
    startdate: startdate,
    enddate: enddate,
    dimension: dimension,
    data_set: [],
    data_labels: [],
    charttype: charttype,
    colorscheme: undefined,
    chartsize: '47%',
    data_object: [],
    color: 'auto',
    showlabels: true,
    showlegend: true,
    currentlabel: ''
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
  private analytics_metrics = [{ expression: 'ga:users' }];


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

  public minDate = new Date(2017, 0, 1);
  public maxDate = Date.now()

  mailStatsTime = [
    { value: '12m', viewValue: 'Year/months' },
    { value: '365d', viewValue: 'Year/days' },
    { value: '30d', viewValue: 'Month' },
    { value: '7d', viewValue: 'Week' },
    { value: '1d', viewValue: 'Day' }
  ];


  // chart 1 Activities
  public chartOptions: ChartOptions = {
    //scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
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


  public greycolors = {
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#23549D',
    pointHoverBackgroundColor: '#23549D',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  };

  public bluecolors = {
    backgroundColor: 'rgba(50,70,168,0.2)',
    borderColor: 'rgba(50,70,168,1)',
    pointBackgroundColor: 'rgba(50,70,168,1)',
    pointBorderColor: '#23549D',
    pointHoverBackgroundColor: '#23549D',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  };

  public redcolors = {
    backgroundColor: 'rgba(242,7,46,0.3)',
    borderColor: 'rgba(242,7,46,1)',
    pointBackgroundColor: 'rgba(242,7,46,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
  public greencolors = {
    backgroundColor: 'rgba(43,255,0,0.3)',
    borderColor: 'rgba(43,255,0,1)',
    pointBackgroundColor: 'rgba(43,255,0,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
  public pinkcolors = {
    backgroundColor: 'rgba(255,0,221,0.3)',
    borderColor: 'rgba(255,0,221,1)',
    pointBackgroundColor: 'rgba(255,0,221,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
  public yellowcolors = {
    backgroundColor: 'rgba(252, 211, 3,0.3)',
    borderColor: 'rgba(252, 211, 3,1)',
    pointBackgroundColor: 'rgba(252, 211, 3,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }

  public azurecolors = {
    backgroundColor: 'rgba(66, 245, 224,0.3)',
    borderColor: 'rgba(66, 245, 224,1)',
    pointBackgroundColor: 'rgba(66, 245, 224,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }

  public purplecolors = {
    backgroundColor: 'rgba(173, 66, 245,0.3)',
    borderColor: 'rgba(173, 66, 245,1)',
    pointBackgroundColor: 'rgba(173, 66, 245,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }

  public darkbluecolors = {
    backgroundColor: 'rgba(25, 26, 71,0.3)',
    borderColor: 'rgba(25, 26, 71,1)',
    pointBackgroundColor: 'rgba(25, 26, 71,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }

  public mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "hue": "#ff4400"
        },
        {
          "saturation": -100
        },
        {
          "lightness": -2
        },
        {
          "gamma": 0.72
        }
      ]
    }];

  public selectcolor = '';


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


  public barChartChannelLabels: string[] = ['Social Messages'];
  public Marketingplannerevents: Marketingplannerevents[];
  public changenow = true;
  public latitude = 52.374828;
  public longitude = 7.005030;
  public zoom = 2;
  public editmode = false;
  public stdDash = 0;
  public mapLabelName: string;

  constructor(
    public googleMapService: GoogleMapService,
    public dialog: MatDialog,
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
    public snackBar: MatSnackBar
  ) {

  }

  public speedDialFabButtons = [
    {
      icon: 'web',
      tooltip: 'Add Website leads'
    },
    {
      icon: 'web',
      tooltip: 'Add new Website data'
    },
    {
      icon: 'show_chart',
      tooltip: 'Add google analytics'
    },
    {
      icon: 'mail',
      tooltip: 'Add mailing data'
    },
    {
      icon: 'contact_mail',
      tooltip: 'Add CRM data'
    },
    {
      icon: 'chat',
      tooltip: 'Add channel data'
    },
    {
      icon: 'toc',
      tooltip: 'Add follow up list'
    },
    {
      icon: 'perm_media',
      tooltip: 'Add publication data'
    },
    {
      icon: 'schedule',
      tooltip: 'Add scheduled events'
    },
    {
      icon: 'save',
      tooltip: 'Save as new Dashboard'
    },
    {
      icon: 'save',
      tooltip: 'Save current Dashboard'
    },
    {
      icon: 'delete',
      tooltip: 'Delete current Dashboard'
    },
    {
      icon: 'done_outline',
      tooltip: 'Set as Standard Dashboard'
    },
    {
      icon: 'refresh',
      tooltip: 'Reload'
    }
  ];

  onSpeedDialFabClicked(btn) {
    // console.log(btn.tooltip);
    if (btn.tooltip === 'Add Website leads') { this.addNewWebsiteData() }
    if (btn.tooltip === 'Add new Website data') { this.addNewWebsiteLeads() }
    if (btn.tooltip === 'Add google analytics') { this.addNewAnalyticsData() }
    if (btn.tooltip === 'Add mailing data') { this.addNewMailingData() }
    if (btn.tooltip === 'Add CRM data') { this.addNewCRMData() }
    if (btn.tooltip === 'Add channel data') { this.addNewChannelData() }
    if (btn.tooltip === 'Add follow up list') { this.addFollowUpData() }
    if (btn.tooltip === 'Add publication data') { this.addPublicationData() }
    if (btn.tooltip === 'Add scheduled events') { this.addScheduledData() }
    if (btn.tooltip === 'Save as new Dashboard') { this.saveDashboard() }
    if (btn.tooltip === 'Save current Dashboard') { this.saveCurrentDashboard() }
    if (btn.tooltip === 'Delete current Dashboard') { this.deleteTemplate() }
    if (btn.tooltip === 'Set as Standard Dashboard') { this.setStandardDashboard(this.stdDash) }
    if (btn.tooltip === 'Reload') { this.detectchange() }
  }

  moveSectionUp(i1): void {
    if (i1 !== 0) {
      const tmp = this.dashboardsetup[i1];
      this.dashboardsetup[i1] = this.dashboardsetup[i1 - 1];
      this.dashboardsetup[i1 - 1] = tmp;
    }
  }

  moveSectionDown(i1): void {
    if (i1 !== this.dashboardsetup.length - 1) {
      const tmp = this.dashboardsetup[i1];
      this.dashboardsetup[i1] = this.dashboardsetup[i1 + 1];
      this.dashboardsetup[i1 + 1] = tmp;
    }
  }

  editmodeChange() {
    if (this.editmode) { this.editmode = false; this.detectchange(); } else {
      this.editmode = true;
    }

  }

  addNewWebsiteData() {
    let newData = createDataObject('Website data', '30daysAgo', 'today', 'map', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addNewWebsiteLeads() {
    let newData = createDataObject('Website leads', '30daysAgo', 'today', 'table', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addNewAnalyticsData() {
    let newData = createDataObject('Google Analytics', '30daysAgo', 'today', 'line', 'ga:date');
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addNewMailingData() {
    let newData = createDataObject('Mailing statistics', '30daysAgo', 'today', 'line', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addNewCRMData() {
    let newData = createDataObject('CRM statistics', '1-1-2018', new Date(), 'bar', 'relations-calls');
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addNewChannelData() {
    let newData = createDataObject('Channels', '30daysAgo', 'today', 'bar', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addFollowUpData() {
    let newData = createDataObject('Followups', '30daysAgo', 'today', 'table', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addPublicationData() {
    let newData = createDataObject('Publications', '30daysAgo', 'today', 'bar', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  addScheduledData() {
    let newData = createDataObject('Scheduled', '30daysAgo', 'today', 'table', undefined);
    this.dashboardsetup.push(newData);
    this.detectchange();
  }

  newDashboard() {
    this.dashboardsetup = [];
    this.detectchange();
  }


  deleteTemplate() {
    this.dashboardsetup = [];
    this.Account.dashboards.splice(this.Account.stddashboard, 1);
    this.AccountApi.addDashboard(this.Account.id, this.Account.dashboards).subscribe();
    this.detectchange();
  }

  saveCurrentDashboard() {
    let newDash = this.dashboardsetup;
    newDash.forEach((element) => {
      element.data_labels = [];
      element.colorscheme = [];
      element.data_object = [];
      element.data_labels = [];
      element.data_set = [];
    });

    this.Account.dashboards[this.Account.stddashboard].dashboard = newDash;
    this.AccountApi.addDashboard(this.Account.id, this.Account.dashboards).subscribe(() => {
      this.detectchange();
      this.snackBar.open('Dashboard saved', null, {
        duration: 3000,
      });
    });
  }

  saveDashboard() {
    const dialogRef = this.dialog.open(DialogGetname, {
      width: '250px',
      data: { name: 'Dashboard1' }
    });

    dialogRef.afterClosed().subscribe(result => {
      let name = result;
      if (name) {
        let newDash = this.dashboardsetup;

        newDash.forEach((element) => {
          element.data_labels = [];
          element.colorscheme = [];
          element.data_object = [];
          element.data_labels = [];
          element.data_set = [];
        });

        this.Account.dashboards.push({ name: name, dashboard: newDash });
        this.AccountApi.addDashboard(this.Account.id, this.Account.dashboards).subscribe(() => {
          this.detectchange();
          this.snackBar.open('Dashboard saved', null, {
            duration: 3000,
          });

        });
      }
    });
  }

  mouseOverMapMarker(e, i) {
    //console.log(e)
    this.dashboardsetup[i].currentlabel = e;
    //this.mapLabelName = e;
  }

  setStandardDashboard(nr) {
    this.AccountApi.addStdDashboard(this.Account.id, nr).subscribe();
  }

  loadDashboard(i) {
    this.stdDash = i.value;
    //console.log(i.value);
    this.dashboardsetup = this.Account.dashboards[i.value].dashboard;
    //this.setStandardDashboard(i.value);
    this.detectchange();
  }

  async detectchange() {
    for (let dashitem of this.dashboardsetup) {
      let dashitem1 = await this.buildDashboard(dashitem);
      let dashitem2 = await this.setColor(dashitem1);
      dashitem = dashitem2;
    }

    this.changenow = false;
    setTimeout(() => {
      console.log('detect change', this.dashboardsetup)
      this.changenow = true
    }, 10);
  }

  ngOnInit(): void {
    if (this.AccountApi.isAuthenticated() === false) { this.router.navigate(['login']) }
    if (this.AccountApi.getCurrentToken() === undefined) { this.router.navigate(['login']) }
    // this.setFilter();
    this.getCurrentUserInfo();

  }

  async setColor(dashitem) {
    return new Promise(async (resolve, reject) => {
      dashitem.colorscheme = [];
      let colorscheme;

      switch (dashitem.color) {
        case 'grey': {
          colorscheme = this.greycolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'blue': {
          colorscheme = this.bluecolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'red': {
          colorscheme = this.redcolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'green': {
          colorscheme = this.greencolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'pink': {
          colorscheme = this.pinkcolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'yellow': {
          colorscheme = this.yellowcolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'darkblue': {
          colorscheme = this.darkbluecolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'azure': {
          colorscheme = this.azurecolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'purple': {
          colorscheme = this.purplecolors;
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        case 'auto': {
          colorscheme = 'auto';
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
          break
        }
        default: {
          colorscheme = 'auto'
          console.error('Color not found');
          let dashitem1 = this.setColorScheme(dashitem, colorscheme);
          resolve(dashitem1);
        }
      }
    });
  }

  async setColorScheme(dashitem: DataObject, colorscheme) {
    return new Promise(async (resolve, reject) => {
      let count = dashitem.data_set.length
      let colorarray = [this.greycolors, this.bluecolors, this.redcolors, this.greencolors, this.pinkcolors,
      this.yellowcolors, this.azurecolors, this.purplecolors, this.darkbluecolors];
      for (let i = 0; i < count; i++) {
        if (colorscheme === 'auto') {
          let randomnum = i;
          if (i > 8) {
            randomnum = this.RandomInt(0, 5);
          }

          let newcolorscheme = colorarray[randomnum];
          dashitem.colorscheme.push(newcolorscheme);
        } else {
          dashitem.colorscheme.push(colorscheme);
        }
      }
      resolve(dashitem);
    });
  }

  RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let newset = Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    return newset;
  }

  //  get currentuserinfo for api
  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account;
      if (this.Account.stddashboard !== undefined && this.Account.stddashboard >= this.Account.dashboards.length - 1) {
        this.dashboardsetup = this.Account.dashboards[this.Account.stddashboard].dashboard;
      }

      this.CompanyApi.getRelations(this.Account.companyId,
        { fields: { id: true, relationname: true, domain: true } }
      )
        .subscribe((relations: Relations[]) => {
          this.Relations = relations
          if (this.Account.standardrelation !== undefined) {
            this.RelationsApi.findById(this.Account.standardrelation)
              .subscribe((rel: Relations) => {
                //console.log(rel);
                this.onSelectRelation(rel, null);
                this.getAnalyticsAccounts();

              })
          }
          if (this.Account.standardGa) {
            this.GoogleanalyticsApi.findById(this.Account.standardGa)
              .subscribe((googleanalytics: Googleanalytics) => {
                this.selectedanalytics = googleanalytics;
              })
          }
          if (!this.Account.standardGa) {
            this.selectedanalytics = undefined;
          }
          //setTimeout(() => {this.detectchange()}, 1000) // use delay hickup some where so it does not recognize array

        });
    })
  }

  getAddress(address, graph) {
    console.log(address.label);
    this.googleMapService.getLatLan(address.label)
      .subscribe((result) => {
        console.log(result)
        address.lat = result.lat();
        address.lng = result.lng();
      });
  }

  // this.selectedanalytics.id, this.analytics_ids2, this.analytics_startdate2 this.analytics_enddate2, this.analytics_dimensions2, this.analytics_metrics2
  getAnalyticsData(startdate, enddate, dimension) {
    return new Promise(async (resolve, reject) => {

      let filters = undefined;
      //  let filters: [{
      //   dimension_name: filters,
      //   operator: "EXACT",
      //   expressions: ["Firefox"] }];

      let startdateset = startdate;
      let enddateset = enddate;
      if (startdate instanceof Date) {
        startdateset = moment(startdate).utc().format('YYYY-MM-DD');
      }
      if (enddate instanceof Date) {
        enddateset = moment(enddate).utc().format('YYYY-MM-DD');
      }
      //console.log(startdateset, enddateset);
      this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, startdateset,
        enddateset, dimension, this.analytics_metrics)
        .subscribe(data => {
          resolve(data);
        }, error => console.error(error));
    });
  }

  async setChartDateData(resdata, graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      //console.log(resdata);
      const newset: Chart = { data: [], label: '' };
      graph.data_labels = [];
      let rows = resdata[0].data.rows;
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i]
        const dateset = item.dimensions[0];
        const txt2 = dateset.slice(0, 4) + '-' + dateset.slice(4, 12);
        const txt3 = txt2.slice(0, 7) + '-' + txt2.slice(7, 13);
        let date = new Date(txt3);
        let datestring = date.toDateString();
        graph.data_labels.push(datestring);
        newset.data.push(item.metrics[0].values[0])
        graph.data_object.push({ Date: datestring, Visitors: item.metrics[0].values[0] })
      }

      graph.data_set = [newset]
      resolve(graph);
    });
  }


  async setMapAnalytics(resdata, graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      graph.data_set = [];
      graph.data_labels = [];
      graph.data_object = [];
      let rows = resdata[0].data.rows;
      //console.log(rows);
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        let nr = parseInt(item.metrics[0].values[0], 10);
        const newset: any = { data: [nr], lat: item.dimensions[0], lon: item.dimensions[1] }
        graph.data_object.push(newset)
        graph.data_set.push(newset);
      };
      resolve(graph);
    });
  }

  async setChartAnalytics(resdata, graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      graph.data_set = [];
      graph.data_labels = [];
      graph.data_object = [];
      let rows = resdata[0].data.rows;
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        let nr = parseInt(item.metrics[0].values[0], 10);
        const newset: Chart = { data: [nr], label: item.dimensions[0] }
        graph.data_object.push({ Medium: item.dimensions[0], Visitors: nr })
      };
      resolve(graph);
    });
  }

  async setChartType(resdata, graph: DataObject, label) {
    return new Promise(async (resolve, reject) => {
      if (resdata.length > 0) {
        graph.data_set = [];
        graph.data_labels = [];
        graph.data_object = [];
        let labels = Object.keys(resdata[0]);
        const newset: Chart = { data: [resdata.length], label: label }
        graph.data_labels = label;
        graph.data_set.push(newset);
        graph.data_object = resdata;
        resolve(graph);
      } else {
        resolve(graph)
      }

    });
  }


  async buildDashboard(dashitem) {
    return new Promise(async (resolve, reject) => {
      dashitem.data_set = [];
      dashitem.data_labels = [];
      dashitem.data_object = [];

      switch (dashitem.type) {
        case 'Google Analytics': {
          if (this.selectedanalytics) {
            // set correct dimension format, needed here as dimnsion var can contain more then one
            let dimensions = [];
            if (dashitem.charttype === 'map') {
              dimensions = [{ name: 'ga:latitude' }, { name: 'ga:longitude' }]
            } else {
              dimensions = [{ name: dashitem.dimension }]
            }
            let resdata: any = await this.getAnalyticsData(dashitem.startdate, dashitem.enddate, dimensions);
            let dashitem1;
            if (dashitem.charttype === 'map') {
              dashitem1 = await this.setMapAnalytics(resdata, dashitem);
            } else if (dashitem.dimension === 'ga:date' && dashitem.charttype !== 'map') {
              dashitem1 = await this.setChartDateData(resdata, dashitem);
            } else {
              dashitem1 = await this.setChartAnalytics(resdata, dashitem);
            }
            resolve(dashitem1);
          }
          break
        }
        case 'Followups': {
          let resdata = await this.getFollowups();
          let dashitem1 = await this.setChartType(resdata, dashitem, ['Follow up']);
          resolve(dashitem1);
          break
        }
        case 'Mailing statistics': {
          let dashitem1 = await this.getMailStats(dashitem);
          resolve(dashitem1);
          break
        }
        case 'Publications': {
          let dashitem1: any = await this.countPublications(dashitem);
          //dashitem1.data_labels = ['Publications', 'Mailings', 'Videos', 'Images'];
          //let dashitem1 = await this.setChartType(resdata, dashitem, ['Publications', 'Mailings', 'Videos', 'Images']);
          resolve(dashitem1);
          break
        }
        case 'CRM statistics': {
          let resdata;
          let labels = ['CRM data'];
          let dashitem1;
          if (dashitem.dimension === 'calls-date') {
            resdata = await this.countManagerData(dashitem);
            dashitem1 = await this.setChartType(resdata, dashitem, labels);
            dashitem1.data_set = resdata;
          }
          if (dashitem.dimension === 'relations-status') {
            //let labels = 
            resdata = await this.relationsByStatus(dashitem);
            dashitem1 = await this.setChartType(resdata, dashitem, labels);
            dashitem1.data_set = resdata;
          }
          if (dashitem.dimension === 'relations-calls') {
            resdata = await this.callsByDate(dashitem);
            dashitem1 = resdata;
            //await this.setChartDateData(resdata, dashitem);
            //dashitem1 = await this.setChartType(resdata, dashitem, labels);
          }

         
          resolve(dashitem1);
          break
        }
        case 'Channels': {
          let dashitem1 = await this.countChannels(dashitem);
          resolve(dashitem1);
          break
        }
        case 'Website data': {
          let resdata = await this.getWebsiteTracker();
          let dashitem1: any = await this.setChartType(resdata, dashitem, ['Website Visitors']);
          dashitem.data_object = resdata;
          resolve(dashitem1);
          break
        }

        case 'Website leads': {
          let resdata = await this.getWebsiteLeadsTracker();
          let dashitem1: any = await this.setChartType(resdata, dashitem, ['Website Visitors']);
          dashitem.data_object = resdata;
          resolve(dashitem1);
          break
        }

        case 'Scheduled': {
          let resdata = await this.getAdsMailing(dashitem);
          let dashitem1: any = await this.setChartType(resdata, dashitem, ['marketingplannereventsIds', 'subject', 'from', 'title', 'date']);
          resolve(dashitem1);
          break
        }

        default: {
          console.error('no chart type or incorrect value');
          resolve(dashitem);
        }
      }

    });

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
    this.option = option;
    this.detectchange();
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

  getAdsMailing(graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      //  get the planned mailings looks shitty because the mailings of are
      //  part of the marketingplannerevents
      //  and are not directly related to the Relation.id itself
      //  used include to get the related mailings and then run foreach on the events and a foreach for all the mailings
      let Mailing = [];
      this.RelationsApi.getMarketingplannerevents(this.Account.standardrelation,
        {
          where: { scheduled: true },
          //where: { scheduled: true, mailing: { "neq": null }},

          include: {
            relation: 'mailing',
            scope:
            {
              where: { and: [{ send: false }, { scheduled: true }, { done: false }] },
              // where: {send: false}
              // fields: {
              //   title: true, to: true, from: true, subject: true, date: true, id: true
              // }
            },
          },
          order: 'date ASC',
          fields: {
            //title: true, to: true, from: true, subject: true, date: true, id: true
          }
        })
        .subscribe((Marketingplannerevents: Marketingplannerevents[]) => {
          //console.log(Marketingplannerevents);
          Marketingplannerevents.forEach((item) => {
            const mailingsub = item.mailing;
            mailingsub.forEach((itemMailing) => {
              itemMailing.marketingplannereventsIds = item.name;
              console.log(item);

              Mailing.push(itemMailing)
            })
          })
          //console.log(Mailing);
          //  objects are being sorted
          Mailing = Mailing.sort((n1, n2) => {
            return this.naturalCompare(n1.date, n2.date)
          });
          resolve(Mailing);
        });
    });
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

  async getWebsiteTracker() {
    return new Promise(async (resolve, reject) => {
      this.Websitetracker = [];
      //  limit is total entries, order is is important as first entry is in array ES6 move to server.
      this.RelationsApi.getWebsitetracker(this.option.id, {
        order: 'date DESC', limit: 100
      })
        .subscribe((websitetracker: Websitetracker[]) => {
          websitetracker = websitetracker.filter((WebsitetrackerFil, index, self) =>
            index === self.findIndex((t) => (
              t.IP === WebsitetrackerFil.IP
            )));
          resolve(websitetracker)
        });
    });
  }

  async getWebsiteLeadsTracker() {
    return new Promise(async (resolve, reject) => {
      this.Websitetracker = [];
      //  limit is total entries, order is is important as first entry is in array ES6 move to server.
      this.RelationsApi.getWebsitetracker(this.option.id, {
        where: { isp: false },
        order: 'date DESC', limit: 100
      })
        .subscribe((websitetracker: Websitetracker[]) => {
          websitetracker = websitetracker.filter((WebsitetrackerFil, index, self) =>
            index === self.findIndex((t) => (
              t.IP === WebsitetrackerFil.IP
            )));
          resolve(websitetracker)
        });
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


  getFollowups() {
    return new Promise(async (resolve, reject) => {
      this.CompanyApi.getCalls(
        this.Account.companyId,
        {
          where: { and: [{ followup: true }, { followupdone: false }] },
          include: {
            relation: 'relations',
            scope: { fields: 'relationname' }
          },
          order: 'callbackdate ASC',
          fields: {
            content: false, notes: false, relationsId: false,
            id: false, tasks: false, companyId: false, accountId: false
          }
        })
        .subscribe((Calls: Calls[]) => { resolve(Calls) });
    });
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

  public countChannels(graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      let barChartDataChannel = [];

      for (let i = 0; i < this.barChartDataChannelLabels.length; i++) {
        const typeCh = this.barChartDataChannelLabels[i];
        const res: any = await this.getChannel(typeCh);
        barChartDataChannel.push({ data: [res.count], label: typeCh });
      }
      graph.data_set = barChartDataChannel;
      graph.data_object = barChartDataChannel;
      resolve(graph);
    });
  }
  public async getChannel(typeCh) {
    return new Promise(async (resolve, reject) => {
      this.RelationsApi.countChannels(this.option.id, { 'type': typeCh }).subscribe(res => {
        resolve(res);
      });
    });
  };


  public async countManagerData(graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      let TotalNumber = [];
      this.CompanyApi.countRelations(this.Account.companyId).subscribe(res => {
        TotalNumber.push({ data: [res.count], label: 'Relations' }),
          this.CompanyApi.countCalls(this.Account.companyId).subscribe(res => {
            TotalNumber.push({ data: [res.count], label: 'Calls' }),
              resolve(TotalNumber);
          });
      });
    });
  }

  relationsByStatus(dashitem) {
    return new Promise(async (resolve, reject) => {
      let TotalNumber = [];
      this.CompanyApi.getRelations(this.Account.companyId,
        { fields: { status: true, type: true, id: true } }
      ).subscribe((relations: Relations[]) => {
        let status = relations.map(item => item.status).filter((value, index, self) => self.indexOf(value) === index);
        let type = relations.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index);
        status.forEach(elvalue => {
          const statuscount = relations.filter((obj) => obj.status === elvalue).length;
          TotalNumber.push({ data: [statuscount], label: elvalue });
        });
        type.forEach(elvalue => {
          const typecount = relations.filter((obj) => obj.type === elvalue).length;
          TotalNumber.push({ data: [typecount], label: elvalue });
        });
        resolve(TotalNumber);
      });
    });
  }

  async callsByDate(graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      var a = moment(graph.startdate);
      var b = moment(graph.enddate);
      const newset: Chart = { data: [], label: '' };
      console.log(a, b)
      let TotalNumber = [];
      this.CompanyApi.getRelations(this.Account.companyId,
        {
          fields: { status: true, type: true, id: true },
          include: {
            relation: 'calls',
            scope: {
              fields: { date: true, id: true },
              // where: {
              //   date_field: {
              //     gte: a,
              //     lt: b
              //   }
              // }
            }
          }
        }
      ).subscribe((relations: Relations[]) => {
        let callsdatesset = [];
        relations.forEach(rel => {
          callsdatesset.push(rel.calls)
        })

        let callsdates = [].concat.apply([], callsdatesset);
        console.log(callsdates);
        // If you want an exclusive end date (half-open interval)
        for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
          let date = m.format('LL');
          let callscount = 0;
          for (let i = 0; i < callsdates.length; i++){
            let date2 = moment(callsdates[i].date).format('LL');
            if (date === date2){
              ++callscount;
            }
          }
          //const callscount = callsdates.filter((obj) => {moment(obj.date).format('LL') === m.format('LL')}).length;
          graph.data_labels.push(date);
          newset.data.push(callscount)
          graph.data_object.push({ Date: date, Calls: callscount });
        }
        graph.data_set = [newset]
        resolve(graph);

      });
    });
  }

  public async countPublications(graph: DataObject) {
    return new Promise(async (resolve, reject) => {
      let TotalNumber = [];
      // use count include?? open issue for loopback --> create hook instead to package as one call or move to automation
      this.CompanyApi.countPublications(this.Account.companyId).subscribe(res => {
        TotalNumber.push({ data: [res.count], label: 'Publications' }),
          this.RelationsApi.countMarketingplannerevents(this.Account.standardrelation).subscribe(res => {
            TotalNumber.push({ data: [res.count], label: 'Mailings' }),
              this.RelationsApi.countFiles(this.Account.standardrelation, { 'type': 'video' }).subscribe(res => {
                TotalNumber.push({ data: [res.count], label: 'Videos' }),
                  this.RelationsApi.countFiles(this.Account.standardrelation, { 'type': 'image' }).subscribe(res => {
                    TotalNumber.push({ data: [res.count], label: 'Images' });
                    graph.data_set = TotalNumber;
                    graph.data_object = TotalNumber;
                    resolve(graph);
                  })
              })


          }, error => console.log('Could not load Marketing', error));
      });
    });

  }


  async getMailStats(graph1, domain?) {
    return new Promise(async (resolve, reject) => {

      let SDomain;
      if (domain) {
        SDomain = domain
        //console.log(domain)
      } else {
        SDomain = this.option.domain
      }
      //this.mailstatsspinner = true;
      //  set d/m/h
      let data;
      if (this.mailStatsTimeSelected == undefined) {
        data = '7d';
      } else { data = this.mailStatsTimeSelected.value }
      this.MailingApi.getstats(this.Account.companyId, SDomain, data).subscribe(res => {
        const mailingstats = res.res;
        //console.log('mailingstats:', mailingstats)
        let dataset = [];
        let delivered = { data: [], label: 'Delivered' };
        let opened = { data: [], label: 'Opened' };
        let clicked = { data: [], label: 'Clicked' };
        let unsubscribed = { data: [], label: 'Unsubscribed' };
        let complained = { data: [], label: 'Complained' };
        let stored = { data: [], label: 'Stored' };
        let failed = { data: [], label: 'Failed' };
        let labelset = [];
        // set accepted mails
        for (let i = 0; i < mailingstats[0].stats.length; i++) {
          const element = mailingstats[0].stats[i];
          dataset.push(element.accepted.outgoing);
          const time = element.time.slice(0, 16)
          labelset.push(time);
          delivered.data.push(element.delivered.total); // smtp/html
          opened.data.push(element.opened.total);
          clicked.data.push(element.clicked.total);
          unsubscribed.data.push(element.unsubscribed.total);
          complained.data.push(element.complained.total);
          stored.data.push(element.stored.total);
          failed.data.push(element.failed.permanent.total);

        };
        let graph = graph1;
        graph.data_set = [];
        graph.data_set.push(delivered);
        graph.data_set.push(opened);
        graph.data_set.push(clicked);
        graph.data_set.push(unsubscribed);
        graph.data_set.push(complained);
        graph.data_set.push(stored);
        graph.data_set.push(failed);
        graph.data_labels = labelset;

        graph.data_object = [
          { data: [delivered.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Delivered' },
          { data: [opened.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Opened' },
          { data: [clicked.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Clicked' },
          { data: [unsubscribed.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Unsubscribed' },
          { data: [complained.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Complained' },
          { data: [stored.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Stored' },
          { data: [failed.data.reduce(function (a, b) { return a + b; }, 0)], label: 'Failed' }
        ];
        resolve(graph)
      });
    });
  }

  deleteDashItem(i) {
    this.dashboardsetup.splice(i, 1)
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
    //console.log(e);
  }

  public chartHovered(e: any): void {
    //console.log(e);
  }



}