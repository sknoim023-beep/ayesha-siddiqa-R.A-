"use client"

import { AppProvider, useApp } from "@/lib/context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"

function AppRouter() {
  const { user } = useApp()

  if (!user) return <LoginPage />
  return <AppShell />
}

export default function Page() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}
