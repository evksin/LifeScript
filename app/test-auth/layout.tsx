// Route segment config для предотвращения статической генерации страницы /test-auth
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function TestAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
