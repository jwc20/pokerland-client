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
  BriefRequestRequest,
  ExplanationCreateRequest,
  ExplanationsBriefCreateData,
  ExplanationsCreateData,
  ExplanationsDestroyData,
  ExplanationsDestroyParams,
  ExplanationsListData,
  ExplanationsListParams,
  ExplanationsModelsRetrieveData,
  ExplanationsPartialUpdateData,
  ExplanationsPartialUpdateParams,
  ExplanationsSpendRetrieveData,
  ExplanationsSpendRetrieveParams,
  ExplanationsTurnsBriefRetrieveData,
  ExplanationsTurnsBriefRetrieveParams,
  ExplanationsTurnsCreateData,
  ExplanationsTurnsCreateParams,
  PatchedExplanationUpdateRequest,
  TurnCreateRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Explanations<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The explanations of one of the signed-in user's subjects, newest first; and saving a new one.
   *
   * @tags explanations
   * @name ExplanationsList
   * @request GET:/api/explanations/
   * @secure
   */
  explanationsList = (
    query: ExplanationsListParams = {},
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsListData, any>({
      path: `/api/explanations/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Saves what a model wrote about a subject, once it passes explain.checks: 400 with what failed, 409 if the subject changed while the model was writing.
   *
   * @tags explanations
   * @name ExplanationsCreate
   * @request POST:/api/explanations/
   * @secure
   */
  explanationsCreate = (
    data: ExplanationCreateRequest,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsCreateData, any>({
      path: `/api/explanations/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's explanations: rating it as useful or not, or deleting it.
   *
   * @tags explanations
   * @name ExplanationsPartialUpdate
   * @request PATCH:/api/explanations/{id}/
   * @secure
   */
  explanationsPartialUpdate = (
    { id }: ExplanationsPartialUpdateParams,
    data: PatchedExplanationUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsPartialUpdateData, any>({
      path: `/api/explanations/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's explanations: rating it as useful or not, or deleting it.
   *
   * @tags explanations
   * @name ExplanationsDestroy
   * @request DELETE:/api/explanations/{id}/
   * @secure
   */
  explanationsDestroy = (
    { id }: ExplanationsDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsDestroyData, any>({
      path: `/api/explanations/${id}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Saving a question about one of the signed-in user's explanations, and the answer a model gave it.
   *
   * @tags explanations
   * @name ExplanationsTurnsCreate
   * @request POST:/api/explanations/{id}/turns/
   * @secure
   */
  explanationsTurnsCreate = (
    { id }: ExplanationsTurnsCreateParams,
    data: TurnCreateRequest,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsTurnsCreateData, any>({
      path: `/api/explanations/${id}/turns/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The conversation so far about one of the signed-in user's explanations, for a model to answer a question.
   *
   * @tags explanations
   * @name ExplanationsTurnsBriefRetrieve
   * @request GET:/api/explanations/{id}/turns/brief/
   * @secure
   */
  explanationsTurnsBriefRetrieve = (
    { id }: ExplanationsTurnsBriefRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsTurnsBriefRetrieveData, any>({
      path: `/api/explanations/${id}/turns/brief/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description What to tell a model about one of the signed-in user's subjects, for a provider: the instructions, the subject as JSON, the schema the answer must match, and a hash to send back with it. 409 until it's time.
   *
   * @tags explanations
   * @name ExplanationsBriefCreate
   * @request POST:/api/explanations/brief/
   * @secure
   */
  explanationsBriefCreate = (
    data: BriefRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsBriefCreateData, any>({
      path: `/api/explanations/brief/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The providers and models explanations can be written with, and about what each costs (explain.catalog).
   *
   * @tags explanations
   * @name ExplanationsModelsRetrieve
   * @request GET:/api/explanations/models/
   * @secure
   */
  explanationsModelsRetrieve = (params: RequestParams = {}) =>
    this.request<ExplanationsModelsRetrieveData, any>({
      path: `/api/explanations/models/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description How many explanations and questions the signed-in user saved this month, and about what they cost.
   *
   * @tags explanations
   * @name ExplanationsSpendRetrieve
   * @request GET:/api/explanations/spend/
   * @secure
   */
  explanationsSpendRetrieve = (
    query: ExplanationsSpendRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<ExplanationsSpendRetrieveData, any>({
      path: `/api/explanations/spend/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
