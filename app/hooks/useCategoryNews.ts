"use client";

import { useState, useEffect, useRef } from "react";
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
  
  // Track loaded page numbers to prevent duplicate fetches
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const isInitialLoadRef = useRef<boolean>(false);
  const currentCategoryRef = useRef<string>(category);

  // Reset refs when category changes
  useEffect(() => {
    if (currentCategoryRef.current !== category) {
      console.log(`Category changed from ${currentCategoryRef.current} to ${category}, resetting refs`);
      loadedPagesRef.current.clear();
      currentCategoryRef.current = category;
    }
  }, [category]);

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
        return res.data.articles;
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
    // Prevent duplicate page fetches
    if (loadedPagesRef.current.has(page)) {
      console.log(`Page ${page} already loaded, skipping`);
      return;
    }

    // Mark as loading BEFORE the request
    loadedPagesRef.current.add(page);

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
        // Always append new articles (don't duplicate the first 6)
        setNews(prev => [...prev, ...res.data.articles]);

        // Update pagination state from backend response
        setCurrentPage(res.data.currentPage || page);
        setTotalPages(res.data.totalPages || 1);
      } else {
        // If request failed, remove from loaded pages so it can retry
        loadedPagesRef.current.delete(page);
      }
    } catch (err: any) {
      // Remove from loaded pages on error so it can retry
      loadedPagesRef.current.delete(page);
      setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load More function for pagination
  const loadMore = () => {
    if (!loading && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      // Only fetch if not already loaded
      if (!loadedPagesRef.current.has(nextPage)) {
        fetchGridNews(nextPage, baseExcludeIds);
      }
    }
  };

  // Initial load sequence
  useEffect(() => {
    if (category) {
      console.log(`Loading category: ${category}`);
      
      // Reset ALL state when category changes
      setNews([]);
      setPopularNews([]);
      setTrendingNews([]);
      setCurrentPage(1);
      setTotalPages(1);
      setBaseExcludeIds("");
      setLoading(true);
      setError(null);
      
      // Reset loaded pages tracking
      loadedPagesRef.current.clear();
      isInitialLoadRef.current = true;
      
      console.log(`Loaded pages cleared, current set:`, loadedPagesRef.current);

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
          
          // Step 3: Freeze exclude list for entire grid pagination
          const frozenExcludeIds = [
            ...firstSix.map((a: any) => a._id),
            ...popular.map((a: any) => a._id),
            ...trending.map((a: any) => a._id)
          ].filter(Boolean).join(',');

          setBaseExcludeIds(frozenExcludeIds);

          // Load first grid page
          await fetchGridNews(1, frozenExcludeIds);
          
          isInitialLoadRef.current = false;
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