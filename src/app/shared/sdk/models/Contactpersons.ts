/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface ContactpersonsInterface {
  "title"?: string;
  "firstname"?: string;
  "lastname"?: string;
  "function"?: string;
  "email"?: string;
  "officephone"?: string;
  "cellphone"?: string;
  "socialmediaaccount"?: string;
  "im"?: string;
  "imtype"?: string;
  "accountId"?: string;
  "companyId"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Contactpersons implements ContactpersonsInterface {
  "title": string;
  "firstname": string;
  "lastname": string;
  "function": string;
  "email": string;
  "officephone": string;
  "cellphone": string;
  "socialmediaaccount": string;
  "im": string;
  "imtype": string;
  "accountId": string;
  "companyId": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: ContactpersonsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Contactpersons`.
   */
  public static getModelName() {
    return "Contactpersons";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Contactpersons for dynamic purposes.
  **/
  public static factory(data: ContactpersonsInterface): Contactpersons{
    return new Contactpersons(data);
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
      name: 'Contactpersons',
      plural: 'Contactpersons',
      path: 'Contactpersons',
      idName: 'id',
      properties: {
        "title": {
          name: 'title',
          type: 'string'
        },
        "firstname": {
          name: 'firstname',
          type: 'string'
        },
        "lastname": {
          name: 'lastname',
          type: 'string'
        },
        "function": {
          name: 'function',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "officephone": {
          name: 'officephone',
          type: 'string'
        },
        "cellphone": {
          name: 'cellphone',
          type: 'string'
        },
        "socialmediaaccount": {
          name: 'socialmediaaccount',
          type: 'string'
        },
        "im": {
          name: 'im',
          type: 'string'
        },
        "imtype": {
          name: 'imtype',
          type: 'string'
        },
        "accountId": {
          name: 'accountId',
          type: 'string'
        },
        "companyId": {
          name: 'companyId',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "relationsId": {
          name: 'relationsId',
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
