/* tslint:disable */
import {
  Relations,
  Marketingplannerevents
} from '../index';

declare var Object: any;
export interface MarketingplannerInterface {
  "campaignname"?: string;
  "publicationdate"?: Date;
  "owner"?: string;
  "enddate"?: Date;
  "relationsId"?: any;
  "companyId": string;
  "id"?: any;
  relations?: Relations;
  marketingplannerevents?: Marketingplannerevents[];
}

export class Marketingplanner implements MarketingplannerInterface {
  "campaignname": string;
  "publicationdate": Date;
  "owner": string;
  "enddate": Date;
  "relationsId": any;
  "companyId": string;
  "id": any;
  relations: Relations;
  marketingplannerevents: Marketingplannerevents[];
  constructor(data?: MarketingplannerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Marketingplanner`.
   */
  public static getModelName() {
    return "Marketingplanner";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Marketingplanner for dynamic purposes.
  **/
  public static factory(data: MarketingplannerInterface): Marketingplanner{
    return new Marketingplanner(data);
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
      name: 'Marketingplanner',
      plural: 'Marketingplanners',
      path: 'Marketingplanners',
      idName: 'id',
      properties: {
        "campaignname": {
          name: 'campaignname',
          type: 'string'
        },
        "publicationdate": {
          name: 'publicationdate',
          type: 'Date'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "enddate": {
          name: 'enddate',
          type: 'Date'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
        "id": {
          name: 'id',
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
        marketingplannerevents: {
          name: 'marketingplannerevents',
          type: 'Marketingplannerevents[]',
          model: 'Marketingplannerevents',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'marketingplannerId'
        },
      }
    }
  }
}
