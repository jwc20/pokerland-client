import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function GameHistoryPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Game History</Heading>
        <Text color="gray">Review your past games and track your poker performance.</Text>

        <Card>
          <Heading size="3" mb="1">No Game History Available</Heading>
          <Text size="2" color="gray">
            Play some hands and your game history will populate here.
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
