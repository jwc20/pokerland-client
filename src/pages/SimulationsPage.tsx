import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function SimulationsPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Simulations</Heading>
        <Text color="gray">Run poker hand and range simulations.</Text>

        <Card>
          <Heading size="3" mb="1">Simulation Engine</Heading>
          <Text size="2" color="gray">
            The simulation engine is under development. Coming soon!
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
