/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface FacebookInterface {
  "name"?: string;
  "AccessToken"?: string;
  "AccessTokenSecret"?: string;
  "AccessTokenexpires"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Facebook implements FacebookInterface {
  "name": string;
  "AccessToken": string;
  "AccessTokenSecret": string;
  "AccessTokenexpires": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: FacebookInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Facebook`.
   */
  public static getModelName() {
    return "Facebook";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Facebook for dynamic purposes.
  **/
  public static factory(data: FacebookInterface): Facebook{
    return new Facebook(data);
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
      name: 'Facebook',
      plural: 'Facebooks',
      path: 'Facebooks',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "AccessToken": {
          name: 'AccessToken',
          type: 'string'
        },
        "AccessTokenSecret": {
          name: 'AccessTokenSecret',
          type: 'string'
        },
        "AccessTokenexpires": {
          name: 'AccessTokenexpires',
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
