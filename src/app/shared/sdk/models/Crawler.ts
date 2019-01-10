/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface CrawlerInterface {
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
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Crawler implements CrawlerInterface {
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
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: CrawlerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Crawler`.
   */
  public static getModelName() {
    return "Crawler";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Crawler for dynamic purposes.
  **/
  public static factory(data: CrawlerInterface): Crawler{
    return new Crawler(data);
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
      name: 'Crawler',
      plural: 'Crawlers',
      path: 'Crawlers',
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
