/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface AdwordsInterface {
  "account"?: string;
  "developertoken"?: string;
  "useragent"?: string;
  "clientcustomerid"?: string;
  "client_id"?: string;
  "client_secret"?: string;
  "refresh_token"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Adwords implements AdwordsInterface {
  "account": string;
  "developertoken": string;
  "useragent": string;
  "clientcustomerid": string;
  "client_id": string;
  "client_secret": string;
  "refresh_token": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: AdwordsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Adwords`.
   */
  public static getModelName() {
    return "Adwords";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Adwords for dynamic purposes.
  **/
  public static factory(data: AdwordsInterface): Adwords{
    return new Adwords(data);
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
      name: 'Adwords',
      plural: 'Adwords',
      path: 'Adwords',
      idName: 'id',
      properties: {
        "account": {
          name: 'account',
          type: 'string'
        },
        "developertoken": {
          name: 'developertoken',
          type: 'string'
        },
        "useragent": {
          name: 'useragent',
          type: 'string'
        },
        "clientcustomerid": {
          name: 'clientcustomerid',
          type: 'string'
        },
        "client_id": {
          name: 'client_id',
          type: 'string'
        },
        "client_secret": {
          name: 'client_secret',
          type: 'string'
        },
        "refresh_token": {
          name: 'refresh_token',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "relationsId": {
          name: 'relationsId',
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
