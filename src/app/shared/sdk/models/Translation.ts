/* tslint:disable */
import {
  Relations,
  Company,
  Translationjob
} from '../index';

declare var Object: any;
export interface TranslationInterface {
  "title"?: string;
  "date"?: Date;
  "credits"?: number;
  "currency"?: string;
  "job_id"?: string;
  "status"?: string;
  "order_id"?: number;
  "eta"?: number;
  "ctime"?: number;
  "companyId"?: any;
  "paymentreceived"?: string;
  "paymentid"?: string;
  "id"?: any;
  "marketingId"?: any;
  "relationsId"?: any;
  marketing?: Relations;
  company?: Company;
  translationjob?: Translationjob[];
}

export class Translation implements TranslationInterface {
  "title": string;
  "date": Date;
  "credits": number;
  "currency": string;
  "job_id": string;
  "status": string;
  "order_id": number;
  "eta": number;
  "ctime": number;
  "companyId": any;
  "paymentreceived": string;
  "paymentid": string;
  "id": any;
  "marketingId": any;
  "relationsId": any;
  marketing: Relations;
  company: Company;
  translationjob: Translationjob[];
  constructor(data?: TranslationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Translation`.
   */
  public static getModelName() {
    return "Translation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Translation for dynamic purposes.
  **/
  public static factory(data: TranslationInterface): Translation{
    return new Translation(data);
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
      name: 'Translation',
      plural: 'Translations',
      path: 'Translations',
      idName: 'id',
      properties: {
        "title": {
          name: 'title',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "credits": {
          name: 'credits',
          type: 'number'
        },
        "currency": {
          name: 'currency',
          type: 'string'
        },
        "job_id": {
          name: 'job_id',
          type: 'string'
        },
        "status": {
          name: 'status',
          type: 'string'
        },
        "order_id": {
          name: 'order_id',
          type: 'number'
        },
        "eta": {
          name: 'eta',
          type: 'number'
        },
        "ctime": {
          name: 'ctime',
          type: 'number'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "paymentreceived": {
          name: 'paymentreceived',
          type: 'string'
        },
        "paymentid": {
          name: 'paymentid',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "marketingId": {
          name: 'marketingId',
          type: 'any'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
      },
      relations: {
        marketing: {
          name: 'marketing',
          type: 'Relations',
          model: 'Relations',
          relationType: 'belongsTo',
                  keyFrom: 'marketingId',
          keyTo: 'id'
        },
        company: {
          name: 'company',
          type: 'Company',
          model: 'Company',
          relationType: 'belongsTo',
                  keyFrom: 'companyId',
          keyTo: 'id'
        },
        translationjob: {
          name: 'translationjob',
          type: 'Translationjob[]',
          model: 'Translationjob',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'translationId'
        },
      }
    }
  }
}
