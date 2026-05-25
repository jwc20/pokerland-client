import { Container, Heading, Text, Flex } from "@radix-ui/themes";

export default function AboutPage() {
  return (
    <Container size="2" py="6">
      <Flex direction="column" gap="4">
        <Heading size="6">About Pokerland</Heading>
        <Text size="3">
          Pokerland is a platform for learning and improving your poker game.
          We offer courses, practice tools, hand simulations, and analytics to
          help players of all levels sharpen their skills.
        </Text>
        <Text size="3">
          Built with a passion for poker strategy and data-driven improvement.
        </Text>
      </Flex>
    </Container>
  );
}
