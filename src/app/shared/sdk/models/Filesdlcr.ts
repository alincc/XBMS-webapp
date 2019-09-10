/* tslint:disable */

declare var Object: any;
export interface FilesdlcrInterface {
  "name": string;
  "type": string;
  "url": string;
  "relationsId"?: any;
  "companyId": string;
  "publicationsId"?: any;
  "createdate"?: Date;
  "template"?: any;
  "canvas"?: any;
  "id"?: number;
  "filesId"?: any;
  publications?: any;
  relations?: any;
  files?: any;
}

export class Filesdlcr implements FilesdlcrInterface {
  "name": string;
  "type": string;
  "url": string;
  "relationsId": any;
  "companyId": string;
  "publicationsId": any;
  "createdate": Date;
  "template": any;
  "canvas": any;
  "id": number;
  "filesId": any;
  publications: any;
  relations: any;
  files: any;
  constructor(data?: FilesdlcrInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Filesdlcr`.
   */
  public static getModelName() {
    return "Filesdlcr";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Filesdlcr for dynamic purposes.
  **/
  public static factory(data: FilesdlcrInterface): Filesdlcr{
    return new Filesdlcr(data);
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
      name: 'Filesdlcr',
      plural: 'Filesdlcrs',
      path: 'Filesdlcrs',
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
          type: 'string'
        },
        "publicationsId": {
          name: 'publicationsId',
          type: 'any'
        },
        "createdate": {
          name: 'createdate',
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
        "id": {
          name: 'id',
          type: 'number'
        },
        "filesId": {
          name: 'filesId',
          type: 'any'
        },
      },
      relations: {
        publications: {
          name: 'publications',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'publicationsId',
          keyTo: 'id'
        },
        relations: {
          name: 'relations',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'relationsId',
          keyTo: 'id'
        },
        files: {
          name: 'files',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'filesId',
          keyTo: 'id'
        },
      }
    }
  }
}
