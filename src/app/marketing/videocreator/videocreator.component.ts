import { Component, OnInit, Input, SimpleChange, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';
import { ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { TimelineMax } from 'gsap';
import { TimelineLite, Back, Power1, SlowMo } from 'gsap';

export class animation {
  start_time: number;
  end_time: number;
  source: string;
}

@Component({
  selector: 'app-videocreator',
  templateUrl: './videocreator.component.html',
  styleUrls: ['./videocreator.component.scss']
})

export class VideocreatorComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  @Input() Account: Account = new Account();
  @Input() SelectedRelation: Relations;
  @Input() option: Relations = new Relations();
  @Input() company: Company = new Company;

  @ViewChild('box1', { static: false }) box: ElementRef;
  @ViewChildren('btn') btnContainers: QueryList<ElementRef>;

  public counter = 1000;
  public currenttime = 0;
  public animationarray = [];
  public sun = new Image();
  public moon = new Image();
  public earth = new Image();
  public play = false;
  public menu = new TimelineMax({ paused: true, reversed: true });
  public progressbar = new TimelineMax({ paused: true, reversed: true });
  public ctx: CanvasRenderingContext2D;
  watcher: Subscription;
  activeMediaQuery;

  constructor(
    public ngZone: NgZone,
    public media: MediaObserver,
  ) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change;
    });
  }

  ngOnInit() {
    this.createMenuAnim();
    console.log(this.currenttime);
  }

  createMenuAnim() {
    this.menu.to("#topLine", .5, { rotation: '30', ease: "Expo.easeInOut" }, 0)
    this.menu.to("#midLine", .5, { opacity: '0', ease: "Expo.easeInOut" }, 0)
    this.menu.to("#botLine", .5, { rotation: '-30', ease: "Expo.easeInOut" }, 0)
  }

  menuClick() {
    this.menu.reversed() ? this.menu.play() : this.menu.reverse();
    return console.log('clicked');
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes.myCanvas;
    if (currentItem !== undefined) {
    }
  }

  setProgressbar() {
    this.progressbar.to("#progressbarline", 1, { x: this.currenttime });
  }

  playFunc() {
    setInterval(this.incrementSeconds, 1000);
  }

  incrementSeconds() {
    this.setProgressbar();
    let nr = 1;
    let nradd;
    if (this.currenttime === undefined) {
      nradd = 0;
    } else { nradd = this.currenttime; }
    this.currenttime = nr + +nradd;
    console.log(this.currenttime);
    
  }




}