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

import type { ReviewRetrieveData } from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Review<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's review queue: the hands they flagged to look at again, and their tags.
   *
   * @tags review
   * @name ReviewRetrieve
   * @request GET:/api/review/
   * @secure
   */
  reviewRetrieve = (params: RequestParams = {}) =>
    this.request<ReviewRetrieveData, any>({
      path: `/api/review/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
