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

export interface GameLog {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /**
   * Auth token
   * @minLength 1
   * @maxLength 255
   */
  client_token_hash: string;
  /**
   * Client source
   * @minLength 1
   * @maxLength 50
   */
  client: string;
  /**
   * Client version
   * @minLength 1
   * @maxLength 20
   */
  client_version: string;
  /**
   * Client submitted at
   * @format date-time
   */
  submitted_at?: string | null;
  /** Raw game payload */
  payload: object;
  /**
   * Server received at
   * @format date-time
   */
  created_at?: string;
}

export interface GameLogHistory {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /** User */
  user?: number | null;
  /**
   * Auth token
   * @minLength 1
   * @maxLength 255
   */
  client_token_hash: string;
  /**
   * Client source
   * @minLength 1
   * @maxLength 50
   */
  client: string;
  /**
   * Client version
   * @minLength 1
   * @maxLength 20
   */
  client_version: string;
  /**
   * Client submitted at
   * @format date-time
   */
  submitted_at?: string | null;
  /** Raw game payload */
  payload: object;
  /**
   * Server received at
   * @format date-time
   */
  created_at?: string;
}

export interface ErrorLog {
  /**
   * Id
   * @format uuid
   */
  id?: string;
  /**
   * Auth token
   * @minLength 1
   * @maxLength 255
   */
  token: string;
  /**
   * Client source
   * @minLength 1
   * @maxLength 50
   */
  client: string;
  /**
   * Client version
   * @minLength 1
   * @maxLength 20
   */
  client_version: string;
  /**
   * Client submitted at
   * @format date-time
   */
  submitted_at?: string | null;
  /** Raw error payload */
  payload: object;
  /**
   * Server received at
   * @format date-time
   */
  created_at?: string;
}

export type Empty = object;

export interface UserEmailResetPw {
  /**
   * New password
   * New password. Must match: ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   * @minLength 8
   * @pattern ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   */
  new_password: string;
  /**
   * Email
   * Email address (required when not authenticated)
   * @format email
   * @minLength 1
   */
  email?: string;
}

export interface UserFindPwEmailCheckConfirmCode {
  /**
   * Email
   * Registered email address for password reset
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Confirm code
   * 6-digit verification code
   * @minLength 1
   * @maxLength 6
   * @pattern ^\d{6}$
   */
  confirm_code: string;
}

export type UserMyProfileResponse = {
  /**
   * Email
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Profile name
   * @minLength 1
   * @maxLength 100
   */
  profile_name: string;
  /**
   * Username
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * Bio
   * @minLength 1
   * @maxLength 255
   */
  bio?: string;
  /** Is active */
  is_active?: boolean;
  /**
   * Joined at
   * @format date-time
   */
  date_joined?: string;
  /**
   * Last login at
   * @format date-time
   */
  last_login?: string;
  /** Is staff */
  is_staff?: boolean;
  /** Is customer */
  is_customer?: boolean;
  /**
   * Password changed at
   * @format date-time
   */
  password_changed_at?: string;
  /**
   * Deletion requested at
   * @format date-time
   */
  deletion_requested_at?: string | null;
  /**
   * Client token hash
   * @maxLength 64
   */
  client_token_hash?: string | null;
} | null;

export type TokenResponse = {
  /**
   * Token value
   * Token value
   * @minLength 1
   */
  token_value: string;
  /**
   * Expiry
   * Expiration timestamp
   * @format date-time
   */
  expiry: string;
} | null;

export interface UserFindPwEmailCheckConfirmCodeResponse {
  /** Is confirmed */
  is_confirmed: boolean;
  user?: UserMyProfileResponse;
  token_info?: TokenResponse;
}

export interface UserFindPwEmailSendConfirmCode {
  /**
   * Email
   * Registered email address for password reset
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface UserEmailSendConfirmCodeResponse {
  /**
   * Expires in minutes
   * Number of minutes until the verification code expires
   */
  expires_in_minutes: number;
  /**
   * Created at
   * Timestamp when the verification code was created
   * @format date-time
   */
  created_at: string;
}

export interface UserEmailLogin {
  /**
   * Email
   * Email used as login ID
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Password
   * Must match the following regex: ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   * @minLength 8
   * @pattern ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   */
  password: string;
}

export interface UserSignupLoginResponse {
  user: UserMyProfileResponse;
  token_info: TokenResponse;
  /**
   * Client token
   * @minLength 1
   */
  client_token?: string;
}

export interface UserMyProfileUpdate {
  /**
   * Profile name
   * @maxLength 100
   */
  profile_name?: string;
  /**
   * Username
   * @maxLength 100
   */
  username?: string;
  /**
   * Bio
   * @maxLength 255
   */
  bio?: string;
}

export interface UserEmailAvailability {
  /**
   * Email
   * Email address to check availability for
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface UserEmailAvailabilityResponse {
  /** Is available */
  is_available: boolean;
}

export interface UserTagAvailability {
  /**
   * Username
   * Username / profile tag to check availability for
   * @minLength 1
   * @maxLength 100
   */
  username: string;
}

export interface UsernameAvailabilityResponse {
  /** Is available */
  is_available: boolean;
}

export interface UserEmailSignup {
  /**
   * Email
   * Email used as login ID
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Password
   * Must match the following regex: ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   * @minLength 8
   * @pattern ^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$
   */
  password: string;
  /**
   * Profile name
   * Display name for the user profile
   * @minLength 1
   * @maxLength 100
   */
  profile_name: string;
  /**
   * Username
   * Unique profile tag / handle
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * Bio
   * Short biography text
   * @maxLength 255
   */
  bio: string;
}

export interface UserEmailCheckConfirmCode {
  /**
   * Email
   * Email address the verification code was sent to
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * Confirm code
   * 6-digit verification code
   * @minLength 1
   * @maxLength 6
   * @pattern ^\d{6}$
   */
  confirm_code: string;
}

export interface UserEmailCheckConfirmCodeResponse {
  /** Is confirmed */
  is_confirmed: boolean;
}

export interface UserEmailSendConfirmCode {
  /**
   * Email
   * Email address to send the verification code to
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface UserSocialCheckRequest {
  /**
   * Provider
   * Social login provider (e.g., google, apple)
   */
  provider: "google" | "apple";
  /**
   * Access token
   * Access token / ID token from social login provider
   * @minLength 1
   * @maxLength 2048
   */
  access_token: string;
}

export interface UserSocialCheckResponse {
  /** Is new */
  is_new: boolean;
  /**
   * Social uuid
   * @format uuid
   */
  social_uuid: string;
  /**
   * Email
   * @format email
   * @minLength 1
   */
  email: string;
}

export interface UserSocialSignin {
  /**
   * Social uuid
   * UUID returned from the social check endpoint
   * @format uuid
   */
  social_uuid: string;
  /**
   * Access token
   * Access token from social login provider
   * @minLength 1
   * @maxLength 2048
   */
  access_token: string;
}

export interface UserSocialSignup {
  /**
   * Social uuid
   * UUID returned from the social check endpoint
   * @format uuid
   */
  social_uuid: string;
  /**
   * Access token
   * Access token from social login provider
   * @minLength 1
   * @maxLength 2048
   */
  access_token: string;
  /**
   * Profile name
   * Display name for the user profile
   * @minLength 1
   * @maxLength 100
   */
  profile_name: string;
  /**
   * Username
   * Unique profile tag / handle
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * Bio
   * Short biography text
   * @maxLength 255
   */
  bio: string;
}

export interface UsernameUpdate {
  /**
   * Username
   * New username / profile tag
   * @minLength 1
   * @maxLength 100
   */
  username: string;
}

export type LogAddGameData = GameLog;

export interface LogGameHistoryParams {
  api_page: number;
}

export type LogGameHistoryData = GameLogHistory[];

export type LogLogErrorsData = ErrorLog;

export interface LogMyGameHistoryParams {
  api_page: number;
}

export type LogMyGameHistoryData = GameLog[];

export type UserDeleteAccountData = Empty;

export type UserEmailResetPwData = Empty;

export type UserFindPwCheckConfirmCodeData =
  UserFindPwEmailCheckConfirmCodeResponse;

export type UserFindPwSendConfirmCodeData = UserEmailSendConfirmCodeResponse;

export type UserEmailLoginData = UserSignupLoginResponse;

export type UserLogoutData = Empty;

export interface UserMyProfileGetParams {
  api_page: number;
}

export type UserMyProfileGetData = UserMyProfileResponse;

export type UserMyProfileUpdateData = UserMyProfileResponse;

export type UserRecoverAccountData = Empty;

export type UserCheckEmailAvailabilityData = UserEmailAvailabilityResponse;

export type UserCheckTagAvailabilityData = UsernameAvailabilityResponse;

export type UserEmailSignupData = UserSignupLoginResponse;

export type UserSignupEmailCheckConfirmCodeData =
  UserEmailCheckConfirmCodeResponse;

export type UserSignupEmailSendConfirmCodeData =
  UserEmailSendConfirmCodeResponse;

export type UserSocialCheckData = UserSocialCheckResponse;

export type UserSocialSigninData = UserSignupLoginResponse;

export type UserSocialSignupData = UserSignupLoginResponse;

export type UserTagUpdateData = UserMyProfileResponse;

export interface UserProfileGetParams {
  api_page: number;
  username: string;
}

export type UserProfileGetData = UserMyProfileResponse;
