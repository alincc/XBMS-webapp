/* tslint:disable */

declare var Object: any;
export interface IpcheckergeolocationInterface {
  "id"?: number;
}

export class Ipcheckergeolocation implements IpcheckergeolocationInterface {
  "id": number;
  constructor(data?: IpcheckergeolocationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Ipcheckergeolocation`.
   */
  public static getModelName() {
    return "Ipcheckergeolocation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Ipcheckergeolocation for dynamic purposes.
  **/
  public static factory(data: IpcheckergeolocationInterface): Ipcheckergeolocation{
    return new Ipcheckergeolocation(data);
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
      name: 'Ipcheckergeolocation',
      plural: 'Ipcheckergeolocations',
      path: 'Ipcheckergeolocations',
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
