"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [popularNews, setPopularNews] = useState<any[]>([]); // New state for popular news
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // First page: 10 articles, subsequent pages: 9 articles
      const limit = page === 1 ? 10 : 9;

      const res = await axiosInstance.get(`/articles/category/${category}`, {
        params: { page, limit },
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

        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "समाचार ल्याउन समस्या भयो");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch popular news from multiple categories
  const fetchPopularNews = async () => {
    try {
      const res = await axiosInstance.get('/articles/multiple-categories', {
        params: { 
          categories: JSON.stringify([`${category}`, "लोकप्रिय"]),
          limit: 4 
        }
      });

      if (res.data.success) {
        setPopularNews(res.data.articles);
      }
    } catch (err: any) {
      console.error("Error fetching popular news:", err);
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
      fetchPopularNews(); // Fetch popular news on mount
    }
  }, [category]);

  return { news, popularNews, loading, error, currentPage, totalPages, loadMore };
};