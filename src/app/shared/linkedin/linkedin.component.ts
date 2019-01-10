import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  LoopBackConfig,
  AccountApi,
  Account,
  BASE_URL,
  API_VERSION,
  Relations,
  Container,
  ContainerApi,
  RelationsApi,
  Files,
  Linkedin,
  LinkedinApi
} from '../';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './linkedin.component.html',
  styleUrls: ['./linkedin.component.scss']
})

export class LinkedinComponent implements OnInit, OnDestroy {
  private req;
  private sub: any;
  public error;
  public message;
  public errorstatus = false;
  public messagestatus = false;

  constructor(
    private LinkedinApi: LinkedinApi,
    private RelationsApi: RelationsApi,
    private route: ActivatedRoute) {
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams.subscribe(params => {
      this.req = params
        if (this.req.code && this.req.state && this.req) {
          this.LinkedinApi.linkedinaccesstoken(this.req)
            .subscribe(res => {this.message = res.res,
              console.log(this.message)
              if (this.message.message == undefined){
                this.messagestatus = true
              }
              else
              {this.error = this.message.message, this.errorstatus = true}});
            }
      })
  };

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}