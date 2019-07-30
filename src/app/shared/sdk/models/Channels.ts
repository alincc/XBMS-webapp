/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface ChannelsInterface {
  "type": string;
  "date"?: Date;
  "language"?: string;
  "text"?: string;
  "title"?: string;
  "picturename"?: string;
  "pictureurl"?: string;
  "videoname"?: string;
  "videourl"?: string;
  "channelId"?: string;
  "views"?: number;
  "likes"?: number;
  "shared"?: number;
  "socialactions"?: number;
  "marketingplannereventsIds"?: string;
  "relationsId"?: any;
  "companypage"?: string;
  "recurrence"?: boolean;
  "interval"?: string;
  "dayinterval"?: string;
  "monthinterval"?: string;
  "timeinterval"?: string;
  "yearinterval"?: string;
  "endday"?: Date;
  "relatedrecurrendevents"?: Array<any>;
  "timezone"?: string;
  "channelsendid"?: string;
  "channelsendaccountid"?: string;
  "send"?: boolean;
  "scheduled"?: boolean;
  "primairychannel"?: boolean;
  "shareurl"?: string;
  "userid"?: string;
  "usertags"?: string;
  "hashtags"?: any;
  "id"?: any;
  "publicationsId"?: any;
  relations?: Relations;
}

export class Channels implements ChannelsInterface {
  "type": string;
  "date": Date;
  "language": string;
  "text": string;
  "title": string;
  "picturename": string;
  "pictureurl": string;
  "videoname": string;
  "videourl": string;
  "channelId": string;
  "views": number;
  "likes": number;
  "shared": number;
  "socialactions": number;
  "marketingplannereventsIds": string;
  "relationsId": any;
  "companypage": string;
  "recurrence": boolean;
  "interval": string;
  "dayinterval": string;
  "monthinterval": string;
  "timeinterval": string;
  "yearinterval": string;
  "endday": Date;
  "relatedrecurrendevents": Array<any>;
  "timezone": string;
  "channelsendid": string;
  "channelsendaccountid": string;
  "send": boolean;
  "scheduled": boolean;
  "primairychannel": boolean;
  "shareurl": string;
  "userid": string;
  "usertags": string;
  "hashtags": any;
  "id": any;
  "publicationsId": any;
  relations: Relations;
  constructor(data?: ChannelsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Channels`.
   */
  public static getModelName() {
    return "Channels";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Channels for dynamic purposes.
  **/
  public static factory(data: ChannelsInterface): Channels{
    return new Channels(data);
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
      name: 'Channels',
      plural: 'Channels',
      path: 'Channels',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "language": {
          name: 'language',
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
        "videoname": {
          name: 'videoname',
          type: 'string'
        },
        "videourl": {
          name: 'videourl',
          type: 'string'
        },
        "channelId": {
          name: 'channelId',
          type: 'string'
        },
        "views": {
          name: 'views',
          type: 'number',
          default: 0
        },
        "likes": {
          name: 'likes',
          type: 'number',
          default: 0
        },
        "shared": {
          name: 'shared',
          type: 'number',
          default: 0
        },
        "socialactions": {
          name: 'socialactions',
          type: 'number',
          default: 0
        },
        "marketingplannereventsIds": {
          name: 'marketingplannereventsIds',
          type: 'string'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "companypage": {
          name: 'companypage',
          type: 'string'
        },
        "recurrence": {
          name: 'recurrence',
          type: 'boolean',
          default: false
        },
        "interval": {
          name: 'interval',
          type: 'string'
        },
        "dayinterval": {
          name: 'dayinterval',
          type: 'string'
        },
        "monthinterval": {
          name: 'monthinterval',
          type: 'string'
        },
        "timeinterval": {
          name: 'timeinterval',
          type: 'string'
        },
        "yearinterval": {
          name: 'yearinterval',
          type: 'string'
        },
        "endday": {
          name: 'endday',
          type: 'Date'
        },
        "relatedrecurrendevents": {
          name: 'relatedrecurrendevents',
          type: 'Array&lt;any&gt;'
        },
        "timezone": {
          name: 'timezone',
          type: 'string'
        },
        "channelsendid": {
          name: 'channelsendid',
          type: 'string'
        },
        "channelsendaccountid": {
          name: 'channelsendaccountid',
          type: 'string'
        },
        "send": {
          name: 'send',
          type: 'boolean',
          default: false
        },
        "scheduled": {
          name: 'scheduled',
          type: 'boolean',
          default: false
        },
        "primairychannel": {
          name: 'primairychannel',
          type: 'boolean',
          default: false
        },
        "shareurl": {
          name: 'shareurl',
          type: 'string'
        },
        "userid": {
          name: 'userid',
          type: 'string'
        },
        "usertags": {
          name: 'usertags',
          type: 'string'
        },
        "hashtags": {
          name: 'hashtags',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "publicationsId": {
          name: 'publicationsId',
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
      }
    }
  }
}
