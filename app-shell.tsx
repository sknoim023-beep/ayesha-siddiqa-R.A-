"use client"

import { useApp } from "@/lib/context"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Management views
import { ManagementDashboard } from "@/components/management/dashboard"
import { StudentManagement } from "@/components/management/students"
import { TeacherManagement } from "@/components/management/teachers"
import { ClassManagement } from "@/components/management/classes"
import { ScheduleManagement } from "@/components/management/schedules"
import { AttendanceManagement } from "@/components/management/attendance"
import { DonationManagement } from "@/components/management/donations"
import { ExpenseManagement } from "@/components/management/expenses"
import { ReportsView } from "@/components/management/reports"
import { ApplicationManagement } from "@/components/management/applications"
import { SiteSettings } from "@/components/management/site-settings"

// Teacher views
import { TeacherDashboard } from "@/components/teacher/dashboard"
import { TeacherProfile } from "@/components/teacher/profile"
import { TeacherSchedule } from "@/components/teacher/schedule"
import { TeacherStudents } from "@/components/teacher/my-students"
import { TeacherAttendance } from "@/components/teacher/attendance"
import { TeacherDocuments } from "@/components/teacher/documents"
import { TeacherApplications } from "@/components/teacher/applications"

// Student views
import { StudentDashboard } from "@/components/student/dashboard"
import { StudentProfile } from "@/components/student/profile"
import { StudentScheduleView } from "@/components/student/schedule"
import { StudentAttendance } from "@/components/student/attendance"
import { StudentDocuments } from "@/components/student/documents"
import { StudentApplications } from "@/components/student/applications"

function ManagementContent({ view }: { view: string }) {
  switch (view) {
    case "dashboard": return <ManagementDashboard />
    case "students": return <StudentManagement />
    case "teachers": return <TeacherManagement />
    case "classes": return <ClassManagement />
    case "schedules": return <ScheduleManagement />
    case "attendance": return <AttendanceManagement />
    case "donations": return <DonationManagement />
    case "expenses": return <ExpenseManagement />
    case "reports": return <ReportsView />
    case "applications": return <ApplicationManagement />
    case "site-settings": return <SiteSettings />
    default: return <ManagementDashboard />
  }
}

function TeacherContent({ view }: { view: string }) {
  switch (view) {
    case "dashboard": return <TeacherDashboard />
    case "profile": return <TeacherProfile />
    case "schedule": return <TeacherSchedule />
    case "my-students": return <TeacherStudents />
    case "attendance": return <TeacherAttendance />
    case "documents": return <TeacherDocuments />
    case "applications": return <TeacherApplications />
    default: return <TeacherDashboard />
  }
}

function StudentContent({ view }: { view: string }) {
  switch (view) {
    case "dashboard": return <StudentDashboard />
    case "profile": return <StudentProfile />
    case "schedule": return <StudentScheduleView />
    case "attendance": return <StudentAttendance />
    case "documents": return <StudentDocuments />
    case "applications": return <StudentApplications />
    default: return <StudentDashboard />
  }
}

const viewLabels: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Student Management",
  teachers: "Teacher Management",
  classes: "Class Management",
  schedules: "Schedule Management",
  attendance: "Attendance",
  donations: "Donation Management",
  expenses: "Expense Management",
  reports: "Financial Reports",
  applications: "Applications",
  "site-settings": "Site Settings",
  profile: "My Profile",
  schedule: "My Schedule",
  "my-students": "My Students",
  documents: "Documents",
}

export function AppShell() {
  const { user, currentView } = useApp()

  const roleLabel = user?.role === "principal" ? "Management"
    : user?.role === "teacher" ? "Teacher"
    : "Student"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-card-foreground">
              {viewLabels[currentView] || "Dashboard"}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {roleLabel} Mode
            </Badge>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {user?.role === "principal" && <ManagementContent view={currentView} />}
          {user?.role === "teacher" && <TeacherContent view={currentView} />}
          {user?.role === "student" && <StudentContent view={currentView} />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
