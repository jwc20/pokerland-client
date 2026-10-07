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

import type { StatsListData, StatsListParams } from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Stats<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's statistics as the hero, over all their hands or a tag's or a stretch of days'.
   *
   * @tags stats
   * @name StatsList
   * @request GET:/api/stats/
   * @secure
   */
  statsList = (query: StatsListParams = {}, params: RequestParams = {}) =>
    this.request<StatsListData, any>({
      path: `/api/stats/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
