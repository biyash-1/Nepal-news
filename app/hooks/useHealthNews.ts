
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  categories: string[];
  author: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  views?: number;
}

interface UseHealthNewsReturn {
  healthNews: Article[];
  featuredHealthNews: Article[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  loadMore: () => void;
  refreshNews: () => void;
}

export const useHealthNews = (): UseHealthNewsReturn => {
  const [healthNews, setHealthNews] = useState<Article[]>([]);
  const [featuredHealthNews, setFeaturedHealthNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchHealthNews = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch health category articles directly from API
      const response = await axiosInstance.get(`/articles`, {
        params: { page, limit: 8 }
      });
      console.log("respnse",response.data)
      
      if (response.data.success) {
        if (page === 1) {
          setHealthNews(response.data.articles);
        } else {
          setHealthNews(prev => [...prev, ...response.data.articles]);
        }
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }


      const featuredResponse = await axiosInstance.get('/articles', {
        params: { 
          category: 'health', 
          page: 1, 
          limit: 3,
          featured: true 
        }
      });
      
      if (featuredResponse.data.success) {
        setFeaturedHealthNews(featuredResponse.data.articles);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch health news');
      console.error('Error fetching health news:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchHealthNews(currentPage + 1);
    }
  };

  const refreshNews = () => {
    fetchHealthNews(1);
  };

  useEffect(() => {
    fetchHealthNews(1);
  }, []);

  return {
    healthNews,
    featuredHealthNews,
    loading,
    error,
    totalPages,
    currentPage,
    loadMore,
    refreshNews
  };
};