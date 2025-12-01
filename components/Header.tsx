"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronDown, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useAuthStore } from "@/app/store/useAuthStore";
import AuthModal from "./AuthModel";
import UserProfileDropdown from "./UserProfileDropdown";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  dropdownItems?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "गृहपृष्ठ", href: "/" },
  {
    label: "प्रदेश",
    href: "/pradesh/3",
    dropdownItems: [
      { label: "कोशी  प्रदेश", href: "/pradesh/1" },
      { label: "मधेश प्रदेश", href: "/pradesh/2" },
      { label: "बागमती प्रदेश", href: "/pradesh/3" },
      { label: "गण्डकी प्रदेश", href: "/pradesh/4" },
      { label: "लुम्बिनी प्रदेश", href: "/pradesh/5" },
      { label: "कर्णाली प्रदेश", href: "/pradesh/6" },
      { label: "सुदूरपश्चिम प्रदेश", href: "/pradesh/7" },
    ],
  },
  { label: "स्थानीय तह", href: "/local-level" },
  {
    label: "खेलकुद",
    href: "/sports",
    dropdownItems: [
      { label: "क्रिकेट", href: "/sports/cricket" },
      { label: "फुटबल", href: "/sports/football" },
      { label: "भलिबल", href: "/sports/volleyball" },
      { label: "बास्केटबल", href: "/sports/basketball" },
    ],
  },
  {
    label: "मनोरञ्जन",
    href: "/entertainment",
    dropdownItems: [
      { label: "बलिउड", href: "/entertainment/bollywood" },
      { label: "हलिउड", href: "/entertainment/hollywood" },
      { label: "नेपाली चलचित्र", href: "/entertainment/nepali" },
      { label: "सङ्गीत", href: "/entertainment/music" },
      { label: "अन्य मनोरञ्जन", href: "/entertainment/others" },
    ],
  },
  {
    label: "अर्थतन्त्र",
    href: "/economy",
    dropdownItems: [
      { label: "बैङ्किङ्ग", href: "/economy/banking" },
      { label: "बजार", href: "/economy/market" },
      { label: "रोजगारी", href: "/economy/jobs" },
      { label: "व्यापार", href: "/economy/trade" },
      { label: "अर्थतन्त्र नीति", href: "/economy/policy" },
    ],
  },
  { label: "स्वास्थ्य", href: "/health" },
  { label: "विज्ञान र प्रविधि", href: "/technology" },
  { label: "विश्व", href: "/global" },
  { label: "शिक्षा", href: "/education" },
  { label: "राजनीति", href: "/politics" },
];

// Desktop Dropdown Component
function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  let showTimeout: NodeJS.Timeout;
  let hideTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(() => setIsOpen(true), 200);
  };

  const handleMouseLeave = () => {
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={item.href || "#"}
        className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap pb-1"
      >
        {item.label}
        {item.dropdownItems && (
          <FaChevronDown
            className={`ml-1 w-3 h-3 transition-transform ${
              isOpen ? "rotate-180 text-red-600" : "text-gray-500"
            }`}
          />
        )}
      </a>

      {item.dropdownItems && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-44 bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform z-[200] ${
            isOpen
              ? "opacity-100 visible translate-y-2"
              : "opacity-0 invisible translate-y-1"
          }`}
        >
          <ul className="py-2 text-sm text-gray-700">
            {item.dropdownItems.map((dItem, index) => (
              <li key={index}>
                <a
                  href={dItem.href}
                  className="block px-5 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  {dItem.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100">
      {item.dropdownItems ? (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="font-medium">{item.label}</span>
            <FaChevronDown
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`bg-gray-50 overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96" : "max-h-0"
            }`}
          >
            {item.dropdownItems.map((subItem, index) => (
              <a
                key={index}
                href={subItem.href}
                onClick={onNavigate}
                className="block px-8 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                {subItem.label}
              </a>
            ))}
          </div>
        </>
      ) : (
        <a
          href={item.href}
          onClick={onNavigate}
          className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
        >
          {item.label}
        </a>
      )}
    </div>
  );
}

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    } as const;
    setCurrentDate(new Date().toLocaleDateString("ne-NP", options));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") {
      checkAuth().then(() => router.replace(window.location.pathname)).catch(console.error);
    }
  }, [checkAuth, router]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-[100] w-full">
    
        <div className="w-full lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 lg:py-4">
           
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <a
              href="/"
              className="text-xl sm:text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              नेपाल समाचार
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-[50%] xl:w-[60%]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="खोज्नुहोस्..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-red-500 transition-colors"
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
          
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>

           
              {isLoading ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>

       
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isSearchOpen ? "max-h-20 pb-3" : "max-h-0"
            }`}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="खोज्नुहोस्..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-red-500 transition-colors"
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

      
          <div className="hidden lg:flex justify-end pb-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <FaCalendarAlt className="text-red-600" />
              {currentDate}
            </div>
          </div>
        </div>

      
        <nav className="hidden lg:block border-t border-gray-200">
          <div className="w-[80%] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-x-visible space-x-6 py-3">
            {navItems.map((item, idx) => (
              <NavDropdown key={idx} item={item} />
            ))}
          </div>
        </nav>
      </header>

     
      <div
        className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-[90] ${
          isMobileMenuOpen
            ? "opacity-50 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

   
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl z-[95] transform transition-transform duration-300 overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
          <a
            href="/"
            className="text-xl font-bold text-red-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            नेपाल समाचार
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-red-600 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

      
        <div className="px-4 py-3 bg-red-50 text-sm text-gray-700 flex items-center gap-2">
          <FaCalendarAlt className="text-red-600" />
          <span className="text-xs">{currentDate}</span>
        </div>

     
        <div className="py-2">
          {navItems.map((item, idx) => (
            <MobileNavItem
              key={idx}
              item={item}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </div>
      </div>
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}