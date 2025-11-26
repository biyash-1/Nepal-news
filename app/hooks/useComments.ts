import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

export interface Comment {
  _id: string;
  article: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  content: string;
  likes: string[];
  dislikes: string[];
  likeCount: number;
  dislikeCount: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  postComment: (content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  dislikeComment: (commentId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useComments = (articleId: string): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/comments/article/${articleId}`, {
        params: { page: pageNum, limit: 20 }
      });

      if (response.data.success) {
        const newComments = response.data.comments;
        
        if (append) {
          setComments(prev => [...prev, ...newComments]);
        } else {
          setComments(newComments);
        }

        setTotal(response.data.pagination.total);
        setHasMore(pageNum < response.data.pagination.pages);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'टिप्पणीहरू लोड गर्न असफल भयो';
      setError(errorMessage);
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  // Initial fetch
  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  // Post new comment
  const postComment = async (content: string) => {
    if (!content.trim()) {
      toast.error('टिप्पणी खाली हुन सक्दैन');
      return;
    }

    if (content.length > 1000) {
      toast.error('टिप्पणी १००० अक्षरभन्दा बढी हुन सक्दैन');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/comments/article/${articleId}`,
        { content }
      );

      if (response.data.success) {
        // Add new comment to the top
        setComments(prev => [response.data.comment, ...prev]);
        setTotal(prev => prev + 1);
        toast.success('टिप्पणी सफलतापूर्वक पोस्ट भयो');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'टिप्पणी पोस्ट गर्न असफल भयो';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update comment
  const updateComment = async (commentId: string, content: string) => {
    if (!content.trim()) {
      toast.error('टिप्पणी खाली हुन सक्दैन');
      return;
    }

    if (content.length > 1000) {
      toast.error('टिप्पणी १००० अक्षरभन्दा बढी हुन सक्दैन');
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/comments/${commentId}`,
        { content }
      );

      if (response.data.success) {
        setComments(prev =>
          prev.map(comment =>
            comment._id === commentId ? response.data.comment : comment
          )
        );
        toast.success('टिप्पणी अपडेट भयो');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'टिप्पणी अपडेट गर्न असफल भयो';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`);

      if (response.data.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        setTotal(prev => prev - 1);
        toast.success('टिप्पणी मेटियो');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'टिप्पणी मेटाउन असफल भयो';
      toast.error(errorMessage);
      throw err;
    }
  };

  // Like comment
  const likeComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.post(`/comments/${commentId}/like`);

      if (response.data.success) {
        setComments(prev =>
          prev.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likes: response.data.isLiked 
                  ? [...comment.likes, 'current-user'] 
                  : comment.likes.filter(id => id !== 'current-user'),
                dislikes: comment.dislikes.filter(id => id !== 'current-user'),
                likeCount: response.data.likes,
                dislikeCount: response.data.dislikes
              };
            }
            return comment;
          })
        );
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'असफल भयो';
      toast.error(errorMessage);
    }
  };

  // Dislike comment
  const dislikeComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.post(`/comments/${commentId}/dislike`);

      if (response.data.success) {
        setComments(prev =>
          prev.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likes: comment.likes.filter(id => id !== 'current-user'),
                dislikes: response.data.isDisliked
                  ? [...comment.dislikes, 'current-user']
                  : comment.dislikes.filter(id => id !== 'current-user'),
                likeCount: response.data.likes,
                dislikeCount: response.data.dislikes
              };
            }
            return comment;
          })
        );
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'असफल भयो';
      toast.error(errorMessage);
    }
  };

  // Load more comments
  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchComments(nextPage, true);
  };

  // Refresh comments
  const refresh = async () => {
    setPage(1);
    await fetchComments(1, false);
  };

  return {
    comments,
    loading,
    error,
    total,
    page,
    hasMore,
    postComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    loadMore,
    refresh
  };
};