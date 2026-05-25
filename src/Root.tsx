import { Theme } from "@radix-ui/themes";
import { useAppStore } from "./stores/appStore";
import App from "./App";

export default function Root() {
  const theme = useAppStore((s) => s.theme);

  return (
    <Theme appearance={theme} accentColor="violet" radius="medium">
      <App />
    </Theme>
  );
}
