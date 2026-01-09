import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Валидация переменных окружения (только во время выполнения, не во время сборки)
function validateEnvVars() {
  const missing: string[] = [];
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    missing.push("GOOGLE_CLIENT_ID");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (!process.env.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }
  
  if (missing.length > 0) {
    const errorMessage = `Отсутствуют переменные окружения: ${missing.join(", ")}. Проверьте настройки Vercel: Settings → Environment Variables → Production`;
    console.error("[NextAuth] " + errorMessage);
    console.error("[NextAuth] Текущие переменные окружения:", {
      hasGOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      hasGOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      hasAUTH_SECRET: !!process.env.AUTH_SECRET,
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      hasAUTH_URL: !!process.env.AUTH_URL,
      hasNEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
    });
    throw new Error(errorMessage);
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

// Пытаемся инициализировать NextAuth при загрузке модуля
// Если это не удается, попробуем при первом использовании
try {
  nextAuth = initNextAuth();
  console.log("[NextAuth] Успешно инициализирован при загрузке модуля");
} catch (error) {
  // Логируем ошибку всегда, чтобы видеть её в логах Vercel
  console.error("[NextAuth] Ошибка инициализации при загрузке модуля:", error);
  if (error instanceof Error) {
    console.error("[NextAuth] Сообщение об ошибке:", error.message);
    console.error("[NextAuth] Стек ошибки:", error.stack);
  }
  // nextAuth останется null, попробуем инициализировать при первом использовании
  console.warn("[NextAuth] NextAuth будет инициализирован при первом запросе");
}

// Функция для ленивой инициализации при первом использовании
function ensureInitialized() {
  if (!nextAuth) {
    try {
      console.log("[NextAuth] Попытка инициализации при первом использовании...");
      nextAuth = initNextAuth();
      console.log("[NextAuth] Успешно инициализирован при первом использовании");
    } catch (error) {
      console.error("[NextAuth] Ошибка инициализации при первом использовании:", error);
      if (error instanceof Error) {
        console.error("[NextAuth] Сообщение об ошибке:", error.message);
      }
      throw error;
    }
  }
  return nextAuth;
}

// Создаем функцию для обработки ошибок инициализации
function createHandler(method: "GET" | "POST") {
  return (req: Request) => {
    try {
      const auth = ensureInitialized();
      if (!auth || !auth.handlers || !auth.handlers[method]) {
        throw new Error(`NextAuth handlers.${method} не доступен после инициализации`);
      }
      return auth.handlers[method](req);
    } catch (error) {
      console.error(`[NextAuth] Ошибка в handlers.${method}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response(
        JSON.stringify({
          error: "NextAuth не инициализирован",
          message: errorMessage,
          details: "Проверьте переменные окружения на Vercel: Settings → Environment Variables → Production",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}

// Создаем обертки, которые инициализируют NextAuth при первом использовании
// handlers всегда определен, даже если NextAuth не инициализирован
const handlersObject = {
  GET: createHandler("GET"),
  POST: createHandler("POST"),
};

// Экспортируем handlers, гарантируя, что он всегда определен
export const handlers: {
  GET: (req: Request) => Promise<Response> | Response;
  POST: (req: Request) => Promise<Response> | Response;
} = handlersObject;

export const auth = () => {
  const authInstance = ensureInitialized();
  return authInstance.auth();
};

export const signIn = (...args: Parameters<ReturnType<typeof NextAuth>["signIn"]>) => {
  const authInstance = ensureInitialized();
  return authInstance.signIn(...args);
};

export const signOut = (...args: Parameters<ReturnType<typeof NextAuth>["signOut"]>) => {
  const authInstance = ensureInitialized();
  return authInstance.signOut(...args);
};
