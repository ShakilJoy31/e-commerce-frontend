import { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

// Define the shape of your context
interface CartContextType {
  cart: any[];
  addToOrder: (product: any) => void;
  removeFromOrder: (productId: number, colorId: number) => void;
  clearOrder: () => void;
  updateCartItem: (productId: number, colorId: number, updates: any) => void;
}

// Provide a default value for the context
const OrderContext = createContext<CartContextType | undefined>(undefined);

export const OrderProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("addToOrder") || "[]")
  );

  const addToOrder = (product: any) => {
   
    const existingCart = cart?.find((c: any) => c.colorId === product.colorId && c.id === product.id);
    console.log(existingCart)
    if (existingCart) {
      toast.error("Cart already exists, Please increase quantity");
      return;
    } else {
      const updatedCart = [...cart, product];

      setCart(updatedCart);
      localStorage.setItem("addToOrder", JSON.stringify(updatedCart));
    }
  };

  const updateCartItem = (productId: number, colorId: number, updates: any) => {
  const updatedCart = cart.map(item => {
    if (item.id === productId && item.colorId === colorId) {
      return { ...item, ...updates };
    }
    return item;
  });
  
  setCart(updatedCart);
  localStorage.setItem("addToOrder", JSON.stringify(updatedCart));
};


  const removeFromOrder = (productId: number, colorId: number) => {
    const updatedCart = cart.filter(
      (item: any) => item.id !== productId || item.colorId !== colorId
    );
    setCart(updatedCart);
    localStorage.setItem("addToOrder", JSON.stringify(updatedCart));
  };

  const clearOrder = () => {
    setCart([]);
    localStorage.removeItem("addToOrder");
    // toast.success("Order has been cleared successfully");
  };

  return (
    <OrderContext.Provider value={{ cart, addToOrder, removeFromOrder, clearOrder, updateCartItem  }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to access the cart context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within a CartProvider");
  }
  return context;
};
