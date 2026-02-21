"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, GraduationCap, BookOpen } from "lucide-react"
import { toast } from "sonner"

export function LoginPage() {
  const { login, settings } = useApp()
  const [tab, setTab] = useState<string>("principal")
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      const role = tab as "principal" | "teacher" | "student"
      const loginId = role === "principal" ? "principal" : id
      const success = login(role, loginId, password)
      if (!success) {
        toast.error("Invalid credentials. Please try again.")
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        {/* School Branding */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            {settings.logo ? (
              <img src={settings.logo} alt="School Logo" className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight text-foreground text-balance">
              {settings.schoolName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{settings.motto}</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full border-border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-card-foreground">Sign In</CardTitle>
            <CardDescription>Select your role and enter credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => { setTab(v); setId(""); setPassword("") }}>
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="principal" className="gap-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5" /> Principal
                </TabsTrigger>
                <TabsTrigger value="teacher" className="gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5" /> Teacher
                </TabsTrigger>
                <TabsTrigger value="student" className="gap-1.5 text-xs">
                  <GraduationCap className="h-3.5 w-3.5" /> Student
                </TabsTrigger>
              </TabsList>

              <TabsContent value="principal">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="principal-pass">Password</Label>
                    <Input
                      id="principal-pass"
                      type="password"
                      placeholder="Enter principal password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Principal ID: principal | Default password: ayesha2024
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="teacher">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="teacher-id">Teacher ID</Label>
                    <Input
                      id="teacher-id"
                      placeholder="e.g., tch-001"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="teacher-pass">Password</Label>
                    <Input
                      id="teacher-pass"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="student">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <Input
                      id="student-id"
                      placeholder="e.g., std-001"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="student-pass">Password</Label>
                    <Input
                      id="student-pass"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button className="mt-6 w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Est. {settings.establishedYear} &middot; {settings.city}, {settings.country}
        </p>
      </div>
    </div>
  )
}
