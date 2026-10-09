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
  StatsDictionaryListData,
  StatsLinesRetrieveData,
  StatsLinesRetrieveParams,
  StatsListData,
  StatsListParams,
  StatsPurposesListData,
  StatsPurposesListParams,
  StatsSizingRetrieveData,
  StatsSizingRetrieveParams,
} from "./data-contracts.ts";
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
  /**
   * @description Every statistic and exactly what it counts: did ÷ could, as PokerTracker defines them [MIT 2].
   *
   * @tags stats
   * @name StatsDictionaryList
   * @request GET:/api/stats/dictionary/
   * @secure
   */
  statsDictionaryList = (params: RequestParams = {}) =>
    this.request<StatsDictionaryListData, any>({
      path: `/api/stats/dictionary/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description How the signed-in user played the flop, turn and river by their part before the flop and position, and by the board's texture; and their barrels after a called c-bet (B6).
   *
   * @tags stats
   * @name StatsLinesRetrieve
   * @request GET:/api/stats/lines/
   * @secure
   */
  statsLinesRetrieve = (
    query: StatsLinesRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<StatsLinesRetrieveData, any>({
      path: `/api/stats/lines/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description How the signed-in user's bets and raises went, by the purpose they gave them and by street.
   *
   * @tags stats
   * @name StatsPurposesList
   * @request GET:/api/stats/purposes/
   * @secure
   */
  statsPurposesList = (
    query: StatsPurposesListParams = {},
    params: RequestParams = {},
  ) =>
    this.request<StatsPurposesListData, any>({
      path: `/api/stats/purposes/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's bets and raises after the flop by street and size, split by how strong their hand was: what their sizes give away (B4).
   *
   * @tags stats
   * @name StatsSizingRetrieve
   * @request GET:/api/stats/sizing/
   * @secure
   */
  statsSizingRetrieve = (
    query: StatsSizingRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<StatsSizingRetrieveData, any>({
      path: `/api/stats/sizing/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
