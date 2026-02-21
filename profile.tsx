"use client"

import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, MapPin, BookOpen, Heart, GraduationCap } from "lucide-react"

export function TeacherProfile() {
  const { user, teachers, classes } = useApp()
  const teacher = teachers.find(t => t.id === user?.id)
  if (!teacher) return <p className="text-muted-foreground">Teacher data not found.</p>

  const myClasses = classes.filter(c => teacher.assignedClasses.includes(c.id))

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {teacher.photo ? (
              <img src={teacher.photo} alt={teacher.name} className="h-24 w-24 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {teacher.name.charAt(0)}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm flex-1">
              <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{teacher.name}</span></div>
              <div><span className="text-muted-foreground">Father:</span> <span className="font-medium">{teacher.fatherName}</span></div>
              <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{teacher.dateOfBirth}</span></div>
              <div><span className="text-muted-foreground">Age:</span> <span className="font-medium">{teacher.age}</span></div>
              <div><span className="text-muted-foreground">Blood Group:</span> <span className="font-medium">{teacher.bloodGroup}</span></div>
              <div><span className="text-muted-foreground">Marital Status:</span> <span className="font-medium">{teacher.maritalStatus}</span></div>
              <div><span className="text-muted-foreground">Joining Date:</span> <span className="font-medium">{teacher.joiningDate}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <Badge variant="secondary">{teacher.status}</Badge></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" /> Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {teacher.phone}</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {teacher.email}</div>
          <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {teacher.address}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> Qualifications & Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><span className="text-muted-foreground">Qualification:</span> <span className="font-medium">{teacher.qualification}</span></div>
          <div><span className="text-muted-foreground">Specialization:</span> <span className="font-medium">{teacher.specialization}</span></div>
          <div><span className="text-muted-foreground">Subject:</span> <Badge>{teacher.subject}</Badge></div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground">Assigned Classes:</span>
            {myClasses.map(c => <Badge key={c.id} variant="outline"><BookOpen className="mr-1 h-3 w-3" /> {c.name} ({c.section})</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Family Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm"><span className="text-muted-foreground">Family Condition:</span> <span className="font-medium">{teacher.familyCondition}</span></p>
          {teacher.familyMembers.length > 0 && (
            <div className="space-y-2">
              {teacher.familyMembers.map(fm => (
                <div key={fm.id} className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm">
                  <div>
                    <span className="font-medium">{fm.name}</span>
                    <span className="text-muted-foreground ml-2">({fm.relation})</span>
                  </div>
                  <div className="text-muted-foreground">
                    Age: {fm.age} | {fm.occupation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
