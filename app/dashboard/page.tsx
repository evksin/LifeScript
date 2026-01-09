import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// Отключаем статическую генерацию, так как страница требует авторизации
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Dashboard</h1>
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ marginBottom: "1rem" }}>
          <strong>Добро пожаловать, {user.name || user.email}!</strong>
        </p>
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          />
        )}
        <p style={{ color: "#666" }}>
          Вы успешно вошли в систему. Это защищённая страница.
        </p>
      </div>
    </main>
  );
}

