import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function CoursesPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Courses</Heading>
        <Text color="gray">Structured learning paths to improve your game.</Text>

        <Card>
          <Heading size="3" mb="1">Courses Coming Soon</Heading>
          <Text size="2" color="gray">
            We're building comprehensive poker courses. Check back soon!
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
