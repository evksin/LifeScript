"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface TableData {
  [key: string]: any;
}

export default function TableViewPage() {
  const router = useRouter();
  const params = useParams();
  const tableName = (params?.table as string) || "";

  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<TableData>({});
  const [showCreate, setShowCreate] = useState(false);
  const [newData, setNewData] = useState<TableData>({});

  const tableDisplayNames: { [key: string]: string } = {
    users: "Пользователи",
    notes: "Заметки",
    categories: "Категории",
    life_scripts: "LifeScripts",
    tags: "Теги",
    tag_on_life_script: "Теги на LifeScript",
    votes: "Голоса",
  };

  useEffect(() => {
    fetchData();
  }, [page, tableName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/view-db/tables/${tableName}?page=${page}`
      );
      const result = await response.json();
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TableData) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/view-db/tables/${tableName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setEditingId(null);
        fetchData();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Ошибка при сохранении");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту запись?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/view-db/tables/${tableName}?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Ошибка при удалении");
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/view-db/tables/${tableName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        setShowCreate(false);
        setNewData({});
        fetchData();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error("Ошибка при создании:", error);
      alert("Ошибка при создании");
    }
  };

  const getFieldValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      if (value instanceof Date) {
        return new Date(value).toLocaleString("ru-RU");
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (loading && data.length === 0) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <p>Загрузка...</p>
      </main>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <main style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/view-db/tables"
          style={{
            padding: "0.5rem 1rem",
            background: "#f0f0f0",
            borderRadius: "4px",
            textDecoration: "none",
            color: "#333",
            display: "inline-block",
            marginBottom: "1rem",
          }}
        >
          ← Назад к таблицам
        </Link>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {tableDisplayNames[tableName] || tableName}
        </h1>
        <p style={{ color: "#666" }}>
          Всего записей: {total} | Страница {page} из {totalPages}
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {showCreate ? "Отмена" : "+ Создать запись"}
        </button>
      </div>

      {showCreate && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "2px solid #28a745",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Создать новую запись</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {columns
              .filter((col) => col !== "id" && !col.includes("Id"))
              .map((col) => (
                <div key={col}>
                  <label style={{ display: "block", marginBottom: "0.25rem" }}>
                    {col}:
                  </label>
                  <input
                    type="text"
                    value={newData[col] || ""}
                    onChange={(e) =>
                      setNewData({ ...newData, [col]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ))}
          </div>
          <button
            onClick={handleCreate}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Создать
          </button>
        </div>
      )}

      <div
        style={{
          background: "white",
          borderRadius: "8px",
          overflow: "auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {col}
                </th>
              ))}
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id || idx}
                style={{
                  borderBottom: "1px solid #eee",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: "0.75rem 1rem",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={getFieldValue(editData[col])}
                        onChange={(e) =>
                          setEditData({ ...editData, [col]: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "0.25rem",
                          border: "1px solid #0070f3",
                          borderRadius: "2px",
                        }}
                      />
                    ) : (
                      <span title={getFieldValue(item[col])}>
                        {getFieldValue(item[col])}
                      </span>
                    )}
                  </td>
                ))}
                <td style={{ padding: "0.75rem 1rem" }}>
                  {editingId === item.id ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={handleSave}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#0070f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "2rem",
          }}
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: "0.5rem 1rem",
              background: page === 1 ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Назад
          </button>
          <span
            style={{
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Страница {page} из {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: "0.5rem 1rem",
              background: page === totalPages ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </main>
  );
}

