"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header
      style={{
        background: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#333",
          textDecoration: "none",
        }}
      >
        LifeScript
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link
          href="/"
          style={{
            color: "#666",
            textDecoration: "none",
            fontSize: "0.9375rem",
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
        {status === "authenticated" && (
          <>
            <Link
              href="/dashboard"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.9375rem",
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
            <Link
              href="/my-prompts"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: "0.9375rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#666";
              }}
            >
              Мои промпты
            </Link>
          </>
        )}

        {status === "loading" ? (
          <span style={{ color: "#999", fontSize: "0.875rem" }}>Загрузка...</span>
        ) : status === "authenticated" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                }}
              />
            )}
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
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#c82333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#dc3545";
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0051cc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0070f3";
            }}
          >
            Войти
          </button>
        )}
      </nav>
    </header>
  );
}
