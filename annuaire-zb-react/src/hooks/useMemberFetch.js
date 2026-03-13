import { useState, useEffect } from 'react';

// trigger: 0 = no fetch; increment it to (re-)fetch
export function useMemberFetch({ trigger = 0 } = {}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trigger === 0) return;

    const controller = new AbortController();
    const url = process.env.REACT_APP_SHEET_API_URL + '?action=getMembers';

    setMembers([]);
    setLoading(true);
    setError(null);

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
  }, [trigger]);

  return { members, loading, error };
}
