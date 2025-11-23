"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(`/articles/category/${category}`, {
        params: { page, limit: 8 },
      });

      if (res.data.success) {
        if (page === 1) setNews(res.data.articles);
        else setNews(prev => [...prev, ...res.data.articles]);

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

  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchNews(currentPage + 1);
    }
  };

  useEffect(() => {
    if (category) fetchNews(1);
  }, [category]);

  return { news, loading, error, currentPage, totalPages, loadMore };
};
