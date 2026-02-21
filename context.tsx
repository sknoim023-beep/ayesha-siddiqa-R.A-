"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type {
  AuthUser, SchoolSettings, Student, Teacher, ClassRecord,
  Schedule, Attendance, Donation, Expense, Application,
  ManagementView, StudentView, TeacherView,
} from "./types"
import * as store from "./store"
import { seedIfEmpty } from "./seed"

interface AppState {
  // Auth
  user: AuthUser | null
  login: (role: "principal" | "teacher" | "student", id: string, password: string) => boolean
  logout: () => void

  // Settings
  settings: SchoolSettings
  updateSettings: (s: SchoolSettings) => void

  // Navigation
  currentView: string
  setCurrentView: (v: string) => void

  // Data
  students: Student[]
  teachers: Teacher[]
  classes: ClassRecord[]
  schedules: Schedule[]
  attendance: Attendance[]
  donations: Donation[]
  expenses: Expense[]
  applications: Application[]

  // Class filter
  selectedClassId: string
  setSelectedClassId: (id: string) => void

  // Refresh
  refreshData: () => void

  // CRUD wrappers
  addStudent: (s: Student) => void
  updateStudent: (s: Student) => void
  deleteStudent: (id: string) => void
  addTeacher: (t: Teacher) => void
  updateTeacher: (t: Teacher) => void
  deleteTeacher: (id: string) => void
  addClass: (c: ClassRecord) => void
  updateClass: (c: ClassRecord) => void
  deleteClass: (id: string) => void
  addSchedule: (s: Schedule) => void
  deleteSchedule: (id: string) => void
  saveAttendanceRecords: (records: Attendance[]) => void
  addDonation: (d: Donation) => void
  deleteDonation: (id: string) => void
  addExpense: (e: Expense) => void
  deleteExpense: (id: string) => void
  addApplication: (a: Application) => void
  updateApplication: (a: Application) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [settings, setSettings] = useState<SchoolSettings>(store.defaultSettings())
  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [selectedClassId, setSelectedClassId] = useState<string>("all")
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  const refreshData = useCallback(() => {
    setSettings(store.getSettings())
    setStudents(store.getStudents())
    setTeachers(store.getTeachers())
    setClasses(store.getClasses())
    setSchedules(store.getSchedules())
    setAttendance(store.getAttendance())
    setDonations(store.getDonations())
    setExpenses(store.getExpenses())
    setApplications(store.getApplications())
  }, [])

  useEffect(() => {
    seedIfEmpty()
    refreshData()
    // Check for saved session
    const saved = localStorage.getItem("auth_user")
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [refreshData])

  const login = (role: "principal" | "teacher" | "student", id: string, password: string): boolean => {
    if (role === "principal") {
      if (id === "principal" && password === "ayesha2024") {
        const u: AuthUser = { id: "principal", role: "principal", name: settings.principalName }
        setUser(u)
        localStorage.setItem("auth_user", JSON.stringify(u))
        setCurrentView("dashboard")
        return true
      }
      return false
    }
    if (role === "teacher") {
      const t = store.getTeachers().find((t) => t.id === id && t.password === password)
      if (t) {
        const u: AuthUser = { id: t.id, role: "teacher", name: t.name }
        setUser(u)
        localStorage.setItem("auth_user", JSON.stringify(u))
        setCurrentView("dashboard")
        return true
      }
      return false
    }
    if (role === "student") {
      const s = store.getStudents().find((s) => s.id === id && s.password === password)
      if (s) {
        const u: AuthUser = { id: s.id, role: "student", name: s.name }
        setUser(u)
        localStorage.setItem("auth_user", JSON.stringify(u))
        setCurrentView("dashboard")
        return true
      }
      return false
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
    setCurrentView("dashboard")
  }

  // CRUD wrappers that also refresh state
  const crud = {
    addStudent: (s: Student) => { store.addStudent(s); refreshData() },
    updateStudent: (s: Student) => { store.updateStudent(s); refreshData() },
    deleteStudent: (id: string) => { store.deleteStudent(id); refreshData() },
    addTeacher: (t: Teacher) => { store.addTeacher(t); refreshData() },
    updateTeacher: (t: Teacher) => { store.updateTeacher(t); refreshData() },
    deleteTeacher: (id: string) => { store.deleteTeacher(id); refreshData() },
    addClass: (c: ClassRecord) => { store.addClass(c); refreshData() },
    updateClass: (c: ClassRecord) => { store.updateClass(c); refreshData() },
    deleteClass: (id: string) => { store.deleteClass(id); refreshData() },
    addSchedule: (s: Schedule) => { store.addSchedule(s); refreshData() },
    deleteSchedule: (id: string) => { store.deleteSchedule(id); refreshData() },
    saveAttendanceRecords: (records: Attendance[]) => { store.addAttendanceRecords(records); refreshData() },
    addDonation: (d: Donation) => { store.addDonation(d); refreshData() },
    deleteDonation: (id: string) => { store.deleteDonation(id); refreshData() },
    addExpense: (e: Expense) => { store.addExpense(e); refreshData() },
    deleteExpense: (id: string) => { store.deleteExpense(id); refreshData() },
    addApplication: (a: Application) => { store.addApplication(a); refreshData() },
    updateApplication: (a: Application) => { store.updateApplication(a); refreshData() },
    updateSettings: (s: SchoolSettings) => { store.saveSettings(s); refreshData() },
  }

  return (
    <AppContext.Provider value={{
      user, login, logout,
      settings, updateSettings: crud.updateSettings,
      currentView, setCurrentView,
      students, teachers, classes, schedules, attendance, donations, expenses, applications,
      selectedClassId, setSelectedClassId,
      refreshData,
      ...crud,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

// Typed view helpers
export function useManagementView(): [ManagementView, (v: ManagementView) => void] {
  const { currentView, setCurrentView } = useApp()
  return [currentView as ManagementView, setCurrentView as (v: ManagementView) => void]
}

export function useStudentView(): [StudentView, (v: StudentView) => void] {
  const { currentView, setCurrentView } = useApp()
  return [currentView as StudentView, setCurrentView as (v: StudentView) => void]
}

export function useTeacherView(): [TeacherView, (v: TeacherView) => void] {
  const { currentView, setCurrentView } = useApp()
  return [currentView as TeacherView, setCurrentView as (v: TeacherView) => void]
}
