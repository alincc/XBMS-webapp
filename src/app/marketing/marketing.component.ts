import { Component, ViewChild, OnInit, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  LoopBackConfig,
  PublicationsApi,
  Publications,
  BASE_URL,
  API_VERSION,
  Container,
  ContainerApi,
  Translation,
  TranslationApi,
  Translationjob,
  TranslationjobApi,
  Relations,
  RelationsApi,
  Account,
  AccountApi,
  Company,
  CompanyApi,
  ChannelsApi,
  Files,
  Mailing,
  MailingApi,
  MailinglistApi,
  Mailinglist,
  GoogleanalyticsApi,
  Googleanalytics,
  MarketingplannereventsApi,
  Marketingplannerevents,
  Adwords,
  AdwordsApi,
  timezones,
} from '../shared/';
import { FileUploader } from 'ng2-file-upload';
import {
  ButtonEvent,
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  GridLayout,
  Image,
  ImageModalEvent,
  PlainGalleryConfig,
  PlainGalleryStrategy,
  PreviewConfig
} from '@ks89/angular-modal-gallery'
import { FileuploadComponent } from '../shared/fileupload/fileupload.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location, NgClass, NgStyle } from '@angular/common';
import { DialogsService } from './../dialogsservice/dialogs.service';
import { RandomService } from '../dialogsservice/random.service';
import { WordpressUploadDialogComponent} from '../dialogsservice/wordpressupload-dialog.component';
import { WordpressService } from '../shared/websiteservice';
import { LinkedinService } from '../shared/socialservice';
import { timeconv } from '../shared/timeconv';
import { FormControl } from '@angular/forms';
import { UploadResult } from './xlsx-file-upload/xlsx-file-upload.component';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { map, startWith, timeoutWith } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
// import {
//   trigger,
//   state,
//   style,
//   animate,
//   transition
// } from '@angular/animations';
import * as moment from 'moment-timezone';
import { reject } from '../../../node_modules/@types/q';
declare const CKEDITOR: any;
const URL = 'http://localhost:3000/api/containers/tmp/upload';

import { MarketingchannelsComponent } from './marketingchannels/marketingchannels.component';
import { MaileditorComponent } from './maileditor/maileditor.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface UploadResult {
  result: 'failure' | 'success';
  payload: any;
}

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
  // animations: [
  //   trigger('flyInOut', [
  //     state('in', style({ transform: 'translateX(0)' })),
  //     transition('void => *', [
  //       style({ transform: 'translateX(-100%)' }),
  //       animate(100)
  //     ]),
  //     transition('* => void', [
  //       animate(100, style({ transform: 'translateX(100%)' }))
  //     ])
  //   ])
  // ]
})

export class MarketingComponent implements OnInit {

  allowedMimeType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  maxFileSize = 10 * 1024 * 1024;
  public timezones = timezones;
  public showgallery = false;
  public uploaderContent: BehaviorSubject<string> = new BehaviorSubject('Drop File Here');
  public linkedinPostId;
  public newURL: string;
  public urlckeditorupload: string;
  public ID: string;
  public uploader = new FileUploader({
    url: URL,
    allowedMimeType: this.allowedMimeType,
    // headers: [{name:'Accept', value:'application/json'}],
    autoUpload: false,
    maxFileSize: this.maxFileSize,
  });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public sub: any;
  public relationName: string;

  public Files: Files[];
  public newFiles: Files = new Files();
  public Adwords: Adwords[];
  public container: Container[];
  public Publications: Publications[];
  public Translation: Translation[];
  public Translationjob: Translationjob[];
  public Relations: Relations[];
  public Googleanalytics: Googleanalytics[];
  public Marketingplannerevents: Marketingplannerevents[];
  public selectedMarketingplannerevents: Marketingplannerevents;
  public CampaignMailing: Mailing[];

  public Account: Account = new Account();
  public Company: Company[];
  public company: Company = new Company;
  public Mailing: Mailing[];
  public newMailing: Mailing = new Mailing();
  public selectedMailing: Mailing;
  public selectedMailingList: Mailinglist;
  public response;
  public mailingresponse;
  public Mailinglist: Mailinglist[];
  public newMailinglist: Mailinglist = new Mailinglist();
  public newmailinglisttoggle = false;
  public callback

  public MarkTranJobs;
  public MarkTranJobRes;
  public translationJob = {};
  public languages;
  public errorMessage;
  public selectedPublications: Publications;

  public PlainGalleryConfig: PlainGalleryConfig;
  public customButtonsConfig: ButtonsConfig;
  public ButtonEvent: ButtonEvent;
  public PreviewConfig: PreviewConfig;
  public ImageModalEvent: ImageModalEvent
  // public buttonsConfigFull: ButtonsConfig;
  public images: Image[] = [];
  public imagesNew: Image[] = [];

  public selectedTranslation: Translation;
  public selectedTranslationjob: Translationjob;
  public newTranslation = new Translation();
  public jobs = [];

  public selectedAdwords: Adwords;
  // delete?? calls only
  public limitresult: 10;
  public urluse: string;
  // show results max amount, to do: create page??
  public oneaddress;
  public onemonth = 2592000000;


  public headers = [];
  public emailheader;
  public firstnameheader = '';
  public lastnameheader = '';
  public companyheader = '';
  public titleheader = '';
  public mailinglistheader;
  public websiteheader = '';
  public const1header = '';
  public const2header = '';
  public const3header = '';
  public const4header = '';
  public createnewmailinglistonfield = false;
  public uploadlistId = [];
  public mailinglisttotal = 0;
  public mailinglistcount = 0;

  public numbers = [
    { value: '1', viewValue: '1' },
    { value: '20', viewValue: '20' },
    { value: '30', viewValue: '30' }
  ];
  public selectedtimezone;
  public filtermailing = [
    'send',
    'done',
    'all',
    'not send'
  ]
  public filtermailingselect;

  selectedOption = false;
  public error;
  public createItem: any;
  public SelectedRelation: Relations;
  public options = [];
  public mailinglist = [];
  public mailingaddress;
  public option: Relations = new Relations();
  public ReadyForUpload;
  public maillist = [];
  public maillist1;
  public listname;
  public uploadlistfinal = {};

  public toggleuploadlist = false;

  public toggleCampaignMailing = [];
  public togglecampaignclasstrans = [];
  public toggleshorttext = [];
  public htmlpreview = [];


  public adwordsoption: Adwords = new Adwords();
  public companypage = [];

  public convertdate;
  public date;
  public time;
  public localdate;
  public toggletextview = false;

  public mailinglistdetails = [];
  public mailingaddresscampaign = [];

  public firstname;
  public lastname;
  public companyname;
  public title;
  public minDate = new Date(2017, 0, 1);
  public maxDate = new Date(2030, 0, 1);

  public copyfrommailing;
  public analytics_ids = 'ga:154403562';
  public analytics_startdate = '2008-10-01';
  public analytics_enddate = 'today';
  public analytics_metrics = 'ga:bounceRate,ga:pageviewsPerSession,ga:goalStartsAll,ga:avgTimeOnPage';
  public analytics_dimensions = 'ga:adContent';
  public analytics_filters;
  public Googleanalyticsreturn;
  public GoogleanalyticsSet;
  public Googleanalyticsnumbers;
  public Googleanalyticsnames;
  public selectedanalytics: Googleanalytics = new Googleanalytics();
  public GoogleanalyticsModel: Googleanalytics[];
  public avgTimeOnPage = '-';
  public bounceRate = '-';
  public goalStartsAll = '-';
  public pageview = '-';
  public urlparameter: string;
  public selectedIndex = 0;
  public showconfirmation = false;
  public updateMailingObj: Mailing = new Mailing;

  constructor(
    public dialogWordpress: MatDialog,
    private MarketingChannel: MarketingchannelsComponent,
    //private Maileditor: MaileditorComponent,
    private sanitizer: DomSanitizer,
    public AdwordsApi: AdwordsApi,
    public timeconv: timeconv,
    public MarketingplannereventsApi: MarketingplannereventsApi,
    public GoogleanalyticsApi: GoogleanalyticsApi,
    public snackBar: MatSnackBar,
    public MailinglistApi: MailinglistApi,
    public MailingApi: MailingApi,
    public ContainerApi: ContainerApi,
    public ChannelaApi: ChannelsApi,
    public CompanyApi: CompanyApi,
    public AccountApi: AccountApi,
    public RelationsApi: RelationsApi,
    public TranslationApi: TranslationApi,
    public TranslationjobApi: TranslationjobApi,
    public LinkedinService: LinkedinService,
    public WordpressService: WordpressService,
    public dialogsService: DialogsService,
    public randomService: RandomService,
    public WordpressUploadDialogComponent: WordpressUploadDialogComponent,
    public PublicationsApi: PublicationsApi,
    public location: Location,
    public router: Router,
    public route: ActivatedRoute,
    public containerApi: ContainerApi) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit() {
    if (this.AccountApi.isAuthenticated() === false) { this.router.navigate(['login']) }
    this.setFilter();
    this.getCurrentUserInfo();
    // Clear the item queue (somehow they will upload to the old URL)
    this.uploader.clearQueue();

    // set limits on calender
    const day = moment().date()
    const month = moment().month()
    const year = moment().year()
    this.minDate = new Date(year, month, day);
    this.maxDate = new Date(2030, 0, 1);
    // console.log(this.minDate);

    this.urlparameter = this.route.snapshot.params['id'];
    if (this.urlparameter) {
      this.selectedIndex = 1;
      this.TranslationApi.findById(this.urlparameter).subscribe((translation: Translation) => {
        this.selectedTranslation = translation,
          this.onSelectTranslation(this.selectedTranslation);
          this.getTranslations();
        // this.TranslationApi.    // check payment hook
        if (this.selectedTranslation.status === 'paid') {
        // confirm translation assignment
        this.publishTranslationJob(this.selectedOption);
        }
        // send confirmation email with invoice to adminaddress (add admin address to account profile)
        this.showconfirmation = true;
      })
    }
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: 'snackbar-class'
    });
  }

  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account,
        this.CompanyApi.getRelations(this.Account.companyId,
          { fields: { id: true, relationname: true } }
        )
          .subscribe((relations: Relations[]) => {
            this.Relations = relations
            if (this.Account.standardrelation !== undefined) {
              // console.log(this.Account.standardrelation);
              this.RelationsApi.findById(this.Account.standardrelation)
                .subscribe(rel => {
                  this.onSelectRelation(rel, null),
                  this.CompanyApi.findById(this.Account.companyId)
                  .subscribe((company: Company) => {
                    this.company = company;
                    this.getTranslations();
                    //console.log(this.company);
                  });
                })
            }
            this.getrelationsEntry()
          });
    });
  }

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  // compare filter search Relations
  setFilter(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | Relations>(''),
        map(value => typeof value === 'string' ? value : value.relationname),
        map(relationname => relationname ? this.filter(relationname) : this.options.slice())
      );
  }

  // filter and to lower case for search
  private filter(relationname: string): Relations[] {
    const filterValue = relationname.toLowerCase();
    return this.options.filter(option => option.relationname.toLowerCase().indexOf(filterValue) === 0);
  }

  // set Relations and quick selections
  getrelationsEntry(): void {
    this.options = []
    for (const relation of this.Relations) {
      this.options.push(relation);
    }
  }


  // select relation --> get info for all tabs
  onSelectRelation(option, i): void {
    this.option = option;
    this.getPublications();
    this.getMailing();
    this.getMailinglist();
    this.getMailingCampaign();
    this.RelationsApi.getGoogleanalytics(this.option.id)
      .subscribe((googleanalytics: Googleanalytics[]) => {
        this.Googleanalytics = googleanalytics,
          this.AccountApi.addStdRelation(this.Account.id, option.id)
            .subscribe()
      })
  }

  // display name in searchbox
  displayFn(relation?: Relations): string | undefined {
    return relation ? relation.relationname : undefined;
  }


  // file upload 1
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // file upload 2
  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  // delete all or destroy??
  deletePicture(): void {
    this.selectedPublications.picturename = '', this.selectedPublications.pictureurl = '';
    this.RelationsApi.updateByIdPublications(this.option.id, this.selectedPublications.id).subscribe()
  }



  // set constiable and upload + save reference in Publications
  // setupload(name): void {
  //   this.selectedPublications.picturename = name,
  //     this.urluse = BASE_URL + '/api/Containers/' + this.selectedPublications.id + '/download/' + this.selectedPublications.picturename
  //   this.urluse.replace(/ /g, '%20'),
  //     this.selectedPublications.pictureurl = this.urluse
  //   // define the file settings
  //   this.newFiles.name = name,
  //     this.newFiles.url = this.urluse,
  //     this.newFiles.createdate = new Date(),
  //     this.newFiles.type = 'marketing',
  //     this.newFiles.companyId = this.Account.companyId,
  //     // check if container exists and create
  //     this.ContainerApi.findById(this.selectedPublications.id)
  //       .subscribe(res => this.uploadFile(),
  //         error =>
  //           this.ContainerApi.createContainer({ name: this.selectedPublications.id })
  //             .subscribe(res => this.uploadFile()));
  // }


  // onOpenGallery() {
  //   if (this.showgallery === false) { this.showgallery = true; }
  //   else { this.showgallery = false; }
  //   // this.buttonsConfig =  {visible: true, strategy: ButtonsStrategy.DEFAULT};
  //   this.PlainGalleryConfig = {
  //     strategy: PlainGalleryStrategy.GRID,
  //     layout: new GridLayout({ width: '80px', height: '80px' }, { length: 3, wrap: true })
  //   };
  //   this.customButtonsConfig = {
  //     visible: true,
  //     strategy: ButtonsStrategy.SIMPLE
  //   };


  //   // set images array
  //   this.ContainerApi.getFiles(this.option.id).subscribe((files: Files[]) => {
  //     this.Files = files,
  //       this.Files.forEach((file, index) => {
  //         // console.log(file, index);
  //         const modalImage = { img: BASE_URL + '/api/Containers/' + this.option.id + '/download/' + file.name };
  //         const modal = new Image(index, modalImage, null)
  //         this.imagesNew.push(modal)
  //       }),
  //       this.images = this.imagesNew;
  //   });
  // }

  onButtonAfterHook(event: ButtonEvent) {
    if (!event || !event.button) {
      return;
    }
    // Invoked after a click on a button, but before that the related
    // action is applied.
    // For instance: this method will be invoked after a click
    // of 'close' button, but before that the modal gallery
    // will be really closed.
    if (event.button.type === ButtonType.DOWNLOAD) {
      // remove the current image and reassign all other to the array of images
      // You must think in a functional way! So, re-assign the array instead of modifying it.
      // this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
      console.log(event.image);
      this.onSelectImage(event.image);
    }
  }

  onSelectImage(SelectedImage): void {
    console.log(this.selectedPublications, "onselect")
    // this.selectedPublications.picturename = SelectedImage.name,
      this.selectedPublications.pictureurl = encodeURI(SelectedImage);
      this.savePublication();
      console.log(this.selectedPublications, "onselect");
  }

  onClickImage(e): void {
    console.log(e);
  }

  uploadFile(): void {
    this.savePublication(),
      this.uploader.uploadAll(),
      this.PublicationsApi.createFiles(this.selectedPublications.id, this.newFiles)
        .subscribe(res => this.getFiles());
  }

  getFiles(): void {
    this.ContainerApi.getFiles(this.selectedPublications.id)
      .subscribe((files: Files[]) => this.Files = files)
  }

  newItem(): void {
    this.RelationsApi.createPublications(this.option.id, { 'companyId': this.Account.companyId, 'title': 'New Item' })
      .subscribe(result => {
        this.createItem = result,
          this.selectedPublications = this.createItem
      });
  }

  newTranslationItem(): void {
    this.newTranslation.companyId = this.Account.companyId,
      this.newTranslation.title = 'New',
      this.newTranslation.status = 'Draft',
      this.newTranslation.paymentreceived = 'Not Submitted'
      this.RelationsApi.createTranslation(this.option.id, this.newTranslation)
        .subscribe(result => {
          this.selectedTranslation = result,
            this.getTranslations();
        });
  }

  getPublications(): void {
    this.RelationsApi.getPublications(this.option.id, {
      limit: this.limitresult,
      order: 'title DESC'
    }).subscribe((publications: Publications[]) => this.Publications = publications);
  }

  getTranslations(): void {
    const languages = []
    this.RelationsApi.getTranslation(this.option.id)
      .subscribe((result) => { this.Translation = result });
  };

  getTransationsjobs(): void {
    // need project nr. to fetch languages
    this.TranslationApi.getlanguages(this.selectedTranslation.id).subscribe(res => {
      this.languages = res,
        console.log(this.languages.language)
    });
    this.TranslationApi.getTranslationjob(this.selectedTranslation.id)
      .subscribe((translationjob: Translationjob[]) => {
        this.Translationjob = translationjob
        // , this.Translationjob.forEach(element => {
        //      this.updateTranslation(element.job_id);
        //    })
      });
  }

  createTranslationJob(): void {
    this.TranslationApi.createTranslationjob(this.selectedTranslation.id)
      .subscribe(res => this.getTransationsjobs());
  }

  // count words in text 
  private wordCount(str) {
    return str.split(' ')
      .filter(function (n) { return n != '' })
      .length;
  }

  // calculate price 
  private priceCalculator() {
    // words, level, languagefrom, languageto 
    let totalamount = 0;
    this.Translationjob.forEach(job => {
      let jobwordcount = 0;
      jobwordcount = this.wordCount(job.body_src);
      let jobprice = 0;
      jobprice = jobwordcount * 0.1;
      totalamount = jobprice + totalamount;
    })
    const roundnumber = totalamount.toFixed(2);
    return roundnumber;
  }

  // test selection criteria
  getPublicationsList(): void {
    this.RelationsApi.findById(this.option.id, {
      where: {
        date: {
          gt: Date.now() - this.onemonth,
          limit: 20,
          order: 'date'
        }
      }
    })
      .subscribe((publications: Publications[]) => this.Publications = publications);
  }

  // search
  searchGo(name: string): void {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.trim();
    this.PublicationsApi.find({ where: { or: [{ newstitle: name }, { newstext: name }] } })
      .subscribe((publications: Publications[]) => this.Publications = publications,
        error => this.errorMessage = <any>error);
  }

  // select and set parameters Publications
  onSelect(publications: Publications): void {
    this.uploader.clearQueue();
    this.selectedPublications = publications;
    this.newURL = undefined;
    this.newURL = BASE_URL + '/api/Containers/' + this.selectedPublications.id + '/upload'
    this.uploader.setOptions({ url: this.newURL });
  }

  onSelectMailingList(mailinglist: Mailinglist): void {
    // this.uploaderContent.subscription.unsubscribe();
    this.maillist1 = [];
    this.maillist = [];
    this.mailinglistdetails = [];
    this.toggleuploadlist = true;

    this.selectedMailingList = mailinglist;
    this.MailinglistApi.mailinglistinfo(this.selectedMailingList.mailgunid)
      .subscribe(res => {
        this.selectedMailingList.total = res.list.members_count,
          this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
            .subscribe()
      });
    this.MailinglistApi.mailinglistinfo('open' + this.selectedMailingList.mailgunid)
      .subscribe(res => {
        this.selectedMailingList.totalopened = res.list.members_count,
          this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
            .subscribe()
      });
    this.MailinglistApi.mailinglistinfo('clicked' + this.selectedMailingList.mailgunid)
      .subscribe(res => {
        this.selectedMailingList.totalclicked = res.list.members_count,
          this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
            .subscribe()
      });
  }

  showMailingList(): void {
    let mailinglistitems = [];
    this.MailinglistApi.showaddresses(this.selectedMailingList.mailgunid)
      .subscribe(res => {
        mailinglistitems = res.items,
          // console.log(mailinglistitems);
          mailinglistitems.forEach((item, index) => {
            this.mailinglistdetails.push(item)
          }) // console.log(this.mailinglistdetails
      })
  }

  randomizeMailing(): void {
    this.randomService.openDialog(
      this.option.id, this.Account.companyId, this.selectedMailing, this.Mailinglist, this.Marketingplannerevents, this.Mailing)
    // console.log(this.selectedMailing)
  }

  // select and set parameters PublicationsTranslation
  onSelectTranslation(translation: Translation): void {
    this.translationJob = [];
    this.selectedTranslation = translation;
    this.getTransationsjobs();
    console.log(this.selectedTranslation.order_id)
    this.updateTranslation();
  }

  onSelectTranslationJob(translationjob: Translationjob): void {
    this.selectedTranslationjob = translationjob;
  }

  // save entry
  savePublication(): void {
    this.RelationsApi.updateByIdPublications(this.option.id, this.selectedPublications.id, this.selectedPublications)
      .subscribe();
  }

  public saveTranslationJob(Translationjob: Translationjob): void {
    this.selectedTranslationjob = Translationjob;
    this.TranslationApi.updateByIdTranslationjob(
      this.selectedTranslation.id, this.selectedTranslationjob.id,
      this.selectedTranslationjob)
      .subscribe(res => {
        const amount = this.priceCalculator();
        this.selectedTranslation.amount = amount;
        this.updateTranslationHolder();
      });
  };

  // dialog delete on yes activates deletePublications
  public openDialogDelete() {
    this.dialogsService
      .confirm('Delete Relation', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deletePublications(this.selectedOption);
      });
  }

  openDialogDeleteTranslation() {
    this.dialogsService
      .confirm('Delete Translation', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteTranslation(this.selectedOption);
      });
  }

  opendialogconfirmpayment() {
    const amount = this.priceCalculator(),
      id = this.selectedTranslation.id,
      transsubid = Math.floor(Math.random() * 100) + 1,
      date = Math.round(new Date().getTime() / 1000),
      transid = 'IXT' + date + '-' + transsubid,
      desctranjob = [],
      currencytra = 'EUR'; // ISO4217
      let descriptiontra,
      langdescr;
      this.Translationjob.forEach(job => { desctranjob.push(job.lc_tgt)})
      langdescr = desctranjob.join(', ');
      descriptiontra = 'online Translationid: ' + transid + ' language: ' + descriptiontra;
      this.selectedTranslation.transid = transid;
    
    this.dialogsService
      .confirm('Request Translation', 'Total Amount: €' + amount +
      ' Are you sure you want to do this? You will be redirected to the payment page')
      .subscribe(res => {
        // this.selectedOption = res,
        if (res) {
          this.RelationsApi.updateByIdTranslation(this.option.id, this.selectedTranslation.id, this.selectedTranslation)
          .subscribe(res => { 
        this.TranslationApi.getpayment(id, transid, amount, currencytra, descriptiontra, langdescr)
          .subscribe((url: string) => {
            if (url) { window.open(url, '_self') }
          });
        });
        }
      });
    // on confirm payment navigate to payment site
  }

  private updateTranslationHolder(): void {
    this.RelationsApi.updateByIdTranslation(this.option.id, this.selectedTranslation.id, this.selectedTranslation)
    .subscribe(res => {console.log(res)})
  }

  // publish to apps part
  public newpublication(i): void {
    const publication = this.Translationjob[i];
    const publicationdata: Publications = new Publications();
    publicationdata.text = publication.translation
    this.RelationsApi.createPublications(this.option, publicationdata)
    .subscribe(res => {console.log(res),
    this.selectedPublications = res});
    this.selectedIndex = 0;
  }

  public newwebsite(i): void {
    const newwebsid = this.Translationjob[i].id;
    const dialogRef = this.dialogWordpress.open(WordpressUploadDialogComponent, {
        width: '400px',
        data: {
          id: newwebsid,
          website: '',
          req: {
            user: '', 
            password: '' }
              }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this.TranslationjobApi.updatewordpress(newwebsid, result.website, result.req)
        .subscribe();
      });

    // open dialog select new page or translation total website
    // new page upload new page check wp options
    // translated website send to backend with correct credentials 
    // in api design create upload function for websites

  }
  
  public newmailcampaign(i): void {
    const newmailcampaign = this.translationJob[i];
  }

  public newsocialmedia(i): void {
    const newsocialmedia = this.translationJob[i];
  }

  // delete Publications -> check container?
  deletePublications(selectedOption): void {
    if (selectedOption === true) {
      this.containerApi.destroyContainer(this.selectedPublications.id).subscribe(),
        this.PublicationsApi.deleteById(this.selectedPublications.id).subscribe(res => {
          this.error = res,
            this.selectedPublications = null
          this.getPublications();
        })
    }
  }

  deleteTranslation(selectedOption): void {
    if (selectedOption === true) {
      this.RelationsApi.destroyByIdTranslation(this.option.id, this.selectedTranslation.id)
        .subscribe(res => { this.getTranslations(), this.selectedTranslation = null });
    }
  }

  openDialogDeleteTranslationJob() {
    this.dialogsService
      .confirm('Delete Translation Job', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteTranslationJob(this.selectedOption);
      });
  }

  deleteTranslationJob(selectedOption): void {
    if (selectedOption === true) {
      this.TranslationApi.destroyByIdTranslationjob(this.selectedTranslation.id, this.selectedTranslationjob.id)
        .subscribe(res => this.getTransationsjobs());
    }
  }

  public postToWordPress(): void {
    this.WordpressService.publishWP(this.selectedPublications.title, this.selectedPublications.text);
    // this.POSTwordpressApi.create(this.selectedPublications).subscribe(res => {
    //  this.error = res});
  }


  // Translation job and update job_id
  publishTranslationJob(selectedOption): void {
    // set custom data to get ids
    this.Translationjob.forEach((item, index) => {
      item.custom_data = item.id
    });
    // reduce for api
    if (selectedOption == true) {
      const jobs = this.Translationjob.reduce(function (acc, cur, i) {
        acc[i] = cur;
        return acc;
      }, {});

      this.TranslationApi.creategengojob(jobs, this.selectedTranslation.id).subscribe(res => {
        this.selectedTranslation.credits = res.credits_used,
          this.selectedTranslation.order_id = res.order_id,
          this.RelationsApi.updateByIdTranslation(this.option.id, this.selectedTranslation.id, this.selectedTranslation)
            .subscribe(res => {
              this.openSnackBar('Translation Requested')
            })
      });
    }
  }

  // get order info
  getOrderTranslation(order_id): void {
    // custom_data
  }


  // get update on jobS ! move to API as hook or automation
  updateTranslation(): void {
    console.log(this.selectedTranslation.order_id);
    this.TranslationApi.getorder(this.selectedTranslation.order_id).subscribe(res => {
      let jobsoverview = [];
      Object.keys(res.order).forEach(key => {
        if (Array.isArray(res.order[key])) {
          //console.log(key.length);          // the name of the current key.
          if (typeof key === 'string') { jobsoverview.push(res.order[key]) }
          else { res.order[key].foreEach((item) => { jobsoverview.map(item) }) }
        }
      }),
        jobsoverview = [].concat.apply([], jobsoverview),
        //console.log(jobsoverview),
        jobsoverview.forEach((item) => {
          //console.log(item),
            this.TranslationApi.getgengojob(item).subscribe(res => {
              this.MarkTranJobs = res.job,
                //console.log(this.MarkTranJobs)
              this.TranslationApi.updateByIdTranslationjob(
                this.selectedTranslation.id, this.MarkTranJobs.custom_data,
                {
                  'status': this.MarkTranJobs.status,
                  'body_tgt': this.MarkTranJobs.body_tgt,
                  'job_id': this.MarkTranJobs.job_id
                }).subscribe();

            });
        });
    });
  };

  // Mailing ______________________________________

  getMailing(): void {
    this.RelationsApi.getMailing(this.option.id,
      {
        order: 'id DESC',
        include: {
          relation: 'mailinglist'
        }
      })
      .subscribe((mailing: Mailing[]) => this.Mailing = mailing);
  }

  createMailing(): void {
    this.RelationsApi.createMailing(this.option.id, { subject: 'new', relationname: this.option.relationname })
      .subscribe(res => {  this.onSelectMailing(res), this.Mailing.push(res); });
  }

  editMailing(): void {
    this.updateMailingObj = this.selectedMailing;
  }

  copyFromMailing(): void {
    this.selectedMailing.html = this.copyfrommailing.html;
    this.selectedMailing.subject = this.copyfrommailing.subject;
    this.selectedMailing.sectionStyle = this.copyfrommailing.sectionStyle;
    this.selectedMailing.templatearray = this.copyfrommailing.templatearray;
    this.selectedMailing.columnStyle = this.copyfrommailing.columnStyle;
  }

  sendMailing(): void {
    // this.selectedMailing.to = '';
    const mailtolist = [];
    let tolist = '';

        // join multiple lists
    this.selectedMailing.selectedlists.forEach(list => {
          mailtolist.push(list.listname)
      })

    this.selectedMailing.mailinglist.forEach(listitem => {
        mailtolist.push(listitem.mailgunid);
        const checkpos = mailtolist.indexOf(listitem.listname);
        console.log(checkpos);
        if (checkpos !== -1 ){
          mailtolist.splice(checkpos, 1);
        }
    });

    console.log(mailtolist);

    if (Array.isArray(this.selectedMailing.mailinglist) && this.selectedMailing.mailinglist.length > 1) {
      // create comma seperate for mailgun processing
      this.selectedMailing.to = mailtolist.join(', ')
    } else { this.selectedMailing.to = mailtolist.join() };

    this.selectedMailing.text = this.onChangeHtml(this.selectedMailing.html),
      this.MailingApi.sendmailing(this.selectedMailing, this.selectedMailing.id)
        .subscribe(res => {
          this.response = res,
            this.selectedMailing.send = true;
          this.selectedMailing.status = this.response.message,
            this.openSnackBar(this.response.message), this.saveMailing();
        }, err => this.response = err);
  }

  onSelectMailing(mailing: Mailing): void {
    this.selectedItems = [];
    this.selectedMailing = null;
    this.selectedMailing = mailing;
    this.mailingaddress = '';
    this.setFilterMailing();
    // this.mailingaddress = this.selectedMailing.selectedlists[0];
    // this.getAnalytics();

    this.Googleanalyticsreturn = '';
    this.avgTimeOnPage = '';
    this.bounceRate = '';
    this.goalStartsAll = '';
    this.pageview = '';

    this.mailingaddresscampaign = []; // first clean up a few things
    this.selectedItems = [];
    if (this.mailingaddress === undefined) { this.mailingaddress = []; }
    if (this.selectedMailing.selectedlists[0] !== undefined) {
      Object.keys(this.selectedMailing.selectedlists).forEach(key => {
        const value = this.selectedMailing.selectedlists[key];
        // console.log(this.selectedMailing.selectedlists);
        if (value.listname){
          this.selectedItems.push(value.listname);
        } else {this.selectedItems.push(value)}
      })
    }
    this.prepareFilterMaillist(); // quick selection list


    // set upload url for pictures and dialog

    this.urlckeditorupload = BASE_URL + '/api/Containers/' + this.option.id + '/upload/';

    // set upload url for pictures
    CKEDITOR.config.filebrowserBrowseUrl = BASE_URL + '/filemanager/' + this.option.id;
    CKEDITOR.config.filebrowserUploadUrl = this.urlckeditorupload;
    CKEDITOR.config.filebrowserImageBrowseUrl = BASE_URL + '/filemanager/' + this.option.id;
    CKEDITOR.config.filebrowserImageUploadUrl = this.urlckeditorupload;
  }

  onRequestCkEvent(evt): void {
    evt.stop(); // stop event and set data manual see above
    console.log('fileuploadresponse', evt)
    const url = BASE_URL + '/api/Containers/' + this.option.id + '/download/'
    const data = evt.data;
    data.url = url + data.fileLoader.fileName;
    // let finalurl = encodeURI(data.url)
    // data.fileName = data.fileLoader.fileName,
    // data.uploaded = 1;
    // const funcNum = 1;
    CKEDITOR.tools.callFunction(1, data.url);

  };


  saveMailing(message?): void {
    this.selectedMailing.text = this.onChangeHtml(this.selectedMailing.html); //convert to text
    // dats is set on select
    if (this.selectedMailing.date == null) {
      this.date = moment().format();
      this.selectedMailing.date = this.date
    }
    // timezone
    if (this.selectedMailing.timezone == null) {
      this.selectedMailing.timezone = moment.tz.guess();
    }

    // time
    if (this.selectedMailing.time == null) {
      this.time = moment().format('hh:mm')
      this.selectedMailing.time = this.time;
    }

    this.selectedMailing.date = this.timeconv.convertTime(this.selectedMailing.date, this.selectedMailing.time, this.selectedMailing.timezone);

    // this.selectedMailing.selectedlists = [];

    // // set mailinglists from dropdown
    // if (this.mailingaddress.id) {
    //   this.selectedMailing.mailinglistId = [];
    //   // this.MailingApi.linkMailinglist(this.selectedMailing.id, this.mailingaddress.id).subscribe()
    //   this.selectedMailing.mailinglistId.push(this.mailingaddress.id), // set mailinlist id for relation.
    //     this.selectedMailing.to = this.mailingaddress.mailgunid,
    //     this.selectedMailing.selectedlists.push(this.mailingaddress);

    //   this.RelationsApi.updateByIdMailing(this.option.id, this.selectedMailing.id, this.selectedMailing)
    //     .subscribe(res => {
    //       this.getMailing()
    //       if (message !== undefined) { this.openSnackBar('message saved') }
    //     });
    // }

    // no mailinglist but seperate email
  //   else if (this.mailingaddress !== undefined) { // email address not list
  //     this.selectedMailing.mailinglistId = []; // reset if still existing

  //     if (this.mailingaddress.listname === undefined) {
  //       this.selectedMailing.selectedlists = [{ listname: this.mailingaddress }]
  //     }

  //     else { this.selectedMailing.selectedlists = [this.mailingaddress] } // same here

  //     this.selectedMailing.to = this.selectedMailing.selectedlists[0].listname;
       this.RelationsApi.updateByIdMailing(this.option.id, this.selectedMailing.id, this.selectedMailing)
         .subscribe(res => {
           this.getMailing()
         if (message !== undefined) { this.openSnackBar('message saved') }
         });
  //   }
  //   // nothing filled in
  //   else { this.openSnackBar('Please input Email or Mailinglist') }
 }

  setFilterMailing(): void {
    this.filteredmailinglist = this.myAddressListControl.valueChanges
      .pipe(
        startWith(''),
        // map(options => options && typeof options === 'object' ? options.relationname : options),
        map(relationname => relationname ? this.filter(relationname) : this.options.slice())
      );
  }

  getEmailAddresslist(): void {
    this.Account.email
  }

  myAddressListControl: FormControl = new FormControl();

  getMailinglistEntry(): void {
    this.mailinglist = [];
    for (const mailinglist of this.Mailinglist) {
      this.mailinglist.push(mailinglist);
    }
  }

  filteredmailinglist: Observable<string[]>;

  filterMailing(email: string) {
    return this.mailinglist.filter(mailingaddress =>
      mailingaddress.listname.toLowerCase().indexOf(email.toLowerCase()) === 0);
  }


  displayFnMailing(mailinglist): string {
    return mailinglist ? mailinglist.listname : mailinglist;
  }

  public openDialogDeleteMailing() {
    this.dialogsService
      .confirm('Delete Mailing', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteMailing(this.selectedOption);
      });
  }

  public deleteMailing(selectedOption): void {
    if (selectedOption == true) {
      this.RelationsApi.destroyByIdMailing(this.option.id, this.selectedMailing.id)
        .subscribe(res => {
          this.error = res,
            this.selectedMailing = undefined,
            this.getMailing();
          this.openSnackBar('Mailing Deleted')
          // this.Mailing.splice(this.index, 1)
        })
    }
  }

  public openDialogScheduleMailing() {
    this.dialogsService
      .confirm('Schedule Mailing', 'Your mailing will be scheduled for delivery')
      .subscribe(res => {
        this.selectedOption = res, this.ScheduleMailing(this.selectedOption);
      });
  }

  public ScheduleMailing(selectedOption): void {

    if (selectedOption === true) {
      this.selectedMailing.scheduled = true,
        this.saveMailing(), this.openSnackBar('message Scheduled'), this.getMailingCampaignMailings();
    }
  }

  public toggleTextView(): void {
    if (this.toggletextview === true) {
      this.toggletextview = false
    }
    else { this.toggletextview = true }
  }

  // search mailing subject only
  public searchGoMailing(searchentry): void {
    this.RelationsApi.getMailing(this.option.id, { where: { subject: searchentry } })
      .subscribe((mailing: Mailing[]) => this.Mailing = mailing);
  }

  // get all the all the lists and get total count and total number of leads in it.
  getMailinglist(): void {
    this.mailinglistcount = 0;
    this.mailinglisttotal = 0;
    this.RelationsApi.getMailinglist(this.option.id, { order: 'listname ASC' })
      .subscribe((mailinglist: Mailinglist[]) => {
        this.Mailinglist = mailinglist,
          this.getMailinglistEntry(),

          this.RelationsApi.countMailinglist(this.option.id).subscribe(res => this.mailinglistcount);
        this.Mailinglist.forEach((list) => {
          this.mailinglisttotal = this.mailinglisttotal + list.total
        });
      });
  }


  public createMailingList(): void {
    this.RelationsApi.createMailinglist(this.option.id, this.newMailinglist)
      .subscribe(res => {
        this.createItem = res, this.selectedMailingList = this.createItem, this.createMailingListMG(), this.newmailinglisttoggle = false
      });
  }

  // create mailgun open/clicked/main lists
  public createMailingListMG(): void {
    this.MailinglistApi.createmailinglist(this.selectedMailingList)
      .subscribe(res => { this.mailingresponse = res, this.updateMailingList() });
  }

  public saveMailingList(): void {
    this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
      .subscribe(res => this.getMailinglist());
  }


  public toggleNewMailinglist(): void {
    // this.mailinglistForm.resetForm();
    this.newmailinglisttoggle = true;
  }

  public updateMailingList(): void {
    this.selectedMailingList.mailgunid = this.mailingresponse.list.address;
    this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
      .subscribe(res => this.getMailinglist());
  }

  public deleteMailingList(): void {
    this.toggleuploadlist = false;
    this.MailinglistApi.deletemailinglist(this.selectedMailingList.id)
      .subscribe();
    this.RelationsApi.destroyByIdMailinglist(this.option.id, this.selectedMailingList.id)
      .subscribe(res => this.getMailinglist(), this.selectedMailingList = undefined)
  }

  // search mailing subject only
  public searchGoMailingList(searchentry): void {
    this.RelationsApi.getMailing(this.option.id, { where: { subject: searchentry } })
      .subscribe((Mailing: Mailing[]) => this.Mailing = Mailing);
  }

  // convert files
  public xlsxUploaded(result: UploadResult) {
    this.maillist = [];
    this.headers = [];
    this.emailheader = '';
    this.firstnameheader = '';
    this.lastnameheader = '';
    this.companyheader = '';
    this.titleheader = '';
    this.mailinglistheader = '';
    this.websiteheader = '';
    this.const1header = '';
    this.const2header = '';
    this.const3header = '';
    this.const4header = '';
    this.createnewmailinglistonfield = false;
    this.uploadlistId = [];
    this.uploaderContent.next(JSON.stringify(result.payload));
    this.maillist1 = result.payload[0];

  //  this.headers.push(Object.keys(this.maillist1[0])[0]);


    let i = 0;
    do {
      this.headers.push(Object.keys(this.maillist1[0])[i]);
      console.log(Object.keys(this.maillist1[0])[i]);
      i++;
    }
    while (Object.keys(this.maillist1[0])[i] !== undefined);
    this.headers.push('');

  }

   // set variable and upload + save reference in Publications
   setupload(name): void {
    // this.uploader.clearQueue(),
    // this.newURL = undefined,
    // this.newURL = BASE_URL + '/api/Containers/' + this.option.id + '/upload',
    // this.uploader.setOptions({ url: this.newURL }),
    this.uploader.uploadAll();
    // define the file settings
    this.newFiles.name = name;
      this.newFiles.url = BASE_URL + "/api/Containers/" + this.option.id + "/download/" + name;
      this.newFiles.createdate = new Date();
      this.newFiles.type = "general";
      this.newFiles.companyId = this.Account.companyId;
  }

  uploadFilelarge(): void {
      this.RelationsApi.createFiles(this.option.id, this.newFiles)
        .subscribe(res => { this.MailinglistApi.addlargelist(this.option.id, this.Account.companyId, this.newFiles.url)
        .subscribe(res1 => {this.openSnackBar(res1), this.uploader.clearQueue()})}
        );
  }

  public openmailinglistwebsite(i): void {
    console.log(this.mailinglistdetails[i]);
    let res = this.mailinglistdetails[i].vars.website.substring(0, 3);
    let web = this.mailinglistdetails[i].vars.website
    res = res.toLowerCase();
    if (res === 'www') { window.open('http://' + web, '_blank'); }
    else if (res === 'htt') { window.open(web, '_blank'); }
    else { this.dialogsService.confirm('Not a valid URL', 'Please edit'); };
  }

  public async setHeaderPrepImport(): Promise<void> {
    const importlist = this.maillist;
    let size = importlist.length;
    this.maillist1.forEach((value) => {
      // fixed format name, firstname, lastname, address, company, mailinglist
      if (this.companyheader === undefined) { this.openSnackBar('Info missing or wrong format'); }
      else {
        // create import value
        const importvalue = {
          name: value[this.firstnameheader] + ' ' + value[this.lastnameheader],
          address: value[this.emailheader], // change to value[valueselected]
          consts: {
            company: value[this.companyheader],
            firstname: value[this.firstnameheader],
            lastname: value[this.lastnameheader],
            title: value[this.titleheader],
            website: value[this.websiteheader],
            mailing: value[this.mailinglistheader],
            const1: value[this.const1header],
            const2: value[this.const2header],
            const3: value[this.const3header],
            const4: value[this.const4header]
          }
        }
        this.maillist.push(importvalue);
      }
    })
  }

  // convert html to text
  onChangeHtml(message) {
    if (message) {
      let text = message.replace(/<(?:.|\n)*?>/gm, '');
      text = text.replace(/&nbsp;/g, '');
      return text;
    }
  }

  // import and and update totals
  public runImportMailingList(): void {
    this.setHeaderPrepImport().then(() => {

      if (this.createnewmailinglistonfield === true) {
        // get all unique mailinglist names and trim
        const uniquelistname = Array.from(new Set(this.maillist.map((item: any) => item.consts.mailing.trim())));
        // check if it exists in current mailinglist !error prone as it is text only..
        this.Mailinglist.forEach((value) => {
          const checkpos = uniquelistname.indexOf(value.listname)
          if (checkpos !== -1) {
            this.uploadlistId.push({ listname: value.listname, mailid: value.id }),
              uniquelistname.splice(checkpos, 1)
          }
        })
        console.log(this.uploadlistId),
          this.createNewListUpload(uniquelistname)
      }
      else { this.listname = this.selectedMailingList.id, this.importlist() };
    })
  }

  public createNewListUpload(uniquelistname) {
    const Uniquelistname = uniquelistname;
    this.dialogsService
      .confirm('This will create: ' + Uniquelistname.length + ' new Mailing Lists', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.createNewUpListMultiple(Uniquelistname, this.selectedOption);
      });
  }

  public async createNewUpListMultiple(Uniquelistname, selectedOption): Promise<void> {
    const uniquelistname = Uniquelistname;
    console.log(uniquelistname.length);

    if (selectedOption === true) {
      if (uniquelistname.length > 1) {
        const value = await this.createSeperateMailinglists(uniquelistname);
        this.uploadMultipleList(value);

      } else { this.uploadMultipleList(this.uploadlistId); }
    } else { this.listname = this.selectedMailingList.id, this.importlist() }; // watch otherwise full list will upload to selection
  }

  public async createSeperateMailinglists(uniquelistname) {
    return new Promise((resolve, reject) => {
      let count = 0;
      uniquelistname.forEach((value) => {
        this.RelationsApi.createMailinglist(this.option.id, { listname: value })
          .subscribe(res1 => { // update mailgun id in loopback & set uploadid
            this.MailinglistApi.createmailinglist(res1).subscribe(res2 => {
              res1.mailgunid = res2.list.address;
              this.RelationsApi.updateByIdMailinglist(this.option.id, res1.id, res1)
                .subscribe(res => {
                  this.uploadlistId.push({ listname: res.listname, mailid: res.id }),
                    ++count;
                  if (count === uniquelistname.length) { resolve(this.uploadlistId) }
                });
            })
          })
      })
    })
  }

  public togglemultiplelist(): void {
    this.uploader.clearQueue(),
    this.newURL = undefined,
    this.newURL = BASE_URL + '/api/Containers/' + this.option.id + '/upload',
    this.uploader.setOptions({ url: this.newURL }),
    this.uploader.uploadAll();
    if (this.toggleuploadlist === true){
      this.toggleuploadlist = false
    } else { this.toggleuploadlist = true}
  }

  public uploadMultipleList(uploadlistId): void {

    const importlist = this.maillist;
    let size = importlist.length;
    const x = size / 999; // check if larger then 999 split as api limit is <1000
    if (x > 1) {
      for (let i = 1; i < x; i++) {
        const result = importlist.slice(0, 999);
        importlist.splice(0, 999)
        size = importlist.length;
        const uploadlistfinal = result;
        const id = 'alnfaisufhu76!@';
        const req = {
          maillist: uploadlistfinal,
          listname: uploadlistId
        }
        console.log(req);
        this.MailinglistApi.uploadMultipleList(req).subscribe();
      }
    }
    this.openSnackBar('Running Multi-List upload in background')
  }

  public importlist(): void {
    this.listname = this.selectedMailingList.id;
    // move up --> this.listname = this.selectedMailingList.id;
    const importlist = this.maillist;
    let size = importlist.length;
    const x = size / 500; // check if larger then 500 split as api limit is <1000
    if (x > 1) {
      for (let i = 1; i < x; i++) {
        const result = importlist.slice(0, 500);
        importlist.splice(0, 500)
        size = importlist.length;
        const uploadlistfinal = result.reduce(function (acc, cur, i) {
          acc[i] = cur;
          return acc;
        }, {});;
        if (uploadlistfinal[0].address === undefined) { this.openSnackBar('Email missing or wrong format'); }
        else {
          this.MailinglistApi.uploadmailinglist(uploadlistfinal, this.listname)
            .subscribe(res => {
              this.callback = res,
                this.selectedMailingList.total = this.callback.list.members_count,
                this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
                  .subscribe();
            });
        }
      }
    }
    else {
      const uploadlistfinal = this.maillist.reduce(function (acc, cur, i) {
        acc[i] = cur;
        return acc;
      }, {});;
      if (uploadlistfinal[0].address === undefined) { this.openSnackBar('Email missing or wrong format'); }
      else {
        this.MailinglistApi.uploadmailinglist(uploadlistfinal, this.listname)
          .subscribe(res => {
            this.callback = res,
              this.selectedMailingList.total = this.callback.list.members_count,
              this.RelationsApi.updateByIdMailinglist(this.option.id, this.selectedMailingList.id, this.selectedMailingList)
                .subscribe(res => { console.log(res), this.openSnackBar('Upload Started') });
          });
      }
    }

  };

  public runImportDeleteListMember(): void {
    this.listname = this.selectedMailingList.id,
      this.setHeaderPrepImport(),
      this.listname = this.selectedMailingList.id;
    const importlist = this.maillist;
    const size = importlist.length;
    const x = size / 500; // check if larger then 500 split as api limit is <1000
    const uploadlistfinal = this.maillist.reduce(function (acc, cur, i) {
      acc[i] = cur;
      return acc;
    }, {});
    this.MailinglistApi.deleteaddresses(this.selectedMailingList.mailgunid, uploadlistfinal)
      .subscribe(res => { this.openSnackBar('Running in background') });
  };

  public runImportVerifyList(): void {
    // let importlist = this.maillist;
    this.listname = this.selectedMailingList.id;
    // let size = importlist.length;
    // let x = size / 500; // check if larger then 500 split as api limit is <1000
    const uploadlistfinal = this.maillist.reduce(function (acc, cur, i) {
      acc[i] = cur;
      return acc;
    }, {});;
    if (uploadlistfinal[0].address === undefined) { this.openSnackBar('Email missing or wrong format'); }
    else {
      this.MailinglistApi.verifylist(uploadlistfinal, this.listname)
        .subscribe();
      this.openSnackBar('Verify running in background');
    }
  };


  public checkListOrCreate(): void {
    this.uploadlistId = [];
    this.setHeaderPrepImport()
    if (this.createnewmailinglistonfield === true) {
      // get all unique mailinglist names and trim
      const uniquelistname = Array.from(new Set(this.maillist.map((item: any) => item.consts.mailing.trim())));
      // check if it exists in current mailinglist !error prone as it is text only..
      this.Mailinglist.forEach((value) => {
        const checkpos = uniquelistname.indexOf(value.listname)
        if (checkpos !== -1) {
          this.uploadlistId.push({ listname: value.listname, mailid: value.id }),
            uniquelistname.splice(checkpos, 1)
        }
      })
      console.log(this.uploadlistId),
        this.createNewListMultipleDialog(uniquelistname)
    }
    else { this.listname = this.selectedMailingList.id, this.runImportVerifyList() };
  }

  public createNewListMultipleDialog(uniquelistname): void {
    const Uniquelistname = uniquelistname;
    this.dialogsService
      .confirm('This will create: ' + Uniquelistname.length + ' new Mailing Lists', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.createNewListMultiple(Uniquelistname, this.selectedOption);
      });
  }

  public createNewListMultiple(Uniquelistname, selectedOption): void {
    const uniquelistname = Uniquelistname;
    console.log(uniquelistname);

    if (selectedOption === true) {
      if (uniquelistname.length > 1) {
        uniquelistname.forEach((value) => {
          this.RelationsApi.createMailinglist(this.option.id, { listname: value })
            .subscribe(res1 => { // update mailgun id in loopback & set uploadid
              this.MailinglistApi.createmailinglist(res1).subscribe(res2 => {
                res1.mailgunid = res2.list.address;
                this.RelationsApi.updateByIdMailinglist(this.option.id, res1.id, res1)
                  .subscribe(res => { this.uploadlistId.push({ listname: res.listname, mailid: res.mailgunid }) }
                  );
              })
            })
        })
      } else { this.uploadVerifyList(); }
    } else { this.runImportVerifyList(); }
  }

  public uploadVerifyList(): void {
    const id = 'alnfaisufhu76!@';
    const req = {
      maillist: this.maillist,
      listname: this.uploadlistId
    }
    console.log(req);
    this.MailinglistApi.uploadMultipleList(req).subscribe();
  }


  /* Leave in for future purpose when exceeding API max size split in to sections
    Propably better option to move other list changes and iteration to server side*/

  // public getEmailAddresses(): void {
  //   this.setHeaderPrepImport(),
  //     this.listname = this.selectedMailingList.id;
  //   let importlist = this.maillist;
  //   let size = importlist.length;
  //   let x = size / 500; // check if larger then 500 split as api limit is <1000
  //   let uploadlistfinal = this.maillist.reduce(function (acc, cur, i) {
  //     acc[i] = cur;
  //     return acc;
  //   }, {});;
  //   this.MailinglistApi.findmailaddresses(uploadlistfinal, this.listname)
  //     .subscribe();
  //   this.openSnackBar('Find Email running in background');
  // }

  deleteOneMailingList(address?): void {
    // if (address !== null) { this.oneaddress = address } creates error address is not used so not use for fixing
    this.oneaddress = this.oneaddress.replace(/ /g, '');
    this.MailinglistApi.deleteoneaddress(this.selectedMailingList.mailgunid, this.oneaddress)
      .subscribe(res => this.openSnackBar(res.message));
  }

  addOneMailingList(): void {
    this.MailinglistApi.addoneaddress(this.selectedMailingList.mailgunid,
      this.oneaddress,
      this.firstname,
      this.lastname,
      this.company,
      this.title)
      .subscribe(res => this.openSnackBar(res.message));
  }


  // error! returns full filter not working.
  public getAnalyticsCampaign(i) {
    // for each mailing get stats
    console.log(this.CampaignMailing[i].id)
    this.analytics_filters = 'ga:adContent==' + this.CampaignMailing[i].id;
    this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, this.analytics_startdate,
      this.analytics_enddate, this.analytics_dimensions, this.analytics_metrics, this.analytics_filters)
      .subscribe((data) => {
        let obj = data.rows.find(o => o[0] === this.CampaignMailing[i].id);
        if (obj !== undefined) {
          this.Googleanalyticsreturn = obj; // data.rows[0],
          this.avgTimeOnPage = this.Googleanalyticsreturn[4];
          this.bounceRate = this.Googleanalyticsreturn[1];
          this.goalStartsAll = this.Googleanalyticsreturn[3];
          this.pageview = this.Googleanalyticsreturn[2];
        } else { this.avgTimeOnPage = 'No Data to show' };
        if (!data){this.openSnackBar('No website statistics found, try back later');
      }
      }) 
  }

  public getAnalytics() {
    this.analytics_filters = 'ga:adContent==' + this.selectedMailing.id;
    this.GoogleanalyticsApi.getanalyticsreport(this.selectedanalytics.id, this.analytics_ids, this.analytics_startdate,
      this.analytics_enddate, this.analytics_dimensions, this.analytics_metrics, this.analytics_filters)
      .subscribe((data) => {

        const obj = data.rows.find(o => o[0] === this.selectedMailing.id);
        if (obj !== undefined) {
          this.Googleanalyticsreturn = obj; // data.rows[0],
          this.avgTimeOnPage = this.Googleanalyticsreturn[4];
          this.bounceRate = this.Googleanalyticsreturn[1];
          this.goalStartsAll = this.Googleanalyticsreturn[3];
          this.pageview = this.Googleanalyticsreturn[2];
        } else { this.avgTimeOnPage = 'No Data to show' }
      }), this.openSnackBar('No website statistics found, try back later'); // error => { console.log(error),

  }


  public getMailingCampaign(): void {
    this.RelationsApi.getMarketingplannerevents(this.option.id,
      {
        include: {
          relation: 'mailinglist', // include the owner object
        }
      })
      .subscribe((marketingplannerevents: Marketingplannerevents[]) => { this.Marketingplannerevents = marketingplannerevents }
      )
  }

  public getMailingCampaignMailings(): void {
    // select send/done/all/not send
    this.toggleCampaignMailing = [];
    this.togglecampaignclasstrans = [];
    this.toggleshorttext = [];
    this.htmlpreview = [];

    let filter;
    if (this.filtermailingselect === 'send') { filter = { where: { send: true } } }
    if (this.filtermailingselect === 'done') { filter = { where: { done: true } } }
    if (this.filtermailingselect === 'not send') { filter = { where: { send: false } } }
    if (this.filtermailingselect === 'all') { filter = '' }
    this.CampaignMailing = [];
    this.MarketingplannereventsApi.getMailing(this.selectedMarketingplannerevents.id, filter)
      .subscribe((CampaignMailing: Mailing[]) => {
        this.CampaignMailing = CampaignMailing,
          // toggle for css class activation
          this.CampaignMailing.forEach((mailing, index) => {
            this.toggleCampaignMailing.push(false);
            this.togglecampaignclasstrans.push(false); // transfer css
            this.toggleshorttext.push(true); // show short text
            this.htmlpreview.push(this.sanitizer.bypassSecurityTrustHtml(mailing.html)); // accept css innerhtml ng2
            // this.getAnalyticsCampaign(index);
          }
          )
      });
  }

  // copy from existing mails
  copyFromMailingCampaign(i): void {
    this.CampaignMailing[i].html = this.copyfrommailing.html;
    this.CampaignMailing[i].subject = this.copyfrommailing.subject;
    this.CampaignMailing[i].to = this.copyfrommailing.to;
    this.CampaignMailing[i].from = this.copyfrommailing.from;
    this.CampaignMailing[i].title = this.copyfrommailing.title;
  }

  public showTemplatePreview(): void {
    let htmlpreview = [];
    htmlpreview.push(this.sanitizer.bypassSecurityTrustHtml(this.selectedMailing.html));
    this.dialogsService
      .confirm('', '', htmlpreview[0])
      .subscribe();
  }

  public showMailPreview(i): void {
    this.htmlpreview[i] = this.sanitizer.bypassSecurityTrustHtml(this.CampaignMailing[i].html);
    this.dialogsService
      .confirm('', '', this.htmlpreview[i])
      .subscribe();
  }

  public createMarketingPlannerevents(): void {
    this.RelationsApi.createMarketingplannerevents(this.option.id, { companyId: this.Account.companyId, name: 'New' })
      .subscribe(res => {
        this.Marketingplannerevents.push(res),
          this.onSelectMarketingplannerevents(res),
          this.getMailingCampaign()
      });
  }

  public createCampaignMailing(): void {
    this.MarketingplannereventsApi.createMailing(this.selectedMarketingplannerevents.id, { title: 'new' })
      .subscribe(res => {
        this.CampaignMailing.push(res), this.toggleCampaignMailing.push(true),
          this.togglecampaignclasstrans.push(false) // css fix
      });
  }

  public onSelectMarketingplannerevents(marketingplannerevents: Marketingplannerevents): void {

    this.Googleanalyticsreturn = '';
    this.avgTimeOnPage = '';
    this.bounceRate = '';
    this.goalStartsAll = '';
    this.pageview = '';

    // this.selectedMarketingplannerevents = undefined;
    this.mailingaddresscampaign = []; // first clean up a few things
    this.selectedItems = [];
    this.selectedMarketingplannerevents = marketingplannerevents; // select current
    this.filtermailingselect = 'all'; // standaard filter mailings
    this.getMailingCampaignMailings(); // get mailings for specific campaign
    // check for mailinglist and add to if not existing
    if (this.selectedMarketingplannerevents.mailinglist === undefined) { this.selectedMarketingplannerevents.mailinglist = []; }
    if (this.selectedMarketingplannerevents.mailinglist[0] !== undefined) {
      Object.keys(this.selectedMarketingplannerevents.mailinglist).forEach(key => {
        const value = this.selectedMarketingplannerevents.mailinglist[key];
        this.selectedItems.push(value.listname);
      })
    }
    this.prepareFilterMaillist(); // quick selection list
    this.urlckeditorupload = BASE_URL + '/api/Containers/' + this.option.id + '/upload/';

    // set upload url for pictures
    CKEDITOR.config.filebrowserBrowseUrl = BASE_URL + '/filemanager/' + this.option.id;
    CKEDITOR.config.filebrowserUploadUrl = this.urlckeditorupload;
    CKEDITOR.config.filebrowserImageBrowseUrl = BASE_URL + '/filemanager/' + this.option.id;
    CKEDITOR.config.filebrowserImageUploadUrl = this.urlckeditorupload;
  }


  // chipinput for mailings
  @ViewChild('chipInput') chipInput: MatInput;
  selectedItems: string[] = [];
  filteredItems: Observable<any[]>;
  addItems: FormControl;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  // update the array value
  get itemsData(): string[] {
    return this.selectedItems;
  }

  // update the array value
  set itemsData(v: string[]) {
    this.selectedItems = v;
  }

  prepareFilterMaillist() {
    // formcontrol initialization
    this.addItems = new FormControl();

    // asynchronous value changes via reactive form control
    // import Reactive forms module for using it
    this.filteredItems = this.addItems.valueChanges
      .pipe(
        startWith(''),
        map(item =>
          item ? this.filterItems(item.toString()) : this.mailinglist.slice())
      );
  }

  // filter the Languages with its matched text
  filterItems(itemName: string) {
    return this.mailinglist.filter(item =>
      item.listname.toLowerCase().indexOf(itemName.toLowerCase()) === 0);
  }


  // removes the items based on its name
  onRemoveItems(itemName: string, i): void {
    this.selectedItems = this.selectedItems.filter((name: string) => name !== itemName);
    this.itemsData = this.selectedItems;
    this.chipInput['nativeElement'].blur();
    this.selectedMarketingplannerevents.mailinglistId.splice(i);
    this.selectedMarketingplannerevents.mailinglist.splice(i);
    this.saveMailingCampaign('saved');
  }

  
  // removes the items based on its name
  onRemoveItemsMailing(itemName: string, i): void {
    this.selectedItems = this.selectedItems.filter((name: string) => name !== itemName);
    this.itemsData = this.selectedItems;
    this.chipInput['nativeElement'].blur();
    //check name and remove from all lists
    this.selectedMailing.mailinglist.forEach((list, index)=> {
      if (list.listname === itemName){
        console.log(index, 'index')
        this.selectedMailing.mailinglist.splice(index, 1);
        this.selectedMailing.mailinglistId.splice(index, 1);
      }
    })
    this.selectedMailing.selectedlists.splice(i, 1);
    // this.saveMailing('saved');
  }

  // adding items
  // todo change 
  onAddItems(event: MatAutocompleteSelectedEvent) {
    const t: Mailinglist = event.option.value;
    // if array is empty then push the elements
    if (this.selectedItems.length === 0) {
      this.selectedItems.push(t.listname);
      this.selectedMarketingplannerevents.mailinglistId.push(t.id);
      // this.selectedMarketingplannerevents.mailinglist.push(t);
    } else {
      // if items already present then items will not be added to the array
      // stringfying the array to find names similiar
      const selectMailingStr = JSON.stringify(this.selectedItems);
      if (selectMailingStr.indexOf(t.listname) === -1) {
        this.selectedItems.push(t.listname);
        this.selectedMarketingplannerevents.mailinglistId.push(t.id);
        // this.selectedMarketingplannerevents.mailinglist.push(t);
      }
    };
    // filter those mailinglists that are selected to avoid duplication
    this.itemsData = this.selectedItems;
    this.chipInput['nativeElement'].blur();
    this.chipInput['nativeElement'].value = '';
  }

  onAddItemsMailing(event: MatAutocompleteSelectedEvent) {
    if (this.selectedMailing.mailinglist === undefined) {
      this.selectedMailing.mailinglist = [];
    }
    if (this.selectedMailing.selectedlists === undefined) {
      this.selectedMailing.selectedlists = [];
    }
    const t = event.option.value;
    // if array is empty then push the elements
    // if (this.selectedItems.length === 0) {
    //   const listn = t.listname;
    //   this.selectedItems.push(listn);
    //   this.selectedMailing.mailinglistId.push(t.id);
    //   this.selectedMailing.mailinglist.push(listn);
    // } else {
      // if items already present then items will not be added to the array
      // stringfying the array to find names similiar
      const selectMailingStr = JSON.stringify(this.selectedItems);
      if (selectMailingStr.indexOf(t.listname) === -1) {
        this.selectedItems.push(t.listname);
        this.selectedMailing.mailinglistId.push(t.id);
        this.selectedMailing.mailinglist.push(t);
        this.selectedMailing.selectedlists.push(t.listname);
      //}
    };

    // filter those mailinglists that are selected to avoid duplication
    this.itemsData = this.selectedItems;
    this.chipInput['nativeElement'].blur();
    this.chipInput['nativeElement'].value = '';
  }


  onAddItemManual($event){
    if (this.selectedMailing.mailinglist === undefined) {
      this.selectedMailing.mailinglist = [];
    }
    if (this.selectedMailing.selectedlists === undefined) {
      this.selectedMailing.selectedlists = [];
    }
    // console.log($event);
    // this.mailingaddress = $event.srcElement.value;
    this.selectedItems.push($event.srcElement.value);
    this.selectedMailing.mailinglist.push($event.srcElement.value);
    this.selectedMailing.selectedlists.push({ listname: $event.srcElement.value });
    this.itemsData = this.selectedItems;
    this.chipInput['nativeElement'].blur();
    this.chipInput['nativeElement'].value = '';
  }

  toggleCampaignMailingNow(i): void {
    // delay to anticipate css style change per mailing i = array mailing list
    if (this.togglecampaignclasstrans[i] === true) { this.togglecampaignclasstrans[i] = false } else {
      this.togglecampaignclasstrans[i] = true;
    }
    setTimeout(() => {
      if (this.toggleCampaignMailing[i] === true) { this.toggleCampaignMailing[i] = false } else { this.toggleCampaignMailing[i] = true; }
     }, 500);
  }

  toggleToFullText(i): void {
    if (this.toggleshorttext[i] === false) {
    this.toggleshorttext[i] = true;
    } else { this.toggleshorttext[i] = false }
  }

  saveMailingCampaign(message?): void {
    // count for listview numbers

    this.CampaignMailing.forEach(mailElement => {
      mailElement.text = this.onChangeHtml(mailElement.html); // convert to text

      // dats is set on select
      if (mailElement.date == null) {
        this.date = moment().format();
        mailElement.date = this.date
      }
      if (mailElement.timezone == null) {
        mailElement.timezone = moment.tz.guess();
      }
      // time
      if (mailElement.time == null) {
        this.time = moment().format('hh:mm')
        mailElement.time = this.time;
      }

      mailElement.date = this.timeconv.convertTime(mailElement.date, mailElement.time, mailElement.timezone);
      // console.log(mailElement.date);

      this.MarketingplannereventsApi.updateByIdMailing(this.selectedMarketingplannerevents.id, mailElement.id, mailElement)
        .subscribe(res => res,
          error => this.openSnackBar('Mailing could not be saved'));
    }),

      this.MarketingplannereventsApi.countMailing(this.selectedMarketingplannerevents.id, { 'send': true })
        .subscribe(sendcount => {
          this.selectedMarketingplannerevents.countsend = sendcount.count,
            this.MarketingplannereventsApi.countMailing(this.selectedMarketingplannerevents.id, { 'send': false })
              .subscribe(notsendcount => {
                this.selectedMarketingplannerevents.countnotsend = notsendcount.count,
                  this.RelationsApi.updateByIdMarketingplannerevents(
                    this.option.id, this.selectedMarketingplannerevents.id,
                    this.selectedMarketingplannerevents)
                    .subscribe(res => {
                      if (message) { this.openSnackBar('Saved') }
                    },
                      error => this.openSnackBar('Campaign could not be saved'))
              })
        })
  }

  openDialogDeleteMailingCampaign(): void {
    this.dialogsService
      .confirm('Delete Mailing Campaign', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteMailingCampaign(this.selectedOption);
      });
  }

  // check destroy is sufficient?
  deleteMailingCampaign(selectedOption): void {
    if (selectedOption === true) {
      this.RelationsApi.destroyByIdMarketingplannerevents(this.option.id, this.selectedMarketingplannerevents.id)
        .subscribe(res => { this.getMailingCampaign(), this.selectedMarketingplannerevents = undefined });
    }
  }

  openDialogDeleteMailingof(i): void {
    this.dialogsService
      .confirm('Delete Mailing', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteMailingCampaignof(this.selectedOption, i);
      });
  }

  deleteMailingCampaignof(selectedOption, i): void {
    if (selectedOption === true) {
      this.MarketingplannereventsApi.destroyByIdMailing(this.selectedMarketingplannerevents.id, this.CampaignMailing[i].id)
        .subscribe(res => { this.getMailingCampaignMailings(), this.CampaignMailing.splice(i) });
    }
  }

  openDialogScheduleMailingCampaign(): void {
    const newtoggleCampaignMailing = [];
    const newtogglecampaignclasstrans = [];
    this.toggleCampaignMailing.forEach((item) => {
      newtoggleCampaignMailing.push(false)
      newtogglecampaignclasstrans.push(false)
    })
    this.toggleCampaignMailing = newtoggleCampaignMailing;
    this.togglecampaignclasstrans = newtogglecampaignclasstrans;

    this.dialogsService
      .confirm('Schedule Campaign', 'Are you sure you want to do this?')
      .subscribe(res => {
        this.selectedOption = res, this.ScheduleMailingCampaign(this.selectedOption);
      });
  }

  ScheduleMailingCampaign(selectedOption): void {
    this.saveMailingCampaign();
    if (selectedOption == true) {

      const message = this.updatecampaigns();
      console.log(message),
        this.openSnackBar(message);
      this.saveMailingCampaign();

    }
  }

  public updatecampaigns(): string {
    let message
    this.selectedMarketingplannerevents.scheduled = true;
    if (this.selectedMarketingplannerevents.mailinglist.length < 1) { message = 'Mailinglist missing' }

    if (message !== undefined) { return message }

    const mailtolist = [];
    let tolist = '';

    // join multiple lists
    this.selectedMarketingplannerevents.mailinglist.forEach(list => {
      mailtolist.push(list.mailgunid)
    })
    if (this.selectedMarketingplannerevents.mailinglist.length > 1) {
      // create comma seperate for mailgun processing
      tolist = mailtolist.join(', ')
    }

    else { tolist = mailtolist.join() };

    this.CampaignMailing.forEach(mailingElement => {
      if (mailingElement.from == undefined) { message = 'From field missing'; }
      if (mailingElement.subject == undefined) { message = 'Subject field empty'; }
    })

    if (message !== undefined) { return message }
    else {
      this.CampaignMailing.forEach(mailingElement => {
        if (mailingElement.selectedlists == undefined) { mailingElement.selectedlists = [] }

        // check opened or clicked list only (listname = open/clicked + id)
        if (mailingElement.toopened === true) {
          if (this.selectedMarketingplannerevents.mailinglist.length > 1) {
            this.selectedMarketingplannerevents.mailinglist.forEach(list => {
              mailtolist.push('open' + list.mailgunid)
            })
            // create comma seperate for mailgun processing
            tolist = mailtolist.join(', ')
          } else { console.log(tolist), tolist = 'open' + tolist }
        }

        if (mailingElement.toclicked === true) {
          if (this.selectedMarketingplannerevents.mailinglist.length > 1) {
            this.selectedMarketingplannerevents.mailinglist.forEach(list => {
              mailtolist.push('clicked' + list.mailgunid)
            })
            // create comma seperate for mailgun processing
            tolist = mailtolist.join(', ')
          } else { tolist = 'clicked' + tolist }
        }


        mailingElement.to = tolist;
        mailingElement.scheduled = true;
        mailingElement.selectedlists = this.selectedMarketingplannerevents.mailinglist;
      })
    }

    message = 'Campaign Scheduled';
    console.log(message);
    return message;
  }

  getAdwords(): void {
    this.RelationsApi.getAdwords(this.option.id).subscribe((adwords: Adwords[]) => this.Adwords = adwords);
  }

  onSelectAdwords(adwords: Adwords): void {
    this.selectedAdwords = adwords;
  }

  getAdwordsCampaign(): void {
    this.AdwordsApi.getcampaign(this.adwordsoption.refresh_token).subscribe(res => res = res);
  }

  publishAdwordsCampaign(): void { }




};


