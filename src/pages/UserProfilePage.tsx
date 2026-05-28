import {useNavigate} from "react-router-dom";
import {Button, Card, Container, Flex, Heading, Text} from "@radix-ui/themes";
import {useAuthStore} from "../stores/authStore";

export default function UserProfilePage() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

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
                        <Text size="2"><Text weight="medium">Profile name:</Text> {user?.profile_name ?? "Unknown"}</Text>
                        <Text size="2"><Text weight="medium">Username:</Text> {user?.username ?? "Unknown"}</Text>
                        <Text size="2"><Text weight="medium">Email:</Text> {user?.email ?? "Unknown"}</Text>
                    </Flex>
                </Card>

                <Card>
                    <Flex direction="column" gap="3">
                        <Heading size="3">Client Token</Heading>
                        <Text size="2" color="gray">Placeholder token for now.</Text>
                        <Text className="client-token-placeholder" as="div">client-token-placeholder</Text>
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
