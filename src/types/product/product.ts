interface Size {
  id: number;
  size: string;
}

export interface VariationProduct {
  length: number;
  id: number;
  productId: number;
  bookingPrice: number;
  price: number;
  discountPrice: number;
  regularPrice: number;
  purchasePoint: number;
  ram: string;
  rom: string;
  sim: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  colors: { id: number; colorId: number; inStock: boolean }[];
  extraWarranty: { id: number; name: string; price: number }[];
}

export type Product = {
  outSideDeliveryCharge: number;
  inSideDeliveryCharge: number;
  id: number;
  productLink: string;
  productName: string;
  isEmi?: boolean;
  isFullPay:boolean;
  freeEmiCharge?: number;
  productType: "Regular" | "Advertise" | "PreOrder";
  categoryId: number;
  type: "Draft" | "Trust" | "Published";
  subCategoryId: number;
  brandId: number;
  sizeId: number;
  size: Size;
  colorId: number;
  color: {
    id: number;
    color: string;
    inStock: boolean;
  };

  category: {
    id: number;
    name: string;
    image: string;
    isFullPay:boolean;
    CategoryOffer?: {
      id: number;
      isShippedFree?:boolean
      image: string;
      discountType: "FIXED" | "PERCENTAGE"; 
      discount: number;
    } | null;
  };

  subCategory: {
   subCategory:{
    id: number;
    name: string;
    isShippedFree?:boolean
   }
  }[]

  brand: {
    id: number;
    brand: string;
    image: string;
    BrandOffer?: {
      id: number;
      image: string;
      isShippedFree?:boolean;
      discountType: "FIXED" | "PERCENTAGE";
      discount: number;
    } | null;
  };

  description?: string;
  ProductImage: {
    imageUrl: string;
  }[];
  
  features: { featureKeyId: number; value: string }[];
  price: number;
  discountPrice?: number;
  stock?: number;
  reviews?: number;
  discountPercentage: number;
  countdown?: { days: number; hours: number; minutes: number; seconds: number };
  isBannerSidebar?: boolean;
  VariationProduct: VariationProduct;
};
