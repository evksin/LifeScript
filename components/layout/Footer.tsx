import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#f5f5f5",
        borderTop: "1px solid #e0e0e0",
        padding: "2rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>
            © {currentYear} LifeScript
          </span>
        </div>

        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <Link
            href="/"
            style={{
              color: "#666",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#666";
            }}
          >
            Главная
          </Link>
          <Link
            href="/dashboard"
            style={{
              color: "#666",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#666";
            }}
          >
            Дашборд
          </Link>
        </nav>
      </div>
    </footer>
  );
}
