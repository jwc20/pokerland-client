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
  PatchedTournamentUpdateRequest,
  TournamentsListData,
  TournamentsListParams,
  TournamentsPartialUpdateData,
  TournamentsPartialUpdateParams,
  TournamentsRetrieveData,
  TournamentsRetrieveParams,
  TournamentsSummaryListData,
  TournamentsSummaryListParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Tournaments<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's tournaments, the latest first, with what each returned (D1).
   *
   * @tags tournaments
   * @name TournamentsList
   * @request GET:/api/tournaments/
   * @secure
   */
  tournamentsList = (
    query: TournamentsListParams = {},
    params: RequestParams = {},
  ) =>
    this.request<TournamentsListData, any>({
      path: `/api/tournaments/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's tournaments with the hero's stack, hand by hand (D2); and setting what the hands can't tell: the field size, the payouts, or a finish, prize or entries.
   *
   * @tags tournaments
   * @name TournamentsRetrieve
   * @request GET:/api/tournaments/{id}/
   * @secure
   */
  tournamentsRetrieve = (
    { id }: TournamentsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<TournamentsRetrieveData, any>({
      path: `/api/tournaments/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's tournaments with the hero's stack, hand by hand (D2); and setting what the hands can't tell: the field size, the payouts, or a finish, prize or entries.
   *
   * @tags tournaments
   * @name TournamentsPartialUpdate
   * @request PATCH:/api/tournaments/{id}/
   * @secure
   */
  tournamentsPartialUpdate = (
    { id }: TournamentsPartialUpdateParams,
    data: PatchedTournamentUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<TournamentsPartialUpdateData, any>({
      path: `/api/tournaments/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's tournament totals: ROI, in the money and finishes, apart by money, then by buy-in and format; and the fees paid (D1, F6).
   *
   * @tags tournaments
   * @name TournamentsSummaryList
   * @request GET:/api/tournaments/summary/
   * @secure
   */
  tournamentsSummaryList = (
    query: TournamentsSummaryListParams = {},
    params: RequestParams = {},
  ) =>
    this.request<TournamentsSummaryListData, any>({
      path: `/api/tournaments/summary/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
