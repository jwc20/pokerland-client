import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function PracticePage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Practice</Heading>
        <Text color="gray">Sharpen your poker skills with interactive drills.</Text>

        <Card>
          <Heading size="3" mb="1">Practice Mode</Heading>
          <Text size="2" color="gray">
            Interactive practice tools are coming soon. Stay tuned!
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
