"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  href: string;
  label: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { href: "/dashboard", label: "Все промпты", icon: "📝" },
  { href: "/dashboard/public", label: "Публичные", icon: "🌐" },
  { href: "/dashboard/favorites", label: "Избранное", icon: "⭐" },
  { href: "/dashboard/history", label: "История", icon: "📜" },
  { href: "/dashboard/settings", label: "Настройки", icon: "⚙️" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "#f8f9fa",
        borderRight: "1px solid #e0e0e0",
        padding: "1.5rem 1rem",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            color: "#333",
          }}
        >
          LifeScript
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#666",
            margin: 0,
          }}
        >
          Управление промптами
        </p>
      </div>

      <nav>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: isActive ? "#0070f3" : "#333",
                    background: isActive ? "#e3f2fd" : "transparent",
                    fontWeight: isActive ? "600" : "400",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f0f0f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
