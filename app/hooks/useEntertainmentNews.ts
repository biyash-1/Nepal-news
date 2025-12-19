"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface Article {
  _id: string;
  title: string;
  content: string;
  categories: string[];
  author: string;
  createdAt: string;
  image: string;
  featuredImage?: string;
  isTrending?: boolean;
  trendingScore?: number;
}

interface HeadlineNews {
  main: Article | null;
  side: Article[];
}

export const useEntertainmentNews = () => {
  const [headlineNews, setHeadlineNews] = useState<HeadlineNews>({ main: null, side: [] });
  const [gossipNews, setGossipNews] = useState<Article[]>([]);
  const [bollywoodHollywoodNews, setBollywoodHollywoodNews] = useState<Article[]>([]);
  const [musicNews, setMusicNews] = useState<Article[]>([]);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch headline news (मनोरञ्जन + मुख्य categories)
        const headlineRes = await axiosInstance.get('/articles/categories/multiple', {
          params: { 
            categories: JSON.stringify(["मनोरञ्जन", "मुख्य"]),
            limit: 3 
          }
        });
        
        if (headlineRes.data.success && headlineRes.data.articles.length > 0) {
          setHeadlineNews({
            main: headlineRes.data.articles[0],
            side: headlineRes.data.articles.slice(1, 3)
          });
        }

        // Fetch gossip news (गपशप category)
        const gossipRes = await axiosInstance.get('/articles/category/गपशप', {
          params: { limit: 5 }
        });
        if (gossipRes.data.success) {
          setGossipNews(gossipRes.data.articles);
        }

        // Fetch Bollywood/Hollywood news
        const bollywoodRes = await axiosInstance.get('/articles/categories/multiple', {
          params: { 
            categories: JSON.stringify(["बलिउड", "हलिउड"]),
            limit: 5 
          }
        });
        if (bollywoodRes.data.success) {
          console.log("success")
          console.log(bollywoodRes.data.articles)
          setBollywoodHollywoodNews(bollywoodRes.data.articles);
        }

        // Fetch music news (संगीत category)
        const musicRes = await axiosInstance.get('/articles/category/संगीत', {
          params: { limit: 4 }
        });
        if (musicRes.data.success) {
          setMusicNews(musicRes.data.articles);
        }

        // Fetch featured news (विशेष category)
        const featuredRes = await axiosInstance.get('/articles/category/विशेष', {
          params: { limit: 4 }
        });
        if (featuredRes.data.success) {
          setFeaturedNews(featuredRes.data.articles);
        }

        // Fetch trending news (मनोरञ्जन category)
        const trendingRes = await axiosInstance.get('/articles/news/trending', {
          params: { 
            category: "मनोरञ्जन",
            limit: 5 
          }
        });
        if (trendingRes.data.success) {
          setTrendingNews(trendingRes.data.articles);
        }

      } catch (err: any) {
        setError(err.response?.data?.message || "समाचार ल्याउन समस्या भयो");
        console.error("Error fetching entertainment news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  return { 
    headlineNews, 
    gossipNews, 
    bollywoodHollywoodNews, 
    musicNews, 
    featuredNews,
    trendingNews,
    loading,
    error 
  };
};