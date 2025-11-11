"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/articles/category/${category}?page=${page}&limit=8`
      );

      const data = res.data;
      console.log("data is",data)
      if (page === 1) setNews(data.articles);
      else setNews((prev) => [...prev, ...data.articles]);

      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "समाचार ल्याउन समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchNews(currentPage + 1);
    }
  };

  return { news, loading, error, loadMore, totalPages, currentPage };
};
