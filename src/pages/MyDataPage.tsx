import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function MyDataPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">My Data</Heading>
        <Text color="gray">View and manage your hand history and personal stats.</Text>

        <Card>
          <Heading size="3" mb="1">No Data Yet</Heading>
          <Text size="2" color="gray">
            Your hand histories and session data will appear here once you start playing.
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
