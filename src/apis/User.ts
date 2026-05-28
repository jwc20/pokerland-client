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
  Empty,
  UserCheckEmailAvailabilityData,
  UserCheckTagAvailabilityData,
  UserDeleteAccountData,
  UserEmailAvailability,
  UserEmailCheckConfirmCode,
  UserEmailLogin,
  UserEmailLoginData,
  UserEmailResetPw,
  UserEmailResetPwData,
  UserEmailSendConfirmCode,
  UserEmailSignup,
  UserEmailSignupData,
  UserFindPwCheckConfirmCodeData,
  UserFindPwEmailCheckConfirmCode,
  UserFindPwEmailSendConfirmCode,
  UserFindPwSendConfirmCodeData,
  UserLogoutData,
  UserMyProfileGetData,
  UserMyProfileGetParams,
  UserMyProfileUpdate,
  UserMyProfileUpdateData,
  UserProfileGetData,
  UserProfileGetParams,
  UserRecoverAccountData,
  UserSignupEmailCheckConfirmCodeData,
  UserSignupEmailSendConfirmCodeData,
  UserSocialCheckData,
  UserSocialCheckRequest,
  UserSocialSignin,
  UserSocialSigninData,
  UserSocialSignup,
  UserSocialSignupData,
  UserTagAvailability,
  UserTagUpdateData,
  UsernameUpdate,
} from "./data-contracts";
import type { RequestParams } from "./http-client";
import { ContentType, HttpClient } from "./http-client";

export class User<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) --- ### Notes Deleting an account provides a 30-day recovery period. The account can be recovered within 30 days, then it is permanently deleted.
   *
   * @tags Users - Account
   * @name UserDeleteAccount
   * @summary Delete account (withdrawal)
   * @request POST:/user/delete-account
   * @secure
   * @response `200` `UserDeleteAccountData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userDeleteAccount = (data: Empty, params: RequestParams = {}) =>
    this.request<UserDeleteAccountData, void>({
      path: `/user/delete-account`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key ---
   *
   * @tags Users - Password
   * @name UserEmailResetPw
   * @summary Reset password
   * @request POST:/user/email/reset-pw
   * @secure
   * @response `200` `UserEmailResetPwData`
   */
  userEmailResetPw = (data: UserEmailResetPw, params: RequestParams = {}) =>
    this.request<UserEmailResetPwData, any>({
      path: `/user/email/reset-pw`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- ### Notes The email verification code must be entered within 3 minutes.
   *
   * @tags Users - Password
   * @name UserFindPwCheckConfirmCode
   * @summary Verify password-reset code (always `000000` in non-prod)
   * @request POST:/user/find-pw/email/check-confirm-code
   * @secure
   * @response `200` `UserFindPwCheckConfirmCodeData`
   * @response `400` `void` {"detail" : "email_verification_code_expired"} // Email verification code has expired. {"detail" : "invalid_verification_code"} // Invalid verification code.
   */
  userFindPwCheckConfirmCode = (
    data: UserFindPwEmailCheckConfirmCode,
    params: RequestParams = {},
  ) =>
    this.request<UserFindPwCheckConfirmCodeData, void>({
      path: `/user/find-pw/email/check-confirm-code`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- ### Notes The emailed verification code must be entered within 3 minutes. You can request it up to 3 times within 10 minutes.
   *
   * @tags Users - Password
   * @name UserFindPwSendConfirmCode
   * @summary Send verification code for password reset
   * @request POST:/user/find-pw/email/send-confirm-code
   * @secure
   * @response `200` `UserFindPwSendConfirmCodeData`
   * @response `400` `void` {"detail" : "not_enrolled_login_id"} // Login ID is not registered
   * @response `429` `void` {"detail" : "email_verification_rate_limited"} // Too many verification code requests. Please try again later.
   */
  userFindPwSendConfirmCode = (
    data: UserFindPwEmailSendConfirmCode,
    params: RequestParams = {},
  ) =>
    this.request<UserFindPwSendConfirmCodeData, void>({
      path: `/user/find-pw/email/send-confirm-code`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key ---
   *
   * @tags Users - Email Auth
   * @name UserEmailLogin
   * @summary Login with email
   * @request POST:/user/login/email
   * @secure
   * @response `200` `UserEmailLoginData`
   * @response `400` `void` {"detail" : "invalid_login_info"} // Login information is invalid
   */
  userEmailLogin = (data: UserEmailLogin, params: RequestParams = {}) =>
    this.request<UserEmailLoginData, void>({
      path: `/user/login/email`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) ---
   *
   * @tags Users - Email Auth
   * @name UserLogout
   * @summary Logout
   * @request POST:/user/logout
   * @secure
   * @response `200` `UserLogoutData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userLogout = (data: Empty, params: RequestParams = {}) =>
    this.request<UserLogoutData, void>({
      path: `/user/logout`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) ---
   *
   * @tags Users - Profile
   * @name UserMyProfileGet
   * @summary Get my profile
   * @request GET:/user/my-profile
   * @secure
   * @response `200` `UserMyProfileGetData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userMyProfileGet = (
    query: UserMyProfileGetParams,
    params: RequestParams = {},
  ) =>
    this.request<UserMyProfileGetData, void>({
      path: `/user/my-profile`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) ---
   *
   * @tags Users - Profile
   * @name UserMyProfileUpdate
   * @summary Update my profile
   * @request PATCH:/user/my-profile/update
   * @secure
   * @response `200` `UserMyProfileUpdateData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userMyProfileUpdate = (
    data: UserMyProfileUpdate,
    params: RequestParams = {},
  ) =>
    this.request<UserMyProfileUpdateData, void>({
      path: `/user/my-profile/update`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) --- ### Notes An account marked for deletion can be recovered within 30 days. After 30 days, it can no longer be recovered.
   *
   * @tags Users - Account
   * @name UserRecoverAccount
   * @summary Recover account
   * @request POST:/user/recover-account
   * @secure
   * @response `200` `UserRecoverAccountData`
   * @response `400` `void` {"detail" : "account_not_marked_for_deletion"} // Account is not marked for deletion {"detail" : "recovery_period_expired"} // Account recovery period has expired (30 days)
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userRecoverAccount = (data: Empty, params: RequestParams = {}) =>
    this.request<UserRecoverAccountData, void>({
      path: `/user/recover-account`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key ---
   *
   * @tags Users - Email Auth
   * @name UserCheckEmailAvailability
   * @summary Check email availability
   * @request POST:/user/signup/check-email
   * @secure
   * @response `200` `UserCheckEmailAvailabilityData`
   */
  userCheckEmailAvailability = (
    data: UserEmailAvailability,
    params: RequestParams = {},
  ) =>
    this.request<UserCheckEmailAvailabilityData, any>({
      path: `/user/signup/check-email`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key ---
   *
   * @tags Users - Username / Tag
   * @name UserCheckTagAvailability
   * @summary Check user tag availability
   * @request POST:/user/signup/check-username
   * @secure
   * @response `200` `UserCheckTagAvailabilityData`
   */
  userCheckTagAvailability = (
    data: UserTagAvailability,
    params: RequestParams = {},
  ) =>
    this.request<UserCheckTagAvailabilityData, any>({
      path: `/user/signup/check-username`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key ---
   *
   * @tags Users - Email Auth
   * @name UserEmailSignup
   * @summary Sign up with email (email verification required)
   * @request POST:/user/signup/email
   * @secure
   * @response `201` `UserEmailSignupData`
   * @response `400` `void` {"detail" : "already_enrolled_login_id"} // Login ID is already registered
   */
  userEmailSignup = (data: UserEmailSignup, params: RequestParams = {}) =>
    this.request<UserEmailSignupData, void>({
      path: `/user/signup/email`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- ### Notes The email verification code must be entered within 3 minutes.
   *
   * @tags Users - Email Verification
   * @name UserSignupEmailCheckConfirmCode
   * @summary Verify code (always `000000` in non-prod environments)
   * @request POST:/user/signup/email/check-confirm-code
   * @secure
   * @response `200` `UserSignupEmailCheckConfirmCodeData`
   * @response `400` `void` {"detail" : "already_enrolled_login_id"} // Login ID is already registered {"detail" : "email_verification_code_expired"} // Email verification code has expired. {"detail" : "invalid_verification_code"} // Invalid verification code.
   */
  userSignupEmailCheckConfirmCode = (
    data: UserEmailCheckConfirmCode,
    params: RequestParams = {},
  ) =>
    this.request<UserSignupEmailCheckConfirmCodeData, void>({
      path: `/user/signup/email/check-confirm-code`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- ### Notes The emailed verification code must be entered within 3 minutes. You can request it up to 3 times within 10 minutes.
   *
   * @tags Users - Email Verification
   * @name UserSignupEmailSendConfirmCode
   * @summary Send verification code to submitted email
   * @request POST:/user/signup/email/send-confirm-code
   * @secure
   * @response `200` `UserSignupEmailSendConfirmCodeData`
   * @response `400` `void` {"detail" : "already_enrolled_login_id"} // Login ID is already registered
   * @response `429` `void` {"detail" : "email_verification_rate_limited"} // Too many verification code requests. Please try again later.
   */
  userSignupEmailSendConfirmCode = (
    data: UserEmailSendConfirmCode,
    params: RequestParams = {},
  ) =>
    this.request<UserSignupEmailSendConfirmCodeData, void>({
      path: `/user/signup/email/send-confirm-code`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- Returns TokenAuthenticationFailed when access_token is invalid. social_uuid is a unique identifier used for signup and login. If is_new is True, proceed with social signup flow. If is_new is False, proceed with existing social sign-in flow. For Google, use the code received via query parameter. For Apple, use identityToken as access_token.
   *
   * @tags Users - Social Auth
   * @name UserSocialCheck
   * @summary Validate social login
   * @request POST:/user/social/check
   * @secure
   * @response `200` `UserSocialCheckData`
   * @response `400` `void` {"detail" : "already_enrolled_login_id"} // Login ID is already registered
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userSocialCheck = (
    data: UserSocialCheckRequest,
    params: RequestParams = {},
  ) =>
    this.request<UserSocialCheckData, void>({
      path: `/user/social/check`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- Signs in with validated social login information.
   *
   * @tags Users - Social Auth
   * @name UserSocialSignin
   * @summary Social login (existing user)
   * @request POST:/user/social/signin
   * @secure
   * @response `200` `UserSocialSigninData`
   * @response `400` `void` {"detail" : "not_enrolled_login_id"} // Login ID is not registered {"detail" : "social_access_token_expired"} // Social account access token has expired
   * @response `404` `void` {"detail" : "social_login_identifier_not_found"} // Social login verification info not found.
   */
  userSocialSignin = (data: UserSocialSignin, params: RequestParams = {}) =>
    this.request<UserSocialSigninData, void>({
      path: `/user/social/signin`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key --- Uses nearly the same flow as email signup. Uses social_uuid and access_token instead of email/password. Raises AlreadyEnrolledEmail if the email is already used by another account.
   *
   * @tags Users - Social Auth
   * @name UserSocialSignup
   * @summary Social login signup
   * @request POST:/user/social/signup
   * @secure
   * @response `200` `UserSocialSignupData`
   * @response `400` `void` {"detail" : "social_user_exists"} // Social account already exists {"detail" : "social_access_token_expired"} // Social account access token has expired {"detail" : "already_enrolled_login_id"} // Login ID is already registered
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   * @response `404` `void` {"detail" : "social_login_identifier_not_found"} // Social login verification info not found.
   */
  userSocialSignup = (data: UserSocialSignup, params: RequestParams = {}) =>
    this.request<UserSocialSignupData, void>({
      path: `/user/social/signup`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) --- ### Notes Profile tag can be changed only once every 31 days. When changed, updates are reflected automatically across user content, posts, and comments.
   *
   * @tags Users - Username / Tag
   * @name UserTagUpdate
   * @summary Change profile tag
   * @request POST:/user/username/update
   * @secure
   * @response `200` `UserTagUpdateData`
   * @response `400` `void` {"detail" : "username_update_restricted"} // Profile tag can be changed only once every 31 days {"detail" : "username_already_taken"} // Username / profile tag is already in use
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userTagUpdate = (data: UsernameUpdate, params: RequestParams = {}) =>
    this.request<UserTagUpdateData, void>({
      path: `/user/username/update`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description ### Authentication and Authorization 1. api-key 2. Token (login required) ---
   *
   * @tags Users - Profile
   * @name UserProfileGet
   * @summary Get user profile
   * @request GET:/user/{username}/profile
   * @secure
   * @response `200` `UserProfileGetData`
   * @response `401` `void` {"detail" : "authentication_failed"} // Token authentication failed (possible in all token-auth endpoints)
   */
  userProfileGet = (
    { username, ...query }: UserProfileGetParams,
    params: RequestParams = {},
  ) =>
    this.request<UserProfileGetData, void>({
      path: `/user/${username}/profile`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
