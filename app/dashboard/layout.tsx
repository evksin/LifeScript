// Route segment config для предотвращения статической генерации всех страниц в /dashboard
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
