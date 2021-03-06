import {
  Renderer2, ElementRef, AfterViewInit, HostBinding,
  Component, ViewChild, OnInit, OnDestroy, HostListener,
  LOCALE_ID
} from '@angular/core';
import {
  AccountApi,
  Account,
  Logger,
  CompanyApi
} from './shared/';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router, RoutesRecognized } from '@angular/router';
import { map, distinctUntilChanged, share, filter, throttleTime, pairwise } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { PwaService } from './pwa.service';
import { SwUpdate } from '@angular/service-worker';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {
  RealTime,
  BASE_URL,
  API_VERSION,
  LoopBackConfig
} from './shared/';
import { ActivatedRoute, UrlSegment } from '@angular/router';


enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden'
}

enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})


export class AppComponent implements AfterViewInit {
  languages = [
    { code: 'en', label: 'English' },
    { code: 'nl', label: 'Nederlands' }
  ];
  public scrolleffect = false;
  public Account: Account = new Account();
  public position = false;
  public elementRef: ElementRef;
  public showmessages = false;
  public messagecount: number;
  public logger: Logger[];
  private routeData;
  // listenFunc will hold the function returned by "renderer.listen"
  listenFunc: Function;

  // globalListenFunc will hold the function returned by "renderer.listenGlobal"
  globalListenFunc: Function;

  constructor(
    private realTime: RealTime,
    private _bottomSheet: MatBottomSheet,
    private CompanyApi: CompanyApi,
    public Pwa: PwaService,
    elementRef: ElementRef,
    private renderer: Renderer2,
    public router: Router,
    private route: ActivatedRoute,
    public accountApi: AccountApi,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private swUpdate: SwUpdate) {
    this.addIcons();
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);


    this.realTime.onReady().subscribe(() => console.log('ready'))
    this.realTime.IO.emit('hello', 'world');
    this.realTime.IO.on('new log')
      .subscribe((msg: any) => { console.log('incoming', msg), this.getLogs(); });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetLogOverview, {
      data: { logger: this.logger, account: this.Account },
      panelClass: 'bottom-sheet'
    });
  }

  public teststyle = {
    "background-color": "red"
  }

  getLogs(): void {
    this.accountApi.getCurrent().subscribe((account: Account) => {
      this.Account = account,
        this.CompanyApi.getLogger(this.Account.companyId,
          {
            order: 'id DESC',
            where: { read: false }
          }).subscribe((logger: Logger[]) => {
            { this.logger = logger };
            this.messagecount = this.logger.length;
            // console.log(this.messagecount, this.logger);
          });
    });
  }

  public logout(): void {
    if (this.Account.id == undefined) { this.router.navigate(['/login']) }
    else {
      this.accountApi.getCurrent().subscribe((Account: Account) => {
        this.Account = Account
        this.accountApi.logout().subscribe(res =>
          this.router.navigate(['/login']));
      });
    }
  }

  private isVisible = false;

  ngAfterViewInit() {

    let loc = window.location.pathname;
    let locindex = loc.indexOf('/login')
    if (locindex === -1) {
      this.getLogs();
    }

    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()

    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down)
    );

    goingUp$.subscribe(() => (this.isVisible = false));
    goingDown$.subscribe(() => (this.isVisible = true));
  }

  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }

  addIcons() {
    this.iconRegistry.addSvgIcon(
      'xbms_linkedin',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_twitter',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_facebook',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_instagram',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_pinterest',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pinterest.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_tumblr',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tumblr.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_web',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/web.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_xing',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/xing.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_snapchat',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/snapchat.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_youtube',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/youtube.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_vimeo',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/vimeo.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_github',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));

    this.iconRegistry.addSvgIcon(
      'xbms_adwords',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/adwords.svg'));

  }


}

import { Inject, Output, EventEmitter } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';


@Component({
  selector: 'bottom-sheet-Log-Overview',
  templateUrl: 'bottom-sheet-logoverview.html',
})
export class BottomSheetLogOverview {

  public logger: Logger[];
  public Account: Account;

  constructor(
    public router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private CompanyApi: CompanyApi,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetLogOverview>) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit() {
    this.logger = this.data.logger;
    this.Account = this.data.account;
    // console.log('logs', this.logger)
  }

  deleteLog(i): void {
    let deletedone = this.logger[i];
    this.logger.splice(i, 1);
    this.CompanyApi.destroyByIdLogger(this.Account.companyId, deletedone.id)
      .subscribe(res => { });
  }

  markRead(i): void {
    let readdone = this.logger[i];
    this.logger.splice(i, 1)
    readdone.read = true;
    this.CompanyApi.updateByIdLogger(this.Account.companyId, readdone.id,
      readdone)
      .subscribe(res => { });
  }

  // date: "2020-03-25T16:14:03.640Z"
  // user: null
  // relation: "5a2a4e745c2a7a06c443533f"
  // description: "created new video milky-way-over-mountains-CU4TKRA.mp4"
  // read: false
  // id: "5e7b834b8a20fb05c02c63db"
  // companyId: "5a2a4e6b5c2a7a06c443533d"
  // code: "E2U"

  navigateTo(logs) {
    console.log(logs)
    if (logs.code === 'E2U') {
      let itemid = logs.id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/settings'], { queryParams: { tab: 'unsorted', itemid: logs.item } })
      )
    }
    if (logs.code === 'E2A') {
      let itemid = logs.id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/relation'],
        { queryParams: { tab: 'calls', itemid: logs.item, relation: logs.relation } })
      );
    }
    if (logs.code === 'FLR' || logs.code === undefined) {
      let itemid = logs.id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/relation'],
        { queryParams: { tab: 'files', itemid: logs.item, relation: logs.relation } })
      );
    }
    if (logs.code === 'MCS') {
      let itemid = logs.id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/marketing'],
        { queryParams: { tab: 'mailing', itemid: logs.item, relation: logs.relation } })
      );
    }
    if (logs.code === 'MNS') {
      let itemid = logs.id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/marketing'], 
        { queryParams: { tab: 'mailing', itemid: logs.item, relation: logs.relation } })
      );
    }

 
  }



}