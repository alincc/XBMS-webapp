/* tslint:disable */
import {
  Publications,
  Relations,
  Company
} from '../index';

declare var Object: any;
export interface FilesInterface {
  "name": string;
  "type": string;
  "url": string;
  "relationsId"?: any;
  "companyId": any;
  "publicationsId"?: any;
  "createdate"?: Date;
  "lastchangedate"?: Date;
  "template"?: any;
  "canvas"?: any;
  "counter"?: number;
  "size"?: number;
  "screenshot"?: string;
  "id"?: any;
  "filesId"?: any;
  publications?: Publications;
  relations?: Relations;
  files?: Company;
}

export class Files implements FilesInterface {
  "name": string;
  "type": string;
  "url": string;
  "relationsId": any;
  "companyId": any;
  "publicationsId": any;
  "createdate": Date;
  "lastchangedate": Date;
  "template": any;
  "canvas": any;
  "counter": number;
  "size": number;
  "screenshot": string;
  "id": any;
  "filesId": any;
  publications: Publications;
  relations: Relations;
  files: Company;
  constructor(data?: FilesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Files`.
   */
  public static getModelName() {
    return "Files";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Files for dynamic purposes.
  **/
  public static factory(data: FilesInterface): Files{
    return new Files(data);
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
      name: 'Files',
      plural: 'Files',
      path: 'Files',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "publicationsId": {
          name: 'publicationsId',
          type: 'any'
        },
        "createdate": {
          name: 'createdate',
          type: 'Date'
        },
        "lastchangedate": {
          name: 'lastchangedate',
          type: 'Date'
        },
        "template": {
          name: 'template',
          type: 'any'
        },
        "canvas": {
          name: 'canvas',
          type: 'any'
        },
        "counter": {
          name: 'counter',
          type: 'number'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "screenshot": {
          name: 'screenshot',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "filesId": {
          name: 'filesId',
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
        files: {
          name: 'files',
          type: 'Company',
          model: 'Company',
          relationType: 'belongsTo',
                  keyFrom: 'filesId',
          keyTo: 'id'
        },
      }
    }
  }
}
