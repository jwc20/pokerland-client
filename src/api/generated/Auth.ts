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
  AuthLoginCreateData,
  AuthLogoutCreateData,
  AuthPasswordChangeCreateData,
  AuthPasswordResetConfirmCreateData,
  AuthPasswordResetCreateData,
  AuthRegistrationCreateData,
  AuthRegistrationResendEmailCreateData,
  AuthRegistrationVerifyEmailCreateData,
  AuthTokenRefreshCreateData,
  AuthTokenVerifyCreateData,
  AuthUserPartialUpdateData,
  AuthUserRetrieveData,
  AuthUserUpdateData,
  LoginRequest,
  PasswordChangeRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  PatchedUserDetailsRequest,
  RegisterRequest,
  ResendEmailVerificationRequest,
  TokenRefreshRequest,
  TokenVerifyRequest,
  UserDetailsRequest,
  VerifyEmailRequest,
} from "./data-contracts.ts";
import { HttpClient, type RequestParams } from "./http-client.ts";

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Check the credentials and return the REST Token if the credentials are valid and authenticated. Calls Django Auth login method to register User ID in Django session framework Accept the following POST parameters: username, password Return the REST Framework Token Object's key.
   *
   * @tags auth
   * @name AuthLoginCreate
   * @request POST:/api/auth/login/
   * @secure
   */
  authLoginCreate = (data: LoginRequest, params: RequestParams = {}) =>
    this.request<AuthLoginCreateData, any>({
      path: `/api/auth/login/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Calls Django logout method and delete the Token object assigned to the current User object. Accepts/Returns nothing.
   *
   * @tags auth
   * @name AuthLogoutCreate
   * @request POST:/api/auth/logout/
   * @secure
   */
  authLogoutCreate = (params: RequestParams = {}) =>
    this.request<AuthLogoutCreateData, any>({
      path: `/api/auth/logout/`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Calls Django Auth SetPasswordForm save method. Accepts the following POST parameters: new_password1, new_password2 Returns the success/fail message.
   *
   * @tags auth
   * @name AuthPasswordChangeCreate
   * @request POST:/api/auth/password/change/
   * @secure
   */
  authPasswordChangeCreate = (
    data: PasswordChangeRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthPasswordChangeCreateData, any>({
      path: `/api/auth/password/change/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Calls Django Auth PasswordResetForm save method. Accepts the following POST parameters: email Returns the success/fail message.
   *
   * @tags auth
   * @name AuthPasswordResetCreate
   * @request POST:/api/auth/password/reset/
   * @secure
   */
  authPasswordResetCreate = (
    data: PasswordResetRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthPasswordResetCreateData, any>({
      path: `/api/auth/password/reset/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Password reset e-mail link is confirmed, therefore this resets the user's password. Accepts the following POST parameters: token, uid, new_password1, new_password2 Returns the success/fail message.
   *
   * @tags auth
   * @name AuthPasswordResetConfirmCreate
   * @request POST:/api/auth/password/reset/confirm/
   * @secure
   */
  authPasswordResetConfirmCreate = (
    data: PasswordResetConfirmRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthPasswordResetConfirmCreateData, any>({
      path: `/api/auth/password/reset/confirm/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Registers a new user and signs them in the same way LoginView does. dj-rest-auth's RegisterView sets no auth cookies and returns the refresh token in the body, so the client would not be signed in and the refresh token would reach JavaScript despite JWT_AUTH_HTTPONLY.
   *
   * @tags auth
   * @name AuthRegistrationCreate
   * @request POST:/api/auth/registration/
   * @secure
   */
  authRegistrationCreate = (
    data: RegisterRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthRegistrationCreateData, any>({
      path: `/api/auth/registration/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Resends another email to an unverified email. Accepts the following POST parameter: email.
   *
   * @tags auth
   * @name AuthRegistrationResendEmailCreate
   * @request POST:/api/auth/registration/resend-email/
   * @secure
   */
  authRegistrationResendEmailCreate = (
    data: ResendEmailVerificationRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthRegistrationResendEmailCreateData, any>({
      path: `/api/auth/registration/resend-email/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Verifies the email associated with the provided key. Accepts the following POST parameter: key.
   *
   * @tags auth
   * @name AuthRegistrationVerifyEmailCreate
   * @request POST:/api/auth/registration/verify-email/
   * @secure
   */
  authRegistrationVerifyEmailCreate = (
    data: VerifyEmailRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthRegistrationVerifyEmailCreateData, any>({
      path: `/api/auth/registration/verify-email/`,
      method: "POST",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
   *
   * @tags auth
   * @name AuthTokenRefreshCreate
   * @request POST:/api/auth/token/refresh/
   */
  authTokenRefreshCreate = (
    data: TokenRefreshRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthTokenRefreshCreateData, any>({
      path: `/api/auth/token/refresh/`,
      method: "POST",
      body: data,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Takes a token and indicates if it is valid.  This view provides no information about a token's fitness for a particular use.
   *
   * @tags auth
   * @name AuthTokenVerifyCreate
   * @request POST:/api/auth/token/verify/
   */
  authTokenVerifyCreate = (
    data: TokenVerifyRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthTokenVerifyCreateData, any>({
      path: `/api/auth/token/verify/`,
      method: "POST",
      body: data,
      type: "application/json",
      ...params,
    });
  /**
   * @description Reads and updates UserModel fields Accepts GET, PUT, PATCH methods. Default accepted fields: username, first_name, last_name Default display fields: pk, username, email, first_name, last_name Read-only fields: pk, email Returns UserModel fields.
   *
   * @tags auth
   * @name AuthUserRetrieve
   * @request GET:/api/auth/user/
   * @secure
   */
  authUserRetrieve = (params: RequestParams = {}) =>
    this.request<AuthUserRetrieveData, any>({
      path: `/api/auth/user/`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Reads and updates UserModel fields Accepts GET, PUT, PATCH methods. Default accepted fields: username, first_name, last_name Default display fields: pk, username, email, first_name, last_name Read-only fields: pk, email Returns UserModel fields.
   *
   * @tags auth
   * @name AuthUserUpdate
   * @request PUT:/api/auth/user/
   * @secure
   */
  authUserUpdate = (data: UserDetailsRequest, params: RequestParams = {}) =>
    this.request<AuthUserUpdateData, any>({
      path: `/api/auth/user/`,
      method: "PUT",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
  /**
   * @description Reads and updates UserModel fields Accepts GET, PUT, PATCH methods. Default accepted fields: username, first_name, last_name Default display fields: pk, username, email, first_name, last_name Read-only fields: pk, email Returns UserModel fields.
   *
   * @tags auth
   * @name AuthUserPartialUpdate
   * @request PATCH:/api/auth/user/
   * @secure
   */
  authUserPartialUpdate = (
    data: PatchedUserDetailsRequest,
    params: RequestParams = {},
  ) =>
    this.request<AuthUserPartialUpdateData, any>({
      path: `/api/auth/user/`,
      method: "PATCH",
      body: data,
      secure: true,
      type: "application/json",
      format: "json",
      ...params,
    });
}
