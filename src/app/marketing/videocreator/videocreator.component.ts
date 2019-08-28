import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import {
  Relations, RelationsApi, BASE_URL, CompanyApi, Company, Account,
  Files, FilesApi, ContainerApi
} from '../../shared';

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

  public sun = new Image();
  public moon = new Image();
  public earth = new Image();
  

  public ctx: CanvasRenderingContext2D;

constructor() {
}

ngOnInit() {
  let canvas = this.myCanvas.nativeElement;
  this.ctx = canvas.getContext('2d');
  this.init()

}


init() {
  this.sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  this.moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  this.earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(this.draw);
}

draw() {

  this.ctx.globalCompositeOperation = 'destination-over';
  this.ctx.clearRect(0, 0, 300, 300); // clear canvas

  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  this.ctx.save();
  this.ctx.translate(150, 150);

  // Earth
  var time = new Date();
  this.ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
  this.ctx.translate(105, 0);
  this.ctx.fillRect(0, -12, 40, 24); // Shadow
  this.ctx.drawImage(this.earth, -12, -12);

  // Moon
  this.ctx.save();
  this.ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
  this.ctx.translate(0, 28.5);
  this.ctx.drawImage(this.moon, -3.5, -3.5);
  this.ctx.restore();

  this.ctx.restore();

  this.ctx.beginPath();
  this.ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
  this.ctx.stroke();

  this.ctx.drawImage(this.sun, 0, 0, 300, 300);

}


}