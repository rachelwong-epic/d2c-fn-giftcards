import { useState } from "react";
import GiftCardHubPage from "./components/GiftCardHubPage";
import GiftCardPage from "./components/GiftCardPage";
import RedeemPage from "./components/RedeemPage";
import CheckoutPage from "./components/CheckoutPage";

type Page = "hub" | "buy" | "redeem" | "checkout";

function App() {
  const [page, setPage] = useState<Page>("hub");

  if (page === "checkout") {
    return <CheckoutPage onEditCart={() => setPage("buy")} />;
  }

  if (page === "buy") {
    return (
      <GiftCardPage
        onBack={() => setPage("hub")}
        onContinueToCheckout={() => setPage("checkout")}
      />
    );
  }

  if (page === "redeem") {
    return <RedeemPage onBack={() => setPage("hub")} />;
  }

  return (
    <GiftCardHubPage
      onBuy={() => setPage("buy")}
      onRedeem={() => setPage("redeem")}
    />
  );
}

export default App;
