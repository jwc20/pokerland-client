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
  HandShareRequest,
  PatchedHandShareRequest,
  SharesCreateData,
  SharesDestroyData,
  SharesDestroyParams,
  SharesListData,
  SharesPartialUpdateData,
  SharesPartialUpdateParams,
  SharesRetrieveData,
  SharesRetrieveParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Shares<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's shared hands, and sharing one: a public, read-only link to its replay and write-up.
   *
   * @tags shares
   * @name SharesList
   * @request GET:/api/shares/
   * @secure
   */
  sharesList = (params: RequestParams = {}) =>
    this.request<SharesListData, any>({
      path: `/api/shares/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's shared hands, and sharing one: a public, read-only link to its replay and write-up.
   *
   * @tags shares
   * @name SharesCreate
   * @request POST:/api/shares/
   * @secure
   */
  sharesCreate = (data: HandShareRequest, params: RequestParams = {}) =>
    this.request<SharesCreateData, any>({
      path: `/api/shares/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's shares: its write-up, whether it is anonymized, revoking it, or deleting it.
   *
   * @tags shares
   * @name SharesRetrieve
   * @request GET:/api/shares/{id}/
   * @secure
   */
  sharesRetrieve = ({ id }: SharesRetrieveParams, params: RequestParams = {}) =>
    this.request<SharesRetrieveData, any>({
      path: `/api/shares/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's shares: its write-up, whether it is anonymized, revoking it, or deleting it.
   *
   * @tags shares
   * @name SharesPartialUpdate
   * @request PATCH:/api/shares/{id}/
   * @secure
   */
  sharesPartialUpdate = (
    { id }: SharesPartialUpdateParams,
    data: PatchedHandShareRequest,
    params: RequestParams = {},
  ) =>
    this.request<SharesPartialUpdateData, any>({
      path: `/api/shares/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's shares: its write-up, whether it is anonymized, revoking it, or deleting it.
   *
   * @tags shares
   * @name SharesDestroy
   * @request DELETE:/api/shares/{id}/
   * @secure
   */
  sharesDestroy = ({ id }: SharesDestroyParams, params: RequestParams = {}) =>
    this.request<SharesDestroyData, any>({
      path: `/api/shares/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
