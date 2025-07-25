import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Book Management",
  description: "Manage your book collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}