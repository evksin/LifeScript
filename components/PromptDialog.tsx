"use client";

import { useState, useEffect } from "react";
import { createPrompt, updatePrompt } from "@/app/actions/prompts";
import type { LifeScript } from "@prisma/client";

interface PromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prompt?: LifeScript | null;
  onSuccess?: () => void;
}

export function PromptDialog({
  isOpen,
  onClose,
  prompt,
  onSuccess,
}: PromptDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setIsPublic(prompt.isPublic);
    } else {
      setTitle("");
      setContent("");
      setIsPublic(false);
    }
    setError(null);
  }, [prompt, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (prompt) {
        // Обновление
        const result = await updatePrompt({
          id: prompt.id,
          title,
          content,
          isPublic,
        });
        if (result.error) {
          setError(result.error);
        } else {
          onSuccess?.();
          onClose();
        }
      } else {
        // Создание
        const result = await createPrompt({
          title,
          content,
          isPublic,
        });
        if (result.error) {
          setError(result.error);
        } else {
          onSuccess?.();
          onClose();
        }
      }
    } catch (err) {
      setError("Произошла ошибка при сохранении");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#333",
          }}
        >
          {prompt ? "Редактировать промпт" : "Создать новый промпт"}
        </h2>

        {error && (
          <div
            style={{
              padding: "0.75rem",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "6px",
              color: "#c33",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="title"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Заголовок
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="content"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Содержимое
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isSubmitting}
              rows={10}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isSubmitting}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              />
              <span style={{ color: "#333" }}>Публичный (виден всем)</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f0f0f0",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Сохранение..." : prompt ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
