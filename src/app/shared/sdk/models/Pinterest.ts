/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface PinterestInterface {
  "name"?: string;
  "AccessToken"?: string;
  "AccessTokenSecret"?: string;
  "screenname"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Pinterest implements PinterestInterface {
  "name": string;
  "AccessToken": string;
  "AccessTokenSecret": string;
  "screenname": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: PinterestInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Pinterest`.
   */
  public static getModelName() {
    return "Pinterest";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Pinterest for dynamic purposes.
  **/
  public static factory(data: PinterestInterface): Pinterest{
    return new Pinterest(data);
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
      name: 'Pinterest',
      plural: 'Pinterests',
      path: 'Pinterests',
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
        "screenname": {
          name: 'screenname',
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
