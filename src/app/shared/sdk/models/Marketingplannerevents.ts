/* tslint:disable */
import {
  Marketingplanner,
  Relations,
  Channels,
  Mailing,
  Mailinglist
} from '../index';

declare var Object: any;
export interface MarketingplannereventsInterface {
  "name"?: string;
  "scheduled"?: boolean;
  "date"?: Date;
  "time"?: string;
  "owner"?: string;
  "companyId"?: string;
  "countsend"?: number;
  "countnotsend"?: number;
  "notes"?: string;
  "id"?: any;
  "marketingplannerId"?: any;
  "relationsId"?: any;
  "marketingplannereventsIds"?: Array<any>;
  "mailinglistId"?: Array<any>;
  marketingplanner?: Marketingplanner;
  relations?: Relations;
  channels?: Channels[];
  mailing?: Mailing[];
  mailinglist?: Mailinglist[];
}

export class Marketingplannerevents implements MarketingplannereventsInterface {
  "name": string;
  "scheduled": boolean;
  "date": Date;
  "time": string;
  "owner": string;
  "companyId": string;
  "countsend": number;
  "countnotsend": number;
  "notes": string;
  "id": any;
  "marketingplannerId": any;
  "relationsId": any;
  "marketingplannereventsIds": Array<any>;
  "mailinglistId": Array<any>;
  marketingplanner: Marketingplanner;
  relations: Relations;
  channels: Channels[];
  mailing: Mailing[];
  mailinglist: Mailinglist[];
  constructor(data?: MarketingplannereventsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Marketingplannerevents`.
   */
  public static getModelName() {
    return "Marketingplannerevents";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Marketingplannerevents for dynamic purposes.
  **/
  public static factory(data: MarketingplannereventsInterface): Marketingplannerevents{
    return new Marketingplannerevents(data);
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
      name: 'Marketingplannerevents',
      plural: 'Marketingplannerevents',
      path: 'Marketingplannerevents',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string',
          default: 'Event'
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
        "time": {
          name: 'time',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
        "countsend": {
          name: 'countsend',
          type: 'number'
        },
        "countnotsend": {
          name: 'countnotsend',
          type: 'number'
        },
        "notes": {
          name: 'notes',
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
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "marketingplannereventsIds": {
          name: 'marketingplannereventsIds',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
        "mailinglistId": {
          name: 'mailinglistId',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        marketingplanner: {
          name: 'marketingplanner',
          type: 'Marketingplanner',
          model: 'Marketingplanner',
          relationType: 'belongsTo',
                  keyFrom: 'marketingplannerId',
          keyTo: 'id'
        },
        relations: {
          name: 'relations',
          type: 'Relations',
          model: 'Relations',
          relationType: 'belongsTo',
                  keyFrom: 'relationsId',
          keyTo: 'id'
        },
        channels: {
          name: 'channels',
          type: 'Channels[]',
          model: 'Channels',
          relationType: 'referencesMany',
                  keyFrom: 'marketingplannereventsIds',
          keyTo: 'id'
        },
        mailing: {
          name: 'mailing',
          type: 'Mailing[]',
          model: 'Mailing',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'marketingplannereventsIds'
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
