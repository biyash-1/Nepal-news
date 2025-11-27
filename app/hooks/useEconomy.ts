
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
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  views?: number;
  time?: string;
  reads?: string;
}

// --- Hook for multiple economy articles ---
export const useEconomy = (category?: string) => {
  const [articles, setArticles] = useState<EconomyArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<EconomyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Map English category keys to Nepali categories
  const categoryMap: Record<string, string> = {
    banking: "बैङ्किङ्ग",
    market: "बजар", 
    jobs: "रोजगारी",
    trade: "व्यापार",
    policy: "अर्थतन्त्र नीति",
    all: "अर्थतन्त्र"
  };

  const fetchEconomyNews = async (page: number = 1, specificCategory?: string) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "/articles/category/अर्थतन्त्र";
      let params: any = { page, limit: 30 };

      // If specific category is provided, fetch that category
      if (specificCategory && specificCategory !== "all") {
        const nepaliCategory = categoryMap[specificCategory];
        if (nepaliCategory) {
          endpoint = `/articles/category/${encodeURIComponent(nepaliCategory)}`;
        }
      }

      const res = await axiosInstance.get(endpoint, { params });

      if (res.data.success) {
        const processedArticles = res.data.articles.map((article: any) => ({
          ...article,
          excerpt: article.content?.slice(0, 100) + "..." || "",
          time: formatTime(article.createdAt),
          reads: formatReads(article.views || 0)
        }));

        if (page === 1) {
          setArticles(processedArticles);
          setFeaturedArticles(processedArticles.slice(0, 6));
        } else {
          setArticles(prev => [...prev, ...processedArticles]);
        }

        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "आर्थिक समाचार लोड गर्न समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchEconomyNews(currentPage + 1, category);
    }
  };

  const refreshData = () => {
    fetchEconomyNews(1, category);
  };

  useEffect(() => {
    fetchEconomyNews(1, category);
  }, [category]);

  return {
    articles,
    featuredArticles,
    loading,
    error,
    currentPage,
    totalPages,
    loadMore,
    refreshData,
  };
};

// --- New hook for single economy article ---
export const useEconomyArticle = (id: string) => {
  const [article, setArticle] = useState<EconomyArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axiosInstance.get(`/articles/${id}`);
        
        if (res.data.success) {
          const a = res.data.article;
          const processedArticle: EconomyArticle = {
            _id: a._id,
            title: a.title,
            content: a.content,
            excerpt: a.content?.slice(0, 100) + "..." || "",
            image: a.image,
            categories: a.categories,
            author: {
              userId: a.author?.userId,
              username: a.author?.username || "अज्ञात",
              avatar: a.author?.avatar
            },
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            featured: a.featured || false,
            views: a.views || 0,
            time: formatTime(a.createdAt),
            reads: formatReads(a.views || 0)
          };
          setArticle(processedArticle);
        } else {
          setError("समाचार भेटिएन");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "समाचार लोड गर्न असफल");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return { article, loading, error };
};

// Helper functions
const formatTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "अहिले";
  if (diffInHours < 24) return `${diffInHours} घन्टा अघि`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} दिन अघि`;
};

const formatReads = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)} हजार`;
  }
  return views.toString();
};