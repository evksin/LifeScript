"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { togglePublic, toggleFavorite, deletePrompt } from "@/app/actions/prompts";
import type { LifeScript } from "@prisma/client";

interface PromptCardProps {
  prompt: LifeScript;
  onEdit?: (prompt: LifeScript) => void;
  onUpdate?: () => void;
  showActions?: boolean; // Показывать ли кнопки редактирования/удаления
}

export function PromptCard({ prompt, onEdit, onUpdate, showActions = true }: PromptCardProps) {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Проверяем, принадлежит ли промпт текущему пользователю
  // В публичных промптах может быть owner, но мы не знаем userId из сессии напрямую
  // Поэтому используем showActions для контроля
  const canEdit = showActions && onEdit !== undefined;

  const handleTogglePublic = async () => {
    setIsUpdating(true);
    try {
      await togglePublic(prompt.id);
      onUpdate?.();
    } catch (error) {
      console.error("Ошибка при изменении видимости:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    try {
      await toggleFavorite(prompt.id);
      onUpdate?.();
    } catch (error) {
      console.error("Ошибка при изменении избранного:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот промпт?")) {
      return;
    }
    setIsUpdating(true);
    try {
      await deletePrompt(prompt.id);
      onUpdate?.();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const preview = prompt.content.length > 150
    ? prompt.content.substring(0, 150) + "..."
    : prompt.content;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            margin: 0,
            color: "#333",
            flex: 1,
          }}
        >
          {prompt.title}
        </h3>
        {showActions && (
          <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
            <button
              onClick={handleToggleFavorite}
              disabled={isUpdating}
              style={{
                background: "transparent",
                border: "none",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: "1.25rem",
                opacity: isUpdating ? 0.5 : 1,
                padding: "0.25rem",
              }}
              title={prompt.isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
              {prompt.isFavorite ? "⭐" : "☆"}
            </button>
            <button
              onClick={handleTogglePublic}
              disabled={isUpdating}
              style={{
                background: "transparent",
                border: "none",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: "1.25rem",
                opacity: isUpdating ? 0.5 : 1,
                padding: "0.25rem",
              }}
              title={prompt.isPublic ? "Сделать приватным" : "Сделать публичным"}
            >
              {prompt.isPublic ? "🌐" : "🔒"}
            </button>
          </div>
        )}
      </div>

      <p
        style={{
          color: "#666",
          fontSize: "0.9375rem",
          lineHeight: "1.6",
          marginBottom: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {preview}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.875rem", color: "#999" }}>
          {new Date(prompt.updatedAt).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => onEdit?.(prompt)}
              disabled={isUpdating}
              style={{
                padding: "0.5rem 1rem",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                opacity: isUpdating ? 0.5 : 1,
              }}
            >
              ✏️ Редактировать
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating}
              style={{
                padding: "0.5rem 1rem",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isUpdating ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                opacity: isUpdating ? 0.5 : 1,
              }}
            >
              🗑️ Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
