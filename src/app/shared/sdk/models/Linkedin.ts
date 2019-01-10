/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface LinkedinInterface {
  "name"?: string;
  "profileorcompany"?: string;
  "code"?: string;
  "scope"?: string;
  "callbackurl"?: string;
  "connections"?: string;
  "groupfeeds"?: string;
  "me"?: string;
  "linkedincompanyid"?: string;
  "linkedinprofileid"?: string;
  "relationsId"?: any;
  "accesstoken"?: string;
  "tokenexpires"?: string;
  "id"?: any;
  "linkedinId"?: any;
  relations?: Relations;
}

export class Linkedin implements LinkedinInterface {
  "name": string;
  "profileorcompany": string;
  "code": string;
  "scope": string;
  "callbackurl": string;
  "connections": string;
  "groupfeeds": string;
  "me": string;
  "linkedincompanyid": string;
  "linkedinprofileid": string;
  "relationsId": any;
  "accesstoken": string;
  "tokenexpires": string;
  "id": any;
  "linkedinId": any;
  relations: Relations;
  constructor(data?: LinkedinInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Linkedin`.
   */
  public static getModelName() {
    return "Linkedin";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Linkedin for dynamic purposes.
  **/
  public static factory(data: LinkedinInterface): Linkedin{
    return new Linkedin(data);
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
      name: 'Linkedin',
      plural: 'Linkedins',
      path: 'Linkedins',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "profileorcompany": {
          name: 'profileorcompany',
          type: 'string'
        },
        "code": {
          name: 'code',
          type: 'string'
        },
        "scope": {
          name: 'scope',
          type: 'string'
        },
        "callbackurl": {
          name: 'callbackurl',
          type: 'string'
        },
        "connections": {
          name: 'connections',
          type: 'string'
        },
        "groupfeeds": {
          name: 'groupfeeds',
          type: 'string'
        },
        "me": {
          name: 'me',
          type: 'string'
        },
        "linkedincompanyid": {
          name: 'linkedincompanyid',
          type: 'string'
        },
        "linkedinprofileid": {
          name: 'linkedinprofileid',
          type: 'string'
        },
        "relationsId": {
          name: 'relationsId',
          type: 'any'
        },
        "accesstoken": {
          name: 'accesstoken',
          type: 'string'
        },
        "tokenexpires": {
          name: 'tokenexpires',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "linkedinId": {
          name: 'linkedinId',
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
