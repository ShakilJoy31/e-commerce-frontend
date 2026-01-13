import { List, ListIcon } from "lucide-react";
import { ComponentType } from "react";
import { FaProductHunt, FaUsers } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { LuContact } from "react-icons/lu";
import { MdCategory, MdDiscount } from "react-icons/md";

export interface INavigationLinks {
  icon?: IconType | ComponentType<any>;
  label: string;
  key: string;
  href?: string;
  subLinks?: INavigationLinks[];
  subSubLinks?: INavigationLinks[];
}

const admindashboardRootLinks = {
  icon: LuContact,
  label: "Dashboard",
  key: "/kry-admin-portal/admin_home",
  href: "/kry-admin-portal/admin_home",
};

const admindashboarCustomers = {
  icon: FaUsers,
  label: "Users",
  key: "/kry-admin-portal/customers",
  href: "/kry-admin-portal/customers",
};

const adminDashboardProduct = {
  icon: MdCategory,
  label: "Products",
  key: "product-list",
  href: "/kry-admin-portal/product-list",
  subLinks: [
    {
      icon: MdCategory,
      label: "Add New Product",
      key: "add-product",
      href: "/kry-admin-portal/add-product",
    },
    {
      icon: MdCategory,
      label: "All Products",
      key: "product-list",
      href: "/kry-admin-portal/product-list",
      subSubLinks: [
        {
          icon: MdCategory,
          label: "Product Catalog",
          key: "product-list",
          href: "/kry-admin-portal/product-list",
        },
      ],
    },

    {
      icon: FaProductHunt,
      label: "Category Wise Products",
      key: "category-wise-product-list",
      href: "/kry-admin-portal/category-wise-product-list",
    },
    {
      icon: FaProductHunt,
      label: "Brand Wise Products",
      key: "brand-wise-product-list",
      href: "/kry-admin-portal/brand-wise-product-list",
    },
    {
      icon: MdCategory,
      label: "Attributes",
      key: "storage-list",
      href: "/kry-admin-portal/storage-list",
      subSubLinks: [
        {
          icon: ListIcon,
          label: "New Attribute",
          key: "feature-key-list",
          href: "/kry-admin-portal/feature-key-list",
        },
        {
          icon: List,
          label: "Ram List",
          key: "ram-list",
          href: "/kry-admin-portal/ram-list",
        },
        {
          icon: List,
          label: "Rom List",
          key: "rom-list",
          href: "/kry-admin-portal/rom-list",
        },
        {
          icon: List,
          label: "Sim List",
          key: "sim-list",
          href: "/kry-admin-portal/sim-list",
        },
        {
          icon: List,
          label: "Region List",
          key: "region-list",
          href: "/kry-admin-portal/region-list",
        },
        {
          icon: List,
          label: "Chipset List",
          key: "chipset-list",
          href: "/kry-admin-portal/chipset-list",
        },

        {
          icon: List,
          label: "Material List",
          key: "strap-marerial-list",
          href: "/kry-admin-portal/strap-marerial-list",
        },
        {
          icon: List,
          label: "Connectivity List",
          key: "connectivity-list",
          href: "/kry-admin-portal/connectivity-list",
        },
        {
          icon: List,
          label: "Connector List",
          key: "connector-type-list",
          href: "/kry-admin-portal/connector-type-list",
        },
        {
          icon: List,
          label: "Plug List",
          key: "plug-type-list",
          href: "/kry-admin-portal/plug-type-list",
        },
        {
          icon: MdCategory,
          label: "Color List",
          key: "color-list",
          href: "/kry-admin-portal/color-list",
        },
        {
          icon: MdCategory,
          label: "Size List",
          key: "size-list",
          href: "/kry-admin-portal/size-list",
        },
      ],
    },
    {
      icon: MdCategory,
      label: "Partail Entry",
      key: "partial-entry",
      href: "/kry-admin-portal/partial-entry",
      subSubLinks: [
        {
          icon: MdCategory,
          label: "Category List",
          key: "category_list",
          href: "/kry-admin-portal/category_list",
        },
        {
          icon: MdCategory,
          label: "SubCategory List",
          key: "sub_category_list",
          href: "/kry-admin-portal/sub_category_list",
        },

        {
          icon: MdCategory,
          label: "Brand List",
          key: "brand-list",
          href: "/kry-admin-portal/brand-list",
        },
        {
          icon: List,
          label: "HighLight Text List",
          key: "highlight-text-list",
          href: "/kry-admin-portal/highlight-text-list",
        },

        {
          icon: ListIcon,
          label: "Feature",
          key: "feature-list",
          href: "/kry-admin-portal/feature-list",
        },
        {
          icon: List,
          label: "Vendor List",
          key: "vendor-list",
          href: "/kry-admin-portal/vendor-list",
        },
        {
          icon: ListIcon,
          label: "Conditions List",
          key: "condition-list",
          href: "/kry-admin-portal/condition-list",
        },
        {
          icon: ListIcon,
          label: "Search Placeholder List",
          key: "search-list",
          href: "/kry-admin-portal/search-list",
        },
        {
          icon: MdCategory,
          label: "Banner List",
          key: "banner-list",
          href: "/kry-admin-portal/banner-list",
        },
        {
          icon: MdCategory,
          label: "Small Banner List",
          key: "small-banner-list",
          href: "/kry-admin-portal/small-banner-list",
        },
        {
          icon: List,
          label: "Extra-Warranty List",
          key: "warranty-list",
          href: "/kry-admin-portal/warranty-list",
        },
        {
          icon: List,
          label: "Regular Warranty",
          key: "regular-warranty",
          href: "/kry-admin-portal/regular-warranty",
        },
        {
          icon: List,
          label: "Warranty Info",
          key: "warranty-info",
          href: "/kry-admin-portal/warranty-info",
        },
      ],
    },
    {
      icon: FaProductHunt,
      label: "Best Deals",
      key: "best-deal-wise-product-list",
      href: "/kry-admin-portal/best-deal-wise-product-list",
    },
    {
      icon: FaProductHunt,
      label: "Popular Product",
      key: "best-deal-popular-product",
      href: "/kry-admin-portal/best-deal-popular-product",
    },
    {
      icon: FaProductHunt,
      label: "New Arrival Product",
      key: "best-deal-arrival-product",
      href: "/kry-admin-portal/best-deal-arrival-product",
    },
    {
      icon: List,
      label: "Variations",
      key: "variations",
      href: "/kry-admin-portal/variations",
    },
    {
      icon: List,
      label: "Options",
      key: "options",
      href: "/kry-admin-portal/options",
    },
    {
      icon: List,
      label: "Tags",
      key: "tags",
      href: "/kry-admin-portal/tags",
    },
    {
      icon: List,
      label: "Reviews",
      key: "reviews",
      href: "/kry-admin-portal/reviews",
    },
    {
      icon: List,
      label: "Product Search",
      key: "product-search",
      href: "/kry-admin-portal/product-search",
    },
  ],
};

export const adminDashboardOffer = {
  icon: MdCategory,
  label: "Offers",
  key: "offer_list",
  href: "/kry-admin-portal/offer_list",
  subLinks: [
    {
      icon: FaProductHunt,
      label: "Create Offer",
      key: "create-offer",
      href: "/kry-admin-portal/create-offer",
    },
    {
      icon: FaProductHunt,
      label: "Offer List",
      key: "offer-list",
      href: "/kry-admin-portal/offer-list",
    },
    {
      icon: FaProductHunt,
      label: "Offer Product List",
      key: "offer-product-list",
      href: "/kry-admin-portal/offer-product-list",
    },
    // {
    //   icon: FaProductHunt,
    //   label: "Category Wise Offer List",
    //   key: "category-wise-offer-list",
    //   href: "/kry-admin-portal/category-wise-offer-list",
    // },
    // {
    //   icon: FaProductHunt,
    //   label: "SubCategory Wise Offer List",
    //   key: "subcategory-wise-offer-list",
    //   href: "/kry-admin-portal/subcategory-wise-offer-list",
    // },
    {
      icon: FaProductHunt,
      label: "Tag Wise Offer List",
      key: "brand-wise-offer-list",
      href: "/kry-admin-portal/brand-wise-offer-list",
    },
    {
      icon: FaProductHunt,
      label: "Tag Wise Offer Image",
      key: "brand-wise-offer-image",
      href: "/kry-admin-portal/brand-wise-offer-image",
    },

    {
      icon: FaProductHunt,
      label: "Gift List",
      key: "gift-list",
      href: "/kry-admin-portal/gift-list",
    },
    // {
    //   icon: FaProductHunt,
    //   label: "Delivery Campaign List",
    //   key: "delivery-campaign-list",
    //   href: "/kry-admin-portal/delivery-campaign-list",
    // },
  ],
};

const adminDashboardMedia = {
  icon: List,
  label: "Media",
  key: "media-list",
  href: "/kry-admin-portal/media-list",
  subLinks: [
    {
      icon: List,
      label: "All Media",
      key: "company-gallery",
      href: "/kry-admin-portal/company-gallery",
    },
    // {
    //   icon: List,
    //   label: "Category Banner",
    //   key: "category-banner",
    //   href: "/kry-admin-portal/category-banner",
    // },
    // {
    //   icon: List,
    //   label: "Brand Logo",
    //   key: "brand-logo",
    //   href: "/kry-admin-portal/brand-logo",
    // },
    // {
    //   icon: List,
    //   label: "Category Logo",
    //   key: "category-logo",
    //   href: "/kry-admin-portal/category-logo",
    // },
    {
      icon: List,
      label: "Banner",
      key: "banner-list",
      href: "/kry-admin-portal/banner-list",
    },
    // {
    //   icon: List,
    //   label: "Slider",
    //   key: "slider",
    //   href: "/kry-admin-portal/slider",
    // },
    // {
    //   icon: List,
    //   label: "Bulk Upload",
    //   key: "bulk-upload",
    //   href: "/kry-admin-portal/bulk-upload",
    // },
  ],
};

const adminDashboardOrders = {
  icon: List,
  label: "Orders",
  key: "order-list",
  href: "/kry-admin-portal/order-list",
  subLinks: [
    {
      icon: List,
      label: "Create Order",
      key: "create-order",
      href: "/kry-admin-portal/create-order",
    },
    {
      icon: List,
      label: "Orders List",
      key: "order-list",
      href: "/kry-admin-portal/order-list",
    },
    {
      icon: List,
      label: "Pre-Orders List",
      key: "pre-order-list",
      href: "/kry-admin-portal/pre-order-list",
    },
    {
      icon: List,
      label: "Pre-Orders Form List",
      key: "pre-order-form-list",
      href: "/kry-admin-portal/pre-order-form-list",
    },
    {
      icon: List,
      label: "Order Return",
      key: "return-order-list",
      href: "/kry-admin-portal/return-order-list",
    },
    // {
    //   icon: List,
    //   label: "Invoice",
    //   key: "inovices",
    //   href: "/kry-admin-portal/invoices",
    // },
    {
      icon: List,
      label: "Tracking",
      key: "tracking",
      href: "/kry-admin-portal/tracking",
    },
    {
      icon: List,
      label: "Shipping Method",
      key: "shipping-method",
      href: "/kry-admin-portal/shipping-method",
    },
    {
      icon: List,
      label: "Notice",
      key: "notice",
      href: "/kry-admin-portal/notice",
    },
    // {
    //   icon: MdCategory,
    //   label: "Offer & Campaign",
    //   key: "offer-list",
    //   href: "/kry-admin-portal/offer-list",
    //   subSubLinks: [
    //     {
    //       icon: List,
    //       label: "Flash Sale",
    //       key: "flash-sale",
    //       href: "/kry-admin-portal/flash-sale",
    //     },
    //     {
    //       icon: List,
    //       label: "Discount List",
    //       key: "discount-list",
    //       href: "/kry-admin-portal/discount-list",
    //     },
    //   ],
    // },
    {
      icon: MdCategory,
      label: "Announcement",
      key: "announcement",
      href: "/kry-admin-portal/announcement",
      subSubLinks: [
        {
          icon: List,
          label: "Title Announcement",
          key: "title-announcement",
          href: "/kry-admin-portal/title-announcement",
        },
        {
          icon: List,
          label: "Add Popup",
          key: "add-popup",
          href: "/kry-admin-portal/add-popup",
        },
        {
          icon: List,
          label: "Popups",
          key: "popup-list",
          href: "/kry-admin-portal/popup-list",
        },
        {
          icon: List,
          label: "Popup Setting",
          key: "popup-setting",
          href: "/kry-admin-portal/popup-setting",
        },
      ],
    },
    {
      icon: MdCategory,
      label: "Cupon",
      key: "cupon",
      href: "/kry-admin-portal/cupon",
      subSubLinks: [
        // {
        //   icon: List,
        //   label: "Create Cupon",
        //   key: "create-cupon",
        //   href: "/kry-admin-portal/create-cupon",
        // },
        {
          icon: List,
          label: "Cupon Report",
          key: "cupon-report",
          href: "/kry-admin-portal/discount_list",
        },
      ],
    },
  ],
};
const adminDashboardPages = {
  icon: List,
  label: "Pages",
  key: "pages-list",
  href: "/kry-admin-portal/pages-list",
  subLinks: [
    // {
    //   icon: MdCategory,
    //   label: "All Pages",
    //   key: "all-pages",
    //   href: "/kry-admin-portal/all-pages",
    //   subSubLinks: [
    //     {
    //       icon: List,
    //       label: "Home Page",
    //       key: "home-page",
    //       href: "/kry-admin-portal/home-page",
    //     },
    //     {
    //       icon: List,
    //       label: "About Us",
    //       key: "about-us",
    //       href: "/kry-admin-portal/about-us",
    //     },
    //     {
    //       icon: List,
    //       label: "FAQs",
    //       key: "faq",
    //       href: "/kry-admin-portal/faq",
    //     },
    //     {
    //       icon: List,
    //       label: "Contact Page",
    //       key: "contact-page",
    //       href: "/kry-admin-portal/contact-page",
    //     },
    //     {
    //       icon: List,
    //       label: "Additional Pages",
    //       key: "additional-pages",
    //       href: "/kry-admin-portal/additional-pages",
    //     },
    //     {
    //       icon: List,
    //       label: "Footer",
    //       key: "footer",
    //       href: "/kry-admin-portal/footer",
    //     },
    //     {
    //       icon: List,
    //       label: "Store Location",
    //       key: "store-location",
    //       href: "/kry-admin-portal/store-location",
    //     },
    //   ],
    // },
    {
      icon: MdCategory,
      label: "Home",
      key: "section",
      href: "/kry-admin-portal/section",
      subSubLinks: [
        {
          icon: List,
          label: "Section",
          key: "section",
          href: "/kry-admin-portal/section",
        },
        {
          icon: List,
          label: "Section Wise Product",
          key: "section-wise-product",
          href: "/kry-admin-portal/section-wise-product",
        },
      ],
    },
    {
      icon: List,
      label: "Add New Pages",
      key: "add-new-pages",
      href: "/kry-admin-portal/add-new-pages",
    },
    {
      icon: List,
      label: "Pages List",
      key: "page-list",
      href: "/kry-admin-portal/page-list",
    },
    // {
    //   icon: List,
    //   label: "SEO Information",
    //   key: "seo-information",
    //   href: "/kry-admin-portal/seo-information",
    // },
  ],
};
const adminDashboardBlog = {
  icon: MdDiscount,
  label: "Blog",
  key: "blog",
  href: "/kry-admin-portal/blog",
  subLinks: [
    {
      icon: MdDiscount,
      label: "Posts",
      key: "post",
      href: "/kry-admin-portal/post",
    },
    // {
    //   icon: MdDiscount,
    //   label: "Edit Post",
    //   key: "edit-post",
    //   href: "/kry-admin-portal/edit-post",
    // },
    {
      icon: MdDiscount,
      label: "Categories",
      key: "categories",
      href: "/kry-admin-portal/categories",
    },
    {
      icon: MdDiscount,
      label: "Tags",
      key: "tags",
      href: "/kry-admin-portal/blogTags",
    },
  ],
};
const adminDashboardApperences = {
  icon: MdDiscount,
  label: "Appearance",
  key: "appearance",
  href: "/kry-admin-portal/appearance",
  subLinks: [
    // {
    //   icon: MdDiscount,
    //   label: "Menu",
    //   key: "menu",
    //   href: "/kry-admin-portal/menu",
    // },
    {
      icon: MdDiscount,
      label: "Main Slider",
      key: "banner-list",
      href: "/kry-admin-portal/banner-list",
    },
    {
      icon: MdDiscount,
      label: "Side Slider",
      key: "small-banner-list",
      href: "/kry-admin-portal/small-banner-list",
    },
    {
      icon: MdDiscount,
      label: "Banner 1",
      key: "banner-one",
      href: "/kry-admin-portal/banner-one",
    },
    {
      icon: MdDiscount,
      label: "Banner 2",
      key: "banner-two",
      href: "/kry-admin-portal/banner-two",
    },
    // {
    //   icon: MdDiscount,
    //   label: "Banner 1",
    //   key: "banner-one",
    //   href: "/kry-admin-portal/banner-one",
    // },
    // {
    //   icon: MdDiscount,
    //   label: "Banner 2",
    //   key: "banner-two",
    //   href: "/kry-admin-portal/banner-two",
    // },
    // {
    //   icon: MdDiscount,
    //   label: "Widgets",
    //   key: "widgets",
    //   href: "/kry-admin-portal/widgets",
    // },
    // {
    //   icon: MdDiscount,
    //   label: "Theme Options",
    //   key: "theme-options",
    //   href: "/kry-admin-portal/theme-options",
    // },
    // {
    //   icon: MdDiscount,
    //   label: "Search Text",
    //   key: "search-text",
    //   href: "/kry-admin-portal/search-text",
    // },
    {
      icon: MdDiscount,
      label: "Search Text",
      key: "search-text",
      href: "/kry-admin-portal/search-text",
    },
  ],
};

const adminDashboardSystem = {
  icon: List,
  label: "System",
  key: "system",
  href: "/kry-admin-portal/system",
  subLinks: [
    {
      icon: List,
      label: "Admin Management",
      key: "admin-management",
      href: "/kry-admin-portal/admin-management",
    },

    // {
    //   icon: List,
    //   label: "Admin Management",
    //   key: "admin-management",
    //   href: "/kry-admin-portal/admin-management",
    // },
    // {
    //   icon: List,
    //   label: "Role & Permission",
    //   key: "role-permission",
    //   href: "/kry-admin-portal/role-permission",
    // },
    // {
    //   icon: List,
    //   label: "Registered Admin",
    //   key: "registered-admin",
    //   href: "/kry-admin-portal/registered-admin",
    // },
    {
      icon: List,
      label: "User",
      key: "user-list",
      href: "/kry-admin-portal/user-list",
    },
    {
      icon: List,
      label: "Activity Logs",
      key: "activity-log",
      href: "/kry-admin-portal/activity-log",
    },
    // {
    //   icon: List,
    //   label: "Tools",
    //   key: "tools",
    //   href: "/kry-admin-portal/tools",
    // },
    // {
    //   icon: MdCategory,
    //   label: "Google Analytics",
    //   key: "google",
    //   href: "/kry-admin-portal/google",
    //   subSubLinks: [
    //     {
    //       icon: List,
    //       label: "Config Credentials for Google Analytics",
    //       key: "config-credentials-for-google-analytics",
    //       href: "/kry-admin-portal/config-credentials-for-google-analytics",
    //     },

    //   ],
    // },
  ],
};
const adminDashboardGeneralSettings = {
  icon: List,
  label: "General Settings",
  key: "general-settings",
  href: "/kry-admin-portal/general-settings",

  subLinks: [
    {
      icon: List,
      label: "SMS",
      key: "otp-message",
      href: "/kry-admin-portal/otp-message",
      subSubLinks: [
        {
          icon: List,
          label: "Custom Message",
          key: "custom-message",
          href: "/kry-admin-portal/custom-message",
        },
        {
          icon: List,
          label: "Send Message",
          key: "send-message",
          href: "/kry-admin-portal/send-message",
        },
        {
          icon: List,
          label: "OTP Message",
          key: "otp-message",
          href: "/kry-admin-portal/otp-message",
        },
        {
          icon: List,
          label: "Order Creation Message",
          key: "order-creation-message",
          href: "/kry-admin-portal/order-creation-message",
        },
        {
          icon: List,
          label: "Order Confirm Message",
          key: "order-confirm-message",
          href: "/kry-admin-portal/order-confirm-message",
        },
        {
          icon: List,
          label: "Order Delivered Message",
          key: "order-delivered-message",
          href: "/kry-admin-portal/order-delivered-message",
        },
        {
          icon: List,
          label: "Order Cancel By Admin Message",
          key: "order-cancel-message",
          href: "/kry-admin-portal/order-cancel-message",
        },
        {
          icon: List,
          label: "Payment Success Message",
          key: "payment-success-message",
          href: "/kry-admin-portal/payment-success-message",
        },
        {
          icon: List,
          label: "Payment Failed Message",
          key: "payment-failed-message",
          href: "/kry-admin-portal/payment-failed-message",
        },
      ],
    },
    {
      icon: List,
      label: "Maintenance Settings",
      key: "maintenance-settings",
      href: "/kry-admin-portal/maintenance-settings",
    },
    {
      icon: List,
      label: "Pixel Script",
      key: "script-settings",
      href: "/kry-admin-portal/script-settings",
    },

    {
      icon: MdCategory,
      label: "General",
      key: "general",
      href: "/kry-admin-portal/general",
      subSubLinks: [
        // {
        //   icon: List,
        //   label: "Preloader",
        //   key: "preloader",
        //   href: "/kry-admin-portal/preloader",
        // },
        // {
        //   icon: MdCategory,
        //   label: "General",
        //   key: "general",
        //   href: "/kry-admin-portal/general",
        //   subSubLinks: [
        //     {
        //       icon: List,
        //       label: "Preloader",
        //       key: "preloader",
        //       href: "/kry-admin-portal/preloader",
        //     },

        //   ],
        // },

        // {
        //   icon: List,
        //   label: "Maintenance",
        //   key: "maintenance",
        //   href: "/kry-admin-portal/maintenance",
        // },
        {
          icon: List,
          label: "Logo",
          key: "logo",
          href: "/kry-admin-portal/logo",
        },
        // {
        //   icon: List,
        //   label: "Store",
        //   key: "store",
        //   href: "/kry-admin-portal/store",
        // },
        {
          icon: List,
          label: "Why Kry",
          key: "why-kry",
          href: "/kry-admin-portal/why-kry",
        },
        {
          icon: List,
          label: "Gateway Charge",
          key: "gateway-charge",
          href: "/kry-admin-portal/gateway-charge",
        },
        // {
        //   icon: List,
        //   label: "Shipping",
        //   key: "shipping",
        //   href: "/kry-admin-portal/shipping",
        // },

        {
          icon: List,
          label: "EMI",
          key: "emi-list",
          href: "/kry-admin-portal/emi-list",
        },
        // {
        //   icon: List,
        {
          icon: List,
          label: "Marquee Setting",
          key: "marquee",
          href: "/kry-admin-portal/marquee",
        },
        {
          icon: List,
          label: "Grid",
          key: "grid",
          href: "/kry-admin-portal/grid",
        },
        {
          icon: List,
          label: "Registration Point",
          key: "registration",
          href: "/kry-admin-portal/registration",
        },
        {
          icon: List,
          label: "Shipping Minimum Charge",
          key: "shipping-minimu-charge",
          href: "/kry-admin-portal/shipping-minimu-charge",
        },
        {
          icon: List,
          label: "Booking Minimum Amount",
          key: "booking-minimum-amount",
          href: "/kry-admin-portal/booking-minimum-amount",
        },
        {
          icon: List,
          label: "Advance Delivery Charge",
          key: "advance-delivery-charge",
          href: "/kry-admin-portal/advance-delivery-charge",
        },
        {
          icon: List,
          label: "Payment Disable",
          key: "payment-disable",
          href: "/kry-admin-portal/payment-disable",
        },

        // {
        //   icon: List,
        //   label: "Shipping",
        //   key: "shipping",
        //   href: "/kry-admin-portal/shipping",
        // },
        // {
        //   icon: List,
        //   label: "Payment",
        //   key: "payment",
        //   href: "/kry-admin-portal/payment",
        // },
        // {
        //   icon: List,
        //   label: "EMI",
        //   key: "emi",
        //   href: "/kry-admin-portal/emi",
        // },
        // {
        //   icon: List,
        //   label: "PWA",
        //   key: "pwa",
        //   href: "/kry-admin-portal/pwa",
        // },

        // {
        //   icon: MdCategory,
        //   label: "General",
        //   key: "general",
        //   href: "/kry-admin-portal/general",
        //   subSubLinks: [
        //     {
        //       icon: List,
        //       label: "Preloader",
        //       key: "preloader",
        //       href: "/kry-admin-portal/preloader",
        //     },

        //   ],
        // },

        // {
        //   icon: List,
        //   label: "Maintenance",
        //   key: "maintenance",
        //   href: "/kry-admin-portal/maintenance",
        // },
        // {
        //   icon: List,
        //   label: "Logo",
        //   key: "logo",
        //   href: "/kry-admin-portal/logo",
        // },
        // {
        //   icon: List,
        //   label: "Store",
        //   key: "store",
        //   href: "/kry-admin-portal/store",
        // },
        // {
        //   icon: List,
        //   label: "Shipping",
        //   key: "shipping",
        //   href: "/kry-admin-portal/shipping",
        // },
        {
          icon: List,
          label: "Payment",
          key: "payment",
          href: "/kry-admin-portal/payment",
        },
        {
          icon: List,
          label: "EMI Bank",
          key: "emi-bank",
          href: "/kry-admin-portal/bank-list",
        },
        // {
        //   icon: List,
        // {
        //    icon: List,
        //   label: "Marquee Setting",
        //   key: "marquee",
        //   href: "/kry-admin-portal/marquee",
        // },
        // {
        //    icon: List,
        //   label: "Shipping Minimum Charge",
        //   key: "shipping-minimu-charge",
        //   href: "/kry-admin-portal/shipping-minimu-charge",
        // },
        // {
        //   icon: List,
        //   label: "Shipping",
        //   key: "shipping",
        //   href: "/kry-admin-portal/shipping",
        // },
        // {
        //   icon: List,
        //   label: "Payment",
        //   key: "payment",
        //   href: "/kry-admin-portal/payment",
        // },
        // {
        //   icon: List,
        //   label: "EMI",
        //   key: "emi",
        //   href: "/kry-admin-portal/emi",
        // },
        // {
        //   icon: List,
        //   label: "PWA",
        //   key: "pwa",
        //   href: "/kry-admin-portal/pwa",
        // },

        // {
        //   icon: List,
        //   label: "SMS",
        //   key: "otp-message",
        //   href: "/kry-admin-portal/otp-message",
        //   subSubLinks: [

        //     {
        //       icon: List,
        //       label: "OTP Message",
        //       key: "otp-message",
        //       href: "/kry-admin-portal/otp-message",
        //     },
        //     {
        //       icon: List,
        //       label: "COURIER",
        //       key: "courier",
        //       href: "/kry-admin-portal/courier",
        //     },
        //     // {
        //     //   icon: List,
        //     //   label: "SMS",
        //     //   key: "sms",
        //     //   href: "/kry-admin-portal/sms",
        //     // },
        //     // {
        //     //   icon: List,
        //     //   label: "Mail",
        //     //   key: "mail",
        //     //   href: "/kry-admin-portal/mail",
        //     // },
        //     // {
        //     //   icon: List,
        //     //   label: "NewsLetter",
        //     //   key: "newsletter",
        //     //   href: "/kry-admin-portal/newsletter",
        //     // },
        //     // {
        //     //   icon: List,
        //     //   label: "Google reCAPTCHA",
        //     //   key: "google-recaptcha",
        //     //   href: "/kry-admin-portal/google-recaptcha",
        //     // },
        //   ],
        // },
        // {
        //   label: "Order Creation Message",
        //   key: "order-creation-message",
        //   href: "/kry-admin-portal/order-creation-message",
        // },
        // {
        //   icon: List,
        //   label: "Order Confirm Message",
        //   key: "order-confirm-message",
        //   href: "/kry-admin-portal/order-confirm-message",
        // },
        // {
        //   icon: List,
        //   label: "Order Delivered Message",
        //   key: "order-delivered-message",
        //   href: "/kry-admin-portal/order-delivered-message",
        // },
        // {
        //   icon: List,
        //   label: "Order Cancel By Admin Message",
        //   key: "order-cancel-message",
        //   href: "/kry-admin-portal/order-cancel-message",
        // },
        // {
        //   icon: List,
        //   label: "Payment Success Message",
        //   key: "payment-success-message",
        //   href: "/kry-admin-portal/payment-success-message",
        // },
        // {
        //   icon: List,
        //   label: "Payment Failed Message",
        //   key: "payment-failed-message",
        //   href: "/kry-admin-portal/payment-failed-message",
        // },
      ],
    },

    {
      icon: List,
      label: "Courier",
      key: "courier",
      href: "/kry-admin-portal/courier",
    },
    {
      icon: List,
      label: "Branch",
      key: "branch",
      href: "/kry-admin-portal/branch",
    },

    // {
    //   icon: List,
    //   label: "SMS",
    //   key: "sms",
    //   href: "/kry-admin-portal/sms",
    // },
    // {
    //   icon: List,
    //   label: "Mail",
    //   key: "mail",
    //   href: "/kry-admin-portal/mail",
    // },
    // {
    //   icon: List,
    //   label: "NewsLetter",
    //   key: "newsletter",
    //   href: "/kry-admin-portal/newsletter",
    // },
    // {
    //   icon: List,
    //   label: "Google reCAPTCHA",
    //   key: "google-recaptcha",
    //   href: "/kry-admin-portal/google-recaptcha",
    // },
  ],
};

// const adminDashboardDiscount = {
//   icon: MdDiscount,
//   label: "Discount List",
//   key: "discount_list",
//   href: "/kry-admin-portal/discount_list",
//   subLinks: [
//     {
//       icon: MdDiscount,
//       label: "Discount List",
//       key: "disount_list",
//       href: "/kry-admin-portal/discount_list",
//     },
//   ],
// };
// const adminDashboardCustomer = {
//   icon: MdDiscount,
//   label: "Customer List",
//   key: "customer_list",
//   href: "/kry-admin-portal/customer_list",
//   subLinks: [
//     {
//       icon: MdDiscount,
//       label: "Customer List",
//       key: "customer_list",
//       href: "/kry-admin-portal/customer_list",
//     },
//   ],
// };

// const adminDashboardCompany = {
//   icon: List,
//   label: "Settings",
//   key: "company-info",
//   href: "/kry-admin-portal/company-info",
//   subLinks: [
//     {
//       icon: List,
//       label: "Settings",
//       key: "company-info",
//       href: "/kry-admin-portal/company-info",
//     },

//   ],
// };

// const adminDashboardUser = {
//   icon: List,
//   label: "User",
//   key: "user",
//   href: "/kry-admin-portal/user",
//   subLinks: [
//     {
//       icon: List,
//       label: "Add User",
//       key: "add-user",
//       href: "/kry-admin-portal/add-user",
//     },
//     {
//       icon: List,
//       label: "User List",
//       key: "user-list",
//       href: "/kry-admin-portal/user-list",
//     },
//   ],
// };
// const adminDashboardReport = {
//   icon: List,
//   label: "Report",
//   key: "report",
//   href: "/kry-admin-portal/report",
//   subLinks: [
//     {
//       icon: List,
//       label: "Sales Report By Order",
//       key: "sales-report-by-order",
//       href: "/kry-admin-portal/sales-report-by-order",
//     },
//     {
//       icon: List,
//       label: "Sales Report By Product",
//       key: "sales-report-by-product",
//       href: "/kry-admin-portal/sales-report-by-product",
//     },
//   ],
// };
// const adminDashboardBank = {
//   icon: List,
//   label: "EMI List",
//   key: "emi-list",
//   href: "/kry-admin-portal/emi-list",
//   subLinks: [
//     {
//       icon: List,
//       label: "Bank List",
//       key: "bank-list",
//       href: "/kry-admin-portal/bank-list",
//     },
//     {
//       icon: List,
//       label: "Emi List",
//       key: "emi-list",
//       href: "/kry-admin-portal/emi-list",
//     },
//   ],
// };

// const adminDashboardStorage = {
//   icon: List,
//   label: "Variations",
//   key: "storage-list",
//   href: "/kry-admin-portal/storage-list",
//   subLinks: [
//     {
//       icon: List,
//       label: "Whatsapp List",
//       key: "whatsapp-list",
//       href: "/kry-admin-portal/whatsapp-list",
//     },
//   ],
// };

export const adminNavigationLinks: INavigationLinks[] = [
  { ...admindashboardRootLinks },
  { ...admindashboarCustomers },
  // { ...adminDashboardUser },
  { ...adminDashboardProduct },
  { ...adminDashboardOffer },
  // { ...adminDashboardStorage },
  // { ...adminDashboardBank },
  { ...adminDashboardMedia },
  { ...adminDashboardOrders },
  { ...adminDashboardPages },
  { ...adminDashboardBlog },
  { ...adminDashboardApperences },
  { ...adminDashboardSystem },
  { ...adminDashboardGeneralSettings },
  // { ...adminDashboardCustomer },
  // { ...adminDashboardReport },
  // { ...adminDashboardDiscount },
  // { ...adminDashboardCompany },
];
