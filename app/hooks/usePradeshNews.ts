"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Author {
  _id: string;
  username: string;
}

interface Article {
  _id: string;
  title: string;
  content: string;
  categories: string[];
  author: Author;
  createdAt: string;
  image: string;
}

export const usePradeshNews = (pradeshName: string) => {
  const [mainNews, setMainNews] = useState<Article | null>(null);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [headlineNews, setHeadlineNews] = useState<Article[]>([]);
  const [regularNews, setRegularNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPradeshNews = async () => {
    try {
      setLoading(true);

      const categoryArray = JSON.stringify(["प्रदेश", pradeshName]);

      // Fetch all articles at once
      const res = await axiosInstance.get("/articles/multiple-categories", {
        params: { categories: categoryArray, limit: 30 } // fetch enough for all sections
      });

      if (res.data.success) {
        const articles: Article[] = res.data.articles;

        // Slice articles for each section
        setMainNews(articles[0] || null);                // 1 main news
        setFeaturedNews(articles.slice(1, 3));           // next 2 featured
        setHeadlineNews(articles.slice(3, 9));           // next 6 headline
        setRegularNews(articles.slice(9));               // rest as regular
      }

      setError(null);
    } catch (err: any) {
      console.error("Error fetching pradesh news:", err);
      setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pradeshName) fetchPradeshNews();
  }, [pradeshName]);

  return { mainNews, featuredNews, headlineNews, regularNews, loading, error };
};
