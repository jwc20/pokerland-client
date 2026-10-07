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
 * * `all` - all
 * * `position` - position
 * * `game` - game
 * * `stakes` - stakes
 * * `format` - format
 */
export type HandTagGroupEnum =
  | "all"
  | "position"
  | "game"
  | "stakes"
  | "format";

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

/** The days a user played on, in their time zone, and their runs of consecutive days. */
export interface HandCalendar {
  /** The days with hands, oldest first. */
  days: HandDay[];
  /** Consecutive days up to today, or up to yesterday while today has no hands yet. */
  current_streak: number;
  /** The longest run of consecutive days. */
  best_streak: number;
  played_today: boolean;
}

export interface HandDay {
  /** @format date */
  date: string;
  hands: number;
  /**
   * The day's result in big blinds.
   * @format double
   */
  net_bb: number;
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

/** Hands that share a position, game, cash-game stakes or format, and how they went. */
export interface HandTag {
  /** What /api/hands/?tag= takes: "<group>:<value>", or "all". */
  key: string;
  /**
   * * `all` - all
   * * `position` - position
   * * `game` - game
   * * `stakes` - stakes
   * * `format` - format
   */
  group: HandTagGroupEnum;
  /** BTN, Hold'em No Limit, USD:5:10 (currency:small blind:big blind), cash, ...; empty for "all". */
  value: string;
  /** A stakes tag's blinds; null for the other groups. */
  stakes: TagStakes | null;
  hands: number;
  /** Hands with a positive result. */
  won: number;
  /** Hands with a negative result. */
  lost: number;
  /**
   * Their results summed in big blinds.
   * @format double
   */
  net_bb: number;
  /**
   * How much a hand's result varies: the sample standard deviation of their results in big blinds, from which bb/100's standard error is 100 × bb_stdev ÷ √hands. Null for fewer than two hands.
   * @format double
   */
  bb_stdev: number | null;
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

/** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
export interface Stat {
  did: number;
  could: number;
  /**
   * did ÷ could, in percent; null without a chance.
   * @format double
   */
  pct: number | null;
  /**
   * Where the 95% interval begins, in percent.
   * @format double
   */
  ci_low: number | null;
  /**
   * Where the 95% interval ends, in percent.
   * @format double
   */
  ci_high: number | null;
}

/** The hero's statistics over a group of their hands: all of them, a position's, or a month's. */
export interface StatGroup {
  /** "all", a position such as "BTN", or a month such as "2026-10". */
  key: string;
  hands: number;
  /**
   * Their results summed in big blinds.
   * @format double
   */
  net_bb: number;
  /**
   * How much a hand's result varies: the sample standard deviation of their results in big blinds. Null for fewer than two hands.
   * @format double
   */
  bb_stdev: number | null;
  /** Every statistic in tracker.parsing.facts.STATS, and the aggression frequency. */
  stats: StatSet;
}

/** Every statistic in tracker.parsing.facts.STATS, and the aggression frequency. */
export interface StatSet {
  /** Put money in before the flop by choice: called or raised, not just posted a blind. */
  vpip: Stat;
  /** Raised before the flop. */
  pfr: Stat;
  /** Raised first in: the chance is an unopened pot, folded to the player. */
  rfi: Stat;
  /** Called the big blind with no raise in front. */
  limp: Stat;
  /** Called a raise with no money in by choice yet. */
  cold_call: Stat;
  /** Re-raised a raise. */
  three_bet: Stat;
  /** Opened with a raise, then folded to a re-raise. */
  fold_to_three_bet: Stat;
  /** Re-raised a 3-bet. */
  four_bet: Stat;
  /** Re-raised a raise that had been called, with no money in by choice yet. */
  squeeze: Stat;
  /** Raised first in from the cutoff, the button or the small blind. */
  steal: Stat;
  /** In a blind, folded to a steal. */
  fold_to_steal: Stat;
  /** In a blind, called a steal. */
  call_vs_steal: Stat;
  /** In a blind, re-raised a steal. */
  three_bet_vs_steal: Stat;
  /** In the big blind, called or re-raised a steal. */
  bb_defend: Stat;
  /** Raised last before the flop, then bet the flop when it was checked to them. */
  cbet_flop: Stat;
  /** C-bet the flop and wasn't raised, then bet the turn when it was checked to them. */
  cbet_turn: Stat;
  /** C-bet the turn and wasn't raised, then bet the river when it was checked to them. */
  cbet_river: Stat;
  /** Folded to a c-bet on the flop. */
  fold_to_cbet_flop: Stat;
  /** Folded to a c-bet on the turn. */
  fold_to_cbet_turn: Stat;
  /** Folded to a c-bet on the river. */
  fold_to_cbet_river: Stat;
  /** Bet the flop into the player who raised last before it, before they could act. */
  donk_flop: Stat;
  /** Checked, then raised a bet on the same street: one chance a street. */
  check_raise: Stat;
  /** Saw the flop: the chance is being dealt in. */
  saw_flop: Stat;
  /** Went to showdown: the chance is seeing the flop. */
  went_to_showdown: Stat;
  /** Won money at showdown: the chance is going to showdown. */
  won_at_showdown: Stat;
  /** Bet or raised after the flop: (bets + raises) ÷ (bets + raises + calls + folds). */
  aggression: Stat;
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

export interface TagStakes {
  /** Empty for chips; the blinds are cents otherwise. */
  currency: string;
  small_blind: number;
  big_blind: number;
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
  /**
   * Only the hands played on this day in `tz`.
   * @format date
   */
  date?: string;
  /** Number of results to return per page. */
  page_size?: number;
  /**
   * Only the hands a tag counts: its `key` in /api/hands/tags/.
   * @minLength 1
   */
  tag?: string;
  /**
   * The IANA time zone `date` is a day in, e.g. "Europe/London"; UTC if left out.
   * @minLength 1
   */
  tz?: string;
}

export type HandsListData = PaginatedHandSummaryList;

export interface HandsRetrieveParams {
  id: number;
}

export type HandsRetrieveData = HandDetail;

export interface HandsDaysRetrieveParams {
  /**
   * The IANA time zone days begin and end in, e.g. "Europe/London".
   * @minLength 1
   */
  tz: string;
}

export type HandsDaysRetrieveData = HandCalendar;

export type HandsTagsListData = HandTag[];

export interface StatsListParams {
  /**
   * One group of all the hands, or one per position, or one per month in `tz`.
   *
   * * `none` - none
   * * `position` - position
   * * `month` - month
   * @minLength 1
   * @default "none"
   */
  group_by?: "none" | "position" | "month";
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a tag counts: its `key` in /api/hands/tags/.
   * @minLength 1
   */
  tag?: string;
  /**
   * The IANA time zone days and months are counted in, e.g. "Europe/London"; UTC if left out.
   * @minLength 1
   */
  tz?: string;
  /**
   * Only the hands played up to the end of this day, in `tz`.
   * @format date
   */
  until?: string;
}

export type StatsListData = StatGroup[];

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
