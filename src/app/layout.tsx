import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Providers | AW Studio Donation Cash System",
  description: "Donation Cash System for Roblox experiences, powered by AW Studio.",
  applicationName: "AW Studio Donation Cash System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased font-sans selection:bg-primary/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
