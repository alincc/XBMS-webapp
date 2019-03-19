import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map} from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

const key = 'APPLICATION-ID:xsQLEtA2Sb62NxSPG8mxftbr3crGhfI5vVptIrWb';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'xsQLEtA2Sb62NxSPG8mxftbr3crGhfI5vVptIrWb'
  })
}


export interface MJML {
    html: string;
}


@Injectable({
  providedIn: 'root'
})


export class MaileditorService {

  private configUrl =  'https://api.mjml.io/v1/render';

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get(this.configUrl);
  }

  postMJML(mjmlbody: Object): Observable<string> {

    httpOptions.headers =
    httpOptions.headers.set('Authorization', key);

    //let mjmlbody = JSON.parse(mjml);
    return this.http.post<string>(this.configUrl, mjmlbody, httpOptions)
      .pipe(
        map((mjml) => {return(mjml)}));
  }

}