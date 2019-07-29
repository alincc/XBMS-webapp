/* tslint:disable */
import {
  Company,
  Unsortedcalls,
  Emailhandler
} from '../index';

declare var Object: any;
export interface AccountInterface {
  "language"?: string;
  "country"?: string;
  "companyId"?: string;
  "companyname": string;
  "marketingoption"?: string;
  "marketingoptionId"?: string;
  "companyadmin": boolean;
  "standardrelation"?: string;
  "standardGa"?: string;
  "lastlogin"?: Date;
  "signature"?: string;
  "realm"?: string;
  "username"?: string;
  "email": string;
  "emailVerified"?: boolean;
  "id"?: any;
  "password"?: string;
  accessTokens?: any[];
  company?: Company;
  unsortedcalls?: Unsortedcalls[];
  emailhandler?: Emailhandler;
}

export class Account implements AccountInterface {
  "language": string;
  "country": string;
  "companyId": string;
  "companyname": string;
  "marketingoption": string;
  "marketingoptionId": string;
  "companyadmin": boolean;
  "standardrelation": string;
  "standardGa": string;
  "lastlogin": Date;
  "signature": string;
  "realm": string;
  "username": string;
  "email": string;
  "emailVerified": boolean;
  "id": any;
  "password": string;
  accessTokens: any[];
  company: Company;
  unsortedcalls: Unsortedcalls[];
  emailhandler: Emailhandler;
  constructor(data?: AccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public static getModelName() {
    return "Account";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Account for dynamic purposes.
  **/
  public static factory(data: AccountInterface): Account{
    return new Account(data);
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
      name: 'Account',
      plural: 'Accounts',
      path: 'Accounts',
      idName: 'id',
      properties: {
        "language": {
          name: 'language',
          type: 'string',
          default: 'en'
        },
        "country": {
          name: 'country',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
        "companyname": {
          name: 'companyname',
          type: 'string'
        },
        "marketingoption": {
          name: 'marketingoption',
          type: 'string'
        },
        "marketingoptionId": {
          name: 'marketingoptionId',
          type: 'string'
        },
        "companyadmin": {
          name: 'companyadmin',
          type: 'boolean',
          default: true
        },
        "standardrelation": {
          name: 'standardrelation',
          type: 'string'
        },
        "standardGa": {
          name: 'standardGa',
          type: 'string'
        },
        "lastlogin": {
          name: 'lastlogin',
          type: 'Date'
        },
        "signature": {
          name: 'signature',
          type: 'string'
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        company: {
          name: 'company',
          type: 'Company',
          model: 'Company',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        unsortedcalls: {
          name: 'unsortedcalls',
          type: 'Unsortedcalls[]',
          model: 'Unsortedcalls',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        emailhandler: {
          name: 'emailhandler',
          type: 'Emailhandler',
          model: 'Emailhandler',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
      }
    }
  }
}
