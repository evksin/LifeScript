"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "#dc3545" }}>Ошибка</h1>
      <p style={{ color: "#666", marginBottom: "1rem" }}>
        {error.message || "Неизвестная ошибка"}
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1rem",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Попробовать снова
      </button>
    </div>
  );
}

