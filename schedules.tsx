"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import type { Schedule } from "@/lib/types"
import { generateId } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Trash2, Download } from "lucide-react"

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

export function ScheduleManagement() {
  const { schedules, classes, teachers, addSchedule, deleteSchedule } = useApp()
  const [classFilter, setClassFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ day: "Saturday", period: 1, startTime: "08:00", endTime: "08:45", teacherId: "", subject: "", classId: "", room: "" })

  const filtered = schedules.filter((s) => {
    const mc = classFilter === "all" || s.classId === classFilter
    const md = dayFilter === "all" || s.day === dayFilter
    return mc && md
  }).sort((a, b) => {
    const dayIdx = (d: string) => DAYS.indexOf(d)
    if (dayIdx(a.day) !== dayIdx(b.day)) return dayIdx(a.day) - dayIdx(b.day)
    return a.period - b.period
  })

  const handleSave = () => {
    if (!form.classId || !form.teacherId) { toast.error("Class and teacher are required!"); return }
    const s: Schedule = { id: `sch-${generateId()}`, ...form }
    addSchedule(s)
    toast.success("Schedule entry added!")
    setIsOpen(false)
  }

  const exportCSV = () => {
    const headers = "Day,Period,Start,End,Class,Subject,Teacher,Room\n"
    const rows = filtered.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.name || ""
      const tch = teachers.find((t) => t.id === s.teacherId)?.name || ""
      return `${s.day},${s.period},${s.startTime},${s.endTime},${cls},${s.subject},${tch},${s.room}`
    }).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "schedules.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  // Group by day
  const byDay = DAYS.reduce<Record<string, typeof filtered>>((acc, day) => {
    acc[day] = filtered.filter((s) => s.day === day)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Filter by day" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Schedule</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Schedule Entry</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Day</Label>
                  <Select value={form.day} onValueChange={(v) => setForm((p) => ({ ...p, day: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5"><Label>Period</Label><Input type="number" value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} /></div>
                <div className="flex flex-col gap-1.5"><Label>End Time</Label><Input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Class *</Label>
                <Select value={form.classId} onValueChange={(v) => setForm((p) => ({ ...p, classId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Teacher *</Label>
                  <Select value={form.teacherId} onValueChange={(v) => setForm((p) => ({ ...p, teacherId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                    <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5"><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Room</Label><Input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} /></div>
              <Button onClick={handleSave}>Add Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {DAYS.filter((d) => dayFilter === "all" || d === dayFilter).map((day) => {
        const daySchedules = byDay[day] || []
        if (daySchedules.length === 0) return null
        return (
          <Card key={day}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-card-foreground">{day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Period</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Time</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Class</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Subject</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Teacher</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">Room</th>
                      <th className="px-4 py-2 text-right font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySchedules.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-2"><Badge variant="outline">{s.period}</Badge></td>
                        <td className="px-4 py-2 text-foreground">{s.startTime} - {s.endTime}</td>
                        <td className="px-4 py-2"><Badge variant="secondary">{classes.find((c) => c.id === s.classId)?.name}</Badge></td>
                        <td className="px-4 py-2 text-foreground">{s.subject}</td>
                        <td className="px-4 py-2 text-foreground">{teachers.find((t) => t.id === s.teacherId)?.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{s.room}</td>
                        <td className="px-4 py-2 text-right">
                          <Button variant="ghost" size="sm" onClick={() => { deleteSchedule(s.id); toast.success("Deleted!") }} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
