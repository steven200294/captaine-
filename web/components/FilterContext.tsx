'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type OfferTypeKey = 'solo' | 'esim' | 'macarons';
export type BestOfferKey = 'meilleures' | 'flash';
export type DurationKey = '1h' | 'flexible';

export interface FilterState {
  bestOffer: BestOfferKey | null;
  offerTypes: OfferTypeKey[];
  priceRange: [number, number];
  duration: DurationKey | null;
}

interface FilterContextType {
  filters: FilterState;
  setBestOffer: (v: BestOfferKey) => void;
  toggleOfferType: (v: OfferTypeKey) => void;
  setPriceRange: (v: [number, number]) => void;
  setDuration: (v: DurationKey) => void;
}

export const PRICE_MIN = 5;
export const PRICE_MAX = 70;

const DEFAULT: FilterState = {
  bestOffer: null,
  offerTypes: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  duration: null,
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT);

  const setBestOffer = useCallback((v: BestOfferKey) =>
    setFilters(f => ({ ...f, bestOffer: f.bestOffer === v ? null : v })), []);

  const toggleOfferType = useCallback((v: OfferTypeKey) =>
    setFilters(f => ({
      ...f,
      offerTypes: f.offerTypes.includes(v)
        ? f.offerTypes.filter(t => t !== v)
        : [...f.offerTypes, v],
    })), []);

  const setPriceRange = useCallback((v: [number, number]) =>
    setFilters(f => ({ ...f, priceRange: v })), []);

  const setDuration = useCallback((v: DurationKey) =>
    setFilters(f => ({ ...f, duration: f.duration === v ? null : v })), []);

  return (
    <FilterContext.Provider value={{ filters, setBestOffer, toggleOfferType, setPriceRange, setDuration }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
