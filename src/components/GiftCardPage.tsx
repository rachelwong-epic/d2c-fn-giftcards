import { useState } from "react";
import { themeVars } from "@eds/react";
import TopNav from "./TopNav";
import PurchaseForm from "./PurchaseForm";
import DesignPreview, { DESIGNS, type DesignId } from "./DesignPreview";
import FaqSection from "./FaqSection";

/** Shared horizontal page padding — keep main + FAQ aligned */
const pagePad = "px-6 lg:px-20 xl:px-40";

type GiftCardPageProps = {
  onBack?: () => void;
  onContinueToCheckout?: () => void;
};

export default function GiftCardPage({
  onBack,
  onContinueToCheckout,
}: GiftCardPageProps) {
  const [selectedDesignId, setSelectedDesignId] = useState<DesignId>(
    DESIGNS[0].id,
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: themeVars.color.background.default }}
    >
      <TopNav onBack={onBack} />
      <main
        className={`mx-auto flex w-full max-w-[1440px] flex-col gap-12 pb-16 pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 ${pagePad}`}
      >
        <PurchaseForm
          onContinueToCheckout={onContinueToCheckout}
          designSlot={
            <div className="w-full lg:hidden">
              <DesignPreview
                selectedId={selectedDesignId}
                onSelect={setSelectedDesignId}
              />
            </div>
          }
        />
        <div className="hidden w-full max-w-[480px] shrink-0 lg:sticky lg:top-24 lg:block lg:self-start">
          <DesignPreview
            selectedId={selectedDesignId}
            onSelect={setSelectedDesignId}
          />
        </div>
      </main>
      <FaqSection pagePad={pagePad} />
    </div>
  );
}
