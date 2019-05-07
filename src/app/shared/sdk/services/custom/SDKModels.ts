/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Relations } from '../../models/Relations';
import { Contactpersons } from '../../models/Contactpersons';
import { Publications } from '../../models/Publications';
import { Calls } from '../../models/Calls';
import { Account } from '../../models/Account';
import { Container } from '../../models/Container';
import { Containersecure } from '../../models/Containersecure';
import { Linkedin } from '../../models/Linkedin';
import { Marketingplanner } from '../../models/Marketingplanner';
import { Marketingplannerevents } from '../../models/Marketingplannerevents';
import { Translation } from '../../models/Translation';
import { Twitter } from '../../models/Twitter';
import { Googleanalytics } from '../../models/Googleanalytics';
import { Email } from '../../models/Email';
import { Company } from '../../models/Company';
import { RoleExt } from '../../models/RoleExt';
import { RoleMappingExt } from '../../models/RoleMappingExt';
import { Team } from '../../models/Team';
import { Channels } from '../../models/Channels';
import { Promotions } from '../../models/Promotions';
import { Unsortedcalls } from '../../models/Unsortedcalls';
import { Mailing } from '../../models/Mailing';
import { Files } from '../../models/Files';
import { Mailinglist } from '../../models/Mailinglist';
import { Emailhandler } from '../../models/Emailhandler';
import { Translationjob } from '../../models/Translationjob';
import { Facebook } from '../../models/Facebook';
import { Instagram } from '../../models/Instagram';
import { Adwords } from '../../models/Adwords';
import { Crawler } from '../../models/Crawler';
import { Mailverifier } from '../../models/Mailverifier';
import { Websitetracker } from '../../models/Websitetracker';
import { Ipcheckermodel } from '../../models/Ipcheckermodel';
import { Ipcheckermodelarin } from '../../models/Ipcheckermodelarin';
import { Ipcheckergeolocation } from '../../models/Ipcheckergeolocation';
import { Logger } from '../../models/Logger';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Relations: Relations,
    Contactpersons: Contactpersons,
    Publications: Publications,
    Calls: Calls,
    Account: Account,
    Container: Container,
    Containersecure: Containersecure,
    Linkedin: Linkedin,
    Marketingplanner: Marketingplanner,
    Marketingplannerevents: Marketingplannerevents,
    Translation: Translation,
    Twitter: Twitter,
    Googleanalytics: Googleanalytics,
    Email: Email,
    Company: Company,
    RoleExt: RoleExt,
    RoleMappingExt: RoleMappingExt,
    Team: Team,
    Channels: Channels,
    Promotions: Promotions,
    Unsortedcalls: Unsortedcalls,
    Mailing: Mailing,
    Files: Files,
    Mailinglist: Mailinglist,
    Emailhandler: Emailhandler,
    Translationjob: Translationjob,
    Facebook: Facebook,
    Instagram: Instagram,
    Adwords: Adwords,
    Crawler: Crawler,
    Mailverifier: Mailverifier,
    Websitetracker: Websitetracker,
    Ipcheckermodel: Ipcheckermodel,
    Ipcheckermodelarin: Ipcheckermodelarin,
    Ipcheckergeolocation: Ipcheckergeolocation,
    Logger: Logger,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
