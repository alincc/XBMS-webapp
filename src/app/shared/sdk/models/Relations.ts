/* tslint:disable */
import {
  Contactpersons,
  Publications,
  Calls,
  Linkedin,
  Marketingplanner,
  Marketingplannerevents,
  Translation,
  Twitter,
  Googleanalytics,
  Company,
  Channels,
  Mailing,
  Files,
  Mailinglist,
  Facebook,
  Adwords,
  Websitetracker
} from '../index';

declare var Object: any;
export interface RelationsInterface {
  "relationname": string;
  "address1"?: string;
  "address2"?: string;
  "zipcode"?: string;
  "city"?: string;
  "stateprovince"?: string;
  "country"?: string;
  "industry"?: string;
  "website"?: string;
  "generalphone"?: string;
  "status"?: string;
  "updatedate"?: Date;
  "ga-ids"?: string;
  "companyId"?: any;
  "callsId"?: string;
  "contactpersonId"?: string;
  "id"?: any;
  contactpersons?: Contactpersons[];
  publications?: Publications[];
  calls?: Calls[];
  linkedin?: Linkedin[];
  marketingplanner?: Marketingplanner[];
  marketingplannerevents?: Marketingplannerevents[];
  translation?: Translation[];
  twitter?: Twitter[];
  googleanalytics?: Googleanalytics[];
  company?: Company;
  channels?: Channels[];
  mailing?: Mailing[];
  files?: Files[];
  mailinglist?: Mailinglist[];
  facebook?: Facebook[];
  adwords?: Adwords[];
  websitetracker?: Websitetracker[];
}

export class Relations implements RelationsInterface {
  "relationname": string;
  "address1": string;
  "address2": string;
  "zipcode": string;
  "city": string;
  "stateprovince": string;
  "country": string;
  "industry": string;
  "website": string;
  "generalphone": string;
  "status": string;
  "updatedate": Date;
  "ga-ids": string;
  "companyId": any;
  "callsId": string;
  "contactpersonId": string;
  "id": any;
  contactpersons: Contactpersons[];
  publications: Publications[];
  calls: Calls[];
  linkedin: Linkedin[];
  marketingplanner: Marketingplanner[];
  marketingplannerevents: Marketingplannerevents[];
  translation: Translation[];
  twitter: Twitter[];
  googleanalytics: Googleanalytics[];
  company: Company;
  channels: Channels[];
  mailing: Mailing[];
  files: Files[];
  mailinglist: Mailinglist[];
  facebook: Facebook[];
  adwords: Adwords[];
  websitetracker: Websitetracker[];
  constructor(data?: RelationsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Relations`.
   */
  public static getModelName() {
    return "Relations";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Relations for dynamic purposes.
  **/
  public static factory(data: RelationsInterface): Relations{
    return new Relations(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Relations',
      plural: 'Relations',
      path: 'Relations',
      idName: 'id',
      properties: {
        "relationname": {
          name: 'relationname',
          type: 'string',
          default: 'name'
        },
        "address1": {
          name: 'address1',
          type: 'string'
        },
        "address2": {
          name: 'address2',
          type: 'string'
        },
        "zipcode": {
          name: 'zipcode',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "stateprovince": {
          name: 'stateprovince',
          type: 'string'
        },
        "country": {
          name: 'country',
          type: 'string'
        },
        "industry": {
          name: 'industry',
          type: 'string'
        },
        "website": {
          name: 'website',
          type: 'string'
        },
        "generalphone": {
          name: 'generalphone',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "updatedate": {
          name: 'updatedate',
          type: 'Date'
        },
        "ga-ids": {
          name: 'ga-ids',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "callsId": {
          name: 'callsId',
          type: 'string'
        },
        "contactpersonId": {
          name: 'contactpersonId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        contactpersons: {
          name: 'contactpersons',
          type: 'Contactpersons[]',
          model: 'Contactpersons',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        publications: {
          name: 'publications',
          type: 'Publications[]',
          model: 'Publications',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        calls: {
          name: 'calls',
          type: 'Calls[]',
          model: 'Calls',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        linkedin: {
          name: 'linkedin',
          type: 'Linkedin[]',
          model: 'Linkedin',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        marketingplanner: {
          name: 'marketingplanner',
          type: 'Marketingplanner[]',
          model: 'Marketingplanner',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        marketingplannerevents: {
          name: 'marketingplannerevents',
          type: 'Marketingplannerevents[]',
          model: 'Marketingplannerevents',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        translation: {
          name: 'translation',
          type: 'Translation[]',
          model: 'Translation',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        twitter: {
          name: 'twitter',
          type: 'Twitter[]',
          model: 'Twitter',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        googleanalytics: {
          name: 'googleanalytics',
          type: 'Googleanalytics[]',
          model: 'Googleanalytics',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        company: {
          name: 'company',
          type: 'Company',
          model: 'Company',
          relationType: 'belongsTo',
                  keyFrom: 'companyId',
          keyTo: 'id'
        },
        channels: {
          name: 'channels',
          type: 'Channels[]',
          model: 'Channels',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        mailing: {
          name: 'mailing',
          type: 'Mailing[]',
          model: 'Mailing',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        files: {
          name: 'files',
          type: 'Files[]',
          model: 'Files',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        mailinglist: {
          name: 'mailinglist',
          type: 'Mailinglist[]',
          model: 'Mailinglist',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        facebook: {
          name: 'facebook',
          type: 'Facebook[]',
          model: 'Facebook',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        adwords: {
          name: 'adwords',
          type: 'Adwords[]',
          model: 'Adwords',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
        websitetracker: {
          name: 'websitetracker',
          type: 'Websitetracker[]',
          model: 'Websitetracker',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'relationsId'
        },
      }
    }
  }
}
