import { handlers } from "@/auth";
import { NextRequest } from "next/server";

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

// Обертки для логирования запросов
export async function GET(req: NextRequest) {
  const url = req.url;
  const pathname = new URL(url).pathname;
  
  console.log(`[Route] GET запрос к:`, pathname);
  console.log(`[Route] Полный URL:`, url);
  
  // Логируем заголовки
  const headers: Record<string, string> = {};
  const headerNames = ['host', 'origin', 'referer', 'x-forwarded-host', 'x-forwarded-proto', 'x-vercel-deployment-url'];
  headerNames.forEach(name => {
    const value = req.headers.get(name);
    if (value) headers[name] = value;
  });
  if (Object.keys(headers).length > 0) {
    console.log(`[Route] Заголовки запроса:`, headers);
  }
  
  if (pathname.includes("/signin")) {
    console.log(`[Route] Запрос к signin, переменные окружения:`, {
      AUTH_URL: process.env.AUTH_URL || "не установлен",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "не установлен",
      VERCEL_URL: process.env.VERCEL_URL || "не установлен",
    });
  }
  
  if (!handlers?.GET) {
    console.error(`[Route] handlers.GET не определен!`);
    return errorHandler();
  }
  
  try {
    const response = await handlers.GET(req);
    console.log(`[Route] handlers.GET вернул ответ со статусом:`, response.status);
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      console.log(`[Route] Редирект (${response.status}) на:`, location);
    }
    
    return response;
  } catch (error) {
    console.error(`[Route] Ошибка в handlers.GET:`, error);
    if (error instanceof Error) {
      console.error(`[Route] Сообщение:`, error.message);
      console.error(`[Route] Стек:`, error.stack);
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const url = req.url;
  const pathname = new URL(url).pathname;
  
  console.log(`[Route] POST запрос к:`, pathname);
  
  if (!handlers?.POST) {
    console.error(`[Route] handlers.POST не определен!`);
    return errorHandler();
  }
  
  try {
    const response = await handlers.POST(req);
    console.log(`[Route] handlers.POST вернул ответ со статусом:`, response.status);
    return response;
  } catch (error) {
    console.error(`[Route] Ошибка в handlers.POST:`, error);
    if (error instanceof Error) {
      console.error(`[Route] Сообщение:`, error.message);
    }
    throw error;
  }
}

