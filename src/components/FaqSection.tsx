import Accordion from "@eds/react/Accordion";
import AccordionGroup from "@eds/react/AccordionGroup";
import Divider from "@eds/react/Divider";
import Text from "@eds/react/Text";
import { themeVars } from "@eds/react";

const FAQS = [
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
      "Gift cards must match the recipient's Epic account currency to be redeemed. Choose the currency that matches their account before purchasing.",
  },
  {
    question:
      "If using a wrong currency card, can my card be automatically converted to the right currency?",
    answer:
      "Gift cards are not automatically converted. The card currency must match the Epic account balance currency.",
  },
  {
    question: "Does my purchase (for myself or as a gift) include bonus items?",
    answer:
      "Bonus items, if available, are shown during checkout for the selected gift card offer.",
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
    question: "My Epic Account information aren't automatically filled in the flow.",
    answer:
      "Sign in to your Epic account before purchasing so your details can be pre-filled where available.",
  },
  {
    question:
      "Will I receive Epic Account rewards if I buy something with a Gift Card on the Epic Games Store?",
    answer:
      "Eligible purchases made with gift card balance may still qualify for Epic Account rewards. Check current rewards terms for details.",
  },
  {
    question: "Can I access my Gift Card balance on a console?",
    answer:
      "Gift card balance is tied to your Epic account and can be used where Epic account purchases are supported.",
  },
] as const;

type FaqSectionProps = {
  pagePad?: string;
};

export default function FaqSection({
  pagePad = "px-6 lg:px-20 xl:px-40",
}: FaqSectionProps) {
  return (
    <section
      className={`mx-auto flex w-full max-w-[1440px] flex-col gap-20 pb-24 ${pagePad}`}
      style={{ color: themeVars.color.foreground.primary }}
    >
      <Divider />
      <div className="flex flex-col gap-8">
        <Text variant="headingLG" as="h2">
          Frequently asked questions
        </Text>
        <AccordionGroup gap={16} variant="solid" size="md" className="faq-accordions">
          {FAQS.map((faq) => (
            <Accordion
              key={faq.question}
              headerTitle={faq.question}
              defaultExpanded={"defaultExpanded" in faq ? faq.defaultExpanded : false}
              headerAs="h3"
            >
              <Text variant="uiLG" color="secondary">
                {faq.answer}
              </Text>
            </Accordion>
          ))}
        </AccordionGroup>
      </div>
    </section>
  );
}
