import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

// NextAuth v4 для App Router требует специальной обработки параметров
// Преобразуем параметры из App Router формата в формат, который ожидает NextAuth
export async function GET(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  // NextAuth v4 ожидает параметры в формате { query: { nextauth: [...] } }
  // Создаем объект с правильным форматом
  const nextauthParams = params.nextauth || [];
  
  // Создаем объект запроса с параметрами в правильном формате
  const url = new URL(req.url);
  const query = { nextauth: nextauthParams };
  
  // Передаем запрос и параметры в правильном формате
  return handler(req as any, { query } as any);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const params = await context.params;
  const nextauthParams = params.nextauth || [];
  const query = { nextauth: nextauthParams };
  
  return handler(req as any, { query } as any);
}
