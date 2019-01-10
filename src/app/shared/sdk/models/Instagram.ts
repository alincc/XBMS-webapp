/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface InstagramInterface {
  "name"?: string;
  "accesstoken"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Instagram implements InstagramInterface {
  "name": string;
  "accesstoken": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: InstagramInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Instagram`.
   */
  public static getModelName() {
    return "Instagram";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Instagram for dynamic purposes.
  **/
  public static factory(data: InstagramInterface): Instagram{
    return new Instagram(data);
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
      name: 'Instagram',
      plural: 'Instagrams',
      path: 'Instagrams',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "accesstoken": {
          name: 'accesstoken',
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
