/* tslint:disable */

declare var Object: any;
export interface CrawlwebtocsvInterface {
  "name"?: string;
  "date"?: Date;
  "url"?: string;
  "term"?: string;
  "response"?: any;
  "people"?: boolean;
  "companies"?: boolean;
  "locations"?: boolean;
  "findlist"?: boolean;
  "depth"?: number;
  "output"?: string;
  "status"?: string;
  "id"?: number;
  "relationsId"?: any;
  relations?: any;
}

export class Crawlwebtocsv implements CrawlwebtocsvInterface {
  "name": string;
  "date": Date;
  "url": string;
  "term": string;
  "response": any;
  "people": boolean;
  "companies": boolean;
  "locations": boolean;
  "findlist": boolean;
  "depth": number;
  "output": string;
  "status": string;
  "id": number;
  "relationsId": any;
  relations: any;
  constructor(data?: CrawlwebtocsvInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Crawlwebtocsv`.
   */
  public static getModelName() {
    return "Crawlwebtocsv";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Crawlwebtocsv for dynamic purposes.
  **/
  public static factory(data: CrawlwebtocsvInterface): Crawlwebtocsv{
    return new Crawlwebtocsv(data);
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
      name: 'Crawlwebtocsv',
      plural: 'Crawlwebtocsvs',
      path: 'Crawlwebtocsvs',
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
        "depth": {
          name: 'depth',
          type: 'number',
          default: 3
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
