import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const key = 'xsQLEtA2Sb62NxSPG8mxftbr3crGhfI5vVptIrWb';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'xsQLEtA2Sb62NxSPG8mxftbr3crGhfI5vVptIrWb'
  })
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

}