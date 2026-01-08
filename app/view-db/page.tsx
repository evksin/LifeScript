"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewDbPage() {
  const router = useRouter();
  const [selectedDb, setSelectedDb] = useState<"local" | "production" | null>(
    null
  );

  const handleSelect = (db: "local" | "production") => {
    setSelectedDb(db);
    // Сохраняем выбор в sessionStorage
    sessionStorage.setItem("selectedDb", db);
    router.push("/view-db/tables");
  };

  return (
    <main
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>
        Просмотр базы данных
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            border: selectedDb === "local" ? "3px solid #0070f3" : "3px solid transparent",
            transition: "all 0.2s",
          }}
          onClick={() => handleSelect("local")}
          onMouseEnter={(e) => {
            if (selectedDb !== "local") {
              e.currentTarget.style.borderColor = "#0070f3";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDb !== "local") {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
            Локальная БД
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Использует DATABASE_URL из .env.local
          </p>
          <button
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Выбрать
          </button>
        </div>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
            border: selectedDb === "production" ? "3px solid #0070f3" : "3px solid transparent",
            transition: "all 0.2s",
          }}
          onClick={() => handleSelect("production")}
          onMouseEnter={(e) => {
            if (selectedDb !== "production") {
              e.currentTarget.style.borderColor = "#0070f3";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDb !== "production") {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
            Рабочая БД
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Использует DATABASE_URL из переменных окружения Vercel
          </p>
          <button
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Выбрать
          </button>
        </div>
      </div>
    </main>
  );
}

