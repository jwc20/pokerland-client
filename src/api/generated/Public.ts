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
  PublicSharesRetrieveData,
  PublicSharesRetrieveParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Public<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description A shared hand, as anyone with its link sees it: no sign-in needed, at a limited rate.
   *
   * @tags public
   * @name PublicSharesRetrieve
   * @request GET:/api/public/shares/{slug}/
   * @secure
   */
  publicSharesRetrieve = (
    { slug }: PublicSharesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PublicSharesRetrieveData, any>({
      path: `/api/public/shares/${slug}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
