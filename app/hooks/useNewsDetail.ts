"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Author {
  id: string;
  username: string;
  avatar?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  categories: string[];
  author: Author;
  createdAt: string;
}

interface RelatedNews {
  id: string;
  title: string;
  image: string;
  createdAt: string;
}

export const useNewsDetail = (id: string) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);

      // Fetch main article
      const res = await axiosInstance.get(`/articles/${id}`);
      const articleData = res.data.article;
      setArticle(articleData);

      // Fetch related articles from same category (using first category if multiple)
      if (articleData.categories && articleData.categories.length > 0) {
        const primaryCategory = articleData.categories[0];
        const related = await axiosInstance.get(
          `/articles/category/${primaryCategory}?limit=5&exclude=${id}`
        );

        setRelatedNews(related.data.articles || []);
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

  return { article, relatedNews, loading, error };
};