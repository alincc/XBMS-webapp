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
  
  error = false;
  response = false;
  logintoggle = true;
  registertoggle = false;
  logininfo;
  responsecount: number;
  public selectedOption = false;
  count: number;


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

  ngOnInit(): void { }

  register() {
    this.accountApi.create(this.Account)
      .subscribe(res => { 
        this.responsemessage = "An email confirmation has been send",
        this.error = false,
        this.registertoggle = false,
        this.logintoggle = true,
        this.response = true
      },
      error => { this.errorMessage = error, this.error = true }
    );
  }

  login(): void {
    this.accountApi.login(this.Account)
      .subscribe(res => {
      this.logininfo = res.user
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
    this.registertoggle = false,
      this.logintoggle = true,
      this.response = true
  }

}
