/* tslint:disable */
import {
  Relations,
  Marketingplannerevents,
  Mailinglist
} from '../index';

declare var Object: any;
export interface MailingInterface {
  "title"?: string;
  "to"?: string;
  "from"?: string;
  "subject"?: string;
  "text"?: string;
  "html"?: string;
  "send"?: boolean;
  "concept"?: boolean;
  "trackingid"?: string;
  "mailing"?: string;
  "done"?: boolean;
  "status"?: string;
  "totalopened"?: number;
  "totalclicked"?: number;
  "totalbounced"?: number;
  "totaldropped"?: number;
  "totaldelivered"?: number;
  "totalunsubscribed"?: number;
  "scheduled"?: boolean;
  "date"?: Date;
  "localtime"?: string;
  "time"?: string;
  "localdate"?: Date;
  "timezone"?: string;
  "senddate"?: string;
  "relationname"?: string;
  "marketingplannereventsIds"?: any;
  "selectedlists"?: any;
  "toopened"?: boolean;
  "toclicked"?: boolean;
  "id"?: any;
  "relationsId"?: any;
  "marketingplannereventsId"?: any;
  "mailingId"?: any;
  "mailinglistId"?: Array<any>;
  relations?: Relations;
  marketingplannerevents?: Marketingplannerevents;
  mailinglist?: Mailinglist[];
}

export class Mailing implements MailingInterface {
  "title": string;
  "to": string;
  "from": string;
  "subject": string;
  "text": string;
  "html": string;
  "send": boolean;
  "concept": boolean;
  "trackingid": string;
  "mailing": string;
  "done": boolean;
  "status": string;
  "totalopened": number;
  "totalclicked": number;
  "totalbounced": number;
  "totaldropped": number;
  "totaldelivered": number;
  "totalunsubscribed": number;
  "scheduled": boolean;
  "date": Date;
  "localtime": string;
  "time": string;
  "localdate": Date;
  "timezone": string;
  "senddate": string;
  "relationname": string;
  "marketingplannereventsIds": any;
  "selectedlists": any;
  "toopened": boolean;
  "toclicked": boolean;
  "id": any;
  "relationsId": any;
  "marketingplannereventsId": any;
  "mailingId": any;
  "mailinglistId": Array<any>;
  relations: Relations;
  marketingplannerevents: Marketingplannerevents;
  mailinglist: Mailinglist[];
  constructor(data?: MailingInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Mailing`.
   */
  public static getModelName() {
    return "Mailing";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Mailing for dynamic purposes.
  **/
  public static factory(data: MailingInterface): Mailing{
    return new Mailing(data);
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
      name: 'Mailing',
      plural: 'Mailings',
      path: 'Mailings',
      idName: 'id',
      properties: {
        "title": {
          name: 'title',
          type: 'string'
        },
        "to": {
          name: 'to',
          type: 'string'
        },
        "from": {
          name: 'from',
          type: 'string'
        },
        "subject": {
          name: 'subject',
          type: 'string'
        },
        "text": {
          name: 'text',
          type: 'string'
        },
        "html": {
          name: 'html',
          type: 'string'
        },
        "send": {
          name: 'send',
          type: 'boolean',
          default: false
        },
        "concept": {
          name: 'concept',
          type: 'boolean'
        },
        "trackingid": {
          name: 'trackingid',
          type: 'string'
        },
        "mailing": {
          name: 'mailing',
          type: 'string'
        },
        "done": {
          name: 'done',
          type: 'boolean',
          default: false
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "totalopened": {
          name: 'totalopened',
          type: 'number',
          default: 0
        },
        "totalclicked": {
          name: 'totalclicked',
          type: 'number',
          default: 0
        },
        "totalbounced": {
          name: 'totalbounced',
          type: 'number',
          default: 0
        },
        "totaldropped": {
          name: 'totaldropped',
          type: 'number',
          default: 0
        },
        "totaldelivered": {
          name: 'totaldelivered',
          type: 'number',
          default: 0
        },
        "totalunsubscribed": {
          name: 'totalunsubscribed',
          type: 'number',
          default: 0
        },
        "scheduled": {
          name: 'scheduled',
          type: 'boolean',
          default: false
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "localtime": {
          name: 'localtime',
          type: 'string'
        },
        "time": {
          name: 'time',
          type: 'string'
        },
        "localdate": {
          name: 'localdate',
          type: 'Date'
        },
        "timezone": {
          name: 'timezone',
          type: 'string'
        },
        "senddate": {
          name: 'senddate',
          type: 'string'
        },
        "relationname": {
          name: 'relationname',
          type: 'string'
        },
        "marketingplannereventsIds": {
          name: 'marketingplannereventsIds',
          type: 'any'
        },
        "selectedlists": {
          name: 'selectedlists',
          type: 'any'
        },
        "toopened": {
          name: 'toopened',
          type: 'boolean'
        },
        "toclicked": {
          name: 'toclicked',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "marketingplannereventsId": {
          name: 'marketingplannereventsId',
          type: 'any'
        },
        "mailingId": {
          name: 'mailingId',
          type: 'any'
        },
        "mailinglistId": {
          name: 'mailinglistId',
          type: 'Array&lt;any&gt;',
          default: <any>[]
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
        marketingplannerevents: {
          name: 'marketingplannerevents',
          type: 'Marketingplannerevents',
          model: 'Marketingplannerevents',
          relationType: 'belongsTo',
                  keyFrom: 'marketingplannereventsId',
          keyTo: 'id'
        },
        mailinglist: {
          name: 'mailinglist',
          type: 'Mailinglist[]',
          model: 'Mailinglist',
          relationType: 'referencesMany',
                  keyFrom: 'mailinglistId',
          keyTo: 'id'
        },
      }
    }
  }
}
