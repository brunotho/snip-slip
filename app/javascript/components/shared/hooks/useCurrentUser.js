import { useEffect, useState } from 'react';

export function useCurrentUser() {
  const bodyDataset = document.body?.dataset || {};
  const initial = {
    id: bodyDataset.currentUserId || null,
    language: bodyDataset.userLanguage || 'English',
  };

  const [userId, setUserId] = useState(initial.id);
  const [language, setLanguage] = useState(initial.language);

  useEffect(() => {
    let isMounted = true;
    const reconcile = async () => {
      try {
        const res = await fetch('/api/users/me', { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        setUserId(data?.id || null);
        if (data?.language) setLanguage(data.language);
      } catch (_) {
        // silent
      }
    };
    reconcile();
    return () => { isMounted = false; };
  }, []);

  return { userId, language };
}


