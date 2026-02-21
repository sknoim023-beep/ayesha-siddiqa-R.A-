"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import type { ClassRecord } from "@/lib/types"
import { generateId } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Trash2, Edit2, Users, GraduationCap } from "lucide-react"

export function ClassManagement() {
  const { classes, students, teachers, addClass, updateClass, deleteClass } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<ClassRecord | null>(null)
  const [form, setForm] = useState({ name: "", section: "A", classTeacherId: "", room: "" })

  const handleSave = () => {
    if (!form.name) { toast.error("Class name is required!"); return }
    if (editing) {
      updateClass({ ...editing, ...form })
      toast.success("Class updated!")
      setEditing(null)
    } else {
      const cls: ClassRecord = { id: `cls-${generateId()}`, ...form, studentIds: [] }
      addClass(cls)
      toast.success("Class added!")
    }
    setForm({ name: "", section: "A", classTeacherId: "", room: "" })
    setIsOpen(false)
  }

  const handleEdit = (c: ClassRecord) => {
    setForm({ name: c.name, section: c.section, classTeacherId: c.classTeacherId, room: c.room })
    setEditing(c)
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Classes ({classes.length})</h2>
        <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if (!v) { setEditing(null); setForm({ name: "", section: "A", classTeacherId: "", room: "" }) } }}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Class</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Class" : "Add New Class"}</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><Label>Class Name *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Class 1, Hifz" /></div>
                <div className="flex flex-col gap-1.5"><Label>Section</Label><Input value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Class Teacher</Label>
                <Select value={form.classTeacherId} onValueChange={(v) => setForm((p) => ({ ...p, classTeacherId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.subject})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Room</Label><Input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} /></div>
              <Button onClick={handleSave}>{editing ? "Update" : "Add"} Class</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => {
          const classStudents = students.filter((s) => s.classId === c.id)
          const classTeacher = teachers.find((t) => t.id === c.classTeacherId)
          return (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base text-card-foreground">{c.name} ({c.section})</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}><Edit2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { deleteClass(c.id); toast.success("Class deleted!") }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{classStudents.length} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-accent-foreground" />
                  <span className="text-foreground">{classTeacher?.name || "No teacher assigned"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Room: {c.room || "N/A"}
                </div>
                {classStudents.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {classStudents.slice(0, 5).map((s) => (
                      <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                    ))}
                    {classStudents.length > 5 && <Badge variant="outline" className="text-xs">+{classStudents.length - 5} more</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
