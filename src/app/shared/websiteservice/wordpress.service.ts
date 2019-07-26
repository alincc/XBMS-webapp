import { Injectable, Inject, Optional } from '@angular/core';
import api from 'wordpress-rest-api-oauth-1';
import oAuthVerifier from 'wordpress-rest-api-oauth-1';

const theApi = new api({
    url: 'https://www.xbms.io',
    callbackURL: 'https://xbmsapi.eu-gb.mybluemix.net', //check callback url in wordpress website 
    credentials: {
        client: {
            public: 'eG4jyWsYSuLY',
            secret: 'pdsSkRlEwrVg5vbxULze9Qi2ydliLl6HEl5VPBXI5N13FLLw'
        }
    }
})

@Injectable()
export class WordpressService {

    constructor() { }

    getNativeWindow() {
        return window;
        //open new window option
    }

    wordPressAuthentication(): void {
        theApi.authorize().then(function () {
            console.log('All API requests are now authenticated.');
            theApi.saveCredentials();
            // Note: the above will cause a redirect / resume of the app in the event that the user needs to authorize.
        })
    }

    publishWP(titletext, contenttext): void {
        theApi.restoreCredentials(console.log('restored')).post('/wp/v2/posts', { title: titletext }).then(post => {
            console.log('posted.')
            //restore and post todo: create ok response and save in post
        })
    }
}