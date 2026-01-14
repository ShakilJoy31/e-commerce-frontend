import { selectUser } from "@/components/store/store";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiMenu } from "react-icons/fi";
import { MdOutlineCached } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/icon/favicon.png";
import { useGetCompanyInfoAllQuery } from "@/components/store/api/company/companyApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useDeleteCasheMutation } from "@/components/store/api/user/userApi";
import toast from "react-hot-toast";

interface AdminUpperNavigationProps {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminUpperNavigation({
  setMobileSidebarOpen,
}: AdminUpperNavigationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: info } = useGetCompanyInfoAllQuery({});
  const [modalOpen, setModalOpen] = useState(false);
  const [clearCache, { isLoading: deleteLoading }] = useDeleteCasheMutation();
  // useEffect(() => {
  //   if (info?.data[0]?.sms < 10) {
  //     setModalOpen(true);
  //   }
  // }, [info?.data]);

  const handleLogout = () => {
    shareWithCookies("remove", "__t_beta__token");
    window.location.reload();
    navigate("/kry-admin-portal/admin-login", { replace: true });
  };

  const handleCacheClean = async () => {
    try {
      const result = await clearCache(null).unwrap();
      if (result?.success) {
        toast.success("Cache cleared successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  // Handle Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!user?.role) {
      navigate("/kry-admin-portal/admin-login", { replace: true });
    }
  }, [user?.role, navigate]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        bg-primary text-white px-6 py-2 flex justify-between items-center`}
    >
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-5 flex flex-col items-center"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatType: "reverse",
              }}
              className="bg-red-500 text-white p-6 rounded-full"
            >
              <FiAlertTriangle className="text-5xl" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-800 mt-5">Warning</h1>
            <p className="text-gray-700 mt-2 text-center text-xl font-semibold">
              Your current SMS is{" "}
              {/* <span className="text-primary font-bold text-lg">
                {info?.data[0]?.sms}
              </span> */}
              . Please recharge fast!
            </p>
          </motion.div>
          <div className="flex items-center justify-end">
            <Button variant={"destructive"} onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link to={"/"} className="flex items-center gap-2">
          <img className="w-16" src={logo} alt="logo" />
          <span className="text-xl font-bold">Kry International</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="text-2xl lg:hidden"
        >
          <FiMenu />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col font-semibold">
          {/* <p>Current SMS : {info?.data[0]?.sms}</p> */}
          {/* <p>
            SMS Send <span className="ml-[18px]">:</span>{" "}
            {info?.data[0]?.smsCount}
          </p> */}
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="">
                <MdOutlineCached size={30}/>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to clear cache?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-destructive-fill">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleCacheClean()}>
                  {deleteLoading && <ButtonLoader />} Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* <div className="relative cursor-pointer">
          <IoMdNotificationsOutline size={24} />
          <span className="absolute -top-1 -right-2 bg-blue-500 text-xs px-1 rounded-full">
            5
          </span>
        </div>
        <div className="relative cursor-pointer">
          <MdOutlineMessage size={24} />
          <span className="absolute -top-1 -right-2 bg-blue-500 text-xs px-1 rounded-full">
            3
          </span>
        </div> */}
        <div className="relative" ref={dropdownRef}>
          {/* User Icon */}
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 text-center text-white flex items-center justify-center">
              A
            </div>
            <span>{user?.role}</span>
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-10">
              <Link
                to="/kry-admin-portal/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link to="/" className="block px-4 py-2 hover:bg-gray-100">
                Home
              </Link>
              <Link
                to="/kry-admin-portal/admin-change-password"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
