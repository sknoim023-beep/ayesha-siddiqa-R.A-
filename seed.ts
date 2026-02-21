import type { Student, Teacher, ClassRecord, Schedule, Attendance, Donation, Expense } from "./types"
import {
  getStudents, saveStudents, getTeachers, saveTeachers,
  getClasses, saveClasses, getSchedules, saveSchedules,
  saveAttendance, getDonations, saveDonations,
  getExpenses, saveExpenses, getSettings, saveSettings,
  defaultSettings,
} from "./store"

export function seedIfEmpty() {
  // Settings
  const settings = getSettings()
  if (!settings.schoolName) saveSettings(defaultSettings())

  // Classes
  if (getClasses().length === 0) {
    const classes: ClassRecord[] = [
      { id: "cls-nursery", name: "Nursery", section: "A", classTeacherId: "tch-001", room: "Room 1", studentIds: ["std-001"] },
      { id: "cls-1", name: "Class 1", section: "A", classTeacherId: "tch-001", room: "Room 2", studentIds: ["std-002"] },
      { id: "cls-2", name: "Class 2", section: "A", classTeacherId: "tch-002", room: "Room 3", studentIds: ["std-003"] },
      { id: "cls-3", name: "Class 3", section: "A", classTeacherId: "tch-002", room: "Room 4", studentIds: [] },
      { id: "cls-hifz", name: "Hifz", section: "A", classTeacherId: "tch-003", room: "Room 5", studentIds: ["std-004"] },
      { id: "cls-nazira", name: "Nazira", section: "A", classTeacherId: "tch-003", room: "Room 6", studentIds: [] },
    ]
    saveClasses(classes)
  }

  // Teachers
  if (getTeachers().length === 0) {
    const teachers: Teacher[] = [
      {
        id: "tch-001", name: "Ustazah Mariam Khatun", fatherName: "Abdul Karim", dateOfBirth: "1985-03-15",
        age: 41, gender: "Female", qualification: "M.A. in Arabic", specialization: "Arabic Literature",
        subject: "Arabic", assignedClasses: ["cls-nursery", "cls-1"], joiningDate: "2015-01-10",
        address: "House 12, Road 3, Mirpur", phone: "+880-1711-111111", email: "mariam@school.bd",
        salary: 25000, bloodGroup: "A+", maritalStatus: "Married",
        familyMembers: [
          { id: "fm-1", name: "Abdul Karim", relation: "Husband", age: 45, occupation: "Businessman" },
          { id: "fm-2", name: "Aisha", relation: "Daughter", age: 10, occupation: "Student" },
        ],
        familyCondition: "Middle class, stable income",
        photo: "", password: "teacher123", status: "active", documents: [], createdAt: "2015-01-10",
      },
      {
        id: "tch-002", name: "Ustazah Hafsa Begum", fatherName: "Mohammad Ali", dateOfBirth: "1990-07-22",
        age: 36, gender: "Female", qualification: "B.Ed", specialization: "Mathematics",
        subject: "Mathematics", assignedClasses: ["cls-2", "cls-3"], joiningDate: "2018-06-01",
        address: "House 5, Road 7, Dhanmondi", phone: "+880-1722-222222", email: "hafsa@school.bd",
        salary: 22000, bloodGroup: "B+", maritalStatus: "Single",
        familyMembers: [
          { id: "fm-3", name: "Mohammad Ali", relation: "Father", age: 65, occupation: "Retired" },
        ],
        familyCondition: "Father retired, sole earner of family",
        photo: "", password: "teacher123", status: "active", documents: [], createdAt: "2018-06-01",
      },
      {
        id: "tch-003", name: "Ustazah Khadijah Akhter", fatherName: "Rafiqul Islam", dateOfBirth: "1988-11-05",
        age: 38, gender: "Female", qualification: "Hafiza, Kamil", specialization: "Quran & Tajweed",
        subject: "Quran", assignedClasses: ["cls-hifz", "cls-nazira"], joiningDate: "2012-08-15",
        address: "House 8, Road 1, Uttara", phone: "+880-1733-333333", email: "khadijah@school.bd",
        salary: 28000, bloodGroup: "O+", maritalStatus: "Married",
        familyMembers: [
          { id: "fm-4", name: "Rafiqul Islam", relation: "Husband", age: 42, occupation: "Teacher" },
          { id: "fm-5", name: "Yusuf", relation: "Son", age: 8, occupation: "Student" },
          { id: "fm-6", name: "Zainab", relation: "Daughter", age: 5, occupation: "Student" },
        ],
        familyCondition: "Both parents working, good condition",
        photo: "", password: "teacher123", status: "active", documents: [], createdAt: "2012-08-15",
      },
    ]
    saveTeachers(teachers)
  }

  // Students
  if (getStudents().length === 0) {
    const students: Student[] = [
      {
        id: "std-001", name: "Fatima Akter", fatherName: "Mohammad Hasan", motherName: "Ayesha Begum",
        dateOfBirth: "2017-05-12", age: 9, gender: "Female", classId: "cls-nursery", section: "A",
        rollNumber: "N-001", admissionDate: "2024-01-15", address: "House 3, Road 5, Mirpur",
        phone: "+880-1811-111111", guardianPhone: "+880-1811-222222", bloodGroup: "A+",
        religion: "Islam", previousSchool: "None", educationHistory: "First admission",
        photo: "", password: "student123", status: "active", documents: [], createdAt: "2024-01-15",
      },
      {
        id: "std-002", name: "Maryam Rahman", fatherName: "Abdur Rahman", motherName: "Salma Khatun",
        dateOfBirth: "2016-08-20", age: 10, gender: "Female", classId: "cls-1", section: "A",
        rollNumber: "1-001", admissionDate: "2023-01-10", address: "House 7, Road 2, Dhanmondi",
        phone: "+880-1822-111111", guardianPhone: "+880-1822-222222", bloodGroup: "B+",
        religion: "Islam", previousSchool: "ABC Kindergarten", educationHistory: "Completed Nursery",
        photo: "", password: "student123", status: "active", documents: [], createdAt: "2023-01-10",
      },
      {
        id: "std-003", name: "Zainab Islam", fatherName: "Nurul Islam", motherName: "Rahima Begum",
        dateOfBirth: "2015-02-14", age: 11, gender: "Female", classId: "cls-2", section: "A",
        rollNumber: "2-001", admissionDate: "2022-01-05", address: "House 15, Road 9, Uttara",
        phone: "+880-1833-111111", guardianPhone: "+880-1833-222222", bloodGroup: "O-",
        religion: "Islam", previousSchool: "XYZ Primary", educationHistory: "Completed Class 1",
        photo: "", password: "student123", status: "active", documents: [], createdAt: "2022-01-05",
      },
      {
        id: "std-004", name: "Hafsa Amin", fatherName: "Aminul Haque", motherName: "Nasreen Akter",
        dateOfBirth: "2012-11-30", age: 14, gender: "Female", classId: "cls-hifz", section: "A",
        rollNumber: "H-001", admissionDate: "2021-06-01", address: "House 22, Road 4, Banani",
        phone: "+880-1844-111111", guardianPhone: "+880-1844-222222", bloodGroup: "AB+",
        religion: "Islam", previousSchool: "DEF School", educationHistory: "Completed Class 5, started Hifz program",
        photo: "", password: "student123", status: "active", documents: [], createdAt: "2021-06-01",
      },
    ]
    saveStudents(students)
  }

  // Schedules
  if (getSchedules().length === 0) {
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"]
    const schedules: Schedule[] = []
    let idx = 0
    days.forEach((day) => {
      schedules.push(
        { id: `sch-${idx++}`, day, period: 1, startTime: "08:00", endTime: "08:45", teacherId: "tch-003", subject: "Quran", classId: "cls-hifz", room: "Room 5" },
        { id: `sch-${idx++}`, day, period: 2, startTime: "08:50", endTime: "09:35", teacherId: "tch-001", subject: "Arabic", classId: "cls-1", room: "Room 2" },
        { id: `sch-${idx++}`, day, period: 3, startTime: "09:40", endTime: "10:25", teacherId: "tch-002", subject: "Mathematics", classId: "cls-2", room: "Room 3" },
      )
    })
    saveSchedules(schedules)
  }

  // Attendance (last 7 days sample)
  const att = [] as Attendance[]
  const today = new Date()
  for (let d = 0; d < 7; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() - d)
    const ds = date.toISOString().split("T")[0]
    const students = getStudents()
    const teachers = getTeachers()
    students.forEach((s) => {
      att.push({ id: `att-${ds}-${s.id}`, date: ds, entityId: s.id, entityType: "student", classId: s.classId, status: Math.random() > 0.15 ? "present" : "absent" })
    })
    teachers.forEach((t) => {
      att.push({ id: `att-${ds}-${t.id}`, date: ds, entityId: t.id, entityType: "teacher", classId: "", status: Math.random() > 0.1 ? "present" : "absent" })
    })
  }
  saveAttendance(att)

  // Donations
  if (getDonations().length === 0) {
    const donations: Donation[] = [
      { id: "don-001", receiptNumber: "RCP-0001", donorName: "Haji Abdul Mannan", donorPhone: "+880-1900-111111", donorAddress: "Gulshan, Dhaka", amount: 50000, date: "2026-01-10", paymentMode: "Cash", purpose: "Building Fund", notes: "Annual contribution", createdAt: "2026-01-10" },
      { id: "don-002", receiptNumber: "RCP-0002", donorName: "Mrs. Salma Chowdhury", donorPhone: "+880-1900-222222", donorAddress: "Banani, Dhaka", amount: 25000, date: "2026-01-20", paymentMode: "Bank Transfer", purpose: "Student Welfare", notes: "Monthly donation", createdAt: "2026-01-20" },
      { id: "don-003", receiptNumber: "RCP-0003", donorName: "Mohammad Kamal", donorPhone: "+880-1900-333333", donorAddress: "Mirpur, Dhaka", amount: 10000, date: "2026-02-05", paymentMode: "Cash", purpose: "General Fund", notes: "", createdAt: "2026-02-05" },
    ]
    saveDonations(donations)
  }

  // Expenses
  if (getExpenses().length === 0) {
    const expenses: Expense[] = [
      { id: "exp-001", date: "2026-01-05", amount: 15000, category: "Salary", payee: "Staff Salaries", description: "January partial salary advance", paymentMode: "Bank Transfer", approvedBy: "Principal", receiptRef: "", createdAt: "2026-01-05" },
      { id: "exp-002", date: "2026-01-15", amount: 5000, category: "Utilities", payee: "DESCO", description: "Electricity bill January", paymentMode: "Cash", approvedBy: "Principal", receiptRef: "ELEC-JAN-26", createdAt: "2026-01-15" },
      { id: "exp-003", date: "2026-02-01", amount: 8000, category: "Supplies", payee: "Stationary World", description: "Books and stationery for new term", paymentMode: "Cash", approvedBy: "Principal", receiptRef: "", createdAt: "2026-02-01" },
    ]
    saveExpenses(expenses)
  }
}
