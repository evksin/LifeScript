import { prisma } from "@/lib/prisma";

async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return notes;
  } catch (error) {
    console.error("Ошибка при получении заметок:", error);
    return [];
  }
}

type Note = Awaited<ReturnType<typeof getNotes>>[0];

export default async function Home() {
  const notes = await getNotes();

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", fontSize: "2rem" }}>
        LifeScript - Next.js + Prisma + NeonDB
      </h1>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
          Заметки из PostgreSQL (NeonDB)
        </h2>

        {notes.length === 0 ? (
          <p style={{ color: "#666" }}>
            Заметок пока нет. Запустите seed: <code>npm run db:seed</code>
          </p>
        ) : (
          <ul style={{ listStyle: "none" }}>
            {notes.map((note: Note) => (
              <li
                key={note.id}
                style={{
                  padding: "1rem",
                  marginBottom: "0.5rem",
                  background: "#f9f9f9",
                  borderRadius: "4px",
                  borderLeft: "3px solid #0070f3",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  {note.title}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#666" }}>
                  Создано: {new Date(note.createdAt).toLocaleString("ru-RU")}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#999",
                    marginTop: "0.25rem",
                  }}
                >
                  ID: {note.id}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e3f2fd",
          borderRadius: "8px",
          fontSize: "0.875rem",
        }}
      >
        <strong>Статус:</strong> Подключение к базе данных работает! Найдено
        заметок: {notes.length}
      </div>
    </main>
  );
}
