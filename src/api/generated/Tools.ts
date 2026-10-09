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
  EquityRequestRequest,
  ToolsEquityCreateData,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Tools<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description A hold'em hand's equity against another hand, a range or a kind of hand on the board: exact when the run-outs are few enough to count, sampled otherwise (FND-2). Answers are kept for a day by their question.
   *
   * @tags tools
   * @name ToolsEquityCreate
   * @request POST:/api/tools/equity/
   * @secure
   */
  toolsEquityCreate = (
    data: EquityRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<ToolsEquityCreateData, any>({
      path: `/api/tools/equity/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
}
