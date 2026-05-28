import {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import {Card, Container, Flex, Heading, Spinner, Text} from "@radix-ui/themes";
import {logApi} from "../api/client";
import {
    getLogs,
    getTableName,
    isPayload,
    nestedRecord,
    type GameHistoryLog,
} from "./gameHistoryUtils";

function getLogFromState(state: unknown): GameHistoryLog | null {
    if (!isPayload(state)) return null;

    const log = state.log;
    return isPayload(log) ? log as unknown as GameHistoryLog : null;
}

function formatRawHandHistory(value: unknown) {
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value)) return value.join("\n");
    if (value !== undefined && value !== null) return JSON.stringify(value, null, 2);

    return "";
}

function getRawHandHistory(log: GameHistoryLog) {
    const payload = isPayload(log.payload) ? log.payload : {};
    const parsed = nestedRecord(payload, "parsed");

    return formatRawHandHistory(
        parsed?.raw_hand_history ?? payload.raw_hand_history ?? payload.rawHandHistory,
    );
}

async function findLog(id: string) {
    const results = await Promise.allSettled([
        logApi.logMyGameHistory({api_page: 1}),
        logApi.logGameHistory({api_page: 1}),
    ]);

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.ok) {
            const log = getLogs(result.value.data).find((item) => item.id === id);
            if (log) return log;
        }
    }

    return null;
}

export default function GameHistoryRawHandPage() {
    const {id} = useParams();
    const location = useLocation();
    const [log, setLog] = useState<GameHistoryLog | null>(() => getLogFromState(location.state));
    const [loading, setLoading] = useState(!log && Boolean(id));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const logId = id;

        if (log || !logId) {
            return;
        }

        let ignore = false;

        async function loadLog(selectedId: string) {
            setLoading(true);
            setError(null);

            const foundLog = await findLog(selectedId);

            if (ignore) return;

            if (foundLog) {
                setLog(foundLog);
            } else {
                setError("Unable to find this hand history. Return to the game history list and try again.");
            }

            setLoading(false);
        }

        void loadLog(logId);

        return () => {
            ignore = true;
        };
    }, [id, log]);

    const rawHandHistory = log ? getRawHandHistory(log) : "";

    return (
        <Container size="3" py="6">
            <Flex direction="column" gap="4">
                <Link className="game-history-back-link" to="/game-history">Back to game history</Link>

                <Flex direction="column" gap="1">
                    <Heading size="6">Raw Hand History</Heading>
                    {log ? <Text color="gray">{getTableName(log)}</Text> : null}
                </Flex>

                {loading ? (
                    <Flex align="center" gap="2" py="4">
                        <Spinner/>
                        <Text color="gray">Loading hand history...</Text>
                    </Flex>
                ) : error ? (
                    <Card>
                        <Heading size="3" mb="1">Unable to Load Hand History</Heading>
                        <Text size="2" color="gray">{error}</Text>
                    </Card>
                ) : rawHandHistory ? (
                    <Card>
                        <pre className="raw-hand-history">{rawHandHistory}</pre>
                    </Card>
                ) : (
                    <Card>
                        <Heading size="3" mb="1">No Raw Hand History Available</Heading>
                        <Text size="2" color="gray">This log does not include raw_hand_history.</Text>
                    </Card>
                )}
            </Flex>
        </Container>
    );
}
