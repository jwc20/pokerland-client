/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  PatchedSavedSpotRequest,
  SavedSpotRequest,
  SpotCountRequestRequest,
  SpotImportRequest,
  SpotsCountCreateData,
  SpotsCreateData,
  SpotsDestroyData,
  SpotsDestroyParams,
  SpotsFieldsListData,
  SpotsImportCreateData,
  SpotsListData,
  SpotsPartialUpdateData,
  SpotsPartialUpdateParams,
  SpotsRetrieveData,
  SpotsRetrieveParams,
  SpotsShareCreateData,
  SpotsShareCreateParams,
  SpotsSharedRetrieveData,
  SpotsSharedRetrieveParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Spots<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's saved spots, and saving a new one.
   *
   * @tags spots
   * @name SpotsList
   * @request GET:/api/spots/
   * @secure
   */
  spotsList = (params: RequestParams = {}) =>
    this.request<SpotsListData, any>({
      path: `/api/spots/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's saved spots, and saving a new one.
   *
   * @tags spots
   * @name SpotsCreate
   * @request POST:/api/spots/
   * @secure
   */
  spotsCreate = (data: SavedSpotRequest, params: RequestParams = {}) =>
    this.request<SpotsCreateData, any>({
      path: `/api/spots/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's spots: renaming it, changing its conditions, or deleting it.
   *
   * @tags spots
   * @name SpotsRetrieve
   * @request GET:/api/spots/{id}/
   * @secure
   */
  spotsRetrieve = ({ id }: SpotsRetrieveParams, params: RequestParams = {}) =>
    this.request<SpotsRetrieveData, any>({
      path: `/api/spots/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's spots: renaming it, changing its conditions, or deleting it.
   *
   * @tags spots
   * @name SpotsPartialUpdate
   * @request PATCH:/api/spots/{id}/
   * @secure
   */
  spotsPartialUpdate = (
    { id }: SpotsPartialUpdateParams,
    data: PatchedSavedSpotRequest,
    params: RequestParams = {},
  ) =>
    this.request<SpotsPartialUpdateData, any>({
      path: `/api/spots/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's spots: renaming it, changing its conditions, or deleting it.
   *
   * @tags spots
   * @name SpotsDestroy
   * @request DELETE:/api/spots/{id}/
   * @secure
   */
  spotsDestroy = ({ id }: SpotsDestroyParams, params: RequestParams = {}) =>
    this.request<SpotsDestroyData, any>({
      path: `/api/spots/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Gives one of the signed-in user's spots a share code, if it has none, so others can import a copy.
   *
   * @tags spots
   * @name SpotsShareCreate
   * @request POST:/api/spots/{id}/share/
   * @secure
   */
  spotsShareCreate = (
    { id }: SpotsShareCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<SpotsShareCreateData, any>({
      path: `/api/spots/${id}/share/`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description How many of the signed-in user's hands a spec matches, for the spot builder's live count.
   *
   * @tags spots
   * @name SpotsCountCreate
   * @request POST:/api/spots/count/
   * @secure
   */
  spotsCountCreate = (
    data: SpotCountRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<SpotsCountCreateData, any>({
      path: `/api/spots/count/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The conditions a spot can hold, with the parameters each takes and their choices.
   *
   * @tags spots
   * @name SpotsFieldsList
   * @request GET:/api/spots/fields/
   * @secure
   */
  spotsFieldsList = (params: RequestParams = {}) =>
    this.request<SpotsFieldsListData, any>({
      path: `/api/spots/fields/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Saves a copy of a shared spot among the signed-in user's own.
   *
   * @tags spots
   * @name SpotsImportCreate
   * @request POST:/api/spots/import/
   * @secure
   */
  spotsImportCreate = (data: SpotImportRequest, params: RequestParams = {}) =>
    this.request<SpotsImportCreateData, any>({
      path: `/api/spots/import/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description A spot someone shared, by its code: its name and conditions, without any that name a player.
   *
   * @tags spots
   * @name SpotsSharedRetrieve
   * @request GET:/api/spots/shared/{code}/
   * @secure
   */
  spotsSharedRetrieve = (
    { code }: SpotsSharedRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<SpotsSharedRetrieveData, any>({
      path: `/api/spots/shared/${code}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
