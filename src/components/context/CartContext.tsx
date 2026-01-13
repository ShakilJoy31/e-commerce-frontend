import { createContext, useState, useContext } from "react";
import { toast } from "../ui/use-toast";

// Define the shape of your context
interface CartContextType {
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number, colorId: number) => void;
  clearCart: () => void;
}

// Provide a default value for the context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("addToCart") || "[]")
  );

  const addToCart = (product: any) => {
   
    // Check if cart is empty
    if (cart.length === 0) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("addToCart", JSON.stringify(updatedCart));
       toast({
      title: "Added to cart",
      description: `${product?.title} has been added to your cart`,
    });
      return true;
    }

    // Check EMI compatibility
    const firstItemInCart = cart[0];
    
    // Case 1: Trying to add EMI product when cart has non-EMI product
    // if (product.isEmi && !firstItemInCart.isEmi) {
    //   toast({
    //     title: "Cannot add EMI product",
    //     description: "Your cart contains non-EMI products. Please clear your cart to add EMI products.",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    
    // Case 2: Trying to add non-EMI product when cart has EMI product
    // if (!product.isEmi && firstItemInCart.isEmi) {
    //   toast({
    //     title: "Cannot add non-EMI product",
    //     description: "Your cart contains EMI products. Please clear your cart to add non-EMI products.",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    

    // Case 3: Both are EMI products but with different freeEmiCharge
    if (product.isEmi && !firstItemInCart.isEmi && product.freeEmiCharge > 0) {
      toast({
        title: "Cannot add EMI product",
        description: "EMI charge doesn't match with existing products in your cart. Please clear your cart to add products with different EMI charges.",
        variant: "destructive"
      });
      return;
    }
    if (!product.isEmi && firstItemInCart.isEmi &&  firstItemInCart.freeEmiCharge > 0) {
      toast({
        title: "Cannot add EMI product",
        description: "EMI charge doesn't match with existing products in your cart. Please clear your cart to add products with different EMI charges.",
        variant: "destructive"
      });
      return;
    }
    if (product.isEmi && firstItemInCart.isEmi && product.freeEmiCharge !== firstItemInCart.freeEmiCharge) {
      toast({
        title: "Cannot add EMI product",
        description: "EMI charge doesn't match with existing products in your cart. Please clear your cart to add products with different EMI charges.",
        variant: "destructive"
      });
      return;
    }

    // Check if product already exists in cart
    const existingCart = cart?.find((c: any) => c.colorId === product.colorId && c.id === product.id);
    console.log(existingCart)
    if (existingCart) {
      toast({
        title: "Product already in cart",
        description: "This product is already in your cart. Please increase quantity if needed.",
      });
      return;
    }

    // If all checks pass, add to cart
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("addToCart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number, colorId: number) => {
    const updatedCart = cart.filter(
      (item: any) => item.id !== productId || item.colorId !== colorId
    );
    setCart(updatedCart);
    localStorage.setItem("addToCart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("addToCart");
    toast({
      title: "Your Order has been placed successfully.",
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};