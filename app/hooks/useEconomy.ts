"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export interface EconomyArticle {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  categories: string[];
  author: {
    userId?: string;
    username: string;
  };
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  views?: number;
  time?: string;
}

// --- Hook for multiple economy articles ---
export const useEconomy = (category?: string) => {
  const [articles, setArticles] = useState<EconomyArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<EconomyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEconomyNews = async (specificCategory?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Categories array just like useLocalData
      const categories = ["अर्थतन्त्र"];
      if (specificCategory) {
        categories.push(specificCategory); 
      }

      console.log("Fetching economy articles for categories:", categories);

      const res = await axiosInstance.get("/articles/categories/multiple", {
        params: { categories: JSON.stringify(categories), limit: 30 },
      });

      console.log("Fetched economy articles:", res.data.articles);

      if (res.data.success) {
        const processed = res.data.articles.map((a: any) => ({
          _id: a._id,
          title: a.title,
          content: a.content,
          excerpt: a.content?.slice(0, 100) + "..." || "",
          image: a.image,
          categories: a.categories,
          author: { userId: a.author?.userId, username: a.author?.username || "अज्ञात" },
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          views: a.views,
          featured: a.featured || false,
          time: formatTime(a.createdAt),
        }));

        setArticles(processed);
        setFeaturedArticles(processed.slice(0, 6));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "आर्थिक समाचार लोड गर्न समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEconomyNews(category);
  }, [category]);

  const refreshData = () => fetchEconomyNews(category);

  return { articles, featuredArticles, loading, error, refreshData };
};

// --- Helper ---
const formatTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "अहिले";
  if (diffInHours < 24) return `${diffInHours} घन्टा अघि`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} दिन अघि`;
};
