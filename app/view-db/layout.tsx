// Route segment config для предотвращения статической генерации всех страниц в /view-db
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function ViewDbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
