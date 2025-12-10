// app/hooks/useViewTracker.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';

interface Article {
  _id: string;
  views?: number;
  viewsLast24h?: number;
  viewsLast7d?: number;
  trendingScore?: number;
  popularScore?: number;
  tags?: string[];
}

interface ViewResponse {
  success: boolean;
  views: number;
  viewsLast24h: number;
  trendingScore: number;
  alreadyCounted: boolean;
  message: string;
}

export const useViewTracker = (articleId: string, article: Article | null) => {
  const [viewCounted, setViewCounted] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [currentViews, setCurrentViews] = useState(0);
  const [trendingScore, setTrendingScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTrackingRef = useRef(false);

  useEffect(() => {
    // Only run if we have both articleId and article, and aren't already tracking
    if (!articleId || !article || isTrackingRef.current) {
      return;
    }

    console.log('✅ Starting view tracking for article:', articleId);
    isTrackingRef.current = true;

    // Initialize current views from article
    setCurrentViews(article.views || 0);
    setTrendingScore(article.trendingScore || 0);

    const trackView = async () => {
      try {
        // Fixed delay: 3 seconds (you can adjust this)
        const delay = 3;
        
        console.log(`⏱️ View will be counted after ${delay} seconds...`);
        setDebugInfo(`Waiting ${delay} seconds...`);
        
        timerRef.current = setTimeout(async () => {
          try {
            console.log('📊 Attempting to count view...');
            setDebugInfo('Counting view...');
            
            const response = await axiosInstance.post<ViewResponse>(
              `/articles/${articleId}/view`
            );
            
            console.log('📨 View response:', response.data);
            
            if (response.data.success) {
              setViewCounted(true);
              setCurrentViews(response.data.views);
              setTrendingScore(response.data.trendingScore);
              
              // Article is trending if it has a significant trending score
              // You can adjust this threshold (e.g., > 500)
              const isTrendingNow = response.data.trendingScore > 500;
              setIsTrending(isTrendingNow);
              
              if (response.data.alreadyCounted) {
                console.log('ℹ️ View already counted (within 24 hours)');
                setDebugInfo('Already viewed');
              } else {
                console.log('✅ View counted!', {
                  totalViews: response.data.views,
                  last24h: response.data.viewsLast24h,
                  trendingScore: response.data.trendingScore
                });
                setDebugInfo(
                  `View counted! (${response.data.views} total, Score: ${response.data.trendingScore})`
                );
              }
              
              if (isTrendingNow) {
                console.log('🔥 Article is TRENDING! Score:', response.data.trendingScore);
              }
            }
          } catch (error: any) {
            console.error('❌ Failed to count view:', error);
            setDebugInfo(`Error: ${error.message}`);
          }
        }, delay * 1000);
        
      } catch (error: any) {
        console.error('❌ Failed to initialize tracking:', error);
        setDebugInfo(`Init error: ${error.message}`);
      }
    };

    trackView();

    // Cleanup only runs when component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        console.log('🛑 View tracking cancelled (component unmounted)');
      }
      // Reset tracking flag on cleanup
      isTrackingRef.current = false;
    };
  }, [articleId, article?._id]);

  // Separate effect to update trending status from article data
  useEffect(() => {
    if (article) {
      // Check if article has significant trending score
      const scoreThreshold = 200; // Adjust this threshold as needed
      const hasTrendingScore = (article.trendingScore || 0) > scoreThreshold;
      
      // Also check if article has high recent views
      const hasRecentViews = (article.viewsLast24h || 0) > 20; // Adjust threshold
      
      setIsTrending(hasTrendingScore || hasRecentViews);
      setTrendingScore(article.trendingScore || 0);
      setCurrentViews(article.views || 0);
    }
  }, [article?.trendingScore, article?.viewsLast24h, article?.views]);

  return { 
    viewCounted,
    isTrending,
    currentViews,
    trendingScore,
    debugInfo
  };
};