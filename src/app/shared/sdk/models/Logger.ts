/* tslint:disable */
import {
  Company
} from '../index';

declare var Object: any;
export interface LoggerInterface {
  "date": Date;
  "user"?: string;
  "company"?: string;
  "relation"?: string;
  "code"?: string;
  "id"?: any;
}

export class Logger implements LoggerInterface {
  "date": Date;
  "user": string;
  "company": string;
  "relation": string;
  "code": string;
  "id": any;
  "companyId": any;
  constructor(data?: LoggerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Logger`.
   */
  public static getModelName() {
    return "Logger";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Logger for dynamic purposes.
  **/
  public static factory(data: LoggerInterface): Logger{
    return new Logger(data);
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
      name: 'Logger',
      plural: 'Loggers',
      path: 'Loggers',
      idName: 'id',
      properties: {
        "date": {
          name: 'date',
          type: 'Date'
        },
        "user": {
          name: 'user',
          type: 'string'
        },
        "company": {
          name: 'company',
          type: 'string'
        },
        "relation": {
          name: 'relation',
          type: 'string'
        },
        "code": {
          name: 'code',
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
        company: {
          name: 'company',
          type: 'Company',
          model: 'Company',
          relationType: 'belongsTo',
                  keyFrom: 'companyId',
          keyTo: 'id'
        },
      }
    }
  }
}
