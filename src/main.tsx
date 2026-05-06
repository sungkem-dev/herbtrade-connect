import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { BuyerRequestProvider } from "./contexts/BuyerRequestContext.tsx";
import { ComplianceProvider } from "./contexts/ComplianceContext.tsx";
import { CommunityProvider } from "./contexts/CommunityContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <BuyerRequestProvider>
        <ComplianceProvider>
          <CommunityProvider>
            <App />
          </CommunityProvider>
        </ComplianceProvider>
      </BuyerRequestProvider>
    </CartProvider>
  </AuthProvider>
);

