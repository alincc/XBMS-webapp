/* tslint:disable */

declare var Object: any;
export interface MailverifierInterface {
  "campaignname"?: string;
  "id"?: number;
}

export class Mailverifier implements MailverifierInterface {
  "campaignname": string;
  "id": number;
  constructor(data?: MailverifierInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Mailverifier`.
   */
  public static getModelName() {
    return "Mailverifier";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Mailverifier for dynamic purposes.
  **/
  public static factory(data: MailverifierInterface): Mailverifier{
    return new Mailverifier(data);
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
      name: 'Mailverifier',
      plural: 'Mailverifiers',
      path: 'Mailverifiers',
      idName: 'id',
      properties: {
        "campaignname": {
          name: 'campaignname',
          type: 'string'
        },
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
