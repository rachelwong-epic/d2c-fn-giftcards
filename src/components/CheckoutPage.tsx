import { useState } from "react";
import Button from "@eds/react/Button";
import Text from "@eds/react/Text";
import IconButton from "@eds/react/IconButton";
import ShoppingCartIcon from "@eds/react/icons/ShoppingCartIcon";
import PencilIcon from "@eds/react/icons/PencilIcon";
import TrashIcon from "@eds/react/icons/TrashIcon";
import ArrowLeftIcon from "@eds/react/icons/ArrowLeftIcon";
import { themeVars } from "@eds/react";
import epicShield from "../assets/figma/shield.svg";
import cardArt from "../assets/figma/card.png";
import "../App.css";

/** Figma MCP exports — payment brand marks */
const gpaySrc =
  "https://www.figma.com/api/mcp/asset/ac9aefc3-a511-43bd-9b13-67ae547e5de5";
const mastercardSrc =
  "https://www.figma.com/api/mcp/asset/3d774fe3-6863-4113-a85f-294d97a1a90c";
const amexSrc =
  "https://www.figma.com/api/mcp/asset/204bb161-2081-4add-b4d7-19a23ee05a69";
const visaSrc =
  "https://www.figma.com/api/mcp/asset/3db034a9-3252-4bd5-811b-0473b75f99da";

type PaymentMethod = "gpay" | "card";

type CheckoutPageProps = {
  onEditCart: () => void;
  cart?: {
    amountLabel?: string;
    to?: string;
    deliveryType?: string;
    totalLabel?: string;
    currency?: string;
    cardSrc?: string;
  };
};

export default function CheckoutPage({
  onEditCart,
  cart,
}: CheckoutPageProps) {
  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  const amountLabel = cart?.amountLabel ?? "$100.00";
  const to = cart?.to ?? "Brandon";
  const deliveryType = cart?.deliveryType ?? "Email";
  const totalLabel = cart?.totalLabel ?? "$100.00";
  const currency = cart?.currency ?? "USD";
  const cardSrc = cart?.cardSrc ?? cardArt;

  const paymentTileStyle = (selected: boolean) =>
    ({
      backgroundColor: themeVars.color.background.fill.faint,
      border: `1px solid ${
        selected
          ? themeVars.color.border.focus.default
          : themeVars.color.border.subtle
      }`,
      borderRadius: themeVars.selection.radius.parent.xl,
      boxShadow: selected
        ? `0 0 0 1px ${themeVars.color.border.focus.default}`
        : undefined,
    }) as const;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: themeVars.color.background.default }}
    >
      <header
        className="relative sticky top-0 z-20 mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-6 backdrop-blur-[50px] lg:px-20"
        style={{ backgroundColor: "rgba(16, 16, 20, 0.9)" }}
      >
        <div className="flex items-center gap-2">
          <div className="relative size-8 shrink-0">
            <span className="absolute inset-y-0 right-full mr-2 flex items-center">
              <IconButton
                variant="ghost"
                size="lg"
                aria-label="Back"
                icon={<ArrowLeftIcon />}
                onClick={onEditCart}
              />
            </span>
            <img
              src={epicShield}
              alt="Epic Games"
              className="size-full object-contain"
              width={32}
              height={32}
            />
          </div>
          <Text
            variant="uiXS"
            color="secondary"
            as="span"
            className="uppercase tracking-[0.4px]"
          >
            Powered by Buyatab
          </Text>
        </div>
        <nav className="flex items-center" aria-label="Checkout">
          <button type="button" className="rounded-lg px-4 py-2">
            <Text variant="uiMD" as="span">
              Gift cards
            </Text>
          </button>
          <button type="button" className="rounded-lg px-4 py-2">
            <Text variant="uiMD" as="span">
              FAQ
            </Text>
          </button>
          <button type="button" className="rounded-lg px-4 py-2">
            <Text variant="uiMD" as="span">
              Contact
            </Text>
          </button>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-6 pb-20 pt-10 lg:flex-row lg:items-start lg:gap-16 lg:px-20 lg:pt-16">
        <div className="flex min-w-0 flex-1 flex-col gap-16 lg:gap-20">
          <div className="flex flex-col gap-4">
            <Text
              variant="eyebrowMD"
              as="p"
              className="uppercase tracking-[1.2px]"
            >
              Checkout
            </Text>
            <Text variant="headingXL" as="h1">
              Select a payment method
            </Text>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <button
              type="button"
              onClick={() => setPayment("gpay")}
              className="flex h-[140px] flex-1 items-center justify-center p-4"
              style={paymentTileStyle(payment === "gpay")}
              aria-pressed={payment === "gpay"}
              aria-label="Google Pay"
            >
              <span className="payment-logo flex h-[46px] w-[82px] items-center justify-center">
                <img src={gpaySrc} alt="Google Pay" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPayment("card")}
              className="flex h-[140px] flex-1 items-center justify-center gap-6 p-4"
              style={paymentTileStyle(payment === "card")}
              aria-pressed={payment === "card"}
              aria-label="Credit or debit card"
            >
              <span className="payment-logo payment-logo--badge flex h-9 w-[54px] shrink-0 items-center justify-center rounded bg-white px-1.5 py-2">
                <img src={mastercardSrc} alt="Mastercard" />
              </span>
              <span className="payment-logo payment-logo--badge flex h-9 w-[54px] shrink-0 items-center justify-center rounded bg-[#1f72cd] px-1.5 py-2">
                <img src={amexSrc} alt="American Express" />
              </span>
              <span className="payment-logo payment-logo--badge flex h-9 w-[54px] shrink-0 items-center justify-center rounded bg-white px-1.5 py-2">
                <img src={visaSrc} alt="Visa" />
              </span>
            </button>
          </div>

          <Button variant="outline" size="xl" onClick={onEditCart}>
            Edit cart
          </Button>
        </div>

        <aside
          className="flex w-full shrink-0 flex-col gap-6 rounded-2xl border p-8 lg:w-[400px]"
          style={{
            backgroundColor: themeVars.color.background.elevated.low,
            borderColor: themeVars.color.border.subtle,
          }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCartIcon color="primary" aria-hidden />
            <Text variant="headingMD" as="h2">
              Your cart
            </Text>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="relative flex h-[173px] items-center justify-center overflow-hidden rounded-2xl"
              style={{
                backgroundColor: themeVars.color.background.default,
              }}
            >
              <img
                src={cardSrc}
                alt="Gift card"
                className="h-[95px] w-[170px] rounded-lg object-cover"
                style={{ boxShadow: themeVars.shadow.bottom.md }}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-4">
                <Text variant="uiMD" color="secondary" as="span">
                  Amount:
                </Text>
                <Text variant="uiMD" as="span" className="font-medium">
                  {amountLabel}
                </Text>
              </div>
              <div className="flex items-start justify-between gap-4">
                <Text variant="uiMD" color="secondary" as="span">
                  To:
                </Text>
                <Text variant="uiMD" as="span" className="font-medium">
                  {to}
                </Text>
              </div>
              <div className="flex items-start justify-between gap-4">
                <Text variant="uiMD" color="secondary" as="span">
                  Delivery type:
                </Text>
                <Text variant="uiMD" as="span" className="font-medium">
                  {deliveryType}
                </Text>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <IconButton
                variant="solid"
                size="md"
                aria-label="Edit cart item"
                icon={<PencilIcon />}
                onClick={onEditCart}
              />
              <IconButton
                variant="solid"
                size="md"
                aria-label="Remove cart item"
                icon={<TrashIcon />}
                onClick={onEditCart}
              />
            </div>
          </div>

          <div
            className="h-px w-full opacity-10"
            style={{ backgroundColor: "white" }}
            aria-hidden
          />

          <div className="flex items-center justify-between gap-4">
            <Text variant="uiLG" as="span" className="font-bold">
              Total
            </Text>
            <div className="flex items-baseline gap-1">
              <Text variant="headingLG" as="span">
                {totalLabel}
              </Text>
              <Text
                variant="uiSM"
                as="span"
                style={{ color: "rgba(255, 255, 255, 0.35)" }}
              >
                {currency}
              </Text>
            </div>
          </div>

          <Button variant="cta" size="xl" fullWidth>
            Proceed
          </Button>
        </aside>
      </main>
    </div>
  );
}
