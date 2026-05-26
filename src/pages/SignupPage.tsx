import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, Flex, TextField, TextArea } from "@radix-ui/themes";
import { useAuthStore } from "../stores/authStore";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({
        email,
        password,
        profile_name: profileName,
        username,
        bio,
      });
      navigate("/home");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="1" py="9">
      <Flex direction="column" gap="5" align="center">
        <Heading size="6">Sign Up</Heading>

        <Box asChild width="100%">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              <label>
                <Text size="2" weight="medium" mb="1">Email</Text>
                <TextField.Root
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                <Text size="2" weight="medium" mb="1">Username</Text>
                <TextField.Root
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label>
                <Text size="2" weight="medium" mb="1">Profile Name</Text>
                <TextField.Root
                  placeholder="Your display name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </label>

              <label>
                <Text size="2" weight="medium" mb="1">Password</Text>
                <TextField.Root
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <label>
                <Text size="2" weight="medium" mb="1">Bio</Text>
                <TextArea
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>

              {error && (
                <Text size="2" color="red">{error}</Text>
              )}

              <Button type="submit" className="interactive-hover" disabled={loading}>
                {loading ? "Creating account…" : "Sign Up"}
              </Button>
            </Flex>
          </form>
        </Box>

        <Text size="2" color="gray">
          Already have an account?{" "}
          <Link to="/login" className="interactive-hover menu-link-hover">Log in</Link>
        </Text>
      </Flex>
    </Container>
  );
}
