import { useState, useEffect } from 'react';

export function useMemberFetch() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = process.env.REACT_APP_SHEET_API_URL + '?action=getMembers';

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { members, loading, error };
}
