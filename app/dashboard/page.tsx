import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Отключаем статическую генерацию, так как страница требует авторизации
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Dashboard</h1>
        <Link
          href="/api/auth/signout"
          style={{
            padding: "0.5rem 1rem",
            background: "#dc3545",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "0.875rem",
          }}
        >
          Выйти
        </Link>
      </div>

      {/* Приветственная карточка */}
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          {user.image && (
            <img
              src={user.image}
              alt={user.name || "User"}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
              }}
            />
          )}
          <div>
            <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
              Добро пожаловать, {user.name || user.email}!
            </p>
            <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.875rem" }}>
              {user.email}
            </p>
          </div>
        </div>
        <p style={{ color: "#666", margin: 0 }}>
          Вы успешно вошли в систему. Это защищённая страница.
        </p>
      </div>

      {/* Навигационные карточки */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Мои промпты */}
        <Link
          href="/my-prompts"
          style={{
            display: "block",
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>Мои промпты</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Просмотр и управление вашими промптами
          </p>
        </Link>

        {/* Просмотр базы данных */}
        <Link
          href="/view-db"
          style={{
            display: "block",
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗄️</div>
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>База данных</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Просмотр таблиц и данных в базе
          </p>
        </Link>

        {/* Главная страница */}
        <Link
          href="/"
          style={{
            display: "block",
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            textDecoration: "none",
            color: "inherit",
            border: "2px solid transparent",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏠</div>
          <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>Главная</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
            Вернуться на главную страницу
          </p>
        </Link>
      </div>
    </main>
  );
}

