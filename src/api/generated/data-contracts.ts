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

/**
 * * `post` - post
 * * `deal` - deal
 * * `fold` - fold
 * * `check` - check
 * * `call` - call
 * * `bet` - bet
 * * `raise` - raise
 * * `street` - street
 * * `return` - return
 * * `collect` - collect
 * * `show` - show
 * * `muck` - muck
 */
export type HandEventTypeEnum =
  | "post"
  | "deal"
  | "fold"
  | "check"
  | "call"
  | "bet"
  | "raise"
  | "street"
  | "return"
  | "collect"
  | "show"
  | "muck";

export interface ChunkAck {
  acked_offset: number;
}

export interface ChunkRejected {
  detail: string;
  acked_offset?: number;
}

export interface ClientToken {
  client_token: string;
}

export interface Config {
  min_version: string;
  poll_interval_seconds: number;
  flush_interval_seconds: number;
  flush_bytes: number;
  max_read_bytes: number;
  max_chunk_bytes: number;
}

/** A hand with everything its replay needs. */
export interface HandDetail {
  id: number;
  site: string;
  hand_id: string;
  /** @format date-time */
  played_at: string;
  game: string;
  currency: string;
  play_money: boolean;
  small_blind: number;
  big_blind: number;
  tournament_id: string;
  table: string;
  hero: string;
  hero_position: string;
  hero_cards: string[];
  hero_net: number;
  final_street: string;
  max_seats: number | null;
  button_seat: number;
  ante: number;
  total_pot: number;
  rake: number;
  board: string[];
  /** The players dealt in, in seat order. */
  players: HandPlayer[];
  events: HandEvent[];
  /** The hand in the PHH notation (https://phh.readthedocs.io), as PokerKit read it. */
  phh: string;
}

/** One line of the hand. Fields other than `type` and `street` appear only where they apply. */
export interface HandEvent {
  /**
   * * `post` - post
   * * `deal` - deal
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   * * `street` - street
   * * `return` - return
   * * `collect` - collect
   * * `show` - show
   * * `muck` - muck
   */
  type: HandEventTypeEnum;
  /** The betting round: preflop, flop, turn, river, showdown, ... */
  street: string;
  player?: string;
  /** Chips the player puts in (post, call, bet, raise) or gets back (return, collect). */
  amount?: number;
  /** post: the part that is not a bet, e.g. an ante. */
  dead?: number;
  /** raise: the player's bet on this street afterwards. */
  to?: number;
  /** raise: how much higher than the bet before. */
  by?: number;
  all_in?: boolean;
  /** post: small blind, big blind, ante, dead small blind, ... */
  blind?: string;
  /** deal, show, muck: the player's cards. street: the new board cards. */
  cards?: string[];
  /** street: the whole board. */
  board?: string[];
  /** collect: pot, or main pot, side pot-1, ... when there are several. */
  pot?: string;
  /** show: the hand as PokerKit ranks it, e.g. Three of a kind. */
  description?: string;
}

export interface HandPlayer {
  seat: number;
  name: string;
  /** Chips at the start of the hand. */
  stack: number;
  /** BTN, SB, BB, UTG, ... */
  position: string;
  /** Hole cards, when the history shows them. */
  cards: string[];
  /** Chips collected from the pot. */
  won: number;
  /** Chips won minus chips put in. */
  net: number;
}

/** A row of the game history. Amounts are chips, or cents when `currency` is set. */
export interface HandSummary {
  id: number;
  site: string;
  hand_id: string;
  /** @format date-time */
  played_at: string;
  game: string;
  currency: string;
  play_money: boolean;
  small_blind: number;
  big_blind: number;
  tournament_id: string;
  table: string;
  hero: string;
  hero_position: string;
  hero_cards: string[];
  hero_net: number;
  final_street: string;
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

export interface Me {
  username: string;
}

export interface PaginatedHandSummaryList {
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?cursor=cD00ODY%3D""
   */
  next?: string | null;
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?cursor=cj0xJnA9NDg3"
   */
  previous?: string | null;
  results: HandSummary[];
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

export interface StreamAck {
  /** @format uuid */
  stream_id: string;
  acked_offset: number;
}

export interface StreamRegistrationRequest {
  /**
   * @minLength 1
   * @maxLength 32
   */
  source: string;
  /**
   * @minLength 1
   * @maxLength 16
   */
  platform: string;
  /**
   * @minLength 1
   * @maxLength 32
   */
  client_version: string;
  /** @maxLength 512 */
  path_hint?: string;
  /**
   * @minLength 1
   * @pattern ^[0-9a-f]{64}$
   */
  fingerprint: string;
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

/** What the web app shows a user about their tracker. */
export interface TrackerStatus {
  /** @format date-time */
  last_upload_at: string | null;
  file_count: number;
  hands_seen: number;
  platforms: string[];
  client_versions: string[];
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

export interface HandsListParams {
  /** The pagination cursor value. */
  cursor?: string;
}

export type HandsListData = PaginatedHandSummaryList;

export interface HandsRetrieveParams {
  id: number;
}

export type HandsRetrieveData = HandDetail;

export type TrackerConfigRetrieveData = Config;

export type TrackerMeRetrieveData = Me;

export type TrackerStatusRetrieveData = TrackerStatus;

export interface TrackerStreamsUpdateParams {
  /** @format uuid */
  streamId: string;
}

export type TrackerStreamsUpdateData = StreamAck;

/** @format binary */
export type TrackerStreamsChunksUpdatePayload = File;

export interface TrackerStreamsChunksUpdateParams {
  start: number;
  /** @format uuid */
  streamId: string;
}

export type TrackerStreamsChunksUpdateData = ChunkAck;

export type TrackerStreamsChunksUpdateError = ChunkRejected;

export type UsersMeClientTokenRetrieveData = ClientToken;
