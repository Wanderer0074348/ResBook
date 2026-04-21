"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const RATINGS_KEY = "resbook-ratings";

interface RatingData {
  [slug: string]: {
    average: number;
    count: number;
  };
}

export function RatingDisplay({ slug, maxStars = 5 }: { slug: string; maxStars?: number }) {
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const ratings = getRatings();
    setRating(ratings[slug] || { average: 0, count: 0 });
  }, [slug]);

  if (!isClient) return null;

  const stars = Math.round(rating.average);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < stars ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
      {rating.count > 0 && (
        <span className="ml-1 text-xs text-gray-500">
          ({rating.count})
        </span>
      )}
    </div>
  );
}

export function RatingButton({ slug }: { slug: string }) {
  const [userRating, setUserRating] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(`${RATINGS_KEY}-${slug}`);
    if (stored) {
      setUserRating(JSON.parse(stored));
      setHasRated(true);
    }
  }, [slug]);

  const handleRate = (rating: number) => {
    if (hasRated) return;

    const ratings = getRatings();
    const current = ratings[slug] || { average: 0, count: 0 };
    const newCount = current.count + 1;
    const newAverage = (current.average * current.count + rating) / newCount;

    ratings[slug] = { average: newAverage, count: newCount };
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    localStorage.setItem(`${RATINGS_KEY}-${slug}`, JSON.stringify(rating));

    setUserRating(rating);
    setHasRated(true);
    window.dispatchEvent(new CustomEvent("resbook:ratings-updated"));
  };

  if (!isClient || hasRated) return null;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleRate(i + 1)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star className="w-5 h-5 text-gray-300 hover:text-yellow-500" />
        </button>
      ))}    </div>
  );
}

export function getRatings(): RatingData {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(RATINGS_KEY);
  return stored ? JSON.parse(stored) : {};
}