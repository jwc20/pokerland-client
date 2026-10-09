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
  AssignmentRequestRequest,
  JoinRequest,
  LeagueCreateRequest,
  LeaguesAssignmentsCreateData,
  LeaguesAssignmentsCreateParams,
  LeaguesAssignmentsDestroyData,
  LeaguesAssignmentsDestroyParams,
  LeaguesCreateData,
  LeaguesJoinCreateData,
  LeaguesListData,
  LeaguesMeDestroyData,
  LeaguesMeDestroyParams,
  LeaguesMePartialUpdateData,
  LeaguesMePartialUpdateParams,
  LeaguesMembersDestroyData,
  LeaguesMembersDestroyParams,
  LeaguesMembersPartialUpdateData,
  LeaguesMembersPartialUpdateParams,
  LeaguesPartialUpdateData,
  LeaguesPartialUpdateParams,
  LeaguesProgressListData,
  LeaguesProgressListParams,
  LeaguesProgressRetrieveData,
  LeaguesProgressRetrieveParams,
  LeaguesRetrieveData,
  LeaguesRetrieveParams,
  PatchedLeagueUpdateRequest,
  PatchedMembershipUpdateRequest,
  PatchedRoleRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Leagues<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description The classes the signed-in user is in; and a new one, which they own and coach.
   *
   * @tags leagues
   * @name LeaguesList
   * @request GET:/api/leagues/
   * @secure
   */
  leaguesList = (params: RequestParams = {}) =>
    this.request<LeaguesListData, any>({
      path: `/api/leagues/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description The classes the signed-in user is in; and a new one, which they own and coach.
   *
   * @tags leagues
   * @name LeaguesCreate
   * @request POST:/api/leagues/
   * @secure
   */
  leaguesCreate = (data: LeagueCreateRequest, params: RequestParams = {}) =>
    this.request<LeaguesCreateData, any>({
      path: `/api/leagues/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description A class: its playbooks and hands, and who's in it. A coach can rename it or give it a new invite code.
   *
   * @tags leagues
   * @name LeaguesRetrieve
   * @request GET:/api/leagues/{id}/
   * @secure
   */
  leaguesRetrieve = (
    { id }: LeaguesRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesRetrieveData, any>({
      path: `/api/leagues/${id}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description A class: its playbooks and hands, and who's in it. A coach can rename it or give it a new invite code.
   *
   * @tags leagues
   * @name LeaguesPartialUpdate
   * @request PATCH:/api/leagues/{id}/
   * @secure
   */
  leaguesPartialUpdate = (
    { id }: LeaguesPartialUpdateParams,
    data: PatchedLeagueUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesPartialUpdateData, any>({
      path: `/api/leagues/${id}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Puts something before a class: a coach assigns one of their playbooks; anyone shares one of their hands.
   *
   * @tags leagues
   * @name LeaguesAssignmentsCreate
   * @request POST:/api/leagues/{id}/assignments/
   * @secure
   */
  leaguesAssignmentsCreate = (
    { id }: LeaguesAssignmentsCreateParams,
    data: AssignmentRequestRequest,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesAssignmentsCreateData, any>({
      path: `/api/leagues/${id}/assignments/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Withdraws something from a class: by whoever put it there, or a coach. A withdrawn hand leaves future sets.
   *
   * @tags leagues
   * @name LeaguesAssignmentsDestroy
   * @request DELETE:/api/leagues/{id}/assignments/{assignment_pk}/
   * @secure
   */
  leaguesAssignmentsDestroy = (
    { assignmentPk, id }: LeaguesAssignmentsDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesAssignmentsDestroyData, any>({
      path: `/api/leagues/${id}/assignments/${assignmentPk}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description The signed-in user in a class: whether they show the coaches their progress; or leaving it.
   *
   * @tags leagues
   * @name LeaguesMePartialUpdate
   * @request PATCH:/api/leagues/{id}/me/
   * @secure
   */
  leaguesMePartialUpdate = (
    { id }: LeaguesMePartialUpdateParams,
    data: PatchedMembershipUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesMePartialUpdateData, any>({
      path: `/api/leagues/${id}/me/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description The signed-in user in a class: whether they show the coaches their progress; or leaving it.
   *
   * @tags leagues
   * @name LeaguesMeDestroy
   * @request DELETE:/api/leagues/{id}/me/
   * @secure
   */
  leaguesMeDestroy = (
    { id }: LeaguesMeDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesMeDestroyData, any>({
      path: `/api/leagues/${id}/me/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description A coach makes someone in their class a coach or a member, or takes them out of it.
   *
   * @tags leagues
   * @name LeaguesMembersPartialUpdate
   * @request PATCH:/api/leagues/{id}/members/{member_pk}/
   * @secure
   */
  leaguesMembersPartialUpdate = (
    { id, memberPk }: LeaguesMembersPartialUpdateParams,
    data: PatchedRoleRequest,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesMembersPartialUpdateData, any>({
      path: `/api/leagues/${id}/members/${memberPk}/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description A coach makes someone in their class a coach or a member, or takes them out of it.
   *
   * @tags leagues
   * @name LeaguesMembersDestroy
   * @request DELETE:/api/leagues/{id}/members/{member_pk}/
   * @secure
   */
  leaguesMembersDestroy = (
    { id, memberPk }: LeaguesMembersDestroyParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesMembersDestroyData, any>({
      path: `/api/leagues/${id}/members/${memberPk}/`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description For a class's coaches: each member who shares their progress, with their practice accuracy and their stage in each assigned playbook's rule families. Totals only, never their hands.
   *
   * @tags leagues
   * @name LeaguesProgressList
   * @request GET:/api/leagues/{id}/progress/
   * @secure
   */
  leaguesProgressList = (
    { id }: LeaguesProgressListParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesProgressListData, any>({
      path: `/api/leagues/${id}/progress/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description For a class's coaches: one sharing member's progress, with how their own hands kept each assigned playbook's rules (by the book), which reads up to a thousand of their hands.
   *
   * @tags leagues
   * @name LeaguesProgressRetrieve
   * @request GET:/api/leagues/{id}/progress/{member_pk}/
   * @secure
   */
  leaguesProgressRetrieve = (
    { id, memberPk }: LeaguesProgressRetrieveParams,
    params: RequestParams = {},
  ) =>
    this.request<LeaguesProgressRetrieveData, any>({
      path: `/api/leagues/${id}/progress/${memberPk}/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Joins a class by its invite code, as a member. Joining one you're in already changes nothing.
   *
   * @tags leagues
   * @name LeaguesJoinCreate
   * @request POST:/api/leagues/join/
   * @secure
   */
  leaguesJoinCreate = (data: JoinRequest, params: RequestParams = {}) =>
    this.request<LeaguesJoinCreateData, any>({
      path: `/api/leagues/join/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
}
