/* tslint:disable */
import {
  Relations,
  Container,
  Linkedin,
  Marketingplanner,
  Company,
  Channels,
  Promotions,
  Files
} from '../index';

declare var Object: any;
export interface PublicationsInterface {
  "generalmail"?: string;
  "adwords"?: string;
  "text"?: string;
  "title"?: string;
  "picturename"?: string;
  "pictureurl"?: string;
  "date"?: Date;
  "enddate"?: Date;
  "description"?: string;
  "url"?: string;
  "marketingEventId"?: string;
  "relationsId"?: any;
  "companyId": any;
  "companyname"?: string;
  "recurrence"?: boolean;
  "interval"?: string;
  "dayinterval"?: string;
  "timezone"?: string;
  "timeinterval"?: string;
  "monthinterval"?: string;
  "futuredimages"?: any;
  "keywords"?: string;
  "futuredsocialmedia"?: any;
  "videoname"?: string;
  "videourl"?: string;
  "location"?: string;
  "country"?: string;
  "language"?: string;
  "term"?: string;
  "timeframe"?: string;
  "negativekeywords"?: string;
  "cmsid"?: string;
  "website"?: string;
  "username"?: string;
  "id"?: any;
  "marketingplannerId"?: any;
  relations?: Relations;
  container?: Container[];
  linkedin?: Linkedin[];
  marketingplanner?: Marketingplanner;
  company?: Company;
  channels?: Channels[];
  promotions?: Promotions[];
  files?: Files[];
}

export class Publications implements PublicationsInterface {
  "generalmail": string;
  "adwords": string;
  "text": string;
  "title": string;
  "picturename": string;
  "pictureurl": string;
  "date": Date;
  "enddate": Date;
  "description": string;
  "url": string;
  "marketingEventId": string;
  "relationsId": any;
  "companyId": any;
  "companyname": string;
  "recurrence": boolean;
  "interval": string;
  "dayinterval": string;
  "timezone": string;
  "timeinterval": string;
  "monthinterval": string;
  "futuredimages": any;
  "keywords": string;
  "futuredsocialmedia": any;
  "videoname": string;
  "videourl": string;
  "location": string;
  "country": string;
  "language": string;
  "term": string;
  "timeframe": string;
  "negativekeywords": string;
  "cmsid": string;
  "website": string;
  "username": string;
  "id": any;
  "marketingplannerId": any;
  relations: Relations;
  container: Container[];
  linkedin: Linkedin[];
  marketingplanner: Marketingplanner;
  company: Company;
  channels: Channels[];
  promotions: Promotions[];
  files: Files[];
  constructor(data?: PublicationsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Publications`.
   */
  public static getModelName() {
    return "Publications";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Publications for dynamic purposes.
  **/
  public static factory(data: PublicationsInterface): Publications{
    return new Publications(data);
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
      name: 'Publications',
      plural: 'Publications',
      path: 'Publications',
      idName: 'id',
      properties: {
        "generalmail": {
          name: 'generalmail',
          type: 'string'
        },
        "adwords": {
          name: 'adwords',
          type: 'string'
        },
        "text": {
          name: 'text',
          type: 'string'
        },
        "title": {
          name: 'title',
          type: 'string'
        },
        "picturename": {
          name: 'picturename',
          type: 'string'
        },
        "pictureurl": {
          name: 'pictureurl',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "enddate": {
          name: 'enddate',
          type: 'Date'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "marketingEventId": {
          name: 'marketingEventId',
          type: 'string'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "companyname": {
          name: 'companyname',
          type: 'string'
        },
        "recurrence": {
          name: 'recurrence',
          type: 'boolean'
        },
        "interval": {
          name: 'interval',
          type: 'string'
        },
        "dayinterval": {
          name: 'dayinterval',
          type: 'string'
        },
        "timezone": {
          name: 'timezone',
          type: 'string'
        },
        "timeinterval": {
          name: 'timeinterval',
          type: 'string'
        },
        "monthinterval": {
          name: 'monthinterval',
          type: 'string'
        },
        "futuredimages": {
          name: 'futuredimages',
          type: 'any'
        },
        "keywords": {
          name: 'keywords',
          type: 'string'
        },
        "futuredsocialmedia": {
          name: 'futuredsocialmedia',
          type: 'any'
        },
        "videoname": {
          name: 'videoname',
          type: 'string'
        },
        "videourl": {
          name: 'videourl',
          type: 'string'
        },
        "location": {
          name: 'location',
          type: 'string'
        },
        "country": {
          name: 'country',
          type: 'string'
        },
        "language": {
          name: 'language',
          type: 'string'
        },
        "term": {
          name: 'term',
          type: 'string'
        },
        "timeframe": {
          name: 'timeframe',
          type: 'string',
          default: '1m'
        },
        "negativekeywords": {
          name: 'negativekeywords',
          type: 'string'
        },
        "cmsid": {
          name: 'cmsid',
          type: 'string'
        },
        "website": {
          name: 'website',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "marketingplannerId": {
          name: 'marketingplannerId',
          type: 'any'
        },
      },
      relations: {
        relations: {
          name: 'relations',
          type: 'Relations',
          model: 'Relations',
          relationType: 'belongsTo',
                  keyFrom: 'relationsId',
          keyTo: 'id'
        },
        container: {
          name: 'container',
          type: 'Container[]',
          model: 'Container',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'marketingId'
        },
        linkedin: {
          name: 'linkedin',
          type: 'Linkedin[]',
          model: 'Linkedin',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'linkedinId'
        },
        marketingplanner: {
          name: 'marketingplanner',
          type: 'Marketingplanner',
          model: 'Marketingplanner',
          relationType: 'belongsTo',
                  keyFrom: 'marketingplannerId',
          keyTo: 'id'
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
          keyTo: 'publicationsId'
        },
        promotions: {
          name: 'promotions',
          type: 'Promotions[]',
          model: 'Promotions',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'publicationsId'
        },
        files: {
          name: 'files',
          type: 'Files[]',
          model: 'Files',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'publicationsId'
        },
      }
    }
  }
}
