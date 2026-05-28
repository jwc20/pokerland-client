import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Container, Flex, Heading, Text} from "@radix-ui/themes";
import {CheckIcon, CopyIcon} from "@radix-ui/react-icons";
import {useAuthStore} from "../stores/authStore";

export default function UserProfilePage() {
    const [copiedClientToken, setCopiedClientToken] = useState(false);
    const user = useAuthStore((s) => s.user);
    const clientToken = useAuthStore((s) => s.clientToken);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    async function handleCopyClientToken() {
        if (!clientToken) return;

        await navigator.clipboard.writeText(clientToken);
        setCopiedClientToken(true);
        window.setTimeout(() => setCopiedClientToken(false), 1000);
    }

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    return (
        <Container size="2" py="6">
            <Flex direction="column" gap="5">
                <Flex direction="column" gap="1">
                    <Heading size="6">User Profile</Heading>
                    <Text color="gray">Manage your account and client access.</Text>
                </Flex>

                <Card>
                    <Flex direction="column" gap="3">
                        <Heading size="3">Account</Heading>
                        <Text size="2"><Text weight="medium">Profile name:</Text> {user?.profile_name ?? "Unknown"}
                        </Text>
                        <Text size="2"><Text weight="medium">Username:</Text> {user?.username ?? "Unknown"}</Text>
                        <Text size="2"><Text weight="medium">Email:</Text> {user?.email ?? "Unknown"}</Text>
                    </Flex>
                </Card>

                <Card>
                    <Flex direction="column" gap="3">
                        <Heading size="3">Client Token</Heading>
                        <Text size="2" color="gray">Client token from your latest login or signup.</Text>
                        <Flex gap="2" align="center" wrap="wrap">
                            <Text className="client-token-placeholder" as="div">{clientToken ?? "Unavailable"}</Text>
                            <Button
                                size="2"
                                variant="outline"
                                className="button-interactive-hover"
                                onClick={handleCopyClientToken}
                                disabled={!clientToken}
                                aria-label="Copy client token"
                            >
                                {copiedClientToken ? <CheckIcon/> : <CopyIcon/>}
                            </Button>
                        </Flex>
                    </Flex>
                </Card>

                <Flex justify="end">
                    <Button size="2" variant="outline" className="button-interactive-hover" onClick={handleLogout}>
                        Log Out
                    </Button>
                </Flex>
            </Flex>
        </Container>
    );
}
