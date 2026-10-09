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
  HandNoteWriteRequest,
  HandsBoardListData,
  HandsBoardListParams,
  HandsDaysRetrieveData,
  HandsDaysRetrieveParams,
  HandsListData,
  HandsListParams,
  HandsNotesCreateData,
  HandsNotesCreateParams,
  HandsNotesDestroyData,
  HandsNotesDestroyParams,
  HandsNotesListData,
  HandsNotesListParams,
  HandsOutsListData,
  HandsOutsListParams,
  HandsRetrieveData,
  HandsRetrieveParams,
  HandsTagsListData,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Hands<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The signed-in user's hands, most recent first, or narrowed by tags, days, decisions or results, or sorted.
   *
   * @tags hands
   * @name HandsList
   * @request GET:/api/hands/
   * @secure
   */
  handsList = (query: HandsListParams = {}, params: RequestParams = {}) =>
    this.request<HandsListData, any>({
      path: `/api/hands/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's hands, with what its replay needs, its tournament and its opponents' profiles.
   *
   * @tags hands
   * @name HandsRetrieve
   * @request GET:/api/hands/{id}/
   * @secure
   */
  handsRetrieve = ({ id }: HandsRetrieveParams, params: RequestParams = {}) =>
    this.request<HandsRetrieveData, any>({
      path: `/api/hands/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The board read on each street (A3): what it allows, the nuts, and the hero's hand among every holding left. Worked out the first time it is asked for, then kept with the hand's facts.
   *
   * @tags hands
   * @name HandsBoardList
   * @request GET:/api/hands/{id}/board/
   * @secure
   */
  handsBoardList = ({ id }: HandsBoardListParams, params: RequestParams = {}) =>
    this.request<HandsBoardListData, any>({
      path: `/api/hands/${id}/board/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description What the signed-in user wrote on one of their hands, and adding to it or changing it.
   *
   * @tags hands
   * @name HandsNotesList
   * @request GET:/api/hands/{id}/notes/
   * @secure
   */
  handsNotesList = ({ id }: HandsNotesListParams, params: RequestParams = {}) =>
    this.request<HandsNotesListData, any>({
      path: `/api/hands/${id}/notes/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Adds a note, or changes the one it takes the place of: 201 when added, 200 when changed.
   *
   * @tags hands
   * @name HandsNotesCreate
   * @request POST:/api/hands/{id}/notes/
   * @secure
   */
  handsNotesCreate = (
    { id }: HandsNotesCreateParams,
    data: HandNoteWriteRequest,
    params: RequestParams = {},
  ) =>
    this.request<HandsNotesCreateData, any>({
      path: `/api/hands/${id}/notes/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Removes a note from one of the signed-in user's hands: a note, a tag, the review state or a purpose.
   *
   * @tags hands
   * @name HandsNotesDestroy
   * @request DELETE:/api/hands/{id}/notes/{note_id}/
   * @secure
   */
  handsNotesDestroy = (
    { id, noteId }: HandsNotesDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<HandsNotesDestroyData, any>({
      path: `/api/hands/${id}/notes/${noteId}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description The hero's outs at each of their decisions on the flop and turn, against the hands shown (A2).
   *
   * @tags hands
   * @name HandsOutsList
   * @request GET:/api/hands/{id}/outs/
   * @secure
   */
  handsOutsList = ({ id }: HandsOutsListParams, params: RequestParams = {}) =>
    this.request<HandsOutsListData, any>({
      path: `/api/hands/${id}/outs/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The days the signed-in user played hands on, in their time zone, with each day's result.
   *
   * @tags hands
   * @name HandsDaysRetrieve
   * @request GET:/api/hands/days/
   * @secure
   */
  handsDaysRetrieve = (
    query: HandsDaysRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<HandsDaysRetrieveData, any>({
      path: `/api/hands/days/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's hands counted by position, game, cash-game stakes and format, with how they went.
   *
   * @tags hands
   * @name HandsTagsList
   * @request GET:/api/hands/tags/
   * @secure
   */
  handsTagsList = (params: RequestParams = {}) =>
    this.request<HandsTagsListData, any>({
      path: `/api/hands/tags/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
