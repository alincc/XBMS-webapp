/* tslint:disable */

declare var Object: any;
export interface IpcheckermodelInterface {
  "id"?: number;
}

export class Ipcheckermodel implements IpcheckermodelInterface {
  "id": number;
  constructor(data?: IpcheckermodelInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Ipcheckermodel`.
   */
  public static getModelName() {
    return "Ipcheckermodel";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Ipcheckermodel for dynamic purposes.
  **/
  public static factory(data: IpcheckermodelInterface): Ipcheckermodel{
    return new Ipcheckermodel(data);
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
      name: 'Ipcheckermodel',
      plural: 'Ipcheckermodels',
      path: 'Ipcheckermodels',
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
