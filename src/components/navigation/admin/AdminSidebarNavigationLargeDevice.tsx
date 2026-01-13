import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { adminNavigationLinks } from "@/components/navigationLinks/adminNavigationLink/adminNavigationLinks";
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
import { LucideLogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { motion, AnimatePresence } from "framer-motion";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { shareWithLocal } from "@/utils/helper/shareWithLocal";
// import { useSelector } from "react-redux";
// import { selectUser } from "@/components/store/store";
import { useGetUserNotificationQuery } from "@/components/store/api/user/userApi";

const AdminSidebarNavigation = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: any;
  setSidebarOpen: (value) => void;
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("SUPER_ADMIN"); // Default role
  // const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Fetch notification data with polling
  const { data: notificationData } = useGetUserNotificationQuery(
    {},
    {
      pollingInterval: 300000,
    }
  );

  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    shareWithLocal("remove", `${appConfiguration.appCode}user`);
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // Role options for testing
  const roleOptions = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "OPERATION_ADMIN", label: "Operation Admin" },
    { value: "OPERATION_MANAGER", label: "Operation Manager" },
    { value: "SUPPORT_EXECUTIVE", label: "Support Executive" },
  ];

  // Filter navigation links based on selected role
  const filteredNavigationLinks = adminNavigationLinks.filter((link) => {
    // Use selectedRole for testing instead of user?.role
    const role = selectedRole;

    // Super Admin has access to everything
    if (role === "SUPER_ADMIN") return true;

    // Operation Admin can't access finance and delete options
    if (role === "OPERATION_ADMIN") {
      if (link.label === "Finance" || link.label === "Delete") return false;
      return true;
    }

    // Operation Manager can create/edit products and discounts but can't access finance
    if (role === "OPERATION_MANAGER") {
      if (link.label === "Finance" || link.label === "Settings") return false;
      return ["Products", "Discounts", "Categories", "Orders"].includes(
        link.label
      );
    }

    // Support Executive can only access orders and customer details
    if (role === "SUPPORT_EXECUTIVE") {
      return ["Orders", "Customers"].includes(link.label);
    }

    return false;
  });

  // Function to get the count for a specific label
  const getCountForLabel = (label: string) => {
    if (!notificationData?.data) return null;

    switch (label) {
      case "Orders":
        return notificationData.data.orderCount > 0
          ? notificationData.data.orderCount
          : null;
      case "Customers":
        return notificationData.data.customerCount > 0
          ? notificationData.data.customerCount
          : null;
      case "Pre-Orders List":
        return notificationData.data.preOrderCount > 0
          ? notificationData.data.preOrderCount
          : null;
      case "Pre-Orders Form List":
        return notificationData.data.preOrderFormCount > 0
          ? notificationData.data.preOrderFormCount
          : null;
      case "Orders List":
        return notificationData.data.orderCount > 0
          ? notificationData.data.orderCount
          : null;
      case "Order Return":
        return notificationData?.data?.returnOrderCount > 0
          ? notificationData?.data?.returnOrderCount
          : null;
      default:
        return null;
    }
  };

  return (
    <motion.aside
      initial={{ width: sidebarOpen ? 70 : 280 }}
      animate={{ width: sidebarOpen ? 280 : 70 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-primary text-white fixed h-full pb-16 mt-20 shadow-lg z-40 border-r dark:border-border flex flex-col"
    >
      {/* ROLE SELECTOR FOR TESTING */}
      {sidebarOpen && (
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} />
            <span className="text-sm font-medium">Test Role:</span>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-blue-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-white/70 flex items-center gap-1">
            <Settings size={12} />
            <span>Currently testing as: {selectedRole.replace("_", " ")}</span>
          </div>
        </div>
      )}

      {/* BRAND HEADER */}
      <div className="p-4 flex items-center justify-between">
        <Link to="/">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -20 }}
            transition={{ duration: 0.2 }}
            className={`text-2xl font-semibold ${!sidebarOpen && "hidden"}`}
          >
            KRY Dashboard
          </motion.h1>
        </Link>
        <button
          onClick={() => setSidebarOpen((prev: any) => !prev)}
          className="text-2xl"
        >
          <FiMenu />
        </button>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        <div className="px-4 py-2 text-xs text-white/70">
          {sidebarOpen && (
            <div className="flex justify-between items-center">
              <span>Showing {filteredNavigationLinks.length} items</span>
              <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                {selectedRole.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
        <ul className="mt-2">
          {filteredNavigationLinks.map((link, index) => {
            const totalCount =
              link.label === "Orders" && notificationData?.data
                ? notificationData.data.orderCount +
                  notificationData.data.customerCount +
                  notificationData.data.preOrderCount +
                  notificationData.data.preOrderFormCount
                : null;

            const labelWithCount = totalCount
              ? `${link.label} (${totalCount})`
              : link.label;

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="relative"
              >
                {/* MAIN NAV ITEM */}
                {!link.subLinks ? (
                  <NavLink
                    to={link.href || "#"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-3 gap-3 text-white transition-all w-full justify-between hover:bg-blue-600 dark:hover:bg-gray-700",
                        isActive ? "bg-white text-black font-semibold" : ""
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && <link.icon size={20} />}
                      {sidebarOpen && <span>{labelWithCount}</span>}
                    </div>
                    {/* Badge for collapsed sidebar */}
                    {!sidebarOpen && totalCount && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {totalCount}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <button
                    onClick={() =>
                      setActiveSubmenu(
                        activeSubmenu === link.label ? null : link.label
                      )
                    }
                    className="flex items-center px-4 py-3 gap-3 text-white transition-all rounded-md w-full justify-between hover:bg-blue-600 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && <link.icon size={20} />}
                      {sidebarOpen && <span>{labelWithCount}</span>}
                    </div>
                    {/* Badge for collapsed sidebar */}
                    {!sidebarOpen && totalCount && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {totalCount}
                      </span>
                    )}
                    {link.subLinks && sidebarOpen && (
                      <FiChevronDown
                        className={`transition-transform ${
                          activeSubmenu === link.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* SUBMENU */}
                <AnimatePresence>
                  {activeSubmenu === link.label && link.subLinks && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 border-l border-white/20 overflow-hidden"
                    >
                      {link.subLinks?.map((subLink, subIndex) => {
                        const subCount = getCountForLabel(subLink.label);
                        const subLabelWithCount = subCount
                          ? `${subLink.label} (${subCount})`
                          : subLink.label;

                        return (
                          <motion.li
                            key={subIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            {!subLink.subSubLinks ? (
                              <NavLink
                                to={subLink.href || "#"}
                                className={({ isActive }) =>
                                  cn(
                                    "block px-6 py-2 text-sm transition-all",
                                    isActive
                                      ? "bg-white text-black font-semibold"
                                      : "hover:bg-blue-600 dark:hover:bg-gray-700"
                                  )
                                }
                              >
                                {subLabelWithCount}
                              </NavLink>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    setActiveSubSubmenu(
                                      activeSubSubmenu === subLink.label
                                        ? null
                                        : subLink.label
                                    )
                                  }
                                  className="flex items-center w-full px-6 py-2 text-sm justify-between hover:bg-blue-600 dark:hover:bg-gray-700"
                                >
                                  <span>{subLabelWithCount}</span>
                                  <FiChevronDown
                                    className={`transition-transform ${
                                      activeSubSubmenu === subLink.label
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                                <AnimatePresence>
                                  {activeSubSubmenu === subLink.label && (
                                    <motion.ul
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="ml-4 border-l border-white/10"
                                    >
                                      {subLink.subSubLinks.map(
                                        (subSubLink, subSubIndex) => (
                                          <motion.li
                                            key={subSubIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                              delay: subSubIndex * 0.05,
                                            }}
                                          >
                                            <NavLink
                                              to={subSubLink.href || "#"}
                                              className={({ isActive }) =>
                                                cn(
                                                  "block px-6 py-1 text-sm transition-all",
                                                  isActive
                                                    ? "bg-white text-black font-semibold"
                                                    : "hover:bg-blue-600 dark:hover:bg-gray-700"
                                                )
                                              }
                                            >
                                              {subSubLink.label}
                                            </NavLink>
                                          </motion.li>
                                        )
                                      )}
                                    </motion.ul>
                                  )}
                                </AnimatePresence>
                              </>
                            )}
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* LOGOUT BUTTON */}
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className={`cursor-pointer flex items-center justify-center ${
                sidebarOpen
                  ? "w-3/4 my-4 h-8 mx-auto"
                  : "rounded-none md:w-[65%] lg:w-[85%] h-12"
              }`}
            >
              <LucideLogOut className="dropdown-icon size-4 mr-1" />
              <label className={`cursor-pointer ${sidebarOpen || "md:hidden"}`}>
                Logout
              </label>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? Logging out will end your
                current session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn-destructive-fill">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => handleLogout()}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p
          className={`${
            sidebarOpen
              ? "text-center text-tertiary-foreground text-xs opacity-75"
              : "hidden"
          }`}
        >
          Version: <span className="lowercase">{appConfiguration.version}</span>
        </p>
      </div>
    </motion.aside>
  );
};

export default AdminSidebarNavigation;





































































































































































































































































// import { useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { FiMenu, FiChevronDown } from "react-icons/fi";
// import { adminNavigationLinks } from "@/components/navigationLinks/adminNavigationLink/adminNavigationLinks";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { LucideLogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { appConfiguration } from "@/utils/constant/appConfiguration";
// import { motion, AnimatePresence } from "framer-motion";
// import { shareWithCookies } from "@/utils/helper/shareWithCookies";
// import { shareWithLocal } from "@/utils/helper/shareWithLocal";
// import { useSelector } from "react-redux";
// import { selectUser } from "@/components/store/store";
// import { useGetUserNotificationQuery } from "@/components/store/api/user/userApi";

// const AdminSidebarNavigation = ({
//   sidebarOpen,
//   setSidebarOpen,
// }: {
//   sidebarOpen: any;
//   setSidebarOpen: (value) => void;
// }) => {
//   const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
//   const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);
//   const user = useSelector(selectUser);
//   const navigate = useNavigate();

//   // Fetch notification data with polling
//   const { data: notificationData } = useGetUserNotificationQuery(
//     {},
//     {
//       pollingInterval: 300000, 
//     }
//   );

//   const handleLogout = async () => {
//     shareWithCookies("remove", `${appConfiguration.appCode}token`);
//     shareWithLocal("remove", `${appConfiguration.appCode}user`);
//     navigate("/login", { replace: true });
//     window.location.reload();
//   };

//   // Filter navigation links based on user role
//   const filteredNavigationLinks = adminNavigationLinks.filter((link) => {
//     // Super Admin has access to everything
//     if (user?.role === "SUPER_ADMIN") return true;

//     // Operation Admin can't delete data and can't access finance
//     if (user?.role === "OPERATION_ADMIN") {
//       if (link.label === "Finance" || link.label === "Delete") return false;
//       return true;
//     }

//     // Operation Manager can create/edit products and discounts but can't access finance
//     if (user?.role === "OPERATION_MANAGER") {
//       if (link.label === "Finance" || link.label === "Settings") return false;
//       return ["Products", "Discounts", "Categories", "Orders"].includes(
//         link.label
//       );
//     }

//     // Support Executive can only access orders and customer details
//     if (user?.role === "SUPPORT_EXECUTIVE") {
//       return ["Orders", "Customers"].includes(link.label);
//     }

//     return false;
//   });

//   // Function to get the count for a specific label
//   const getCountForLabel = (label: string) => {
//   if (!notificationData?.data) return null;
  
//   switch(label) {
//     case 'Orders':
//       return notificationData.data.orderCount > 0 ? notificationData.data.orderCount : null;
//     case 'Customers':
//       return notificationData.data.customerCount > 0 ? notificationData.data.customerCount : null;
//     case 'Pre-Orders List':
//       return notificationData.data.preOrderCount > 0 ? notificationData.data.preOrderCount : null;
//     case 'Pre-Orders Form List':
//       return notificationData.data.preOrderFormCount > 0 ? notificationData.data.preOrderFormCount : null;
//     case 'Orders List': 
//       return notificationData.data.orderCount > 0 ? notificationData.data.orderCount : null;
//     case 'Order Return': 
//       return notificationData?.data?.returnOrderCount > 0 ? notificationData?.data?.returnOrderCount : null;
//     default:
//       return null;
//   }
// };

//   return (
//     <motion.aside
//       initial={{ width: sidebarOpen ? 70 : 280 }}
//       animate={{ width: sidebarOpen ? 280 : 70 }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       className="bg-primary text-white fixed h-full pb-16 mt-20 shadow-lg z-40 border-r dark:border-border flex flex-col"
//     >
//       {/* BRAND HEADER */}
//       <div className="p-4 flex items-center justify-between">
//         <Link to="/">
//           <motion.h1
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -20 }}
//             transition={{ duration: 0.2 }}
//             className={`text-2xl font-semibold ${!sidebarOpen && "hidden"}`}
//           >
//             KRY Dashboard
//           </motion.h1>
//         </Link>
//         <button
//           onClick={() => setSidebarOpen((prev: any) => !prev)}
//           className="text-2xl"
//         >
//           <FiMenu />
//         </button>
//       </div>

//       {/* NAVIGATION LINKS */}
//       <nav className="flex-1 overflow-y-auto custom-scrollbar pb-4">
//         <ul className="mt-2">
//           {filteredNavigationLinks.map((link, index) => {
//             const totalCount =
//               link.label === "Orders" && notificationData?.data
//                 ? notificationData.data.orderCount +
//                   notificationData.data.customerCount +
//                   notificationData.data.preOrderCount +
//                   notificationData.data.preOrderFormCount
//                 : null;

//             const labelWithCount = totalCount
//               ? `${link.label} (${totalCount})`
//               : link.label;

//             return (
//               <motion.li
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05, duration: 0.2 }}
//                 className="relative"
//               >
//                 {/* MAIN NAV ITEM */}
//                 {!link.subLinks ? (
//                   <NavLink
//                     to={link.href || "#"}
//                     className={({ isActive }) =>
//                       cn(
//                         "flex items-center px-4 py-3 gap-3 text-white transition-all w-full justify-between hover:bg-blue-600 dark:hover:bg-gray-700",
//                         isActive ? "bg-white text-black font-semibold" : ""
//                       )
//                     }
//                   >
//                     <div className="flex items-center gap-3">
//                       {link.icon && <link.icon size={20} />}
//                       {sidebarOpen && <span>{labelWithCount}</span>}
//                     </div>
//                     {/* Badge for collapsed sidebar */}
//                     {!sidebarOpen && totalCount && (
//                       <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                         {totalCount}
//                       </span>
//                     )}
//                   </NavLink>
//                 ) : (
//                   <button
//                     onClick={() =>
//                       setActiveSubmenu(
//                         activeSubmenu === link.label ? null : link.label
//                       )
//                     }
//                     className="flex items-center px-4 py-3 gap-3 text-white transition-all rounded-md w-full justify-between hover:bg-blue-600 dark:hover:bg-gray-700"
//                   >
//                     <div className="flex items-center gap-3">
//                       {link.icon && <link.icon size={20} />}
//                       {sidebarOpen && <span>{labelWithCount}</span>}
//                     </div>
//                     {/* Badge for collapsed sidebar */}
//                     {!sidebarOpen && totalCount && (
//                       <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                         {totalCount}
//                       </span>
//                     )}
//                     {link.subLinks && sidebarOpen && (
//                       <FiChevronDown
//                         className={`transition-transform ${
//                           activeSubmenu === link.label ? "rotate-180" : ""
//                         }`}
//                       />
//                     )}
//                   </button>
//                 )}

//                 {/* SUBMENU */}
//                 <AnimatePresence>
//                   {activeSubmenu === link.label && link.subLinks && (
//                     <motion.ul
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="ml-6 border-l border-white/20 overflow-hidden"
//                     >
//                       {link.subLinks?.map((subLink, subIndex) => {
//                         const subCount = getCountForLabel(subLink.label);
//                         const subLabelWithCount = subCount
//                           ? `${subLink.label} (${subCount})`
//                           : subLink.label;

//                         return (
//                           <motion.li
//                             key={subIndex}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: subIndex * 0.05 }}
//                           >
//                             {!subLink.subSubLinks ? (
//                               <NavLink
//                                 to={subLink.href || "#"}
//                                 className={({ isActive }) =>
//                                   cn(
//                                     "block px-6 py-2 text-sm transition-all",
//                                     isActive
//                                       ? "bg-white text-black font-semibold"
//                                       : "hover:bg-blue-600 dark:hover:bg-gray-700"
//                                   )
//                                 }
//                               >
//                                 {subLabelWithCount} {/* Moved inside NavLink */}
//                               </NavLink>
//                             ) : (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     setActiveSubSubmenu(
//                                       activeSubSubmenu === subLink.label
//                                         ? null
//                                         : subLink.label
//                                     )
//                                   }
//                                   className="flex items-center w-full px-6 py-2 text-sm justify-between hover:bg-blue-600 dark:hover:bg-gray-700"
//                                 >
//                                   <span>{subLabelWithCount}</span>{" "}
//                                   {/* Moved inside button */}
//                                   <FiChevronDown
//                                     className={`transition-transform ${
//                                       activeSubSubmenu === subLink.label
//                                         ? "rotate-180"
//                                         : ""
//                                     }`}
//                                   />
//                                 </button>
//                                 <AnimatePresence>
//                                   {activeSubSubmenu === subLink.label && (
//                                     <motion.ul
//                                       initial={{ height: 0, opacity: 0 }}
//                                       animate={{ height: "auto", opacity: 1 }}
//                                       exit={{ height: 0, opacity: 0 }}
//                                       transition={{ duration: 0.3 }}
//                                       className="ml-4 border-l border-white/10"
//                                     >
//                                       {subLink.subSubLinks.map(
//                                         (subSubLink, subSubIndex) => (
//                                           <motion.li
//                                             key={subSubIndex}
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             transition={{
//                                               delay: subSubIndex * 0.05,
//                                             }}
//                                           >
//                                             <NavLink
//                                               to={subSubLink.href || "#"}
//                                               className={({ isActive }) =>
//                                                 cn(
//                                                   "block px-6 py-1 text-sm transition-all",
//                                                   isActive
//                                                     ? "bg-white text-black font-semibold"
//                                                     : "hover:bg-blue-600 dark:hover:bg-gray-700"
//                                                 )
//                                               }
//                                             >
//                                               {subSubLink.label}
//                                             </NavLink>
//                                           </motion.li>
//                                         )
//                                       )}
//                                     </motion.ul>
//                                   )}
//                                 </AnimatePresence>
//                               </>
//                             )}
//                           </motion.li>
//                         );
//                       })}
//                     </motion.ul>
//                   )}
//                 </AnimatePresence>
//               </motion.li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* LOGOUT BUTTON */}
//       <div>
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Button
//               variant="destructive"
//               size="sm"
//               className={`cursor-pointer flex items-center justify-center ${
//                 sidebarOpen
//                   ? "w-3/4 my-4 h-8 mx-auto"
//                   : "rounded-none md:w-[65%] lg:w-[85%] h-12"
//               }`}
//             >
//               <LucideLogOut className="dropdown-icon size-4 mr-1" />
//               <label className={`cursor-pointer ${sidebarOpen || "md:hidden"}`}>
//                 Logout
//               </label>
//             </Button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to log out? Logging out will end your
//                 current session.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel className="btn-destructive-fill">
//                 Cancel
//               </AlertDialogCancel>
//               <AlertDialogAction onClick={() => handleLogout()}>
//                 Confirm
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//         <p
//           className={`${
//             sidebarOpen
//               ? "text-center text-tertiary-foreground text-xs opacity-75"
//               : "hidden"
//           }`}
//         >
//           Version: <span className="lowercase">{appConfiguration.version}</span>
//         </p>
//       </div>
//     </motion.aside>
//   );
// };

// export default AdminSidebarNavigation;
