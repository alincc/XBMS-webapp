/* tslint:disable */
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SDKModels } from './SDKModels';
import { BaseLoopBackApi } from '../core/base.service';
import { LoopBackConfig } from '../../lb.config';
import { LoopBackAuth } from '../core/auth.service';
import { LoopBackFilter,  } from '../../models/BaseModels';
import { ErrorHandler } from '../core/error.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Filesdlcr } from '../../models/Filesdlcr';
import { SocketConnection } from '../../sockets/socket.connections';


/**
 * Api services for the `Filesdlcr` model.
 */
@Injectable()
export class FilesdlcrApi extends BaseLoopBackApi {

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    @Inject(SocketConnection) protected connection: SocketConnection,
    @Inject(SDKModels) protected models: SDKModels,
    @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    super(http,  connection,  models, auth, errorHandler);
  }

  /**
   * Fetches belongsTo relation publications.
   *
   * @param {any} id filesdlcr id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public getPublications(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/:id/publications";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation relations.
   *
   * @param {any} id filesdlcr id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public getRelations(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/:id/relations";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Fetches belongsTo relation files.
   *
   * @param {any} id filesdlcr id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public getFiles(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/:id/files";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof refresh !== 'undefined' && refresh !== null) _urlParams.refresh = refresh;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch an existing model instance or insert a new one into the data source.
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - Model instance data
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs";
    let _routeParams: any = {};
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * Patch attributes for a model instance and persist it into the data source.
   *
   * @param {any} id filesdlcr id
   *
   * @param {object} data Request data.
   *
   *  - `data` – `{object}` - An object of model property name/value pairs
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {
      data: data
    };
    let _urlParams: any = {};
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} id 
   *
   * @param {string} companyid 
   *
   * @param {string} name 
   *
   * @param {string} canvas 
   *
   * @param {string} images 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public createimage(id: any = {}, companyid: any = {}, name: any = {}, canvas: any = {}, images: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/createimage/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof companyid !== 'undefined' && companyid !== null) _urlParams.companyid = companyid;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof canvas !== 'undefined' && canvas !== null) _urlParams.canvas = canvas;
    if (typeof images !== 'undefined' && images !== null) _urlParams.images = images;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} id 
   *
   * @param {string} companyid 
   *
   * @param {string} name 
   *
   * @param {string} canvas 
   *
   * @param {string} images 
   *
   * @param {number} duration 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public createvideo(id: any = {}, companyid: any = {}, name: any = {}, canvas: any = {}, images: any = {}, duration: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/createvideo/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof companyid !== 'undefined' && companyid !== null) _urlParams.companyid = companyid;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof canvas !== 'undefined' && canvas !== null) _urlParams.canvas = canvas;
    if (typeof images !== 'undefined' && images !== null) _urlParams.images = images;
    if (typeof duration !== 'undefined' && duration !== null) _urlParams.duration = duration;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} id 
   *
   * @param {string} companyid 
   *
   * @param {string} name 
   *
   * @param {string} canvas 
   *
   * @param {string} images 
   *
   * @param {number} duration 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public creategif(id: any = {}, companyid: any = {}, name: any = {}, canvas: any = {}, images: any = {}, duration: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/creategif/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof companyid !== 'undefined' && companyid !== null) _urlParams.companyid = companyid;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof canvas !== 'undefined' && canvas !== null) _urlParams.canvas = canvas;
    if (typeof images !== 'undefined' && images !== null) _urlParams.images = images;
    if (typeof duration !== 'undefined' && duration !== null) _urlParams.duration = duration;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} id 
   *
   * @param {string} imageurl 
   *
   * @param {string} name 
   *
   * @param {boolean} centerline 
   *
   * @param {object} data Request data.
   *
   * This method does not accept any data. Supply an empty object.
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Filesdlcr` object.)
   * </em>
   */
  public converteps2svg(id: any = {}, imageurl: any = {}, name: any = {}, centerline: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "POST";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/filesdlcrs/converteps2svg/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof imageurl !== 'undefined' && imageurl !== null) _urlParams.imageurl = imageurl;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof centerline !== 'undefined' && centerline !== null) _urlParams.centerline = centerline;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Filesdlcr`.
   */
  public getModelName() {
    return "Filesdlcr";
  }
}
