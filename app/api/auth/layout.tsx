// Route segment config для предотвращения статической генерации всех страниц в /api/auth
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
