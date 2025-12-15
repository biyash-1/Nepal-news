import { Ad } from "@/app/hooks/useAds";

interface AdBannerProps {
  ad: Ad | null;
  position: string;
  className?: string;
}

export default function AdBanner({ ad, position, className = "" }: AdBannerProps) {
  if (!ad) return null;

  // Check if it's a sidebar ad for different styling
  const isSidebar = position.includes('sidebar');

  return (
    <div className={`full-banner-adv ${className}`}>
      <div className="dn-container dnn-ad-placeholder" data-position={position}>
        <div className={isSidebar ? "sidebar-ad" : "desktop-mode"}>
          <div className="adv-item" data-adv-id={ad.id}>
            <a 
              target="_blank" 
              href={ad.linkUrl} 
              rel="noopener noreferrer"
              className="block"
            >
              <img 
                className="w-full h-auto max-w-full mx-auto animate__animated animate__fast fadeIn" 
                src={ad.imageUrl} 
                alt={ad.altText}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}