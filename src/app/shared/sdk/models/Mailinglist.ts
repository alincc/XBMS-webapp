/* tslint:disable */
import {
  Relations,
  Mailing,
  Marketingplannerevents
} from '../index';

declare var Object: any;
export interface MailinglistInterface {
  "listname"?: string;
  "mailgunid"?: string;
  "relationsId": any;
  "date"?: Date;
  "description"?: string;
  "total"?: number;
  "industry"?: string;
  "geolocation"?: string;
  "categorie"?: string;
  "totalopened"?: string;
  "totalclicked"?: string;
  "id"?: any;
  "marketingplannereventsId"?: any;
  relations?: Relations;
  mailing?: Mailing[];
  marketingplannerevents?: Marketingplannerevents;
}

export class Mailinglist implements MailinglistInterface {
  "listname": string;
  "mailgunid": string;
  "relationsId": any;
  "date": Date;
  "description": string;
  "total": number;
  "industry": string;
  "geolocation": string;
  "categorie": string;
  "totalopened": string;
  "totalclicked": string;
  "id": any;
  "marketingplannereventsId": any;
  relations: Relations;
  mailing: Mailing[];
  marketingplannerevents: Marketingplannerevents;
  constructor(data?: MailinglistInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Mailinglist`.
   */
  public static getModelName() {
    return "Mailinglist";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Mailinglist for dynamic purposes.
  **/
  public static factory(data: MailinglistInterface): Mailinglist{
    return new Mailinglist(data);
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
      name: 'Mailinglist',
      plural: 'Mailinglists',
      path: 'Mailinglists',
      idName: 'id',
      properties: {
        "listname": {
          name: 'listname',
          type: 'string'
        },
        "mailgunid": {
          name: 'mailgunid',
          type: 'string'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "total": {
          name: 'total',
          type: 'number'
        },
        "industry": {
          name: 'industry',
          type: 'string'
        },
        "geolocation": {
          name: 'geolocation',
          type: 'string'
        },
        "categorie": {
          name: 'categorie',
          type: 'string'
        },
        "totalopened": {
          name: 'totalopened',
          type: 'string'
        },
        "totalclicked": {
          name: 'totalclicked',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "marketingplannereventsId": {
          name: 'marketingplannereventsId',
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
        mailing: {
          name: 'mailing',
          type: 'Mailing[]',
          model: 'Mailing',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'mailingId'
        },
        marketingplannerevents: {
          name: 'marketingplannerevents',
          type: 'Marketingplannerevents',
          model: 'Marketingplannerevents',
          relationType: 'belongsTo',
                  keyFrom: 'marketingplannereventsId',
          keyTo: 'id'
        },
      }
    }
  }
}
