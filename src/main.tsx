window.global = window;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { AppProvider } from "./components/context/AppContext.tsx";
import { store } from "./components/store/store.ts";
import "./index.css";
import { CartProvider } from "./components/context/CartContext.tsx";
import { WishListProvider } from "./components/context/WishListContext.tsx";
import { CompareProvider } from "./components/context/CompareContext.tsx";
import { Toaster } from "react-hot-toast";
import { OrderProvider } from "./components/context/OrderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <CompareProvider>
          <CartProvider>
            <OrderProvider>
              <WishListProvider>
                <App />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      fontSize: "14px",
                    },
                  }}
                />
              </WishListProvider>
            </OrderProvider>
          </CartProvider>
        </CompareProvider>
      </AppProvider>
    </Provider>
  </StrictMode>
);
