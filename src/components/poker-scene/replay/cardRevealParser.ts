type RevealStage = "hole_cards" | "flop" | "turn" | "river" | "showdown" | "summary";

type RevealTimelineEvent = {
    order: number;
    stage: RevealStage;
    type: "hero_hole_cards" | "community_cards" | "showdown_cards" | "mucked_cards";
    sourceLine: string;
    lineIndex: number;
    player?: string;
    cards?: string[];
    newCards?: string[];
    previousBoard?: string[];
    boardAfterEvent?: string[];
    handDescription?: string;
    alreadyKnown?: boolean;
};

export type CardRevealOrder = {
    handId: string;
    game: string;
    table: string;
    buttonSeat: number | null;
    hero: string;
    board: string[];
    streets: {
        holeCards: { hero: { player: string; cards: string[] } | null };
        flop: string[];
        turn: string[];
        river: string[];
        showdown: Array<{
            player: string;
            cards: string[] | null;
            result?: string;
            alreadyKnown?: boolean;
        }>;
    };
    revealTimeline: RevealTimelineEvent[];
    warnings: string[];
};

const cardPattern = /^[2-9TJQKA][cdhs]$/;

function parseCards(value: string) {
    return value.trim().split(/\s+/).filter(Boolean);
}

function validCards(cards: string[]) {
    return cards.every((card) => cardPattern.test(card));
}

function sameCards(left: string[], right: string[]) {
    return left.length === right.length && left.every((card, index) => card === right[index]);
}

function markerStage(line: string): RevealStage | null {
    if (line.startsWith("*** HOLE CARDS ***")) return "hole_cards";
    if (line.startsWith("*** FLOP ***")) return "flop";
    if (line.startsWith("*** TURN ***")) return "turn";
    if (line.startsWith("*** RIVER ***")) return "river";
    if (line.startsWith("*** SHOW DOWN ***")) return "showdown";
    if (line.startsWith("*** SUMMARY ***")) return "summary";

    return null;
}

export function parseCardRevealOrder(rawHandHistory: string): CardRevealOrder {
    const lines = rawHandHistory
        .split(/\r?\n/)
        .map((line, index) => ({line: line.trim(), index}))
        .filter(({line}) => line.length > 0);
    const warnings: string[] = [];
    const timeline: RevealTimelineEvent[] = [];
    const board: string[] = [];
    const showdown: CardRevealOrder["streets"]["showdown"] = [];
    let currentStage: RevealStage | null = null;
    let hero = "";
    let heroCards: string[] = [];
    let flop: string[] = [];
    let turn: string[] = [];
    let river: string[] = [];

    const header = lines[0]?.line ?? "";
    const handId = header.match(/Hand #(\d+)/)?.[1] ?? "";
    const game = header.match(/:\s+(.+?)\s+-\s+/)?.[1] ?? "";
    const tableLine = lines.find(({line}) => line.startsWith("Table "))?.line ?? "";
    const table = tableLine.match(/^Table '([^']+)'/)?.[1] ?? "";
    const buttonSeat = tableLine.match(/Seat #(\d+) is the button/)?.[1];

    function push(event: Omit<RevealTimelineEvent, "order">) {
        timeline.push({...event, order: timeline.length + 1});
    }

    for (const {line, index} of lines) {
        const stage = markerStage(line);
        if (stage) currentStage = stage;

        if (stage === "summary") break;

        if (stage === "flop") {
            const match = line.match(/^\*\*\* FLOP \*\*\* \[([^\]]+)\]/);
            if (!match) continue;

            flop = parseCards(match[1]);
            if (flop.length !== 3) warnings.push(`Flop should contain exactly 3 cards at line ${index}.`);
            if (!validCards(flop)) warnings.push(`Invalid flop card format at line ${index}.`);

            board.splice(0, board.length, ...flop);
            push({
                stage: "flop",
                type: "community_cards",
                sourceLine: line,
                lineIndex: index,
                cards: [...flop],
                newCards: [...flop],
                boardAfterEvent: [...board],
            });
            continue;
        }

        if (stage === "turn") {
            const match = line.match(/^\*\*\* TURN \*\*\* \[([^\]]+)\] \[([^\]]+)\]/);
            if (!match) continue;

            const previousBoard = parseCards(match[1]);
            turn = parseCards(match[2]);
            if (!sameCards(previousBoard, board)) warnings.push(`Turn previous board does not match known board at line ${index}.`);
            if (turn.length !== 1) warnings.push(`Turn should reveal exactly 1 card at line ${index}.`);
            if (!validCards(turn)) warnings.push(`Invalid turn card format at line ${index}.`);

            board.splice(0, board.length, ...previousBoard, ...turn);
            push({
                stage: "turn",
                type: "community_cards",
                sourceLine: line,
                lineIndex: index,
                previousBoard,
                cards: [...board],
                newCards: [...turn],
                boardAfterEvent: [...board],
            });
            continue;
        }

        if (stage === "river") {
            const match = line.match(/^\*\*\* RIVER \*\*\* \[([^\]]+)\] \[([^\]]+)\]/);
            if (!match) continue;

            const previousBoard = parseCards(match[1]);
            river = parseCards(match[2]);
            if (!sameCards(previousBoard, board)) warnings.push(`River previous board does not match known board at line ${index}.`);
            if (river.length !== 1) warnings.push(`River should reveal exactly 1 card at line ${index}.`);
            if (!validCards(river)) warnings.push(`Invalid river card format at line ${index}.`);

            board.splice(0, board.length, ...previousBoard, ...river);
            push({
                stage: "river",
                type: "community_cards",
                sourceLine: line,
                lineIndex: index,
                previousBoard,
                cards: [...board],
                newCards: [...river],
                boardAfterEvent: [...board],
            });
            continue;
        }

        if (currentStage === "hole_cards") {
            const match = line.match(/^Dealt to (.+?) \[([^\]]+)\]/);
            if (!match) continue;

            hero = match[1];
            heroCards = parseCards(match[2]);
            if (!validCards(heroCards)) warnings.push(`Invalid hero card format at line ${index}.`);

            push({
                stage: "hole_cards",
                type: "hero_hole_cards",
                sourceLine: line,
                lineIndex: index,
                player: hero,
                cards: [...heroCards],
            });
            continue;
        }

        if (currentStage === "showdown") {
            const shown = line.match(/^(.+?): shows \[([^\]]+)\](?: \((.+)\))?/);
            if (shown) {
                const player = shown[1];
                const cards = parseCards(shown[2]);
                const alreadyKnown = player === hero && sameCards(cards, heroCards);
                if (!validCards(cards)) warnings.push(`Invalid showdown card format at line ${index}.`);

                showdown.push({player, cards, result: shown[3], alreadyKnown});
                push({
                    stage: "showdown",
                    type: "showdown_cards",
                    sourceLine: line,
                    lineIndex: index,
                    player,
                    cards,
                    handDescription: shown[3],
                    alreadyKnown,
                });
                continue;
            }

            const mucked = line.match(/^(.+?): mucks hand/);
            if (mucked) {
                showdown.push({player: mucked[1], cards: null});
                push({
                    stage: "showdown",
                    type: "mucked_cards",
                    sourceLine: line,
                    lineIndex: index,
                    player: mucked[1],
                });
            }
        }
    }

    if (board.length !== 0 && board.length !== 3 && board.length !== 4 && board.length !== 5) {
        warnings.push(`Unexpected final board size: ${board.length}.`);
    }

    return {
        handId,
        game,
        table,
        buttonSeat: buttonSeat ? Number(buttonSeat) : null,
        hero,
        board,
        streets: {
            holeCards: {hero: hero ? {player: hero, cards: heroCards} : null},
            flop,
            turn,
            river,
            showdown,
        },
        revealTimeline: timeline,
        warnings,
    };
}
