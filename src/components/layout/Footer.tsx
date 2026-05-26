import {Flex, Text, Separator} from "@radix-ui/themes";
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <Flex direction="column" mt="auto">
            <Separator size="4"/>
            <Flex
                justify="between"
                align="center"
                wrap="wrap"
                gap="3"
                px="4"
                py="4"
            >
                <Text size="2" color="gray">
                    © {new Date().getFullYear()} MakeTheNut. All rights reserved.
                </Text>
                <Flex gap="4">
                    <Link
                        to="/about"
                        className="interactive-hover menu-link-hover"
                        style={{textDecoration: "none", color: "inherit"}}
                    >
                        <Text size="2" color="gray">About</Text>
                    </Link>
                    <Link
                        to="/articles"
                        className="interactive-hover menu-link-hover"
                        style={{textDecoration: "none", color: "inherit"}}
                    >
                        <Text size="2" color="gray">Articles</Text>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
}
