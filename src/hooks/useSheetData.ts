'use client';

import { useState, useEffect } from 'react';
import { fetchSheetData } from '@/lib/googleSheets';

interface UseSheetDataOptions {
  sheetId: string;
  range?: string;
}

export function useSheetData<T = any>({ sheetId, range }: UseSheetDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const sheetData = await fetchSheetData(sheetId, range);
        setData(sheetData as T[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sheet data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sheetId, range]);

  return { data, loading, error };
}