import { useState, useEffect } from "react";

export interface Ad {
  id: string;
  position: string;
  imageUrl: string;
  linkUrl: string;
  altText: string;
}

export interface AdsData {
  belowNavbar: Ad | null;
  belowBreaking: Ad | null;
  belowFeatured: Ad | null;
  belowLatest: Ad | null;
  belowSports: Ad | null;
  belowPortfolio: Ad | null;
  belowTech: Ad | null;
  belowPolitics: Ad | null;
  sidebarTop: Ad | null;
  sidebarMiddle: Ad | null;
  sidebarBottom: Ad | null;
}

const fallbackAd: Ad = {
  id: "fallback",
  position: "fallback",
  imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1140' height='100'%3E%3Crect width='1140' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' fill='%23666'%3EYour Advertisement Here - 1140x100px%3C/text%3E%3C/svg%3E",
  linkUrl: "#",
  altText: "Advertisement Space Available"
};

export const useAds = () => {
  const [ads, setAds] = useState<AdsData>({
    belowNavbar: fallbackAd,
    belowBreaking: fallbackAd,
    belowFeatured: fallbackAd,
    belowLatest: fallbackAd,
    belowSports: fallbackAd,
    belowPortfolio: fallbackAd,
    belowTech: fallbackAd,
    belowPolitics: fallbackAd,
    sidebarTop: fallbackAd,
    sidebarMiddle: fallbackAd,
    sidebarBottom: fallbackAd,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch ads from database
    // const fetchAds = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axiosInstance.get('/api/ads');
    //     const data = response.data;
    //     setAds(data);
    //   } catch (err: any) {
    //     setError(err.response?.data?.message || 'विज्ञापन लोड गर्न समस्या भयो');
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchAds();
  }, []);

  return { ads, loading, error };
}