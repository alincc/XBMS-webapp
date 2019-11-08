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
import { Title } from '@angular/platform-browser';
import { MatSlideToggleChange } from '@angular/material';
import { MatPasswordStrengthComponent } from '@angular-material-extensions/password-strength';
import { coerceNumberProperty } from '@angular/cdk/coercion';

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
  public terms = 'monthly';
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
  selectedcurrency = 'EUR';
  training = 0;
  migration = 0;
  emailprice = 5;
  userprice = 10;
  standard = 49;
  agency = 99;
  enterprise = 1199;



  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  public urlparameter: string;
  public selectedIndex = 0;
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
      this.accountApi.count({where: {id: this.urlparameter, paid: true}}).subscribe(rescount => {
        if (rescount.count > 0) {
          this.showconfirmation = true;
        }
        // send confirmation email with invoice to adminaddress (add admin address to account profile)
      })
    }
  }

  // gotopayment() {
  // }

  opendialogconfirmpayment() {
    //const amount = this.priceCalculator(),
    //let id = this.Account.id,
    let id = 'test',
      transsubid = Math.floor(Math.random() * 100) + 1,
      date = Math.round(new Date().getTime() / 1000),
      transid = 'IXP' + date + '-' + transsubid,
      currencytra = this.selectedcurrency, // ISO4217
      descriptiontra = this.selectedplan;

      // let recurrence = true;
      // if (this.terms === "monthly") { recurrence = true; }
      // if (this.terms === "yearly") { recurrence = false; }

    this.dialogsService
      .confirm('Request Payment', 'Total Monthly : ' + this.selectedcurrency + ' ' + this.total +
        ' You will be redirected to the payment page')
      .subscribe(res => {
        if (res) {

              this.Account.companyname = 'test';
              this.Account.email = 'test@email.com';

              this.accountApi.getpayment(id, transid, this.total, currencytra, descriptiontra, 
                'test', 'test@email.com', this.selectedplan, this.terms,
                this.trainingsupport, this.migrationsupport, this.emailcount, this.additionalusers)
                .subscribe((url: string) => {
                  if (url) { window.open(url, '_self') }
                  // returns to account confirm payment is receivd and activy account through email
                });
        }
      });
  }

  register() {
    // this.accountApi.create(this.Account)
    //   .subscribe(res => {
    //     console.log(res);
    //     this.responsemessage = res,
        //this.responsemessage = "An email confirmation has been send",
         // this.Account = res;
          this.registertoggle = false;
          this.planselectiontoggle = true;
      // },
      //   error => { this.errorMessage = error, this.error = true }
      // );

    //     this.error = false,
    //     this.registertoggle = false,
    //     this.logintoggle = true,
    //     this.response = true;
  }

  updateplan() {
    // console.log(this.selectedplan);
    let plan = 0;
    let emails = 0;
    let users = 0;
    this.training = 0;
    this.migration = 0;
    let curex = 1.15;
    this.standard = 49;
    this.agency = 99;
    this.enterprise = 1199;
    this.userprice = 10;
    this.emailprice = 5;
    
    if (this.selectedcurrency === 'USD'){
      this.emailprice = this.emailprice * curex;
      this.userprice = this.userprice * curex;
      this.standard = this.standard * curex;
      this.agency = this.agency * curex;
      this.enterprise = this.enterprise * curex;
    }

    if (this.trainingsupport) { this.training = 499; }
    if (this.migrationsupport) { this.migration = 999; }
    if (this.addemails) { emails = this.emailcount * this.emailprice }
    if (this.extrausers) { users = this.additionalusers * this.userprice }
    if (this.selectedplan === 'standard') { plan = 49 }
    if (this.selectedplan === 'agency') { plan = 99 }
    if (this.selectedplan === 'enterprise') { plan = 1199 }
    
    if (this.selectedcurrency === 'USD'){
      plan = plan * curex;
      this.training = this.training * curex;
      this.migration = this.migration * curex;
      this.emailprice = this.emailprice * curex;
      this.userprice = this.userprice * curex;
    }
    
    this.total = emails + users + plan;

    if (this.terms === "monthly") { this.yearly = 0 }
    if (this.terms === "yearly") { this.yearly = this.total * 12 * 0.9; this.total = 0 }
    this.onetime = this.training + this.migration;

  }

  login(): void {
    this.accountApi.login(this.Account)
      .subscribe(res => {
        this.logininfo = res.user
          if (this.logininfo.companyId) { this.router.navigate(['/dashboard']) }
          else this.checkregistercompany();
      }, error => { this.errorMessage = error.message, this.error = true }
      );
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
      this.accountApi.createCompany(this.logininfo.id, { companyname: this.logininfo.companyname })
        .subscribe((Company: Company) => {
          this.Company = Company,
            console.log(this.Company),
            //this.Account.companyId = this.Company.id,
            this.accountApi.patchAttributes(this.logininfo.id, { companyId: this.Company.id })
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
    if (this.planselectiontoggle === true) {
      this.registertoggle = true;
      this.logintoggle = false;
      this.response = true;
      this.planselectiontoggle = false;
    }
    if (this.registertoggle === true) {
      this.registertoggle = false;
      this.logintoggle = true;
      this.response = true;
      this.planselectiontoggle = false;
    }


  }

}
