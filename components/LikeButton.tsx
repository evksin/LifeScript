"use client";

import { useState } from "react";

interface LikeButtonProps {
  promptId: string;
  initialLiked: boolean;
  initialCount: number;
  onUpdate?: () => void;
}

export function LikeButton({
  promptId,
  initialLiked,
  initialCount,
  onUpdate,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/prompts/${promptId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Ошибка при обработке лайка");
      }

      const data = await response.json();
      setLiked(data.liked);
      setCount(data.likesCount);
      onUpdate?.();
    } catch (error) {
      console.error("Ошибка при обработке лайка:", error);
      // Откатываем изменения в случае ошибки
      setLiked(initialLiked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        background: liked ? "#ff6b6b" : "#f0f0f0",
        color: liked ? "white" : "#333",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "0.875rem",
        fontWeight: "500",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span style={{ fontSize: "1.125rem" }}>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
}
