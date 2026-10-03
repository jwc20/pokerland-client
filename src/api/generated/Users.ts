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

import type { UsersMeClientTokenRetrieveData } from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Users<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's client token, for connecting the tracker client.
   *
   * @tags users
   * @name UsersMeClientTokenRetrieve
   * @request GET:/api/users/me/client-token/
   * @secure
   */
  usersMeClientTokenRetrieve = (params: RequestParams = {}) =>
    this.request<UsersMeClientTokenRetrieveData, any>({
      path: `/api/users/me/client-token/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
