"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  useEffect(() => {
    console.log("LoginForm: status =", status, "session =", session?.user?.email || "нет", "error =", error);
    
    // Если есть ошибка в URL, не делаем редирект
    if (error) {
      console.log("Обнаружена ошибка в URL:", error);
      return;
    }
    
    // Если пользователь уже авторизован, сразу редиректим
    if (status === "authenticated" && session) {
      console.log("Пользователь авторизован, редирект на:", callbackUrl);
      router.replace(callbackUrl);
      return;
    }
  }, [status, session, callbackUrl, router, error]);
  
  // Если пользователь уже авторизован, показываем сообщение о редиректе
  if (status === "authenticated" && !error) {
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
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#666", marginBottom: "1rem" }}>Вы уже авторизованы. Перенаправление...</p>
        </div>
      </main>
    );
  }

  const handleGoogleSignIn = () => {
    // Используем прямой редирект на NextAuth signin endpoint
    // Это позволяет NextAuth правильно обработать CSRF токен
    const signInUrl = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    console.log("[LoginForm] Редирект на:", signInUrl);
    console.log("[LoginForm] Текущий статус:", status);
    window.location.href = signInUrl;
  };

  // Показываем форму сразу, даже если статус loading, чтобы избежать белого экрана
  // Если пользователь авторизован, произойдет редирект через useEffect
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
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Добро пожаловать
        </h1>
        <p
          style={{
            color: "#666",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          Войдите в свой аккаунт, чтобы продолжить
        </p>

        {error && (
          <div
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              color: "#c33",
            }}
          >
            <strong>Ошибка:</strong>{" "}
{error === "Configuration"
              ? "Проблема с конфигурацией сервера. Проверьте настройки."
              : error === "AccessDenied"
              ? "Доступ запрещён."
              : error === "Verification"
              ? "Ссылка для верификации больше не действительна."
              : error === "OAuthAccountNotLinked"
              ? "Этот email уже используется с другим провайдером."
              : error === "OAuthCallback"
              ? "Ошибка при обработке OAuth callback. Проверьте redirect URI в Google Console."
              : error === "OAuthCreateAccount"
              ? "Не удалось создать аккаунт. Проверьте подключение к базе данных."
              : error === "google"
              ? "Ошибка при входе через Google. Проверьте настройки Google OAuth и переменные окружения на Vercel (NEXTAUTH_SECRET, NEXTAUTH_URL)."
              : `Произошла ошибка при входе: ${error}`}
          </div>
        )}

        {status === "loading" && (
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>Загрузка...</p>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            try {
              handleGoogleSignIn();
            } catch (error) {
              console.error("[LoginForm] Ошибка при клике на кнопку:", error);
              alert("Ошибка при попытке входа. Проверьте консоль браузера.");
            }
          }}
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "0.875rem 1.5rem",
            background: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#357ae8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4285f4";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Войти через Google
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
