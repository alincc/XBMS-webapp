import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable} from 'rxjs';
import {
  LoopBackConfig,
  CompanyApi,
  Company,
  AccountApi,
  Account,
  BASE_URL,
  API_VERSION,
  LinkedinApi,
  Linkedin,
  Team,
  TeamApi,
  Relations,
  RelationsApi,
  ContainerApi,
  UnsortedcallsApi,
  Unsortedcalls,
  Emailhandler,
  ContainersecureApi,
  MailingApi,
  Logger
} from '../shared/';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WordpressService } from '../shared/websiteservice';
import { LinkedinService } from '../shared/socialservice';
import { DialogsService } from './../dialogsservice/dialogs.service';
import {map, startWith} from "rxjs/operators";
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fontoptions } from './google-fonts-list';
import { TextEditorDialog } from '../marketing/maileditor/texteditordialog.component';
import { fonts } from '../shared/listsgeneral/fonts';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingsComponent implements OnInit {
  public Fonts =  fonts;
  public Relations: Relations[];
  public Account: Account = new Account();
  public Team: Team[];
  public TeamAccount: Account[];
  public TeamMemberlist: Team[];
  public newAccount: Account = new Account();
  public Company: Company = new Company();
  public Unsortedcalls: Unsortedcalls[];
  public adminAccounts: Account[];
  public Emailhandler: Emailhandler = new Emailhandler;
  nativeWindow: any;
  public code: any;
  public state: any;
  public sub: any;
  public Linkedin: Linkedin[];
  public selectedLinkedin: Linkedin;
  public selectedOption = false;
  public error;
  public result;
  public pageTitle = false;
  public bufferValue;
  public passwordsuccess = false;
  public toggleedituser = false;
  public currentdomain: string;
  public domainresponse: string; 
  public logs: Logger[];
  public selectedCall: Unsortedcalls;
  public callindex: any;
  public UnsortedcallsId;
  public options = [];
  public option: Relations = new Relations();
  public newRelation: Relations = new Relations();
  public files;
  public skip = 0;
  public limit = 20;
  public Unsortedcallslength: number;
  
  myControl = new FormControl();

  calltype = [
    { value: 'PhoneCall', viewValue: 'Phone Call' },
    { value: 'E-mail', viewValue: 'E-mail' },
    { value: 'Meeting', viewValue: 'Meeting' },
    { value: 'ConferenceCall', viewValue: 'Conference Call' },
    { value: 'LinkedinMessage', viewValue: 'Linkedin Message' },
    { value: 'Other', viewValue: 'Other' }
  ];

  statustype = [
    { value: 'not attempted', viewValue: 'Not attempted' },
    { value: 'attempted', viewValue: 'Attempted' },
    { value: 'contacted', viewValue: 'Contacted' },
    { value: 'schedule call', viewValue: 'Schedule Call' },
    { value: 'schedule meeting', viewValue: 'Schedule Meeting' },
    { value: 'new opportunity', viewValue: 'New opportunity' },
    { value: 'additional contact', viewValue: 'Additional contact' },
    { value: 'disqualified', viewValue: 'Disqualified' }
  ];

  searchfilters = [
    { value: 'FLAGGED' },
    { value: 'UNSEEN' }
  ];

  // setup account stepper
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  oldpassword: string;
  newpassword: string;
  public selectedTab = 0;
  public fontlist: string[] = fontoptions;

  constructor(
    public mailingApi: MailingApi,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public AccountApi: AccountApi,
    public RelationsApi: RelationsApi,
    public UnsortedcallsApi: UnsortedcallsApi,
    public ContainerApi: ContainerApi,
    public ContainersecureApi: ContainersecureApi,
    public RelationApi: RelationsApi,
    public CompanyApi: CompanyApi,
    public TeamApi: TeamApi,
    public dialogsService: DialogsService,
    public _formBuilder: FormBuilder,
    public LinkedinApi: LinkedinApi,
    public activatedRoute: ActivatedRoute,
    public LinkedinService: LinkedinService,
    public WordpressService: WordpressService,
    public route: ActivatedRoute,
    public router: Router,
    public accountApi: AccountApi) {
    
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
    this.nativeWindow = WordpressService.getNativeWindow();
  }

  public setParameters(){
    let itemid = this.route.snapshot.queryParamMap.get("itemid");
    let tab = this.route.snapshot.queryParamMap.get("tab");
    console.log(itemid, tab);
    if (tab === 'unsorted'){
      this.selectedTab = 2;
      this.AccountApi.findByIdUnsortedcalls(this.Account.id, itemid)
      .subscribe(res => {this.onSelectCall(res, null)});
    }

    if (tab === 'invoice'){
      this.selectedTab = 1;
      //this.
    }
  }
 

  public openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: "snackbar-class"
    });
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
  ]);


  // matcher = new MyErrorStateMatcher();
  filteredOptions: Observable<string[]>;
  
  myControlfont: FormControl = new FormControl();
  filteredfonts: Observable<string[]>;

  ngOnInit(): void {
    const auth = this.AccountApi.isAuthenticated()
    if (auth === false ){this.router.navigate(['login'])}
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      //map(options => options && typeof options === 'object' ? options.relationname : options),
      map(relationname => relationname ? this.filter(relationname) : this.options.slice())
      );
  
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.getAccountInfo();


    //get Linkedin AccessToken Params
    this.sub = this.route.queryParams.subscribe(params => {
      this.code = params['code'],
        this.state = params['state']
      if (this.code !== undefined) { this.LinkedinService.getAccessToken(this.code, this.state) }
      else { this.LinkedinService.restoreCredentials() }
    });

    // this.ContainerApi.create({ name: "tmp" }).subscribe(res => res = res);

    this.filteredfonts = this.myControlfont.valueChanges.pipe(
      startWith(''),
      map(value => this._filterfont(value))
    );

  }

  private _filterfont(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fontlist.filter(font => font.toLowerCase().includes(filterValue));
  }

  logout(): void {
    if (this.Account.id == undefined) { this.router.navigate(['/login']) }
    else {
      this.accountApi.logout().subscribe(res =>
        this.router.navigate(['/login']));
    }
  }

  //current account info
  getAccountInfo(): void {
    this.accountApi.getCurrent().subscribe((Account: Account) => {
      this.Account = Account,
      this.setParameters();
        this.getUnCalls(),
        this.getLinkedin(),
        this.getAdminAccountsoverview();
      this.emailHandler();
      this.getLogs();
    });
  }

  getLogs(){
    this.CompanyApi.getLogger(this.Account.companyId)
    .subscribe((logs: Logger[]) => {
      this.logs = logs;
    })
  }



  getAdminAccountsoverview(): void {
    if (this.Account.companyadmin === true) {
      this.CompanyApi.findById(this.Account.companyId).subscribe((company: Company) =>
      {this.Company = company, this.currentdomain = company.companywebsite})
      this.CompanyApi.getTeam(this.Account.companyId, { where: { accountId: { nlike: this.Account.id } } })
        .subscribe((Team: Team[]) => {
          this.Team = Team,     this.getRelations();
        });
    }
  }

  changePassword(): void {
    this.passwordsuccess = true,
      this.accountApi.changePassword(this.oldpassword, this.newpassword)
        .subscribe(res => this.passwordsuccess = true, error => this.passwordsuccess = false);
  }


  deleteTeamMember(Team: Team, i): void {
    this.CompanyApi.destroyByIdTeam(this.Account.companyId, Team.id).subscribe(
      this.Team.splice[i] //delete from array
    );
  }


  //Wordpress Authenticate save 
  wpauth(): void {
    this.WordpressService.wordPressAuthentication();
  }

  //linkedin AuthCode
  linkauth(): void {
    this.LinkedinService.linkedinAuthorize();
  }

  //get current linkedin member info
  linkme(): void {
    this.LinkedinService.linkedinMe();
  }

  public getLinkedin(): void {
    this.LinkedinApi.find().subscribe((Linkedin: Linkedin[]) => {
      this.Linkedin = Linkedin
    });
  }

  public onSelectLinkedin(Linkedin: Linkedin): void {
    this.selectedLinkedin = Linkedin;
  }

  public saveLinkedin(): void {
    this.LinkedinApi.onUpsert(this.selectedLinkedin).subscribe();
  }

  public createTeamMember(): void {
    this.newAccount.companyadmin = false,
      this.newAccount.companyname = this.Account.companyname,
      this.newAccount.companyId = this.Account.companyId,
      this.accountApi.create(this.newAccount)
        .subscribe();
  }

  public openDialogDeleteAccount() {
    this.dialogsService
      .confirm('Delete Current Account', 'Are you sure you want to do this? This Action cannnot be reversed!')
      .subscribe(res => {
        this.selectedOption = res, this.deleteAccount(this.selectedOption);
      });
  }

  deleteAccount(selectedOption): void {
    if (selectedOption === true) {
      this.accountApi.deleteById(this.Account.id).subscribe(res => {
        this.error = res,
          this.router.navigate(['/login'])
      })
    }
  }

  public getUnCalls(): void {
    this.accountApi.countUnsortedcalls(this.Account.id)
    .subscribe(res => {this.Unsortedcallslength = res.count;});
    this.newRelation.relationname = undefined;
    this.newRelation.status = undefined;
    this.option = undefined;
    this.selectedCall = undefined;
    this.accountApi.getUnsortedcalls(
      this.Account.id,
      {
        order: 'id DESC',
        // order: 'relationname ASC',
        limit: 20,
        skip: this.skip,
      }
      )
      .subscribe((unsortedcalls: Unsortedcalls[]) => this.Unsortedcalls = unsortedcalls);
  }

  saveCall(): void {
    this.accountApi.updateByIdUnsortedcalls(this.Account.id, this.selectedCall.id, this.selectedCall)
      .subscribe(Calls => this.Unsortedcalls[this.callindex] = this.selectedCall);
  }

  assignCall(): void {
    this.UnsortedcallsId = this.selectedCall.id,
      this.selectedCall.id = undefined,
      this.RelationsApi.createCalls(this.option.id, this.selectedCall)
        .subscribe(res => {
          this.RelationsApi.createContactpersons(this.option.id, { email: this.selectedCall.email })
            .subscribe(res1 => {
              this.accountApi.destroyByIdUnsortedcalls(this.Account.id, this.UnsortedcallsId, )
                .subscribe(res2 => this.getUnCalls());
            });
        });
  }

  // create  
  createNewAssign(): void {
    if (this.newRelation !== undefined) {
      this.CompanyApi.createRelations(this.Account.companyId, this.newRelation)
        .subscribe(res => { // send as par to dialog so process resumes
          if (this.selectedCall.email !== undefined) { this.openDialogNewContactperson(res.id, this.selectedCall.email, this.selectedCall.attendee) }
          this.UnsortedcallsId = this.selectedCall.id,
            this.selectedCall.id = undefined, //err id already set => clear
            this.selectedCall.companyId = this.Account.companyId
          this.RelationsApi.createCalls(res.id, this.selectedCall)
            .subscribe(res => {this.Unsortedcalls.splice(this.callindex),
              this.accountApi.destroyByIdUnsortedcalls(this.Account.id, this.UnsortedcallsId, )
                .subscribe(res => this.getUnCalls());
            });
        });
    } else {
      this.dialogsService
        .confirm('New Relation Empty', 'Please fill in Relation details order details can be filled in under the Relations Menu')
        .subscribe(res => { this.getUnCalls() })
    }
  }

  // create new Contactperson
  public openDialogNewContactperson(id, email, name) {
    this.dialogsService
      .confirm('Create new Contactperson', 'Do you want to create a new Entry?')
      .subscribe(res => {
        console.log(res, id, email, name);
        if (res === true) {this.newContactperson(id, email, name);
}      });
  }

  public newContactperson(id, email, name) {
      // split string name
      let temp;
      if (name !== undefined) {
        if (typeof name === 'string'){
          temp = [name]
        }
        if (name.name){
          temp = name.name.split(" "); // now you have 2 words in temp
        }
      
      } else {
        temp = ['unknown', 'unknown']; // if attendee is undefined
      }
      console.log(temp);

      this.RelationsApi.createContactpersons(id, {
        email: email,
        firstname: temp[0],  // is your second word
        lastname: temp[1]// is your third word
      }).subscribe(res => {this.Unsortedcalls.splice(this.callindex), this.getUnCalls()});
  }

  openDialogDeleteCall() {
    this.dialogsService
      .confirm('Delete Call', 'Do you want to delete this Entry?')
      .subscribe(res => {
        this.selectedOption = res, this.deleteCall(this.selectedOption)
      });
  }

  deleteCall(selectedOption): void {
    if (selectedOption == true) {
      this.Unsortedcalls.splice(this.callindex),
      this.accountApi.destroyByIdUnsortedcalls(this.Account.id, this.selectedCall.id)
        .subscribe(res => { this.getUnCalls()});
    }
  };

  openDialogDeleteAllCall() {
    this.dialogsService
      .confirm('Delete all Calls!', 'Do you want to delete all unsorted Calls!')
      .subscribe(res => {
        this.selectedOption = res, this.deleteAllCall(this.selectedOption)
      });
  }

  deleteAllCall(selectedOption) {
    if (selectedOption == true) {
      this.Unsortedcalls.forEach((item, index) => {
        this.accountApi.destroyByIdUnsortedcalls(this.Account.id, item.id)
        .subscribe( res => this.getUnCalls() );
      })
    }
  }


  onSelectCall(Unsortedcalls: Unsortedcalls, i): void {
    this.selectedCall = Unsortedcalls;
    this.callindex = i;
    
  }

  getRelations(): void {
    this.CompanyApi.getRelations(this.Account.companyId)
      .subscribe((Relations: Relations[]) => { this.Relations = Relations, this.getrelationsEntry() });
  }

  getrelationsEntry(): void {
    this.options = [];
    for (let relation of this.Relations) {
      this.options.push(relation);
    }
  }

  filter(relationname: string) {
    return this.options.filter(option =>
      option.relationname.toLowerCase().indexOf(relationname.toLowerCase()) === 0);
  }

  displayFn(options): string {
    return options ? options.relationname : options;
  }

  searchCallGo(searchTerm): void {
    this.selectedCall = undefined;
    this.accountApi.getUnsortedcalls(this.Account.id, { where: { name: searchTerm } })
      .subscribe((Unsortedcalls: Unsortedcalls[]) => this.Unsortedcalls = Unsortedcalls);
  }

  //set emailhandler for sync mailbox
  emailHandler(): void {
     this.accountApi.getEmailhandler(this.Account.id, false)
     .subscribe((Emailhandler) => this.Emailhandler = Emailhandler);
  }


  createEmailHandler(): void {
    this.Emailhandler.companyId = this.Account.companyId
    if(this.Emailhandler.id == undefined){
    this.accountApi.createEmailhandler(this.Account.id, this.Emailhandler)
      .subscribe(res => { this.result = res, console.log(this.result) });
    }
    else this.accountApi.updateEmailhandler(this.Account.id, this.Emailhandler)
    .subscribe(res => this.error = res.message);

  }

  deleteEmailhandler(): void {
    this.accountApi.destroyEmailhandler(this.Account.id)
    .subscribe(res => {this.openSnackBar("Email Account deleted")});
  }

  toggleEditUser(): void {
    if (this.toggleedituser === true){this.toggleedituser = false}
    else this.toggleedituser = true;
  }

  saveAccount(): void {
    this.AccountApi.patchAttributes(this.Account.id, this.Account)
    .subscribe(res => {
      console.log(res);
      this.openSnackBar("Changes saved")});
  }

  deleteRelType(i){
    console.log(i);
    this.Company.relationtypes.splice(i, 1);
    this.saveCompany();
  }

  saveRelType(e, i){
    console.log(e.srcElement.value, i);
    this.Company.relationtypes[i]= e.srcElement.value;
    this.saveCompany();
  }

  saveCompany(): void {
    this.CompanyApi.upsert(this.Company).subscribe();
  }

  saveCompanyDomain(): void {
    this.CompanyApi.patchAttributes(this.Company.id, this.Company)
    .subscribe(res => this.openSnackBar("Changes saved"));
    this.deleteDomain();
    this.setDomain()
  }

  deleteDomain(){
    this.mailingApi.deletedomain(this.Company.id, this.currentdomain)
    .subscribe(res => console.log(res));
  }

  setDomain(): void {
    this.mailingApi.setdomain(this.Company.id, this.Company.companywebsite)
    .subscribe(res => console.log(res));
  }

  checkDomainSettings(): void {
    this.mailingApi.getdomaininfo(this.Company.id, this.Company.companywebsite)
    .subscribe(res => {this.domainresponse = res.sending_dns_records[1].value, console.log(res)});
  }

  billingCompanyCopy(): void {
    this.Company.billingaddress = this.Company.address;
    this.Company.billingcity = this.Company.city;
    this.Company.billingcountry = this.Company.country;
    this.Company.billingstateprov = this.Company.stateprov;
    this.Company.billingzipcode = this.Company.zipcode;
  }

  setAddress(addrObj) {
      this.newRelation.relationname = addrObj.name;
      this.newRelation.address1 = addrObj.route +" "+ addrObj.street_number;
      this.newRelation.generalphone = addrObj.phone;
      this.newRelation.country = addrObj.country;
      this.newRelation.city = addrObj.locality;
      this.newRelation.stateprovince = addrObj.admin_area_l1;
      this.newRelation.zipcode = addrObj.postal_code;
  }

  getInvoices(): void {
    // get files detailss
    this.ContainersecureApi.getFilesByContainer(this.Account.companyId).subscribe(res => {
      let response = res;
      this.files = response.Contents
      console.log(this.files);
    });
    }

  getFile(i): void {
    // get stream and encode base64 to pdf 
    let itemName = this.files[i];
    console.log(itemName.Key);
    this.ContainersecureApi.getFilesByFilename(this.Account.companyId, itemName.Key)
    .subscribe(res => {
      //console.log(res);
      const byteCharacters = atob(res.$data);
      const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);

    }
    );
  }


  getlinkedinconnections(): void {
    this.LinkedinApi.linkedinconnections(this.selectedLinkedin.accesstoken).subscribe(res => {
      console.log(res);
    })
  }

  openeditorsignature(): void {
    const dialogRef = this.dialog.open(TextEditorDialog, {
      width: '800px',
      data: this.Account.signature // changingThisBreaksApplicationSecurity,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.length > 0) {
          this.Account.signature = result;
          this.saveAccount();
        };  // this.sanitizer.bypassSecurityTrustHtml(result);
      }
    });
  }

  getCallsnextpage(): void {
    if (this.limit < this.Unsortedcallslength) {
      this.limit = this.limit += 20;
      this.skip = this.skip += 20;
      this.getRelations();
    }
  }

  getCallsbackpage(): void {
    if (this.skip > 0) {
      this.skip = this.skip -= 20;
      this.limit = this.limit -= 20,
        this.getRelations();
    }
  }

}
