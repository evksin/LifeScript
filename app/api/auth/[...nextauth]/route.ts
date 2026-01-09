import { handlers } from "@/auth";

// Создаем fallback handlers на случай, если handlers не определен
const errorHandler = () => {
  return new Response(
    JSON.stringify({
      error: "NextAuth не инициализирован",
      message: "handlers не определен. Проверьте переменные окружения на Vercel.",
      details: "Проверьте: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET, AUTH_URL",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// Экспортируем handlers, используя fallback если handlers не определен
export const GET = handlers?.GET || errorHandler;
export const POST = handlers?.POST || errorHandler;

