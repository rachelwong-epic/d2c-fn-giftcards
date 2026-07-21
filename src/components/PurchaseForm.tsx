import { useState, type ReactNode } from "react";
import Button from "@eds/react/Button";
import Text from "@eds/react/Text";
import TextField from "@eds/react/TextField";
import Link from "@eds/react/Link";
import Toggle from "@eds/react/Toggle";
import ToggleGroup from "@eds/react/ToggleGroup";
import Select from "@eds/react/Select";
import Radio from "@eds/react/Radio";
import RadioGroup from "@eds/react/RadioGroup";
import UserIcon from "@eds/react/icons/UserIcon";
import UsersIcon from "@eds/react/icons/UsersIcon";
import EnvelopeIcon from "@eds/react/icons/EnvelopeIcon";
import LinkIcon from "@eds/react/icons/LinkIcon";
import ExclamationTriangleFilledIcon from "@eds/react/icons/ExclamationTriangleFilledIcon";
import { themeVars } from "@eds/react";
import "../App.css";

type MessageOption = { label: string; value: string };

const MESSAGE_OPTIONS: MessageOption[] = [
  { label: "Enjoy the gift!", value: "enjoy-the-gift" },
  { label: "Game On!", value: "game-on" },
  { label: "Time to celebrate!", value: "time-to-celebrate" },
  { label: "Have fun!", value: "have-fun" },
  { label: "Happy Birthday!", value: "happy-birthday" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  cad: "$",
  eur: "€",
  gbp: "£",
};

const AMOUNT_PRESETS = ["15", "30", "50", "100"] as const;

function exclusiveSelection(prev: string[], next: string[]): string[] {
  if (next.length === 0) return prev;
  const added = next.find((value) => !prev.includes(value));
  return added ? [added] : [next[next.length - 1]];
}

const deliveryCardStyle = {
  backgroundColor: themeVars.color.background.fill.faint,
  border: `1px solid ${themeVars.color.border.subtle}`,
  borderRadius: themeVars.selection.radius.parent.xl,
  padding: themeVars.size.dimension[16],
} as const;

type PurchaseFormProps = {
  /** Rendered between the page intro and “Who is this for?” (used on small screens). */
  designSlot?: ReactNode;
  onContinueToCheckout?: () => void;
};

export default function PurchaseForm({
  designSlot,
  onContinueToCheckout,
}: PurchaseFormProps) {
  const [recipient, setRecipient] = useState<string[]>(["me"]);
  const [currency, setCurrency] = useState<string[]>(["usd"]);
  const [amount, setAmount] = useState<string[]>([]);
  const [otherAmount, setOtherAmount] = useState("");
  const [otherFocused, setOtherFocused] = useState(false);
  const [delivery, setDelivery] = useState("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState<MessageOption | null>(null);

  const isForSomeoneElse = recipient[0] === "someone";
  const isEmailDelivery = delivery === "email";
  const currencyCode = currency[0] ?? "usd";
  const currencySymbol = CURRENCY_SYMBOLS[currencyCode] ?? "$";
  const otherAmountNumber = Number.parseFloat(otherAmount);
  const otherAmountOverLimit =
    otherAmount !== "" &&
    !Number.isNaN(otherAmountNumber) &&
    otherAmountNumber > 2000;
  const otherAmountError = otherAmountOverLimit
    ? `Enter an amount up to ${currencySymbol}2000`
    : undefined;
  const isOtherSelected = otherAmount.length > 0 || otherFocused;

  const emailDeliveryDescription = isForSomeoneElse
    ? "We'll email the gift card code to the recipient."
    : "You'll receive an email with your gift card code.";

  const yourEmailHelper = !isForSomeoneElse
    ? "We'll send your gift card code and receipt here."
    : isEmailDelivery
      ? "We'll send your receipt here."
      : "We'll send the link here.";

  return (
    <form
      className="flex w-full max-w-none flex-col gap-10 lg:max-w-[520px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onContinueToCheckout?.();
      }}
    >
      <div className="flex flex-col gap-4">
        <Text variant="headingXL" as="h1">
          Buy a gift card
        </Text>
        <Text variant="uiMD" color="secondary">
          Redeemable for games, V-Bucks, and more on the Epic Games Store.
        </Text>
      </div>

      {designSlot}

      <section className="flex flex-col gap-4">
        <Text variant="headingSM" as="h2">
          Who is this for?
        </Text>
        <ToggleGroup
          aria-label="Who is this for?"
          shape="rectangular"
          size="lg"
          className="purchase-choice-toggles"
          value={recipient}
          onChange={(value) => {
            const next = exclusiveSelection(recipient, value);
            setRecipient(next);
            if (next[0] === "me") {
              setDelivery("email");
            }
          }}
        >
          <Toggle
            value="me"
            label="For me"
            layout="icon-and-label"
            icon={<UserIcon />}
            shape="rectangular"
            size="lg"
          />
          <Toggle
            value="someone"
            label="For someone else"
            layout="icon-and-label"
            icon={<UsersIcon />}
            shape="rectangular"
            size="lg"
          />
        </ToggleGroup>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Text variant="headingSM" as="h2">
            Choose a currency
          </Text>
          <Text variant="uiMD" color="secondary">
            {isForSomeoneElse
              ? "Must match the recipient's Epic Games account — this can't be changed later. Not sure which they use? Check with them first."
              : "Must match your Epic Games account — this can't be changed later. We've pre-selected one based on your location."}
          </Text>
        </div>
        <ToggleGroup
          aria-label="Currency"
          shape="rectangular"
          size="lg"
          layout="label-only"
          className="purchase-choice-toggles"
          value={currency}
          onChange={(value) => setCurrency(exclusiveSelection(currency, value))}
        >
          <Toggle value="usd" label="$ USD" shape="rectangular" size="lg" layout="label-only" />
          <Toggle value="cad" label="$ CAD" shape="rectangular" size="lg" layout="label-only" />
          <Toggle value="eur" label="€ EUR" shape="rectangular" size="lg" layout="label-only" />
          <Toggle value="gbp" label="£ GBP" shape="rectangular" size="lg" layout="label-only" />
        </ToggleGroup>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="headingSM" as="h2">
          Choose an amount
        </Text>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              aria-label="Gift card amount"
              shape="rectangular"
              size="lg"
              layout="label-only"
              className="purchase-choice-toggles"
              value={amount}
              onChange={(value) => {
                setOtherAmount("");
                setAmount(exclusiveSelection(amount, value));
              }}
            >
              {AMOUNT_PRESETS.map((preset) => (
                <Toggle
                  key={`${currencyCode}-${preset}`}
                  value={preset}
                  label={`${currencySymbol}${preset}`}
                  shape="rectangular"
                  size="lg"
                  layout="label-only"
                />
              ))}
            </ToggleGroup>
            <div
              className={[
                "amount-other-input",
                isOtherSelected ? "is-selected" : "",
                otherAmountError ? "has-error" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <TextField
                placeholder="Other"
                size="lg"
                type="text"
                prefix={currencySymbol}
                value={otherAmount}
                inputProps={{
                  "aria-label": "Other amount",
                  inputMode: "decimal",
                  pattern: "[0-9]*",
                  "aria-invalid": Boolean(otherAmountError),
                  "aria-describedby": otherAmountError
                    ? "other-amount-error"
                    : undefined,
                  onFocus: () => setOtherFocused(true),
                  onBlur: () => setOtherFocused(false),
                }}
                onChange={(value) => {
                  const numeric = value.replace(/[^\d.]/g, "");
                  setOtherAmount(numeric);
                  if (numeric) setAmount([]);
                }}
              />
            </div>
          </div>
          {otherAmountError ? (
            <div
              id="other-amount-error"
              className="flex items-center gap-2"
              role="alert"
            >
              <ExclamationTriangleFilledIcon
                color="critical"
                aria-hidden
              />
              <Text variant="uiSM" color="critical">
                {otherAmountError}
              </Text>
            </div>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Text variant="headingSM" as="h2">
          How would you like to send it?
        </Text>
        <RadioGroup
          aria-label="Delivery method"
          value={delivery}
          onChange={setDelivery}
          gap={8}
          className="delivery-radio-group w-full"
        >
          <Radio
            className="delivery-option"
            style={deliveryCardStyle}
            value="email"
            size="md"
            aria-label="Send by email"
            label={
              <span className="delivery-option-content">
                <EnvelopeIcon className="delivery-option-icon" aria-hidden />
                <span className="delivery-option-text">
                  <Text variant="uiMD" as="span" className="font-bold">
                    Send by email
                  </Text>
                  <Text variant="uiSM" color="secondary" as="span">
                    {emailDeliveryDescription}
                  </Text>
                </span>
              </span>
            }
          />
          {isForSomeoneElse ? (
            <Radio
              className="delivery-option"
              style={deliveryCardStyle}
              value="link"
              size="md"
              aria-label="Get a link"
              label={
                <span className="delivery-option-content">
                  <LinkIcon className="delivery-option-icon" aria-hidden />
                  <span className="delivery-option-text">
                    <Text variant="uiMD" as="span" className="font-bold">
                      Get a link
                    </Text>
                    <Text variant="uiSM" color="secondary" as="span">
                      You'll get a link to share with them however you like.
                    </Text>
                  </span>
                </span>
              }
            />
          ) : null}
        </RadioGroup>
      </section>

      {!isForSomeoneElse ? (
        <section className="flex flex-col gap-4">
          <Text variant="headingSM" as="h2">
            Where would you like to send it?
          </Text>
          <TextField
            label="Your email"
            size="lg"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={setEmail}
            helperText="We'll send your gift card code and receipt here."
          />
        </section>
      ) : null}

      {isForSomeoneElse && isEmailDelivery ? (
        <section className="flex flex-col gap-4">
          <Text variant="headingSM" as="h2">
            Where would you like to send it?
          </Text>
          <div className="flex flex-col gap-6">
            <TextField
              label="Recipient name"
              size="lg"
              value={recipientName}
              onChange={setRecipientName}
            />
            <TextField
              label="Recipient email"
              size="lg"
              type="email"
              placeholder="name@example.com"
              value={recipientEmail}
              onChange={setRecipientEmail}
              helperText={
                <>
                  Don&apos;t have their email?{" "}
                  <Link
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setDelivery("link");
                    }}
                  >
                    Get a link to share instead.
                  </Link>
                </>
              }
            />
            <Select
              label="Message (optional)"
              placeholder="Select a message"
              size="lg"
              options={MESSAGE_OPTIONS}
              value={message}
              onChange={(option) =>
                setMessage(option as MessageOption | null)
              }
            />
          </div>
        </section>
      ) : null}

      {isForSomeoneElse ? (
        <section className="flex flex-col gap-4">
          <Text variant="headingSM" as="h2">
            Your details
          </Text>
          <div className="flex flex-col gap-6">
            <TextField
              label="Your name"
              size="lg"
              value={name}
              onChange={setName}
            />
            <TextField
              label="Your email"
              size="lg"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={setEmail}
              helperText={yourEmailHelper}
            />
          </div>
        </section>
      ) : null}

      <Button variant="cta" size="xl" fullWidth type="submit">
        Continue to checkout
      </Button>
    </form>
  );
}
