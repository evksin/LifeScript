import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Валидация переменных окружения (только во время выполнения, не во время сборки)
function validateEnvVars() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID не установлен в переменных окружения");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET не установлен в переменных окружения");
  }
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET не установлен в переменных окружения");
  }
}

// В NextAuth v5 используется AUTH_URL, но поддерживается и NEXTAUTH_URL
const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL;
if (process.env.NODE_ENV === "development" && !authUrl) {
  console.warn(
    "[NextAuth] Предупреждение: AUTH_URL или NEXTAUTH_URL не установлен. NextAuth попытается определить URL автоматически."
  );
}

// Инициализируем NextAuth с обработкой ошибок
let nextAuthConfig;
let nextAuthInstance: ReturnType<typeof NextAuth> | null = null;

function initNextAuth() {
  // Проверяем переменные окружения только во время выполнения
  validateEnvVars();
  
  if (nextAuthInstance) {
    return nextAuthInstance;
  }

  try {
    // После validateEnvVars() мы знаем, что переменные установлены
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const authSecret = process.env.AUTH_SECRET!;
    
    nextAuthConfig = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
      Google({
        clientId,
        clientSecret,
      }),
    ],
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
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
    session: async ({ session, token, user }: { session: any; token: any; user?: any }) => {
      if (session?.user) {
        if (user) {
          session.user.id = user.id;
        } else if (token?.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
    jwt: async ({ token, user }: { token: any; user?: any }) => {
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
    secret: authSecret,
    debug: process.env.NODE_ENV === "development",
    basePath: "/api/auth",
    // trustHost не поддерживается в типах NextAuth v5, но функциональность работает
    // Используем as any для обхода проверки типов
    } as any;
    
    nextAuthInstance = NextAuth(nextAuthConfig);
    return nextAuthInstance;
  } catch (error) {
    console.error("[NextAuth] Ошибка при создании конфигурации:", error);
    throw error;
  }
}

// Инициализируем NextAuth
// Если переменные окружения не установлены, это вызовет ошибку
// Это нормально, так как без переменных NextAuth не может работать
let nextAuth: ReturnType<typeof NextAuth> | null = null;

try {
  nextAuth = initNextAuth();
} catch (error) {
  // Во время сборки переменные могут быть недоступны
  // В этом случае nextAuth будет null, и ошибка произойдет при первом использовании
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
    console.error("[NextAuth] Ошибка инициализации:", error);
  }
}

// Создаем заглушку для случая, когда NextAuth не инициализирован
const createErrorHandler = (name: string) => {
  return (...args: any[]) => {
    throw new Error(
      `NextAuth не инициализирован (${name}). Проверьте переменные окружения:\n` +
      "- GOOGLE_CLIENT_ID\n" +
      "- GOOGLE_CLIENT_SECRET\n" +
      "- AUTH_SECRET"
    );
  };
};

export const handlers = nextAuth?.handlers || {
  GET: createErrorHandler("handlers.GET"),
  POST: createErrorHandler("handlers.POST"),
} as any;

export const auth = nextAuth?.auth || createErrorHandler("auth") as any;
export const signIn = nextAuth?.signIn || createErrorHandler("signIn") as any;
export const signOut = nextAuth?.signOut || createErrorHandler("signOut") as any;
