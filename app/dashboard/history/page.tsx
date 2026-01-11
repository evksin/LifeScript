"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
              История
            </h1>
            <p style={{ color: "#666", margin: 0 }}>
              История ваших действий (в разработке)
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
            Функция истории находится в разработке
          </p>
        </div>
      </main>
    </div>
  );
}
