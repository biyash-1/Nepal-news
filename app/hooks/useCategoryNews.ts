"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [popularNews, setPopularNews] = useState<any[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch articles for main news feed
  const fetchNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const limit = page === 1 ? 10 : 9;
      const res = await axiosInstance.get(`/articles/news/other`, {
        params: { exclude: [], limit,category }, // adjust exclude IDs if needed
      });

      if (res.data.success) {
        if (page === 1) {
          setNews(res.data.articles);
        } else {
          setNews(prev => {
            const combined = [...prev, ...res.data.articles];
            const unique = Array.from(new Map(combined.map(a => [a._id, a])).values());
            return unique;
          });
        }

        setCurrentPage(page);
        setTotalPages(1); // The API doesn't provide pagination yet; adjust if it does
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular news (last 7 days by views)
const fetchPopularNews = async () => {
  try {
    const res = await axiosInstance.get("/articles/news/popular", {
      params: { limit: 4, category }, // pass category directly
    });

    if (res.data.success) {
      setPopularNews(res.data.articles); // already filtered by backend
    }
  } catch (err: any) {
    console.error("Error fetching popular news:", err);
  }
};

// Fetch trending news (last 24 hours by score)
const fetchTrendingNews = async () => {
  try {
    const res = await axiosInstance.get("/articles/news/trending", {
      params: { limit: 5, category }, // pass category directly
    });

    if (res.data.success) {
      setTrendingNews(res.data.articles); // already filtered by backend
    }
  } catch (err: any) {
    console.error("Error fetching trending news:", err);
  }
};


  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchNews(currentPage + 1);
    }
  };

  useEffect(() => {
    if (category) {
      fetchNews(1);
      fetchPopularNews();
      fetchTrendingNews();
    }
  }, [category]);

  return {
    news,
    popularNews,
    trendingNews,
    loading,
    error,
    currentPage,
    totalPages,
    loadMore,
  };
};
