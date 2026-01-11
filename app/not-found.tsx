import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#333",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#666",
          marginBottom: "2rem",
        }}
      >
        Страница не найдена
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.875rem 2rem",
          background: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "500",
          transition: "background 0.2s",
        }}
      >
        Вернуться на главную
      </Link>
    </main>
  );
}
