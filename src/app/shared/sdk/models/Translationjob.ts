/* tslint:disable */
import {
  Translation
} from '../index';

declare var Object: any;
export interface TranslationjobInterface {
  "lc_src"?: string;
  "translator"?: string;
  "body_src"?: string;
  "slug"?: string;
  "title"?: string;
  "job_id"?: string;
  "lc_tgt"?: string;
  "tier"?: string;
  "marketingId"?: any;
  "description"?: string;
  "type"?: string;
  "custom_data"?: string;
  "default"?: string;
  "required"?: boolean;
  "id"?: any;
  "translationId"?: any;
  marketing?: Translation;
}

export class Translationjob implements TranslationjobInterface {
  "lc_src": string;
  "translator": string;
  "body_src": string;
  "slug": string;
  "title": string;
  "job_id": string;
  "lc_tgt": string;
  "tier": string;
  "marketingId": any;
  "description": string;
  "type": string;
  "custom_data": string;
  "default": string;
  "required": boolean;
  "id": any;
  "translationId": any;
  marketing: Translation;
  constructor(data?: TranslationjobInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Translationjob`.
   */
  public static getModelName() {
    return "Translationjob";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Translationjob for dynamic purposes.
  **/
  public static factory(data: TranslationjobInterface): Translationjob{
    return new Translationjob(data);
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
      name: 'Translationjob',
      plural: 'Translationjobs',
      path: 'Translationjobs',
      idName: 'id',
      properties: {
        "lc_src": {
          name: 'lc_src',
          type: 'string',
          default: 'en'
        },
        "translator": {
          name: 'translator',
          type: 'string'
        },
        "body_src": {
          name: 'body_src',
          type: 'string',
          default: 'content'
        },
        "slug": {
          name: 'slug',
          type: 'string',
          default: 'slug'
        },
        "title": {
          name: 'title',
          type: 'string'
        },
        "job_id": {
          name: 'job_id',
          type: 'string'
        },
        "lc_tgt": {
          name: 'lc_tgt',
          type: 'string'
        },
        "tier": {
          name: 'tier',
          type: 'string'
        },
        "marketingId": {
          name: 'marketingId',
          type: 'any'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string',
          default: 'text'
        },
        "custom_data": {
          name: 'custom_data',
          type: 'string'
        },
        "default": {
          name: 'default',
          type: 'string'
        },
        "required": {
          name: 'required',
          type: 'boolean',
          default: true
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "translationId": {
          name: 'translationId',
          type: 'any'
        },
      },
      relations: {
        marketing: {
          name: 'marketing',
          type: 'Translation',
          model: 'Translation',
          relationType: 'belongsTo',
                  keyFrom: 'marketingId',
          keyTo: 'id'
        },
      }
    }
  }
}
