
import { Inject, Injectable, OnInit } from '@angular/core';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'
import {
	LoopBackConfig,
//	LoopBackAuth,
	BASE_URL,
	API_VERSION,
	LinkedinApi,
	Linkedin
} from '../';

@Injectable()
export class LinkedinService {
	// https://www.npmjs.com/package/node-linkedin
	// Client ID = 8618uwia2dz4mt
	// Client Secret =	zNZQX5W42ysiEZMu
	// Callback = https://xbmsapi.eu-gb.mybluemix.net/client/settings

	private credentials;
	private code;
	private state;
	private redirectURL: any;
	public AccessToken: any;
	public Linkedin: Linkedin[];
	public selectedLinkedin: Linkedin;
	private error;
	private linkedinshare;
	private data;

	constructor(
		@Inject(DOCUMENT)
		private document: any,
		public LinkedinApi: LinkedinApi) { }

	linkedinAuthorize() {
		this.document.location.href = 'https://xbmsapi.eu-gb.mybluemix.net/linkedin/oauth'
	}

	getAccessToken(code, state): void {
		this.LinkedinApi.linkedinaccesstoken(code, state)
			.subscribe((response) => {
				this.AccessToken = response,
					console.log(this.AccessToken.response.access_token),
					console.log(this.AccessToken),
					this.removeCredentials(),
					this.saveCredentials(),
				this.LinkedinApi.create({ "name": "New Linkedin", 
				"accesstoken": this.AccessToken.response.access_token })
					.subscribe(res => {
						this.data = res,
						this.onSelectLinkedin(this.data.id)
					});
			},
			error => { console.log(error) }
			);
	}

	
	saveCredentials() {
		window.localStorage.setItem(
			'LinkedintokenCredentials',
			JSON.stringify(this.AccessToken)
		);
	}

	removeCredentials() {
		//delete this.config.credentials.token;
		window.localStorage.removeItem('LinkedintokenCredentials');
	}

	restoreCredentials() {
		var savedCredentials = window.localStorage.getItem('LinkedintokenCredentials');
		if (savedCredentials) {
			this.AccessToken = JSON.parse(savedCredentials);
		}
		return this;
	}

	linkedinMe() {
		this.LinkedinApi.linkedinme(this.AccessToken.response.access_token)
			.subscribe((Linkedin: Linkedin[]) => {
			this.Linkedin = Linkedin,
				console.log(this.Linkedin)
			},
			error => {
				this.error = error
				if (this.error !== undefined) { this.linkedinAuthorize() }
			})
	}

	linkedinShare(linkedincompanyid, comment, title, description, submittedurl, submittedimageurl) {
		this.LinkedinApi.linkedinsharecompanyupdate(this.AccessToken.response.access_token, comment, title, description, submittedurl, submittedimageurl)
			.subscribe((share) => {
			this.linkedinshare = share,
				console.log(this.linkedinShare)
			})
	}


	public onSelectLinkedin(Linkedin: Linkedin): void {
		this.selectedLinkedin = Linkedin;
	}

	public saveLinkedin(): void {
		this.LinkedinApi.onUpsert(this.selectedLinkedin).subscribe();
	}
}