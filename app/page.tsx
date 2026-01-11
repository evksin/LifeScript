import { getCurrentUser, getUserId } from "@/lib/auth";
import Link from "next/link";
import { getRecentPrompts, getPopularPrompts } from "@/app/actions/prompts";
import { PromptCard } from "@/components/PromptCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const userId = await getUserId();

  // Получаем недавние и популярные промпты
  let recentPrompts: any[] = [];
  let popularPrompts: any[] = [];

  try {
    const [recentResult, popularResult] = await Promise.all([
      getRecentPrompts(20, userId),
      getPopularPrompts(20, userId),
    ]);

    recentPrompts = recentResult.success ? recentResult.data : [];
    popularPrompts = popularResult.success ? popularResult.data : [];
  } catch (error) {
    console.error("[Home] Ошибка при загрузке промптов:", error);
    // Продолжаем работу с пустыми массивами
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      {/* Hero-секция */}
      <section
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          marginBottom: "4rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "white",
          }}
        >
          LifeScript
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            marginBottom: "2rem",
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          Платформа для создания, управления и обмена промптами
        </p>
        {user ? (
          <Link
            href="/dashboard"
            style={{
              display: "inline-block",
              padding: "1rem 2.5rem",
              background: "white",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "1.125rem",
              fontWeight: "600",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Перейти в дашборд
          </Link>
        ) : (
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "1rem 2.5rem",
              background: "white",
              color: "#667eea",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "1.125rem",
              fontWeight: "600",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Войти / Зарегистрироваться
          </Link>
        )}
      </section>

      {/* Секция недавних промптов */}
      <section style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            Недавние промпты
          </h2>
        </div>
        {recentPrompts.length === 0 ? (
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
              Публичных промптов пока нет
            </p>
          </div>
        ) : (
          <div>
            {recentPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                showActions={false}
                showLike={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* Секция популярных промптов */}
      <section style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          >
            Популярные промпты
          </h2>
        </div>
        {popularPrompts.length === 0 ? (
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
              Популярных промптов пока нет
            </p>
          </div>
        ) : (
          <div>
            {popularPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                showActions={false}
                showLike={true}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
