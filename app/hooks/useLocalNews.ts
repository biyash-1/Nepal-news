"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axios";

export interface Author {
  _id: string;
  username: string;
}

export interface LocalArticle {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  categories: string[];
  author: Author;
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  views?: number;
  location?: string;
  ward?: string;
  time?: string;
}

export const useLocalNews = (location?: string) => {
  console.log("useLocalNews location param:", location);
  const [mainHeadline, setMainHeadline] = useState<LocalArticle | null>(null);
  const [freshNews, setFreshNews] = useState<LocalArticle[]>([]);
  const [moreNews, setMoreNews] = useState<LocalArticle[]>([]);
  const [allArticles, setAllArticles] = useState<LocalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track loaded articles to prevent duplicates
  const loadedArticleIdsRef = useRef<Set<string>>(new Set());
  const currentLocationRef = useRef<string | undefined>(location);

  // Reset refs when location changes
  useEffect(() => {
    if (currentLocationRef.current !== location) {
      console.log(`Location changed from ${currentLocationRef.current} to ${location}, resetting refs`);
      loadedArticleIdsRef.current.clear();
      currentLocationRef.current = location;
    }
  }, [location]);

  const fetchLocalNews = async (specificLocation?: string) => {
    try {
      setLoading(true);
      setError(null);

      let categories = ["स्थानीय तह"];
      if (specificLocation) {
        const locationMap: Record<string, string> = {
          kathmandu: "काठमाडौं",
          lalitpur: "ललितपुर",
          bhaktapur: "भक्तपुर",
          pokhara: "पोखरा",
          biratnagar: "बिराटनगर",
        };
        categories.push(locationMap[specificLocation] || specificLocation);
      }

      const res = await axiosInstance.get("/articles/categories/multiple", {
        params: { categories: JSON.stringify(categories), limit: 50 },
      });
      console.log(
        "FINAL categories array:",
        categories,
        "JSON:",
        JSON.stringify(categories)
      );

      if (res.data.success) {
        const processedArticles: LocalArticle[] = res.data.articles
          .map((article: any) => ({
            _id: article._id,
            title: article.title,
            content: article.content,
            excerpt: article.content.slice(0, 100) + "...",
            image: article.image,
            categories: article.categories,
            author: {
              _id: article.author.userId,
              username: article.author.username,
            },
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            views: article.views,
            location: extractLocationFromCategories(article.categories),
            ward: undefined,
            featured: article.featured || false,
            time: formatTime(article.createdAt),
          }))
          // Filter out duplicates using Set
          .filter((article: LocalArticle) => {
            if (loadedArticleIdsRef.current.has(article._id)) {
              return false;
            }
            loadedArticleIdsRef.current.add(article._id);
            return true;
          });

        // Sort by createdAt to ensure latest first
        processedArticles.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Store all articles
        setAllArticles(processedArticles);

        // Slice articles in the hook itself
        setMainHeadline(processedArticles[0] || null);
        setFreshNews(processedArticles.slice(1, 8)); // 7 articles for ताजा स्थानीय समाचार
        setMoreNews(processedArticles.slice(8)); // Rest for थप स्थानीय समाचार
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "स्थानीय समाचार लोड गर्न समस्या भयो"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalNews(location);
  }, [location]);

  const refreshData = () => {
    // Clear loaded IDs before refresh
    loadedArticleIdsRef.current.clear();
    fetchLocalNews(location);
  };

  return { mainHeadline, freshNews, moreNews, loading, error, refreshData };
};

export const useArticle = (id: string) => {
  const [article, setArticle] = useState<LocalArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/articles/${id}`);
        if (res.data.success) {
          const a = res.data.article;
          const processed: LocalArticle = {
            _id: a._id,
            title: a.title,
            content: a.content,
            excerpt: a.content.slice(0, 100) + "...",
            image: a.image,
            categories: a.categories,
            author: { _id: a.author.userId, username: a.author.username },
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            views: a.views,
            location: extractLocationFromCategories(a.categories),
            ward: undefined,
            featured: a.featured || false,
            time: formatTime(a.createdAt),
          };
          setArticle(processed);
        } else {
          setError("समाचार भेटिएन");
        }
      } catch (err: any) {
        console.error(err);
        setError("समाचार लोड गर्न असफल");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
};

// --- Helpers ---
const extractLocationFromCategories = (categories: string[]): string => {
  const locationCategories = [
    "काठमाडौं",
    "ललितपुर",
    "भक्तपुर",
    "पोखरा",
    "बिराटनगर",
  ];
  return (
    categories.find((cat) => locationCategories.includes(cat)) || "स्थानीय तह"
  );
};

const formatTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );
  if (diffInHours < 1) return "अहिले";
  if (diffInHours < 24) return `${diffInHours} घन्टा अघि`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} दिन अघि`;
};