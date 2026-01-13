import React from "react";

import AboutUs from "@/pages/public/AboutUs/AboutUs";
import Cart from "@/pages/public/cart/Cart";
// import Checkout from "@/pages/public/checkout/Checkout";
import ContactUs from "@/pages/public/contactUs/ContactUs";
import Login from "@/pages/public/Login/Login";
import AccountPage from "@/pages/public/myAccount/AccountPage";
import WishProductList from "@/pages/public/myAccount/WishProductList";
import OrderSuccess from "@/pages/public/orderSuccess/OrderSuccess";
import ProductDetails from "@/pages/public/productDetails/ProductDetails";
import Products from "@/pages/public/products/Products";
import Registration from "@/pages/public/registration/Registration";
import { ReactNode } from "react";
import HomePage from "../../../pages/public/home/HomePage";
import PrivateRoute from "../routeWrapper/PrivateRoute";
import WarrantyPolicy from "@/components/common/shared/WarrantyPolicy";
import ReturnPolicy from "@/components/common/shared/RetrunPolicy";
import PreOrderPolicy from "@/components/common/shared/PrebookPolicy";
import CorporateSalesPolicy from "@/components/common/shared/CorporatePolicy";
import DeliveryPolicy from "@/components/common/shared/DeliveryPolicy";
import TopBrands from "@/components/pagesComponents/common/TopBrand";
import AppleProducts from "@/pages/public/products/AppleProducts";
import Blog from "@/components/pagesComponents/common/Blog";
import OurBranch from "@/components/common/shared/OurBranch";
import TruckOrder from "@/pages/public/myAccount/TruckOrder";
import CategoryWiseProduct from "@/pages/public/category/CategoryWiseProduct";
import BrandWiseProduct from "@/pages/public/brand/BrandWiseProduct";
import FeatureWiseProduct from "@/pages/public/feature/FeatureWiseProduct";
import ConditionWiseProduct from "@/pages/public/condition/ConditionWiseProduct";
import SubCategoryWiseProduct from "@/pages/public/subCategory/SubCategoryWiseProduct";
import CheckoutNew from "@/pages/public/checkout/CheckoutNew";
import PaymentSuccess from "@/pages/public/checkout/PaymentSuccess";
import PaymentFailed from "@/pages/public/checkout/PaymentFailed";
import ProductCompare from "@/pages/public/myAccount/ProductCompare";
import OfferListPage from "@/pages/public/offer/OfferListPage";
import OfferDetails from "@/pages/public/offer/OfferDetails";
import TagWiseProduct from "@/pages/public/tag/TagWiseProduct";
import Pages from "@/pages/public/pages/Pages";
import OrderDetailsTable from "@/pages/public/myAccount/OrderDetailsTable";
import ForgetPassword from "@/pages/public/Login/ForgetPassword";
import Blogs from "@/pages/public/blogs/Blogs";
import SingleBogs from "@/pages/public/blogs/SingleBogs";
import PaymentCancel from "@/pages/public/checkout/PaymentCancel";
import PreOrderForm from "@/components/pagesComponents/preOrder/PreOrderForm";

export interface IRouteProps {
  path: string;
  element: ReactNode;
}
export const publicRoutes: IRouteProps[] = [
  {
    path: "/",
    element: React.createElement(HomePage),
  },
  {
    path: "home",
    element: React.createElement(HomePage),
  },
  {
    path: "products/:id",
    element: React.createElement(ProductDetails),
  },
  {
    path: "category/:id",
    element: React.createElement(CategoryWiseProduct),
  },
  {
    path: "brand/:id",
    element: React.createElement(BrandWiseProduct),
  },
  {
    path: "feature/:id",
    element: React.createElement(FeatureWiseProduct),
  },
  {
    path: "condition/:id",
    element: React.createElement(ConditionWiseProduct),
  },
  {
    path: "sub-category/:id",
    element: React.createElement(SubCategoryWiseProduct),
  },
  {
    path: "payment-success/:id",
    element: React.createElement(PaymentSuccess),
  },
  {
    path: "payment-failed/:id",
    element: React.createElement(PaymentFailed),
  },
  {
    path: "payment-canceled/:id",
    element: React.createElement(PaymentCancel),
  },
  {
    path: "products",
    element: React.createElement(Products),
  },
  {
    path: "apple-products",
    element: React.createElement(AppleProducts),
  },
  {
    path: "top_brand",
    element: React.createElement(TopBrands),
  },
  {
    path: "products/category/sub-category/:subCategoryId",
    element: React.createElement(Products),
  },
  {
    path: "products/category/:categoryId",
    element: React.createElement(Products),
  },
  {
    path: "products/brand/:brandId",
    element: React.createElement(Products),
  },
  {
    path: "products/offer/:id",
    element: React.createElement(Products),
  },
  {
    path: "registration",
    element: React.createElement(Registration),
  },
  {
    path: "login",
    element: React.createElement(Login),
  },
  {
    path: "forget-password",
    element: React.createElement(ForgetPassword),
  },

  {
    path: "login",
    element: React.createElement(Login),
  },
  {
    path: "track-order",
    element: React.createElement(TruckOrder),
  },
  {
    path: "cart",
    element: React.createElement(Cart),
  },
  {
    path: "wishlist",
    element: React.createElement(WishProductList),
  },
  {
    path: "latest-offer",
    element: React.createElement(OfferListPage),
  },
  {
    path: "latest-offer/:id",
    element: React.createElement(OfferDetails),
  },
  {
    path: "product-tag/:id",
    element: React.createElement(TagWiseProduct),
  },
  {
    path: "pages/:slug",
    element: React.createElement(Pages),
  },
  {
    path: "blogs",
    element: React.createElement(Blogs),
  },
  {
    path: "blogs/:slug",
    element: React.createElement(SingleBogs),
  },
  {
    path: "pre-order-form",
    element: React.createElement(PreOrderForm),
  },

  {
    path: "checkout",
    element: (
      <PrivateRoute>
        <CheckoutNew />
      </PrivateRoute>
    ),
  },
  {
    path: "order-success",
    element: React.createElement(OrderSuccess),
  },
  {
    path: "product-compare",
    element: React.createElement(ProductCompare),
  },
  {
    path: "my-account",
    element: (
      <PrivateRoute>
        <AccountPage />
      </PrivateRoute>
    ),
  },
  {
    path: "about-us",
    element: React.createElement(AboutUs),
  },
  {
    path: "blog",
    element: React.createElement(Blog),
  },
  {
    path: "contact-us",
    element: React.createElement(ContactUs),
  },
  {
    path: "warranty-policy",
    element: React.createElement(WarrantyPolicy),
  },
  {
    path: "return-policy",
    element: React.createElement(ReturnPolicy),
  },
  {
    path: "pre-book-policy",
    element: React.createElement(PreOrderPolicy),
  },
  {
    path: "corporate-sales-policy",
    element: React.createElement(CorporateSalesPolicy),
  },
  {
    path: "delivery-policy",
    element: React.createElement(DeliveryPolicy),
  },
  {
    path: "our-branches",
    element: React.createElement(OurBranch),
  },
  {
    path: "order-details-tab/:id",
    element: React.createElement(OrderDetailsTable)
  }
];
