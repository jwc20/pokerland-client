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
 * * `read` - read
 * * `price` - price
 * * `stack` - stack
 * * `felt` - felt
 */
export type WhyEnum = "read" | "price" | "stack" | "felt";

/**
 * * `clear` - clear
 * * `close` - close
 * * `your_call` - your_call
 */
export type VerdictEnum = "clear" | "close" | "your_call";

/**
 * * `percent` - percent
 * * `ratio` - ratio
 * * `number` - number
 */
export type UnitEnum = "percent" | "ratio" | "number";

/**
 * * `tag` - tag
 * * `lag` - lag
 * * `station` - station
 * * `rock` - rock
 */
export type StyleEnum = "tag" | "lag" | "station" | "rock";

/**
 * * `own_hand` - One of your hands
 * * `generated` - Generated
 * * `match` - A coached match
 */
export type SourceEnum = "own_hand" | "generated" | "match";

/**
 * * `exact` - Exact
 * * `reference` - Reference range
 * * `rule` - Rule of thumb
 * * `reflection` - Reflection
 */
export type ScenarioGradingEnum = "exact" | "reference" | "rule" | "reflection";

/**
 * * `action` - action
 * * `sizing` - sizing
 */
export type RuleCardKindEnum = "action" | "sizing";

/**
 * * `value` - value
 * * `bluff` - bluff
 * * `draw` - draw
 * * `protect` - protect
 * * `bluff_catch` - bluff_catch
 * * `price` - price
 * * `trap` - trap
 * * `give_up` - give_up
 * * `cant_say` - cant_say
 */
export type ReasonEnum =
  | "value"
  | "bluff"
  | "draw"
  | "protect"
  | "bluff_catch"
  | "price"
  | "trap"
  | "give_up"
  | "cant_say";

/**
 * * `doesnt_fold` - doesnt_fold
 * * `unknown` - unknown
 * * `big_bets_weak` - big_bets_weak
 */
export type ReadEnum = "doesnt_fold" | "unknown" | "big_bets_weak";

/**
 * * `bet` - bet
 * * `raise` - raise
 */
export type RaiseKindEnum = "bet" | "raise";

/**
 * * `action` - action
 * * `choice` - choice
 */
export type QuestionKindEnum = "action" | "choice";

/**
 * * `arithmetic` - arithmetic
 * * `preflop` - preflop
 * * `postflop` - postflop
 * * `push_fold` - push_fold
 * * `hand_reading` - hand_reading
 */
export type PracticeSkillEnum =
  | "arithmetic"
  | "preflop"
  | "postflop"
  | "push_fold"
  | "hand_reading";

/**
 * * `daily` - Today's set
 * * `my_hands` - My hands
 * * `generated` - Generated
 * * `match` - From a match
 */
export type PracticeSetKindEnum = "daily" | "my_hands" | "generated" | "match";

/**
 * * `fold` - fold
 * * `check` - check
 * * `call` - call
 * * `bet` - bet
 * * `raise` - raise
 */
export type PracticeActionEnum = "fold" | "check" | "call" | "bet" | "raise";

/**
 * * `in` - in
 * * `out` - out
 */
export type PositionEnum = "in" | "out";

/**
 * * `departure` - departure
 * * `best` - best
 * * `closest` - closest
 */
export type PickedHandKindEnum = "departure" | "best" | "closest";

export type NullEnum = null;

/**
 * * `showdown` - showdown
 * * `read` - read
 * * `label` - label
 */
export type NoteRequestKindEnum = "showdown" | "read" | "label";

/**
 * * `coach` - coach
 * * `user` - user
 */
export type NoteAuthorEnum = "coach" | "user";

/**
 * * `my_hands` - my_hands
 * * `generated` - generated
 */
export type NewSetKindEnum = "my_hands" | "generated";

/**
 * * `mystery` - Mystery
 * * `tag` - Tight-aggressive
 * * `lag` - Loose-aggressive
 * * `station` - Calling station
 * * `rock` - Rock
 */
export type MatchSummaryOpponentEnum =
  | "mystery"
  | "tag"
  | "lag"
  | "station"
  | "rock";

/**
 * * `progress` - Follow my progress
 * * `1` - Watch
 * * `2` - Call it
 * * `3` - Play, then hear it
 * * `4` - Solo
 */
export type MatchSummaryCoachEnum = "progress" | "1" | "2" | "3" | "4";

/**
 * * `mystery` - mystery
 * * `tag` - tag
 * * `lag` - lag
 * * `station` - station
 * * `rock` - rock
 */
export type MatchOpponentEnum = "mystery" | "tag" | "lag" | "station" | "rock";

/**
 * * `progress` - progress
 * * `1` - 1
 * * `2` - 2
 * * `3` - 3
 * * `4` - 4
 */
export type MatchCoachEnum = "progress" | "1" | "2" | "3" | "4";

/**
 * * `names` - names
 * * `positions` - positions
 */
export type LabelsEnum = "names" | "positions";

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

/**
 * * `nothing` - nothing
 * * `draw` - draw
 * * `showdown_value` - showdown_value
 * * `strong` - strong
 */
export type HandClassEnum = "nothing" | "draw" | "showdown_value" | "strong";

/**
 * * `good` - Good
 * * `acceptable` - Acceptable
 * * `poor` - Poor
 * * `ungraded` - Not graded
 */
export type GradeEnum = "good" | "acceptable" | "poor" | "ungraded";

/**
 * * `arithmetic` - arithmetic
 * * `postflop` - postflop
 * * `push_fold` - push_fold
 */
export type GeneratedSkillEnum = "arithmetic" | "postflop" | "push_fold";

/**
 * * `button` - button
 * * `out_of_position` - out_of_position
 * * `sizing` - sizing
 * * `showdown_value` - showdown_value
 * * `stack_depth` - stack_depth
 * * `adjustments` - adjustments
 */
export type FamilyEnum =
  | "button"
  | "out_of_position"
  | "sizing"
  | "showdown_value"
  | "stack_depth"
  | "adjustments";

/**
 * * `none` - none
 * * `bet` - bet
 * * `raise` - raise
 */
export type FacingEnum = "none" | "bet" | "raise";

/**
 * * `thin` - thin
 * * `strong` - strong
 */
export type EvidenceEnum = "thin" | "strong";

/**
 * * `exact` - exact
 * * `rule` - rule
 * * `adjustment` - adjustment
 * * `none` - none
 */
export type BasisEnum = "exact" | "rule" | "adjustment" | "none";

/**
 * * `exact` - exact
 * * `reference` - reference
 * * `rule` - rule
 * * `reflection` - reflection
 */
export type AttemptResultGradingEnum =
  | "exact"
  | "reference"
  | "rule"
  | "reflection";

export interface Accepted {
  /**
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   */
  style: StyleEnum;
  /**
   * * `coach` - coach
   * * `user` - user
   */
  by: NoteAuthorEnum;
}

export interface ActRequestRequest {
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action: PracticeActionEnum;
  /**
   * A bet or raise: the bet it makes.
   * @min 1
   */
  amount?: number;
  /**
   * * `value` - value
   * * `bluff` - bluff
   * * `draw` - draw
   * * `protect` - protect
   * * `bluff_catch` - bluff_catch
   * * `price` - price
   * * `trap` - trap
   * * `give_up` - give_up
   * * `cant_say` - cant_say
   */
  reason?: ReasonEnum;
  /**
   * Seconds the decision took.
   * @format double
   * @min 0
   */
  time_taken?: number;
}

/** What the playbook says about a decision (practice.rules.evaluate). */
export interface Advice {
  /** The card in play; null when no card decides it. */
  rule: string | null;
  /** Every card that applied. */
  rules: string[];
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action: PracticeActionEnum;
  /** Moves that keep it. */
  accepts: PracticeActionEnum[];
  /**
   * A bet's size, as a share of the pot.
   * @format double
   */
  size: number | null;
  /**
   * A raise before the flop: the bet it makes, in big blinds.
   * @format double
   */
  to_bb: number | null;
  /**
   * * `clear` - clear
   * * `close` - close
   * * `your_call` - your_call
   */
  verdict: VerdictEnum;
  /**
   * * `exact` - exact
   * * `rule` - rule
   * * `adjustment` - adjustment
   * * `none` - none
   */
  basis: BasisEnum;
  /** Two cards disagree, so it is close. */
  conflict?: boolean;
  /** The card a bet's size comes from. */
  sizing_rule?: string;
  /** Clean outs your draws have. */
  outs: number;
  /**
   * Their chance of coming, on the next card or by the river all-in.
   * @format double
   */
  draw_equity: number;
}

export interface AfterHand {
  step: number;
  line: string;
}

export interface AllIn {
  hand: number;
  /** @format double */
  equity: number;
  /** @format double */
  expected_bb: number;
  /** @format double */
  net_bb: number;
}

export interface AttemptRequestRequest {
  scenario: number;
  set?: number | null;
  /**
   * @min 0
   * @max 3
   */
  choice?: number;
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action?: PracticeActionEnum;
  /**
   * A bet or raise: the bet it makes.
   * @min 1
   */
  amount?: number;
  /**
   * * `value` - value
   * * `bluff` - bluff
   * * `draw` - draw
   * * `protect` - protect
   * * `bluff_catch` - bluff_catch
   * * `price` - price
   * * `trap` - trap
   * * `give_up` - give_up
   * * `cant_say` - cant_say
   */
  reason?: ReasonEnum;
  /**
   * @min 1
   * @max 5
   */
  confidence?: number;
  /**
   * @format double
   * @min 0
   */
  time_taken?: number;
  /**
   * The time zone the user's days are counted in.
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

/** A graded answer, with the spot's answer. A reflection is not graded: its grade is "ungraded". */
export interface AttemptResult {
  id: number;
  scenario: number;
  choice: number | null;
  action: string;
  amount: number | null;
  reason: string;
  confidence: number | null;
  grade: GradeEnum;
  /** @format double */
  score: number | null;
  /** @format double */
  weight: number;
  /** @format double */
  ev_lost_bb: number | null;
  rule: string;
  /**
   * * `exact` - exact
   * * `reference` - reference
   * * `rule` - rule
   * * `reflection` - reflection
   */
  grading: AttemptResultGradingEnum;
  /** The answer, shown once a spot is answered. Which fields appear depends on the question and the grading. */
  answer: Feedback;
  /** @format date-time */
  created: string;
}

/** By the book: the playbook's default rules over the user's recent hands, at least a day old. */
export interface Book {
  /** How many of the user's hands were looked at, the most recent first. */
  hands: number;
  rules: BookRule[];
  /** With `rule`: where it applied. */
  chances?: BookChance[];
}

/** A decision in one of the user's hands that a rule applied to. */
export interface BookChance {
  /** The hand's id, for its replay. */
  hand: number;
  /** The site's hand number. */
  hand_id: string;
  /** @format date-time */
  played_at: string;
  /** The event the decision is: open the replay there. */
  step: number;
  street: string;
  /** A move as the playbook's rules read it. Amounts are chips. */
  move: Move;
  followed: boolean;
}

/** How often a rule was kept when it applied, with its 95% Wilson range. */
export interface BookRule {
  rule: string;
  /** Decisions that kept it. */
  did: number;
  /** Decisions it applied to. */
  could: number;
  /** @format double */
  pct: number | null;
  /** @format double */
  ci_low: number | null;
  /** @format double */
  ci_high: number | null;
}

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

export interface Debrief {
  /** One thing to fix: none after a match by the book. */
  fix: Fix | null;
  hands: PickedHand[];
  book: BookRule[];
  /** The bot revealed beside your card. */
  read: Truth;
  /** Chips won against chips expected, in starting big blinds. */
  luck: Luck;
  /** The coach was pinned to a stage, so no family moved. */
  pinned: boolean;
  moved: Moved[];
  sent: Sent;
  /** @format double */
  result_bb: number | null;
  hands_played: number;
}

/** A decision the debrief points to: the table as it stood, and what the coach would have said. */
export interface DebriefDecision {
  /** The hand up to the decision. */
  table: TableHand;
  /** The coach's line on it. */
  line: string;
  hand: number;
  step: number;
  street: string;
  holding: string;
  cards: string[];
  /** @format double */
  pot_bb: number;
  /** What the playbook says about a decision (practice.rules.evaluate). */
  advice: Advice;
  move: Move | null;
  followed: boolean | null;
  departure: string;
  asked: boolean;
}

/** The decision you face, and as much of the coach's advice as its stage allows yet. */
export interface DecisionView {
  step: number;
  /** 1 watch, 2 call it, 3 play then hear it, 4 solo. */
  stage: number;
  stage_name: string;
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  family_label: string;
  /** The spot in a line. */
  situation: string;
  /** What the coach says now; null when it is quiet. */
  prompt: string | null;
  /** Sent at stage 1, after your intent at 2, or when asked. */
  advice: Advice | null;
  /** The rule in play, when the advice is sent. */
  rule: RuleCard | null;
  intent: Intent | null;
  /** You asked the coach, which counts against handing it over. */
  asked: boolean;
}

/** A decision that left a clear rule, which the coach asks about once. */
export interface Departure {
  hand: number;
  step: number;
  rule: string | null;
  street: string;
}

export interface DepartureRequestRequest {
  /**
   * The hand's number in the match.
   * @min 1
   */
  hand: number;
  /** @min 0 */
  step: number;
  /**
   * A read on them, the price, the stack depth, or it felt right.
   *
   * * `read` - read
   * * `price` - price
   * * `stack` - stack
   * * `felt` - felt
   */
  why: WhyEnum;
}

/** How far the coach has handed a rule family over: 1 watch, 2 call it, 3 play then hear it, 4 solo. */
export interface FamilyStage {
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  label: string;
  /**
   * @min 1
   * @max 4
   */
  stage: number;
  /** The family's last decisions a rule settled, oldest first: kept without asking the coach, or not. */
  recent: boolean[];
}

/** The answer, shown once a spot is answered. Which fields appear depends on the question and the grading. */
export interface Feedback {
  /** A choice: the right option's index. */
  correct?: number;
  /**
   * A choice: the exact value.
   * @format double
   */
  value?: number;
  formula?: string;
  explanation?: string;
  /** The chips of each amount the text writes as "{a0}", "{a1}", ... */
  amounts?: Record<string, number>;
  best?: PracticeActionEnum[];
  /** Each option's EV in bb. */
  ev_bb?: Record<string, number>;
  /** @format double */
  equity?: number;
  /** @format double */
  equity_needed?: number;
  /** The stated range the answer assumes. */
  range?: string;
  assumptions?: string;
  advice?: Advice | null;
  rule?: RuleCard | null;
  /** Your own hand: what you did at the time. */
  you_did?: Move;
  result?: HandResult;
  /** The numbers behind a decision, as practice.spots works them out. Amounts are chips. */
  context?: Numbers;
}

export interface Fix {
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  label: string;
  misses: number;
  rule: RuleCard | null;
  /** A decision the debrief points to: the table as it stood, and what the coach would have said. */
  decision: DebriefDecision;
}

export interface GeneratedSkill {
  /**
   * * `arithmetic` - arithmetic
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   */
  skill: GeneratedSkillEnum;
  label: string;
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

export interface HandResult {
  /** The hand's id, for its replay. */
  hand: number;
  /** The event the decision is. */
  step: number;
  /**
   * How the hand went for you, in big blinds.
   * @format double
   */
  net_bb: number;
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

/** What you said you would do at stage 2, and what the coach made of it. */
export interface Intent {
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action: PracticeActionEnum;
  amount: number | null;
  reason: string;
  /** It keeps the playbook. */
  kept: boolean;
  /** The coach's answer. */
  line: string;
  reason_fits: boolean;
  /** Why the reason doesn't fit, when it doesn't. */
  reason_note: string;
}

/** Stage 2: what you would do here, and why. The reason is required. */
export interface IntentRequestRequest {
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action: PracticeActionEnum;
  /**
   * A bet or raise: the bet it makes.
   * @min 1
   */
  amount?: number;
  /**
   * * `value` - value
   * * `bluff` - bluff
   * * `draw` - draw
   * * `protect` - protect
   * * `bluff_catch` - bluff_catch
   * * `price` - price
   * * `trap` - trap
   * * `give_up` - give_up
   * * `cant_say` - cant_say
   */
  reason: ReasonEnum;
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

export interface Label {
  /**
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   */
  style: StyleEnum;
  vpip: number;
  aggression: number;
  hands: number;
}

/** The moves the decision allows. Amounts are chips, or cents with a currency. */
export interface Legal {
  /** 0 when checking is free. */
  to_call: number;
  can_check: boolean;
  can_raise: boolean;
  /**
   * * `bet` - bet
   * * `raise` - raise
   */
  raise_kind: RaiseKindEnum;
  /** The least a bet or raise can make your bet. */
  min_to: number | null;
  /** All-in. */
  max_to: number | null;
  /** Chips already in front of you on this street. */
  bet: number;
  /** Chips behind. */
  stack: number;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  /** @minLength 1 */
  password: string;
}

/** Chips won against chips expected, in starting big blinds. */
export interface Luck {
  /**
   * Chips won.
   * @format double
   */
  actual_bb: number;
  /**
   * Chips expected when the money went in.
   * @format double
   */
  expected_bb: number;
  /**
   * The gap: above expectation when positive.
   * @format double
   */
  luck_bb: number;
  all_ins: AllIn[];
  /** Hands lost by a stack with every decision by the book. */
  coolers: number[];
}

export interface MatchStartRequest {
  /**
   * A style to drill one adjustment against, or a mystery: a random style. The leak is always hidden.
   *
   * * `mystery` - mystery
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   * @default "mystery"
   */
  opponent?: MatchOpponentEnum;
  /**
   * "progress" follows your stage in each rule family; "1" to "4" pins the coach to a stage.
   *
   * * `progress` - progress
   * * `1` - 1
   * * `2` - 2
   * * `3` - 3
   * * `4` - 4
   * @default "progress"
   */
  coach?: MatchCoachEnum;
  /** The house starter playbook if left out. */
  playbook?: number;
}

/** A coached match as you see it. Amounts are chips; the bot's style and leak wait for the debrief. */
export interface MatchState {
  id: number;
  /**
   * As chosen.
   *
   * * `mystery` - mystery
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   */
  opponent: MatchOpponentEnum;
  /**
   * * `progress` - progress
   * * `1` - 1
   * * `2` - 2
   * * `3` - 3
   * * `4` - 4
   */
  coach: MatchCoachEnum;
  playbook: number;
  /** @format date-time */
  started: string;
  /** @format date-time */
  finished: string | null;
  hand_number: number;
  hands_planned: number;
  small_blind: number;
  big_blind: number;
  /** Hands until the blinds go up. */
  next_level_in: number;
  /** A hand up to a decision, in the stored hands' replay format: what the client's buildReplay draws. */
  hand: TableHand;
  hand_over: boolean;
  /** @format double */
  hand_net_bb: number | null;
  /** Your moves, when it is your turn. */
  legal: Legal | null;
  decision: DecisionView | null;
  /** Stage 3: the coach's comment once the hand is over. */
  after_hand: AfterHand | null;
  /** A rule you left, which the coach asks about once. */
  departure: Departure | null;
  /** A notebook on the opponent, from what the table showed: counts, showdowns, reads and a label. */
  read: ReadCard;
  /**
   * Seconds left in the match's time bank.
   * @format double
   */
  time_bank: number;
  /**
   * Chips won by the last hand over, in starting big blinds.
   * @format double
   */
  result_bb: number;
}

export interface MatchSummary {
  id: number;
  opponent: MatchSummaryOpponentEnum;
  coach: MatchSummaryCoachEnum;
  /** @format date-time */
  started: string;
  /** @format date-time */
  finished: string | null;
  hands_planned: number;
  hands_played: number;
  /** @format double */
  result_bb: number | null;
}

export interface Me {
  username: string;
}

/** A move as the playbook's rules read it. Amounts are chips. */
export interface Move {
  /**
   * * `fold` - fold
   * * `check` - check
   * * `call` - call
   * * `bet` - bet
   * * `raise` - raise
   */
  action: PracticeActionEnum;
  all_in?: boolean;
  /** Chips put in with it. */
  amount?: number;
  /** @format double */
  amount_bb?: number;
  /** A bet or raise: the bet it makes. */
  to?: number;
  /** @format double */
  to_bb?: number;
  /** A bet or raise: everything in the middle before it. */
  pot_before?: number;
  /**
   * A bet or raise: its chips ÷ pot_before.
   * @format double
   */
  size?: number | null;
}

export interface Moved {
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  label: string;
  start: number;
  end: number;
}

export interface NewSetRequest {
  /**
   * * `my_hands` - my_hands
   * * `generated` - generated
   */
  kind: NewSetKindEnum;
  /**
   * A generated set's skill.
   *
   * * `arithmetic` - arithmetic
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   */
  skill?: GeneratedSkillEnum;
  /**
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

export interface Note {
  tag: string;
  /**
   * * `coach` - coach
   * * `user` - user
   */
  by: NoteAuthorEnum;
}

/** A note on the read card: what a showdown told you, a read, or a label for their style. */
export interface NoteRequestRequest {
  /**
   * * `showdown` - showdown
   * * `read` - read
   * * `label` - label
   */
  kind: NoteRequestKindEnum;
  /**
   * A read's or showdown's tag (a read card tag), or a style for a label.
   * @minLength 1
   */
  tag: string;
  /**
   * A showdown note: the hand's number.
   * @min 1
   */
  hand?: number;
  /**
   * A read: take it off the card.
   * @default false
   */
  withdraw?: boolean;
}

/** The numbers behind a decision, as practice.spots works them out. Amounts are chips. */
export interface Numbers {
  street: string;
  /**
   * * `none` - none
   * * `bet` - bet
   * * `raise` - raise
   */
  facing: FacingEnum;
  bettor: string | null;
  /** Chips put in with the bet or raise faced. */
  bet: number | null;
  /** Everything in the middle before it. */
  pot_before: number | null;
  to_call: number;
  /** Everything in the middle now. */
  pot: number;
  /** The pot after a call that you can win. */
  pot_if_call: number;
  /** @format double */
  equity_needed: number | null;
  /** @format double */
  mdf: number | null;
  /** @format double */
  effective_bb: number;
  /** @format double */
  spr: number | null;
  players: number;
  position: PositionEnum | NullEnum | null;
  hand_class: HandClassEnum | NullEnum | null;
  made: string | null;
  draws: string[];
  in_front: number;
  big_blind: number;
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

/** A decision the debrief points to: the table as it stood, and what the coach would have said. */
export interface PickedHand {
  /** The hand up to the decision. */
  table: TableHand;
  /** The coach's line on it. */
  line: string;
  hand: number;
  step: number;
  street: string;
  holding: string;
  cards: string[];
  /** @format double */
  pot_bb: number;
  /** What the playbook says about a decision (practice.rules.evaluate). */
  advice: Advice;
  move: Move | null;
  followed: boolean | null;
  departure: string;
  asked: boolean;
  /**
   * * `departure` - departure
   * * `best` - best
   * * `closest` - closest
   */
  kind: PickedHandKindEnum;
}

/** A named, versioned list of rule cards: a house preset, or one a user or coach wrote. */
export interface Playbook {
  id: number;
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  key: string;
  name: string;
  version: number;
  game: string;
  format: string;
  description: string;
  /** A house preset, rather than one a user wrote. */
  house: boolean;
  rule_count: number;
}

/** A named, versioned list of rule cards: a house preset, or one a user or coach wrote. */
export interface PlaybookDetail {
  id: number;
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  key: string;
  name: string;
  version: number;
  game: string;
  format: string;
  description: string;
  /** A house preset, rather than one a user wrote. */
  house: boolean;
  rule_count: number;
  rules: RuleCard[];
  families: FamilyStage[];
}

export interface PracticeDay {
  /** @format date */
  day: string;
  attempts: number;
}

export interface PracticeProfile {
  skills: SkillScore[];
  /** Days with answers, oldest first. */
  days: PracticeDay[];
  current_streak: number;
  best_streak: number;
  /** @format date */
  today: string;
  /** Spots due back today or earlier. */
  reviews_due: number;
  /** The skills generated sets can drill. */
  generated: GeneratedSkill[];
}

export interface PracticeSet {
  id: number;
  kind: PracticeSetKindEnum;
  /** @format date */
  day: string;
  skill: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  finished: string | null;
  spots: Spot[];
}

export interface Question {
  /**
   * What to do, or a choice of four.
   *
   * * `action` - action
   * * `choice` - choice
   */
  kind: QuestionKindEnum;
  prompt: string;
  options?: string[];
  /**
   * * `percent` - percent
   * * `ratio` - ratio
   * * `number` - number
   */
  unit?: UnitEnum;
  /** The only raise is all-in: push or fold. */
  all_in_only?: boolean;
  /** The chips of each amount the text writes as "{a0}", "{a1}", ... */
  amounts?: Record<string, number>;
}

export interface Read {
  tag: string;
  label: string;
  /**
   * * `coach` - coach
   * * `user` - user
   */
  by: NoteAuthorEnum;
  /** The hand it was written after. */
  hand: number | null;
  /**
   * How much backs it: thin evidence only tips close calls.
   *
   * * `thin` - thin
   * * `strong` - strong
   */
  evidence: EvidenceEnum | NullEnum | null;
}

/** A notebook on the opponent, from what the table showed: counts, showdowns, reads and a label. */
export interface ReadCard {
  hands: number;
  counts: ReadCount[];
  showdowns: Showdown[];
  reads: Read[];
  /** The style the counts propose, once they allow. */
  label: Label | null;
  accepted: Accepted | null;
  /** The reads the card can hold. */
  tags: Tag[];
}

export interface ReadCount {
  key: string;
  label: string;
  did: number;
  /** Chances: 0 says the count tells nothing yet. */
  could: number;
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

export interface Review {
  scenario: number;
  /** Its Leitner box: 1 comes back tomorrow, 5 in a month. */
  box: number;
  /** @format date */
  due: string;
}

export interface ReviewRequestRequest {
  scenario: number;
  /**
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

/** A playbook card: the rule, why, who it is for, its exceptions and its source. */
export interface RuleCard {
  id: string;
  number: number;
  /**
   * * `button` - button
   * * `out_of_position` - out_of_position
   * * `sizing` - sizing
   * * `showdown_value` - showdown_value
   * * `stack_depth` - stack_depth
   * * `adjustments` - adjustments
   */
  family: FamilyEnum;
  /**
   * * `action` - action
   * * `sizing` - sizing
   */
  kind?: RuleCardKindEnum;
  rule: string;
  why: string;
  /** "anyone", "heads_up", or the read an adjustment is for. */
  scope: string;
  /** Training wheels, swapped out in time. */
  simplification?: boolean;
  exceptions?: string;
  adjustment?: boolean;
  /**
   * * `doesnt_fold` - doesnt_fold
   * * `unknown` - unknown
   * * `big_bets_weak` - big_bets_weak
   */
  read?: ReadEnum;
  source: string[];
}

export interface Scenario {
  id: number;
  source: SourceEnum;
  topic: string;
  grading: ScenarioGradingEnum;
  skills: PracticeSkillEnum[];
  tier: number;
  /** What the client draws and asks; the answer stays on the server until an attempt. */
  spec: ScenarioSpec;
}

/** What the client draws and asks; the answer stays on the server until an attempt. */
export interface ScenarioSpec {
  /** A hand up to a decision, in the stored hands' replay format: what the client's buildReplay draws. */
  hand: TableHand;
  /**
   * Seats show names in the user's own hands, positions otherwise.
   *
   * * `names` - names
   * * `positions` - positions
   */
  labels: LabelsEnum;
  /** Cards shown with the spot, by player. */
  revealed: Record<string, string[]>;
  question: Question;
  /** The moves the decision allows. Amounts are chips, or cents with a currency. */
  legal?: Legal;
  /** Whether the decision panel may show: never when it holds the answer. */
  panel: boolean;
}

export interface Sent {
  /** Decisions that left a rule, now spots in your daily sets. */
  count: number;
  /** @format date */
  due: string;
}

/** A hand that showed their cards, read backwards: their biggest move and what they held. */
export interface Showdown {
  /** The hand's number in the match. */
  number: number;
  cards: string[];
  line: string;
  /** The tags that fit: what did that tell you? */
  offer: string[];
  note: Note | null;
}

/** A skill's weighted share of good answers, with its 95% Wilson range: a rule of thumb counts half. */
export interface SkillScore {
  /**
   * * `arithmetic` - arithmetic
   * * `preflop` - preflop
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   * * `hand_reading` - hand_reading
   */
  skill: PracticeSkillEnum;
  label: string;
  /** Every answer, reflections included. */
  attempts: number;
  /**
   * Good answers, weighted.
   * @format double
   */
  did: number;
  /**
   * Graded answers, weighted.
   * @format double
   */
  could: number;
  /** @format double */
  pct: number | null;
  /** @format double */
  ci_low: number | null;
  /** @format double */
  ci_high: number | null;
}

/** A spot in a set, and the answer given to it in the set, if any. */
export interface Spot {
  position: number;
  /** A spot coming back from an earlier miss or an "again later". */
  review: boolean;
  scenario: Scenario;
  attempt: AttemptResult | null;
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

/** A hand up to a decision, in the stored hands' replay format: what the client's buildReplay draws. */
export interface TableHand {
  game: string;
  /** Empty for chips; amounts are cents otherwise. */
  currency: string;
  small_blind: number;
  big_blind: number;
  ante: number;
  tournament_id: string;
  button_seat: number;
  max_seats: number | null;
  /** The player whose decision it is. */
  hero: string;
  /** In seat order, with nobody's cards but the hero's and no results. */
  players: HandPlayer[];
  /** Every event before the decision. */
  events: HandEvent[];
}

export interface Tag {
  tag: string;
  label: string;
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

/** The bot revealed beside your card. */
export interface Truth {
  /**
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   */
  style: StyleEnum;
  leak: string;
  leak_label: string;
  /** The read that finds the leak. */
  leak_tag: string;
  /** The label on the card at the end. */
  label: string | null;
  label_right: boolean;
  /** The hand the right label came after. */
  label_hand: number | null;
  reads: string[];
  found: boolean;
  found_hand: number | null;
  found_by: NoteAuthorEnum | NullEnum | null;
  /** The reads on the card the bot didn't have, in words. */
  wrong: string[];
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
  /** With `stat`: only the hands where the hero took the chance (true) or let it go (false). */
  did?: boolean | null;
  /** Number of results to return per page. */
  page_size?: number;
  /**
   * Only the hands the hero won, lost or broke even in.
   *
   * * `won` - won
   * * `lost` - lost
   * * `even` - even
   * @minLength 1
   */
  result?: "won" | "lost" | "even";
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Newest or oldest first, or by the hero's result in big blinds: the biggest wins or losses first.
   *
   * * `newest` - newest
   * * `oldest` - oldest
   * * `biggest_win` - biggest_win
   * * `biggest_loss` - biggest_loss
   * @minLength 1
   * @default "newest"
   */
  sort?: "newest" | "oldest" | "biggest_win" | "biggest_loss";
  /**
   * Only the hands that gave the hero a chance at this statistic, as /api/stats/ counts them.
   *
   * * `vpip` - vpip
   * * `pfr` - pfr
   * * `rfi` - rfi
   * * `limp` - limp
   * * `cold_call` - cold_call
   * * `three_bet` - three_bet
   * * `fold_to_three_bet` - fold_to_three_bet
   * * `four_bet` - four_bet
   * * `squeeze` - squeeze
   * * `steal` - steal
   * * `fold_to_steal` - fold_to_steal
   * * `call_vs_steal` - call_vs_steal
   * * `three_bet_vs_steal` - three_bet_vs_steal
   * * `bb_defend` - bb_defend
   * * `cbet_flop` - cbet_flop
   * * `cbet_turn` - cbet_turn
   * * `cbet_river` - cbet_river
   * * `fold_to_cbet_flop` - fold_to_cbet_flop
   * * `fold_to_cbet_turn` - fold_to_cbet_turn
   * * `fold_to_cbet_river` - fold_to_cbet_river
   * * `donk_flop` - donk_flop
   * * `check_raise` - check_raise
   * * `saw_flop` - saw_flop
   * * `went_to_showdown` - went_to_showdown
   * * `won_at_showdown` - won_at_showdown
   * * `aggression` - aggression
   * @minLength 1
   */
  stat?:
    | "vpip"
    | "pfr"
    | "rfi"
    | "limp"
    | "cold_call"
    | "three_bet"
    | "fold_to_three_bet"
    | "four_bet"
    | "squeeze"
    | "steal"
    | "fold_to_steal"
    | "call_vs_steal"
    | "three_bet_vs_steal"
    | "bb_defend"
    | "cbet_flop"
    | "cbet_turn"
    | "cbet_river"
    | "fold_to_cbet_flop"
    | "fold_to_cbet_turn"
    | "fold_to_cbet_river"
    | "donk_flop"
    | "check_raise"
    | "saw_flop"
    | "went_to_showdown"
    | "won_at_showdown"
    | "aggression";
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
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

export type PracticeAttemptsCreateData = AttemptResult;

export interface PracticeHandsByTheBookRetrieveParams {
  playbook: number;
  /**
   * A card's id: also list the decisions it applied to.
   * @minLength 1
   */
  rule?: string;
}

export type PracticeHandsByTheBookRetrieveData = Book;

export type PracticeMatchesListData = MatchSummary[];

export type PracticeMatchesCreateData = MatchState;

export interface PracticeMatchesRetrieveParams {
  id: number;
}

export type PracticeMatchesRetrieveData = MatchState;

export interface PracticeMatchesActCreateParams {
  id: number;
}

export type PracticeMatchesActCreateData = MatchState;

export interface PracticeMatchesAskCreateParams {
  id: number;
}

export type PracticeMatchesAskCreateData = MatchState;

export interface PracticeMatchesDebriefRetrieveParams {
  id: number;
}

export type PracticeMatchesDebriefRetrieveData = Debrief;

export interface PracticeMatchesDepartureCreateParams {
  id: number;
}

export type PracticeMatchesDepartureCreateData = MatchState;

export interface PracticeMatchesIntentCreateParams {
  id: number;
}

export type PracticeMatchesIntentCreateData = MatchState;

export interface PracticeMatchesNextCreateParams {
  id: number;
}

export type PracticeMatchesNextCreateData = MatchState;

export interface PracticeMatchesReadsCreateParams {
  id: number;
}

export type PracticeMatchesReadsCreateData = MatchState;

export interface PracticeMatchesResignCreateParams {
  id: number;
}

export type PracticeMatchesResignCreateData = MatchState;

export type PracticePlaybooksListData = Playbook[];

export interface PracticePlaybooksRetrieveParams {
  id: number;
}

export type PracticePlaybooksRetrieveData = PlaybookDetail;

export interface PracticeProfileRetrieveParams {
  /**
   * The IANA time zone the user's days are counted in; UTC if left out.
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

export type PracticeProfileRetrieveData = PracticeProfile;

export type PracticeReviewsCreateData = Review;

export type PracticeSetsCreateData = PracticeSet;

export interface PracticeSetsRetrieveParams {
  id: number;
}

export type PracticeSetsRetrieveData = PracticeSet;

export interface PracticeSetsTodayRetrieveParams {
  /**
   * The IANA time zone the user's days are counted in; UTC if left out.
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

export type PracticeSetsTodayRetrieveData = PracticeSet;

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
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
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
