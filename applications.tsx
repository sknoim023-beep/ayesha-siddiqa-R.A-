"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/store"
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

export function TeacherApplications() {
  const { user, applications, addApplication } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState("Leave Application")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  const myApps = applications.filter(a => a.fromId === user?.id).sort((a, b) => b.date.localeCompare(a.date))

  function handleSubmit() {
    if (!subject.trim() || !content.trim()) { toast.error("Please fill all fields"); return }
    addApplication({
      id: generateId(),
      fromType: "teacher",
      fromId: user?.id || "",
      fromName: user?.name || "",
      type,
      subject,
      content,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      response: "",
    })
    setSubject("")
    setContent("")
    setShowForm(false)
    toast.success("Application submitted successfully")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> New Application
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Leave Application">Leave Application</SelectItem>
                <SelectItem value="Salary Advance">Salary Advance</SelectItem>
                <SelectItem value="Transfer Request">Transfer Request</SelectItem>
                <SelectItem value="Complaint">Complaint</SelectItem>
                <SelectItem value="Suggestion">Suggestion</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <Textarea placeholder="Write your application..." rows={5} value={content} onChange={e => setContent(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Submit</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {myApps.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No applications submitted yet</p>
            </CardContent>
          </Card>
        ) : myApps.map(app => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{app.subject}</CardTitle>
                  <CardDescription>Type: {app.type} | Date: {app.date}</CardDescription>
                </div>
                <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                  {app.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                  {app.status === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                  {app.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">{app.content}</div>
              {app.response && (
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Principal Response:</p>
                  <p className="text-sm">{app.response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
