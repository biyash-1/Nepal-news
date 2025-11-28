"use client";

import { useState, useEffect } from "react";
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

// --- Existing hook for multiple articles ---
export const useLocalData = (location?: string) => {
   console.log("useLocalData location param:", location);
  const [articles, setArticles] = useState<LocalArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<LocalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const res = await axiosInstance.get("/articles/multiple-categories", {
        params: { categories: JSON.stringify(categories), limit: 30 },
      });
      console.log(
  "FINAL categories array:",
  categories,
  "JSON:",
  JSON.stringify(categories)
);


      console.log("Fetched articles:", res.data.articles);

      if (res.data.success) {
        const processedArticles: LocalArticle[] = res.data.articles.map((article: any) => ({
          _id: article._id,
          title: article.title,
          content: article.content,
          excerpt: article.content.slice(0, 100) + "...",
          image: article.image,
          categories: article.categories,
          author: { _id: article.author.userId, username: article.author.username },
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          views: article.views,
          location: extractLocationFromCategories(article.categories),
          ward: undefined,
          featured: article.featured || false,
          time: formatTime(article.createdAt),
        }));

        setArticles(processedArticles);
        setFeaturedArticles(processedArticles.slice(0, 6));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "स्थानीय समाचार लोड गर्न समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalNews(location);
  }, [location]);

  const refreshData = () => fetchLocalNews(location);

  return { articles, featuredArticles, loading, error, refreshData };
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
  const locationCategories = ["काठमाडौं", "ललितपुर", "भक्तपुर", "पोखरा", "बिराटनगर"];
  return categories.find((cat) => locationCategories.includes(cat)) || "स्थानीय तह";
};

const formatTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "अहिले";
  if (diffInHours < 24) return `${diffInHours} घन्टा अघि`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} दिन अघि`;
};
