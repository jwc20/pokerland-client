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
  SessionsListData,
  SessionsListParams,
  SessionsPatternsRetrieveData,
  SessionsPatternsRetrieveParams,
  SessionsRetrieveData,
  SessionsRetrieveParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Sessions<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's sessions, the latest first: stretches of play with no gap of over half an hour (F1).
   *
   * @tags sessions
   * @name SessionsList
   * @request GET:/api/sessions/
   * @secure
   */
  sessionsList = (query: SessionsListParams = {}, params: RequestParams = {}) =>
    this.request<SessionsListData, any>({
      path: `/api/sessions/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's sessions.
   *
   * @tags sessions
   * @name SessionsRetrieve
   * @request GET:/api/sessions/{id}/
   * @secure
   */
  sessionsRetrieve = (
    { id }: SessionsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<SessionsRetrieveData, any>({
      path: `/api/sessions/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's results by hour into the session, time of day, day of the week and tables at once.
   *
   * @tags sessions
   * @name SessionsPatternsRetrieve
   * @request GET:/api/sessions/patterns/
   * @secure
   */
  sessionsPatternsRetrieve = (
    query: SessionsPatternsRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<SessionsPatternsRetrieveData, any>({
      path: `/api/sessions/patterns/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
