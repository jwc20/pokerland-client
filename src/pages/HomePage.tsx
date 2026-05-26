import { Link } from "react-router-dom";
import { Box, Container, Heading, Text, Grid, Card, Flex } from "@radix-ui/themes";

const sections = [
  { title: "Articles", description: "Read strategy articles", path: "/articles" },
  { title: "Courses", description: "Structured learning paths", path: "/courses" },
  { title: "Practice", description: "Sharpen your skills", path: "/practice" },
  { title: "Simulations", description: "Run poker simulations", path: "/simulations" },
  { title: "Analytics", description: "Analyze your play", path: "/analytics" },
  { title: "My Data", description: "View your hand history", path: "/my-data" },
];

export default function HomePage() {
  return (
    <Container size="3" py="6">
      <Flex direction="column" gap="6">
        <Box>
          <Heading size="6" mb="2">Dashboard</Heading>
          <Text color="gray">Welcome back! Choose where to start.</Text>
        </Box>

        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {sections.map((section) => (
            <Card key={section.path} className="interactive-hover card-hover" asChild>
              <Link to={section.path} style={{ textDecoration: "none" }}>
                <Heading size="3" mb="1">{section.title}</Heading>
                <Text size="2" color="gray">{section.description}</Text>
              </Link>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
