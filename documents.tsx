"use client"

import { useState, useRef } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateId } from "@/lib/store"
import type { DocumentFile } from "@/lib/types"
import { Upload, Download, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"

export function TeacherDocuments() {
  const { user, teachers, updateTeacher } = useApp()
  const teacher = teachers.find(t => t.id === user?.id)
  const fileRef = useRef<HTMLInputElement>(null)
  const [docName, setDocName] = useState("")

  if (!teacher) return <p className="text-muted-foreground">Teacher data not found.</p>

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !teacher) return
    const reader = new FileReader()
    reader.onload = () => {
      const doc: DocumentFile = {
        id: generateId(),
        name: docName || file.name,
        type: file.type,
        fileData: reader.result as string,
        uploadDate: new Date().toISOString().split("T")[0],
      }
      updateTeacher({ ...teacher, documents: [...teacher.documents, doc] })
      setDocName("")
      toast.success("Document uploaded successfully")
    }
    reader.readAsDataURL(file)
    if (fileRef.current) fileRef.current.value = ""
  }

  function handleDownload(doc: DocumentFile) {
    const a = document.createElement("a")
    a.href = doc.fileData
    a.download = doc.name
    a.click()
  }

  function handleDelete(docId: string) {
    if (!teacher) return
    updateTeacher({ ...teacher, documents: teacher.documents.filter(d => d.id !== docId) })
    toast.success("Document deleted")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Document name (optional)" value={docName} onChange={e => setDocName(e.target.value)} />
          <div className="flex gap-2">
            <Input ref={fileRef} type="file" onChange={handleUpload} className="flex-1" />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Documents ({teacher.documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {teacher.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {teacher.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
