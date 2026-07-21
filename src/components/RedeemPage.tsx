import { useState } from "react";
import Button from "@eds/react/Button";
import Text from "@eds/react/Text";
import TextField from "@eds/react/TextField";
import Link from "@eds/react/Link";
import Tabs from "@eds/react/Tabs";
import Tab from "@eds/react/Tab";
import Accordion from "@eds/react/Accordion";
import AccordionGroup from "@eds/react/AccordionGroup";
import IconIllustration from "@eds/react/IconIllustration";
import IconButton from "@eds/react/IconButton";
import GiftCardIcon from "@eds/react/icons/GiftCardIcon";
import ChevronRightIcon from "@eds/react/icons/ChevronRightIcon";
import QuestionCircleIcon from "@eds/react/icons/QuestionCircleIcon";
import PlayCircleFilledIcon from "@eds/react/icons/PlayCircleFilledIcon";
import { themeVars } from "@eds/react";
import TopNav from "./TopNav";
import redeemHero from "../assets/figma/redeem-hero.webp";
import redeemVideoPoster from "../assets/figma/redeem-video.webp";

const pagePad = "px-6 lg:px-20 xl:px-40";

/** New FAQs from Figma (Redeeming tab) */
const REDEEMING_FAQS = [
  {
    question: "How can I check my gift card balance?",
    answer:
      "Sign in to your Epic account and open Account → Payment management → Gift cards to view your remaining balance.",
    defaultExpanded: true,
  },
  {
    question: "How can I use my account balance?",
    answer:
      "Your gift card balance can be spent on the Epic Games Store and anywhere Epic's payment system is used, including Fortnite on mobile.",
  },
  {
    question: "Why aren't gift cards available in my country?",
    answer:
      "Digital and retail gift card availability varies by region. Check back later or contact support for options in your country.",
  },
  {
    question: "Can I transfer my account balance from one account to another?",
    answer:
      "No. Gift card balance is tied to the Epic account it was redeemed on and can't be transferred.",
  },
  {
    question: "Can I get a refund on my account balance?",
    answer:
      "Redeemed gift card balance generally can't be refunded. Contact Epic Games Store support if you need help with a specific purchase.",
  },
] as const;

/** New FAQs from Figma (Buying tab) */
const BUYING_FAQS = [
  {
    question:
      "What if the currency of my gift card doesn't match the currency of my Epic account balance?",
    answer:
      "Fortnite gift cards are currency-specific, so the currency of your card must match the currency of your Epic account balance to redeem the card.",
    defaultExpanded: true,
  },
  {
    question:
      "Can I send a gift card that doesn't match their Epic account's currency to someone?",
    answer:
      "No. You must ensure that you are selecting the correct currency for your giftee. We'd recommend checking in with your giftee to confirm the currency their Epic account uses.",
  },
  {
    question:
      "If using a wrong currency card, can my card be automatically converted to the right currency?",
    answer:
      "No, we do not currently allow currency conversions to happen for gift cards. We hope to introduce this feature at a later date.",
  },
  {
    question: "Does my purchase (for myself or as a gift) include bonus items?",
    answer:
      "No, bonus items are not awarded on purchase of a card (for self use or gift use), the bonus items are awarded on redemption of a gift card.",
  },
  {
    question: "Does my gift card have an expiration date?",
    answer:
      "Gift card expiration varies by region. Check the terms shown at checkout for your purchase.",
  },
  {
    question:
      "I've sent someone (or myself) the wrong currency gift card, what can I do?",
    answer:
      "Contact Epic Games Store support for help with currency-related gift card issues.",
  },
  {
    question:
      "The purchase record on my bank statement does not mention Epic Games.",
    answer:
      "Depending on your payment method and region, the billing descriptor may differ. Contact support if you need help identifying a charge.",
  },
  {
    question:
      "My Epic Account information aren't automatically filled in the flow.",
    answer:
      "Sign in to your Epic account before purchasing so your details can be pre-filled where available.",
  },
  {
    question: "Can I use my Epic Account rewards on a Gift Card purchase?",
    answer:
      "No. You are not able to use Epic Account rewards for a gift card purchase.",
  },
  {
    question:
      "Will I receive Epic Account rewards if I buy something with a Gift Card on the Epic Games Store?",
    answer: (
      <>
        Yes, you will receive Epic Account rewards for purchases made on the
        Epic Games Store (restrictions may apply, see the{" "}
        <Link
          href="https://store.epicgames.com/features/epic-rewards?lang=en-US"
          external
          externalLabel="opens in a new tab"
        >
          Epic Rewards page
        </Link>{" "}
        for details).
      </>
    ),
  },
  {
    question: "Can I access my Gift Card balance on a console?",
    answer: (
      <>
        <Text variant="paragraphMD" color="secondary" as="p">
          No. You must spend your added balance on the Epic Games Store or
          anywhere where Epic&apos;s payment system is used! (Like the Fortnite
          app on mobile devices.) This includes:
        </Text>
        <ul
          className="mt-2 list-disc ps-6"
          style={{ color: themeVars.color.foreground.secondary }}
        >
          <li>
            <Text variant="paragraphMD" color="secondary" as="span">
              Fortnite V-Bucks, Fortnite Crew, and Packs
            </Text>
          </li>
          <li>
            <Text variant="paragraphMD" color="secondary" as="span">
              Epic Games Store games, DLCs, and add-ons
            </Text>
          </li>
          <li>
            <Text variant="paragraphMD" color="secondary" as="span">
              fab.com content (for creators)
            </Text>
          </li>
        </ul>
      </>
    ),
  },
] as const;

type RedeemPageProps = {
  onBuyDigitalGiftCard: () => void;
};

export default function RedeemPage({ onBuyDigitalGiftCard }: RedeemPageProps) {
  const [code, setCode] = useState("");
  const [faqTab, setFaqTab] = useState<string | number>("buying");

  const faqs = faqTab === "redeeming" ? REDEEMING_FAQS : BUYING_FAQS;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: themeVars.color.background.default }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[490px] opacity-5"
        style={{
          background:
            "linear-gradient(to bottom, white, rgba(255, 255, 255, 0))",
        }}
        aria-hidden
      />

      <TopNav />

      <main className={`relative mx-auto w-full max-w-[1440px] ${pagePad}`}>
        {/* Hero — matches live redeem page */}
        <section className="relative flex flex-col items-center gap-10 pb-16 pt-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:pb-20 lg:pt-16">
          <div className="flex w-full max-w-[570px] flex-col gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Text variant="heading2XL" as="h1">
                  Redeem your gift card
                </Text>
                <Text variant="uiLG">
                  Enter the 16-digit code on the back of your gift card.
                </Text>
              </div>

              <TextField
                label="Enter code"
                size="lg"
                required
                value={code}
                onChange={setCode}
                endAdornment={
                  <IconButton
                    aria-label="Gift card code help"
                    size="sm"
                    variant="ghost"
                    icon={<QuestionCircleIcon />}
                  />
                }
              />

              <Button variant="cta" size="lg" className="w-fit min-w-[199px]">
                Redeem
              </Button>
            </div>

            {/* New: Buy a digital gift card (from Figma) */}
            <button
              type="button"
              onClick={onBuyDigitalGiftCard}
              className="flex h-[92px] w-full items-center gap-4 p-6 text-left transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                backgroundColor: themeVars.color.background.fill.faint,
                borderRadius: themeVars.size.borderRadius[16],
                outlineColor: themeVars.color.border.focus.default,
              }}
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center">
                <IconIllustration
                  icon={<GiftCardIcon color="primary" />}
                  size={40}
                  color="blue"
                  aria-hidden
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <Text variant="headingSM" as="span">
                  Buy a digital gift card
                </Text>
                <Text variant="uiMD" color="secondary" as="span">
                  For yourself or someone else — no account needed
                </Text>
              </span>
              <ChevronRightIcon className="shrink-0" color="primary" aria-hidden />
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] shrink-0 lg:mx-0">
            <img
              src={redeemHero}
              alt="Fortnite Gift Card"
              className="h-auto w-full object-contain"
              width={520}
              height={480}
            />
          </div>
        </section>

        {/* How to redeem — full-bleed gradient matches live epicgames.com/redeem */}
        <section className="relative mx-auto flex max-w-[922px] flex-col gap-20 pb-20 pt-20">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-screen -translate-x-1/2"
            style={{
              background: `linear-gradient(${themeVars.color.background.elevated.low}, rgba(255, 255, 255, 0) 800px)`,
            }}
            aria-hidden
          />

          <div className="relative flex flex-col items-center gap-12 lg:flex-row lg:gap-12">
            <button
              type="button"
              className="relative aspect-video w-full max-w-[477px] shrink-0 overflow-hidden rounded-2xl"
              aria-label="Play how to redeem code video"
            >
              <img
                src={redeemVideoPoster}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayCircleFilledIcon size={64} aria-hidden />
              </span>
            </button>

            <div className="flex flex-col gap-1">
              <Text variant="headingLG" as="h2">
                How to redeem your code
              </Text>
              <Text variant="uiLG" color="secondary" as="p">
                Get step-by-step instructions in this video, or check out{" "}
                <Link href="#faq">how to redeem your code</Link>.
              </Text>
            </div>
          </div>

          {/* New FAQs (Figma tabs) */}
          <div className="relative flex flex-col gap-8" id="faq">
            <div className="flex flex-col gap-4">
              <Text variant="headingXL" as="h2">
                Frequently asked questions
              </Text>
              <Tabs size="lg" value={faqTab} onChange={setFaqTab} gap={16}>
                <Tab label="Redeeming" value="redeeming" />
                <Tab label="Buying" value="buying" />
              </Tabs>
            </div>

            <AccordionGroup
              gap={16}
              variant="solid"
              size="md"
              className="faq-accordions"
              key={String(faqTab)}
            >
              {faqs.map((faq) => (
                <Accordion
                  key={faq.question}
                  headerTitle={faq.question}
                  defaultExpanded={
                    "defaultExpanded" in faq
                      ? Boolean(faq.defaultExpanded)
                      : false
                  }
                  headerAs="h3"
                >
                  {typeof faq.answer === "string" ? (
                    <Text variant="paragraphMD" color="secondary">
                      {faq.answer}
                    </Text>
                  ) : (
                    faq.answer
                  )}
                </Accordion>
              ))}
            </AccordionGroup>
          </div>
        </section>
      </main>
    </div>
  );
}
