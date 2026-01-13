import { Link } from "react-router-dom";
import { IoMdGitCompare } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useCart } from "@/components/context/CartContext";
import { BsShop } from "react-icons/bs";
import { TfiShoppingCart } from "react-icons/tfi";
import { TiHomeOutline } from "react-icons/ti";

const BottomNav = () => {
  const { cart } = useCart();
  return (
    <div className="fixed z-40 bottom-0 w-full bg-white text-primary text-center flex justify-around items-center py-2 border-t border-gray-500">
      {/* Pre-Order Section */}
      <Link to="/" className="flex flex-col items-center">
        <TiHomeOutline className="text-xl" />
        <span className="text-xs font-semibold">Home</span>
      </Link>
      <Link to="/pre-order-form" className="flex flex-col items-center">
        <BsShop className="text-xl" />
        <span className="text-xs font-semibold">Pre-Order</span>
      </Link>

      {/* Cart Section */}
      <Link to="/cart" className="relative flex flex-col items-center">
       <TfiShoppingCart className="text-xl" />
        <h3 className="text-xs flex items-center gap-1 font-bold ">
          Cart{" "}
          <span className="w-4 h-4 pb-0.5 pr-[1px] rounded-full flex items-center justify-center text-white text-xs bg-[#D62020]">
            {cart?.length || 0}
          </span>
        </h3>
      </Link>

      {/* Account Section */}
      <Link to="/my-account" className="flex flex-col items-center">
        <FaUser size={20} className="" />
        <span className=" text-xs font-semibold">Account</span>
      </Link>

      {/* Compare Section */}
     <Link to={"/product-compare"}> <div className="relative flex flex-col items-center" title="Compare">
        <IoMdGitCompare size={20} className="" />
        <span className=" text-xs font-semibold">Compare</span>
      </div></Link>
    </div>
  );
};

export default BottomNav;
