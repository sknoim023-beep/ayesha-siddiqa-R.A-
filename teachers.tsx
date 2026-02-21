"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import type { Teacher, FamilyMember, DocumentFile } from "@/lib/types"
import { generateId } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Plus, Search, Download, Trash2, Eye, Edit2, Upload, X, UserPlus } from "lucide-react"

const emptyTeacher = (): Teacher => ({
  id: generateId(), name: "", fatherName: "", dateOfBirth: "", age: 0,
  gender: "Female", qualification: "", specialization: "", subject: "",
  assignedClasses: [], joiningDate: new Date().toISOString().split("T")[0],
  address: "", phone: "", email: "", salary: 0, bloodGroup: "",
  maritalStatus: "Single", familyMembers: [], familyCondition: "",
  photo: "", password: "teacher123", status: "active", documents: [],
  createdAt: new Date().toISOString().split("T")[0],
})

export function TeacherManagement() {
  const { teachers, classes, addTeacher, updateTeacher, deleteTeacher } = useApp()
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [viewing, setViewing] = useState<Teacher | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState<Teacher>(emptyTeacher())

  const filtered = teachers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
    const matchClass = classFilter === "all" || t.assignedClasses.includes(classFilter)
    return matchSearch && matchClass
  })

  const set = (key: keyof Teacher, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const calcAge = (dob: string) => {
    if (!dob) return 0
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
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

  const addFamilyMember = () => {
    const fm: FamilyMember = { id: generateId(), name: "", relation: "", age: 0, occupation: "" }
    setForm((p) => ({ ...p, familyMembers: [...p.familyMembers, fm] }))
  }

  const updateFamilyMember = (id: string, key: keyof FamilyMember, value: string | number) => {
    setForm((p) => ({
      ...p,
      familyMembers: p.familyMembers.map((fm) => fm.id === id ? { ...fm, [key]: value } : fm)
    }))
  }

  const removeFamilyMember = (id: string) => {
    setForm((p) => ({ ...p, familyMembers: p.familyMembers.filter((fm) => fm.id !== id) }))
  }

  const toggleClass = (classId: string) => {
    setForm((p) => ({
      ...p,
      assignedClasses: p.assignedClasses.includes(classId)
        ? p.assignedClasses.filter((c) => c !== classId)
        : [...p.assignedClasses, classId]
    }))
  }

  const handleSave = () => {
    if (!form.name || !form.subject) {
      toast.error("Name and subject are required!")
      return
    }
    form.age = calcAge(form.dateOfBirth)
    if (editing) {
      updateTeacher(form)
      toast.success("Teacher updated!")
      setEditing(null)
    } else {
      addTeacher(form)
      toast.success("Teacher added!")
    }
    setForm(emptyTeacher())
    setIsAddOpen(false)
  }

  const handleEdit = (t: Teacher) => { setForm({ ...t }); setEditing(t); setIsAddOpen(true) }
  const handleDelete = (id: string) => { deleteTeacher(id); toast.success("Teacher removed!") }

  const exportCSV = () => {
    const headers = "ID,Name,Subject,Qualification,Phone,Classes,Status\n"
    const rows = filtered.map((t) => {
      const cls = t.assignedClasses.map((c) => classes.find((cl) => cl.id === c)?.name || "").join(";")
      return `${t.id},${t.name},${t.subject},${t.qualification},${t.phone},"${cls}",${t.status}`
    }).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "teachers.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const TeacherForm = () => (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-2">
      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
              {form.photo ? <img src={form.photo} alt="" className="h-full w-full rounded-lg object-cover" /> : <span className="text-xs text-muted-foreground">No photo</span>}
            </div>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild><span><Upload className="mr-2 h-3 w-3" />Upload Photo</span></Button>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Full Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>{"Father's Name"}</Label><Input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5"><Label>DOB</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => { set("dateOfBirth", e.target.value); set("age", calcAge(e.target.value)) }} /></div>
            <div className="flex flex-col gap-1.5"><Label>Blood Group</Label><Input value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5">
              <Label>Marital Status</Label>
              <Select value={form.maritalStatus} onValueChange={(v) => set("maritalStatus", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5"><Label>Address</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Password</Label>
            <Input value={form.password} onChange={(e) => set("password", e.target.value)} />
            <p className="text-xs text-muted-foreground">Teacher will use ID: {form.id} and this password to login</p>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="flex flex-col gap-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Subject *</Label><Input value={form.subject} onChange={(e) => set("subject", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Qualification</Label><Input value={form.qualification} onChange={(e) => set("qualification", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Specialization</Label><Input value={form.specialization} onChange={(e) => set("specialization", e.target.value)} /></div>
            <div className="flex flex-col gap-1.5"><Label>Joining Date</Label><Input type="date" value={form.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"><Label>Salary</Label><Input type="number" value={form.salary} onChange={(e) => set("salary", Number(e.target.value))} /></div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Assigned Classes</Label>
            <div className="grid grid-cols-3 gap-2">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <Checkbox checked={form.assignedClasses.includes(c.id)} onCheckedChange={() => toggleClass(c.id)} id={`cls-${c.id}`} />
                  <label htmlFor={`cls-${c.id}`} className="text-sm text-foreground">{c.name}</label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="family" className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5"><Label>Family Condition</Label><Textarea value={form.familyCondition} onChange={(e) => set("familyCondition", e.target.value)} rows={2} /></div>
          <div className="flex items-center justify-between">
            <Label>Family Members</Label>
            <Button variant="outline" size="sm" onClick={addFamilyMember}><UserPlus className="mr-2 h-3 w-3" />Add Member</Button>
          </div>
          {form.familyMembers.map((fm) => (
            <div key={fm.id} className="flex items-start gap-2 rounded-lg border border-border p-3">
              <div className="grid flex-1 grid-cols-2 gap-2">
                <Input placeholder="Name" value={fm.name} onChange={(e) => updateFamilyMember(fm.id, "name", e.target.value)} />
                <Input placeholder="Relation" value={fm.relation} onChange={(e) => updateFamilyMember(fm.id, "relation", e.target.value)} />
                <Input placeholder="Age" type="number" value={fm.age || ""} onChange={(e) => updateFamilyMember(fm.id, "age", Number(e.target.value))} />
                <Input placeholder="Occupation" value={fm.occupation} onChange={(e) => updateFamilyMember(fm.id, "occupation", e.target.value)} />
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFamilyMember(fm.id)}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="flex flex-col gap-4 pt-4">
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild><span><Upload className="mr-2 h-3 w-3" />Upload Document</span></Button>
            <input type="file" className="hidden" onChange={handleDocUpload} />
          </label>
          {form.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded.</p>
          ) : form.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <span className="text-sm text-foreground">{doc.name}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => { const a = document.createElement("a"); a.href = doc.fileData; a.download = doc.name; a.click() }}><Download className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setForm((p) => ({ ...p, documents: p.documents.filter((d) => d.id !== doc.id) }))}><X className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
      <Button onClick={handleSave} className="mt-2">{editing ? "Update Teacher" : "Add Teacher"}</Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search teachers..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes ({teachers.length})</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} ({teachers.filter((t) => t.assignedClasses.includes(c.id)).length})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) { setEditing(null); setForm(emptyTeacher()) } }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Teacher</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle></DialogHeader>
            <TeacherForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Teacher</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Classes</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No teachers found</td></tr>
                ) : filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          {t.photo ? <img src={t.photo} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="text-xs font-medium text-primary">{t.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{t.name}</span>
                          <p className="text-xs text-muted-foreground">{t.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                    <td className="px-4 py-3 text-foreground">{t.subject}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.assignedClasses.map((c) => <Badge key={c} variant="secondary" className="text-xs">{classes.find((cl) => cl.id === c)?.name}</Badge>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.phone}</td>
                    <td className="px-4 py-3"><Badge variant={t.status === "active" ? "default" : "secondary"}>{t.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewing(t)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(t)}><Edit2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Teacher Profile</DialogTitle></DialogHeader>
          {viewing && (
            <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {viewing.photo ? <img src={viewing.photo} alt="" className="h-16 w-16 rounded-full object-cover" /> : <span className="text-xl font-bold text-primary">{viewing.name.charAt(0)}</span>}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{viewing.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewing.subject} | {viewing.qualification}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-foreground">{viewing.id}</span></div>
                <div><span className="text-muted-foreground">DOB:</span> <span className="text-foreground">{viewing.dateOfBirth}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{viewing.phone}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{viewing.email}</span></div>
                <div><span className="text-muted-foreground">Salary:</span> <span className="text-foreground">{viewing.salary?.toLocaleString()} Tk</span></div>
                <div><span className="text-muted-foreground">Joined:</span> <span className="text-foreground">{viewing.joiningDate}</span></div>
              </div>
              {viewing.familyMembers.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Family Members</p>
                  {viewing.familyMembers.map((fm) => (
                    <div key={fm.id} className="mb-1 rounded bg-secondary/50 px-3 py-1.5 text-sm text-foreground">
                      {fm.name} - {fm.relation} (Age: {fm.age}, {fm.occupation})
                    </div>
                  ))}
                </div>
              )}
              {viewing.familyCondition && (
                <div className="text-sm"><span className="text-muted-foreground">Family Condition:</span> <span className="text-foreground">{viewing.familyCondition}</span></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
