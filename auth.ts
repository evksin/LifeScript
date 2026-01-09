import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Валидация переменных окружения
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID не установлен в переменных окружения");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET не установлен в переменных окружения");
}
if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET не установлен в переменных окружения");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Разрешаем вход для всех пользователей Google
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth] signIn callback:", {
          user: user?.email,
          provider: account?.provider,
        });
      }
      if (account?.provider === "google") {
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (process.env.NODE_ENV === "development") {
        console.log("[NextAuth] redirect callback:", { url, baseUrl });
      }

      // Если URL начинается с "/", это относительный путь - используем baseUrl
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        // Не редиректим на /login, если это не было явно запрошено
        if (url === "/login") {
          return `${baseUrl}/dashboard`;
        }
        return redirectUrl;
      }
      // Если URL начинается с baseUrl, разрешаем редирект
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          // Не редиректим на /login
          if (urlObj.pathname === "/login") {
            return `${baseUrl}/dashboard`;
          }
          return url;
        }
      } catch (e) {
        // Если не удалось распарсить URL, редиректим на dashboard
      }
      // По умолчанию редиректим на dashboard
      return `${baseUrl}/dashboard`;
    },
    session: async ({ session, token, user }) => {
      if (session?.user) {
        if (user) {
          session.user.id = user.id;
        } else if (token?.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  // Явно указываем baseUrl для избежания проблем с определением порта
  basePath: "/api/auth",
});
