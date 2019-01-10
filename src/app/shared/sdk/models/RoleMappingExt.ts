/* tslint:disable */
import {
  RoleExt
} from '../index';

declare var Object: any;
export interface RoleMappingExtInterface {
  "id"?: any;
  "principalType"?: string;
  "principalId"?: string;
  "roleId"?: any;
  role?: RoleExt;
}

export class RoleMappingExt implements RoleMappingExtInterface {
  "id": any;
  "principalType": string;
  "principalId": string;
  "roleId": any;
  role: RoleExt;
  constructor(data?: RoleMappingExtInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `RoleMappingExt`.
   */
  public static getModelName() {
    return "RoleMappingExt";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of RoleMappingExt for dynamic purposes.
  **/
  public static factory(data: RoleMappingExtInterface): RoleMappingExt{
    return new RoleMappingExt(data);
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
      name: 'RoleMappingExt',
      plural: 'RoleMappingExts',
      path: 'RoleMappingExts',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "principalType": {
          name: 'principalType',
          type: 'string'
        },
        "principalId": {
          name: 'principalId',
          type: 'string'
        },
        "roleId": {
          name: 'roleId',
          type: 'any'
        },
      },
      relations: {
        role: {
          name: 'role',
          type: 'RoleExt',
          model: 'RoleExt',
          relationType: 'belongsTo',
                  keyFrom: 'roleId',
          keyTo: 'id'
        },
      }
    }
  }
}
