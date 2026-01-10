"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || null;

  const errorMessages: { [key: string]: string } = {
    Configuration: "Проблема с конфигурацией сервера. Проверьте настройки.",
    AccessDenied: "Доступ запрещён.",
    Verification: "Ссылка для верификации больше не действительна.",
    OAuthAccountNotLinked: "Этот email уже используется с другим провайдером.",
    OAuthCallback:
      "Ошибка при обработке OAuth callback. Проверьте redirect URI в Google Console.",
    OAuthCreateAccount:
      "Не удалось создать аккаунт. Проверьте подключение к базе данных.",
    CallbackRouteError:
      "Ошибка в callback роуте. Проверьте переменные окружения.",
    Default: "Произошла ошибка при входе.",
  };

  const errorMessage = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            fontWeight: "bold",
            color: "#dc3545",
          }}
        >
          Ошибка входа
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          {errorMessage}
        </p>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "0.875rem 1.5rem",
            background: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Вернуться к входу
        </Link>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>Загрузка...</p>
        </main>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
