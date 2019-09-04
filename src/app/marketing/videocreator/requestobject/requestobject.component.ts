import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TimelineMax } from 'gsap';
import { TimelineLite, Back, Power1, SlowMo } from 'gsap';

@Component({
  selector: 'app-requestobject',
  templateUrl: './requestobject.component.html',
  styleUrls: ['./requestobject.component.scss']
})
export class RequestobjectComponent implements OnInit {

  public sub: any;
  public videoobject: any;
  public canvas: any;
  public animationarray = []; //array with style and position settings;
  public animationelements = []; //arrat with the actual greensock animations
  public t;
  public counter = 1000;
  public currenttime = 0;
  public play = false;
  public menu = new TimelineMax({ paused: true, reversed: true });
  public primairytimeline = new TimelineMax({ paused: true, reversed: true });
  progressbarline = new TimelineMax({ paused: true, reversed: true });

  public listviewxsshow = false;
  public showprogressbar = false;
  public changenow = true;
  public shiftX = 0;
  public shiftY = 0;
  public moveitem = false;
  public showemoji = false;
  public newz = 1;
  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };


  activeMediaQuery;
  public selectedelement;
  public elementname;

  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.animationarray  = JSON.parse(params['videoobject']),
        this.canvas = JSON.parse(params['canvas']),
        console.log(this.videoobject, this.canvas);
      this.detectchange();
     
    });
  }


  detectchange(): void {
    console.log('run check', this.animationarray);
    this.animationarray.forEach(elm => {
      if (elm.posx > 0) {
        elm.setpos = { 'x': elm.posx, 'y': elm.posy };
      }
    })
    console.log(this.animationarray)
    // force dom update
    this.changenow = false;
    setTimeout(() => this.changenow = true);
    // wait for dom update to finish otherwise it will create the effects on the old dom
    setTimeout(() =>
      this.animationarray.forEach(elm => {
        this.addEffect(elm);
      })
    );

    setTimeout(() => this.playFunc() );
  }

  addAnimation(i, element) {
    let duration = element.duration;
    let startime = element.start_time
    let anitype = element.anim_type;
    let rotationcycle = element.rotationcycle;
    let travellocY = element.posy;
    let travellocX = element.posx;
    let aniset;
    if (anitype === 'rotation') {
      aniset = { rotation: rotationcycle, ease: "Expo.easeInOut" }
    }
    if (anitype === 'translate') {
      aniset = { rotation: '30', ease: "Expo.easeInOut" }
    }
    if (anitype === 'bounce') {
      aniset = { ease: 'Bounce.easeOut', y: travellocY - 100, x: travellocX }
    }
    this.primairytimeline.to(i, duration, aniset, startime);
    console.log(duration, aniset, startime);
  }


  addEffect(element): void {
    let id = document.getElementById(element.id);
    console.log(id);
    element.animation.forEach(animationsection => {
      this.addAnimation(id, animationsection);
    });
  }



  playFunc() {
    this.detectchange();
    console.log('play');
    this.primairytimeline.play();
    this.t = setInterval(() => { this.incrementSeconds() }, 1000);
  }

  stopFunc() {
    console.log('stop')
    clearTimeout(this.t);
    this.currenttime = 0;
    this.primairytimeline.pause();
    this.primairytimeline.progress(0);
    this.primairytimeline.timeScale(1);
  }

  pauseFunc() {
    this.primairytimeline.pause();
  }

  reverseFunc() {
    this.primairytimeline.reverse();
  }

  fastforwardFunc() {
    this.primairytimeline.timeScale(5);
  }

  incrementSeconds() {
    this.currenttime = this.currenttime + 1;
    //console.log(this.currenttime);
  }





}
