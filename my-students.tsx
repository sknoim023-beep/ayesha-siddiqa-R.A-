"use client"

import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Users } from "lucide-react"

export function TeacherStudents() {
  const { user, teachers, students, classes } = useApp()
  const teacher = teachers.find(t => t.id === user?.id)
  const myClasses = classes.filter(c => teacher?.assignedClasses.includes(c.id))
  const [selectedClass, setSelectedClass] = useState<string>("all")

  const filtered = selectedClass === "all"
    ? students.filter(s => teacher?.assignedClasses.includes(s.classId))
    : students.filter(s => s.classId === selectedClass)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All My Classes ({filtered.length})</SelectItem>
            {myClasses.map(c => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.section}) - {students.filter(s => s.classId === c.id).length} students
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            My Students ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No students found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Father</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => {
                  const cls = classes.find(c => c.id === s.classId)
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.rollNumber}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{cls?.name || "N/A"}</TableCell>
                      <TableCell>{s.fatherName}</TableCell>
                      <TableCell className="text-xs">{s.guardianPhone}</TableCell>
                      <TableCell><Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
