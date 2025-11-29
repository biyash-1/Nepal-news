// app/hooks/useViewTracker.ts
"use client";

import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';

interface Article {
  _id: string;
  views?: number;
  isTrending?: boolean;
  tags?: string[];
}

export const useViewTracker = (articleId: string, article: Article | null) => {
  const [viewCounted, setViewCounted] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    console.log('🔵 useViewTracker effect running...', {
      articleId,
      hasArticle: !!article,
      hasAttempted: hasAttemptedRef.current
    });

    // Only run once per article
    if (!articleId) {
      console.log('❌ No articleId, exiting');
      return;
    }

    if (hasAttemptedRef.current) {
      console.log('⏭️ Already attempted, skipping');
      return;
    }

    // Don't start tracking if article hasn't loaded yet
    if (!article) {
      console.log('⏳ Article not loaded yet, waiting...');
      return;
    }

    console.log('✅ Starting view tracking for article:', articleId);
    hasAttemptedRef.current = true;

    const trackView = async () => {
      try {
        console.log('📡 Fetching trending config...');
        
        // Fetch config to get delay
        const configResponse = await axiosInstance.get('/articles/trending-config');
        const delay = configResponse.data?.config?.viewCountDelay || 20;
        
        console.log(`⏱️ View will be counted after ${delay} seconds...`);
        setDebugInfo(`Waiting ${delay} seconds...`);
        
        // Set timer to count view after delay
        timerRef.current = setTimeout(async () => {
          try {
            console.log('📊 Attempting to count view...');
            setDebugInfo('Counting view...');
            
            const response = await axiosInstance.post(`/articles/${articleId}/view`);
            
            console.log('📨 View response:', response.data);
            
            if (response.data.success) {
              setViewCounted(true);
              setIsTrending(response.data.isTrending || false);
              
              if (response.data.alreadyCounted) {
                console.log('ℹ️ View already counted (within 24 hours)');
                setDebugInfo('Already viewed');
              } else {
                console.log('✅ View counted! Total views:', response.data.views);
                setDebugInfo(`View counted! (${response.data.views} total)`);
              }
              
              if (response.data.isTrending) {
                console.log('🔥 Article is TRENDING!');
              }
            }
          } catch (error: any) {
            console.error('❌ Failed to count view:', error);
            console.error('Error details:', error.response?.data || error.message);
            setDebugInfo(`Error: ${error.message}`);
          }
        }, delay * 1000);
        
      } catch (error: any) {
        console.error('❌ Failed to fetch config:', error);
        console.error('Config error details:', error.response?.data || error.message);
        setDebugInfo(`Config error: ${error.message}`);
      }
    };

    trackView();

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        console.log('🛑 View tracking cancelled (cleanup)');
      }
    };
  }, [articleId, article]); // Include article back to trigger when it loads

  // Update trending status from article
  useEffect(() => {
    if (article) {
      const hasTrendingTag = article.tags?.includes('ट्रेन्डिङ') || article.isTrending || false;
      setIsTrending(hasTrendingTag);
    }
  }, [article]);

  return { 
    viewCounted, 
    isTrending,
    debugInfo
  };
};