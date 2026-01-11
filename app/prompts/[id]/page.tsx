import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getUserId();

  const prompt = await prisma.lifeScript.findFirst({
    where: {
      id,
      isPublic: true, // Только публичные промпты
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      likes: userId
        ? {
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  if (!prompt) {
    notFound();
  }

  const likesCount = prompt._count.likes;
  const likedByMe = userId
    ? prompt.likes && Array.isArray(prompt.likes) && prompt.likes.length > 0
    : false;

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "2rem",
          color: "#666",
          textDecoration: "none",
          fontSize: "0.875rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#333";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#666";
        }}
      >
        ← Назад к главной
      </Link>

      <article
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: 0,
                marginBottom: "0.5rem",
                color: "#333",
              }}
            >
              {prompt.title}
            </h1>
            {prompt.owner && (
              <div style={{ fontSize: "0.9375rem", color: "#999" }}>
                Автор: {prompt.owner.name || prompt.owner.email || "Неизвестно"}
              </div>
            )}
            <div
              style={{
                fontSize: "0.875rem",
                color: "#999",
                marginTop: "0.5rem",
              }}
            >
              Создано:{" "}
              {new Date(prompt.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          {userId && (
            <div style={{ marginLeft: "1rem" }}>
              <LikeButton
                promptId={prompt.id}
                initialLiked={likedByMe}
                initialCount={likesCount}
              />
            </div>
          )}
        </div>

        {prompt.description && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: 0, color: "#666", lineHeight: "1.6" }}>
              {prompt.description}
            </p>
          </div>
        )}

        <div
          style={{
            color: "#333",
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",
            fontSize: "1rem",
          }}
        >
          {prompt.content}
        </div>
      </article>
    </main>
  );
}
