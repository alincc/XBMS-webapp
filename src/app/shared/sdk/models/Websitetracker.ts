/* tslint:disable */
import {
  Relations
} from '../index';

declare var Object: any;
export interface WebsitetrackerInterface {
  "date": Date;
  "IP"?: string;
  "url"?: string;
  "companyname"?: string;
  "hostname"?: string;
  "city"?: string;
  "region"?: string;
  "country"?: string;
  "loc"?: string;
  "org"?: string;
  "postal"?: string;
  "street"?: string;
  "lat"?: string;
  "lon"?: string;
  "ispname"?: string;
  "isp"?: boolean;
  "TRid"?: string;
  "xbms_source"?: string;
  "xbms_medium"?: string;
  "xbms_campaign"?: string;
  "xbms_term"?: string;
  "xbms_content"?: string;
  "id"?: any;
  "relationsId"?: any;
  relations?: Relations;
}

export class Websitetracker implements WebsitetrackerInterface {
  "date": Date;
  "IP": string;
  "url": string;
  "companyname": string;
  "hostname": string;
  "city": string;
  "region": string;
  "country": string;
  "loc": string;
  "org": string;
  "postal": string;
  "street": string;
  "lat": string;
  "lon": string;
  "ispname": string;
  "isp": boolean;
  "TRid": string;
  "xbms_source": string;
  "xbms_medium": string;
  "xbms_campaign": string;
  "xbms_term": string;
  "xbms_content": string;
  "id": any;
  "relationsId": any;
  relations: Relations;
  constructor(data?: WebsitetrackerInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Websitetracker`.
   */
  public static getModelName() {
    return "Websitetracker";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Websitetracker for dynamic purposes.
  **/
  public static factory(data: WebsitetrackerInterface): Websitetracker{
    return new Websitetracker(data);
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
      name: 'Websitetracker',
      plural: 'Websitetrackers',
      path: 'Websitetrackers',
      idName: 'id',
      properties: {
        "date": {
          name: 'date',
          type: 'Date'
        },
        "IP": {
          name: 'IP',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "companyname": {
          name: 'companyname',
          type: 'string'
        },
        "hostname": {
          name: 'hostname',
          type: 'string'
        },
        "city": {
          name: 'city',
          type: 'string'
        },
        "region": {
          name: 'region',
          type: 'string'
        },
        "country": {
          name: 'country',
          type: 'string'
        },
        "loc": {
          name: 'loc',
          type: 'string'
        },
        "org": {
          name: 'org',
          type: 'string'
        },
        "postal": {
          name: 'postal',
          type: 'string'
        },
        "street": {
          name: 'street',
          type: 'string'
        },
        "lat": {
          name: 'lat',
          type: 'string'
        },
        "lon": {
          name: 'lon',
          type: 'string'
        },
        "ispname": {
          name: 'ispname',
          type: 'string'
        },
        "isp": {
          name: 'isp',
          type: 'boolean',
          default: false
        },
        "TRid": {
          name: 'TRid',
          type: 'string'
        },
        "xbms_source": {
          name: 'xbms_source',
          type: 'string'
        },
        "xbms_medium": {
          name: 'xbms_medium',
          type: 'string'
        },
        "xbms_campaign": {
          name: 'xbms_campaign',
          type: 'string'
        },
        "xbms_term": {
          name: 'xbms_term',
          type: 'string'
        },
        "xbms_content": {
          name: 'xbms_content',
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
