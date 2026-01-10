import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export default async function authHandler(req: any, res: any) {
  try {
    console.log("[NextAuth Pages Router] Запрос:", {
      method: req.method,
      url: req.url,
      path: req.url?.split("?")[0],
      query: req.query,
    });
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
