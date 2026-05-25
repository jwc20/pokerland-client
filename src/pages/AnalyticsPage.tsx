import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function AnalyticsPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Analytics</Heading>
        <Text color="gray">Analyze your poker performance with detailed stats.</Text>

        <Card>
          <Heading size="3" mb="1">No Analytics Available</Heading>
          <Text size="2" color="gray">
            Play some hands and your analytics dashboard will populate here.
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
