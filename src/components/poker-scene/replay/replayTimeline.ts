import {formatCard} from "./cardUtils";
import type {ReplayAction, ReplayEvent, ReplayHand} from "./types";

function actionLabel(action: ReplayAction) {
    if (action.type === "blind") return `${action.player} posts ${action.blind} blind ${action.amount}`;
    if (action.amount) return `${action.player} ${action.type.replace("_", " ")} ${action.amount}`;

    return `${action.player} ${action.type.replace("_", " ")}`;
}

function eventForAction(action: ReplayAction): ReplayEvent[] {
    const label = actionLabel(action);

    if (["blind", "call", "bet", "raise"].includes(action.type) && action.amount) {
        return [{type: "move-chips-to-pot", player: action.player, amount: action.amount, label}];
    }

    if (action.type === "return_bet" && action.amount) {
        return [{type: "return-chips", player: action.player, amount: action.amount, label}];
    }

    if (action.type === "collect_pot" && action.amount) {
        return [{type: "collect-pot", player: action.player, amount: action.amount, label}];
    }

    if (action.type === "fold") {
        return [
            {type: "show-action", player: action.player, label},
            {type: "muck-cards", player: action.player, label: `${action.player} mucks cards`},
        ];
    }

    return [{type: "show-action", player: action.player, label}];
}

export function createReplayTimeline(hand: ReplayHand): ReplayEvent[] {
    const events: ReplayEvent[] = [{type: "shuffle", label: "Shuffle deck"}];

    for (const cardIndex of [0, 1] as const) {
        for (const player of hand.players) {
            const card = player.isHero ? hand.heroCards[cardIndex] : undefined;
            events.push({
                type: "deal-hole-card",
                player: player.name,
                cardIndex,
                card,
                faceUp: player.isHero,
                label: player.isHero && card ? `Deal ${formatCard(card)} to ${player.name}` : `Deal card to ${player.name}`,
            });
        }
    }

    for (const action of [...hand.blinds, ...hand.preflopActions]) {
        events.push(...eventForAction(action));
    }

    let boardIndex = 0;
    for (const street of hand.streets) {
        for (const card of street.cards) {
            events.push({type: "deal-board-card", card, boardIndex, label: `Deal ${street.type} ${formatCard(card)}`});
            boardIndex += 1;
        }

        for (const action of street.actions) {
            events.push(...eventForAction(action));
        }
    }

    for (const showdown of hand.showdownCards) {
        events.push({
            type: "reveal-hole-cards",
            player: showdown.player,
            cards: showdown.cards,
            alreadyKnown: showdown.alreadyKnown,
            label: `${showdown.player} shows ${showdown.cards.map(formatCard).join(" ")}`,
        });
    }

    events.push({type: "finish", label: "Replay complete"});

    return events;
}
