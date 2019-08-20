/* tslint:disable */

declare var Object: any;
export interface ArticlereposterInterface {
  "name"?: string;
  "date"?: Date;
  "url"?: string;
  "term"?: string;
  "response"?: any;
  "people"?: boolean;
  "companies"?: boolean;
  "locations"?: boolean;
  "findlist"?: boolean;
  "timeframe"?: string;
  "output"?: string;
  "status"?: string;
  "id"?: number;
  "relationsId"?: any;
  relations?: any;
}

export class Articlereposter implements ArticlereposterInterface {
  "name": string;
  "date": Date;
  "url": string;
  "term": string;
  "response": any;
  "people": boolean;
  "companies": boolean;
  "locations": boolean;
  "findlist": boolean;
  "timeframe": string;
  "output": string;
  "status": string;
  "id": number;
  "relationsId": any;
  relations: any;
  constructor(data?: ArticlereposterInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Articlereposter`.
   */
  public static getModelName() {
    return "Articlereposter";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Articlereposter for dynamic purposes.
  **/
  public static factory(data: ArticlereposterInterface): Articlereposter{
    return new Articlereposter(data);
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
      name: 'Articlereposter',
      plural: 'Articlereposters',
      path: 'Articlereposters',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "term": {
          name: 'term',
          type: 'string'
        },
        "response": {
          name: 'response',
          type: 'any'
        },
        "people": {
          name: 'people',
          type: 'boolean',
          default: false
        },
        "companies": {
          name: 'companies',
          type: 'boolean',
          default: false
        },
        "locations": {
          name: 'locations',
          type: 'boolean',
          default: false
        },
        "findlist": {
          name: 'findlist',
          type: 'boolean',
          default: false
        },
        "timeframe": {
          name: 'timeframe',
          type: 'string',
          default: '3m'
        },
        "output": {
          name: 'output',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
      },
      relations: {
        relations: {
          name: 'relations',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'relationsId',
          keyTo: 'id'
        },
      }
    }
  }
}
