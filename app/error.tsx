"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            fontWeight: "bold",
            color: "#dc3545",
          }}
        >
          Произошла ошибка
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          {error.message || "Неизвестная ошибка"}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.875rem 1.5rem",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </div>
    </main>
  );
}

