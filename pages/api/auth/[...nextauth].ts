import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export default async function authHandler(req: any, res: any) {
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
      console.log("[NextAuth Pages Router] Редирект на Google OAuth. Ожидаемый callback URL:", 
        `${process.env.NEXTAUTH_URL || "https://life-script-swart.vercel.app"}/api/auth/callback/google`
      );
    }
    
    // Для callback логируем детали
    if (isCallback) {
      console.log("[NextAuth Pages Router] OAuth callback получен! Обработка...");
    }
    
    return await handler(req, res);
  } catch (error) {
    console.error("[NextAuth Pages Router] Ошибка:", error);
    if (error instanceof Error) {
      console.error("[NextAuth Pages Router] Сообщение об ошибке:", error.message);
      console.error("[NextAuth Pages Router] Stack:", error.stack);
    }
    throw error;
  }
}
