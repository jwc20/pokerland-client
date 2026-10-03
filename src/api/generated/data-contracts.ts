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

export interface ClientToken {
  client_token: string;
}

/** Serializer for JWT authentication with expiration times. */
export interface JWT {
  access: string;
  /** Empty: the refresh token is only set as a cookie. */
  refresh: string;
  /** User model w/o password */
  user: UserDetails;
  /** @format date-time */
  access_expiration: string;
  /** @format date-time */
  refresh_expiration: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  /** @minLength 1 */
  password: string;
}

export interface PasswordChangeRequest {
  /**
   * @minLength 1
   * @maxLength 128
   */
  new_password1: string;
  /**
   * @minLength 1
   * @maxLength 128
   */
  new_password2: string;
}

/** Serializer for confirming a password reset attempt. */
export interface PasswordResetConfirmRequest {
  /**
   * @minLength 1
   * @maxLength 128
   */
  new_password1: string;
  /**
   * @minLength 1
   * @maxLength 128
   */
  new_password2: string;
  /** @minLength 1 */
  uid: string;
  /** @minLength 1 */
  token: string;
}

/** Serializer for requesting a password reset e-mail. */
export interface PasswordResetRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
}

/** User model w/o password */
export interface PatchedUserDetailsRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username?: string;
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
}

export interface RegisterRequest {
  /**
   * @minLength 1
   * @maxLength 150
   */
  username: string;
  /**
   * @format email
   * @minLength 1
   */
  email?: string;
  /** @minLength 1 */
  password1: string;
  /** @minLength 1 */
  password2: string;
}

export interface ResendEmailVerificationRequest {
  /**
   * @format email
   * @minLength 1
   */
  email?: string;
}

export interface RestAuthDetail {
  detail: string;
}

export interface TokenRefresh {
  access: string;
  /** @format date-time */
  access_expiration: string;
}

export interface TokenRefreshRequest {
  /**
   * Omit to use the refresh-token cookie.
   * @minLength 1
   */
  refresh?: string;
}

export interface TokenVerifyRequest {
  /** @minLength 1 */
  token: string;
}

/** User model w/o password */
export interface UserDetails {
  /** ID */
  pk: number;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   */
  email: string;
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
}

/** User model w/o password */
export interface UserDetailsRequest {
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /** @maxLength 150 */
  first_name?: string;
  /** @maxLength 150 */
  last_name?: string;
}

export interface VerifyEmailRequest {
  /** @minLength 1 */
  key: string;
}

export type AuthLoginCreateData = JWT;

export type AuthLogoutCreateData = RestAuthDetail;

export type AuthPasswordChangeCreateData = RestAuthDetail;

export type AuthPasswordResetCreateData = RestAuthDetail;

export type AuthPasswordResetConfirmCreateData = RestAuthDetail;

export type AuthRegistrationCreateData = JWT;

export type AuthRegistrationResendEmailCreateData = RestAuthDetail;

export type AuthRegistrationVerifyEmailCreateData = RestAuthDetail;

export type AuthTokenRefreshCreateData = TokenRefresh;

export type AuthTokenVerifyCreateData = any;

export type AuthUserRetrieveData = UserDetails;

export type AuthUserUpdateData = UserDetails;

export type AuthUserPartialUpdateData = UserDetails;

export type UsersMeClientTokenRetrieveData = ClientToken;
