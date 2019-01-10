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
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'linkedin',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg'));

    iconRegistry.addSvgIcon(
      'twitter',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg'));

    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));

    iconRegistry.addSvgIcon(
      'instagram',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg'));
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