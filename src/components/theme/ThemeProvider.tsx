"use client";

import { useEffect, type ComponentProps, type ReactNode } from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
      {...props}
    >
      <SystemThemeLock>{children}</SystemThemeLock>
    </NextThemeProvider>
  );
}

function SystemThemeLock({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme !== "system") {
      setTheme("system");
    }
  }, [setTheme, theme]);

  return <>{children}</>;
}
