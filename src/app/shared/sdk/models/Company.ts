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
  "country"?: string;
  "address"?: string;
  "city"?: string;
  "zipcode"?: string;
  "stateprov"?: string;
  "billingcountry"?: string;
  "billingaddress"?: string;
  "billingcity"?: string;
  "billingzipcode"?: string;
  "billingstateprov"?: string;
  "billingcontact"?: string;
  "vatnr"?: string;
  "billingemail"?: string;
  "phonenumber"?: string;
  "companyprimairycolor"?: string;
  "companysecondarycolor"?: string;
  "companyfont"?: string;
  "companywebsite"?: string;
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
  subscription?: any;
}

export class Company implements CompanyInterface {
  "accountId": any;
  "memberId": string;
  "companyname": string;
  "country": string;
  "address": string;
  "city": string;
  "zipcode": string;
  "stateprov": string;
  "billingcountry": string;
  "billingaddress": string;
  "billingcity": string;
  "billingzipcode": string;
  "billingstateprov": string;
  "billingcontact": string;
  "vatnr": string;
  "billingemail": string;
  "phonenumber": string;
  "companyprimairycolor": string;
  "companysecondarycolor": string;
  "companyfont": string;
  "companywebsite": string;
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
  subscription: any;
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
        "country": {
          name: 'country',
          type: 'string'
        },
        "address": {
          name: 'address',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "zipcode": {
          name: 'zipcode',
          type: 'string'
        },
        "stateprov": {
          name: 'stateprov',
          type: 'string'
        },
        "billingcountry": {
          name: 'billingcountry',
          type: 'string'
        },
        "billingaddress": {
          name: 'billingaddress',
          type: 'string'
        },
        "billingcity": {
          name: 'billingcity',
          type: 'string'
        },
        "billingzipcode": {
          name: 'billingzipcode',
          type: 'string'
        },
        "billingstateprov": {
          name: 'billingstateprov',
          type: 'string'
        },
        "billingcontact": {
          name: 'billingcontact',
          type: 'string'
        },
        "vatnr": {
          name: 'vatnr',
          type: 'string'
        },
        "billingemail": {
          name: 'billingemail',
          type: 'string'
        },
        "phonenumber": {
          name: 'phonenumber',
          type: 'string'
        },
        "companyprimairycolor": {
          name: 'companyprimairycolor',
          type: 'string'
        },
        "companysecondarycolor": {
          name: 'companysecondarycolor',
          type: 'string'
        },
        "companyfont": {
          name: 'companyfont',
          type: 'string'
        },
        "companywebsite": {
          name: 'companywebsite',
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
        subscription: {
          name: 'subscription',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'companyId'
        },
      }
    }
  }
}
