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
  PatchedSavedRangeRequest,
  RangesCreateData,
  RangesDestroyData,
  RangesDestroyParams,
  RangesListData,
  RangesPartialUpdateData,
  RangesPartialUpdateParams,
  RangesRetrieveData,
  RangesRetrieveParams,
  SavedRangeRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Ranges<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's saved starting-hand ranges, and saving a new one.
   *
   * @tags ranges
   * @name RangesList
   * @request GET:/api/ranges/
   * @secure
   */
  rangesList = (params: RequestParams = {}) =>
    this.request<RangesListData, any>({
      path: `/api/ranges/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's saved starting-hand ranges, and saving a new one.
   *
   * @tags ranges
   * @name RangesCreate
   * @request POST:/api/ranges/
   * @secure
   */
  rangesCreate = (data: SavedRangeRequest, params: RequestParams = {}) =>
    this.request<RangesCreateData, any>({
      path: `/api/ranges/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's saved ranges.
   *
   * @tags ranges
   * @name RangesRetrieve
   * @request GET:/api/ranges/{id}/
   * @secure
   */
  rangesRetrieve = ({ id }: RangesRetrieveParams, params: RequestParams = {}) =>
    this.request<RangesRetrieveData, any>({
      path: `/api/ranges/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's saved ranges.
   *
   * @tags ranges
   * @name RangesPartialUpdate
   * @request PATCH:/api/ranges/{id}/
   * @secure
   */
  rangesPartialUpdate = (
    { id }: RangesPartialUpdateParams,
    data: PatchedSavedRangeRequest,
    params: RequestParams = {},
  ) =>
    this.request<RangesPartialUpdateData, any>({
      path: `/api/ranges/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's saved ranges.
   *
   * @tags ranges
   * @name RangesDestroy
   * @request DELETE:/api/ranges/{id}/
   * @secure
   */
  rangesDestroy = ({ id }: RangesDestroyParams, params: RequestParams = {}) =>
    this.request<RangesDestroyData, any>({
      path: `/api/ranges/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
