import { Component, NgZone, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  Contactpersons,
  ContactpersonsApi,
  CallsApi,
  Calls,
  LoopBackConfig,
  RelationsApi,
  Relations,
  Company,
  CompanyApi,
  BASE_URL,
  API_VERSION,
  Account,
  AccountApi,
  Googleanalytics,
  GoogleanalyticsApi,
  Twitter,
  TwitterApi,
  Linkedin,
  LinkedinApi,
  Facebook,
  FacebookApi,
  Container,
  ContainerApi,
  Files,
  FilesApi,
  Adwords,
  AdwordsApi,
  Crawler,
  CrawlerApi
} from '../shared/';
import { DialogsService } from './../dialogsservice/dialogs.service';
import { MatSnackBar, MatDatepickerModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { LinkedinService } from '../shared/socialservice';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { HostBinding } from '@angular/core';
import { GoogleMapService } from '../shared/googlemapservice/googlemap.service';
import { Observable } from 'rxjs';
import { map, startWith } from "rxjs/operators";
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../shared/speechservice/speechservice';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

import { FileUploader } from 'ng2-file-upload';
const URL = "https://xbmsapi.eu-gb.mybluemix.net/api/Containers/images/upload";

class Tasklist {
  public task: string;
}

class Notes {
  public note: string;
}

class Attendee {
  public attendent: string;
}


@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class RelationComponent implements OnInit {
  showSearchButton: boolean;
  speechData: string;
  public AccessToken: any;
  public Crawler: Crawler[];
  public Relations: Relations[];
  public Contactpersons: Contactpersons[];
  public Googleanalytics: Googleanalytics[];
  public Twitter: Twitter[];
  public Linkedin: Linkedin[];
  public Facebook: Facebook[];
  public Calls: Calls[];
  public Company: Company = new Company();
  public Account: Account = new Account();
  public Container: Container[];
  public Files: Files[];
  public newFiles: Files = new Files();
  public crawlerrunning = false;

  public selectedRelation: Relations;
  public selectedContactperson: Contactpersons;
  public selectedCall: Calls;
  public selectedCrawler: Crawler;

  public selectedAdwords: Adwords;
  public Adwords: Adwords[];

  public errorMessage;
  public selectedOption = false;
  public error;

  public result: any;
  public data
  public time: Date;

  public callindex: any;
  public contactpersonindex: any;
  public relationindex: any;

  public tasklist: Tasklist[] = [];
  public task: string;

  public notes: Notes[] = [];
  public note: string;
  public attendee: Attendee[] = [];
  public attendent: string;

  public address: string;
  public lat: number;
  public lng: number;

  public options = [];
  public option: Contactpersons = new Contactpersons();
  public relationsOptions = [];
  public relationsOption: Relations = new Relations();


  public attendeelist = [];
  public newGoogleAnalytics: Googleanalytics = new Googleanalytics();
  public newTwitter: Twitter = new Twitter();
  public newLinkedin: Linkedin = new Linkedin();
  public newFacebook: Facebook = new Facebook();
  public newAdwords: Adwords = new Adwords();

  public newURL: string;
  public urldownload;
  public searchterm = "";

  //standard limit for pagination
  public skip = 0;
  public limit = 20;
  // public newlimit;
  // public newskip;
  public totalrelationcount
  public selectstatus;
  public mailtolink;

  public recordactive = false

  calltype = [
    { value: 'PhoneCall', viewValue: 'Phone Call' },
    { value: 'E-mail', viewValue: 'E-mail' },
    { value: 'Meeting', viewValue: 'Meeting' },
    { value: 'ConferenceCall', viewValue: 'Conference Call' },
    { value: 'LinkedinMessage', viewValue: 'Linkedin Message' },
    { value: 'Other', viewValue: 'Other' }
  ];

  statustype = [
    { viewValue: 'All' },
    { value: 'not attempted', viewValue: 'Not attempted' },
    { value: 'attempted', viewValue: 'Attempted' },
    { value: 'contacted', viewValue: 'Contacted' },
    { value: 'schedule call', viewValue: 'Schedule Call' },
    { value: 'schedule meeting', viewValue: 'Schedule Meeting' },
    { value: 'new opportunity', viewValue: 'New opportunity' },
    { value: 'additional contact', viewValue: 'Additional contact' },
    { value: 'disqualified', viewValue: 'Disqualified' }
  ];

  numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  crawl1FormGroup: FormGroup;
  crawl2FormGroup: FormGroup;
  public editCrawler = false;
  public togglesearch = false;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public router: Router,
    public CrawlerApi: CrawlerApi,
    public AdwordsApi: AdwordsApi,
    public FilesApi: FilesApi,
    public ContainerApi: ContainerApi,
    public GoogleanalyticsApi: GoogleanalyticsApi,
    public TwitterApi: TwitterApi,
    public LinkedinApi: LinkedinApi,
    public FacebookApi: FacebookApi,
    public googleMapService: GoogleMapService,
    public __zone: NgZone,
    private zone: NgZone,
    public CompanyApi: CompanyApi,
    public AccountApi: AccountApi,
    public LinkedinService: LinkedinService,
    public dialogsService: DialogsService,
    public RelationsApi: RelationsApi,
    public ContactpersonsApi: ContactpersonsApi,
    public CallsApi: CallsApi
  ) {
    this.showSearchButton = true;
    this.speechData = "";
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  myControlRelations: FormControl = new FormControl();
  filteredOptionsRelations: Observable<string[]>;

  ngOnInit() {
    if (this.AccountApi.isAuthenticated() == false) { this.router.navigate(['login']) }
    this.setFilter();
    this.getCurrentUserInfo();
    this.uploader.clearQueue();
    //filter contactperson
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     //map(options => options && typeof options === 'object' ? options.relationname : options),
    //     map(lastname => lastname ? this.filter(lastname) : this.options.slice())
    //   );

    this.crawl1FormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.crawl2FormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: "snackbar-class"
    });
  }

  //get filter calls selections 
  filter(lastname: string): Contactpersons[] {
    const filterValue = lastname.toLowerCase();
    return this.options.filter(option =>
      option.lastname.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(options): string {
    return options ? options.firstname + " " + options.lastname : options;
  }

  getcontactpersonsEntry(): void {
    this.options = []
    for (let contactpersons of this.Contactpersons) {
      this.options.push(contactpersons);
    }
  }

  //compare filter search Relations
  setFilter(): void {
    this.filteredOptionsRelations = this.myControlRelations.valueChanges
      .pipe(
        startWith<string | Relations>(''),
        map(value => typeof value === 'string' ? value : value.relationname),
        map(relationname => relationname ? this.filterRelations(relationname) : this.options.slice())
      );
  }

  //filter and to lower case for search
  private filterRelations(relationname: string): Relations[] {
    const filterValue = relationname.toLowerCase();
    return this.relationsOptions.filter(option => option.relationname.toLowerCase().indexOf(filterValue) === 0);
  }


  //display name in searchbox
  displayFnRelation(relation?: Relations): string | undefined {
    return relation ? relation.relationname : undefined;
  }

  getRelationsEntry(): void {
    this.relationsOptions = []
    for (let relations of this.Relations) {
      this.relationsOptions.push(relations);
    }
  }

  //get currentuserinfo for api
  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((Account: Account) => {
      this.Account = Account,
        // this.CompanyApi.getRelations(this.Account.companyId)
        //   .subscribe((Relations: Relations[]) => {
        // this.Relations = Relations,
        this.RelationsApi.findById(this.Account.standardrelation)
          .subscribe((relations: Relations) =>
            this.onSelect(relations, null)),
        this.getRelations();
      this.CompanyApi.countRelations(this.Account.companyId).subscribe(res => this.totalrelationcount = res.count);
      // });
    });
  }

  onSelect(Relations: Relations, i): void {
    this.notes = [],
      this.note = "",
      this.task = "",
      this.tasklist = [],
      this.option = undefined,
      this.selectedRelation = Relations;
    this.relationindex = i;
    this.selectedCall = null;
    this.getCalls();
    this.selectedContactperson = null;
    this.getContactpersons();
    this.getGoogleAnalytics();
    this.getFiles();
    this.newURL = BASE_URL + "/api/Containers/" + this.selectedRelation.id + "/upload"
    this.uploader.setOptions({ url: this.newURL });
    this.getCrawlers()

    //create search string google maps
    this.address =
      this.selectedRelation.address1 + ', ' +
      this.selectedRelation.city + ', ' +
      this.selectedRelation.stateprovince + ', ' +
      this.selectedRelation.country;
    //get geo location
    this.getAddress();
  }

  //check url and open in new window/tab
  openUrl(): void {
    var res = this.selectedRelation.website.substring(0, 3);
    res = res.toLowerCase();
    if (res === "www") { window.open("http://" + this.selectedRelation.website, "_blank"); }
    else if (res === "htt") { window.open(this.selectedRelation.website, "_blank"); }
    else { this.dialogsService.confirm('Not a valid URL', 'Please edit'); };
  }

  getRelationsnextpage(): void {
    if (this.limit < this.totalrelationcount) {
      this.limit = this.limit += 20;
      this.skip = this.skip += 20;
      this.getRelations();
    }
  }

  getRelationsbackpage(): void {
    if (this.skip > 0) {
      this.skip = this.skip -= 20;
      this.limit = this.limit -= 20,
        this.getRelations();
    }
  }

  getRelations(): void {
    this.Relations = [];
    this.CompanyApi.getRelations(this.Account.companyId,
      {
        order: 'relationname ASC',
        limit: 20,
        skip: this.skip,
      }
    ).subscribe((Relations: Relations[]) => {
      this.Relations = Relations,
        this.getRelationsEntry();
    });
  }

  getContactpersons(): void {
    //this.saveRelation(), //and when new search?
    this.RelationsApi.getContactpersons(this.selectedRelation.id)
      .subscribe((Contactpersons: Contactpersons[]) => {
        this.Contactpersons = Contactpersons,
          this.getcontactpersonsEntry()
      });
  }

  getAllContactpersons(): void {
    this.RelationsApi.getContactpersons(this.selectedRelation.id)
      .subscribe((Contactpersons: Contactpersons[]) => this.Contactpersons = Contactpersons);
  }

  getCalls(): void {
    this.RelationsApi.getCalls(this.selectedRelation.id)
      .subscribe((Calls: Calls[]) => this.Calls = Calls);
  }


  searchGo(): void {
    this.searchterm = this.searchterm.charAt(0).toUpperCase() + this.searchterm.slice(1);
    this.searchterm = this.searchterm.trim();
    this.CompanyApi.getRelations(this.Account.companyId,
      {
        where:
        {
          or: [{ "relationname": this.searchterm },
          { "address1": this.searchterm }
          ]
        },
        order: 'relationname ASC',
        limit: 20
      })
      .subscribe((Relations: Relations[]) => this.Relations = Relations,
        error => this.errorMessage = <any>error);
  }


  saveRelation(): void {
    this.RelationsApi.replaceById(this.selectedRelation.id, this.selectedRelation)
      .subscribe(Relations => {
        this.Relations[this.relationindex] = this.selectedRelation;
      });
  }   //html:  on-focusout="saveRelation()"

  addTask(): void {
    this.tasklist.push({ task: this.task })
  }

  deleteTask(i): void {
    this.tasklist.splice(i);
  }

  addNote(): void {
    this.notes.push({ note: this.note })
  }

  deleteNote(i): void {
    this.notes.splice(i);
  }

  addAttendent(attendeeInput): void {
    if (this.option.lastname === undefined) { this.attendent = attendeeInput }
    else { this.attendent = this.option.firstname + ' ' + this.option.lastname };
    this.attendeelist.push({ attendent: this.attendent })
  }

  deleteAttendent(i): void {
    this.attendeelist.splice(i);
  }

  saveCall(): void {
    this.selectedCall.tasks = this.tasklist,
      this.selectedCall.notes = this.notes,
      this.selectedCall.attendee = this.attendeelist,
      this.RelationsApi.updateByIdCalls(this.selectedRelation.id, this.selectedCall.id, this.selectedCall)
        .subscribe(Calls => this.Calls[this.callindex] = this.selectedCall);
  }

  saveContactperson(): void {
    this.selectedContactperson.companyId = this.Account.companyId,
      this.RelationsApi.updateByIdContactpersons(this.selectedRelation.id, this.selectedContactperson.id, this.selectedContactperson)
        .subscribe();
    //Contactpersons => this.Contactpersons.push(this.selectedContactperson));

  }

  public openDialogDelete() {
    this.dialogsService
      .confirm('Delete Relation', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteRelation(this.selectedOption),
          this.Relations.splice(this.relationindex);
      });
  }

  public openDialogDeleteCall() {
    this.dialogsService
      .confirm('Delete Call', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteCall(this.selectedOption);
      });
  }

  public openDialogDeleteContactperson() {
    this.dialogsService
      .confirm('Delete Call', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteContactperson(this.selectedOption);
      });
  }

  //Create New Relation add to array, get index nr for selection and send to api
  public openDialogNewRelation() {
    this.dialogsService
      .confirm('Create new Relation', 'Do you want to create a new Entry?')
      .subscribe(res => {
        this.selectedOption = res, this.newRelation(this.selectedOption);
      });
  }

  public newRelation(selectedOption) {
    if (selectedOption == true) {
      this.CompanyApi.createRelations(this.Account.companyId, { "companyname": "New Company" }).subscribe(res => {
        this.data = res,
          this.relationindex = this.Relations.push(this.data) - 1,
          this.onSelect(this.data, this.relationindex);
      });
    }
  }

  //Create new Call
  public openDialogNewCall() {
    this.dialogsService
      .confirm('Create new Call', 'Do you want to create a new Entry?')
      .subscribe(res => {
        this.selectedOption = res, this.newCall(this.selectedOption)
      });
  }

  public newCall(selectedOption) {
    if (selectedOption == true) {
      this.RelationsApi.createCalls(this.selectedRelation.id, {
        "title": "New",
        "accountId": this.Account.id, "companyId": this.Account.companyId
      }) //add companyId for statistics
        .subscribe(res => {
          this.data = res,
            this.callindex = this.Calls.push(this.data) - 1,
            this.onSelectCall(this.data, this.callindex)
        });
    }
  }

  //create new Contactperson
  public openDialogNewContactperson() {
    this.dialogsService
      .confirm('Create new Contactperson', 'Do you want to create a new Entry?')
      .subscribe(res => {
        this.selectedOption = res, this.newContactperson(this.selectedOption)
      });
  }

  public newContactperson(selectedOption) {
    if (selectedOption == true) {
      this.RelationsApi.createContactpersons(this.selectedRelation.id, { "firstname": "New", "companyId": this.Account.companyId })
        .subscribe(res => {
          this.data = res,
            this.contactpersonindex = this.Contactpersons.push(this.data) - 1,
            this.onSelectContactperson(this.data, this.contactpersonindex)
        });
    }
  }

  deleteRelation(selectedOption): void {
    if (selectedOption == true) {
      this.RelationsApi.deleteById(this.selectedRelation.id).subscribe(res => {
        this.error = res,
          this.selectedRelation = null
        this.getRelations();
      })
    }
  }

  deleteCall(selectedOption): void {
    if (selectedOption == true) {
      this.RelationsApi.destroyByIdCalls(this.selectedRelation.id, this.selectedCall.id)
        .subscribe(res => {
          this.error = res,
            this.selectedCall = null,
            this.getCalls();
          this.Calls.splice(this.callindex, 1)
        })
    }
  }

  deleteContactperson(selectedOption): void {
    if (selectedOption == true) {
      this.RelationsApi.destroyByIdContactpersons(this.selectedRelation.id, this.selectedContactperson.id).subscribe(res => {
        this.error = res,
          this.selectedContactperson = null
        this.getContactpersons();
      })
    }
  }

  onSelectCall(Calls: Calls, i): void {
    this.attendeelist = [];
    this.option = undefined;
    this.tasklist = [];
    this.notes = [];
    this.task = "";
    this.note = "";
    this.selectedCall = Calls;
    this.callindex = i;
    if (this.selectedCall.attendee !== undefined) { this.attendeelist = this.selectedCall.attendee }
    if (this.selectedCall.tasks !== undefined) { this.tasklist = this.selectedCall.tasks };
    if (this.selectedCall.notes !== undefined) { this.notes = this.selectedCall.notes };
  }

  onSelectContactperson(Contactpersons: Contactpersons, i): void {
    this.selectedContactperson = Contactpersons;
    this.contactpersonindex = i;
  }

  searchCallGo(name: string): void {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim();
    this.RelationsApi.getCalls(this.selectedRelation.id, { where: { "title": name } })
      .subscribe((Calls: Calls[]) => this.Calls = Calls,
        error => this.errorMessage = <any>error);
  }

  //check related linkedin accounts
  getRelatLinkedin(): void {
    this.LinkedinService.restoreCredentials
    if (this.AccessToken !== undefined) {
      //show message and redirect to settings
    }
  }

  getAddress() {
    this.googleMapService.getLatLan(
      this.address
    )
      .subscribe(
        result => {
          this.__zone.run(() => {
            this.lat = result.lat();
            this.lng = result.lng();
          })
        },
        error => {
          console.log(error),
            this.lat = 0,
            this.lng = 0;
        },
        () => console.log('Geocoding completed!')
      );
  }

  getGoogleAnalytics(): void {
    this.RelationsApi.getGoogleanalytics(this.selectedRelation.id)
      .subscribe((Googleanalytics: Googleanalytics[]) => this.Googleanalytics = Googleanalytics)
  }

  createGoogleAnalytics(): void {
    this.newGoogleAnalytics.companyId = this.Account.companyId; //include companyid for roleresolver
    this.RelationsApi.createGoogleanalytics(this.selectedRelation.id, this.newGoogleAnalytics)
      .subscribe(res => this.getGoogleAnalytics());
  }

  getTwitter(): void {
    this.RelationsApi.getTwitter(this.selectedRelation.id)
      .subscribe((Twitter: Twitter[]) => this.Twitter = Twitter)
  }

  deleteTwitter(i): void {
    this.RelationsApi.destroyByIdTwitter(this.selectedRelation.id, this.Twitter[i].id)
      .subscribe(res => this.getTwitter());
  }


  getLinkedin(): void {
    this.newLinkedin = new Linkedin;
    this.RelationsApi.getLinkedin(this.selectedRelation.id)
      .subscribe((Linkedin: Linkedin[]) => this.Linkedin = Linkedin)
  }

  linkTwitterAccount(): void {
    this.RelationsApi.createTwitter(this.selectedRelation.id, this.newTwitter)
      .subscribe(res => {
        this.newTwitter = res,
          this.redirectTwitter(this.newTwitter.id)
      })
  };

  redirectTwitter(id): void {
    var redirect;
    var domain = window.location.protocol + window.location.hostname + ":3000"; //set domain + protocol + 3000 for test purpose only
    this.TwitterApi.sessionsconnect(id, domain).subscribe(res => { redirect = res, 
      console.log(res),
      window.location.href = redirect; });
  }


  linkLinkedinAccount(): void {
    this.RelationsApi.createLinkedin(this.selectedRelation.id, this.newLinkedin)
      .subscribe(res => {
        this.newLinkedin = res,
          this.redirectLinkedin(this.newLinkedin.id)
      })
  };

  redirectLinkedin(id): void {
    var redirect;
    var domain = window.location.protocol + window.location.hostname; // + ":3000"; //set domain + protocol + 3000 for test purpose only
    this.LinkedinApi.linkedinauth(id, domain).subscribe(res => { redirect = res, window.location.href = redirect; });
  };

  deleteLinkedin(i): void {
    this.RelationsApi.destroyByIdLinkedin(this.selectedRelation.id, this.Linkedin[i].id)
      .subscribe(res => this.getLinkedin());
  }


  getFacebook(): void {
    this.newFacebook = new Facebook;
    this.RelationsApi.getFacebook(this.selectedRelation.id)
      .subscribe((Facebook: Facebook[]) => this.Facebook = Facebook)
  }

  linkFacebookAccount(): void {
    this.RelationsApi.createFacebook(this.selectedRelation.id, this.newFacebook)
      .subscribe(res => {
        this.newFacebook = res,
          this.redirectFacebook(this.newFacebook.id)
          this.openSnackBar("You will be redirected to Facebook.com")
      })
  };

  redirectFacebook(id): void {
    var redirect;
    var domain = window.location.protocol + '//' + window.location.hostname //+ ":3000"; //set domain + protocol + 3000 for test purpose only
    this.FacebookApi.sessionsconnect(id, domain).subscribe(res => { redirect = res, window.location.href = redirect; });
  };

  showFacebook(i): void {
    this.FacebookApi.me(this.Facebook[i].AccessToken)
      .subscribe(res => this.openSnackBar(res)); //"Accountname: " + res.name
  }

  deleteFacebook(i): void {
    this.RelationsApi.destroyByIdFacebook(this.selectedRelation.id, this.Facebook[i].id)
      .subscribe(res => {this.getFacebook(),
      this.openSnackBar("Facebook Deleted")}
      );
  }

  //Adwordsstart
  getAdwords(): void {
    this.RelationsApi.getAdwords(this.selectedRelation.id).subscribe((Adwords: Adwords[]) => this.Adwords = Adwords);
  }

  onSelectAdwords(Adwords: Adwords): void {
    this.selectedAdwords = Adwords;
  }

  createAdwords(): void {
    var redirect;
    var domain = window.location.protocol + '//' + window.location.hostname //+ ":3000"; //set domain + protocol + 3000 for test purpose only
    this.RelationsApi.createAdwords(this.selectedRelation.id, { account: this.selectedRelation.relationname })
      .subscribe(res => {
        this.selectedAdwords = res,
          this.AdwordsApi.redirect(this.selectedAdwords.id, domain).subscribe(res => { redirect = res, window.location.href = redirect; });
        this.getAdwords()
      });
  }

  deleteAdwords(i): void {
    this.RelationsApi.destroyByIdAdwords(this.selectedRelation.id, this.Adwords[i].id)
      .subscribe(res => this.getAdwords());
  }


  createTwitter(): void {

  }


  createLinkedin(): void {

  }

  createFacebook(): void {

  }

  createInstagram(): void {

  }



  //file upload 1
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  //file upload 2
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  getFiles(): void {
    this.ContainerApi.getFiles(this.selectedRelation.id)
      .subscribe((Files: Files[]) => this.Files = Files)
  }

  dialogDeleteFile(Files: Files): void {
    //console.log(Files);
    this.dialogsService
      .confirm('Delete Files' + Files.name, 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteFiles(this.selectedOption, Files)
      });
  }

  deleteFiles(selectedOption, Files): void {
    if (selectedOption == true) {
      this.ContainerApi.removeFile(this.selectedRelation.id, Files.name).subscribe(res => this.getFiles());
    }
  }

  onDownload(Files): void {
    this.urldownload = BASE_URL + "/api/Containers/" + this.selectedRelation.id + "/download/" + Files.name
    this.urldownload.replace(/ /g, "%20")
  }

  //set variable and upload + save reference in Publications
  setupload(name): void {
    //define the file settings
    this.newFiles.name = name,
      this.newFiles.url = this.newURL,
      this.newFiles.createdate = new Date(),
      this.newFiles.type = "general",
      this.newFiles.companyId = this.Account.companyId,
      //check if container exists and create
      this.ContainerApi.findById(this.selectedRelation.id)
        .subscribe(res => this.uploadFile(),
          error =>
            this.ContainerApi.createContainer({ name: this.selectedRelation.id })
              .subscribe(res => this.uploadFile()));
  }

  uploadFile(): void {
    this.uploader.uploadAll(),
      this.RelationsApi.createFiles(this.selectedRelation.id, this.newFiles)
        .subscribe(res => this.getFiles());
  }

  sendMailTo(): void {
    if (this.selectedCall.html == undefined) {
      this.mailtolink = "mailto:" + this.selectedCall.email + "?subject=" +
        this.selectedCall.title + "&body=" + this.selectedCall.content
    }

    else {
      this.mailtolink = "mailto:" + this.selectedCall.email + "?subject=" +
        this.selectedCall.title + "&body=" + this.selectedCall.html
    }

    window.open(this.mailtolink, "_self");
  }

  sendMailToContact(): void {
    this.mailtolink = "mailto:" + this.selectedContactperson.email
    window.open(this.mailtolink, "_self");
  }

  //run crawler once delete?
  crawlUrl(): void {
    this.CrawlerApi.crawlurl(this.selectedRelation.id, this.selectedRelation.website).subscribe(res => res = res);
  }

  scheduleCrawler(): void {
    //update and queue
    this.RelationsApi.updateByIdCrawler(this.selectedRelation.id, this.selectedCrawler.id, this.selectedCrawler)
      .subscribe(res => {
        //if (this.selectedCrawler.response == undefined){this.selectedCrawler.response = []}
        this.CrawlerApi.crawlurl(this.selectedCrawler.id, this.selectedCrawler.url, this.selectedCrawler.term,
          this.selectedCrawler.people, this.selectedCrawler.companies, this.selectedCrawler.locations, this.selectedCrawler.findlist, this.selectedCrawler.depth)
          .subscribe(res => { res = res, this.openSnackBar(res.message) })
      });
  }

  getCrawlers(): void {
    this.RelationsApi.getCrawler(this.selectedRelation.id)
      .subscribe((Crawler: Crawler[]) => {
        this.Crawler = Crawler
      });
  }

  newCrawler(): void {
    this.RelationsApi.createCrawler(this.selectedRelation.id, { "name": "New Crawler" })
      .subscribe(res => {
        this.selectedCrawler = res,
          this.editCrawler = true;
      });
  }

  editCrawlerToggle(): void {
    this.editCrawler = true
  }

  updateCrawler(): void {
    this.RelationsApi.updateByIdCrawler(this.selectedRelation.id, this.selectedCrawler.id, this.selectedCrawler)
      .subscribe();
  }


  togglerawsearch(): void {
    if (this.togglesearch == true) { this.togglesearch = false; }
    else this.togglesearch = true;
  }

  onSelectCrawler(Crawler: Crawler, i): void {
    this.editCrawler = false;
    this.selectedCrawler = Crawler;
  }

  deleteCrawler(): void {
    this.RelationsApi.destroyByIdCrawler(this.selectedRelation.id, this.selectedCrawler.id)
      .subscribe(res => { this.getCrawlers(), this.selectedCrawler = undefined, this.getCrawlers(), this.openSnackBar("Crawler Deleted"); });
  }

  deleteCrawl(i): void {
    this.selectedCrawler.response.splice(i, 1), this.updateCrawler()
  }

  //Method to be invoked everytime we receive a new instance 
  //of the address object from the onSelect event emitter.
  setAddress(addrObj) {
    //We are wrapping this in a NgZone to reflect the changes
    //to the object in the DOM.
    this.zone.run(() => {
      if (addrObj.name !== undefined) {
        this.selectedRelation.relationname = addrObj.name;
      }
      if (addrObj.route !== undefined) {
        this.selectedRelation.address1 = addrObj.route + " " + addrObj.street_number;
      }
      if (addrObj.phone !== undefined) {
        this.selectedRelation.generalphone = addrObj.phone;
      }
      if (addrObj.country !== undefined) {
        this.selectedRelation.country = addrObj.country;
      }
      if (addrObj.locality !== undefined) {
        this.selectedRelation.city = addrObj.locality;
      }
      if (addrObj.admin_area_l1 !== undefined) {
        this.selectedRelation.stateprovince = addrObj.admin_area_l1;
      }
      if (addrObj.postal_code !== undefined) {
        this.selectedRelation.zipcode = addrObj.postal_code;
      }
      if (addrObj.website !== undefined) {
        this.selectedRelation.website = addrObj.website;
      }
      console.log(addrObj);
    });
  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }


  activateSpeech(): void {
 //load in service speech service
 // connected class to recordactive
 //
 //see manual --> https://hassantariqblog.wordpress.com/2016/12/04/angular2-web-speech-api-speech-recognition-in-angular2/
    if (this.recordactive === false) {
      this.recordactive = true;
      this.speechRecognitionService.record()
        .subscribe(
          //listener
          (value) => {
            this.speechData = value;
            console.log(value);
            if (this.selectedCall.content !== undefined){
            this.selectedCall.content = this.selectedCall.content + ". " + value
          }
          else this.selectedCall.content = value
          },
          //errror
          (err) => {
              console.log(err.error, "--restarting service--");
              this.activateSpeech();
          },
          //completion
          () => {
            console.log("--complete--");
            //this.activateSpeech();
          });
    } else {
      this.speechRecognitionService.speechRecognition.stop()
      this.speechRecognitionService.DestroySpeechObject();
      this.recordactive = false;
    }

  }


}



