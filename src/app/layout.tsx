import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Courier+Prime&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
