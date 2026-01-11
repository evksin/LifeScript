// Route segment config для предотвращения статической генерации страницы /login
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
