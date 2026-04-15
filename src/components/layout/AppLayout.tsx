import { AppShell } from "@mantine/core";
import { Suspense } from "react";
import { Outlet } from "react-router";
import { TopNavbar } from "../navbar/TopNavbar";

export function AppLayout() {
  return (
    <AppShell
      header={{ height: { base: 132, md: 72 } }}
      padding={0}
      withBorder={false}
      styles={{
        header: {
          borderBottom: "1px solid var(--app-navbar-border)",
          backgroundColor: "var(--app-navbar)",
        },
        main: {
          backgroundColor: "var(--app-navbar)",
        },
      }}
    >
      <AppShell.Header>
        <TopNavbar />
      </AppShell.Header>
      <AppShell.Main>
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <Suspense
            fallback={
              <div className="flex min-h-[160px] items-center justify-center text-sm text-body">
                Loading…
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
