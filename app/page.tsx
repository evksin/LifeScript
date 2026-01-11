import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  // Если пользователь авторизован, перенаправляем на dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            marginBottom: "1rem",
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          LifeScript
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#666", marginBottom: "2rem" }}>
          Управление вашими промптами и скриптами
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#333" }}>
          Добро пожаловать в LifeScript
        </h2>
        <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "1.5rem" }}>
          LifeScript — это платформа для создания, управления и организации
          ваших промптов и скриптов. Создавайте промпты, делайте их публичными
          или приватными, добавляйте в избранное и многое другое.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              background: "#0070f3",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Войти в систему
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem" }}>
            Создание промптов
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Создавайте и редактируйте свои промпты
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌐</div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem" }}>
            Публичные промпты
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Делитесь промптами с сообществом
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⭐</div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem" }}>
            Избранное
          </h3>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Сохраняйте важные промпты
          </p>
        </div>
      </div>
    </main>
  );
}
