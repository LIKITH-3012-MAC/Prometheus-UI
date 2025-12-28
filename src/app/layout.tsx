import './globals.css';

export const metadata = {
  title: 'Prometheus AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
