"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string, page: number) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get("/articles/news/other", {
          params: {
            category,
            page,
            limit: 13, // Fetch 13 items: 1 featured + 4 headline + 8 grid
          },
        });

        if (res.data.success) {
          setNews(res.data.articles);
          setTotalPages(res.data.totalPages);
        }
      } catch (err: any) {
        setError("समाचार लोड गर्न समस्या भयो");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchNews();
    }
  }, [category, page]);

  return {
    news,
    loading,
    error,
    totalPages,
  };
};