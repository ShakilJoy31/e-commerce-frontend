import { useState } from "react";
import { FaTruck } from "react-icons/fa";
import {
  IoClose,
  IoLocationSharp,
  IoMenu,
  IoPersonAddOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

export default function ResponsiveNavigation({ publicNavigationLinks }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-primary text-white">
      <div className="max-w-[1650px] mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <h3 className="text-[20px] font-bold">KRY International</h3>

        {/* Hamburger Icon for Mobile */}
        <button
          className="lg:hidden flex items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? (
            <IoClose className="text-[24px]" />
          ) : (
            <IoMenu className="text-[24px]" />
          )}
        </button>

        {/* Navigation Links for Desktop */}
        <div className="hidden lg:flex gap-6">
          {publicNavigationLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              className={`text-white font-semibold text-[14px] hover:border-b-2 ${
                location.pathname === link.href ? "border-b-2 border-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex gap-4 items-center">
          <button className="flex gap-2 items-center text-[12px] font-bold">
            <FaTruck />
            Track Your Order
          </button>
          <button className="flex gap-2 items-center text-[12px] font-bold">
            <IoLocationSharp />
            Location
          </button>
          <button className="flex gap-2 items-center text-[12px] font-bold">
            <IoPersonAddOutline />
            Sign in or register
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isDropdownOpen && (
        <div className="lg:hidden bg-white text-black rounded-lg shadow-lg p-4">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3 mb-4">
            {publicNavigationLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-black font-semibold text-[14px] hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="flex gap-2 items-center text-[12px] font-bold">
              <FaTruck />
              Track Your Order
            </button>
            <button className="flex gap-2 items-center text-[12px] font-bold">
              <IoLocationSharp />
              Location
            </button>
            <button className="flex gap-2 items-center text-[12px] font-bold">
              <IoPersonAddOutline />
              Sign in or register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
