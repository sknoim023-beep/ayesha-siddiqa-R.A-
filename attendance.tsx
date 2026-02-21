"use client"

import { useMemo } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react"

const statusIcon = {
  present: <CheckCircle className="h-4 w-4 text-primary" />,
  absent: <XCircle className="h-4 w-4 text-destructive" />,
  late: <Clock className="h-4 w-4 text-amber-500" />,
  leave: <Clock className="h-4 w-4 text-blue-500" />,
}

export function TeacherAttendance() {
  const { user, attendance } = useApp()
  const myAttendance = useMemo(
    () => attendance.filter(a => a.entityId === user?.id).sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, user]
  )

  const total = myAttendance.length
  const present = myAttendance.filter(a => a.status === "present").length
  const absent = myAttendance.filter(a => a.status === "absent").length
  const rate = total > 0 ? ((present / total) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-primary">{rate}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Days Present</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{present}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Days Absent</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{absent}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myAttendance.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No attendance records found</p>
          ) : (
            <div className="space-y-2">
              {myAttendance.slice(0, 30).map(a => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-3">
                    {statusIcon[a.status]}
                    <span className="font-medium text-sm">{new Date(a.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <Badge variant={a.status === "present" ? "default" : "destructive"} className="capitalize">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
