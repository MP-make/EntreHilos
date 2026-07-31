"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  className?: string;
}

export default function RatingStars({
  value,
  size = 14,
  interactive = false,
  onChange,
  className = "",
}: RatingStarsProps) {
  return (
    <div className={`flex items-center gap-0.5 ${interactive ? "cursor-pointer select-none" : ""} ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span
            key={i}
            className="relative inline-flex"
            role={interactive ? "button" : undefined}
            aria-label={interactive ? `${i} estrellas` : undefined}
            onMouseEnter={interactive && onChange ? () => onChange(i) : undefined}
            onClick={interactive && onChange ? () => onChange(i) : undefined}
            onTouchStart={interactive && onChange ? () => onChange(i) : undefined}
          >
            <Star size={size} className="text-[#E5D9CE]" fill="#E5D9CE" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[#F5A623]" fill="#F5A623" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
