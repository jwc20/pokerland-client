import {Link} from "react-router-dom";
import {Container, Heading, Text, Button, Flex} from "@radix-ui/themes";

export default function LandingPage() {
    return (
        <Container size="3" py="9">
            <Flex direction="column" align="center" gap="6">
                <Heading size="8" align="center">
                    Welcome to MakeTheNut
                </Heading>
                <Text size="4" color="gray" align="center" style={{maxWidth: 480}}>
                    Learn, practice, and master poker with game history, courses,
                    simulations, and more.
                </Text>
                <Flex gap="3" wrap="wrap" justify="center">
                    <Button size="3" className="interactive-hover" asChild>
                        <Link to="/signup">Get Started</Link>
                    </Button>
                    <Button size="3" variant="outline" className="interactive-hover" asChild>
                        <Link to="/login">Log In</Link>
                    </Button>
                </Flex>
            </Flex>
        </Container>
    );
}
