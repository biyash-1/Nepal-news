"use client";

import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios'; // Import your axios instance

export interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  categories: string[];
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  author: {
    userId: string;
    username: string;
    avatar: string;
  };
}

export interface SportsData {
  trendingNews: Article[];
  footballNews: Article[];
  cricketNews: Article[];
  basketballNews: Article[];
  volleyballNews: Article[];
  otherSportsNews: Article[];
  featuredNews: Article[];
  loading: boolean;
  error: string | null;
}

export const useSportsNews = () => {
  const [data, setData] = useState<SportsData>({
    trendingNews: [],
    footballNews: [],
    cricketNews: [],
    basketballNews: [],
    volleyballNews: [],
    otherSportsNews: [],
    featuredNews: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSportsNews = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        // Use axiosInstance instead of fetch
        const response = await axiosInstance.get('/articles/category/खेलकुद', {
          params: {
            limit: 100 // Get more articles for sports page
          }
        });
        
        console.log("response", response);
        
        // Axios automatically parses JSON, so use response.data
        const result = response.data;
        
        // Check if the response has the expected structure
        if (!result.success || !result.articles) {
          throw new Error('Invalid response format');
        }
        
        const allSportsNews: Article[] = result.articles;
        console.log('All sports news received:', allSportsNews);

        // Categorize news based on subcategories
        const categorizedNews = categorizeNews(allSportsNews);
        
        setData({
          ...categorizedNews,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching sports news:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'एउटा त्रुटि भयो',
        }));
      }
    };

    fetchSportsNews();
  }, []);

  // Function to categorize news based on subcategories
  const categorizeNews = (articles: Article[]) => {
    const trendingNews: Article[] = [];
    const footballNews: Article[] = [];
    const cricketNews: Article[] = [];
    const basketballNews: Article[] = [];
    const volleyballNews: Article[] = [];
    const otherSportsNews: Article[] = [];
    const featuredNews: Article[] = [];

    articles.forEach(article => {
      // Check for trending articles
      if (article.views > 1000 || article.likes > 50) {
        trendingNews.push(article);
      }

      // Check for featured articles (you can adjust criteria)
      if (article.categories.includes('फिचर') || article.views > 2000) {
        featuredNews.push(article);
      }

      // Categorize by sport type
      if (article.categories.some(cat => 
        cat.includes('फुटबल') || cat.includes('सकर')
      )) {
        footballNews.push(article);
      } else if (article.categories.some(cat => 
        cat.includes('क्रिकेट')
      )) {
        cricketNews.push(article);
      } else if (article.categories.some(cat => 
        cat.includes('बास्केटबल')
      )) {
        basketballNews.push(article);
      } else if (article.categories.some(cat => 
        cat.includes('भलिबल')
      )) {
        volleyballNews.push(article);
      } else {
        otherSportsNews.push(article);
      }
    });

    // Sort by popularity/recency
    const sortByPopularity = (arr: Article[]) => 
      arr.sort((a, b) => 
        b.views - a.views || 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return {
      trendingNews: sortByPopularity(trendingNews).slice(0, 6),
      footballNews: sortByPopularity(footballNews),
      cricketNews: sortByPopularity(cricketNews),
      basketballNews: sortByPopularity(basketballNews),
      volleyballNews: sortByPopularity(volleyballNews),
      otherSportsNews: sortByPopularity(otherSportsNews),
      featuredNews: sortByPopularity(featuredNews).slice(0, 4),
    };
  };

  return data;
};