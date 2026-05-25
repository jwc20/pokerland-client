import { Container, Heading, Text, Flex, Card } from "@radix-ui/themes";

export default function ArticlesPage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="5">
        <Heading size="6">Articles</Heading>
        <Text color="gray">Explore poker strategy articles and guides.</Text>

        <Card>
          <Heading size="3" mb="1">Coming Soon</Heading>
          <Text size="2" color="gray">
            Articles will be loaded from the backend. Check back soon for strategy content.
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}
