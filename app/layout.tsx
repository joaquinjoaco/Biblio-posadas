import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToasterProvider } from "@/providers/toast-provider";


export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Biblioteca Social del Parque Posadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider delayDuration={100}>
            <ToasterProvider />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
