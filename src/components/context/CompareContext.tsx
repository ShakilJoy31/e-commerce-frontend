import { createContext, useContext, useState, ReactNode } from "react";

// Define the types
interface CompareContextType {
  selectedProducts: any[];
  setSelectedProducts: (products: any[]) => void;
  productIds: (number | null)[];
  setProductIds: (ids: (number | null)[]) => void;
}

// Create Context with Default Values
const CompareContext = createContext<CompareContextType | undefined>(undefined);

// Provider Component
export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([null, null]);
  const [productIds, setProductIds] = useState<(number | null)[]>([null, null]);

  return (
    <CompareContext.Provider value={{ selectedProducts, setSelectedProducts, productIds, setProductIds }}>
      {children}
    </CompareContext.Provider>
  );
};

// Custom Hook to use Compare Context
export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
