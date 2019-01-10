/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface GoogleanalyticsInterface {
  "gaclientid": string;
  "email"?: string;
  "startdate"?: Date;
  "enddate"?: Date;
  "dimensions"?: Date;
  "metrics"?: Date;
  "relationsId": any;
  "name"?: string;
  "id"?: any;
  "companyId"?: any;
  relations?: Relations;
}

export class Googleanalytics implements GoogleanalyticsInterface {
  "gaclientid": string;
  "email": string;
  "startdate": Date;
  "enddate": Date;
  "dimensions": Date;
  "metrics": Date;
  "relationsId": any;
  "name": string;
  "id": any;
  "companyId": any;
  relations: Relations;
  constructor(data?: GoogleanalyticsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Googleanalytics`.
   */
  public static getModelName() {
    return "Googleanalytics";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Googleanalytics for dynamic purposes.
  **/
  public static factory(data: GoogleanalyticsInterface): Googleanalytics{
    return new Googleanalytics(data);
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
      name: 'Googleanalytics',
      plural: 'Googleanalytics',
      path: 'Googleanalytics',
      idName: 'id',
      properties: {
        "gaclientid": {
          name: 'gaclientid',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "startdate": {
          name: 'startdate',
          type: 'Date'
        },
        "enddate": {
          name: 'enddate',
          type: 'Date'
        },
        "dimensions": {
          name: 'dimensions',
          type: 'Date'
        },
        "metrics": {
          name: 'metrics',
          type: 'Date'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
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
