"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [baseExcludeIds, setBaseExcludeIds] = useState<string>("");
  const [news, setNews] = useState<any[]>([]);
  const [popularNews, setPopularNews] = useState<any[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Step 1: Fetch featured + headlines (first 6 articles)
  const fetchFeaturedAndHeadlines = async () => {
    try {
      const res = await axiosInstance.get(`/articles/news/other`, {
        params: { 
          page: 1, 
          limit: 6, 
          category 
        },
      });

      if (res.data.success) {
        setNews(res.data.articles);
        return res.data.articles; // Return for exclusion in next steps
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching featured/headlines:", err);
      return [];
    }
  };

  // Step 2a: Fetch popular news (with exclusions)
  const fetchPopularNews = async (excludeIds: string) => {
    try {
      const res = await axiosInstance.get("/articles/news/popular", {
        params: { 
          limit: 4, 
          category,
          exclude: excludeIds 
        },
      });

      if (res.data.success) {
        setPopularNews(res.data.articles);
        return res.data.articles;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching popular news:", err);
      return [];
    }
  };

  // Step 2b: Fetch trending news (with exclusions)
  const fetchTrendingNews = async (excludeIds: string) => {
    try {
      const res = await axiosInstance.get("/articles/news/trending", {
        params: { 
          limit: 5, 
          category,
          exclude: excludeIds 
        },
      });

      if (res.data.success) {
        setTrendingNews(res.data.articles);
        return res.data.articles;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching trending news:", err);
      return [];
    }
  };

  // Step 3: Fetch grid news (remaining articles with all exclusions)
  const fetchGridNews = async (page: number, excludeIds: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get(`/articles/news/other`, {
        params: { 
          page, 
          limit: 9, 
          category,
          exclude: excludeIds 
        },
      });

      if (res.data.success) {
        if (page === 1) {
          // First grid page - append to existing featured+headlines
          setNews(prev => [...prev, ...res.data.articles]);
        } else {
          // Subsequent pages - append to existing news
          setNews(prev => [...prev, ...res.data.articles]);
        }

        // Update pagination state from backend response
        setCurrentPage(res.data.currentPage || page);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load More function for pagination
  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      fetchGridNews(currentPage + 1, baseExcludeIds);
    }
  };

  // Initial load sequence
  useEffect(() => {
    if (category) {
      // Reset state when category changes
      setNews([]);
      setPopularNews([]);
      setTrendingNews([]);
      setCurrentPage(1);
      setTotalPages(1);
      setBaseExcludeIds(""); // ✅ important
      setLoading(true);
      setError(null);

      const loadData = async () => {
        try {
          // Step 1: Fetch featured + headlines (first 6)
          const firstSix = await fetchFeaturedAndHeadlines();
          
          if (firstSix.length === 0) {
            setLoading(false);
            setError("समाचार फेला परेन");
            return;
          }
          
          // Step 2: Fetch popular/trending (exclude first 6)
          const excludeIdsStep2 = firstSix.map((a: any) => a._id).join(',');
          const [popular, trending] = await Promise.all([
            fetchPopularNews(excludeIdsStep2),
            fetchTrendingNews(excludeIdsStep2)
          ]);
          
          // Step 3: Fetch grid news (exclude first 6 + popular + trending)
          const frozenExcludeIds = [
          ...firstSix.map((a: any) => a._id),
          ...popular.map((a: any) => a._id),
          ...trending.map((a: any) => a._id)
        ].filter(Boolean).join(',');

        // Freeze exclude for entire grid pagination
        setBaseExcludeIds(frozenExcludeIds);

        // Load first grid page
        await fetchGridNews(1, frozenExcludeIds);
        } catch (err) {
          console.error("Error in loadData sequence:", err);
          setLoading(false);
          setError("समाचार लोड गर्न समस्या भयो");
        }
      };

      loadData();
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