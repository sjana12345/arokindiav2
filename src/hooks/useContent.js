import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api';

export const useContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/content`);
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = async (newData, token) => {
    try {
      const response = await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      const result = await response.json();
      setContent(newData);
      return { success: true, message: result.message };
    } catch (err) {
      console.error('Error updating content:', err);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, updateContent, refreshContent: fetchContent };
};
