export type StreetName = "header" | "preflop" | "flop" | "turn" | "river";

export type CardId = string;

export type ReplayPlayer = {
    name: string;
    seat: number;
    visualSeat: number;
    chips: number;
    isHero: boolean;
};

export type ReplayAction = {
    street: StreetName;
    type: string;
    player: string;
    amount?: number;
    blind?: "small" | "big";
};

export type ReplayStreet = {
    type: Exclude<StreetName, "header" | "preflop">;
    cards: CardId[];
    actions: ReplayAction[];
};

export type ReplayShowdownCards = {
    player: string;
    cards: CardId[];
    result?: string;
    alreadyKnown?: boolean;
};

export type ReplayHand = {
    handId: string;
    tableName: string;
    buttonSeat: number;
    maxSeats: number;
    heroName: string;
    players: ReplayPlayer[];
    heroCards: CardId[];
    blinds: ReplayAction[];
    preflopActions: ReplayAction[];
    streets: ReplayStreet[];
    showdownCards: ReplayShowdownCards[];
};

export type ReplayEvent =
    | { type: "shuffle"; label: string }
    | { type: "deal-hole-card"; player: string; cardIndex: 0 | 1; card?: CardId; faceUp: boolean; label: string }
    | { type: "deal-board-card"; card: CardId; boardIndex: number; label: string }
    | { type: "reveal-hole-cards"; player: string; cards: CardId[]; label: string; alreadyKnown?: boolean }
    | { type: "move-chips-to-pot"; player: string; amount: number; label: string }
    | { type: "return-chips"; player: string; amount: number; label: string }
    | { type: "collect-pot"; player: string; amount: number; label: string }
    | { type: "show-action"; player: string; label: string }
    | { type: "muck-cards"; player: string; label: string }
    | { type: "finish"; label: string };

export type ReplayCardState = {
    id: string;
    owner?: string;
    card?: CardId;
    faceUp: boolean;
    zone: "deck" | "player" | "board" | "muck";
    index: number;
    boardIndex?: number;
};

export type ReplayChipMove = {
    id: string;
    player: string;
    amount: number;
    direction: "to-pot" | "from-pot";
};

export type ReplayViewState = {
    cards: ReplayCardState[];
    foldedPlayers: string[];
    pot: number;
    playerBets: Record<string, number>;
    chipMoves: ReplayChipMove[];
    activePlayer?: string;
    actionLabel: string;
    isComplete: boolean;
};
