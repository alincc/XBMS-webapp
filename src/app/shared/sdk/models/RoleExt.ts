/* tslint:disable */
import {
  RoleMappingExt
} from '../index';

declare var Object: any;
export interface RoleExtInterface {
  "id"?: any;
  "name": string;
  "description"?: string;
  "created"?: Date;
  "modified"?: Date;
  principals?: RoleMappingExt[];
}

export class RoleExt implements RoleExtInterface {
  "id": any;
  "name": string;
  "description": string;
  "created": Date;
  "modified": Date;
  principals: RoleMappingExt[];
  constructor(data?: RoleExtInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RoleExt`.
   */
  public static getModelName() {
    return "RoleExt";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RoleExt for dynamic purposes.
  **/
  public static factory(data: RoleExtInterface): RoleExt{
    return new RoleExt(data);
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
      name: 'RoleExt',
      plural: 'RoleExts',
      path: 'RoleExts',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
      },
      relations: {
        principals: {
          name: 'principals',
          type: 'RoleMappingExt[]',
          model: 'RoleMappingExt',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'roleId'
        },
      }
    }
  }
}
