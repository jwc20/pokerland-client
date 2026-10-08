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
 * * `` -
 * * `preflop` - preflop
 * * `flop` - flop
 * * `turn` - turn
 * *
 * `river` - river
 */
export type StreetEnum = "preflop" | "flop" | "turn" | "river";

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
 * * `to_review` - to_review
 * * `reviewed` - reviewed
 */
export type ReviewStateEnum = "to_review" | "reviewed";

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
 * * `open_bb` - open_bb
 * * `limper_bb` - limper_bb
 * * `tournament_open_bb` - tournament_open_bb
 * * `three_bet_x` - three_bet_x
 * * `size_slack` - size_slack
 * * `short_stack_bb` - short_stack_bb
 * * `buy_in_bb` - buy_in_bb
 * * `orbit_min` - orbit_min
 * * `orbit_max` - orbit_max
 */
export type PresetKeyEnum =
  | "open_bb"
  | "limper_bb"
  | "tournament_open_bb"
  | "three_bet_x"
  | "size_slack"
  | "short_stack_bb"
  | "buy_in_bb"
  | "orbit_min"
  | "orbit_max";

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
 * * `value` - value
 * * `bluff` - bluff
 * * `semi_bluff` - semi_bluff
 * * `protection` - protection
 * * `pot_control` - pot_control
 * * `blocking` - blocking
 */
export type NotePurposeEnum =
  | "value"
  | "bluff"
  | "semi_bluff"
  | "protection"
  | "pot_control"
  | "blocking";

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
 * * `open_limp` - open_limp
 * * `open_size` - open_size
 * * `three_bet_size` - three_bet_size
 * * `short_stack_raise` - short_stack_raise
 * * `premium_limp` - premium_limp
 * * `short_buy_in` - short_buy_in
 * * `hands_per_orbit` - hands_per_orbit
 */
export type LeakKeyEnum =
  | "open_limp"
  | "open_size"
  | "three_bet_size"
  | "short_stack_raise"
  | "premium_limp"
  | "short_buy_in"
  | "hands_per_orbit";

/** * `preflop` - preflop */
export type LeakGroupEnum = "preflop";

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
 * * `note` - Note
 * * `tag` - Tag
 * * `review` - Review
 * * `purpose` - Purpose
 */
export type HandNoteKindEnum = "note" | "tag" | "review" | "purpose";

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

export type BlankEnum = "";

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

/** A session that was played on a day, in part or whole. */
export interface DaySession {
  id: number;
  /** @format date-time */
  start: string;
  /** @format date-time */
  end: string;
  hands: number;
  /** @format double */
  net_bb: number;
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
  /** The sessions played that day, the first first. */
  sessions: DaySession[];
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
  /**
   * The hero's share of the pots they could win when the money went in before the river, every live hand shown; null in every other hand.
   * @format double
   */
  hero_allin_equity: number | null;
  /**
   * The hero's net in big blinds expected then, rake taken; null when equity is.
   * @format double
   */
  hero_ev_net_bb: number | null;
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

/** Something the user wrote on a hand: a note, a tag, its review state, or why they made a bet or raise. */
export interface HandNote {
  id: number;
  kind: HandNoteKindEnum;
  /** note: its street, empty for the whole hand. purpose: the bet's street. */
  street: string;
  /** purpose: which of the hero's bets and raises, counted from 0 in the order made. */
  bet: number | null;
  /** tag: the tag. review: to_review or reviewed. purpose: value, bluff, ... */
  value: string;
  /** note: what the user wrote. */
  text: string;
  /** @format date-time */
  updated: string;
}

/**
 * A note to add to a hand, or to change the one it takes the place of: the street's note, the same tag, the
 * review state, or the bet's purpose. Each kind takes its own fields.
 */
export interface HandNoteWriteRequest {
  /**
   * * `note` - Note
   * * `tag` - Tag
   * * `review` - Review
   * * `purpose` - Purpose
   */
  kind: HandNoteKindEnum;
  /**
   * note: the street it is on; empty or left out for the whole hand.
   *
   * * `` -
   * * `preflop` - preflop
   * * `flop` - flop
   * * `turn` - turn
   * * `river` - river
   */
  street?: StreetEnum | BlankEnum;
  /**
   * note: what to say.
   * @minLength 1
   * @maxLength 2000
   */
  text?: string;
  /**
   * tag: a word or two, e.g. cooler.
   * @minLength 1
   * @maxLength 32
   */
  tag?: string;
  /**
   * review: the hand's state.
   *
   * * `to_review` - to_review
   * * `reviewed` - reviewed
   */
  review?: ReviewStateEnum;
  /**
   * purpose: which of the hero's bets and raises, counted from 0.
   * @min 0
   */
  bet?: number;
  /**
   * purpose: why they made it.
   *
   * * `value` - value
   * * `bluff` - bluff
   * * `semi_bluff` - semi_bluff
   * * `protection` - protection
   * * `pot_control` - pot_control
   * * `blocking` - blocking
   */
  purpose?: NotePurposeEnum;
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
  /**
   * The hero's share of the pots they could win when the money went in before the river, every live hand shown; null in every other hand.
   * @format double
   */
  hero_allin_equity: number | null;
  /**
   * The hero's net in big blinds expected then, rake taken; null when equity is.
   * @format double
   */
  hero_ev_net_bb: number | null;
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

/** A leak check over the hero's hands: how often they broke one of the lectures' rules of thumb (B3). */
export interface Leak {
  /**
   * * `open_limp` - open_limp
   * * `open_size` - open_size
   * * `three_bet_size` - three_bet_size
   * * `short_stack_raise` - short_stack_raise
   * * `premium_limp` - premium_limp
   * * `short_buy_in` - short_buy_in
   * * `hands_per_orbit` - hands_per_orbit
   */
  key: LeakKeyEnum;
  /** * `preflop` - preflop */
  group: LeakGroupEnum;
  /** Times the rule was broken out of the chances to keep it; null for hands per orbit. */
  share: Stat | null;
  /**
   * hands_per_orbit: hands played (VPIP) per orbit, an orbit being as many hands as players dealt in.
   * @format double
   */
  rate: number | null;
  /**
   * open_size: the average open in big blinds. three_bet_size: in raises.
   * @format double
   */
  average: number | null;
  /** Sizes: the chances taken smaller than the standard. */
  below: number | null;
  /** Sizes: the chances taken bigger than the standard. */
  above: number | null;
  /**
   * The net, in big blinds, of the hands broken.
   * @format double
   */
  net_broken_bb: number | null;
  /**
   * The net, in big blinds, of the other chances.
   * @format double
   */
  net_kept_bb: number | null;
  /** The trend: each month with chances, the oldest first. */
  months: LeakMonth[];
}

export interface LeakMonth {
  /** A month such as "2026-10". */
  month: string;
  /** Times the rule was broken; for hands per orbit, the hands played. */
  did: number;
  /** The chances to keep it; null for hands per orbit. */
  could: number | null;
  /**
   * Hands per orbit; null for the other checks.
   * @format double
   */
  rate: number | null;
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

export interface NoteTag {
  tag: string;
  hands: number;
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

export interface PaginatedSessionList {
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
  results: Session[];
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

/** New values for some of the leak checks' presets; null puts one back to the course value. */
export interface PatchedPresetsUpdateRequest {
  /**
   * Open-raise in cash games to, in big blinds
   * @format double
   * @min 2
   * @max 6
   */
  open_bb?: number | null;
  /**
   * Plus, for each limper, in big blinds
   * @format double
   * @min 0
   * @max 3
   */
  limper_bb?: number | null;
  /**
   * Open-raise in tournaments to, in big blinds
   * @format double
   * @min 2
   * @max 6
   */
  tournament_open_bb?: number | null;
  /**
   * 3-bet to this many times the raise, plus one more for each caller
   * @format double
   * @min 2
   * @max 6
   */
  three_bet_x?: number | null;
  /**
   * A size this close to the standard keeps the rule: big blinds, or raises for a 3-bet
   * @format double
   * @min 0
   * @max 2
   */
  size_slack?: number | null;
  /**
   * At or below this effective stack, in big blinds, move in instead of raising small
   * @format double
   * @min 5
   * @max 25
   */
  short_stack_bb?: number | null;
  /**
   * Start every cash-game hand with at least this many big blinds
   * @format double
   * @min 20
   * @max 250
   */
  buy_in_bb?: number | null;
  /**
   * Hands to play an orbit, at least
   * @format double
   * @min 0
   * @max 9
   */
  orbit_min?: number | null;
  /**
   * Hands to play an orbit, at most
   * @format double
   * @min 0.5
   * @max 9
   */
  orbit_max?: number | null;
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

/** A threshold of the leak checks: the user's value, the course value, and the range it may be set in. */
export interface Preset {
  /**
   * * `open_bb` - open_bb
   * * `limper_bb` - limper_bb
   * * `tournament_open_bb` - tournament_open_bb
   * * `three_bet_x` - three_bet_x
   * * `size_slack` - size_slack
   * * `short_stack_bb` - short_stack_bb
   * * `buy_in_bb` - buy_in_bb
   * * `orbit_min` - orbit_min
   * * `orbit_max` - orbit_max
   */
  key: PresetKeyEnum;
  /** @format double */
  value: number;
  /**
   * The course value.
   * @format double
   */
  default: number;
  /** @format double */
  min: number;
  /** @format double */
  max: number;
  label: string;
  /** The lectures it comes from, e.g. JHU 3. */
  source: string;
}

/** How the hero's bets and raises of one purpose went on one street. */
export interface PurposeStat {
  /**
   * * `value` - value
   * * `bluff` - bluff
   * * `semi_bluff` - semi_bluff
   * * `protection` - protection
   * * `pot_control` - pot_control
   * * `blocking` - blocking
   */
  purpose: NotePurposeEnum;
  street: string;
  bets: number;
  /** Bets nobody called or raised, taking the pot at once, out of all of them. */
  took_pot: Stat;
  /** Bets called, and not raised. */
  called: number;
  raised: number;
  /**
   * Their average size, as a share of everything in the middle before them.
   * @format double
   */
  size: number | null;
  /**
   * The share of folds a pure bluff of the average size needs to break even: size ÷ (1 + size).
   * @format double
   */
  needed: number | null;
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

/** A hand in the review queue. */
export interface ReviewHand {
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
  /**
   * The hero's share of the pots they could win when the money went in before the river, every live hand shown; null in every other hand.
   * @format double
   */
  hero_allin_equity: number | null;
  /**
   * The hero's net in big blinds expected then, rake taken; null when equity is.
   * @format double
   */
  hero_ev_net_bb: number | null;
  /**
   * When it was flagged to review.
   * @format date-time
   */
  flagged: string;
}

/** The user's review queue: the hands that nag them, which they flagged to look at again [JHU 4]. */
export interface ReviewQueue {
  /** Hands flagged to review. */
  to_review: number;
  /** Hands reviewed since. */
  reviewed: number;
  /** The latest hands flagged to review, the latest first: up to 5. */
  queue: ReviewHand[];
  /** The user's own tags, the most used first. */
  tags: NoteTag[];
  /** Tags to offer anyone. */
  suggested_tags: string[];
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

/** A stretch of play: the user's hands with no gap of more than half an hour between one and the next (F1). */
export interface Session {
  id: number;
  /** @format date-time */
  start: string;
  /** @format date-time */
  end: string;
  /** From the first hand's start to the last's. */
  minutes: number;
  hands: number;
  /** Tables played at. */
  tables: number;
  /** The most tables played at once. */
  most_tables: number;
  /**
   * The result in big blinds.
   * @format double
   */
  net_bb: number;
  /**
   * The sample standard deviation of its hands' results in big blinds; null for fewer than two.
   * @format double
   */
  bb_stdev: number | null;
  /**
   * The result adjusted for all-in equity, as /api/stats/ counts it.
   * @format double
   */
  ev_net_bb: number;
  /**
   * The biggest pot, in big blinds.
   * @format double
   */
  biggest_pot_bb: number;
  /** Its hands flagged to review. */
  flagged: number;
  /** Its hands with any note, tag, review state or purpose. */
  noted: number;
}

/** The hero's hands in one part of their sessions, and how they went. */
export interface SessionGroup {
  key: string;
  hands: number;
  /**
   * Their results summed in big blinds.
   * @format double
   */
  net_bb: number;
  /**
   * The sample standard deviation of their results in big blinds.
   * @format double
   */
  bb_stdev: number | null;
  /**
   * net_bb adjusted for all-in equity.
   * @format double
   */
  ev_net_bb: number;
}

/** The hero's results set against when and how they played (F1). */
export interface SessionPatterns {
  /** By whole hours into the session: "0" is the first hour, then "1", "2" and "3+". */
  hours_in: SessionGroup[];
  /** By the part of the day, in `tz`: night (0-6), morning, afternoon, evening (18-24). */
  time_of_day: SessionGroup[];
  /** By the day of the week, in `tz`: "1" is Monday, "7" Sunday. */
  weekday: SessionGroup[];
  /** By the tables played at once: "1", "2", "3" or "4+". */
  tables: SessionGroup[];
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

/** The hero's statistics over a group of their hands: all of them, a position's, a month's, or a stakes'. */
export interface StatGroup {
  /** "all", a position such as "BTN", a month such as "2026-10", or stakes as a stakes tag's value: "USD:5:10" (currency:small blind:big blind), ":100:200" for chips. */
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
  /**
   * The hero's share of the rake, in big blinds: each pot's rake split by what the players put in, so some is paid in pots lost too.
   * @format double
   */
  rake_bb: number;
  /**
   * net_bb adjusted for all-in equity: in a hand where the money went in before the river with every live hand shown, the net the hero could expect then; else the net.
   * @format double
   */
  ev_net_bb: number;
  /** Hands whose net is adjusted for all-in equity. */
  all_ins: number;
  /**
   * net_bb with the rake taken from the pots the hero won added back: their results had there been none.
   * @format double
   */
  net_before_rake_bb: number;
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
  /**
   * Only the hands in which the hero broke this check's rule, as /api/leaks/ counts it.
   *
   * * `open_limp` - open_limp
   * * `open_size` - open_size
   * * `three_bet_size` - three_bet_size
   * * `short_stack_raise` - short_stack_raise
   * * `premium_limp` - premium_limp
   * * `short_buy_in` - short_buy_in
   * @minLength 1
   */
  leak?:
    | "open_limp"
    | "open_size"
    | "three_bet_size"
    | "short_stack_raise"
    | "premium_limp"
    | "short_buy_in";
  /**
   * Only the hands the user tagged with this, e.g. cooler.
   * @minLength 1
   * @maxLength 32
   */
  note_tag?: string;
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
   * Only the hands flagged to review, or those reviewed.
   *
   * * `to_review` - to_review
   * * `reviewed` - reviewed
   * @minLength 1
   */
  review?: "to_review" | "reviewed";
  /** Only the hands of this session, by its id. */
  session?: number;
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

export interface HandsNotesListParams {
  id: number;
}

export type HandsNotesListData = HandNote[];

export interface HandsNotesCreateParams {
  id: number;
}

export type HandsNotesCreateData = HandNote;

export interface HandsNotesDestroyParams {
  id: number;
  noteId: number;
}

export type HandsNotesDestroyData = any;

export interface HandsDaysRetrieveParams {
  /**
   * The IANA time zone days begin and end in, e.g. "Europe/London".
   * @minLength 1
   */
  tz: string;
}

export type HandsDaysRetrieveData = HandCalendar;

export type HandsTagsListData = HandTag[];

export interface LeaksListParams {
  /**
   * The checks before the flop.
   *
   * * `preflop` - preflop
   * @minLength 1
   * @default "preflop"
   */
  group?: "preflop";
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

export type LeaksListData = Leak[];

export type LeaksPresetsListData = Preset[];

export type LeaksPresetsPartialUpdateData = Preset[];

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

export type ReviewRetrieveData = ReviewQueue;

export interface SessionsListParams {
  /** The pagination cursor value. */
  cursor?: string;
  /** Number of results to return per page. */
  page_size?: number;
  /**
   * Only the sessions begun from this day on.
   * @format date
   */
  since?: string;
  /**
   * The IANA time zone days are counted in; UTC if left out.
   * @minLength 1
   */
  tz?: string;
  /**
   * Only the sessions begun up to the end of this day.
   * @format date
   */
  until?: string;
}

export type SessionsListData = PaginatedSessionList;

export interface SessionsRetrieveParams {
  id: number;
}

export type SessionsRetrieveData = Session;

export interface SessionsPatternsRetrieveParams {
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

export type SessionsPatternsRetrieveData = SessionPatterns;

export interface StatsListParams {
  /**
   * One group of all the hands, or one per position, one per month in `tz`, or one per cash-game stakes (leaving out tournaments, whose blinds go up every level).
   *
   * * `none` - none
   * * `position` - position
   * * `month` - month
   * * `stakes` - stakes
   * @minLength 1
   * @default "none"
   */
  group_by?: "none" | "position" | "month" | "stakes";
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

export interface StatsPurposesListParams {
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

export type StatsPurposesListData = PurposeStat[];

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
