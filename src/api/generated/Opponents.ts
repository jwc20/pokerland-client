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
  OpponentsLedgerRetrieveData,
  OpponentsLedgerRetrieveParams,
  OpponentsListData,
  OpponentsListParams,
  OpponentsPartialUpdateData,
  OpponentsPartialUpdateParams,
  OpponentsRetrieveData,
  OpponentsRetrieveParams,
  OpponentsShowdownsListData,
  OpponentsShowdownsListParams,
  PatchedOpponentUpdateRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Opponents<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The players the signed-in user has played with, by most hands together, net against them, or last seen.
   *
   * @tags opponents
   * @name OpponentsList
   * @request GET:/api/opponents/
   * @secure
   */
  opponentsList = (
    query: OpponentsListParams = {},
    params: RequestParams = {},
  ) =>
    this.request<OpponentsListData, any>({
      path: `/api/opponents/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description An opponent's profile (C1): every statistic with its sample, their label and how sure it is, and their play by position; and the user's own label and note on them.
   *
   * @tags opponents
   * @name OpponentsRetrieve
   * @request GET:/api/opponents/{id}/
   * @secure
   */
  opponentsRetrieve = (
    { id }: OpponentsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<OpponentsRetrieveData, any>({
      path: `/api/opponents/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description An opponent's profile (C1): every statistic with its sample, their label and how sure it is, and their play by position; and the user's own label and note on them.
   *
   * @tags opponents
   * @name OpponentsPartialUpdate
   * @request PATCH:/api/opponents/{id}/
   * @secure
   */
  opponentsPartialUpdate = (
    { id }: OpponentsPartialUpdateParams,
    data: PatchedOpponentUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<OpponentsPartialUpdateData, any>({
      path: `/api/opponents/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user against an opponent (C2): their net in the hands both played, by pot size.
   *
   * @tags opponents
   * @name OpponentsLedgerRetrieve
   * @request GET:/api/opponents/{id}/ledger/
   * @secure
   */
  opponentsLedgerRetrieve = (
    { id }: OpponentsLedgerRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<OpponentsLedgerRetrieveData, any>({
      path: `/api/opponents/${id}/ledger/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The hands in which an opponent's cards were shown, the most surprising first [JHU 4].
   *
   * @tags opponents
   * @name OpponentsShowdownsList
   * @request GET:/api/opponents/{id}/showdowns/
   * @secure
   */
  opponentsShowdownsList = (
    { id }: OpponentsShowdownsListParams,
    params: RequestParams = {},
  ) =>
    this.request<OpponentsShowdownsListData, any>({
      path: `/api/opponents/${id}/showdowns/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
