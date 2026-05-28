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
  LogLogErrorsData,
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
}
