import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, Flex, TextField } from "@radix-ui/themes";
import { useAuthStore } from "../stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/home");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="1" py="9">
      <Flex direction="column" gap="5" align="center">
        <Heading size="6">Log In</Heading>

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
                <Text size="2" weight="medium" mb="1">Password</Text>
                <TextField.Root
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && (
                <Text size="2" color="red">{error}</Text>
              )}

              <Button type="submit" className="interactive-hover" disabled={loading}>
                {loading ? "Logging in…" : "Log In"}
              </Button>
            </Flex>
          </form>
        </Box>

        <Text size="2" color="gray">
          Don't have an account?{" "}
          <Link to="/signup" className="interactive-hover menu-link-hover">Sign up</Link>
        </Text>
      </Flex>
    </Container>
  );
}
