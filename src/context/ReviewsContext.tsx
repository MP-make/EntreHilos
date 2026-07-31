"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface Resena {
  id: number;
  producto_id: string;
  producto_sku: string | null;
  producto_nombre: string | null;
  nombre_cliente: string;
  calificacion: number;
  comentario: string | null;
  aprobado: boolean;
  es_manual: boolean;
  created_at: string;
}

interface ProductRating {
  average: number;
  count: number;
}

export interface SubmitRatingData {
  producto_id: string;
  producto_sku?: string;
  producto_nombre?: string;
  nombre_cliente: string;
  calificacion: number;
  comentario?: string;
}

interface ReviewsContextType {
  ratings: Record<string, ProductRating>;
  ratedByMe: Record<string, number>;
  refresh: () => Promise<void>;
  submitRating: (data: SubmitRatingData) => Promise<{ ok: boolean; error?: string }>;
}

const RATED_KEY = "entrehilos-rated-products";

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, ProductRating>>({});
  const [ratedByMe, setRatedByMe] = useState<Record<string, number>>({});

  const loadRatedByMe = useCallback(() => {
    try {
      const raw = localStorage.getItem(RATED_KEY);
      setRatedByMe(raw ? JSON.parse(raw) : {});
    } catch {
      setRatedByMe({});
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/resenas?t=" + Date.now());
      const json = await res.json();
      if (!Array.isArray(json)) return;

      const sums: Record<string, { sum: number; count: number }> = {};
      json.forEach((r: Resena) => {
        if (!r.producto_id) return;
        const cur = sums[r.producto_id] || { sum: 0, count: 0 };
        cur.sum += r.calificacion;
        cur.count += 1;
        sums[r.producto_id] = cur;
      });

      const out: Record<string, ProductRating> = {};
      Object.keys(sums).forEach((key) => {
        out[key] = { average: sums[key].sum / sums[key].count, count: sums[key].count };
      });
      setRatings(out);
    } catch (e) {
      console.error("Error cargando reseñas:", e);
    }
  }, []);

  useEffect(() => {
    loadRatedByMe();
    refresh();
  }, [loadRatedByMe, refresh]);

  const submitRating = useCallback(async (data: SubmitRatingData) => {
    const res = await fetch("/api/resenas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { ok: false, error: j.error || "Error al enviar la calificación" };
    }

    setRatedByMe((prev) => {
      const next = { ...prev, [data.producto_id]: data.calificacion };
      try {
        localStorage.setItem(RATED_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
    return { ok: true };
  }, []);

  return (
    <ReviewsContext.Provider value={{ ratings, ratedByMe, refresh, submitRating }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews debe usarse dentro de ReviewsProvider");
  return ctx;
}
