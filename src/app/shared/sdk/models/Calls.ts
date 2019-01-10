/* tslint:disable */
import {
  Relations,
  Company
} from '../index';

declare var Object: any;
export interface CallsInterface {
  "title"?: string;
  "date"?: Date;
  "calltype"?: string;
  "content"?: string;
  "notes"?: any;
  "callbackdate"?: Date;
  "attendee"?: any;
  "tasks"?: any;
  "followup"?: boolean;
  "followupdone"?: boolean;
  "datechange"?: Date;
  "publisherId"?: string;
  "relationsId": any;
  "companyId"?: any;
  "accountId"?: string;
  "email"?: string;
  "html"?: string;
  "id"?: any;
  "callsId"?: any;
  relations?: Relations;
  calls?: Calls;
  company?: Company;
}

export class Calls implements CallsInterface {
  "title": string;
  "date": Date;
  "calltype": string;
  "content": string;
  "notes": any;
  "callbackdate": Date;
  "attendee": any;
  "tasks": any;
  "followup": boolean;
  "followupdone": boolean;
  "datechange": Date;
  "publisherId": string;
  "relationsId": any;
  "companyId": any;
  "accountId": string;
  "email": string;
  "html": string;
  "id": any;
  "callsId": any;
  relations: Relations;
  calls: Calls;
  company: Company;
  constructor(data?: CallsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Calls`.
   */
  public static getModelName() {
    return "Calls";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Calls for dynamic purposes.
  **/
  public static factory(data: CallsInterface): Calls{
    return new Calls(data);
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
      name: 'Calls',
      plural: 'Calls',
      path: 'Calls',
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
        "calltype": {
          name: 'calltype',
          type: 'string'
        },
        "content": {
          name: 'content',
          type: 'string'
        },
        "notes": {
          name: 'notes',
          type: 'any'
        },
        "callbackdate": {
          name: 'callbackdate',
          type: 'Date'
        },
        "attendee": {
          name: 'attendee',
          type: 'any'
        },
        "tasks": {
          name: 'tasks',
          type: 'any'
        },
        "followup": {
          name: 'followup',
          type: 'boolean',
          default: false
        },
        "followupdone": {
          name: 'followupdone',
          type: 'boolean',
          default: false
        },
        "datechange": {
          name: 'datechange',
          type: 'Date'
        },
        "publisherId": {
          name: 'publisherId',
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
        "accountId": {
          name: 'accountId',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "html": {
          name: 'html',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "callsId": {
          name: 'callsId',
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
        calls: {
          name: 'calls',
          type: 'Calls',
          model: 'Calls',
          relationType: 'belongsTo',
                  keyFrom: 'callsId',
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
      }
    }
  }
}
