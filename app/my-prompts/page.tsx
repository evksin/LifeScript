import { getCurrentUser, getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Отключаем статическую генерацию, так как страница требует авторизации
export const dynamic = 'force-dynamic';

export default async function MyPromptsPage() {
  const user = await getCurrentUser();
  const userId = await getUserId();

  if (!user || !userId) {
    redirect("/login");
  }

  const prompts = await prisma.lifeScript.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Мои промпты</h1>
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {prompts.length === 0 ? (
          <p style={{ color: "#666" }}>У вас пока нет промптов.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {prompts.map((prompt) => (
              <li
                key={prompt.id}
                style={{
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  background: "#f9f9f9",
                  borderRadius: "4px",
                  borderLeft: "3px solid #0070f3",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  {prompt.title}
                </div>
                {prompt.description && (
                  <div style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem" }}>
                    {prompt.description}
                  </div>
                )}
                <div style={{ fontSize: "0.75rem", color: "#999" }}>
                  Создано: {new Date(prompt.createdAt).toLocaleString("ru-RU")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

