export default function StreamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Force transparency and full viewport size
    <div className="min-h-screen w-screen bg-transparent overflow-hidden">
      {children}
    </div>
  );
}