import { createContext, useState, useContext } from "react";
import { toast } from "../ui/use-toast";

// Define the shape of your context
interface WishContextType {
  wish: any[];
  addToWish: (product: any) => void;
  removeFromWish: (productId: number) => void;
  isProductInWishList: (productId: number) => boolean;
}

// Provide a default value for the context
const WishListContext = createContext<WishContextType | undefined>(undefined);

export const WishListProvider = ({ children }) => {
  const [wish, setWish] = useState(
    JSON.parse(localStorage.getItem("addToWish") || "[]")
  );

  const addToWish = (product: any) => {
    const existingCart = wish?.find((c: any) => c.id === product.id);
    if (existingCart) {
      toast({
        title: "Wish already exists",
      });
      return;
    } else {
      const updatedWish = [...wish, product];
      setWish(updatedWish);
      localStorage.setItem("addToWish", JSON.stringify(updatedWish));
    }
  };

  const removeFromWish = (productId: number) => {
    const updatedWish = wish.filter((item: any) => item.id !== productId);
    setWish(updatedWish);
    localStorage.setItem("addToWish", JSON.stringify(updatedWish));
  };

  // Check if the product is in the wishlist
  const isProductInWishList = (productId: number) => {
    return wish.some((item) => item.id === productId);
  };

  return (
    <WishListContext.Provider
      value={{ wish, addToWish, removeFromWish, isProductInWishList }}
    >
      {children}
    </WishListContext.Provider>
  );
};

// Custom hook to access the wish context
export const useWishList = () => {
  const context = useContext(WishListContext);
  if (context === undefined) {
    throw new Error("useWishList must be used within a WishListProvider");
  }
  return context;
};
