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

// Логируем информацию о URL для диагностики (всегда, не только в development)
console.log("[NextAuth] URL конфигурация:", {
  AUTH_URL: process.env.AUTH_URL ? "установлен" : "не установлен",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "установлен" : "не установлен",
  VERCEL_URL: process.env.VERCEL_URL || "не установлен",
  authUrl: authUrl || "не установлен",
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL || "не установлен",
});

if (!authUrl && (process.env.NODE_ENV === "production" || process.env.VERCEL)) {
  console.warn(
    "[NextAuth] ВНИМАНИЕ: AUTH_URL или NEXTAUTH_URL не установлен в production! Это может вызвать ошибку Configuration."
  );
}

// Инициализируем NextAuth с обработкой ошибок
let nextAuthConfig;
let nextAuthInstance: ReturnType<typeof NextAuth> | null = null;
let nextAuthHandlers: any = null;

function initNextAuth() {
  // Проверяем переменные окружения только во время выполнения
  validateEnvVars();
  
  if (nextAuthInstance && nextAuthHandlers) {
    return { instance: nextAuthInstance, handlers: nextAuthHandlers };
  }

  try {
    // После validateEnvVars() мы знаем, что переменные установлены
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const authSecret = process.env.AUTH_SECRET!;
    
    console.log("[NextAuth] Инициализация провайдера Google:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasAuthSecret: !!authSecret,
      authUrl: authUrl || "не установлен",
      AUTH_URL: process.env.AUTH_URL || "не установлен",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "не установлен",
      VERCEL_URL: process.env.VERCEL_URL || "не установлен",
    });
    
    // Предупреждение, если AUTH_URL не установлен в production
    if (!authUrl && (process.env.NODE_ENV === "production" || process.env.VERCEL)) {
      console.error("[NextAuth] КРИТИЧЕСКАЯ ОШИБКА: AUTH_URL или NEXTAUTH_URL не установлен!");
      console.error("[NextAuth] Это вызовет ошибку 'Configuration' при попытке входа.");
      console.error("[NextAuth] Установите AUTH_URL=https://life-script-swart.vercel.app на Vercel.");
    }
    
    nextAuthConfig = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
      Google({
        clientId,
        clientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      // Логируем всегда для диагностики
      console.log("[NextAuth] signIn callback:", {
        user: user?.email,
        provider: account?.provider,
        hasAccount: !!account,
        hasProfile: !!profile,
      });
      // Разрешаем вход для всех пользователей Google
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
    debug: process.env.NODE_ENV === "development", // Debug только в development
    basePath: "/api/auth",
    // Явно устанавливаем baseUrl из AUTH_URL
    // В NextAuth v5 beta baseUrl и trustHost могут конфликтовать, поэтому используем только baseUrl
    baseUrl: authUrl || undefined,
    // Используем as any для обхода проверки типов
    } as any;
    
    console.log("[NextAuth] Конфигурация NextAuth создана, инициализируем NextAuth...");
    console.log("[NextAuth] baseUrl в конфигурации:", (nextAuthConfig as any).baseUrl || "не установлен (используется trustHost)");
    nextAuthInstance = NextAuth(nextAuthConfig);
    console.log("[NextAuth] NextAuth инициализирован, тип:", typeof nextAuthInstance);
    
    // Сохраняем handlers напрямую из instance
    // В NextAuth v5 handlers доступен как свойство возвращаемого объекта
    // Проверяем различные способы доступа к handlers
    if (nextAuthInstance && typeof nextAuthInstance === 'object') {
      // Пробуем получить handlers разными способами
      nextAuthHandlers = ((nextAuthInstance as any).handlers || 
                        (nextAuthInstance as any)?.handlers ||
                        null) as any;
      
      if (!nextAuthHandlers) {
        // Логируем полную структуру объекта для диагностики
        console.warn("[NextAuth] handlers не доступен после инициализации NextAuth");
        console.warn("[NextAuth] Тип nextAuthInstance:", typeof nextAuthInstance);
        console.warn("[NextAuth] nextAuthInstance:", nextAuthInstance);
        console.warn("[NextAuth] Ключи nextAuthInstance:", Object.keys(nextAuthInstance || {}));
        console.warn("[NextAuth] nextAuthInstance.handlers:", (nextAuthInstance as any).handlers);
      } else {
        console.log("[NextAuth] handlers успешно получен");
      }
    } else {
      console.error("[NextAuth] nextAuthInstance не является объектом:", typeof nextAuthInstance);
    }
    
    return { instance: nextAuthInstance, handlers: nextAuthHandlers };
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
  const result = initNextAuth();
  nextAuth = result.instance;
  if (result.handlers) {
    nextAuthHandlers = result.handlers;
  }
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
      const result = initNextAuth();
      nextAuth = result.instance;
      if (result.handlers) {
        nextAuthHandlers = result.handlers;
      }
      console.log("[NextAuth] Успешно инициализирован при первом использовании");
    } catch (error) {
      console.error("[NextAuth] Ошибка инициализации при первом использовании:", error);
      if (error instanceof Error) {
        console.error("[NextAuth] Сообщение об ошибке:", error.message);
      }
      throw error;
    }
  }
  
  // Если handlers не был сохранен, попробуем получить его из instance
  if (!nextAuthHandlers && nextAuth) {
    try {
      nextAuthHandlers = (nextAuth.handlers as any) || null;
      if (nextAuthHandlers) {
        console.log("[NextAuth] handlers получен из instance при первом использовании");
      }
    } catch (e) {
      console.warn("[NextAuth] Не удалось получить handlers из instance:", e);
    }
  }
  
  if (!nextAuthHandlers) {
    throw new Error("NextAuth handlers не доступен после инициализации");
  }
  
  return { instance: nextAuth, handlers: nextAuthHandlers };
}

// Создаем функцию для обработки ошибок инициализации
function createHandler(method: "GET" | "POST") {
  return (req: Request) => {
    try {
      const url = req instanceof Request ? req.url : (req as any).url || "unknown";
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      console.log(`[NextAuth] ${method} запрос к:`, pathname);
      console.log(`[NextAuth] Полный URL:`, url);
      
      // Логируем заголовки для диагностики
      try {
        const headers: Record<string, string> = {};
        if (req instanceof Request && req.headers) {
          const headerNames = ['host', 'origin', 'referer', 'x-forwarded-host', 'x-forwarded-proto', 'x-vercel-deployment-url'];
          headerNames.forEach(name => {
            const value = req.headers.get(name);
            if (value) headers[name] = value;
          });
        }
        if (Object.keys(headers).length > 0) {
          console.log(`[NextAuth] Заголовки запроса:`, headers);
        }
      } catch (e) {
        console.log(`[NextAuth] Не удалось прочитать заголовки:`, e);
      }
      
      // Для запросов к signin, логируем дополнительную информацию
      if (pathname.includes("/signin")) {
        console.log(`[NextAuth] Запрос к signin, проверяем конфигурацию:`, {
          AUTH_URL: process.env.AUTH_URL || "не установлен",
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || "не установлен",
          VERCEL_URL: process.env.VERCEL_URL || "не установлен",
          trustHost: true,
        });
      }
      
      const { handlers } = ensureInitialized();
      if (!handlers || !handlers[method]) {
        throw new Error(`NextAuth handlers.${method} не доступен после инициализации`);
      }
      
      console.log(`[NextAuth] Вызов handlers.${method} для:`, pathname);
      const response = handlers[method](req);
      console.log(`[NextAuth] handlers.${method} вернул ответ для:`, pathname);
      
      // Если ответ - редирект, логируем его
      if (response instanceof Response) {
        const status = response.status;
        const location = response.headers.get("location");
        if (status >= 300 && status < 400 && location) {
          console.log(`[NextAuth] Редирект (${status}) на:`, location);
        }
        if (status >= 400) {
          console.log(`[NextAuth] Ошибка (${status}) в ответе`);
        }
      }
      
      return response;
    } catch (error) {
      console.error(`[NextAuth] Ошибка в handlers.${method}:`, error);
      if (error instanceof Error) {
        console.error(`[NextAuth] Сообщение об ошибке:`, error.message);
        console.error(`[NextAuth] Стек ошибки:`, error.stack);
      }
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
// В NextAuth v5 handlers используют NextRequest из Next.js
export const handlers = handlersObject as any;

export const auth = () => {
  const { instance } = ensureInitialized();
  return instance.auth();
};

export const signIn = (...args: Parameters<ReturnType<typeof NextAuth>["signIn"]>) => {
  const { instance } = ensureInitialized();
  return instance.signIn(...args);
};

export const signOut = (...args: Parameters<ReturnType<typeof NextAuth>["signOut"]>) => {
  const { instance } = ensureInitialized();
  return instance.signOut(...args);
};
