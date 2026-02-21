"use client"

import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react"

export function TeacherDashboard() {
  const { user, teachers, students, classes, schedules, attendance } = useApp()
  const teacher = teachers.find(t => t.id === user?.id)
  if (!teacher) return <p className="text-muted-foreground">Teacher data not found.</p>

  const myClasses = classes.filter(c => teacher.assignedClasses.includes(c.id))
  const myStudents = students.filter(s => teacher.assignedClasses.includes(s.classId))
  const today = new Date().toISOString().split("T")[0]
  const todaySchedule = schedules.filter(s => s.teacherId === teacher.id && s.day === new Date().toLocaleDateString("en-US", { weekday: "long" }))
  const todayAttendance = attendance.find(a => a.date === today && a.entityId === teacher.id)

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary/10 p-6 border border-primary/20">
        <h1 className="text-xl font-bold text-foreground">Assalamu Alaikum, {teacher.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {teacher.subject} Teacher | {myClasses.map(c => c.name).join(", ")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myClasses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Today's Classes"}</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySchedule.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{"Today's Status"}</CardTitle>
            {todayAttendance?.status === "present" ? <CheckCircle className="h-4 w-4 text-primary" /> : <XCircle className="h-4 w-4 text-destructive" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{todayAttendance?.status || "Not marked"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> {"Today's Schedule"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaySchedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
          ) : (
            <div className="space-y-2">
              {todaySchedule.sort((a, b) => a.period - b.period).map(s => {
                const cls = classes.find(c => c.id === s.classId)
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div>
                      <span className="font-medium">Period {s.period}</span>
                      <span className="text-sm text-muted-foreground ml-3">{s.startTime} - {s.endTime}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{s.subject}</span>
                      <span className="text-muted-foreground ml-2">({cls?.name || "N/A"} - {s.room})</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
