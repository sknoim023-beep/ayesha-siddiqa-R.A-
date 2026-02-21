// ============================================================
// localStorage CRUD helpers
// ============================================================

import type {
  SchoolSettings,
  Student,
  Teacher,
  ClassRecord,
  Schedule,
  Attendance,
  Donation,
  Expense,
  Application,
} from "./types"

// ---- generic helpers ----
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// ---- School Settings ----
export function getSettings(): SchoolSettings {
  return getItem<SchoolSettings>("school_settings", defaultSettings())
}

export function saveSettings(s: SchoolSettings) {
  setItem("school_settings", s)
}

export function defaultSettings(): SchoolSettings {
  return {
    schoolName: "Ayesha Siddiqa (R.A) Girls Madrasah & Educational Welfare Trust",
    logo: "",
    address: "123 Main Road, Ward No. 5",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1205",
    country: "Bangladesh",
    phone: "+880-1234-567890",
    altPhone: "+880-9876-543210",
    email: "info@ayeshasiddiqa.edu.bd",
    website: "www.ayeshasiddiqa.edu.bd",
    motto: "Empowering through knowledge and faith",
    principalName: "Ustazah Fatima Begum",
    letterheadNote: "A registered educational welfare trust dedicated to Islamic education for girls",
    establishedYear: "2010",
  }
}

// ---- Students ----
export function getStudents(): Student[] {
  return getItem<Student[]>("students", [])
}
export function saveStudents(list: Student[]) {
  setItem("students", list)
}
export function addStudent(s: Student) {
  const list = getStudents()
  list.push(s)
  saveStudents(list)
}
export function updateStudent(s: Student) {
  const list = getStudents().map((x) => (x.id === s.id ? s : x))
  saveStudents(list)
}
export function deleteStudent(id: string) {
  saveStudents(getStudents().filter((x) => x.id !== id))
}

// ---- Teachers ----
export function getTeachers(): Teacher[] {
  return getItem<Teacher[]>("teachers", [])
}
export function saveTeachers(list: Teacher[]) {
  setItem("teachers", list)
}
export function addTeacher(t: Teacher) {
  const list = getTeachers()
  list.push(t)
  saveTeachers(list)
}
export function updateTeacher(t: Teacher) {
  const list = getTeachers().map((x) => (x.id === t.id ? t : x))
  saveTeachers(list)
}
export function deleteTeacher(id: string) {
  saveTeachers(getTeachers().filter((x) => x.id !== id))
}

// ---- Classes ----
export function getClasses(): ClassRecord[] {
  return getItem<ClassRecord[]>("classes", [])
}
export function saveClasses(list: ClassRecord[]) {
  setItem("classes", list)
}
export function addClass(c: ClassRecord) {
  const list = getClasses()
  list.push(c)
  saveClasses(list)
}
export function updateClass(c: ClassRecord) {
  const list = getClasses().map((x) => (x.id === c.id ? c : x))
  saveClasses(list)
}
export function deleteClass(id: string) {
  saveClasses(getClasses().filter((x) => x.id !== id))
}

// ---- Schedules ----
export function getSchedules(): Schedule[] {
  return getItem<Schedule[]>("schedules", [])
}
export function saveSchedules(list: Schedule[]) {
  setItem("schedules", list)
}
export function addSchedule(s: Schedule) {
  const list = getSchedules()
  list.push(s)
  saveSchedules(list)
}
export function deleteSchedule(id: string) {
  saveSchedules(getSchedules().filter((x) => x.id !== id))
}

// ---- Attendance ----
export function getAttendance(): Attendance[] {
  return getItem<Attendance[]>("attendance", [])
}
export function saveAttendance(list: Attendance[]) {
  setItem("attendance", list)
}
export function addAttendanceRecords(records: Attendance[]) {
  const list = getAttendance()
  // Remove existing for same date / entity
  const newIds = new Set(records.map((r) => `${r.date}_${r.entityId}`))
  const filtered = list.filter((r) => !newIds.has(`${r.date}_${r.entityId}`))
  saveAttendance([...filtered, ...records])
}

// ---- Donations ----
export function getDonations(): Donation[] {
  return getItem<Donation[]>("donations", [])
}
export function saveDonations(list: Donation[]) {
  setItem("donations", list)
}
export function addDonation(d: Donation) {
  const list = getDonations()
  list.push(d)
  saveDonations(list)
}
export function deleteDonation(id: string) {
  saveDonations(getDonations().filter((x) => x.id !== id))
}

// ---- Expenses ----
export function getExpenses(): Expense[] {
  return getItem<Expense[]>("expenses", [])
}
export function saveExpenses(list: Expense[]) {
  setItem("expenses", list)
}
export function addExpense(e: Expense) {
  const list = getExpenses()
  list.push(e)
  saveExpenses(list)
}
export function deleteExpense(id: string) {
  saveExpenses(getExpenses().filter((x) => x.id !== id))
}

// ---- Applications ----
export function getApplications(): Application[] {
  return getItem<Application[]>("applications", [])
}
export function saveApplications(list: Application[]) {
  setItem("applications", list)
}
export function addApplication(a: Application) {
  const list = getApplications()
  list.push(a)
  saveApplications(list)
}
export function updateApplication(a: Application) {
  const list = getApplications().map((x) => (x.id === a.id ? a : x))
  saveApplications(list)
}

// ---- Next Receipt Number ----
export function getNextReceiptNumber(): string {
  const donations = getDonations()
  const maxNum = donations.reduce((max, d) => {
    const num = parseInt(d.receiptNumber.replace("RCP-", ""), 10)
    return isNaN(num) ? max : Math.max(max, num)
  }, 0)
  return `RCP-${String(maxNum + 1).padStart(4, "0")}`
}

// ---- Amount to Words (Taka) ----
export function amountToWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  if (amount === 0) return "Zero Taka Only"

  function convert(n: number): string {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "")
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "")
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "")
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "")
  }

  return convert(Math.floor(amount)) + " Taka Only"
}

// ---- Generate unique ID ----
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}
