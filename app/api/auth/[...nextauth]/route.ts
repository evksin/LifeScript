import { handlers } from "@/auth";

// Проверяем, что handlers определен
if (!handlers || !handlers.GET || !handlers.POST) {
  throw new Error(
    "NextAuth handlers не инициализированы. Проверьте:\n" +
    "1. Что все переменные окружения установлены в .env.local\n" +
    "2. Что GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET и AUTH_SECRET заполнены\n" +
    "3. Проверьте логи сервера на наличие ошибок при инициализации NextAuth"
  );
}

export const { GET, POST } = handlers;

