/* tslint:disable */
/**
* @module SDKModule
* @author Jonathan Casarrubias <t:@johncasarrubias> <gh:jonathan-casarrubias>
* @license MIT 2016 Jonathan Casarrubias
* @version 2.1.0
* @description
* The SDKModule is a generated Software Development Kit automatically built by
* the LoopBack SDK Builder open source module.
*
* The SDKModule provides Angular 2 >= RC.5 support, which means that NgModules
* can import this Software Development Kit as follows:
*
*
* APP Route Module Context
* ============================================================================
* import { NgModule }       from '@angular/core';
* import { BrowserModule }  from '@angular/platform-browser';
* // App Root 
* import { AppComponent }   from './app.component';
* // Feature Modules
* import { SDK[Browser|Node|Native]Module } from './shared/sdk/sdk.module';
* // Import Routing
* import { routing }        from './app.routing';
* @NgModule({
*  imports: [
*    BrowserModule,
*    routing,
*    SDK[Browser|Node|Native]Module.forRoot()
*  ],
*  declarations: [ AppComponent ],
*  bootstrap:    [ AppComponent ]
* })
* export class AppModule { }
*
**/
import { ErrorHandler } from './services/core/error.service';
import { LoopBackAuth } from './services/core/auth.service';
import { LoggerService } from './services/custom/logger.service';
import { SDKModels } from './services/custom/SDKModels';
import { InternalStorage, SDKStorage } from './storage/storage.swaps';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CookieBrowser } from './storage/cookie.browser';
import { StorageBrowser } from './storage/storage.browser';
import { SocketBrowser } from './sockets/socket.browser';
import { SocketDriver } from './sockets/socket.driver';
import { SocketConnection } from './sockets/socket.connections';
import { RealTime } from './services/core/real.time';
import { UserApi } from './services/custom/User';
import { RelationsApi } from './services/custom/Relations';
import { ContactpersonsApi } from './services/custom/Contactpersons';
import { PublicationsApi } from './services/custom/Publications';
import { CallsApi } from './services/custom/Calls';
import { AccountApi } from './services/custom/Account';
import { ContainerApi } from './services/custom/Container';
import { ContainersecureApi } from './services/custom/Containersecure';
import { LinkedinApi } from './services/custom/Linkedin';
import { MarketingplannerApi } from './services/custom/Marketingplanner';
import { MarketingplannereventsApi } from './services/custom/Marketingplannerevents';
import { TranslationApi } from './services/custom/Translation';
import { TwitterApi } from './services/custom/Twitter';
import { PinterestApi } from './services/custom/Pinterest';
import { GoogleanalyticsApi } from './services/custom/Googleanalytics';
import { EmailApi } from './services/custom/Email';
import { CompanyApi } from './services/custom/Company';
import { RoleExtApi } from './services/custom/RoleExt';
import { RoleMappingExtApi } from './services/custom/RoleMappingExt';
import { TeamApi } from './services/custom/Team';
import { ChannelsApi } from './services/custom/Channels';
import { PromotionsApi } from './services/custom/Promotions';
import { UnsortedcallsApi } from './services/custom/Unsortedcalls';
import { MailingApi } from './services/custom/Mailing';
import { FilesApi } from './services/custom/Files';
import { MailinglistApi } from './services/custom/Mailinglist';
import { EmailhandlerApi } from './services/custom/Emailhandler';
import { TranslationjobApi } from './services/custom/Translationjob';
import { FacebookApi } from './services/custom/Facebook';
import { AdwordsApi } from './services/custom/Adwords';
import { WebsitetrackerApi } from './services/custom/Websitetracker';
import { IpcheckermodelApi } from './services/custom/Ipcheckermodel';
import { IpcheckermodelarinApi } from './services/custom/Ipcheckermodelarin';
import { IpcheckergeolocationApi } from './services/custom/Ipcheckergeolocation';
import { LoggerApi } from './services/custom/Logger';
import { CrawlwebApi } from './services/custom/Crawlweb';
import { ArticlereposterApi } from './services/custom/Articlereposter';
import { FilesdlcrApi } from './services/custom/Filesdlcr';
/**
* @module SDKBrowserModule
* @description
* This module should be imported when building a Web Application in the following scenarios:
*
*  1.- Regular web application
*  2.- Angular universal application (Browser Portion)
*  3.- Progressive applications (Angular Mobile, Ionic, WebViews, etc)
**/
@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ErrorHandler,
    SocketConnection
  ]
})
export class SDKBrowserModule {
  static forRoot(internalStorageProvider: any = {
    provide: InternalStorage,
    useClass: CookieBrowser
  }): ModuleWithProviders {
    return {
      ngModule  : SDKBrowserModule,
      providers : [
        LoopBackAuth,
        LoggerService,
        SDKModels,
        RealTime,
        UserApi,
        RelationsApi,
        ContactpersonsApi,
        PublicationsApi,
        CallsApi,
        AccountApi,
        ContainerApi,
        ContainersecureApi,
        LinkedinApi,
        MarketingplannerApi,
        MarketingplannereventsApi,
        TranslationApi,
        TwitterApi,
        PinterestApi,
        GoogleanalyticsApi,
        EmailApi,
        CompanyApi,
        RoleExtApi,
        RoleMappingExtApi,
        TeamApi,
        ChannelsApi,
        PromotionsApi,
        UnsortedcallsApi,
        MailingApi,
        FilesApi,
        MailinglistApi,
        EmailhandlerApi,
        TranslationjobApi,
        FacebookApi,
        AdwordsApi,
        WebsitetrackerApi,
        IpcheckermodelApi,
        IpcheckermodelarinApi,
        IpcheckergeolocationApi,
        LoggerApi,
        CrawlwebApi,
        ArticlereposterApi,
        FilesdlcrApi,
        internalStorageProvider,
        { provide: SDKStorage, useClass: StorageBrowser },
        { provide: SocketDriver, useClass: SocketBrowser }
      ]
    };
  }
}
/**
* Have Fun!!!
* - Jon
**/
export * from './models/index';
export * from './services/index';
export * from './lb.config';
export * from './storage/storage.swaps';
export { CookieBrowser } from './storage/cookie.browser';
export { StorageBrowser } from './storage/storage.browser';

