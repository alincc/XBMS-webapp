import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PublicationsApi,
  Publications,
  BASE_URL,
  API_VERSION,
  Relations,
  RelationsApi,
  Account,
  AccountApi,
  Company,
  CompanyApi,
  Mailing,
  MailingApi,
  Marketingplanner,
  MarketingplannerApi,
  Marketingplannerevents,
  MarketingplannereventsApi,
  Channels,
  ChannelsApi
} from '../shared/';
import { DialogsService } from './../dialogsservice/dialogs.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map, startWith } from "rxjs/operators";
import { CalendarEvent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';
import { green } from 'ansi-colors';
import { ColorFormats } from 'ngx-color-picker/dist/lib/formats';
import { ColorPickerService } from 'ngx-color-picker';
import { setHours, setMinutes } from 'date-fns';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';



@Component({
  selector: 'app-marketingplanner',
  templateUrl: './marketingplanner.component.html',
  styleUrls: ['./marketingplanner.component.scss']
})
export class MarketingplannerComponent implements OnInit {


  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];


  activeDayIsOpen: boolean = true;

  public Channels: Channels[];
  public marketingplan; //create models
  public Publications: Publications[];
  public Relations: Relations[];
  public Account: Account = new Account();
  public Company: Company[];
  public Marketingplanner: Marketingplanner[];
  public Marketingplannerevents: Marketingplannerevents[];
  public Newmarketingplanner: Marketingplanner = new Marketingplanner();
  public Newmarketingplannerevent: Marketingplannerevents = new Marketingplannerevents();
  public selectedmarketingplanner: Marketingplanner;
  public selectedmarketingplannerevent: Marketingplannerevents;

  public options = [];
  public option: Relations = new Relations();
  panelOpenState: boolean = false; //delete?
  hideToggle: boolean = true; //delete
  public time: string;
  public date: string;
  public convertdate: string;
  public listviewxsshow = false;
  events: CalendarEvent[] = [];
  filteredOptions: Observable<string[]>;
  events$: Observable<Array<CalendarEvent<{ mailing: Mailing }>>>;

  
  constructor(
    public router: Router,
    public ChannelsApi: ChannelsApi,
    public CompanyApi: CompanyApi,
    public AccountApi: AccountApi,
    public RelationsApi: RelationsApi,
    public dialogsService: DialogsService,
    public PublicationsApi: PublicationsApi,
    public MarketingplannerApi: MarketingplannerApi
  ) {
    this.getCurrentUserInfo();
  }


  myControl: FormControl = new FormControl();

  ngOnInit() {
    if (this.AccountApi.isAuthenticated() == false) { this.router.navigate(['login']) }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        //map(options => options && typeof options === 'object' ? options.relationname : options),
        map(relationname => relationname ? this.filter(relationname) : this.options.slice())
      )
  }

  handleEvent(action: string, event: CalendarEvent): void {
      this.dialogsService
        .confirm(event.title, action)
        .subscribe(res => {
        });
  }

  swiperight(e) {
    console.log(e);
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    console.log(e);
    this.listviewxsshow = false;
  }


  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((Account: Account) => {
      this.Account = Account,
        this.CompanyApi.getRelations(this.Account.companyId)
          .subscribe((Relations: Relations[]) => { this.Relations = Relations, this.getrelationsEntry() });
    });
  }

  getrelationsEntry(): void {
    for (let relation of this.Relations) {
      this.options.push(relation);
    }
  }
 
  onSelectRelation(option, i): void {
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
            mailingsub.forEach((mailing) => {
              let mailingliststring: string;
              mailing.selectedlists.forEach(element => {
                if (mailingliststring === undefined){
                  mailingliststring = element.listname
                } else {
                  mailingliststring = mailingliststring + ' ' + element.listname
                }
                
              });
              
              this.events.push({
                title: mailing.title + ', list: ' + mailingliststring,
                start: new Date(
                  mailing.date 
                ),
                color: {
                  primary: '#23549d',
                  secondary: '#ffffff'
                },
                allDay: false,
                meta: {
                  mailing
                }
              });
              this.events = Array.from(this.events);
            })
          })

      });

  }


  eventClicked($event){
    console.log(this.events);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }


  filter(relationname: string) {
    return this.options.filter(option =>
      option.relationname.indexOf(relationname.toLowerCase()) === 0);
  }

  displayFn(options): string {
    return options ? options.relationname : options;
  }

  getMarketingPlanner(): void {
    this.RelationsApi.getMarketingplanner(this.option.id)
      .subscribe((Marketingplanner: Marketingplanner[]) => { this.Marketingplanner = Marketingplanner });
  }

  getMarketingPlannerEvents(): void {
    this.MarketingplannerApi.getMarketingplannerevents(this.selectedmarketingplanner.id)
      .subscribe((Marketingplannerevents: Marketingplannerevents[]) => this.Marketingplannerevents = Marketingplannerevents);
  } //sort by date? 

  getChannels(): void {
    this.RelationsApi.getChannels(this.option.id)
      .subscribe((Channels: Channels[]) => this.Channels = Channels);
  }

  newPlanner(): void {
    this.RelationsApi.createMarketingplanner(this.option.id,
      {
        campaignname: "new Campaign", publicationdate: new Date(), owner: this.Account.id,
        companyId: this.Account.companyId
      })
      .subscribe(res => { this.selectedmarketingplanner = res });
  } //2017-12-15T13:22:36.206Z

  newEvent(): void {
    this.MarketingplannerApi.createMarketingplannerevents(this.selectedmarketingplanner.id)
      .subscribe();
  }

  onSelectMarketingPlanner(Marketingplanner: Marketingplanner): void {
    this.selectedmarketingplanner = Marketingplanner;
    this.getMarketingPlannerEvents();
  }

  onSelectMarketingPlannerEvent(Marketingplannerevents: Marketingplannerevents): void {
    this.selectedmarketingplannerevent = Marketingplannerevents;
  }

  //set rounded iso time/date for comparison iso=2017-12-15T15:41:35.214Z
  saveEvent(): void {
    this.date = this.selectedmarketingplannerevent.date.toISOString();
    this.time = this.selectedmarketingplannerevent.time;
    this.convertdate = this.date.substring(0, 11) + this.time + ":00.000Z";
    this.selectedmarketingplannerevent.date = new Date(this.convertdate);
    this.MarketingplannerApi.updateByIdMarketingplannerevents(this.selectedmarketingplanner.id, this.selectedmarketingplannerevent.id, this.selectedmarketingplannerevent)
      .subscribe();
  }

  getPublications(): void {
    this.RelationsApi.getPublications(this.option.id, {
      //limit: this.limitresult,
      order: 'title DESC'
    })
      .subscribe((Publications: Publications[]) => this.Publications = Publications);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}
