"use client";

import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const [providers, setProviders] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Ошибка</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Тест NextAuth API</h1>
      <div style={{ marginTop: "2rem" }}>
        <h2>Провайдеры:</h2>
        <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "4px" }}>
          {JSON.stringify(providers, null, 2)}
        </pre>
      </div>
      {providers && Object.keys(providers).length === 0 && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#fff3cd", borderRadius: "4px" }}>
          ⚠️ Провайдеры не найдены. Проверьте конфигурацию NextAuth.
        </div>
      )}
      {providers && providers.google && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#d4edda", borderRadius: "4px" }}>
          ✅ Google провайдер настроен правильно!
        </div>
      )}
    </div>
  );
}

