"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Article {
  _id: string;
  title: string;
  content: string;
  categories: string[];
  author: {
    userId: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  image?: string;
  views: number;
  likes: number;
  isTrending: boolean;
  tags: string[];
}

interface BreakingNews {
  main: Article | null;
  marquee: Article[];
}

export const useHomeNews = () => {
  const [breakingNews, setBreakingNews] = useState<BreakingNews>({ main: null, marquee: [] });
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [sportsNews, setSportsNews] = useState<Article[]>([]);
  const [techNews, setTechNews] = useState<Article[]>([]);
  const [politicsNews, setPoliticsNews] = useState<Article[]>([]);
  const [portfolioNews, setPortfolioNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch breaking/main news (मुख्य category)
        const breakingRes = await axiosInstance.get('/articles/category/मुख्य', {
          params: { limit: 5 }
        });
        if (breakingRes.data.success && breakingRes.data.articles.length > 0) {
          setBreakingNews({
            main: breakingRes.data.articles[0],
            marquee: breakingRes.data.articles.slice(0, 4)
          });
        }

        // Fetch featured news (विशेष category)
        const featuredRes = await axiosInstance.get('/articles/category/विशेष', {
          params: { limit: 6 }
        });
        if (featuredRes.data.success) {
          setFeaturedNews(featuredRes.data.articles);
        }

        // Fetch latest news (all recent articles)
        const latestRes = await axiosInstance.get('/articles', {
          params: { limit: 6, sort: 'createdAt' }
        });
        if (latestRes.data.success) {
          setLatestNews(latestRes.data.articles);
        }

        // Fetch sports news (खेलकुद category)
        const sportsRes = await axiosInstance.get('/articles/category/खेलकुद', {
          params: { limit: 4 }
        });
        if (sportsRes.data.success) {
          setSportsNews(sportsRes.data.articles);
        }

        // Fetch tech news (प्रविधि category)
        const techRes = await axiosInstance.get('/articles/category/प्रविधि', {
          params: { limit: 4 }
        });
        if (techRes.data.success) {
          setTechNews(techRes.data.articles);
        }

        // Fetch politics news (राजनीति category)
        const politicsRes = await axiosInstance.get('/articles/category/राजनीति', {
          params: { limit: 7 }
        });
        if (politicsRes.data.success) {
          setPoliticsNews(politicsRes.data.articles);
        }

        // Fetch portfolio/entertainment news (मनोरञ्जन category)
        const portfolioRes = await axiosInstance.get('/articles/category/मनोरञ्जन', {
          params: { limit: 3 }
        });
        if (portfolioRes.data.success) {
          setPortfolioNews(portfolioRes.data.articles);
        }

      } catch (err: any) {
        setError(err.response?.data?.message || "समाचार लोड गर्न समस्या भयो");
        console.error("Error fetching home news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  return {
    breakingNews,
    featuredNews,
    latestNews,
    sportsNews,
    techNews,
    politicsNews,
    portfolioNews,
    loading,
    error
  };
};