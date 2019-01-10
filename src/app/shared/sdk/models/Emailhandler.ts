/* tslint:disable */
import {
  Account,
  Company
} from '../index';

declare var Object: any;
export interface EmailhandlerInterface {
  "username": string;
  "password": string;
  "host": string;
  "port": string;
  "tls": boolean;
  "mailbox": string;
  "searchfilter": string;
  "markseen": boolean;
  "attachments": boolean;
  "accountId": any;
  "companyId": any;
  "id"?: any;
  account?: Account;
  company?: Company;
}

export class Emailhandler implements EmailhandlerInterface {
  "username": string;
  "password": string;
  "host": string;
  "port": string;
  "tls": boolean;
  "mailbox": string;
  "searchfilter": string;
  "markseen": boolean;
  "attachments": boolean;
  "accountId": any;
  "companyId": any;
  "id": any;
  account: Account;
  company: Company;
  constructor(data?: EmailhandlerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Emailhandler`.
   */
  public static getModelName() {
    return "Emailhandler";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Emailhandler for dynamic purposes.
  **/
  public static factory(data: EmailhandlerInterface): Emailhandler{
    return new Emailhandler(data);
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
      name: 'Emailhandler',
      plural: 'Emailhandlers',
      path: 'Emailhandlers',
      idName: 'id',
      properties: {
        "username": {
          name: 'username',
          type: 'string'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
        "host": {
          name: 'host',
          type: 'string'
        },
        "port": {
          name: 'port',
          type: 'string',
          default: '993'
        },
        "tls": {
          name: 'tls',
          type: 'boolean',
          default: true
        },
        "mailbox": {
          name: 'mailbox',
          type: 'string',
          default: 'Inbox'
        },
        "searchfilter": {
          name: 'searchfilter',
          type: 'string',
          default: 'FLAGGED'
        },
        "markseen": {
          name: 'markseen',
          type: 'boolean',
          default: false
        },
        "attachments": {
          name: 'attachments',
          type: 'boolean',
          default: false
        },
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
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
