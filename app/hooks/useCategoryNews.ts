"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axios";

export const useCategoryNews = (category: string) => {
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [popularNews, setPopularNews] = useState<any[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Track loaded page numbers to prevent duplicate fetches
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const currentCategoryRef = useRef<string>(category);

  // Reset refs when category changes
  useEffect(() => {
    if (currentCategoryRef.current !== category) {
      console.log(`Category changed from ${currentCategoryRef.current} to ${category}, resetting refs`);
      loadedPagesRef.current.clear();
      currentCategoryRef.current = category;
    }
  }, [category]);

  // Fetch all data at once and slice in the hook
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch everything in parallel
      const [mainRes, popularRes, trendingRes] = await Promise.all([
        axiosInstance.get(`/articles/news/other`, {
          params: { page: 1, limit: 50, category },
        }),
        axiosInstance.get("/articles/news/popular", {
          params: { limit: 4, category },
        }),
        axiosInstance.get("/articles/news/trending", {
          params: { limit: 5, category },
        }),
      ]);

      if (mainRes.data.success) {
        const articles = mainRes.data.articles;
        console.log(`Fetched ${articles.length} articles for category ${category}`);
        
        // Store all articles
        setAllArticles(articles);
        
        // Slice for news (first 6 for featured/headlines, rest for grid)
        setNews(articles);
        
        // Set popular and trending
        setPopularNews(popularRes.data.success ? popularRes.data.articles : []);
        setTrendingNews(trendingRes.data.success ? trendingRes.data.articles : []);
        
        // Set pagination
        setTotalPages(mainRes.data.totalPages || 1);
        setCurrentPage(1);
        loadedPagesRef.current.add(1);
      } else {
        setError("समाचार फेला परेन");
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  // Load more pages
  const loadMore = async () => {
    if (loading || currentPage >= totalPages) return;

    const nextPage = currentPage + 1;
    
    // Prevent duplicate page fetches
    if (loadedPagesRef.current.has(nextPage)) {
      console.log(`Page ${nextPage} already loaded, skipping`);
      return;
    }

    loadedPagesRef.current.add(nextPage);

    try {
      setLoading(true);

      const res = await axiosInstance.get(`/articles/news/other`, {
        params: { 
          page: nextPage, 
          limit: 9, 
          category 
        },
      });

      if (res.data.success) {
        // Create a map of existing IDs for deduplication
        const existingIds = new Set(allArticles.map(a => a._id));
        const newUniqueArticles = res.data.articles.filter(
          (article: any) => !existingIds.has(article._id)
        );

        // Update all articles with only unique new ones
        const updatedArticles = [...allArticles, ...newUniqueArticles];
        setAllArticles(updatedArticles);
        setNews(updatedArticles);
        
        setCurrentPage(res.data.currentPage || nextPage);
        setTotalPages(res.data.totalPages || totalPages);
      } else {
        loadedPagesRef.current.delete(nextPage);
      }
    } catch (err: any) {
      loadedPagesRef.current.delete(nextPage);
      console.error("Error loading more:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (category) {
      console.log(`Loading category: ${category}`);
      
      // Reset ALL state when category changes
      setAllArticles([]);
      setNews([]);
      setPopularNews([]);
      setTrendingNews([]);
      setCurrentPage(1);
      setTotalPages(1);
      setLoading(true);
      setError(null);
      
      // Reset loaded pages tracking
      loadedPagesRef.current.clear();

      fetchAllData();
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