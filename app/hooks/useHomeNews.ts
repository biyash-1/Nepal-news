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
  featuredImage?: string;
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
  const [localLevelNews, setLocalLevelNews] = useState<Article[]>([]);
  const [healthNews, setLatestNews] = useState<Article[]>([]);
  const [sportsNews, setSportsNews] = useState<Article[]>([]);
  const [techNews, setTechNews] = useState<Article[]>([]);
  const [politicsNews, setPoliticsNews] = useState<Article[]>([]);
  const [portfolioNews, setPortfolioNews] = useState<Article[]>([]);
  const [entertainmentNews, setEntertainmentNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const breakingRes = await axiosInstance.get('/articles/category/मुख्य', {
          params: { limit: 5 }
        });
        if (breakingRes.data.success && breakingRes.data.articles.length > 0) {
          setBreakingNews({
            main: breakingRes.data.articles[0],
            marquee: breakingRes.data.articles.slice(0, 4)
          });
        }

        const localLevelRes = await axiosInstance.get('/articles/category/स्थानीय तह', {
          params: { limit: 9 }
        });
        if (localLevelRes.data.success) {
          setLocalLevelNews(localLevelRes.data.articles);
        }

        const healthRes = await axiosInstance.get('/articles/category/स्वास्थ्य', {
          params: { limit: 8, sort: 'createdAt' }
        });
        if (healthRes.data.success) {
          setLatestNews(healthRes.data.articles);
        }

        const sportsRes = await axiosInstance.get('/articles/category/खेलकुद', {
          params: { limit: 4 }
        });
        if (sportsRes.data.success) {
          setSportsNews(sportsRes.data.articles);
        }

        const techRes = await axiosInstance.get('/articles/category/प्रविधि', {
          params: { limit: 4 }
        });
        if (techRes.data.success) {
          setTechNews(techRes.data.articles);
        }

        const politicsRes = await axiosInstance.get('/articles/category/राजनीति', {
          params: { limit: 8 }
        });
        if (politicsRes.data.success) {
          setPoliticsNews(politicsRes.data.articles);
        }

        const portfolioRes = await axiosInstance.get('/articles/category/मनोरञ्जन', {
          params: { limit: 3 }
        });
        if (portfolioRes.data.success) {
          setPortfolioNews(portfolioRes.data.articles);
        }

        const entertainmentRes = await axiosInstance.get('/articles/categories/multiple', {
          params: { 
            categories: JSON.stringify(["मनोरञ्जन", "मुख्य"]),
            limit: 3 
          }
        });
        if (entertainmentRes.data.success) {
          setEntertainmentNews(entertainmentRes.data.articles);
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
    localLevelNews,
    healthNews,
    sportsNews,
    techNews,
    politicsNews,
    portfolioNews,
    entertainmentNews,
    loading,
    error
  };
};