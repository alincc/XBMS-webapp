import { Renderer2, ElementRef, AfterViewInit, HostBinding, Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import {
  AccountApi,
  Account
} from './shared/';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { map, distinctUntilChanged, share, filter, throttleTime, pairwise } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { PwaService } from './pwa.service';
import { SwUpdate } from '@angular/service-worker';

import {
  BASE_URL,
  API_VERSION,
  LoopBackConfig
} from './shared/';


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

  public scrolleffect = false;
  public Account: Account = new Account();
  public position = false;
  public elementRef: ElementRef;

  // listenFunc will hold the function returned by "renderer.listen"
  listenFunc: Function;

  // globalListenFunc will hold the function returned by "renderer.listenGlobal"
  globalListenFunc: Function;

  constructor(
    public Pwa: PwaService,
    elementRef: ElementRef,
    private renderer: Renderer2,
    public router: Router,
    public accountApi: AccountApi,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private swUpdate: SwUpdate) {
      // swUpdate.available.subscribe(event => {
      //   if (askUserToUpdate()) {
      //     window.location.reload();
      //   }
      // });
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

    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
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


}