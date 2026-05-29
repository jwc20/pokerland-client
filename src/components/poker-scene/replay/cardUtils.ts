const rankNames: Record<string, string> = {
    "1": "A",
    "11": "J",
    "12": "Q",
    "13": "K",
};

const suitNames: Record<string, string> = {
    c: "clubs",
    d: "diamonds",
    h: "hearts",
    s: "spades",
};

export function normalizeCard(value: unknown) {
    if (!Array.isArray(value) || value.length < 2) return null;

    const rawRank = String(value[0]);
    const suit = String(value[1]).toLowerCase();
    const rank = rankNames[rawRank] ?? rawRank;

    return suitNames[suit] ? `${rank}${suit}` : null;
}

export function formatCard(card: string) {
    return card.toUpperCase();
}

export function isRedCard(card?: string) {
    return card?.endsWith("h") || card?.endsWith("d");
}
