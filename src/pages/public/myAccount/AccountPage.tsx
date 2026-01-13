// Update the AccountPage.tsx
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import {
  CircleUser,
  GitCompareArrows,
  Heart,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import AccountDetails from "./AccountDetails";
import OrderTable from "./OrderTable";
import ProductCompare from "./ProductCompare";
import WishProductList from "./WishProductList";
import ReturnOrderList from "./ReturnOrderList";
import { SiToggltrack } from "react-icons/si";
import TruckOrder from "./TruckOrder";
import ChangePassword from "./ChangePassword";
import { MdOutlineLock } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TfiControlPlay } from "react-icons/tfi";
import ShippingAddress from "./ShippingAddress";
import ShippingInfo from "./ShippingInfo";
import { CiWallet } from "react-icons/ci";
import WalletPoints from "./WalletPoints";
import { useSearchParams } from "react-router-dom";

const tabs = [
  {
    id: "customer-info",
    label: "Customer Info",
    icon: (active: boolean) => (
      <CircleUser className={active ? "text-black" : "text-gray-400"} />
    ),
  },
  {
    id: "order",
    label: "Order",
    icon: (active: boolean) => (
      <AiOutlineShoppingCart
        className={`text-3xl ${active ? "text-black" : "text-gray-400"}`}
      />
    ),
  },
  {
    id: "wallet",
    label: "Wallet Point",
    icon: (active: boolean) => (
      <CiWallet
        className={`text-3xl ${active ? "text-black" : "text-gray-400"}`}
      />
    ),
  },
  {
    id: "return-order",
    label: "Return Order",
    icon: (active: boolean) => (
      <ShoppingBag className={active ? "text-black" : "text-gray-400"} />
    ),
  },
  {
    id: "track-order",
    label: "Track Order",
    icon: (active: boolean) => (
      <SiToggltrack
        className={`text-2xl ${active ? "text-black" : "text-gray-400"}`}
      />
    ),
  },

  {
    id: "wishlist",
    label: "Wishlist",
    icon: (active: boolean) => (
      <Heart className={active ? "text-black" : "text-gray-400"} />
    ),
  },
  {
    id: "compare",
    label: "Compare",
    icon: (active: boolean) => (
      <GitCompareArrows className={active ? "text-black" : "text-gray-400"} />
    ),
  },
  {
    id: "shipping-address",
    label: "Shipping Address",
    icon: (active: boolean) => (
      <MapPin className={active ? "text-black" : "text-gray-400"} />
    ),
  },
  {
    id: "Change-password",
    label: "Change Password",
    icon: (active: boolean) => (
      <MdOutlineLock
        className={`text-4xl ${active ? "text-black" : "text-gray-400"}`}
      />
    ),
  },
];

const AccountPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("customer-info");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("type");
    if (tabParam === "orders") {
      setActiveTab("order");
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <PageWrapper className="mb-10">
      <SectionWrapper>
        <div className="grid grid-cols-12 gap-5 pt-3 lg:px-6 bg-gray-100 relative">
          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden fixed top-14 left-1 z-50 bg-white p-2 rounded-md shadow-md transition-transform"
          >
            <TfiControlPlay
              size={20}
              className={`transform transition-transform duration-300 ${
                mobileSidebarOpen
                  ? "rotate-180 text-red-500"
                  : "rotate-0 text-gray-700"
              }`}
            />
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden -mt-5 ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ top: "80px" }}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-center">
                <h3 className="text-lg font-semibold">My Account</h3>
              </div>
              <ul className="space-y-4 p-5">
                {tabs.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <li
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`flex items-center pb-[14px] cursor-pointer text-lg ${
                        isActive
                          ? "text-red-500"
                          : "text-gray-700 hover:font-semibold"
                      } ${index !== tabs.length - 1 ? "" : ""}`}
                    >
                      <span className="mr-2 w-10 h-10 flex items-center justify-center">
                        {tab.icon(isActive)}
                      </span>
                      {tab.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Desktop Sidebar Tabs */}
          <div className="col-span-3 hidden lg:block shadow-sm sticky top-24 self-start">
            <ul className="space-y-4 bg-white p-5 min-h-[80%]">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                return (
                  <li
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center pb-[14px] cursor-pointer text-lg ${
                      isActive
                        ? "text-red-500"
                        : "text-gray-700 hover:font-semibold"
                    } ${index !== tabs.length - 1 ? "" : ""}`}
                  >
                    <span className="mr-2 w-10 h-10 flex items-center justify-center">
                      {tab.icon(isActive)}
                    </span>
                    {tab.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 px-0 lg:mt-2 lg:px-5 relative">
            {(() => {
              switch (activeTab) {
                case "customer-info":
                  return <AccountDetails />;
                case "order":
                  return <OrderTable />;
                case "wallet":
                  return <WalletPoints />;
                case "return-order":
                  return <ReturnOrderList />;
                case "track-order":
                  return <TruckOrder />;
                case "shipping-info":
                  return <ShippingInfo />;
                case "wishlist":
                  return <WishProductList />;
                case "compare":
                  return <ProductCompare />;
                case "shipping-address":
                  return <ShippingAddress />;
                case "Change-password":
                  return <ChangePassword />;
                default:
                  return <AccountDetails />;
              }
            })()}
          </div>
        </div>
      </SectionWrapper>
    </PageWrapper>
  );
};

export default AccountPage;
