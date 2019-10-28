import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  Translation,
  TranslationApi,
  Translationjob,
  TranslationjobApi,
  Relations,
  RelationsApi,
  Account,
  AccountApi,
  CompanyApi,
  Company,
} from '../shared'
import { WordpressUploadDialogComponent } from '../dialogsservice/wordpressupload-dialog.component';
import { WordpressService } from '../shared/websiteservice';
import { DialogsService } from './../dialogsservice/dialogs.service';
import { MatSnackBar, MatSnackBarConfig, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})

export class TranslationsComponent implements OnInit {
  public filteredRelations: Relations[];
  public MarkTranJobs;
  public MarkTranJobRes;
  public translationJob = {};
  public urlparameter: string;
  public selectedIndex = 0;
  public selectedTranslation: Translation;
  public selectedTranslationjob: Translationjob;
  public newTranslation = new Translation();
  public jobs = [];
  public Translation: Translation[];
  public Translationjob: Translationjob[];
  selectedOption = false;
  public showconfirmation = false;
  public option: Relations = new Relations();
  public Account: Account = new Account();
  public languages;
  public listviewxsshow = false;
  public Relations: Relations[];
  public options = [];
  public company: Company;


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public TranslationApi: TranslationApi,
    public TranslationjobApi: TranslationjobApi,
    public WordpressService: WordpressService,
    public dialogsService: DialogsService,
    public RelationsApi: RelationsApi,
    public snackBar: MatSnackBar,
    public dialogWordpress: MatDialog,
    public CompanyApi: CompanyApi,
    public AccountApi: AccountApi
    //public WordpressUploadDialogComponent: WordpressUploadDialogComponent
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
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
    this.Translationjob.forEach(job => { desctranjob.push(job.lc_tgt) })
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
      .subscribe(res => { console.log(res) })
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



  getTranslations(): void {
    const languages = []
    this.RelationsApi.getTranslation(this.option.id)
      .subscribe((result) => { this.Translation = result });
  };

  getTransationsjobs(): void {
    // need project nr. to fetch languages
    this.TranslationApi.getlanguages(this.selectedTranslation.id).subscribe(res => {
      this.languages = res
      //console.log(this.languages.language)
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

  public newmailcampaign(i): void {
    const newmailcampaign = this.translationJob[i];
  }

  public newsocialmedia(i): void {
    const newsocialmedia = this.translationJob[i];
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
    // console.log(this.selectedTranslation.order_id);
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



  public newwebsite(i): void {
    const newwebsid = this.Translationjob[i].id;
    const dialogRef = this.dialogWordpress.open(WordpressUploadDialogComponent, {
      width: '400px',
      data: {
        id: newwebsid,
        website: '',
        req: {
          user: '',
          password: ''
        }
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
        this.filteredRelations = Relations
        //console.log(this.filteredRelations)
      });
  }

  //display name in searchbox
  displayFnRelation(relation?: Relations): string | undefined {
    return relation ? relation.relationname : undefined;
  }

  swiperight(e) {
    this.listviewxsshow = true;
  }

  swipeleft(e) {
    this.listviewxsshow = false;
  }

  getCurrentUserInfo(): void {
    this.AccountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account,
        this.CompanyApi.getRelations(this.Account.companyId,
          { fields: { id: true, relationname: true } })
          .subscribe((relations: Relations[]) => {
            this.Relations = relations
            if (this.Account.standardrelation !== undefined) {
              this.RelationsApi.findById(this.Account.standardrelation)
                .subscribe(rel => {
                  this.onSelectRelation(rel, null),
                    this.CompanyApi.findById(this.Account.companyId)
                      .subscribe((company: Company) => {
                        this.company = company;
                        this.getTranslations();
                      });
                });
            }
            this.getrelationsEntry();
            this.getTranslations();
          });
    });
  }

  onSelectRelation(option, i): void {
    this.option = option;
  }

  // set Relations and quick selections
  getrelationsEntry(): void {
    this.options = []
    for (const relation of this.Relations) {
      this.options.push(relation);
    }
  }

}
