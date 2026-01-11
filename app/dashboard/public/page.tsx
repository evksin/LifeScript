"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter as useNextRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PromptCard } from "@/components/PromptCard";
import { PromptDialog } from "@/components/PromptDialog";
import { getPublicPrompts } from "@/app/actions/prompts";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { LifeScript } from "@prisma/client";

interface PromptWithLikes extends LifeScript {
  likesCount: number;
  likedByMe: boolean;
}

function PublicPromptsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRouter = useNextRouter();
  const [prompts, setPrompts] = useState<PromptWithLikes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<"popular" | "recent">(
    (searchParams?.get("sort") as "popular" | "recent") || "recent"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (status === "authenticated") {
      loadPrompts();
    }
  }, [status, debouncedSearch, sort]);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      // userId будет получен внутри getPublicPrompts через getUserId
      const result = await getPublicPrompts(
        debouncedSearch || undefined,
        sort,
        null // Передаем null, так как getPublicPrompts сам получит userId через getUserId
      );
      if (result.success && result.data) {
        setPrompts(result.data as PromptWithLikes[]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке публичных промптов:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: "popular" | "recent") => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("sort", newSort);
    nextRouter.push(`/dashboard/public?${params.toString()}`);
  };

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p>Загрузка...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <DashboardSidebar />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
                marginBottom: "0.5rem",
                color: "#333",
              }}
            >
              Публичные промпты
            </h1>
            <p style={{ color: "#666", margin: 0 }}>
              Промпты, доступные всем пользователям
            </p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: "0.5rem 1rem",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Выйти
          </button>
        </div>

        <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Поиск по заголовку или содержимому..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleSortChange("popular")}
              style={{
                padding: "0.75rem 1.5rem",
                background: sort === "popular" ? "#0070f3" : "#f0f0f0",
                color: sort === "popular" ? "white" : "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Популярные
            </button>
            <button
              onClick={() => handleSortChange("recent")}
              style={{
                padding: "0.75rem 1.5rem",
                background: sort === "recent" ? "#0070f3" : "#f0f0f0",
                color: sort === "recent" ? "white" : "#333",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Новые
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem",
            }}
          >
            <p style={{ color: "#666" }}>Загрузка промптов...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "3rem",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: "1.125rem", color: "#666" }}>
              {debouncedSearch
                ? "Публичные промпты не найдены"
                : "Публичных промптов пока нет"}
            </p>
          </div>
        ) : (
          <div>
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onUpdate={loadPrompts}
                showActions={false}
                showLike={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function PublicPromptsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>Загрузка...</p>
        </div>
      }
    >
      <PublicPromptsContent />
    </Suspense>
  );
}
