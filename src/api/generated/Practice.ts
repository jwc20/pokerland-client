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
  ActRequestRequest,
  AttemptRequestRequest,
  DepartureRequestRequest,
  IntentRequestRequest,
  MatchStartRequest,
  NewSetRequest,
  NoteRequestRequest,
  PracticeAttemptsCreateData,
  PracticeHandsByTheBookRetrieveData,
  PracticeHandsByTheBookRetrieveParams,
  PracticeMatchesActCreateData,
  PracticeMatchesActCreateParams,
  PracticeMatchesAskCreateData,
  PracticeMatchesAskCreateParams,
  PracticeMatchesCreateData,
  PracticeMatchesDebriefRetrieveData,
  PracticeMatchesDebriefRetrieveParams,
  PracticeMatchesDepartureCreateData,
  PracticeMatchesDepartureCreateParams,
  PracticeMatchesIntentCreateData,
  PracticeMatchesIntentCreateParams,
  PracticeMatchesListData,
  PracticeMatchesNextCreateData,
  PracticeMatchesNextCreateParams,
  PracticeMatchesReadsCreateData,
  PracticeMatchesReadsCreateParams,
  PracticeMatchesResignCreateData,
  PracticeMatchesResignCreateParams,
  PracticeMatchesRetrieveData,
  PracticeMatchesRetrieveParams,
  PracticePlaybooksListData,
  PracticePlaybooksRetrieveData,
  PracticePlaybooksRetrieveParams,
  PracticeProfileRetrieveData,
  PracticeProfileRetrieveParams,
  PracticeReviewsCreateData,
  PracticeSetsCreateData,
  PracticeSetsRetrieveData,
  PracticeSetsRetrieveParams,
  PracticeSetsTodayRetrieveData,
  PracticeSetsTodayRetrieveParams,
  ReviewRequestRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Practice<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Answers a spot: the grade, the answer and how it was worked out. A miss comes back tomorrow.
   *
   * @tags practice
   * @name PracticeAttemptsCreate
   * @request POST:/api/practice/attempts/
   * @secure
   */
  practiceAttemptsCreate = (
    data: AttemptRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeAttemptsCreateData, any>({
      path: `/api/practice/attempts/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description By the book: how often the signed-in user's recent hands, at least a day old, kept each of a playbook's default rules; with `rule`, the decisions it applied to.
   *
   * @tags practice
   * @name PracticeHandsByTheBookRetrieve
   * @request GET:/api/practice/hands/by-the-book/
   * @secure
   */
  practiceHandsByTheBookRetrieve = (
    query: PracticeHandsByTheBookRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeHandsByTheBookRetrieveData, any>({
      path: `/api/practice/hands/by-the-book/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's coached matches, most recent first; and a new one.
   *
   * @tags practice
   * @name PracticeMatchesList
   * @request GET:/api/practice/matches/
   * @secure
   */
  practiceMatchesList = (params: RequestParams = {}) =>
    this.request<PracticeMatchesListData, any>({
      path: `/api/practice/matches/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's coached matches, most recent first; and a new one.
   *
   * @tags practice
   * @name PracticeMatchesCreate
   * @request POST:/api/practice/matches/
   * @secure
   */
  practiceMatchesCreate = (
    data: MatchStartRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesCreateData, any>({
      path: `/api/practice/matches/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The match as it stands: the hand, your moves, what the coach may say at this stage, and the read card.
   *
   * @tags practice
   * @name PracticeMatchesRetrieve
   * @request GET:/api/practice/matches/{id}/
   * @secure
   */
  practiceMatchesRetrieve = (
    { id }: PracticeMatchesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesRetrieveData, any>({
      path: `/api/practice/matches/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Your move. The bot answers, and the coach speaks as the stage allows.
   *
   * @tags practice
   * @name PracticeMatchesActCreate
   * @request POST:/api/practice/matches/{id}/act/
   * @secure
   */
  practiceMatchesActCreate = (
    { id }: PracticeMatchesActCreateParams,
    data: ActRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesActCreateData, any>({
      path: `/api/practice/matches/${id}/act/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description "Ask the coach" at stage 3 or 4: the advice now. Each use is counted.
   *
   * @tags practice
   * @name PracticeMatchesAskCreate
   * @request POST:/api/practice/matches/{id}/ask/
   * @secure
   */
  practiceMatchesAskCreate = (
    { id }: PracticeMatchesAskCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesAskCreateData, any>({
      path: `/api/practice/matches/${id}/ask/`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The debrief, with the bot revealed, once the match is over.
   *
   * @tags practice
   * @name PracticeMatchesDebriefRetrieve
   * @request GET:/api/practice/matches/{id}/debrief/
   * @secure
   */
  practiceMatchesDebriefRetrieve = (
    { id }: PracticeMatchesDebriefRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesDebriefRetrieveData, any>({
      path: `/api/practice/matches/${id}/debrief/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Why you left a rule: a read, the price, the stack depth, or it felt right. Asked once.
   *
   * @tags practice
   * @name PracticeMatchesDepartureCreate
   * @request POST:/api/practice/matches/{id}/departure/
   * @secure
   */
  practiceMatchesDepartureCreate = (
    { id }: PracticeMatchesDepartureCreateParams,
    data: DepartureRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesDepartureCreateData, any>({
      path: `/api/practice/matches/${id}/departure/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Stage 2, "call it": what you would do and why. The coach's verdict comes back before you act.
   *
   * @tags practice
   * @name PracticeMatchesIntentCreate
   * @request POST:/api/practice/matches/{id}/intent/
   * @secure
   */
  practiceMatchesIntentCreate = (
    { id }: PracticeMatchesIntentCreateParams,
    data: IntentRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesIntentCreateData, any>({
      path: `/api/practice/matches/${id}/intent/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Deals the next hand once the last is over.
   *
   * @tags practice
   * @name PracticeMatchesNextCreate
   * @request POST:/api/practice/matches/{id}/next/
   * @secure
   */
  practiceMatchesNextCreate = (
    { id }: PracticeMatchesNextCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesNextCreateData, any>({
      path: `/api/practice/matches/${id}/next/`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Adds or revises a note on the read card: what a showdown told you, a read, or a label.
   *
   * @tags practice
   * @name PracticeMatchesReadsCreate
   * @request POST:/api/practice/matches/{id}/reads/
   * @secure
   */
  practiceMatchesReadsCreate = (
    { id }: PracticeMatchesReadsCreateParams,
    data: NoteRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesReadsCreateData, any>({
      path: `/api/practice/matches/${id}/reads/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Ends the match early, as it stands, and opens the debrief.
   *
   * @tags practice
   * @name PracticeMatchesResignCreate
   * @request POST:/api/practice/matches/{id}/resign/
   * @secure
   */
  practiceMatchesResignCreate = (
    { id }: PracticeMatchesResignCreateParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeMatchesResignCreateData, any>({
      path: `/api/practice/matches/${id}/resign/`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The playbooks the signed-in user can play by: the house presets and their own.
   *
   * @tags practice
   * @name PracticePlaybooksList
   * @request GET:/api/practice/playbooks/
   * @secure
   */
  practicePlaybooksList = (params: RequestParams = {}) =>
    this.request<PracticePlaybooksListData, any>({
      path: `/api/practice/playbooks/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description A playbook's rule cards, and the signed-in user's stage in each of its rule families.
   *
   * @tags practice
   * @name PracticePlaybooksRetrieve
   * @request GET:/api/practice/playbooks/{id}/
   * @secure
   */
  practicePlaybooksRetrieve = (
    { id }: PracticePlaybooksRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticePlaybooksRetrieveData, any>({
      path: `/api/practice/playbooks/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user's practice: each skill's accuracy with its 95% range, and the days they practised.
   *
   * @tags practice
   * @name PracticeProfileRetrieve
   * @request GET:/api/practice/profile/
   * @secure
   */
  practiceProfileRetrieve = (
    query: PracticeProfileRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<PracticeProfileRetrieveData, any>({
      path: `/api/practice/profile/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description "Again later": the spot comes back tomorrow, then further away each time it is answered well.
   *
   * @tags practice
   * @name PracticeReviewsCreate
   * @request POST:/api/practice/reviews/
   * @secure
   */
  practiceReviewsCreate = (
    data: ReviewRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<PracticeReviewsCreateData, any>({
      path: `/api/practice/reviews/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description A new set of one mode: decisions from the user's own hands, or generated spots for one skill.
   *
   * @tags practice
   * @name PracticeSetsCreate
   * @request POST:/api/practice/sets/
   * @secure
   */
  practiceSetsCreate = (data: NewSetRequest, params: RequestParams = {}) =>
    this.request<PracticeSetsCreateData, any>({
      path: `/api/practice/sets/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description One of the signed-in user's sets, with the answers given so far.
   *
   * @tags practice
   * @name PracticeSetsRetrieve
   * @request GET:/api/practice/sets/{id}/
   * @secure
   */
  practiceSetsRetrieve = (
    { id }: PracticeSetsRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<PracticeSetsRetrieveData, any>({
      path: `/api/practice/sets/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Today's set for the signed-in user, made the first time it is asked for: reviews due, spots from their own hands at least a day old, and generated spots to fill it.
   *
   * @tags practice
   * @name PracticeSetsTodayRetrieve
   * @request GET:/api/practice/sets/today/
   * @secure
   */
  practiceSetsTodayRetrieve = (
    query: PracticeSetsTodayRetrieveParams = {},
    params: RequestParams = {},
  ) =>
    this.request<PracticeSetsTodayRetrieveData, any>({
      path: `/api/practice/sets/today/`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
