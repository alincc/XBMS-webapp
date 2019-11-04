import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LoopBackConfig,
  AccountApi,
  Account,
  Company,
  CompanyApi,
  BASE_URL,
  API_VERSION
} from '../shared/';
import { DialogsService } from './../dialogsservice/dialogs.service';
import {Title} from '@angular/platform-browser';
import {MatSlideToggleChange} from '@angular/material';
import {MatPasswordStrengthComponent} from '@angular-material-extensions/password-strength';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public Company: Company = new Company();
  public Account: Account = new Account();
  public rememberMe: boolean = true;
  public errorMessage: string;
  public responsemessage;
  public selectedplan: string;
  public terms: string;
  error = false;
  response = false;
  logintoggle = true;
  registertoggle = false;
  logininfo;
  responsecount: number;
  public selectedOption = false;
  count: number;
  planselectiontoggle = false;

  emailcount = 0;
  extrausers = false;
  migrationsupport = false;
  trainingsupport = false;
  autoTicks = false;
  showTicks = false;
  step = 1000;
  addemails = false;
  additionalusers = 0;
  total = 99;
  onetime = 0;
  yearly = 0;



  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  public urlparameter: string;
  public selectedIndex = 0;
  public selectedAccount: Account;
  public showconfirmation = false;

  constructor(
    public CompanyApi: CompanyApi,
    public dialogsService: DialogsService,
    //public auth: LoopBackAuth,
    public route: ActivatedRoute,
    public router: Router,
    public accountApi: AccountApi) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit(): void { 
    //this.getCurrentUserInfo();
    this.urlparameter = this.route.snapshot.params['id'];
    if (this.urlparameter) {
      this.selectedIndex = 1;
      this.accountApi.findById(this.urlparameter).subscribe((account: Account) => {
        this.selectedAccount = account;
        // this.onSelectTranslation(this.selectedTranslation);
        // this.getTranslations();
        // this.TranslationApi.    // check payment hook
        this.showconfirmation = true;
        if (this.selectedAccount.status ) {
          // confirm translation assignment === 'paid'

          this.register()
          
        }
        
        // send confirmation email with invoice to adminaddress (add admin address to account profile)
        
      })
    }
  }

  gotopayment(){
    
  }

  opendialogconfirmpayment() {
    //const amount = this.priceCalculator(),
     let id = this.selectedAccount.id,
      transsubid = Math.floor(Math.random() * 100) + 1,
      date = Math.round(new Date().getTime() / 1000),
      transid = 'IXP' + date + '-' + transsubid,
      currencytra = 'EUR'; // ISO4217
      let descriptiontra = this.selectedplan;

    this.dialogsService
      .confirm('Request Translation', 'Total Amount: €' + this.total +
        ' You will be redirected to the payment page')
      .subscribe(res => {
        // this.selectedOption = res,
        if (res) {
          // create account then == > 
          this.accountApi.updateAll(this.Account.id, this.selectedAccount.id, this.selectedAccount)
            .subscribe(res => {
              this.accountApi.getpayment(id, transid, this.total, currencytra, descriptiontra, langdescr)
                .subscribe((url: string) => {
                  if (url) { window.open(url, '_self') }

                  // returns to account confirm payment is receivd and activy account through email
                });
            });
        }
      });
    // on confirm payment navigate to payment site
  }

  register() {
    // this.accountApi.create(this.Account)
    //   .subscribe(res => { 
         this.responsemessage = "An email confirmation has been send",
    //     this.error = false,
    //     this.registertoggle = false,
    //     this.logintoggle = true,
    //     this.response = true;
      this.selectedAccount = res;
    //   },
    //   error => { this.errorMessage = error, this.error = true }
    // );
    this.registertoggle = false;
    this.planselectiontoggle = true;
  }

  updateplan(){
    // console.log(this.selectedplan);
    let plan = 0;
    let emails = 0;
    let users = 0;
    let training =  0;
    let migration = 0;

    if (this.trainingsupport){ training =  499; }
    if (this.migrationsupport){ migration = 999; } 
    if (this.addemails){ emails = this.emailcount * 5 }
    if (this.extrausers){ users = this.additionalusers * 10 }
    if (this.selectedplan === 'standard'){ plan = 49 }
    if (this.selectedplan === 'agency'){ plan = 99 }
    if (this.selectedplan === 'enterprise'){ plan = 1199 }
    this.total =  emails + users + plan;

    if (this.terms === "monthly"){this.yearly = 0}
    if (this.terms === "yearly"){this.yearly = this.total * 12 * 0.9; this.total = 0}
    this.onetime = training + migration;

  }

  login(): void {
    this.accountApi.login(this.Account)
      .subscribe(res => {
      this.logininfo = res.user
      if (this.logininfo.)
            if (this.logininfo.companyId) { this.router.navigate(['/dashboard'])}  
          else this.checkregistercompany()
          },
          error => { this.errorMessage = error, this.error = true });
      }

  //dialog for confirming create new company
  checkregistercompany(): void {
    this.dialogsService
      .confirm('A Company has not yet been created', 'Do you want to create a new Company?')
      .subscribe(res => {
        this.selectedOption = res, this.registercompany(this.selectedOption);
      });
  };

  //register new company and add id to account - delete moved to server
  registercompany(selectedOption): void {
    if (selectedOption === true) {
      console.log(this.logininfo.id);
      this.accountApi.createCompany(this.logininfo.id, {companyname: this.logininfo.companyname})
        .subscribe((Company: Company) => {
        this.Company = Company,
        console.log(this.Company),
        //this.Account.companyId = this.Company.id,
          this.accountApi.patchAttributes(this.logininfo.id, {companyId : this.Company.id})
            .subscribe(res =>
              this.router.navigate(['/dashboard'])
            );
        });
    }
  }

  logout(): void {
    this.accountApi.logout().subscribe();
    this.router.navigate(['/'])
  }

  registertoggleform(): void {
    this.registertoggle = true,
      this.logintoggle = false,
      this.error = false,
      this.response = false
  }

  backtoggle(): void {
    if (this.planselectiontoggle === true){
      this.registertoggle = true;
      this.logintoggle = false;
      this.response = true;
      this.planselectiontoggle = false;
    }
    if (this.registertoggle === true){
      this.registertoggle = false;
      this.logintoggle = true;
      this.response = true;
      this.planselectiontoggle = false;
    }


  }

}
