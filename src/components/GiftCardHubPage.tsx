import { useState, type ReactNode } from "react";
import Accordion from "@eds/react/Accordion";
import AccordionGroup from "@eds/react/AccordionGroup";
import Link from "@eds/react/Link";
import SegmentedControl from "@eds/react/SegmentedControl";
import { Segment } from "@eds/react/SegmentedControl";
import Text from "@eds/react/Text";
import CouponIcon from "@eds/react/icons/CouponIcon";
import ShoppingBagIcon from "@eds/react/icons/ShoppingBagIcon";
import { themeVars } from "@eds/react";
import TopNav from "./TopNav";
import hubBuyArt from "../assets/figma/hub-buy-art.png";
import hubRedeemArt from "../assets/figma/hub-redeem-art.png";
import buyFallback from "../assets/figma/card.png";
import redeemFallback from "../assets/figma/redeem-hero.webp";

const pagePad = "px-5 sm:px-6 lg:px-20 xl:px-40";

type FaqItem = {
  question: string;
  answer: ReactNode;
  defaultExpanded?: boolean;
};

const REDEEM_FAQS: FaqItem[] = [
  {
    question: "How can I check my gift card balance?",
    answer: (
      <>
        Once you redeem your card, the funds are loaded onto your account
        balance. You can check your balance in{" "}
        <Link href="https://www.epicgames.com/account/payments">
          Payment settings
        </Link>
        .
      </>
    ),
    defaultExpanded: true,
  },
  {
    question: "How can I use my account balance?",
    answer:
      "Your account balance is a payment method that allows you to load funds onto your account. You can use your balance to buy games, V-Bucks, or in-game items, just apply your account balance at checkout.",
  },
  {
    question: "Why aren't gift cards available in my country?",
    answer:
      "We're working with card providers and retailers to bring gift cards to more countries.",
  },
  {
    question: "Can I transfer my account balance from one account to another?",
    answer: "Account balances are not transferable between accounts.",
  },
  {
    question: "Can I get a refund on my account balance?",
    answer: "We do not offer refunds on account balances.",
  },
  {
    question: "What if I lose my gift card?",
    answer:
      "Please treat gift cards like cash. Epic Games is not responsible for lost, stolen, or damaged cards, or unauthorized use.",
  },
  {
    question: "What if my account balance is used without my permission?",
    answer:
      "Contact Epic Games Player Support as soon as possible if you believe your account balance was used without your permission.",
  },
];

const BUY_FAQS: FaqItem[] = [
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
      "No. Your gift card purchase does not have an expiration date in the currently available cards.",
  },
  {
    question:
      "I've sent someone (or myself) the wrong currency gift card, what can I do?",
    answer:
      "If you've purchased the wrong currency, you may contact our Partner Site to ask for a refund (as long as the card hasn't been used). Alternatively, you can contact our Player Support team to see if a new code could be re-issued (restrictions may apply).",
  },
  {
    question:
      "The purchase record on my bank statement does not mention Epic Games.",
    answer:
      "Epic Games is working with our partner to make the Gift Cards available for purchase, and some banks may choose to use their name instead for your purchase records, instead of Epic Games' preferred ledger name.",
  },
  {
    question:
      "My Epic Account information aren't automatically filled in the flow.",
    answer:
      "We are making use of a Partner Site to provide the Gift Card purchase experience, and thus do not rely on your Epic Games Account information to prefill fields like Email, Name, etc. Any information you enter in the fields will be securely used when you're ready to Checkout on our Partner Site.",
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
];

type GiftCardHubPageProps = {
  onBuy: () => void;
  onRedeem: () => void;
};

function JobTile({
  title,
  helper,
  image,
  imageFallback,
  onClick,
}: {
  title: string;
  helper: string;
  image: string;
  imageFallback: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-1 flex-col items-center gap-4 overflow-hidden p-8 text-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:min-w-0 lg:px-16 lg:py-8"
      style={{
        backgroundColor: themeVars.color.background.fill.faint,
        borderRadius: themeVars.size.borderRadius[24],
        outlineColor: themeVars.color.border.focus.default,
      }}
    >
      <div className="flex h-[60px] w-full flex-col items-center justify-center gap-2 lg:gap-3">
        <Text variant="headingMD" as="span">
          {title}
        </Text>
        <Text variant="uiSM" color="secondary" as="span">
          {helper}
        </Text>
      </div>
      <div className="relative flex h-[180px] w-full max-w-[280px] items-center justify-center lg:h-[241px] lg:max-w-[333px]">
        <img
          src={image}
          alt=""
          className="max-h-full max-w-full object-contain"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = imageFallback;
          }}
        />
      </div>
    </button>
  );
}

export default function GiftCardHubPage({
  onBuy,
  onRedeem,
}: GiftCardHubPageProps) {
  const [faqTab, setFaqTab] = useState<"redeem" | "buy">("redeem");
  const faqs = faqTab === "redeem" ? REDEEM_FAQS : BUY_FAQS;

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
        <section className="flex flex-col items-center gap-10 pb-12 pt-4 sm:gap-12 sm:pt-10 lg:gap-16 lg:pb-16 lg:pt-16">
          <div className="flex w-full max-w-[720px] flex-col items-start gap-2 text-left sm:items-center sm:gap-4 sm:text-center">
            <Text variant="heading2XL" as="h1">
              Fortnite Gift Cards
            </Text>
            <Text variant="uiLG">
              Redeemable for games, V-Bucks, and more on the Epic Games Store.
            </Text>
          </div>

          <div className="flex w-full max-w-[920px] flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-center lg:gap-4">
            <JobTile
              title="Buy a digital gift card"
              helper="For yourself or someone else, no account needed."
              image={hubBuyArt}
              imageFallback={buyFallback}
              onClick={onBuy}
            />
            <JobTile
              title="Redeem a gift card"
              helper="Already have a code? Add it to your Epic account."
              image={hubRedeemArt}
              imageFallback={redeemFallback}
              onClick={onRedeem}
            />
          </div>
        </section>

        <section className="relative mx-auto flex w-full max-w-[922px] flex-col gap-6 pb-20 pt-4 sm:gap-8 sm:pb-24 lg:gap-8">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[384px] w-screen -translate-x-1/2 opacity-5"
            style={{
              background:
                "linear-gradient(to bottom, white, rgba(255, 255, 255, 0))",
            }}
            aria-hidden
          />
          <Text variant="headingLG" as="h2">
            Frequently asked questions
          </Text>

          <div className="w-full max-w-[280px] sm:max-w-[320px]">
            <SegmentedControl
              aria-label="FAQ topic"
              value={faqTab}
              onChange={(value) => setFaqTab(value as "redeem" | "buy")}
              layout="icon-and-label"
              size="md"
              fullWidth
            >
              <Segment value="redeem" label="Redeem" icon={<CouponIcon />} />
              <Segment value="buy" label="Buy" icon={<ShoppingBagIcon />} />
            </SegmentedControl>
          </div>

          <AccordionGroup
            key={faqTab}
            gap={16}
            variant="solid"
            size="md"
            className="faq-accordions"
          >
            {faqs.map((faq) => (
              <Accordion
                key={faq.question}
                headerTitle={faq.question}
                defaultExpanded={faq.defaultExpanded ?? false}
                headerAs="h3"
              >
                {typeof faq.answer === "string" ? (
                  <Text variant="uiLG" color="secondary">
                    {faq.answer}
                  </Text>
                ) : (
                  <Text variant="uiLG" color="secondary" as="div">
                    {faq.answer}
                  </Text>
                )}
              </Accordion>
            ))}
          </AccordionGroup>
        </section>
      </main>
    </div>
  );
}
