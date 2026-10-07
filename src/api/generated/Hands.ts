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
  HandsDaysRetrieveData,
  HandsDaysRetrieveParams,
  HandsListData,
  HandsListParams,
  HandsRetrieveData,
  HandsRetrieveParams,
  HandsTagsListData,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Hands<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's hands, most recent first, or those of a tag or a day.
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
  /**
   * @description The days the signed-in user played hands on, in their time zone, with each day's result.
   *
   * @tags hands
   * @name HandsDaysRetrieve
   * @request GET:/api/hands/days/
   * @secure
   */
  handsDaysRetrieve = (
    query: HandsDaysRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<HandsDaysRetrieveData, any>({
      path: `/api/hands/days/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's hands counted by position, game, cash-game stakes and format, with how they went.
   *
   * @tags hands
   * @name HandsTagsList
   * @request GET:/api/hands/tags/
   * @secure
   */
  handsTagsList = (params: RequestParams = {}) =>
    this.request<HandsTagsListData, any>({
      path: `/api/hands/tags/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
