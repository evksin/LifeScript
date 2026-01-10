import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return (session as any)?.user || null;
  } catch (error) {
    console.error("[getCurrentUser] Ошибка при получении сессии:", error);
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}
