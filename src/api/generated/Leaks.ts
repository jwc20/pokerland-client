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
  LeaksListData,
  LeaksListParams,
  LeaksPresetsListData,
  LeaksPresetsPartialUpdateData,
  PatchedPresetsUpdateRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Leaks<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The leak checks over the signed-in user's hands as the hero (B3): how often they broke each rule of thumb.
   *
   * @tags leaks
   * @name LeaksList
   * @request GET:/api/leaks/
   * @secure
   */
  leaksList = (query: LeaksListParams = {}, params: RequestParams = {}) =>
    this.request<LeaksListData, any>({
      path: `/api/leaks/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's thresholds for the leak checks: the course values unless they set their own.
   *
   * @tags leaks
   * @name LeaksPresetsList
   * @request GET:/api/leaks/presets/
   * @secure
   */
  leaksPresetsList = (params: RequestParams = {}) =>
    this.request<LeaksPresetsListData, any>({
      path: `/api/leaks/presets/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's thresholds for the leak checks: the course values unless they set their own.
   *
   * @tags leaks
   * @name LeaksPresetsPartialUpdate
   * @request PATCH:/api/leaks/presets/
   * @secure
   */
  leaksPresetsPartialUpdate = (
    data: PatchedPresetsUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<LeaksPresetsPartialUpdateData, any>({
      path: `/api/leaks/presets/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
}
