import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AccountApi } from './sdk/services';
import * as moment from 'moment-timezone';

@Injectable()
export class timeconv {
  constructor(
    private router: Router,
    private accountApi: AccountApi
  ) { }

  public convertdate;
  public date;
  public time;
  public localdate;
  public toggletextview = false;

  public convertTime(date, time, timezone) {
    //if (this.selectedChannel.timeinterval === undefined){}
    if (timezone === undefined){ timezone = moment.tz.guess();}
    console.log(timezone)
    //utc date
    //set time delete maybe? directly convert to utc?
    this.date = moment(date).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    this.time = time;
    var utcdate = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(utcdate).toDate();
    var local = moment(stillUtc).utcOffset();
    this.convertdate = this.date.substring(0, 11) + this.time + ":00.000Z";
    this.localdate = moment(this.convertdate).tz(timezone).format(); //set UTC
    var dif = moment.parseZone(this.localdate).utcOffset(); // get UTC difference
    dif = dif + local; //add local time difference
    dif = -(dif) //convert as we need to add it
    //add timedifference and set api select format
    this.date = moment(this.localdate).add(dif, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return (this.date);
  }

}