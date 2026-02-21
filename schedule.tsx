"use client"

import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

export function TeacherSchedule() {
  const { user, schedules, classes } = useApp()
  const mySchedules = schedules.filter(s => s.teacherId === user?.id)

  return (
    <div className="space-y-6">
      {DAYS.map(day => {
        const daySchedules = mySchedules.filter(s => s.day === day).sort((a, b) => a.period - b.period)
        if (daySchedules.length === 0) return null
        return (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {day}
                <Badge variant="secondary" className="ml-2">{daySchedules.length} classes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {daySchedules.map(s => {
                  const cls = classes.find(c => c.id === s.classId)
                  return (
                    <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {s.period}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.subject}</p>
                          <p className="text-xs text-muted-foreground">{s.startTime} - {s.endTime}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{cls?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{s.room}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
      {mySchedules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No schedule has been assigned yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
