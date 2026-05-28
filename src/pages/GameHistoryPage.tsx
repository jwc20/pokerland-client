import {useEffect, useState} from "react";
import {Tabs} from "radix-ui";
import {Box, Container, Heading, Text, Flex, Card, Table, Spinner} from "@radix-ui/themes";
import {useNavigate} from "react-router-dom";
import {logApi} from "../api/client";
import {getLogs, getTableName, isPayload, nestedRecord, type GameHistoryLog} from "./gameHistoryUtils";

function getParticipantCount(log: GameHistoryLog) {
    const payload = isPayload(log.payload) ? log.payload : {};
    const parsed = nestedRecord(payload, "parsed");
    const header = parsed ? nestedRecord(parsed, "header") : null;
    const players = header?.players;
    const participants = players ?? payload.participants ?? payload.players ?? payload.seats;
    const count = payload.participant_count ?? payload.participantCount ?? payload.player_count ?? payload.playerCount;

    if (Array.isArray(participants)) return participants.length;
    if (typeof count === "number") return count;
    if (typeof count === "string" && count.trim()) return count;

    return "Unknown";
}

function getLogDate(log: GameHistoryLog) {
    const rawDate = log.submitted_at ?? log.created_at;
    if (!rawDate) return "Unknown date";

    const date = new Date(rawDate);
    return Number.isNaN(date.getTime()) ? rawDate : date.toLocaleString();
}

function LogsTable({logs}: { logs: unknown }) {
    const navigate = useNavigate();
    const rows = getLogs(logs);

    if (rows.length === 0) {
        return (
            <Card>
                <Heading size="3" mb="1">No Game History Available</Heading>
                <Text size="2" color="gray">
                    Play some hands and your game history will populate here.
                </Text>
            </Card>
        );
    }

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Table name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Participants</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows.map((log, index) => {
                    const path = log.id ? `/game-history/${log.id}` : null;

                    return (
                        <Table.Row
                            className={path ? "game-history-row" : undefined}
                            key={log.id ?? index}
                            onClick={() => {
                                if (path) navigate(path, {state: {log}});
                            }}
                            onKeyDown={(event) => {
                                if (path && (event.key === "Enter" || event.key === " ")) {
                                    event.preventDefault();
                                    navigate(path, {state: {log}});
                                }
                            }}
                            role={path ? "button" : undefined}
                            tabIndex={path ? 0 : undefined}
                        >
                            <Table.Cell>{getTableName(log)}</Table.Cell>
                            <Table.Cell>{getLogDate(log)}</Table.Cell>
                            <Table.Cell>{getParticipantCount(log)}</Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
}

function LogsPanel({logs, loading, error}: { logs: GameHistoryLog[]; loading: boolean; error: string | null }) {
    if (loading) {
        return (
            <Flex align="center" gap="2" py="4">
                <Spinner/>
                <Text color="gray">Loading game history...</Text>
            </Flex>
        );
    }

    if (error) {
        return (
            <Card>
                <Heading size="3" mb="1">Unable to Load Game History</Heading>
                <Text size="2" color="gray">{error}</Text>
            </Card>
        );
    }

    return <LogsTable logs={logs}/>;
}

export default function GameHistoryPage() {
    const [myLogs, setMyLogs] = useState<GameHistoryLog[]>([]);
    const [allLogs, setAllLogs] = useState<GameHistoryLog[]>([]);
    const [myLoading, setMyLoading] = useState(true);
    const [allLoading, setAllLoading] = useState(true);
    const [myError, setMyError] = useState<string | null>(null);
    const [allError, setAllError] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;

        async function loadLogs() {
            setMyLoading(true);
            setAllLoading(true);
            setMyError(null);
            setAllError(null);

            const [myResult, allResult] = await Promise.allSettled([
                logApi.logMyGameHistory({api_page: 1}),
                logApi.logGameHistory({api_page: 1}),
            ]);

            if (ignore) return;

            if (myResult.status === "fulfilled" && myResult.value.ok) {
                setMyLogs(getLogs(myResult.value.data));
            } else {
                setMyError("Please try again later.");
            }

            if (allResult.status === "fulfilled" && allResult.value.ok) {
                setAllLogs(getLogs(allResult.value.data));
            } else {
                setAllError("You may need staff access to view all users' game history.");
            }

            setMyLoading(false);
            setAllLoading(false);
        }

        void loadLogs();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <Container size="3" py="6">
            <Flex direction="column" gap="5">
                <Heading size="6">Game History</Heading>
                <Text color="gray">Review your past games and compare them with all logged game history.</Text>

                <Tabs.Root defaultValue="mine">
                    <Tabs.List className="game-history-tabs" aria-label="Game history views">
                        <Tabs.Trigger className="game-history-tab" value="mine">My logs</Tabs.Trigger>
                        <Tabs.Trigger className="game-history-tab" value="all">All users</Tabs.Trigger>
                    </Tabs.List>

                    <Box pt="4">
                        <Tabs.Content value="mine">
                            <LogsPanel logs={myLogs} loading={myLoading} error={myError}/>
                        </Tabs.Content>
                        <Tabs.Content value="all">
                            <LogsPanel logs={allLogs} loading={allLoading} error={allError}/>
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Flex>
        </Container>
    );
}
