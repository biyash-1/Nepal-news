"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Author {
  _id: string;
  username: string;
  avatar?: string;
}

interface NewsArticle {
  _id: string;               // MongoDB ObjectId as string
  title: string;
  content: string;
  image?: string;
  categories: string[];
  tags?: string[];
  
  // Views and engagement
  views?: number;            // total views
  viewsLast24h?: number;     // rolling 24h views
  viewsLast7d?: number;      // rolling 7-day views
  likes?: number;

  // Computed scores
  trendingScore?: number;
  popularScore?: number;
  lastScoreUpdate?: string;  // ISO string

  // Timestamps
  createdAt: string;         // ISO string
  updatedAt?: string;        // ISO string

  // Author info
  author: Author;
}

interface RelatedNews {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

export const useNewsDetail = (id: string) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [trendingNews, setTrendingNews] = useState<RelatedNews[]>([]);
  const [recentNews, setRecentNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);

      // Fetch main article
      const res = await axiosInstance.get(`/articles/${id}`);
      const articleData = res.data.article;
      setArticle(articleData);

      // Prepare exclude list (current article + related + trending)
      const excludeIds = [id];

      // Fetch related articles from same category (using first category if multiple)
      if (articleData.categories && articleData.categories.length > 0) {
        const primaryCategory = articleData.categories[0];
        const related = await axiosInstance.get(
          `/articles/category/${primaryCategory}?limit=5&exclude=${id}`
        );

        const relatedArticles = related.data.articles || [];
        setRelatedNews(relatedArticles);
        
        // Add related article IDs to exclude list
        excludeIds.push(...relatedArticles.map((a: any) => a._id));
      }

      // Fetch overall trending news (no category filter, exclude current + related)
      const trendingRes = await axiosInstance.get("/articles/news/trending", {
        params: {
          limit: 5,
          exclude: excludeIds.join(',')
        }
      });

      if (trendingRes.data.success) {
        setTrendingNews(trendingRes.data.articles || []);
      }

      // Fetch recent news (latest articles, exclude current + related + trending)
      const allExcludeIds = [
        ...excludeIds,
        ...(trendingRes.data.articles || []).map((a: any) => a._id)
      ].filter(Boolean);

      const recentRes = await axiosInstance.get("/articles/news/other", {
        params: {
          page: 1,
          limit: 5,
          exclude: allExcludeIds.join(',')
        }
      });

      if (recentRes.data.success) {
        setRecentNews(recentRes.data.articles || []);
      }
      
      setError(null);

    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching news detail");
      console.error("Error fetching news detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchNewsDetail();
  }, [id]);

  return { article, relatedNews, trendingNews, recentNews, loading, error };
};