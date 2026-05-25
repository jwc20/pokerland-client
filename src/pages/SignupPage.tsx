import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, Flex, TextField } from "@radix-ui/themes";
import { useAuthStore } from "../stores/authStore";
import { signup } from "../api/client";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup(username, email, password);
      setAuth(data.token, data.user);
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
                <Text size="2" weight="medium" mb="1">Username</Text>
                <TextField.Root
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

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
                <Text size="2" weight="medium" mb="1">Password</Text>
                <TextField.Root
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && (
                <Text size="2" color="red">{error}</Text>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Sign Up"}
              </Button>
            </Flex>
          </form>
        </Box>

        <Text size="2" color="gray">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </Text>
      </Flex>
    </Container>
  );
}
