"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import type { Student, DocumentFile } from "@/lib/types"
import { generateId } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Search, Download, Trash2, Eye, Edit2, Upload, X } from "lucide-react"

const emptyStudent = (): Student => ({
  id: generateId(), name: "", fatherName: "", motherName: "", dateOfBirth: "", age: 0,
  gender: "Female", classId: "", section: "A", rollNumber: "", admissionDate: new Date().toISOString().split("T")[0],
  address: "", phone: "", guardianPhone: "", bloodGroup: "", religion: "Islam",
  previousSchool: "", educationHistory: "", photo: "", password: "student123",
  status: "active", documents: [], createdAt: new Date().toISOString().split("T")[0],
})

export function StudentManagement() {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useApp()
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [editing, setEditing] = useState<Student | null>(null)
  const [viewing, setViewing] = useState<Student | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState<Student>(emptyStudent())

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(search.toLowerCase())
    const matchClass = classFilter === "all" || s.classId === classFilter
    return matchSearch && matchClass
  })

  const set = (key: keyof Student, value: string | number) => {
    setForm((p) => ({ ...p, [key]: value }))
  }

  const calcAge = (dob: string) => {
    if (!dob) return 0
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set("photo", ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const doc: DocumentFile = {
        id: generateId(), name: file.name, type: file.type,
        fileData: ev.target?.result as string,
        uploadDate: new Date().toISOString().split("T")[0],
      }
      setForm((p) => ({ ...p, documents: [...p.documents, doc] }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!form.name || !form.classId) {
      toast.error("Name and class are required!")
      return
    }
    form.age = calcAge(form.dateOfBirth)
    if (editing) {
      updateStudent(form)
      toast.success("Student updated!")
      setEditing(null)
    } else {
      addStudent(form)
      toast.success("Student added!")
    }
    setForm(emptyStudent())
    setIsAddOpen(false)
  }

  const handleEdit = (s: Student) => {
    setForm({ ...s })
    setEditing(s)
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteStudent(id)
    toast.success("Student removed!")
  }

  const exportCSV = () => {
    const headers = "ID,Name,Father,Mother,DOB,Class,Roll,Phone,Status\n"
    const rows = filtered.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.name || ""
      return `${s.id},${s.name},${s.fatherName},${s.motherName},${s.dateOfBirth},${cls},${s.rollNumber},${s.phone},${s.status}`
    }).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "students.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const getClassName = (id: string) => classes.find((c) => c.id === id)?.name || "Unassigned"

  const StudentForm = () => (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-2">
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
              {form.photo ? (
                <img src={form.photo} alt="Photo" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No photo</span>
              )}
            </div>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild><span><Upload className="mr-2 h-3 w-3" />Upload Photo</span></Button>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Full Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Roll Number</Label><Input value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>{"Father's Name"}</Label><Input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>{"Mother's Name"}</Label><Input value={form.motherName} onChange={(e) => set("motherName", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => { set("dateOfBirth", e.target.value); set("age", calcAge(e.target.value)) }} /></div>
            <div className="flex flex-col gap-1.5"><Label>Blood Group</Label><Input value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Religion</Label><Input value={form.religion} onChange={(e) => set("religion", e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Guardian Phone</Label><Input value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Password</Label>
            <Input value={form.password} onChange={(e) => set("password", e.target.value)} />
            <p className="text-xs text-muted-foreground">Student will use ID: {form.id} and this password to login</p>
          </div>
        </TabsContent>

        <TabsContent value="education" className="flex flex-col gap-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Class *</Label>
              <Select value={form.classId} onValueChange={(v) => set("classId", v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.section})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5"><Label>Section</Label><Input value={form.section} onChange={(e) => set("section", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Admission Date</Label><Input type="date" value={form.admissionDate} onChange={(e) => set("admissionDate", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as "active")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5"><Label>Previous School</Label><Input value={form.previousSchool} onChange={(e) => set("previousSchool", e.target.value)} /></div>
          <div className="flex flex-col gap-1.5"><Label>Education History</Label><Textarea value={form.educationHistory} onChange={(e) => set("educationHistory", e.target.value)} rows={3} /></div>
        </TabsContent>

        <TabsContent value="documents" className="flex flex-col gap-4 pt-4">
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild><span><Upload className="mr-2 h-3 w-3" />Upload Document</span></Button>
            <input type="file" className="hidden" onChange={handleDocUpload} />
          </label>
          {form.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {form.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2">
                  <span className="text-sm text-foreground">{doc.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const a = document.createElement("a")
                      a.href = doc.fileData; a.download = doc.name; a.click()
                    }}><Download className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setForm((p) => ({ ...p, documents: p.documents.filter((d) => d.id !== doc.id) }))
                    }}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-2">{editing ? "Update Student" : "Add Student"}</Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes ({students.length})</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({students.filter((s) => s.classId === c.id).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) { setEditing(null); setForm(emptyStudent()) } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Student</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit Student" : "Add New Student"}</DialogTitle></DialogHeader>
            <StudentForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Student list table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Father</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>
                ) : filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          {s.photo ? (
                            <img src={s.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-xs font-medium text-primary">{s.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{getClassName(s.classId)}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.fatherName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.phone || "N/A"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === "active" ? "default" : "secondary"}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewing(s)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(s)}><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View detail dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Student Profile</DialogTitle></DialogHeader>
          {viewing && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {viewing.photo ? (
                    <img src={viewing.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-primary">{viewing.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{viewing.name}</h3>
                  <p className="text-sm text-muted-foreground">{getClassName(viewing.classId)} | Roll: {viewing.rollNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-foreground">{viewing.id}</span></div>
                <div><span className="text-muted-foreground">DOB:</span> <span className="text-foreground">{viewing.dateOfBirth}</span></div>
                <div><span className="text-muted-foreground">Father:</span> <span className="text-foreground">{viewing.fatherName}</span></div>
                <div><span className="text-muted-foreground">Mother:</span> <span className="text-foreground">{viewing.motherName}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{viewing.phone}</span></div>
                <div><span className="text-muted-foreground">Guardian:</span> <span className="text-foreground">{viewing.guardianPhone}</span></div>
                <div><span className="text-muted-foreground">Blood:</span> <span className="text-foreground">{viewing.bloodGroup}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={viewing.status === "active" ? "default" : "secondary"}>{viewing.status}</Badge></div>
              </div>
              {viewing.educationHistory && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Education History:</span>
                  <p className="mt-1 text-foreground">{viewing.educationHistory}</p>
                </div>
              )}
              {viewing.documents.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Documents</p>
                  <div className="flex flex-col gap-1">
                    {viewing.documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between rounded bg-secondary/50 px-3 py-1.5">
                        <span className="text-sm text-foreground">{d.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => {
                          const a = document.createElement("a"); a.href = d.fileData; a.download = d.name; a.click()
                        }}><Download className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
