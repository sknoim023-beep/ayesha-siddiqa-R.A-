"use client"

import { useApp } from "@/lib/context"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays, ClipboardCheck,
  HandCoins, Receipt, BarChart3, FileText, Settings, LogOut, Shield,
  User, Clock, FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const managementNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "schedules", label: "Schedules", icon: CalendarDays },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "donations", label: "Donations", icon: HandCoins },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "site-settings", label: "Site Settings", icon: Settings },
]

const teacherNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "schedule", label: "My Schedule", icon: CalendarDays },
  { id: "my-students", label: "My Students", icon: GraduationCap },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "applications", label: "Applications", icon: FileText },
]

const studentNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "schedule", label: "My Schedule", icon: Clock },
  { id: "attendance", label: "My Attendance", icon: ClipboardCheck },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "applications", label: "Applications", icon: FileText },
]

export function AppSidebar() {
  const { user, settings, currentView, setCurrentView, logout } = useApp()

  const nav = user?.role === "principal" ? managementNav
    : user?.role === "teacher" ? teacherNav
    : studentNav

  const roleLabel = user?.role === "principal" ? "Management Mode"
    : user?.role === "teacher" ? "Teacher Mode"
    : "Student Mode"

  const RoleIcon = user?.role === "principal" ? Shield
    : user?.role === "teacher" ? BookOpen
    : GraduationCap

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-8 w-8 rounded-md object-cover" />
            ) : (
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {settings.schoolName.split("&")[0].trim()}
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              {settings.motto}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-foreground/50">
            <RoleIcon className="h-3.5 w-3.5" />
            {roleLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentView === item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">{user?.name}</span>
              <span className="text-xs capitalize text-sidebar-foreground/60">{user?.role}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
