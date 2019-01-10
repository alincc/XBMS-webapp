/* tslint:disable */
import {
  Relations,
  Googleanalytics,
  Publications,
  Calls,
  Translation,
  Account,
  Team,
  Files,
  Emailhandler,
  Logger
} from '../index';

declare var Object: any;
export interface CompanyInterface {
  "accountId"?: any;
  "memberId"?: string;
  "companyname"?: string;
  "id"?: any;
  relations?: Relations[];
  googleanalytics?: Googleanalytics[];
  publications?: Publications[];
  calls?: Calls[];
  translation?: Translation[];
  account?: Account[];
  team?: Team[];
  files?: Files[];
  emailhandler?: Emailhandler[];
  logger?: Logger[];
}

export class Company implements CompanyInterface {
  "accountId": any;
  "memberId": string;
  "companyname": string;
  "id": any;
  relations: Relations[];
  googleanalytics: Googleanalytics[];
  publications: Publications[];
  calls: Calls[];
  translation: Translation[];
  account: Account[];
  team: Team[];
  files: Files[];
  emailhandler: Emailhandler[];
  logger: Logger[];
  constructor(data?: CompanyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public static getModelName() {
    return "Company";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Company for dynamic purposes.
  **/
  public static factory(data: CompanyInterface): Company{
    return new Company(data);
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
      name: 'Company',
      plural: 'Companies',
      path: 'Companies',
      idName: 'id',
      properties: {
        "accountId": {
          name: 'accountId',
          type: 'any'
        },
        "memberId": {
          name: 'memberId',
          type: 'string'
        },
        "companyname": {
          name: 'companyname',
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
          type: 'Relations[]',
          model: 'Relations',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        googleanalytics: {
          name: 'googleanalytics',
          type: 'Googleanalytics[]',
          model: 'Googleanalytics',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        publications: {
          name: 'publications',
          type: 'Publications[]',
          model: 'Publications',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        calls: {
          name: 'calls',
          type: 'Calls[]',
          model: 'Calls',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        translation: {
          name: 'translation',
          type: 'Translation[]',
          model: 'Translation',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        account: {
          name: 'account',
          type: 'Account[]',
          model: 'Account',
          relationType: 'hasMany',
          modelThrough: 'Team',
          keyThrough: 'accountId',
          keyFrom: 'id',
          keyTo: 'companyId'
        },
        team: {
          name: 'team',
          type: 'Team[]',
          model: 'Team',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        files: {
          name: 'files',
          type: 'Files[]',
          model: 'Files',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        emailhandler: {
          name: 'emailhandler',
          type: 'Emailhandler[]',
          model: 'Emailhandler',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
        logger: {
          name: 'logger',
          type: 'Logger[]',
          model: 'Logger',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
      }
    }
  }
}
