import "./globals.css";

export const metadata = {
  title: "Prometheus AI",
  description: "Cinematic AI Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
