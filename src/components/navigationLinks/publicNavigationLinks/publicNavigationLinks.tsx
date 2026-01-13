import { IconType } from "react-icons"; // Import IconType
import { LuListOrdered, LuUsers } from "react-icons/lu";

export interface INavigationLinks {
  icon?: IconType; // Change from string to IconType
  label: string; // Simplify the label to a string
  key: string;
  href: string;
}

// Main navigation links
export const publicNavigationLinks: INavigationLinks[] = [
  {
    icon: LuUsers,
    label: "Home",
    key: "home",
    href: "/",
  },
  {
    icon: LuListOrdered,
    label: "Products",
    key: "products",
    href: "/products",
  },
  {
    icon: LuListOrdered,
    label: "Apple Products",
    key: "apple-products",
    href: "/apple-products",
  },
  {
    icon: LuListOrdered,
    label: "Top Brand",
    key: "top_brand",
    href: "/top_brand",
  },
  {
    icon: LuListOrdered,
    label: "About Us",
    key: "about-us",
    href: "/about-us",
  },
  {
    icon: LuListOrdered,
    label: "Contact Us",
    key: "contact-us",
    href: "/contact-us",
  },
  {
    icon: LuListOrdered,
    label: "Blog",
    key: "blog",
    href: "/blog",
  },
];
