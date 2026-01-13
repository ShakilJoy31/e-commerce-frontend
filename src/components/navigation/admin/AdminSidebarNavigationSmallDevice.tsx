import { adminNavigationLinks } from "@/components/navigationLinks/adminNavigationLink/adminNavigationLinks";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function AdminSidebarNavigationSmallDevice({
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  return (
    <>
      {/* Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 lg:hidden">
          {/* Mobile Sidebar */}
          <aside className="bg-primary text-white w-[280px] h-full shadow-lg">
            {/* Header with Close Icon */}
            <div className="p-4 flex justify-between items-center border-b ">
              <h1 className="text-2xl font-semibold">KRY Dashboard</h1>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-white text-2xl focus:outline-none border"
              >
                <IoClose />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto">
              <ul>
                {adminNavigationLinks.map((link) => (
                  <li key={link.key} className="mb-2">
                    <Link
                      to={link.href || "#"}
                      className="block p-3 hover:bg-[#43476A] rounded flex items-center gap-4"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      {link.icon && <link.icon size={20} />}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
