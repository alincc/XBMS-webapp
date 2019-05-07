/* tslint:disable */

declare var Object: any;
export interface ContainersecureInterface {
  "id"?: number;
}

export class Containersecure implements ContainersecureInterface {
  "id": number;
  constructor(data?: ContainersecureInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Containersecure`.
   */
  public static getModelName() {
    return "Containersecure";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Containersecure for dynamic purposes.
  **/
  public static factory(data: ContainersecureInterface): Containersecure{
    return new Containersecure(data);
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
      name: 'Containersecure',
      plural: 'Containersecures',
      path: 'Containersecures',
      idName: 'id',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
