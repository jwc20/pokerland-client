import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Flex, Text, Button, IconButton, Box} from "@radix-ui/themes";
import {SunIcon, MoonIcon, HamburgerMenuIcon, Cross1Icon} from "@radix-ui/react-icons";
import {useAuthStore} from "../../stores/authStore";
import {useAppStore} from "../../stores/appStore";

const navLinks = [
    {label: "Practice", path: "/practice"},
    {label: "Game History", path: "/game-history"},
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const authLogout = useAuthStore((s) => s.logout);
    const toggleTheme = useAppStore((s) => s.toggleTheme);
    const theme = useAppStore((s) => s.theme);
    const navigate = useNavigate();

    async function handleLogout() {
        await authLogout();
        navigate("/");
    }

    return (
        <Box asChild px="4" py="3" style={{borderBottom: "1px solid var(--gray-a5)"}}>
            <nav>
                {/* Desktop & mobile top bar */}
                <Flex justify="between" align="center">
                    {/* Left: Logo + site name */}
                    <Link to={isAuthenticated ? "/home" : "/"} className="button-interactive-hover menu-link-hover"
                          style={{textDecoration: "none", color: "inherit"}}>
                        <Flex align="center" gap="2">
                            <Text size="5" weight="bold">♠ MakeTheNut</Text>
                        </Flex>
                    </Link>

                    {/* Center: nav links (desktop only) */}
                    <Flex gap="4" align="center" display={{initial: "none", md: "flex"}}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="interactive-hover menu-link-hover"
                                style={{textDecoration: "none", color: "inherit"}}
                            >
                                <Text size="2" weight="medium">{link.label}</Text>
                            </Link>
                        ))}
                    </Flex>

                    {/* Right: auth + theme toggle (desktop) */}
                    <Flex gap="2" align="center" display={{initial: "none", md: "flex"}}>
                        <IconButton
                            variant="ghost"
                            size="2"
                            className="button-interactive-hover"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <MoonIcon/> : <SunIcon/>}
                        </IconButton>

                        <Flex gap="2">
                            {isAuthenticated ? (
                                <Button size="2" variant="outline" className="button-interactive-hover"
                                        onClick={handleLogout}>
                                    Log Out
                                </Button>
                            ) : (
                                <>
                                    <Button size="2" variant="outline" className="button-interactive-hover" asChild>
                                        <Link to="/login">Log In</Link>
                                    </Button>
                                    <Button size="2" className="button-interactive-hover" asChild>
                                        <Link to="/signup">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </Flex>

                    </Flex>

                    {/* Right: theme + hamburger (mobile only) */}
                    <Flex gap="2" align="center" display={{initial: "flex", md: "none"}}>
                        <IconButton
                            variant="ghost"
                            size="2"
                            className="button-interactive-hover"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <MoonIcon/> : <SunIcon/>}
                        </IconButton>

                        <IconButton
                            variant="ghost"
                            size="2"
                            className="button-interactive-hover"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <Cross1Icon/> : <HamburgerMenuIcon/>}
                        </IconButton>
                    </Flex>
                </Flex>

                {/* Mobile menu */}
                {menuOpen && (
                    <Flex
                        direction="column"
                        gap="3"
                        pt="4"
                        pb="2"
                        display={{initial: "flex", md: "none"}}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="button-interactive-hover menu-link-hover"
                                style={{textDecoration: "none", color: "inherit"}}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Text size="3" weight="medium">{link.label}</Text>
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <Button
                                size="2"
                                variant="outline"
                                className="button-interactive-hover"
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                            >
                                Log Out
                            </Button>
                        ) : (
                            <Flex gap="2">
                                <Button size="2" variant="outline" className="button-interactive-hover" asChild>
                                    <Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link>
                                </Button>
                                <Button size="2" className="button-interactive-hover" asChild>
                                    <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                )}
            </nav>
        </Box>
    );
}
