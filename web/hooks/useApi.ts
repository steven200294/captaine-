'use client';

import { useState, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
}

export function useApi<T = unknown>(endpoint: string, options: UseApiOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (body?: unknown) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const res = await fetch(endpoint, {
        method: options.method || (body ? 'POST' : 'GET'),
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ data: null, error: json.error || `Erreur ${res.status}`, isLoading: false });
        return null;
      }

      setState({ data: json as T, error: null, isLoading: false });
      return json as T;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur réseau';
      setState({ data: null, error: msg, isLoading: false });
      return null;
    }
  }, [endpoint, options.method, options.headers]);

  return { ...state, execute };
}
