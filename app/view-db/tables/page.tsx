"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Table {
  name: string;
  displayName: string;
  count: number;
  available: boolean;
}

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);

  useEffect(() => {
    // Получаем выбранную БД из sessionStorage
    const db = sessionStorage.getItem("selectedDb");
    setSelectedDb(db);

    if (!db) {
      router.push("/view-db");
      return;
    }

    fetchTables();
  }, [router]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/view-db/tables");
      const data = await response.json();
      setTables(data.tables || []);
    } catch (error) {
      console.error("Ошибка при загрузке таблиц:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <p>Загрузка...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href="/view-db"
          style={{
            padding: "0.5rem 1rem",
            background: "#f0f0f0",
            borderRadius: "4px",
            textDecoration: "none",
            color: "#333",
          }}
        >
          ← Назад
        </Link>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>
          Таблицы ({selectedDb === "local" ? "Локальная БД" : "Рабочая БД"})
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {tables.map((table) => (
          <div
            key={table.name}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: table.available ? "1px solid #e0e0e0" : "1px solid #ffcccc",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem" }}>
              {table.displayName}
            </h3>
            <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {table.name}
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Записей:</strong> {table.count}
            </div>
            {table.available ? (
              <Link
                href={`/view-db/tables/${table.name}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem",
                  background: "#0070f3",
                  color: "white",
                  textAlign: "center",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
              >
                Открыть
              </Link>
            ) : (
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#ccc",
                  color: "#666",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "not-allowed",
                }}
              >
                Недоступна
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

