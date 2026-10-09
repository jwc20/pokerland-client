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
 * * `not_the_nut_flush` - not_the_nut_flush
 * * `low_straight` - low_straight
 * * `counterfeit_risk` - counterfeit_risk
 */
export type WarningsEnum =
  | "not_the_nut_flush"
  | "low_straight"
  | "counterfeit_risk";

/**
 * * `any` - any
 * * `overpair` - overpair
 * * `top_pair` - top_pair
 * * `two_pair_plus` - two_pair_plus
 * * `set` - set
 * * `flush_draw` - flush_draw
 * * `straight_draw` - straight_draw
 */
export type VillainKindEnum =
  | "any"
  | "overpair"
  | "top_pair"
  | "two_pair_plus"
  | "set"
  | "flush_draw"
  | "straight_draw";

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
 * * `monotone` - monotone
 * * `paired` - paired
 * * `wet` - wet
 * * `dry` - dry
 */
export type TextureEnum = "monotone" | "paired" | "wet" | "dry";

/**
 * * `mixed` - mixed
 * * `tag` - tag
 * * `lag` - lag
 * * `station` - station
 * * `rock` - rock
 * * `mine` - mine
 */
export type TableOpponentsEnum =
  | "mixed"
  | "tag"
  | "lag"
  | "station"
  | "rock"
  | "mine";

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
 * * `river` - river
 */
export type StreetEnum = "preflop" | "flop" | "turn" | "river";

/**
 * * `own_hand` - One of your hands
 * * `generated` - Generated
 * * `match` - A coached match
 * * `library` - The library
 * * `their_seat` - An opponent's seat in one of your hands
 * * `shared` - A hand shared with your class
 */
export type SourceEnum =
  | "own_hand"
  | "generated"
  | "match"
  | "library"
  | "their_seat"
  | "shared";

/**
 * * `small` - small
 * * `medium` - medium
 * * `big` - big
 * * `huge` - huge
 */
export type SizeEnum = "small" | "medium" | "big" | "huge";

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
 * * `range` - range
 */
export type QuestionKindEnum = "action" | "choice" | "range";

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
 * * `bluff_opponents` - bluff_opponents
 * * `cbet_opponents` - cbet_opponents
 * * `big_pot_bb` - big_pot_bb
 * * `deep_bb` - deep_bb
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
  | "orbit_max"
  | "bluff_opponents"
  | "cbet_opponents"
  | "big_pot_bb"
  | "deep_bb";

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
 * * `library` - The library
 * * `their_seat` - Their seat
 * * `shared` - From your classes
 * * `test` - Aptitude test
 */
export type PracticeSetKindEnum =
  | "daily"
  | "my_hands"
  | "generated"
  | "match"
  | "library"
  | "their_seat"
  | "shared"
  | "test";

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

/**
 * * `out` - out
 * * `split` - split
 * * `dirty` - dirty
 * * `danger` - danger
 * * `counterfeit` - counterfeit
 */
export type OutCardKindEnum =
  | "out"
  | "split"
  | "dirty"
  | "danger"
  | "counterfeit";

/**
 * * `tag` - Tag
 * * `lag` - Lag
 * * `rock` - Rock
 * * `station` - Station
 */
export type OpponentLabelEnum = "tag" | "lag" | "rock" | "station";

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
 * * `library` - library
 * * `their_seat` - their_seat
 * * `shared` - shared
 */
export type NewSetKindEnum =
  | "my_hands"
  | "generated"
  | "library"
  | "their_seat"
  | "shared";

/**
 * * `coach` - Coach
 * * `member` - Member
 */
export type MemberRoleEnum = "coach" | "member";

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
 * * `folded_strong` - folded_strong
 * * `missed_thin_value` - missed_thin_value
 * * `multiway_bluff` - multiway_bluff
 * * `big_pot_small_hand` - big_pot_small_hand
 * * `hands_per_orbit` - hands_per_orbit
 */
export type LeakKeyEnum =
  | "open_limp"
  | "open_size"
  | "three_bet_size"
  | "short_stack_raise"
  | "premium_limp"
  | "short_buy_in"
  | "folded_strong"
  | "missed_thin_value"
  | "multiway_bluff"
  | "big_pot_small_hand"
  | "hands_per_orbit";

/**
 * * `preflop` - preflop
 * * `postflop` - postflop
 */
export type LeakGroupEnum = "preflop" | "postflop";

/**
 * * `coach` - coach
 * * `member` - member
 */
export type LeagueRoleEnum = "coach" | "member";

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
 * * `writeup` - Writeup
 */
export type HandNoteKindEnum =
  | "note"
  | "tag"
  | "review"
  | "purpose"
  | "writeup";

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
 * * `overbet_bluff` - overbet_bluff
 * * `small_on_wet` - small_on_wet
 * * `same_chips_barrel` - same_chips_barrel
 */
export type FlagEnum = "overbet_bluff" | "small_on_wet" | "same_chips_barrel";

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
 * * `low` - Low
 * * `medium` - Medium
 * * `high` - High
 */
export type ConfidenceEnum = "low" | "medium" | "high";

/**
 * * `choice` - choice
 * * `bool` - bool
 * * `number` - number
 * * `line` - line
 */
export type ConditionKindEnum = "choice" | "bool" | "number" | "line";

export type BlankEnum = "";

/**
 * * `under_third` - under_third
 * * `third_half` - third_half
 * * `half_three_quarters` - half_three_quarters
 * * `three_quarters_pot` - three_quarters_pot
 * * `pot_plus` - pot_plus
 */
export type BetSizeEnum =
  | "under_third"
  | "third_half"
  | "half_three_quarters"
  | "three_quarters_pot"
  | "pot_plus";

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

/**
 * * `playbook` - A playbook
 * * `hand` - A hand
 */
export type AssignmentKindEnum = "playbook" | "hand";

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

/** The course's memory aid nearest a stated share of hands [MIT 4], and how much of the answer it holds. */
export interface Anchor {
  percent: number;
  range: string;
  /**
   * Combos in both ÷ combos in either.
   * @format double
   */
  overlap: number;
}

/** A shared hand as the class sees it: anonymized, so its stakes and when, but no names, table or number. */
export interface AssignedHand {
  /** Your own hand's id, for its replay; null for others'. */
  own_hand: number | null;
  game: string;
  stakes: string;
  /** @format date-time */
  played_at: string;
  write_up: string;
}

export interface AssignedPlaybook {
  id: number;
  name: string;
  version: number;
  description: string;
}

/** A playbook or hand before a class. */
export interface Assignment {
  id: number;
  kind: AssignmentKindEnum;
  /** Who assigned or shared it. */
  by_name: string;
  playbook: AssignedPlaybook | null;
  hand: AssignedHand | null;
  note: string;
  /** @format date-time */
  created: string;
  /** You put it there, or you're a coach. */
  can_withdraw: boolean;
}

export interface AssignmentRequestRequest {
  /**
   * * `playbook` - A playbook
   * * `hand` - A hand
   */
  kind: AssignmentKindEnum;
  /** A playbook of your own: coaches only. */
  playbook?: number;
  /** One of your hands, shared anonymized: by your live link to it if you have one, else a new one. */
  hand?: number;
  /**
   * @maxLength 500
   * @default ""
   */
  note?: string;
}

/** An answer to a spot: a choice, a range of hands, or a move. */
export interface AttemptRequestRequest {
  /**
   * @min 0
   * @max 3
   */
  choice?: number;
  /**
   * A range question: the hands, in range notation.
   * @maxLength 2000
   */
  hand_range?: string;
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
  scenario: number;
  set?: number | null;
}

/** A graded answer, with the spot's answer. A reflection is not graded: its grade is "ungraded". */
export interface AttemptResult {
  id: number;
  scenario: number;
  choice: number | null;
  hand_range: string;
  /** A range answer: how it met the stated range. */
  overlap: Overlap | null;
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

/** The street after a c-bet that was called [JHU 8]. */
export interface Barrel {
  street: string;
  hands: number;
  /** Bet again, out of the times they acted. */
  barrel: Stat;
  /** Checked last, in position. */
  checked_behind: Stat;
  /** Checked first, then folded to a bet, out of the checks first. */
  gave_up: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  check_call: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  check_raise: Stat;
  /** river: the third barrel's sizes. */
  sizes: SizeCount[];
}

/** The opponent of yours a bot was modelled on, from their statistics in your hands. */
export interface BasedOn {
  id: number;
  name: string;
  /** Hands with you behind the model. */
  hands: number;
}

export interface BeatenBy {
  description: string;
  combos: number;
}

export interface BoardClass {
  category: string;
  /** The best hand of the kind: "three nines", "an ace-high flush". */
  description: string;
  /** Two cards that make it. */
  cards: string[];
  /** Two-card combos that make a hand of the kind. */
  combos: number;
}

export interface BoardHero {
  description: string;
  category: string;
  /** Holdings left that beat the hero's hand. */
  better: number;
  equal: number;
  worse: number;
  /**
   * The share of holdings it beats, ties counting half.
   * @format double
   */
  beats: number | null;
  /** What beats it, the strongest first. */
  beaten_by: BeatenBy[];
  /** Omaha: from sampled holdings, there being too many to count. */
  sampled: boolean;
  warnings: WarningsEnum[];
}

/** One street's board read (A3). */
export interface BoardStreet {
  street: string;
  board: string[];
  texture: BoardTexture;
  nuts: BoardClass;
  /** The three best kinds of hand possible. */
  classes: BoardClass[];
  hero: BoardHero | null;
}

export interface BoardTexture {
  flush_possible: boolean;
  straight_possible: boolean;
  full_house_possible: boolean;
  wetness: number;
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

/** The published chart a preflop spot is graded by, and the tier of it the spot is in (practice.charts). */
export interface Chart {
  key: string;
  label: string;
  /** The stacks and table the chart is for. */
  applies_to: string;
  source: string;
  tier: string;
  /** The tier's hands, in range notation. */
  range: string;
  tier_label: string;
  /** What the lecture calls its size, rounded for teaching. */
  claimed: string;
  tier_source: string;
  /**
   * Its exact share of all 1,326 combos.
   * @format double
   */
  share: number;
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

/** Something a card's test can ask of a decision. */
export interface Condition {
  key: string;
  /**
   * * `choice` - choice
   * * `bool` - bool
   * * `number` - number
   * * `line` - line
   */
  kind: ConditionKindEnum;
  label: string;
  choices?: string[];
  /** @format double */
  low?: number;
  /** @format double */
  high?: number;
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

/** A hold'em hand against an opponent, on a board of nothing yet, a flop, turn or river. */
export interface EquityRequestRequest {
  /**
   * @maxItems 2
   * @minItems 2
   */
  hero: string[];
  /** @maxItems 5 */
  board?: string[];
  /** Who the hand is against: their cards, a range, or a kind of hand on the board. Give one. */
  villain: VillainRequest;
  /** Other cards known to be out. */
  dead?: string[];
}

export interface EquityResult {
  /**
   * The hero's share of the pot, ties split.
   * @format double
   */
  equity: number;
  /**
   * Its standard error when sampled; 0 when exact.
   * @format double
   */
  stderr: number;
  exact: boolean;
  /** The opponent's holdings counted. */
  combos: number;
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
  /** A chart's spot: moves worth half credit, such as limping a hand the chart raises. */
  acceptable?: PracticeActionEnum[];
  /** Each option's EV in bb. */
  ev_bb?: Record<string, number>;
  /** @format double */
  equity?: number;
  /** @format double */
  equity_needed?: number;
  /** The stated range the answer assumes, or a range question's answer. */
  range?: string;
  /** A preflop spot: the chart and tier it is graded by. */
  chart?: Chart;
  /** A preflop spot: your hand, as the chart names it. */
  hand?: string;
  /** A preflop spot: whether the chart plays your hand. */
  in_range?: boolean;
  /**
   * A range question: the range's share of all combos.
   * @format double
   */
  share?: number;
  /** A range question: the share stated with the spot. */
  percent?: number;
  /** The course's memory aid nearest a stated share of hands [MIT 4], and how much of the answer it holds. */
  anchor?: Anchor;
  assumptions?: string;
  advice?: Advice | null;
  rule?: RuleCard | null;
  /** Your own hand: what you did at the time. */
  you_did?: Move;
  /** Their seat: the player whose seat it was. */
  player?: string;
  /** Their seat: what they did at the time. */
  they_did?: Move;
  /** Their range: the cards they showed. */
  their_cards?: string[];
  /** Their range: those cards as a hand, 97s. */
  their_hand?: string;
  /** Their range: their hand was in the stated range. */
  in_stated?: boolean;
  result?: HandResult;
  /** The numbers behind a decision, as practice.spots works them out. Amounts are chips. */
  context?: Numbers;
}

/** How the hero's first decision before the flop went: each move's share of the group's hands. */
export interface FirstActions {
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  fold: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  check: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  call: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  raise: Stat;
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
   * * `preflop` - preflop
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   * * `hand_reading` - hand_reading
   */
  skill: PracticeSkillEnum;
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
  /**
   * The decision context of a hand (tracker.parsing.facts): the pot, stacks and board on each street, and the
   * hero's hand and lines. Hands parsed by an older parser have fewer of them.
   */
  facts: HandFacts;
  /** A tournament's blind level. */
  level: number | null;
  /** The id of the tournament it was played in, if any. */
  tournament: number | null;
  /** The opponents dealt in who have a profile, by name. */
  opponents: HandOpponent[];
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

/**
 * The decision context of a hand (tracker.parsing.facts): the pot, stacks and board on each street, and the
 * hero's hand and lines. Hands parsed by an older parser have fewer of them.
 */
export interface HandFacts {
  preflop_aggressor: string | null;
  players_at_flop: number;
  /** @format double */
  spr: number | null;
  streets: Record<string, StreetFacts>;
  hero?: HeroFacts;
  /** What a tournament hand's text says of its tournament (FND-8). Amounts are cents with a currency. */
  tournament?: TournamentFacts;
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
 * review state, the bet's purpose, or the hand's write-up. Each kind takes its own fields.
 */
export interface HandNoteWriteRequest {
  /**
   * * `note` - Note
   * * `tag` - Tag
   * * `review` - Review
   * * `purpose` - Purpose
   * * `writeup` - Writeup
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
   * note: what to say, up to 2000 characters. writeup: the hand written up for others.
   * @minLength 1
   * @maxLength 20000
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

/** An opponent in the hand, with their profile's id and label (C1). */
export interface HandOpponent {
  name: string;
  id: number;
  label: string;
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
  /** The hand's id, for its replay; null for a hand shared with your class. */
  hand: number | null;
  /** The event the decision is. */
  step: number;
  /**
   * How the hand went for you, in big blinds.
   * @format double
   */
  net_bb: number;
}

/** A hand shared by a public, read-only link. */
export interface HandShare {
  id: number;
  /** The id of one of the user's hands. */
  hand: number;
  /** The link is the web app's /s/<slug>. */
  slug: string;
  write_up?: string;
  /** Name players by position, the hero as Hero, and leave out the table and hand number. */
  anonymize?: boolean;
  revoked?: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
}

/** A hand shared by a public, read-only link. */
export interface HandShareRequest {
  /** The id of one of the user's hands. */
  hand: number;
  write_up?: string;
  /** Name players by position, the hero as Hero, and leave out the table and hand number. */
  anonymize?: boolean;
  revoked?: boolean;
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

export interface HeroFacts {
  /** The JHU starting-hand group; empty in Omaha. */
  group: string;
  /**
   * The hero's stack-to-pot ratio at the flop.
   * @format double
   */
  spr: number | null;
  /** The made hand on each street seen. */
  made: Record<string, string>;
  draws: Record<string, string[]>;
  /** The made hand on the last street seen. */
  final?: string | null;
  lines?: Record<string, HeroLine>;
  /** What their bets' sizes gave away (B4). */
  flags?: string[];
}

/** How the hero played a street after the flop. */
export interface HeroLine {
  /** Their part before the flop: raised (last), called, or limped (no raise). */
  role: string;
  /** Whether they acted last; null when nobody else could. */
  ip: boolean | null;
  players: number;
  /** monotone, paired, wet or dry. */
  texture: string;
  /** Their first move with nothing to call: bet or check. */
  first: string | null;
  /** Their answer to the first bet they faced. */
  faced: string | null;
  /** What came of their first bet: folded, called, raised. */
  outcome: string | null;
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

export interface JoinRequest {
  /**
   * The class's invite code; spaces, dashes and case don't matter.
   * @minLength 1
   * @maxLength 32
   */
  code: string;
}

export interface KnownHand {
  name: string;
  cards: string[];
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

/** A class you're in. */
export interface League {
  id: number;
  name: string;
  /** Who made it. */
  owner_name: string;
  /**
   * Your role in it.
   *
   * * `coach` - coach
   * * `member` - member
   */
  role: LeagueRoleEnum;
  /** Everyone in it, coaches included. */
  member_count: number;
  /** Playbooks and hands before it now. */
  assignment_count: number;
  /** @format date-time */
  created: string;
}

export interface LeagueCreateRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name: string;
}

/** A class: its playbooks and hands, and who's in it. A coach also sees its invite code and every member. */
export interface LeagueDetail {
  id: number;
  name: string;
  owner_name: string;
  /**
   * Your role in it.
   *
   * * `coach` - coach
   * * `member` - member
   */
  role: LeagueRoleEnum;
  /** Coaches only; null for a member. */
  invite_code: string | null;
  /** You show the coaches your practice progress. */
  shares_progress: boolean;
  member_count: number;
  /** Coaches see everyone; a member sees the coaches and themselves. */
  members: Member[];
  assignments: Assignment[];
  /** @format date-time */
  created: string;
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
   * * `folded_strong` - folded_strong
   * * `missed_thin_value` - missed_thin_value
   * * `multiway_bluff` - multiway_bluff
   * * `big_pot_small_hand` - big_pot_small_hand
   * * `hands_per_orbit` - hands_per_orbit
   */
  key: LeakKeyEnum;
  /**
   * * `preflop` - preflop
   * * `postflop` - postflop
   */
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
  /**
   * When the user last marked the check reviewed.
   * @format date-time
   */
  reviewed: string | null;
  /** Times broken in hands played since it was reviewed, or ever if it never was; null for hands per orbit. */
  new: number | null;
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

/** When the user last marked a leak check reviewed. */
export interface LeakReview {
  key: string;
  /** @format date-time */
  reviewed: string;
}

/** The hero against an opponent (C2): hands where both put money in by choice or both saw the flop. */
export interface Ledger {
  hands: number;
  /**
   * The hero's whole result in those hands, in big blinds.
   * @format double
   */
  net_bb: number;
  pots: LedgerPot[];
  biggest_won: LedgerHand[];
  biggest_lost: LedgerHand[];
}

export interface LedgerHand {
  hand: number;
  /** @format date-time */
  played_at: string;
  /** @format double */
  net_bb: number;
  /** @format double */
  pot_bb: number;
}

export interface LedgerPot {
  /**
   * small <10 BB, ... huge 100+.
   *
   * * `small` - small
   * * `medium` - medium
   * * `big` - big
   * * `huge` - huge
   */
  size: SizeEnum;
  hands: number;
  /** @format double */
  net_bb: number;
  /** @format double */
  bb_stdev: number | null;
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

/** What the hero did on a street: bet when they could bet first, and answered a bet. */
export interface LineSpot {
  hands: number;
  /** Bet, out of the times they could bet first: nothing to call. */
  bet: Stat;
  /** Folded, out of the times they faced a bet. */
  fold: Stat;
  /** Called, out of the times they faced a bet. */
  call: Stat;
  /** Raised, out of the times they faced a bet. */
  raise: Stat;
  /** The hero's part before the flop: raised, called or limped. */
  role: string;
  /** In position; null when nobody else could act. */
  ip: boolean | null;
  textures: LineTexture[];
}

export interface LineStreet {
  street: string;
  spots: LineSpot[];
}

/** What the hero did on a street: bet when they could bet first, and answered a bet. */
export interface LineTexture {
  hands: number;
  /** Bet, out of the times they could bet first: nothing to call. */
  bet: Stat;
  /** Folded, out of the times they faced a bet. */
  fold: Stat;
  /** Called, out of the times they faced a bet. */
  call: Stat;
  /** Raised, out of the times they faced a bet. */
  raise: Stat;
  /**
   * * `monotone` - monotone
   * * `paired` - paired
   * * `wet` - wet
   * * `dry` - dry
   */
  texture: TextureEnum;
}

/**
 * How the hero played the flop, turn and river by their part before the flop and position, and by texture;
 * then the turn and the river after a called c-bet (B6).
 */
export interface LinesReport {
  streets: LineStreet[];
  barrels: Barrel[];
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

/** Someone in a class. Coaches see everyone; a member sees the coaches. */
export interface Member {
  id: number;
  name: string;
  role: MemberRoleEnum;
  shares_progress: boolean;
  /** @format date-time */
  joined: string;
  you: boolean;
  /** Made the class: always a coach, and can't leave it. */
  owner: boolean;
}

/** What a coach sees of a member who shares their progress: totals only, never their hands. */
export interface MemberProgress {
  /** Their membership's id. */
  member: number;
  name: string;
  skills: SkillScore[];
  playbooks: PlaybookProgress[];
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

export interface Named {
  key: string;
  label: string;
}

export interface NewSetRequest {
  /**
   * Your own decisions, generated spots for one skill, worked examples from the lectures, your opponents' decisions in your hands, from their seat, or decisions in hands shared with your classes.
   *
   * * `my_hands` - my_hands
   * * `generated` - generated
   * * `library` - library
   * * `their_seat` - their_seat
   * * `shared` - shared
   */
  kind: NewSetKindEnum;
  /**
   * A generated set's skill.
   *
   * * `arithmetic` - arithmetic
   * * `preflop` - preflop
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   * * `hand_reading` - hand_reading
   */
  skill?: PracticeSkillEnum;
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

/** A player the user has played with: their core statistics, label and the user's net against them. */
export interface Opponent {
  id: number;
  site: string;
  name: string;
  hands: number;
  /** @format date-time */
  first_seen: string;
  /** @format date-time */
  last_seen: string;
  /**
   * In percent; null without a chance.
   * @format double
   */
  vpip: number | null;
  /** @format double */
  pfr: number | null;
  /** @format double */
  aggression: number | null;
  /**
   * The automatic label; empty with too few hands to say.
   *
   * * `tag` - Tag
   * * `lag` - Lag
   * * `rock` - Rock
   * * `station` - Station
   */
  label: OpponentLabelEnum;
  confidence: ConfidenceEnum;
  manual_label: OpponentLabelEnum;
  /** The label that counts: the user's own, else the automatic one. */
  shown_label: string;
  note: string;
  /** Hands where both put money in by choice, or both saw the flop. */
  shared_hands: number;
  /**
   * The hero's net in those hands, in big blinds.
   * @format double
   */
  hero_net_bb: number;
}

/** An opponent's profile: every statistic with its sample, their play by position, and the label's lines. */
export interface OpponentDetail {
  id: number;
  site: string;
  name: string;
  hands: number;
  /** @format date-time */
  first_seen: string;
  /** @format date-time */
  last_seen: string;
  /**
   * In percent; null without a chance.
   * @format double
   */
  vpip: number | null;
  /** @format double */
  pfr: number | null;
  /** @format double */
  aggression: number | null;
  /**
   * The automatic label; empty with too few hands to say.
   *
   * * `tag` - Tag
   * * `lag` - Lag
   * * `rock` - Rock
   * * `station` - Station
   */
  label: OpponentLabelEnum;
  confidence: ConfidenceEnum;
  manual_label: OpponentLabelEnum;
  /** The label that counts: the user's own, else the automatic one. */
  shown_label: string;
  note: string;
  /** Hands where both put money in by choice, or both saw the flop. */
  shared_hands: number;
  /**
   * The hero's net in those hands, in big blinds.
   * @format double
   */
  hero_net_bb: number;
  stats: StatSet;
  positions: OpponentPosition[];
  /**
   * The VPIP from which a player is loose, in percent.
   * @format double
   */
  loose_vpip: number;
  /**
   * The aggression from which a player is aggressive.
   * @format double
   */
  aggressive: number;
}

export interface OpponentPosition {
  position: string;
  hands: number;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  vpip: Stat;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  pfr: Stat;
}

/** A hand in which an opponent's cards were shown, and what they had done with them [JHU 4]. */
export interface OpponentShowdown {
  /** The hand's id, for its replay. */
  hand: number;
  /** @format date-time */
  played_at: string;
  position: string;
  /** Before the flop, in words: "3-bet", "raised first in", "limped", ... */
  line: string;
  cards: string[];
  /** Hold'em only: AKs, T9o, 88. */
  combo: string | null;
  /** Their hand as shown, e.g. Three of a kind. */
  shown: string | null;
  board: string[];
  /** @format double */
  net_bb: number;
  /**
   * How strong the line, how weak the cards: higher is more surprising.
   * @format double
   */
  surprise: number;
  /** Their moves on each street, counted: bets, raises, calls, checks, folds. */
  actions: Record<string, Record<string, number>>;
}

export interface OutCard {
  card: string;
  /**
   * * `out` - out
   * * `split` - split
   * * `dirty` - dirty
   * * `danger` - danger
   * * `counterfeit` - counterfeit
   */
  kind: OutCardKindEnum;
}

export interface OutsCounts {
  out?: number;
  split?: number;
  dirty?: number;
  danger?: number;
  counterfeit?: number;
}

/** The hero's outs at one of their decisions on the flop or turn (A2). */
export interface OutsDecision {
  /** The decision's index in the hand's events: its replay step. */
  event: number;
  street: string;
  board: string[];
  /** The live opponents whose cards were shown. */
  villains: KnownHand[];
  /** Live opponents whose cards weren't. */
  unknown: number;
  cards_to_come: number;
  /**
   * The hero's share of the pot as the board runs out.
   * @format double
   */
  equity: number | null;
  exact?: boolean;
  /**
   * Their share after the next card alone.
   * @format double
   */
  next_card: number | null;
  /** ahead, tied or behind, before the next card. */
  standing: string | null;
  /** The cards to come that matter, and what each does. */
  outs: OutCard[];
  counts: OutsCounts;
  /**
   * The rule of 2 and 4's estimate, in percent.
   * @format double
   */
  rule: number | null;
}

/** How a range answer met the stated range, in combos. */
export interface Overlap {
  /** In your range and the stated one. */
  both: number;
  /** In your range only. */
  extra: number;
  /** In the stated range only. */
  missed: number;
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

export interface PaginatedOpponentList {
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
  results: Opponent[];
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

export interface PaginatedTournamentList {
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
  results: Tournament[];
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

/** A hand shared by a public, read-only link. */
export interface PatchedHandShareRequest {
  /** The id of one of the user's hands. */
  hand?: number;
  write_up?: string;
  /** Name players by position, the hero as Hero, and leave out the table and hand number. */
  anonymize?: boolean;
  revoked?: boolean;
}

export interface PatchedLeagueUpdateRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name?: string;
  /** A new invite code: the old one stops working. Nobody already in it is affected. */
  new_invite?: boolean;
}

export interface PatchedMembershipUpdateRequest {
  /** Show the class's coaches your practice accuracy, playbook stages and by-the-book rates. Never your hands. */
  shares_progress?: boolean;
}

/** The user's own label for an opponent (empty for the automatic one) and their note on them. */
export interface PatchedOpponentUpdateRequest {
  manual_label?: OpponentLabelEnum | BlankEnum;
  /** @maxLength 2000 */
  note?: string;
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
  /**
   * A bluff into this many opponents or more is one too many
   * @format double
   * @min 1
   * @max 5
   */
  bluff_opponents?: number | null;
  /**
   * A c-bet into this many opponents or more is one too many
   * @format double
   * @min 2
   * @max 6
   */
  cbet_opponents?: number | null;
  /**
   * A big pot: this many big blinds or more put in
   * @format double
   * @min 10
   * @max 200
   */
  big_pot_bb?: number | null;
  /**
   * Deep stacks: an effective stack of this many big blinds or more
   * @format double
   * @min 40
   * @max 400
   */
  deep_bb?: number | null;
}

export interface PatchedRoleRequest {
  /**
   * * `coach` - coach
   * * `member` - member
   */
  role?: LeagueRoleEnum;
}

/** A range the user built and named, in range notation: "TT+, AQs+, AKo". */
export interface PatchedSavedRangeRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name?: string;
  /** @minLength 1 */
  hands?: string;
}

/** A spot the user saved: a named filter. */
export interface PatchedSavedSpotRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name?: string;
  /** Its conditions; /api/spots/fields/ lists them. */
  spec?: any;
}

/** What the hands can't tell, or tell wrongly: the field size, the payouts, and a finish, prize or entries. */
export interface PatchedTournamentUpdateRequest {
  /** @min 2 */
  field_size?: number | null;
  /**
   * First place first.
   * @maxItems 1000
   */
  payouts?: number[];
  /** @min 1 */
  entered_finish?: number | null;
  /** @min 0 */
  entered_prize?: number | null;
  /**
   * @min 1
   * @max 1000
   */
  entered_entries?: number | null;
  /** @maxLength 2000 */
  note?: string;
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

/** A Play it out table as you see it: the hand so far, your moves when it is your turn, and who the bots are. */
export interface PlayTable {
  id: number;
  hand_number: number;
  hands_played: number;
  small_blind: number;
  big_blind: number;
  /** A hand up to a decision, in the stored hands' replay format: what the client's buildReplay draws. */
  hand: TableHand;
  hand_over: boolean;
  /** @format double */
  hand_net_bb: number | null;
  /** Your moves, when it is your turn. */
  legal: Legal | null;
  seats: TableSeat[];
  /**
   * Your chips won since you sat down, in big blinds, rebuys aside.
   * @format double
   */
  result_bb: number;
  /** A table played on from a spot: where it stands. */
  spot: TableSpot | null;
}

export interface PlayTableSummary {
  id: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
  /** Hands dealt. */
  hands: number;
  players: number;
  from_spot: boolean;
}

/** A named, versioned list of rule cards: a house preset, one of your own, or one a coach assigned your class. */
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
  /** Who wrote it; null for a house preset. */
  author: string | null;
  /** Your own: you can edit it and assign it to your classes. */
  mine: boolean;
  /** Your own: the classes it is assigned to now. */
  classes: string[];
  archived: boolean;
}

/** A playbook of your own, to edit: a copy of one you can read. */
export interface PlaybookCopyRequest {
  copy_of: number;
  /**
   * @minLength 1
   * @maxLength 100
   */
  name: string;
}

/** A named, versioned list of rule cards: a house preset, one of your own, or one a coach assigned your class. */
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
  /** Who wrote it; null for a house preset. */
  author: string | null;
  /** Your own: you can edit it and assign it to your classes. */
  mine: boolean;
  /** Your own: the classes it is assigned to now. */
  classes: string[];
  archived: boolean;
  rules: RuleCard[];
  families: FamilyStage[];
  /** This is its latest version: the one to edit. */
  latest: boolean;
}

export interface PlaybookProgress {
  playbook: number;
  name: string;
  /** Their stage in each of its rule families. */
  families: FamilyStage[];
  /** One member's: how often their own hands kept each of its rules. */
  book?: BookRule[];
}

/** Your playbook's next version: its name and description, and every card, checked as the rule engine reads it. */
export interface PlaybookVersionRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /** @maxLength 1000 */
  description: string;
  /** The cards, in order: RuleCard's fields. */
  rules: Record<string, any>[];
}

/** What a coach's cards can say: the tests, families, scopes, reads, actions and exceptions the engine knows. */
export interface PlaybookVocabulary {
  conditions: Condition[];
  families: Named[];
  scopes: Named[];
  reads: Named[];
  actions: string[];
  unless: Named[];
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

/** What to practise next: the weakest skill whose range is narrow enough to trust, else the weakest tested. */
export interface PractiseNext {
  /**
   * * `arithmetic` - arithmetic
   * * `preflop` - preflop
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   * * `hand_reading` - hand_reading
   */
  skill: PracticeSkillEnum;
  label: string;
  /** Its range is narrow enough to trust. */
  trusted: boolean;
  /** Generated sets can drill it. */
  generated: boolean;
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
   * * `bluff_opponents` - bluff_opponents
   * * `cbet_opponents` - cbet_opponents
   * * `big_pot_bb` - big_pot_bb
   * * `deep_bb` - deep_bb
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

/** A shared hand as anyone with its link sees it: the replay without the owner's notes or opponents. */
export interface PublicHand {
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
  /**
   * The decision context of a hand (tracker.parsing.facts): the pot, stacks and board on each street, and the
   * hero's hand and lines. Hands parsed by an older parser have fewer of them.
   */
  facts: HandFacts;
  /** A tournament's blind level. */
  level: number | null;
}

export interface PublicShare {
  slug: string;
  write_up: string;
  anonymized: boolean;
  /** @format date-time */
  created: string;
  /** A shared hand as anyone with its link sees it: the replay without the owner's notes or opponents. */
  hand: PublicHand;
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
   * What to do, a choice of up to four, or a range of hands picked on the grid.
   *
   * * `action` - action
   * * `choice` - choice
   * * `range` - range
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

/** A Glicko rating (practice.ratings): 1,500 to start, its deviation the uncertainty, and its 95% range. */
export interface Rating {
  rating: number;
  deviation: number;
  low: number;
  high: number;
  /** Graded answers it rests on. */
  attempts: number;
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
  /** The test the card runs: {condition: value}. */
  when?: Record<string, any>;
  /** Spots it leaves out. */
  unless?: string[];
  /** What it says to do: a branch, or a list of branches each with its own test. */
  then?: any;
  /** "exact" for a card that works the price out. */
  basis?: string;
}

/** A range the user built and named, in range notation: "TT+, AQs+, AKo". */
export interface SavedRange {
  id: number;
  /** @maxLength 80 */
  name: string;
  hands: string;
  /** @format date-time */
  created: string;
}

/** A range the user built and named, in range notation: "TT+, AQs+, AKo". */
export interface SavedRangeRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name: string;
  /** @minLength 1 */
  hands: string;
}

/** A spot the user saved: a named filter. */
export interface SavedSpot {
  id: number;
  /** @maxLength 80 */
  name: string;
  /** Its conditions; /api/spots/fields/ lists them. */
  spec: any;
  /** Others import a copy with it; null until shared. */
  share_code: string | null;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
}

/** A spot the user saved: a named filter. */
export interface SavedSpotRequest {
  /**
   * @minLength 1
   * @maxLength 80
   */
  name: string;
  /** Its conditions; /api/spots/fields/ lists them. */
  spec: any;
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
  /** Null for a spot with no table, such as a toy game. */
  hand: TableHand | null;
  /** A spot with no table: its setup, in words. */
  setup?: string;
  /** A library spot: the example's name. */
  title?: string;
  /** A library spot: the lectures it comes from. */
  credit?: string;
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

/** A spot someone shared: its name and conditions, without any that name a player. */
export interface SharedSpot {
  name: string;
  spec: any;
  code: string;
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

export interface SizeBucket {
  /**
   * * `under_third` - under_third
   * * `third_half` - third_half
   * * `half_three_quarters` - half_three_quarters
   * * `three_quarters_pot` - three_quarters_pot
   * * `pot_plus` - pot_plus
   */
  key: BetSizeEnum;
  bets: number;
  /** Bets by how strong the hand was (tracker.parsing.facts.STRENGTHS). */
  strengths: Strengths;
  /** Bets with top pair or better, the nuts included, out of them all. */
  strong: Stat;
}

export interface SizeCount {
  /**
   * * `under_third` - under_third
   * * `third_half` - third_half
   * * `half_three_quarters` - half_three_quarters
   * * `three_quarters_pot` - three_quarters_pot
   * * `pot_plus` - pot_plus
   */
  key: BetSizeEnum;
  bets: number;
}

export interface SizingFlag {
  /**
   * * `overbet_bluff` - overbet_bluff
   * * `small_on_wet` - small_on_wet
   * * `same_chips_barrel` - same_chips_barrel
   */
  flag: FlagEnum;
  /** Hands with it. */
  hands: number;
  /** Hands with any bet or raise by the hero after the flop. */
  of: number;
}

/** The hero's bets and raises after the flop by street and size, split by hand strength (B4). */
export interface SizingReport {
  streets: SizingStreet[];
  flags: SizingFlag[];
}

export interface SizingStreet {
  street: string;
  bets: number;
  /** Bets with top pair or better, out of all the street's. */
  strong: Stat;
  /** Null until two sizes have ten bets each. */
  tell: SizingTell | null;
  /** Sizes with bets, the smallest first. */
  buckets: SizeBucket[];
}

/** The size whose share of strong hands sits furthest from the street's: what it says about the hand. */
export interface SizingTell {
  /**
   * * `under_third` - under_third
   * * `third_half` - third_half
   * * `half_three_quarters` - half_three_quarters
   * * `three_quarters_pot` - three_quarters_pot
   * * `pot_plus` - pot_plus
   */
  bucket: BetSizeEnum;
  /** How often the hero did something out of how often they could have, with its 95% Wilson interval. */
  strong: Stat;
  /**
   * Its share of strong hands less the street's, in percentage points.
   * @format double
   */
  gap: number;
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
  /** Its rating against the spots' difficulty, once its range is narrow enough to show. */
  rating: Rating | null;
}

/** A spot in a set, and the answer given to it in the set, if any. */
export interface Spot {
  position: number;
  /** A spot coming back from an earlier miss or an "again later". */
  review: boolean;
  scenario: Scenario;
  attempt: AttemptResult | null;
}

export interface SpotCount {
  /** The hands the spec matches, leaving out those the hero sat out. */
  hands: number;
}

export interface SpotCountRequestRequest {
  spec: any;
  /** @minLength 1 */
  tz?: string;
}

/** A condition a spot can hold, and the parameters it takes. */
export interface SpotField {
  field: string;
  params: string[];
  required: string[];
  /** The choices of each parameter that has a fixed set of them. */
  choices: Record<string, string[]>;
}

export interface SpotImportRequest {
  /**
   * @minLength 1
   * @maxLength 16
   */
  code: string;
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

/** A statistic and exactly what it counts: the stat dictionary (E5). */
export interface StatDefinition {
  key: string;
  definition: string;
}

/** The hero's statistics over a group of their hands: all of them, or one key's of /api/stats/'s `group_by`. */
export interface StatGroup {
  /** "all"; a position such as "BTN"; a month such as "2026-10"; stakes as a stakes tag's value, "USD:5:10" (currency:small blind:big blind) or ":100:200" for chips; a situation (unopened, limped, raised, 3bet, 4bet+, none); an effective stack (0-10, 10-20, 20-40, 40-100, 100+); an M zone (dead, push_fold, restealing, value, set_mining); a starting-hand group (premium, big_pair, ...) or combo (AKs); a bet size (under_third, third_half, half_three_quarters, three_quarters_pot, pot_plus); or an opponent's screen name. */
  key: string;
  hands: number;
  /** The hero's first decision before the flop. */
  first_actions: FirstActions;
  /** Raises before the flop that moved in, out of the hands the hero raised in. */
  shove: Stat;
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

export interface StreetFacts {
  /**
   * The pot as the street began, in big blinds.
   * @format double
   */
  pot_bb: number;
  /** Players still in as it began. */
  players: number;
  /**
   * The most that could still go in: the second-biggest stack in.
   * @format double
   */
  effective_bb: number;
  /** How a board reads (tracker.parsing.facts.board_texture). */
  texture: Texture;
}

/** Bets by how strong the hand was (tracker.parsing.facts.STRENGTHS). */
export interface Strengths {
  nothing: number;
  /** Eight outs or more, and no pair. */
  draw: number;
  /** A pair below top pair. */
  weak: number;
  /** Top pair or better. */
  strong: number;
  /** Nothing beat it then. */
  nuts: number;
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

export interface TableMoveRequest {
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
}

export interface TableSeat {
  seat: number;
  name: string;
  hero: boolean;
  /** What the bot is: a style, or who it was modelled on. */
  label: string;
  /** A style bot's style; empty for a modelled one. */
  style: string;
  based_on: BasedOn | null;
}

/** Where a table played on from a spot stands. */
export interface TableSpot {
  scenario: number;
  /** Your hand it plays on, for its replay. */
  hand: number;
  /** The decision it started from. */
  step: number;
  /** The others still replay what they did, your line matching theirs. */
  on_script: boolean;
}

/** A new Play it out table: from a deal, or one of your hands played on from a spot's decision. */
export interface TableStartRequest {
  /** A spot from one of your own hands: play that hand on from its decision. Else a fresh deal. */
  scenario?: number;
  /**
   * A fresh deal: seats, yours too.
   * @min 2
   * @max 9
   * @default 6
   */
  seats?: number;
  /**
   * A fresh deal: bots of one style, a mix, or modelled on your own opponents with the most hands.
   *
   * * `mixed` - mixed
   * * `tag` - tag
   * * `lag` - lag
   * * `station` - station
   * * `rock` - rock
   * * `mine` - mine
   * @default "mixed"
   */
  opponents?: TableOpponentsEnum;
  /**
   * A fresh deal: stacks.
   * @min 20
   * @max 250
   * @default 100
   */
  stack_bb?: number;
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

/** An answer to the spot a test is asking. Its grade waits for the end of the test. */
export interface TestAnswerRequest {
  /**
   * @min 0
   * @max 3
   */
  choice?: number;
  /**
   * A range question: the hands, in range notation.
   * @maxLength 2000
   */
  hand_range?: string;
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
  scenario: number;
}

/** An aptitude test once it is over: how well you decided in these spots, skill by skill. */
export interface TestReport {
  id: number;
  planned: number;
  answered: number;
  /** @format date-time */
  started: string;
  /** @format date-time */
  finished: string;
  /**
   * Time taken over the answers.
   * @format double
   */
  minutes: number | null;
  skills: TestSkill[];
  spots: TestReportSpot[];
  next: PractiseNext | null;
}

export interface TestReportSpot {
  position: number;
  scenario: Scenario;
  /** Your answer, its grade, and the spot's answer and basis. */
  attempt: AttemptResult;
}

/** A skill in the report: its accuracy in the test with its 95% range, its rating then, and the result in words. */
export interface TestSkill {
  /**
   * * `arithmetic` - arithmetic
   * * `preflop` - preflop
   * * `postflop` - postflop
   * * `push_fold` - push_fold
   * * `hand_reading` - hand_reading
   */
  skill: PracticeSkillEnum;
  label: string;
  /** Spots in the test that tested it. */
  spots: number;
  /**
   * Good answers, weighted: a rule of thumb counts half.
   * @format double
   */
  did: number;
  /** @format double */
  could: number;
  /** @format double */
  pct: number | null;
  /** @format double */
  ci_low: number | null;
  /** @format double */
  ci_high: number | null;
  /** The rating as it stood when the test ended. */
  rating: Rating | null;
  /** Its range is narrow enough to show the rating. */
  rating_shown: boolean;
  /** The result in words, with its sample: "12 spots: too few to be sure". */
  words: string;
}

export interface TestSpot {
  position: number;
  scenario: Scenario;
}

/** A test as it goes: how far it has got, and the spot it asks now, without any answers. */
export interface TestState {
  id: number;
  /** Spots in the test. */
  planned: number;
  answered: number;
  /** @format date-time */
  started: string;
  /** @format date-time */
  finished: string | null;
  /** The spot to answer now; null once the test is over. */
  spot: TestSpot | null;
}

export interface TestSummary {
  id: number;
  planned: number | null;
  answered: number;
  /** @format date-time */
  started: string;
  /** @format date-time */
  finished: string | null;
}

/** How a board reads (tracker.parsing.facts.board_texture). */
export interface Texture {
  paired: boolean;
  /** The most cards of one suit: 1 rainbow, 2 two-tone, 3 or more. */
  suited: number;
  /** Three of its ranks fit in a straight. */
  straight_possible: boolean;
  high_card: string;
  /** 0 (dry) to 3: a flush draw or flush, and a straight's ranks. */
  wetness: number;
}

export interface TimeZoneQueryRequest {
  /**
   * The IANA time zone the user's days are counted in; UTC if left out.
   * @minLength 1
   * @default "UTC"
   */
  tz?: string;
}

/** One of the hero's hands in a tournament, for the stack chart (D2). */
export interface TimelinePoint {
  id: number;
  hand_id: string;
  /** @format date-time */
  played_at: string;
  level: number | null;
  small_blind: number;
  big_blind: number;
  ante: number | null;
  players_dealt: number;
  /** The hero's chips at the start of the hand. */
  stack: number | null;
  /** @format double */
  stack_bb: number | null;
  /** @format double */
  hero_m: number | null;
  /** The M zone [MIT 5]. */
  zone: string | null;
  /** The table's average stack, for Q. */
  table_average: number | null;
  hero_net: number;
  total_pot: number;
  all_in: boolean;
  steal: boolean;
  /** @format double */
  ev_net_bb: number | null;
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

/**
 * A tournament the user played, read from its hands (FND-8), with what it returned (D1). Amounts are cents for
 * a buy-in with a currency, chips otherwise.
 */
export interface Tournament {
  id: number;
  site: string;
  tournament_id: string;
  game: string;
  hero: string;
  currency: string;
  play_money: boolean;
  freeroll: boolean;
  buy_in: number;
  fee: number;
  bounty: number;
  /** @format date-time */
  first_hand: string;
  /** @format date-time */
  last_hand: string;
  hands: number;
  max_seats: number | null;
  top_level: number | null;
  entries: number;
  finish: number | null;
  prize: number | null;
  bounties_won: number;
  knockouts: number;
  field_size: number | null;
  payouts: any;
  entered_finish: number | null;
  entered_prize: number | null;
  entered_entries: number | null;
  note: string;
  /** Its table size, and whether it has bounties. */
  kind: string;
  result: TournamentResult;
}

/**
 * A tournament the user played, read from its hands (FND-8), with what it returned (D1). Amounts are cents for
 * a buy-in with a currency, chips otherwise.
 */
export interface TournamentDetail {
  id: number;
  site: string;
  tournament_id: string;
  game: string;
  hero: string;
  currency: string;
  play_money: boolean;
  freeroll: boolean;
  buy_in: number;
  fee: number;
  bounty: number;
  /** @format date-time */
  first_hand: string;
  /** @format date-time */
  last_hand: string;
  hands: number;
  max_seats: number | null;
  top_level: number | null;
  entries: number;
  finish: number | null;
  prize: number | null;
  bounties_won: number;
  knockouts: number;
  field_size: number | null;
  payouts: any;
  entered_finish: number | null;
  entered_prize: number | null;
  entered_entries: number | null;
  note: string;
  /** Its table size, and whether it has bounties. */
  kind: string;
  result: TournamentResult;
  timeline: TimelinePoint[];
}

/** What a tournament hand's text says of its tournament (FND-8). Amounts are cents with a currency. */
export interface TournamentFacts {
  buy_in: number;
  fee: number;
  bounty: number;
  currency: string;
  level: number | null;
}

/** What a tournament returned, the user's entries counting over what was read. */
export interface TournamentResult {
  entries: number;
  finish: number | null;
  prize: number;
  /** Entries × (buy-in + fee + bounty). */
  cost: number;
  /** Prize and bounties less the cost. */
  net: number;
  /**
   * Net ÷ cost; null for a freeroll.
   * @format double
   */
  roi: number | null;
  in_the_money: boolean;
  /**
   * The finish in the field: 0 won, 1 first out.
   * @format double
   */
  percentile: number | null;
}

/** Totals over a group of tournaments: all of one kind of money, or one buy-in and format's. */
export interface TournamentTotals {
  /** "play_money", "chips", or a currency such as "USD". */
  money: string;
  /** The whole buy-in; null for all of the money's. */
  buy_in: number | null;
  /** "all", or a format such as "9-max" or "6-max knockout". */
  kind: string;
  tournaments: number;
  entries: number;
  cost: number;
  /** The fees in that cost: what the house took. */
  fees: number;
  prizes: number;
  bounties: number;
  net: number;
  /** @format double */
  roi: number | null;
  /** Finishes in the money, out of the tournaments with a finish. */
  in_the_money: Stat;
  /**
   * Where fields are known.
   * @format double
   */
  average_percentile: number | null;
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

/** Who the hand is against: their cards, a range, or a kind of hand on the board. Give one. */
export interface VillainRequest {
  /**
   * @maxItems 2
   * @minItems 2
   */
  cards?: string[];
  /**
   * Range notation, e.g. "TT+, AQs+, AKo".
   * @minLength 1
   */
  range?: string;
  /**
   * * `any` - any
   * * `overpair` - overpair
   * * `top_pair` - top_pair
   * * `two_pair_plus` - two_pair_plus
   * * `set` - set
   * * `flush_draw` - flush_draw
   * * `straight_draw` - straight_draw
   */
  kind?: VillainKindEnum;
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
   * * `folded_strong` - folded_strong
   * * `missed_thin_value` - missed_thin_value
   * * `multiway_bluff` - multiway_bluff
   * * `big_pot_small_hand` - big_pot_small_hand
   * @minLength 1
   */
  leak?:
    | "open_limp"
    | "open_size"
    | "three_bet_size"
    | "short_stack_raise"
    | "premium_limp"
    | "short_buy_in"
    | "folded_strong"
    | "missed_thin_value"
    | "multiway_bluff"
    | "big_pot_small_hand";
  /**
   * Only the hands the user tagged with this, e.g. cooler.
   * @minLength 1
   * @maxLength 32
   */
  note_tag?: string;
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
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
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
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
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export interface HandsBoardListParams {
  id: number;
}

export type HandsBoardListData = BoardStreet[];

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

export interface HandsOutsListParams {
  id: number;
}

export type HandsOutsListData = OutsDecision[];

export interface HandsDaysRetrieveParams {
  /**
   * The IANA time zone days begin and end in, e.g. "Europe/London".
   * @minLength 1
   */
  tz: string;
}

export type HandsDaysRetrieveData = HandCalendar;

export type HandsTagsListData = HandTag[];

export type LeaguesListData = League[];

export type LeaguesCreateData = LeagueDetail;

export interface LeaguesRetrieveParams {
  id: number;
}

export type LeaguesRetrieveData = LeagueDetail;

export interface LeaguesPartialUpdateParams {
  id: number;
}

export type LeaguesPartialUpdateData = LeagueDetail;

export interface LeaguesAssignmentsCreateParams {
  id: number;
}

export type LeaguesAssignmentsCreateData = Assignment;

export interface LeaguesAssignmentsDestroyParams {
  assignmentPk: number;
  id: number;
}

export type LeaguesAssignmentsDestroyData = any;

export interface LeaguesMePartialUpdateParams {
  id: number;
}

export type LeaguesMePartialUpdateData = LeagueDetail;

export interface LeaguesMeDestroyParams {
  id: number;
}

export type LeaguesMeDestroyData = any;

export interface LeaguesMembersPartialUpdateParams {
  id: number;
  memberPk: number;
}

export type LeaguesMembersPartialUpdateData = Member;

export interface LeaguesMembersDestroyParams {
  id: number;
  memberPk: number;
}

export type LeaguesMembersDestroyData = any;

export interface LeaguesProgressListParams {
  id: number;
}

export type LeaguesProgressListData = MemberProgress[];

export interface LeaguesProgressRetrieveParams {
  id: number;
  memberPk: number;
}

export type LeaguesProgressRetrieveData = MemberProgress;

export type LeaguesJoinCreateData = LeagueDetail;

export interface LeaksListParams {
  /**
   * The checks before the flop (B3's discipline checks), or after it (B5's leak alerts).
   *
   * * `preflop` - preflop
   * * `postflop` - postflop
   * @minLength 1
   * @default "preflop"
   */
  group?: "preflop" | "postflop";
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export interface LeaksReviewedCreateParams {
  key: string;
}

export type LeaksReviewedCreateData = LeakReview;

export type LeaksPresetsListData = Preset[];

export type LeaksPresetsPartialUpdateData = Preset[];

export interface OpponentsListParams {
  /** The pagination cursor value. */
  cursor?: string;
  /**
   * Only the players with this label.
   *
   * * `tag` - Tag
   * * `lag` - Lag
   * * `rock` - Rock
   * * `station` - Station
   * @minLength 1
   */
  label?: "tag" | "lag" | "rock" | "station";
  /**
   * Only the players with this many hands.
   * @min 1
   * @default 1
   */
  min_hands?: number;
  /** Number of results to return per page. */
  page_size?: number;
  /**
   * Only the names that contain this.
   * @minLength 1
   */
  search?: string;
  /**
   * Most hands together, the hero's best or worst net against them, or the most recently seen.
   *
   * * `hands` - hands
   * * `best` - best
   * * `worst` - worst
   * * `recent` - recent
   * @minLength 1
   * @default "hands"
   */
  sort?: "hands" | "best" | "worst" | "recent";
}

export type OpponentsListData = PaginatedOpponentList;

export interface OpponentsRetrieveParams {
  id: number;
}

export type OpponentsRetrieveData = OpponentDetail;

export interface OpponentsPartialUpdateParams {
  id: number;
}

export type OpponentsPartialUpdateData = OpponentDetail;

export interface OpponentsLedgerRetrieveParams {
  id: number;
}

export type OpponentsLedgerRetrieveData = Ledger;

export interface OpponentsShowdownsListParams {
  id: number;
}

export type OpponentsShowdownsListData = OpponentShowdown[];

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

export type PracticePlaybooksCreateData = PlaybookDetail;

export interface PracticePlaybooksRetrieveParams {
  id: number;
}

export type PracticePlaybooksRetrieveData = PlaybookDetail;

export interface PracticePlaybooksUpdateParams {
  id: number;
}

export type PracticePlaybooksUpdateData = PlaybookDetail;

export interface PracticePlaybooksDestroyParams {
  id: number;
}

export type PracticePlaybooksDestroyData = any;

export type PracticePlaybooksVocabularyRetrieveData = PlaybookVocabulary;

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

export type PracticeTablesListData = PlayTableSummary[];

export type PracticeTablesCreateData = PlayTable;

export interface PracticeTablesRetrieveParams {
  id: number;
}

export type PracticeTablesRetrieveData = PlayTable;

export interface PracticeTablesActCreateParams {
  id: number;
}

export type PracticeTablesActCreateData = PlayTable;

export interface PracticeTablesNextCreateParams {
  id: number;
}

export type PracticeTablesNextCreateData = PlayTable;

export type PracticeTestsListData = TestSummary[];

export type PracticeTestsCreateData = TestState;

export interface PracticeTestsRetrieveParams {
  id: number;
}

export type PracticeTestsRetrieveData = TestReport;

export interface PracticeTestsAnswerCreateParams {
  id: number;
}

export type PracticeTestsAnswerCreateData = TestState;

export interface PracticeTestsEndCreateParams {
  id: number;
}

export type PracticeTestsEndCreateData = TestState;

export interface PracticeTestsNextRetrieveParams {
  id: number;
}

export type PracticeTestsNextRetrieveData = TestState;

export interface PublicSharesRetrieveParams {
  slug: string;
}

export type PublicSharesRetrieveData = PublicShare;

export type RangesListData = SavedRange[];

export type RangesCreateData = SavedRange;

export interface RangesRetrieveParams {
  id: number;
}

export type RangesRetrieveData = SavedRange;

export interface RangesPartialUpdateParams {
  id: number;
}

export type RangesPartialUpdateData = SavedRange;

export interface RangesDestroyParams {
  id: number;
}

export type RangesDestroyData = any;

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
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export type SharesListData = HandShare[];

export type SharesCreateData = HandShare;

export interface SharesRetrieveParams {
  id: number;
}

export type SharesRetrieveData = HandShare;

export interface SharesPartialUpdateParams {
  id: number;
}

export type SharesPartialUpdateData = HandShare;

export interface SharesDestroyParams {
  id: number;
}

export type SharesDestroyData = any;

export type SpotsListData = SavedSpot[];

export type SpotsCreateData = SavedSpot;

export interface SpotsRetrieveParams {
  id: number;
}

export type SpotsRetrieveData = SavedSpot;

export interface SpotsPartialUpdateParams {
  id: number;
}

export type SpotsPartialUpdateData = SavedSpot;

export interface SpotsDestroyParams {
  id: number;
}

export type SpotsDestroyData = any;

export interface SpotsShareCreateParams {
  id: number;
}

export type SpotsShareCreateData = SavedSpot;

export type SpotsCountCreateData = SpotCount;

export type SpotsFieldsListData = SpotField[];

export type SpotsImportCreateData = SavedSpot;

export interface SpotsSharedRetrieveParams {
  code: string;
}

export type SpotsSharedRetrieveData = SharedSpot;

export interface StatsListParams {
  /**
   * One group of all the hands, or one per: position; month in `tz`; cash-game stakes (leaving out tournaments, whose blinds go up every level); preflop situation; effective stack (0-10, 10-20, 20-40, 40-100 or 100+ big blinds); M zone (tournaments); starting-hand group or combo (hold'em); the size of the hero's biggest bet or raise after the flop (hands without one left out); or opponent dealt in, a hand counting for each of its opponents.
   *
   * * `none` - none
   * * `position` - position
   * * `month` - month
   * * `stakes` - stakes
   * * `situation` - situation
   * * `stack_depth` - stack_depth
   * * `m_zone` - m_zone
   * * `hand_group` - hand_group
   * * `combo` - combo
   * * `bet_size` - bet_size
   * * `opponent` - opponent
   * @minLength 1
   * @default "none"
   */
  group_by?:
    | "none"
    | "position"
    | "month"
    | "stakes"
    | "situation"
    | "stack_depth"
    | "m_zone"
    | "hand_group"
    | "combo"
    | "bet_size"
    | "opponent";
  /**
   * group_by=opponent: the opponents the hero played most hands with, so many of them.
   * @min 1
   * @max 500
   * @default 50
   */
  limit?: number;
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export type StatsDictionaryListData = StatDefinition[];

export interface StatsLinesRetrieveParams {
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export type StatsLinesRetrieveData = LinesReport;

export interface StatsPurposesListParams {
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export interface StatsSizingRetrieveParams {
  /** Only the hands this opponent was dealt into. */
  opponent?: number;
  /**
   * Only the hands played from this day on, in `tz`.
   * @format date
   */
  since?: string;
  /**
   * Only the hands a spot spec matches, as JSON: {"all": [...]}, {"any": [...]}, {"not": spec} or a condition such as {"field": "position", "value": ["BTN"]}. /api/spots/fields/ lists the conditions.
   * @minLength 1
   */
  spec?: string;
  /** Only the hands one of the user's spots matches. */
  spot?: number;
  /** Only the hands every one of these tags counts: their `key`s in /api/hands/tags/. Repeatable. */
  tag?: string[];
  /** Only the hands of this tournament, by its id. */
  tournament?: number;
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

export type StatsSizingRetrieveData = SizingReport;

export type ToolsEquityCreateData = EquityResult;

export interface TournamentsListParams {
  /** The pagination cursor value. */
  cursor?: string;
  /** Number of results to return per page. */
  page_size?: number;
  /**
   * Only the tournaments begun from this day on.
   * @format date
   */
  since?: string;
  /** @minLength 1 */
  tz?: string;
  /**
   * Only the tournaments begun up to the end of this day.
   * @format date
   */
  until?: string;
}

export type TournamentsListData = PaginatedTournamentList;

export interface TournamentsRetrieveParams {
  id: number;
}

export type TournamentsRetrieveData = TournamentDetail;

export interface TournamentsPartialUpdateParams {
  id: number;
}

export type TournamentsPartialUpdateData = TournamentDetail;

export interface TournamentsSummaryListParams {
  /**
   * Only the tournaments begun from this day on.
   * @format date
   */
  since?: string;
  /** @minLength 1 */
  tz?: string;
  /**
   * Only the tournaments begun up to the end of this day.
   * @format date
   */
  until?: string;
}

export type TournamentsSummaryListData = TournamentTotals[];

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
