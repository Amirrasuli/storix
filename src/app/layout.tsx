import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "استوریکس | مدیریت موجودی و تحلیل فروش",
    template: "%s | استوریکس",
  },
  description:
    "مدیریت موجودی انبار و تحلیل فروش با داده‌های نمونه، در یک رابط فارسی و راست‌به‌چپ.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DirectionProvider direction="rtl">{children}</DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
