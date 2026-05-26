'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tcb_reservation_email';

export function useReservation() {
  const [email, setEmailState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEmailState(stored);
  }, []);

  const setEmail = useCallback((value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setEmailState(value);
    document.cookie = `reservation_email=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 365}`;
  }, []);

  const clearEmail = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setEmailState(null);
    document.cookie = 'reservation_email=;path=/;max-age=0';
  }, []);

  return { email, setEmail, clearEmail };
}
