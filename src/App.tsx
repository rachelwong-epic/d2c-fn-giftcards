import { useState } from "react";
import RedeemPage from "./components/RedeemPage";
import GiftCardPage from "./components/GiftCardPage";
import CheckoutPage from "./components/CheckoutPage";

type Page = "redeem" | "buy" | "checkout";

function App() {
  const [page, setPage] = useState<Page>("redeem");

  if (page === "checkout") {
    return <CheckoutPage onEditCart={() => setPage("buy")} />;
  }

  if (page === "buy") {
    return (
      <GiftCardPage
        onBack={() => setPage("redeem")}
        onContinueToCheckout={() => setPage("checkout")}
      />
    );
  }

  return (
    <RedeemPage onBuyDigitalGiftCard={() => setPage("buy")} />
  );
}

export default App;
