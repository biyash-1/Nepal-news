"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const provinceCards = [
  { id: "1", name: "कोशी प्रदेश", image: "https://picsum.dev/200/300?image=15", route: "/pradesh/1" },
  { id: "2", name: "मधेश प्रदेश", image: "https://picsum.dev/200/300?image=25", route: "/pradesh/2" },
  { id: "3", name: "बाग्मती प्रदेश", image: "https://picsum.dev/200/300?image=35", route: "/pradesh/3" },
  { id: "4", name: "गण्डकी प्रदेश", image: "https://picsum.dev/200/300?image=45", route: "/pradesh/4" },
  { id: "5", name: "लुम्बिनी प्रदेश", image: "https://picsum.dev/200/300?image=55", route: "/pradesh/5" },
  { id: "6", name: "कर्णाली प्रदेश", image: "https://picsum.dev/200/300?image=65", route: "/pradesh/6" },
  { id: "7", name: "सुदूरपश्चिम प्रदेश", image: "https://picsum.dev/200/300?image=75", route: "/pradesh/7" },
];

export default function PradeshLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeProvinceId = pathname.split("/").pop(); 

  return (
    <div className="min-h-screen bg-white">
      {/* Province Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
       
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {provinceCards.map((province) => {
              const isActive = province.id === activeProvinceId;
              return (
                <Link
                  key={province.id}
                  href={province.route}
                  className={`group relative h-28 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                    isActive ? "ring-2 ring-red-500 ring-offset-2" : ""
                  }`}
                >
                  <img
                    src={province.image}
                    alt={province.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

             
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
                      isActive ? "bg-black/60" : "bg-black/40"
                    }`}
                  >
                    <span className="text-white font-bold text-sm text-center px-1">
                      {province.name}
                    </span>
                  </div>

               
                  {isActive && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Province Page Content */}
      <main>{children}</main>
    </div>
  );
}
