import {useState, type FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {Badge, Button, Card, Checkbox, Container, Dialog, Flex, Heading, Text, TextField} from "@radix-ui/themes";
import {CheckIcon, CopyIcon} from "@radix-ui/react-icons";
import {useAuthStore} from "../stores/authStore";
import {userApi} from "../api/client";

type ProfileUpdatePayload = Parameters<typeof userApi.userMyProfileUpdate>[0] & {
    email?: string;
    old_password?: string;
    new_password?: string;
};

export default function UserProfilePage() {
    const [copiedClientToken, setCopiedClientToken] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [emailStatus, setEmailStatus] = useState("");
    const [passwordStatus, setPasswordStatus] = useState("");
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const user = useAuthStore((s) => s.user);
    const clientToken = useAuthStore((s) => s.clientToken);
    const logout = useAuthStore((s) => s.logout);
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const navigate = useNavigate();

    async function handleCopyClientToken() {
        if (!clientToken) return;

        await navigator.clipboard.writeText(clientToken);
        setCopiedClientToken(true);
        window.setTimeout(() => setCopiedClientToken(false), 1000);
    }

    async function handleUpdateEmail(e: FormEvent) {
        e.preventDefault();

        const nextEmail = email.trim();
        if (!nextEmail) return;

        setUpdatingEmail(true);
        setEmailStatus("");

        try {
            const payload: ProfileUpdatePayload = {email: nextEmail};
            await userApi.userMyProfileUpdate(payload);
            await fetchProfile();
            setEmail("");
            setEmailDialogOpen(false);
            setEmailStatus("Email updated.");
        } catch {
            setEmailStatus("Unable to update email.");
        } finally {
            setUpdatingEmail(false);
        }
    }

    async function handleUpdatePassword(e: FormEvent) {
        e.preventDefault();

        if (!oldPassword || !newPassword || !newPasswordConfirm) return;

        if (newPassword !== newPasswordConfirm) {
            setPasswordStatus("New passwords do not match.");
            return;
        }

        setUpdatingPassword(true);
        setPasswordStatus("");

        try {
            const payload: ProfileUpdatePayload = {old_password: oldPassword, new_password: newPassword};
            await userApi.userMyProfileUpdate(payload);
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setPasswordDialogOpen(false);
            setPasswordStatus("Password updated.");
        } catch {
            setPasswordStatus("Unable to update password.");
        } finally {
            setUpdatingPassword(false);
        }
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


                <Card>
                    <Flex direction="column" gap="4">
                        <Heading size="3">Account Settings</Heading>


                        <Flex justify="between" align="center" gap="3" wrap="wrap">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="medium">Email</Text>
                                <Text size="2" color="gray">{user?.email ?? "example@email.com"}</Text>
                                {emailStatus ? <Text size="2" color="gray">{emailStatus}</Text> : null}
                            </Flex>
                            <Dialog.Root open={emailDialogOpen} onOpenChange={(open) => {
                                setEmailDialogOpen(open);
                                setEmailStatus("");
                                if (!open) setEmail("");
                            }}>
                                <Dialog.Trigger>
                                    <Button size="2" variant="outline" className="button-interactive-hover">
                                        Update
                                    </Button>
                                </Dialog.Trigger>
                                <Dialog.Content maxWidth="420px">
                                    <Dialog.Title>Update Email</Dialog.Title>
                                    <Dialog.Description size="2" color="gray">
                                        Enter the new email address for your account.
                                    </Dialog.Description>

                                    <form onSubmit={handleUpdateEmail}>
                                        <Flex direction="column" gap="4" mt="4">
                                            <label>
                                                <Text size="2" weight="medium" mb="1">Email</Text>
                                                <TextField.Root
                                                    type="email"
                                                    placeholder={user?.email ?? "example@email.com"}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </label>
                                            {emailStatus ? <Text size="2" color="red">{emailStatus}</Text> : null}
                                            <Flex justify="end" gap="2">
                                                <Dialog.Close>
                                                    <Button type="button" size="2" variant="soft">
                                                        Cancel
                                                    </Button>
                                                </Dialog.Close>
                                                <Button type="submit" size="2" disabled={updatingEmail}>
                                                    {updatingEmail ? "Updating..." : "Update"}
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </form>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Flex>

                        <Flex justify="between" align="center" gap="3" wrap="wrap">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="medium">Password</Text>
                                <Text size="2" color="gray">Change your account password.</Text>
                                {passwordStatus ? <Text size="2" color="gray">{passwordStatus}</Text> : null}
                            </Flex>
                            <Dialog.Root open={passwordDialogOpen} onOpenChange={(open) => {
                                setPasswordDialogOpen(open);
                                setPasswordStatus("");
                                if (!open) {
                                    setOldPassword("");
                                    setNewPassword("");
                                    setNewPasswordConfirm("");
                                }
                            }}>
                                <Dialog.Trigger>
                                    <Button size="2" variant="outline" className="button-interactive-hover">
                                        Change Password
                                    </Button>
                                </Dialog.Trigger>
                                <Dialog.Content maxWidth="420px">
                                    <Dialog.Title>Change Password</Dialog.Title>
                                    <Dialog.Description size="2" color="gray">
                                        Enter your current password and confirm your new password.
                                    </Dialog.Description>

                                    <form onSubmit={handleUpdatePassword}>
                                        <Flex direction="column" gap="4" mt="4">
                                            <label>
                                                <Text size="2" weight="medium" mb="1">Old Password</Text>
                                                <TextField.Root
                                                    type="password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <Text size="2" weight="medium" mb="1">New Password</Text>
                                                <TextField.Root
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <Text size="2" weight="medium" mb="1">New Password Again</Text>
                                                <TextField.Root
                                                    type="password"
                                                    value={newPasswordConfirm}
                                                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                                    required
                                                />
                                            </label>
                                            {passwordStatus ? <Text size="2" color="red">{passwordStatus}</Text> : null}
                                            <Flex justify="end" gap="2">
                                                <Dialog.Close>
                                                    <Button type="button" size="2" variant="soft">
                                                        Cancel
                                                    </Button>
                                                </Dialog.Close>
                                                <Button type="submit" size="2" disabled={updatingPassword}>
                                                    {updatingPassword ? "Changing..." : "Change Password"}
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </form>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Flex>

                        <Flex justify="between" align="center" gap="3" wrap="wrap">
                            <Flex direction="column" gap="1">
                                <Text size="2" weight="medium">Subscription</Text>
                                <Text size="2" color="gray">Access to active subscription features.</Text>
                            </Flex>
                            <Badge color={user?.is_customer ? "green" : "gray"} variant="soft">
                                {user?.is_customer ? "Active" : "Inactive"}
                            </Badge>
                        </Flex>

                        <Flex direction="column" gap="1">
                            <Flex align="center" gap="2">
                                <Checkbox defaultChecked/>
                                <Text size="2" weight="medium">Visible on public pages</Text>
                            </Flex>
                            <Text size="2" color="gray">Profile details shown to other players.</Text>
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
