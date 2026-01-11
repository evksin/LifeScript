import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// getServerSession будет импортирован в lib/auth.ts

// Валидация переменных окружения
function validateEnvVars() {
  const missing: string[] = [];

  if (!process.env.GOOGLE_CLIENT_ID) {
    missing.push("GOOGLE_CLIENT_ID");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (!process.env.NEXTAUTH_SECRET) {
    missing.push("NEXTAUTH_SECRET");
  }

  if (missing.length > 0) {
    const errorMessage = `Отсутствуют переменные окружения: ${missing.join(
      ", "
    )}. Проверьте настройки Vercel: Settings → Environment Variables → Production`;
    console.error("[NextAuth] " + errorMessage);
    throw new Error(errorMessage);
  }
}

// В NextAuth v4 используется NEXTAUTH_URL
const nextAuthUrl = process.env.NEXTAUTH_URL;

// Логируем информацию о URL для диагностики
console.log("[NextAuth] URL конфигурация:", {
  NEXTAUTH_URL: nextAuthUrl || "не установлен",
  VERCEL_URL: process.env.VERCEL_URL || "не установлен",
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL || "не установлен",
});

if (
  !nextAuthUrl &&
  (process.env.NODE_ENV === "production" || process.env.VERCEL)
) {
  console.warn(
    "[NextAuth] ВНИМАНИЕ: NEXTAUTH_URL не установлен в production! Это может вызвать ошибку Configuration."
  );
}

// Конфигурация NextAuth
export const authOptions: any = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Явно указываем authorization URL для избежания проблем с локализованными доменами
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Принудительно используем английский язык и основной домен .com
          hl: "en",
          // Принудительно используем английский (США) для избежания локализованных доменов
          gl: "us",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: any;
    }) {
      try {
        console.log("[NextAuth] signIn callback:", {
          user: user?.email,
          provider: account?.provider,
          hasAccount: !!account,
          hasProfile: !!profile,
          accountType: account?.type,
          accountId: account?.id,
        });

        // В production всегда логируем для диагностики
        if (process.env.VERCEL || process.env.NODE_ENV === "production") {
          console.log("[NextAuth] signIn callback (production):", {
            userEmail: user?.email,
            provider: account?.provider,
            hasAccount: !!account,
            hasProfile: !!profile,
          });
        }

        if (account?.provider === "google") {
          return true;
        }
        return true;
      } catch (error) {
        console.error("[NextAuth] Ошибка в signIn callback:", error);
        if (error instanceof Error) {
          console.error("[NextAuth] Сообщение об ошибке:", error.message);
        }
        throw error;
      }
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log("[NextAuth] redirect callback:", { url, baseUrl }); // Always log for diagnosis

      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`;
        if (url === "/login") {
          return `${baseUrl}/dashboard`;
        }
        return redirectUrl;
      }
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          if (urlObj.pathname === "/login") {
            return `${baseUrl}/dashboard`;
          }
          return url;
        }
      } catch (e) {
        console.error("[NextAuth] Ошибка парсинга URL в redirect callback:", e); // Log parsing errors
        // Fallback to dashboard if URL parsing fails
      }
      return `${baseUrl}/dashboard`;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user?: any;
    }) {
      if (session?.user) {
        if (user) {
          session.user.id = user.id;
        } else if (token?.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Включаем debug для диагностики на Vercel
  // Явно указываем URL для правильной работы callback на Vercel
  ...(nextAuthUrl ? { url: nextAuthUrl } : {}),
};

// Инициализируем NextAuth
let nextAuthHandler: ReturnType<typeof NextAuth> | null = null;

function getNextAuthHandler() {
  if (nextAuthHandler) {
    return nextAuthHandler;
  }

  try {
    validateEnvVars();
    console.log("[NextAuth] Инициализация NextAuth v4...");
    nextAuthHandler = NextAuth(authOptions);
    console.log("[NextAuth] NextAuth v4 успешно инициализирован");
    return nextAuthHandler;
  } catch (error) {
    console.error("[NextAuth] Ошибка при инициализации NextAuth:", error);
    if (error instanceof Error) {
      console.error("[NextAuth] Сообщение об ошибке:", error.message);
    }
    throw error;
  }
}

// Экспортируем authOptions для использования в route.ts
// Обработчики GET и POST создаются в route.ts

// Экспортируем authOptions для использования в lib/auth.ts
