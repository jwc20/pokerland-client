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

import {
  ErrorLog,
  GameLog,
  GetAllGameLogsData,
  GetAllGameLogsParams,
  GetMyGameLogsData,
  GetMyGameLogsParams,
  GetUserGameLogsData,
  GetUserGameLogsParams,
  LogAddGameData,
  LogLogErrorsData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

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
   * @description ### Authentication and Authorization 1. TOKEN header (required) --- Returns paginated game logs from all users. Requires authentication.
   *
   * @tags Poker Logs
   * @name GetAllGameLogs
   * @summary Get game logs from all users
   * @request GET:/log/all-game-logs
   * @secure
   * @response `200` `GetAllGameLogsData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  getAllGameLogs = (query: GetAllGameLogsParams, params: RequestParams = {}) =>
    this.request<GetAllGameLogsData, void>({
      path: `/log/all-game-logs`,
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
   * @description ### Authentication and Authorization 1. TOKEN header (required) --- Returns paginated game logs for the authenticated user based on their token.
   *
   * @tags Poker Logs
   * @name GetMyGameLogs
   * @summary Get your own game logs
   * @request GET:/log/my-game-logs
   * @secure
   * @response `200` `GetMyGameLogsData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  getMyGameLogs = (query: GetMyGameLogsParams, params: RequestParams = {}) =>
    this.request<GetMyGameLogsData, void>({
      path: `/log/my-game-logs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. TOKEN header (required) --- Returns paginated game logs for the specified user.
   *
   * @tags Poker Logs
   * @name GetUserGameLogs
   * @summary Get game logs for a specific user by username
   * @request GET:/log/user/{username}/game-logs
   * @secure
   * @response `200` `GetUserGameLogsData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  getUserGameLogs = (
    { username, ...query }: GetUserGameLogsParams,
    params: RequestParams = {},
  ) =>
    this.request<GetUserGameLogsData, void>({
      path: `/log/user/${username}/game-logs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
