import { useState, useEffect } from 'react';
import { fetchTopics } from '../lib/parse';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTopics = () => {
      fetchTopics()
        .then((data) => {
          setTopics(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    };

    loadTopics();

    const interval = setInterval(loadTopics, 10000);

    return () => clearInterval(interval);
  }, []);

  return { topics, loading, error };
}
