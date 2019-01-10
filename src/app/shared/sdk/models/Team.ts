/* tslint:disable */
import {
  Company,
  Account
} from '../index';

declare var Object: any;
export interface TeamInterface {
  "accountId": any;
  "companyId": any;
  "teamName"?: string;
  "username": string;
  "id"?: any;
  company?: Company;
  account?: Account;
}

export class Team implements TeamInterface {
  "accountId": any;
  "companyId": any;
  "teamName": string;
  "username": string;
  "id": any;
  company: Company;
  account: Account;
  constructor(data?: TeamInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Team`.
   */
  public static getModelName() {
    return "Team";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Team for dynamic purposes.
  **/
  public static factory(data: TeamInterface): Team{
    return new Team(data);
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
      name: 'Team',
      plural: 'Teams',
      path: 'Teams',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "companyId": {
          name: 'companyId',
          type: 'any'
        },
        "teamName": {
          name: 'teamName',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "id": {
          name: 'id',
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
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
      }
    }
  }
}
