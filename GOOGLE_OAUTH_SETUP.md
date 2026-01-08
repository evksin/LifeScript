# Настройка Google OAuth для аутентификации

## Способ 1: Через Google Cloud Console (любой регион)

1. **Откройте Google Cloud Console:**

   - Перейдите на https://console.cloud.google.com
   - Или используйте прямой URL: https://console.cloud.google.com/apis/credentials

2. **Создайте проект (если еще нет):**

   - Нажмите на выпадающий список проектов вверху страницы
   - Нажмите "New Project"
   - Введите название проекта (например, "LifeScript")
   - **Регион не важен** - выберите любой (например, "No organization" или любой доступный)
   - Нажмите "Create"

3. **Включите Google+ API:**

   - В меню слева выберите "APIs & Services" → "Library"
   - Найдите "Google+ API" или "Google Identity"
   - Нажмите "Enable"

4. **Создайте OAuth 2.0 Client ID:**

   - Перейдите в "APIs & Services" → "Credentials"
   - Нажмите "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Если появится экран настройки OAuth consent screen:
     - Выберите "External" (для тестирования)
     - Заполните обязательные поля:
       - App name: "LifeScript" (или любое название)
       - User support email: ваш email
       - Developer contact information: ваш email
     - Нажмите "Save and Continue" через все шаги
   - Выберите "Web application" как тип приложения
   - Введите название (например, "LifeScript Web Client")
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/callback/google
     https://your-domain.vercel.app/api/auth/callback/google
     ```
     (Замените `your-domain` на ваш домен Vercel)
   - Нажмите "Create"

5. **Скопируйте credentials:**
   - После создания вы увидите "Client ID" и "Client secret"
   - Скопируйте их в `.env.local`:
     ```env
     GOOGLE_CLIENT_ID="ваш-client-id.apps.googleusercontent.com"
     GOOGLE_CLIENT_SECRET="ваш-client-secret"
     ```

## Способ 2: Через прямой URL (обход выбора региона)

1. Откройте напрямую: https://console.cloud.google.com/apis/credentials/consent
2. Если потребуется выбрать проект - создайте новый (регион не важен)
3. Следуйте шагам выше

## Способ 3: Использование существующего проекта

Если у вас уже есть проект в Google Cloud:

1. Откройте https://console.cloud.google.com
2. Выберите существующий проект из выпадающего списка вверху
3. Перейдите в "APIs & Services" → "Credentials"
4. Создайте новый OAuth 2.0 Client ID

## Важные моменты

- **Регион проекта не влияет на OAuth** - вы можете выбрать любой регион или "No organization"
- **Для локальной разработки** добавьте: `http://localhost:3000/api/auth/callback/google`
- **Для production (Vercel)** добавьте: `https://your-domain.vercel.app/api/auth/callback/google`
- **Можно добавить оба URI** в один OAuth Client ID - это позволит работать и локально, и на Vercel
- **Client Secret** - это секретная информация, не публикуйте её в git

## Проверка настройки

После добавления переменных в `.env.local`, перезапустите dev-сервер:

```powershell
npm run dev
```

Откройте http://localhost:3000/login и попробуйте войти через Google.

## Troubleshooting

Если возникают ошибки:

1. Проверьте, что redirect URI точно совпадает (включая http/https и порт)
2. Убедитесь, что Google+ API включен
3. Проверьте, что OAuth consent screen настроен
4. Для production: убедитесь, что добавили production redirect URI в Google Console
