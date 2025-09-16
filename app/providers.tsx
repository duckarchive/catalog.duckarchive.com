"use client";

import type { ThemeProviderProps } from "next-themes";

import { PropsWithChildren } from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  themeProps?: ThemeProviderProps;
  session?: Session;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const Providers: React.FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  themeProps,
  session,
}) => {
  const router = useRouter();

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
};
