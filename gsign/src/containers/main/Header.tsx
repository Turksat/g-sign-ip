import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { subscribeToAuthChanges, notifyLogout } from "@/libs/authEvents";
import { useFormContext } from "@/context/FormContext";
import { useRouter } from "next/navigation";
import { AdminOnly } from "@/components/common/RoleBasedAccess";
import { RoleBadge } from "@/components/common/RoleBadge";

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

const Header = (props: HeaderProps) => {
  const { setMobileMenuOpen, mobileMenuOpen } = props;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { getUserInfo } = useApi();
  const { clearApplicationContext } = useFormContext();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((isAuthenticated) => {
      setIsAuthenticated(isAuthenticated);
      setUserDropdownOpen(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownOpen &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("currentFormData");
      sessionStorage.removeItem("currentApplicationNo");
    }

    clearApplicationContext();
    notifyLogout();
    // Güvenli routing - Next.js router kullanarak Open Redirect saldırılarını önle
    router.push("/");
  };

  const handleMyApplications = () => {
    router.push("/allapplications");
  };

  const handleAdminPanel = () => {
    router.push("/admin");
  };

  const handleSimilarApplications = () => {
    router.push("/similarapplications");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logov2.png"
                alt="G-SIGN-IP"
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="hidden sm:block text-xl font-bold text-gray-900">
                G-SIGN IP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleSimilarApplications}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Similar Patent Applications
                </button>

                {/* User Dropdown */}
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {getUserInfo()?.firstName?.charAt(0)}
                        {getUserInfo()?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden lg:block">
                      {getUserInfo()?.firstName} {getUserInfo()?.lastName}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {getUserInfo()?.firstName?.charAt(0)}
                              {getUserInfo()?.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {getUserInfo()?.firstName}{" "}
                              {getUserInfo()?.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {getUserInfo()?.email}
                            </p>
                            <div className="mt-1">
                              <RoleBadge
                                roleId={getUserInfo()?.userRoleId}
                                showLabel={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleMyApplications}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>My Applications</span>
                        </button>

                        <AdminOnly userInfo={getUserInfo()} fallback={null}>
                          <button
                            onClick={handleAdminPanel}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>Admin Panel</span>
                          </button>
                        </AdminOnly>
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleSimilarApplications}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  Similar Patent Applications
                </button>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {getUserInfo()?.firstName?.charAt(0)}
                        {getUserInfo()?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserInfo()?.firstName} {getUserInfo()?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {getUserInfo()?.email}
                      </p>
                      <div className="mt-1">
                        <RoleBadge
                          roleId={getUserInfo()?.userRoleId}
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <button
                      onClick={handleMyApplications}
                      className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      My Applications
                    </button>

                    <AdminOnly userInfo={getUserInfo()} fallback={null}>
                      <button
                        onClick={handleAdminPanel}
                        className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        Admin Panel
                      </button>
                    </AdminOnly>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
