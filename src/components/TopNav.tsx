import Button from "@eds/react/Button";
import IconButton from "@eds/react/IconButton";
import Text from "@eds/react/Text";
import ChevronDownIcon from "@eds/react/icons/ChevronDownIcon";
import ArrowLeftIcon from "@eds/react/icons/ArrowLeftIcon";
import { themeVars } from "@eds/react";
import epicShield from "../assets/figma/shield.svg";

type TopNavProps = {
  /** Prototype-only back control — floats in left padding, does not shift layout */
  onBack?: () => void;
};

export default function TopNav({ onBack }: TopNavProps) {
  return (
    <header
      className="sticky top-0 z-20 w-full backdrop-blur-[50px]"
      style={{ backgroundColor: themeVars.color.background.default }}
    >
      <div className="relative mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6 lg:px-20 xl:px-40">
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <div className="relative size-8 shrink-0">
            {onBack ? (
              <span className="absolute inset-y-0 right-full mr-2 flex items-center">
                <IconButton
                  variant="ghost"
                  size="lg"
                  aria-label="Back"
                  icon={<ArrowLeftIcon />}
                  onClick={onBack}
                />
              </span>
            ) : null}
            <img
              src={epicShield}
              alt="Epic Games"
              className="size-full object-contain"
              width={32}
              height={32}
            />
          </div>
          <Text variant="uiMD" as="span" className="font-medium tracking-wide uppercase">
            Store
          </Text>
        </div>

        <nav className="hidden items-center sm:flex" aria-label="Primary">
          <button
            type="button"
            className="rounded-lg px-4 py-2"
            style={{ color: themeVars.color.foreground.primary }}
          >
            <Text variant="uiMD" as="span">
              Support
            </Text>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg py-2 pl-4 pr-3"
            style={{ color: themeVars.color.foreground.primary }}
          >
            <Text variant="uiMD" as="span">
              Distribute
            </Text>
            <ChevronDownIcon aria-hidden />
          </button>
        </nav>
      </div>

      <Button variant="cta" size="md">
        Download
      </Button>
      </div>
    </header>
  );
}
