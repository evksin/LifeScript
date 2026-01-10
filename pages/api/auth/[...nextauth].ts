import NextAuth from "next-auth";
import { authOptions } from "@/auth";

// Логируем при загрузке модуля
console.log(
  "[NextAuth Pages Router] Модуль загружен. NEXTAUTH_URL:",
  process.env.NEXTAUTH_URL
);

const handler = NextAuth(authOptions);

export default async function authHandler(req: any, res: any) {
  // Логируем ВСЕГДА, даже до try-catch
  console.log("[NextAuth Pages Router] === НАЧАЛО ОБРАБОТКИ ЗАПРОСА ===");
  console.log("[NextAuth Pages Router] Метод:", req.method);
  console.log("[NextAuth Pages Router] URL:", req.url);
  console.log("[NextAuth Pages Router] Query:", JSON.stringify(req.query));

  try {
    const path = req.url?.split("?")[0] || "";
    const isSignin = path.includes("/signin/google");
    const isCallback = path.includes("/callback/google");

    console.log("[NextAuth Pages Router] Запрос:", {
      method: req.method,
      url: req.url,
      path: path,
      query: req.query,
      isSignin,
      isCallback,
    });

    // Для signin логируем, куда будет редирект
    if (isSignin) {
      const expectedCallback = `${
        process.env.NEXTAUTH_URL || "https://life-script-swart.vercel.app"
      }/api/auth/callback/google`;
      console.log(
        "[NextAuth Pages Router] Редирект на Google OAuth. Ожидаемый callback URL:",
        expectedCallback
      );
      console.log(
        "[NextAuth Pages Router] Убедитесь, что этот URL указан в Google Console!"
      );
    }

    // Для callback логируем детали
    if (isCallback) {
      console.log(
        "[NextAuth Pages Router] ✅ OAuth callback получен! Обработка..."
      );
      console.log(
        "[NextAuth Pages Router] Callback query params:",
        JSON.stringify(req.query)
      );
    }

    const result = await handler(req, res);
    console.log("[NextAuth Pages Router] === ЗАПРОС ОБРАБОТАН ===");
    return result;
  } catch (error) {
    console.error("[NextAuth Pages Router] ❌ ОШИБКА:", error);
    if (error instanceof Error) {
      console.error(
        "[NextAuth Pages Router] Сообщение об ошибке:",
        error.message
      );
      console.error("[NextAuth Pages Router] Stack:", error.stack);
    }
    throw error;
  }
}
