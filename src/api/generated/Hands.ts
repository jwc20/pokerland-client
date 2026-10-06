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
  HandsListData,
  HandsListParams,
  HandsRetrieveData,
  HandsRetrieveParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Hands<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's hands, most recent first.
   *
   * @tags hands
   * @name HandsList
   * @request GET:/api/hands/
   * @secure
   */
  handsList = (query: HandsListParams = {}, params: RequestParams = {}) =>
    this.request<HandsListData, any>({
      path: `/api/hands/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's hands, with what its replay needs.
   *
   * @tags hands
   * @name HandsRetrieve
   * @request GET:/api/hands/{id}/
   * @secure
   */
  handsRetrieve = ({ id }: HandsRetrieveParams, params: RequestParams = {}) =>
    this.request<HandsRetrieveData, any>({
      path: `/api/hands/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
