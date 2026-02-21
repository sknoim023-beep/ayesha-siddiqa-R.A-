// ============================================================
// Ayesha Siddiqa (R.A) Girls Madrasah - Type Definitions
// ============================================================

export type UserRole = "principal" | "teacher" | "student"

export interface AuthUser {
  id: string
  role: UserRole
  name: string
}

export interface SchoolSettings {
  schoolName: string
  logo: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  altPhone: string
  email: string
  website: string
  motto: string
  principalName: string
  letterheadNote: string
  establishedYear: string
}

export interface Student {
  id: string
  name: string
  fatherName: string
  motherName: string
  dateOfBirth: string
  age: number
  gender: string
  classId: string
  section: string
  rollNumber: string
  admissionDate: string
  address: string
  phone: string
  guardianPhone: string
  bloodGroup: string
  religion: string
  previousSchool: string
  educationHistory: string
  photo: string
  password: string
  status: "active" | "inactive" | "graduated"
  documents: DocumentFile[]
  createdAt: string
}

export interface Teacher {
  id: string
  name: string
  fatherName: string
  dateOfBirth: string
  age: number
  gender: string
  qualification: string
  specialization: string
  subject: string
  assignedClasses: string[]
  joiningDate: string
  address: string
  phone: string
  email: string
  salary: number
  bloodGroup: string
  maritalStatus: string
  familyMembers: FamilyMember[]
  familyCondition: string
  photo: string
  password: string
  status: "active" | "inactive" | "on-leave"
  documents: DocumentFile[]
  createdAt: string
}

export interface FamilyMember {
  id: string
  name: string
  relation: string
  age: number
  occupation: string
}

export interface ClassRecord {
  id: string
  name: string
  section: string
  classTeacherId: string
  room: string
  studentIds: string[]
}

export interface Schedule {
  id: string
  day: string
  period: number
  startTime: string
  endTime: string
  teacherId: string
  subject: string
  classId: string
  room: string
}

export interface Attendance {
  id: string
  date: string
  entityId: string
  entityType: "student" | "teacher"
  classId: string
  status: "present" | "absent" | "late" | "leave"
}

export interface Donation {
  id: string
  receiptNumber: string
  donorName: string
  donorPhone: string
  donorAddress: string
  amount: number
  date: string
  paymentMode: string
  purpose: string
  notes: string
  createdAt: string
}

export interface Expense {
  id: string
  date: string
  amount: number
  category: string
  payee: string
  description: string
  paymentMode: string
  approvedBy: string
  receiptRef: string
  createdAt: string
}

export interface Application {
  id: string
  fromType: "student" | "teacher" | "other"
  fromId: string
  fromName: string
  type: string
  subject: string
  content: string
  status: "pending" | "approved" | "rejected"
  date: string
  response: string
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  fileData: string
  uploadDate: string
}

// View types for navigation
export type ManagementView =
  | "dashboard"
  | "students"
  | "teachers"
  | "classes"
  | "schedules"
  | "attendance"
  | "donations"
  | "expenses"
  | "reports"
  | "applications"
  | "site-settings"

export type StudentView =
  | "dashboard"
  | "profile"
  | "attendance"
  | "schedule"
  | "documents"
  | "applications"

export type TeacherView =
  | "dashboard"
  | "profile"
  | "attendance"
  | "schedule"
  | "my-students"
  | "documents"
  | "applications"
