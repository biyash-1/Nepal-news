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
  const isTrackingRef = useRef(false);

  useEffect(() => {
    // Only run if we have both articleId and article, and aren't already tracking
    if (!articleId || !article || isTrackingRef.current) {
      return;
    }

    console.log('✅ Starting view tracking for article:', articleId);
    isTrackingRef.current = true;

    const trackView = async () => {
      try {
        console.log('📡 Fetching trending config...');
        
        const configResponse = await axiosInstance.get('/articles/trending-config');
        const delay = configResponse.data?.config?.viewCountDelay || 20;
        
        console.log(`⏱️ View will be counted after ${delay} seconds...`);
        setDebugInfo(`Waiting ${delay} seconds...`);
        
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
            setDebugInfo(`Error: ${error.message}`);
          }
        }, delay * 1000);
        
      } catch (error: any) {
        console.error('❌ Failed to fetch config:', error);
        setDebugInfo(`Config error: ${error.message}`);
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

  // Separate effect to update trending status
  useEffect(() => {
    if (article) {
      const hasTrendingTag = article.tags?.includes('ट्रेन्डिङ') || article.isTrending || false;
      setIsTrending(hasTrendingTag);
    }
  }, [article?.isTrending, article?.tags]);

  return { 
    viewCounted, 
    isTrending,
    debugInfo
  };
};