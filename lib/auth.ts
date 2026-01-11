import { getServerSession } from "next-auth/next";

// Безопасный импорт authOptions с обработкой ошибок
let authOptions: any = null;
try {
  const authModule = require("@/auth");
  authOptions = authModule.authOptions;
} catch (error) {
  console.error("[lib/auth] Ошибка при импорте authOptions:", error);
}

export async function getCurrentUser() {
  // Если authOptions не загружен, возвращаем null
  if (!authOptions) {
    return null;
  }

  try {
    const session = await getServerSession(authOptions);
    return (session as any)?.user || null;
  } catch (error) {
    console.error("[getCurrentUser] Ошибка при получении сессии:", error);
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user?.id || null;
  } catch (error) {
    console.error("[getUserId] Ошибка:", error);
    return null;
  }
}
