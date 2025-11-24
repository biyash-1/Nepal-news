"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { useAuthStore } from "@/app/store/useAuthStore";
import AuthModal from "./AuthModel";
import UserProfileDropdown from "./UserProfileDropdown";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
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

function NavDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
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
      <Link
        href={item.href || "#"}
        className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap pb-1"
      >
        {item.label}
        {item.dropdownItems && <FaChevronDown className={`ml-1 w-3 h-3 transition-transform ${isOpen ? "rotate-180 text-red-600" : "text-gray-500"}`} />}
      </Link>

      {item.dropdownItems && (
     <div
  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-44 bg-white rounded-xl shadow-lg transition-all duration-300 ease-in-out transform z-[200] ${
    isOpen ? "opacity-100 visible translate-y-2" : "opacity-0 invisible translate-y-1"
  }`}
>

          <ul className="py-2 text-sm text-gray-700">
            {item.dropdownItems.map((dItem, index) => (
              <li key={index}>
                <Link
                  href={dItem.href}
                  className="block px-5 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  {dItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const options = { year: "numeric", month: "long", day: "numeric", weekday: "long" } as const;
    setCurrentDate(new Date().toLocaleDateString("ne-NP", options));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") {
      checkAuth().then(() => router.replace(window.location.pathname)).catch(console.error);
    }
  }, [checkAuth, router]);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-[100] w-full ">

        <div className= " w-[80%] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700">नेपाल समाचार</Link>

       <div className="hidden md:block w-[60%]">
  <SearchBar />
</div>


          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? <UserProfileDropdown /> : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          <div className="hidden md:block text-sm text-gray-600">{currentDate}</div>
        </div>

        <nav className="border-t border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-x-visible space-x-6 py-3">
            {navItems.map((item, idx) => (
              <NavDropdown key={idx} item={item} />
            ))}
            <FaCalendarAlt className="text-gray-600" />
          </div>
        </nav>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
