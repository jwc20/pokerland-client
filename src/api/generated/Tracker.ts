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
  StreamRegistrationRequest,
  TrackerConfigRetrieveData,
  TrackerMeRetrieveData,
  TrackerStatusRetrieveData,
  TrackerStreamsChunksUpdateData,
  TrackerStreamsChunksUpdateError,
  TrackerStreamsChunksUpdateParams,
  TrackerStreamsChunksUpdatePayload,
  TrackerStreamsUpdateData,
  TrackerStreamsUpdateParams,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Tracker<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Tunables the trackers fetch at startup and every few hours.
   *
   * @tags tracker
   * @name TrackerConfigRetrieve
   * @request GET:/api/tracker/config/
   * @secure
   */
  trackerConfigRetrieve = (params: RequestParams = {}) =>
    this.request<TrackerConfigRetrieveData, any>({
      path: `/api/tracker/config/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Checks the client token and names its user.
   *
   * @tags tracker
   * @name TrackerMeRetrieve
   * @request GET:/api/tracker/me/
   * @secure
   */
  trackerMeRetrieve = (params: RequestParams = {}) =>
    this.request<TrackerMeRetrieveData, any>({
      path: `/api/tracker/me/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description What the signed-in user's trackers have uploaded, for the web app (JWT auth).
   *
   * @tags tracker
   * @name TrackerStatusRetrieve
   * @request GET:/api/tracker/status/
   * @secure
   */
  trackerStatusRetrieve = (params: RequestParams = {}) =>
    this.request<TrackerStatusRetrieveData, any>({
      path: `/api/tracker/status/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Registers a hand-history file, or tells a tracker where it left off.
   *
   * @tags tracker
   * @name TrackerStreamsUpdate
   * @request PUT:/api/tracker/streams/{stream_id}/
   * @secure
   */
  trackerStreamsUpdate = (
    { streamId }: TrackerStreamsUpdateParams,
    data: StreamRegistrationRequest,
    params: RequestParams = {},
  ) =>
    this.request<TrackerStreamsUpdateData, any>({
      path: `/api/tracker/streams/${streamId}/`,
      method: "PUT",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Stores bytes [start, end) of a stream and queues them for parsing.
   *
   * @tags tracker
   * @name TrackerStreamsChunksUpdate
   * @request PUT:/api/tracker/streams/{stream_id}/chunks/{start}/
   * @secure
   */
  trackerStreamsChunksUpdate = (
    { start, streamId }: TrackerStreamsChunksUpdateParams,
    data: TrackerStreamsChunksUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.request<
      TrackerStreamsChunksUpdateData,
      TrackerStreamsChunksUpdateError
    >({
      path: `/api/tracker/streams/${streamId}/chunks/${start}/`,
      method: "PUT",
      body: data,
      secure: true,
      format: "json",
      ...params,
    });
}
