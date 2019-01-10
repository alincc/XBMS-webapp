/* tslint:disable */
import {
  Publications,
  Relations
} from '../index';

declare var Object: any;
export interface PromotionsInterface {
  "type"?: string;
  "budget"?: string;
  "account"?: string;
  "id"?: any;
  "publicationsId"?: any;
  "relationsId"?: any;
  publications?: Publications;
  relations?: Relations;
}

export class Promotions implements PromotionsInterface {
  "type": string;
  "budget": string;
  "account": string;
  "id": any;
  "publicationsId": any;
  "relationsId": any;
  publications: Publications;
  relations: Relations;
  constructor(data?: PromotionsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Promotions`.
   */
  public static getModelName() {
    return "Promotions";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Promotions for dynamic purposes.
  **/
  public static factory(data: PromotionsInterface): Promotions{
    return new Promotions(data);
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
      name: 'Promotions',
      plural: 'Promotions',
      path: 'Promotions',
      idName: 'id',
      properties: {
        "type": {
          name: 'type',
          type: 'string'
        },
        "budget": {
          name: 'budget',
          type: 'string'
        },
        "account": {
          name: 'account',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "publicationsId": {
          name: 'publicationsId',
          type: 'any'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
      },
      relations: {
        publications: {
          name: 'publications',
          type: 'Publications',
          model: 'Publications',
          relationType: 'belongsTo',
                  keyFrom: 'publicationsId',
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
      }
    }
  }
}
