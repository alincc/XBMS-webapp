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
import { Pinterest } from '../../models/Pinterest';
import { SocketConnection } from '../../sockets/socket.connections';
import { Relations } from '../../models/Relations';


/**
 * Api services for the `Pinterest` model.
 */
@Injectable()
export class PinterestApi extends BaseLoopBackApi {

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
   * Fetches belongsTo relation relations.
   *
   * @param {any} id pinterest id
   *
   * @param {boolean} refresh 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Pinterest` object.)
   * </em>
   */
  public getRelations(id: any, refresh: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/:id/relations";
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
   * This usually means the response is a `Pinterest` object.)
   * </em>
   */
  public patchOrCreate(data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests";
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
   * @param {any} id pinterest id
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
   * This usually means the response is a `Pinterest` object.)
   * </em>
   */
  public patchAttributes(id: any, data: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "PATCH";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/:id";
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
   * @param {string} oauth_token 
   *
   * @param {string} oauth_verifier 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public sessioncallback(id: any = {}, oauth_token: any = {}, oauth_verifier: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/sessioncallback/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauth_token !== 'undefined' && oauth_token !== null) _urlParams.oauth_token = oauth_token;
    if (typeof oauth_verifier !== 'undefined' && oauth_verifier !== null) _urlParams.oauth_verifier = oauth_verifier;
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
   * @param {string} domain 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public sessionsconnect(id: any = {}, domain: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/sessionsconnect/:id";
    let _routeParams: any = {
      id: id
    };
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof domain !== 'undefined' && domain !== null) _urlParams.domain = domain;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @param {string} name 
   *
   * @param {string} description 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public createboards(oauthAccessToken: any = {}, name: any = {}, description: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/createboards";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof description !== 'undefined' && description !== null) _urlParams.description = description;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public getboards(oauthAccessToken: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/getboards";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @param {string} username 
   *
   * @param {string} board_name 
   *
   * @param {string} name 
   *
   * @param {string} description 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public updateboards(oauthAccessToken: any = {}, username: any = {}, board_name: any = {}, name: any = {}, description: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/updateboards";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    if (typeof username !== 'undefined' && username !== null) _urlParams.username = username;
    if (typeof board_name !== 'undefined' && board_name !== null) _urlParams.board_name = board_name;
    if (typeof name !== 'undefined' && name !== null) _urlParams.name = name;
    if (typeof description !== 'undefined' && description !== null) _urlParams.description = description;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @param {string} username 
   *
   * @param {string} board_name 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public deleteboards(oauthAccessToken: any = {}, username: any = {}, board_name: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/deleteboards";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    if (typeof username !== 'undefined' && username !== null) _urlParams.username = username;
    if (typeof board_name !== 'undefined' && board_name !== null) _urlParams.board_name = board_name;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @param {string} username 
   *
   * @param {string} board_name 
   *
   * @param {string} comment 
   *
   * @param {string} description 
   *
   * @param {string} submittedurl 
   *
   * @param {string} multipartimage 
   *
   * @param {string} submittedimageurl 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public pin(oauthAccessToken: any = {}, username: any = {}, board_name: any = {}, comment: any = {}, description: any = {}, submittedurl: any = {}, multipartimage: any = {}, submittedimageurl: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/pin";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    if (typeof username !== 'undefined' && username !== null) _urlParams.username = username;
    if (typeof board_name !== 'undefined' && board_name !== null) _urlParams.board_name = board_name;
    if (typeof comment !== 'undefined' && comment !== null) _urlParams.comment = comment;
    if (typeof description !== 'undefined' && description !== null) _urlParams.description = description;
    if (typeof submittedurl !== 'undefined' && submittedurl !== null) _urlParams.submittedurl = submittedurl;
    if (typeof multipartimage !== 'undefined' && multipartimage !== null) _urlParams.multipartimage = multipartimage;
    if (typeof submittedimageurl !== 'undefined' && submittedimageurl !== null) _urlParams.submittedimageurl = submittedimageurl;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * <em>
         * (The remote method definition does not provide any description.)
         * </em>
   *
   * @param {string} oauthAccessToken 
   *
   * @param {string} pin 
   *
   * @returns {object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `res` – `{object}` - 
   */
  public deletepin(oauthAccessToken: any = {}, pin: any = {}, customHeaders?: Function): Observable<any> {
    let _method: string = "GET";
    let _url: string = LoopBackConfig.getPath() + "/" + LoopBackConfig.getApiVersion() +
    "/pinterests/deletepin";
    let _routeParams: any = {};
    let _postBody: any = {};
    let _urlParams: any = {};
    if (typeof oauthAccessToken !== 'undefined' && oauthAccessToken !== null) _urlParams.oauthAccessToken = oauthAccessToken;
    if (typeof pin !== 'undefined' && pin !== null) _urlParams.pin = pin;
    let result = this.request(_method, _url, _routeParams, _urlParams, _postBody, null, customHeaders);
    return result;
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `Pinterest`.
   */
  public getModelName() {
    return "Pinterest";
  }
}
