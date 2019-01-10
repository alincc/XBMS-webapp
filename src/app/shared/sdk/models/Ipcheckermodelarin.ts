/* tslint:disable */

declare var Object: any;
export interface IpcheckermodelarinInterface {
  "id"?: number;
}

export class Ipcheckermodelarin implements IpcheckermodelarinInterface {
  "id": number;
  constructor(data?: IpcheckermodelarinInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Ipcheckermodelarin`.
   */
  public static getModelName() {
    return "Ipcheckermodelarin";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Ipcheckermodelarin for dynamic purposes.
  **/
  public static factory(data: IpcheckermodelarinInterface): Ipcheckermodelarin{
    return new Ipcheckermodelarin(data);
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
      name: 'Ipcheckermodelarin',
      plural: 'Ipcheckermodelarins',
      path: 'Ipcheckermodelarins',
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
