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
  ErrorLog,
  GameLog,
  LogAddGameData,
  LogGameHistoryData,
  LogGameHistoryParams,
  LogLogErrorsData,
  LogMyGameHistoryData,
  LogMyGameHistoryParams,
} from "./data-contracts";
import type { RequestParams } from "./http-client";
import { ContentType, HttpClient } from "./http-client";

export class Log<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description ### Authentication and Authorization 1. api-key --- Accepts a gzip-compressed JSON body sent by the desktop poker client.
   *
   * @tags Poker Logs
   * @name LogAddGame
   * @summary Submit a completed poker hand
   * @request POST:/log/add-game
   * @secure
   * @response `201` `LogAddGameData`
   */
  logAddGame = (data: GameLog, params: RequestParams = {}) =>
    this.request<LogAddGameData, any>({
      path: `/log/add-game`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (staff or superuser required) --- Returns completed poker hand logs across all users.
   *
   * @tags Poker Logs
   * @name LogGameHistory
   * @summary Get all users' game history logs
   * @request GET:/log/game-history
   * @secure
   * @response `200` `LogGameHistoryData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  logGameHistory = (query: LogGameHistoryParams, params: RequestParams = {}) =>
    this.request<LogGameHistoryData, void>({
      path: `/log/game-history`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- Accepts a gzip-compressed JSON body sent by the desktop poker client.
   *
   * @tags Poker Logs
   * @name LogLogErrors
   * @summary Submit an error or debug report
   * @request POST:/log/log-errors
   * @secure
   * @response `201` `LogLogErrorsData`
   */
  logLogErrors = (data: ErrorLog, params: RequestParams = {}) =>
    this.request<LogLogErrorsData, any>({
      path: `/log/log-errors`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) --- Returns the authenticated user's completed poker hand logs.
   *
   * @tags Poker Logs
   * @name LogMyGameHistory
   * @summary Get my game history logs
   * @request GET:/log/my-game-history
   * @secure
   * @response `200` `LogMyGameHistoryData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  logMyGameHistory = (
    query: LogMyGameHistoryParams,
    params: RequestParams = {},
  ) =>
    this.request<LogMyGameHistoryData, void>({
      path: `/log/my-game-history`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
