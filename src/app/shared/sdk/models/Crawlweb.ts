/* tslint:disable */

declare var Object: any;
export interface CrawlwebInterface {
  "name"?: string;
  "id"?: number;
}

export class Crawlweb implements CrawlwebInterface {
  "name": string;
  "id": number;
  constructor(data?: CrawlwebInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Crawlweb`.
   */
  public static getModelName() {
    return "Crawlweb";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Crawlweb for dynamic purposes.
  **/
  public static factory(data: CrawlwebInterface): Crawlweb{
    return new Crawlweb(data);
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
      name: 'Crawlweb',
      plural: 'crawlweb',
      path: 'crawlweb',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
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
