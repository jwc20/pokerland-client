import {normalizeCard} from "./cardUtils";
import type {ReplayAction, ReplayHand, ReplayStreet, StreetName} from "./types";

type RecordValue = Record<string, unknown>;

function asRecord(value: unknown): RecordValue | null {
    return typeof value === "object" && value !== null ? value as RecordValue : null;
}

function asArray(value: unknown): unknown[] {
    return Array.isArray(value) ? value : [];
}

function amount(value: unknown) {
    if (Array.isArray(value)) return Number(value[1]) || 0;
    return Number(value) || 0;
}

function actionAmount(action: RecordValue) {
    return amount(action.amount ?? action.bet ?? action.bet_to);
}

function normalizeAction(action: unknown, street: StreetName): ReplayAction | null {
    const record = asRecord(action);
    const name = record?.name;
    const type = record?.type;

    if (!record || typeof name !== "string" || typeof type !== "string") return null;

    const blind = record.blind === "small" || record.blind === "big" ? record.blind : undefined;

    return {
        street,
        type,
        player: name,
        amount: actionAmount(record),
        blind,
    };
}

function normalizeActions(actions: unknown, street: StreetName) {
    return asArray(actions).flatMap((action) => {
        const normalized = normalizeAction(action, street);
        return normalized ? [normalized] : [];
    });
}

function streetName(value: unknown): ReplayStreet["type"] | null {
    return value === "flop" || value === "turn" || value === "river" ? value : null;
}

export function createReplayHand(parsed: unknown): ReplayHand | null {
    const root = asRecord(parsed);
    const header = asRecord(root?.header);
    const info = asRecord(header?.info);
    const table = asRecord(header?.table);
    const preflop = asRecord(root?.preflop);

    if (!root || !header || !table || !preflop) return null;

    const dealtTo = asArray(preflop.dealt_to);
    const heroEntry = asArray(dealtTo[0]);
    const heroName = typeof heroEntry[0] === "string" ? heroEntry[0] : "";
    const heroCards = asArray(heroEntry[1]).flatMap((card) => {
        const normalized = normalizeCard(card);
        return normalized ? [normalized] : [];
    });

    const rawPlayers = asArray(header.players).flatMap((player) => {
        const record = asRecord(player);
        if (!record || typeof record.name !== "string") return [];

        return [{
            name: record.name,
            seat: Number(record.seat) || 0,
            visualSeat: Number(record.seat) || 0,
            chips: amount(record.chips),
            isHero: record.name === heroName,
        }];
    });
    const maxSeats = Number(table.max_seats) || rawPlayers.length;
    const heroSeat = rawPlayers.find((player) => player.isHero)?.seat ?? 1;
    const players = rawPlayers.map((player) => ({
        ...player,
        visualSeat: ((player.seat - heroSeat + maxSeats) % maxSeats) + 1,
    }));

    const streets = asArray(root.streets).flatMap((street): ReplayStreet[] => {
        const record = asRecord(street);
        const type = streetName(record?.type);
        if (!record || !type) return [];

        const cards = asArray(record.cards).flatMap((card) => {
            const normalized = normalizeCard(card);
            return normalized ? [normalized] : [];
        });

        return [{
            type,
            cards,
            actions: normalizeActions(record.actions, type),
        }];
    });

    return {
        handId: typeof info?.id === "string" ? info.id : "",
        tableName: typeof table.name === "string" ? table.name : "Unknown table",
        buttonSeat: Number(table.button) || 0,
        maxSeats,
        heroName,
        players,
        heroCards,
        blinds: normalizeActions(header.actions, "header"),
        preflopActions: normalizeActions(preflop.actions, "preflop"),
        streets,
        showdownCards: [],
    };
}
