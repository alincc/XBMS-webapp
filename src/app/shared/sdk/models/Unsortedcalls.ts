/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface UnsortedcallsInterface {
  "title"?: string;
  "date"?: Date;
  "calltype"?: string;
  "content"?: string;
  "notes"?: any;
  "callbackdate"?: Date;
  "attendee"?: any;
  "tasks"?: any;
  "followup"?: boolean;
  "datechange"?: Date;
  "publisherId"?: string;
  "relationsId"?: any;
  "companyId"?: string;
  "accountId"?: any;
  "email"?: string;
  "html"?: string;
  "id"?: any;
  relations?: Account;
}

export class Unsortedcalls implements UnsortedcallsInterface {
  "title": string;
  "date": Date;
  "calltype": string;
  "content": string;
  "notes": any;
  "callbackdate": Date;
  "attendee": any;
  "tasks": any;
  "followup": boolean;
  "datechange": Date;
  "publisherId": string;
  "relationsId": any;
  "companyId": string;
  "accountId": any;
  "email": string;
  "html": string;
  "id": any;
  relations: Account;
  constructor(data?: UnsortedcallsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Unsortedcalls`.
   */
  public static getModelName() {
    return "Unsortedcalls";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Unsortedcalls for dynamic purposes.
  **/
  public static factory(data: UnsortedcallsInterface): Unsortedcalls{
    return new Unsortedcalls(data);
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
      name: 'Unsortedcalls',
      plural: 'Unsortedcalls',
      path: 'Unsortedcalls',
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
          type: 'boolean'
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
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
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
      },
      relations: {
        relations: {
          name: 'relations',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'relationsId',
          keyTo: 'id'
        },
      }
    }
  }
}
