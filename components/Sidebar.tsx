import AdBanner from "./AdBanner";
import { Ad } from "@/app/hooks/useAds";

interface SidebarProps {
  sidebarTop: Ad | null;
  sidebarMiddle: Ad | null;
  sidebarBottom: Ad | null;
}

export default function Sidebar({ sidebarTop, sidebarMiddle, sidebarBottom }: SidebarProps) {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Top Sidebar Ad */}
      <div className="sticky top-4">
        <AdBanner ad={sidebarTop} position="sidebar-top" />
      </div>

      {/* Middle Sidebar Ad */}
      <div>
        <AdBanner ad={sidebarMiddle} position="sidebar-middle" />
      </div>

      {/* Bottom Sidebar Ad */}
      <div>
        <AdBanner ad={sidebarBottom} position="sidebar-bottom" />
      </div>

      {/* You can add more sidebar widgets here like:
        - Popular Posts
        - Social Media Links
        - Newsletter Signup
        - Weather Widget
        etc.
      */}
    </aside>
  );
}