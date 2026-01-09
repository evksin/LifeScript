import { auth } from "@/auth";

export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    // Если NextAuth не инициализирован, возвращаем null
    // Это может произойти во время сборки, если переменные окружения недоступны
    console.error("[getCurrentUser] Ошибка при получении сессии:", error);
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}
