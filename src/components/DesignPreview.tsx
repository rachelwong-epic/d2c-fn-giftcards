import { useState } from "react";
import Text from "@eds/react/Text";
import { themeVars } from "@eds/react";
import cardLlama from "../assets/figma/card.png";
import design1 from "../assets/figma/design-1.png";
import design2 from "../assets/figma/design-2.png";
import design3 from "../assets/figma/design-3.png";
import design4 from "../assets/figma/design-4.png";
import design5 from "../assets/figma/design-5.png";

export const DESIGNS = [
  { id: "llama", src: cardLlama, alt: "Fortnite Llama gift card" },
  { id: "design-1", src: design1, alt: "Fortnite gift card design 1" },
  { id: "design-2", src: design2, alt: "Fortnite gift card design 2" },
  { id: "design-3", src: design3, alt: "Fortnite gift card design 3" },
  { id: "design-4", src: design4, alt: "Fortnite gift card design 4" },
  { id: "design-5", src: design5, alt: "Fortnite gift card design 5" },
] as const;

export type DesignId = (typeof DESIGNS)[number]["id"];

type DesignPreviewProps = {
  selectedId?: DesignId;
  onSelect?: (id: DesignId) => void;
};

export default function DesignPreview({
  selectedId: controlledId,
  onSelect,
}: DesignPreviewProps) {
  const [uncontrolledId, setUncontrolledId] = useState<DesignId>(DESIGNS[0].id);
  const selectedId = controlledId ?? uncontrolledId;
  const selected = DESIGNS.find((design) => design.id === selectedId) ?? DESIGNS[0];

  const handleSelect = (id: DesignId) => {
    onSelect?.(id);
    if (controlledId === undefined) setUncontrolledId(id);
  };

  return (
    <aside
      className="flex w-full flex-col items-center gap-10 rounded-3xl"
      style={{
        backgroundColor: themeVars.color.background.elevated.low,
        padding: themeVars.size.dimension[40],
      }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
        <img
          src={selected.src}
          alt={selected.alt}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <Text variant="headingSM" as="h2" className="text-center">
          Choose a design
        </Text>
        <div
          className="grid w-full grid-cols-3 grid-rows-2 gap-3"
          role="listbox"
          aria-label="Gift card designs"
        >
          {DESIGNS.map((design) => {
            const isSelected = design.id === selectedId;
            return (
              <button
                key={design.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(design.id)}
                className="relative aspect-[110/62] w-full overflow-hidden rounded-lg shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  outlineColor: themeVars.color.border.focus.default,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${themeVars.color.border.focus.default}`
                    : "none",
                }}
              >
                <img
                  src={design.src}
                  alt={design.alt}
                  className="size-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
