/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface TwitterInterface {
  "name"?: string;
  "AccessToken"?: string;
  "AccessTokenSecret"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Twitter implements TwitterInterface {
  "name": string;
  "AccessToken": string;
  "AccessTokenSecret": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: TwitterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Twitter`.
   */
  public static getModelName() {
    return "Twitter";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Twitter for dynamic purposes.
  **/
  public static factory(data: TwitterInterface): Twitter{
    return new Twitter(data);
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
      name: 'Twitter',
      plural: 'Twitters',
      path: 'Twitters',
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
