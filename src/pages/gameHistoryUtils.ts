import type {GameLog, GameLogHistory} from "../apis/data-contracts";

export type GameHistoryLog = GameLog | GameLogHistory;
export type LogPayload = Record<string, unknown>;

export function getLogs(data: unknown): GameHistoryLog[] {
    if (Array.isArray(data)) return data;
    if (!isPayload(data)) return [];

    for (const value of [data.results, data.logs, data.data, data.items]) {
        const logs = getLogs(value);
        if (logs.length > 0 || Array.isArray(value)) return logs;
    }

    return [];
}

export function isPayload(value: unknown): value is LogPayload {
    return typeof value === "object" && value !== null;
}

export function nestedRecord(payload: LogPayload, key: string): LogPayload | null {
    const value = payload[key];
    return isPayload(value) ? value : null;
}

export function getTableName(log: GameHistoryLog) {
    const payload = isPayload(log.payload) ? log.payload : {};
    const parsed = nestedRecord(payload, "parsed");
    const header = parsed ? nestedRecord(parsed, "header") : null;
    const parsedTable = header ? nestedRecord(header, "table") : null;
    const table = nestedRecord(payload, "table");
    const name = parsedTable?.name ?? payload.table_name ?? payload.tableName ?? table?.name ?? table?.table_name;

    return typeof name === "string" && name.trim() ? name : "Unknown table";
}
