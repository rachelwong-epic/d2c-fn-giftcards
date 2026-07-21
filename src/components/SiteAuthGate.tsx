import { useState, type FormEvent, type ReactNode } from "react";
import Button from "@eds/react/Button";
import Text from "@eds/react/Text";
import TextField from "@eds/react/TextField";
import { themeVars } from "@eds/react";

const AUTH_STORAGE_KEY = "d2c-fn-giftcards-auth";
const EXPECTED_USER = import.meta.env.VITE_SITE_USER ?? "epic";
const EXPECTED_PASS = import.meta.env.VITE_SITE_PASSWORD ?? "FnGift#2026!";

function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

type SiteAuthGateProps = {
  children: ReactNode;
};

export default function SiteAuthGate({ children }: SiteAuthGateProps) {
  const [unlocked, setUnlocked] = useState(isAuthenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) {
    return children;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username === EXPECTED_USER && password === EXPECTED_PASS) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
      } catch {
        // Ignore storage failures; still unlock this session in memory.
      }
      setError(false);
      setUnlocked(true);
      return;
    }
    setError(true);
  }

  return (
    <div
      className="flex min-h-dvh items-center justify-center p-6"
      style={{ backgroundColor: themeVars.color.background.default }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-6 p-8"
        style={{
          backgroundColor: themeVars.color.background.elevated.low,
          borderRadius: themeVars.size.borderRadius[16],
        }}
      >
        <div className="flex flex-col gap-2">
          <Text variant="headingLG" as="h1">
            Sign in to preview
          </Text>
          <Text variant="uiMD" color="secondary">
            Enter the shared username and password to view this prototype.
          </Text>
        </div>

        <div className="flex flex-col gap-4">
          <TextField
            label="Username"
            size="lg"
            autoComplete="username"
            value={username}
            onChange={setUsername}
          />
          <TextField
            label="Password"
            size="lg"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
          {error ? (
            <Text variant="uiSM" color="critical">
              Username or password is incorrect.
            </Text>
          ) : null}
        </div>

        <Button variant="cta" size="lg" type="submit" fullWidth>
          Continue
        </Button>
      </form>
    </div>
  );
}
