import { handlers } from "@/auth";

// Экспортируем handlers напрямую
// Если handlers не определен, ошибка будет выброшена при инициализации в auth.ts
export const { GET, POST } = handlers;

