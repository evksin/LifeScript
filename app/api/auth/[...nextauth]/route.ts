import NextAuth from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

// Обертки для логирования
export async function GET(req: NextRequest) {
  const url = req.url;
  const pathname = new URL(url).pathname;
  
  console.log(`[Route] GET запрос к:`, pathname);
  console.log(`[Route] Полный URL:`, url);
  
  // Логируем заголовки для диагностики
  const headers: Record<string, string> = {};
  const headerNames = ['host', 'origin', 'referer', 'x-forwarded-host', 'x-forwarded-proto'];
  headerNames.forEach(name => {
    const value = req.headers.get(name);
    if (value) headers[name] = value;
  });
  if (Object.keys(headers).length > 0) {
    console.log(`[Route] Заголовки запроса:`, headers);
  }
  
  // Особенно важно логировать callback запросы
  if (pathname.includes("/callback")) {
    console.log(`[Route] Callback запрос! URL:`, url);
    console.log(`[Route] Query параметры:`, new URL(url).searchParams.toString());
  }
  
  try {
    const response = await handler(req);
    console.log(`[Route] GET вернул ответ со статусом:`, response.status);
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      console.log(`[Route] Редирект (${response.status}) на:`, location);
    }
    
    return response;
  } catch (error) {
    console.error(`[Route] Ошибка в GET:`, error);
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
  
  try {
    const response = await handler(req);
    console.log(`[Route] POST вернул ответ со статусом:`, response.status);
    return response;
  } catch (error) {
    console.error(`[Route] Ошибка в POST:`, error);
    if (error instanceof Error) {
      console.error(`[Route] Сообщение:`, error.message);
    }
    throw error;
  }
}
