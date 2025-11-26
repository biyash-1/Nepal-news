"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export interface Article {
  _id: string; // matches your backend JSON
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
}

export const useHealthNews = () => {
  const [healthNews, setHealthNews] = useState<Article[]>([]);
  const [featuredHealthNews, setFeaturedHealthNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchHealthNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch regular health news
      const res = await axiosInstance.get(`/articles/category/health`, {
        params: { page, limit: 10 },
      });

      if (res.data.success) {
        if (page === 1) setHealthNews(res.data.articles);
        else setHealthNews(prev => [...prev, ...res.data.articles]);

        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      }

      // Fetch featured health news once
      if (featuredHealthNews.length === 0) {
        const featuredRes = await axiosInstance.get(`/articles/category/health`, {
          params: { page: 1, limit: 3, featured: true },
        });
        if (featuredRes.data.success) setFeaturedHealthNews(featuredRes.data.articles);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch health news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchHealthNews(currentPage + 1);
    }
  };

  const refreshNews = () => {
    fetchHealthNews(1);
  };

  useEffect(() => {
    fetchHealthNews(1);
  }, []);

  return {
    healthNews,
    featuredHealthNews,
    loading,
    error,
    currentPage,
    totalPages,
    loadMore,
    refreshNews,
  };
};
