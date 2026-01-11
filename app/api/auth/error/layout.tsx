// Route segment config для предотвращения статической генерации
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
