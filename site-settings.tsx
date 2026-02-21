"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, Upload, Eye, BookOpen } from "lucide-react"

export function SiteSettings() {
  const { settings, updateSettings } = useApp()
  const [form, setForm] = useState({ ...settings })
  const [showPreview, setShowPreview] = useState(false)

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      set("logo", ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    updateSettings(form)
    toast.success("Site settings saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Site Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your school branding, contact info, and letterhead</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Hide" : "Show"} Letterhead Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">School Identity</CardTitle>
              <CardDescription>School name, logo, and motto</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>School Name</Label>
                <Input value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="h-14 w-14 rounded-md object-cover" />
                    ) : (
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="mr-2 h-3.5 w-3.5" />
                          Upload Logo
                        </span>
                      </Button>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Motto / Tagline</Label>
                <Input value={form.motto} onChange={(e) => set("motto", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Principal Name</Label>
                  <Input value={form.principalName} onChange={(e) => set("principalName", e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Established Year</Label>
                  <Input value={form.establishedYear} onChange={(e) => set("establishedYear", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Address & Contact</CardTitle>
              <CardDescription>Physical address and contact details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>State / Division</Label>
                  <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Postal Code</Label>
                  <Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={(e) => set("country", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Alt Phone</Label>
                  <Input value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Website</Label>
                  <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Letterhead Configuration</CardTitle>
              <CardDescription>Custom text for donation receipts and bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label>Letterhead Footer Note</Label>
                <Textarea
                  value={form.letterheadNote}
                  onChange={(e) => set("letterheadNote", e.target.value)}
                  rows={3}
                  placeholder="Custom note for receipts and bills..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Letterhead Preview */}
        {showPreview && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Letterhead Preview</CardTitle>
              <CardDescription>How the receipt header will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-card p-6">
                {/* Header */}
                <div className="flex items-center gap-4 border-b-2 border-primary pb-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary">
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="h-14 w-14 rounded-md object-cover" />
                    ) : (
                      <BookOpen className="h-8 w-8 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground text-balance">{form.schoolName}</h3>
                    <p className="text-xs text-muted-foreground">{form.motto}</p>
                    <p className="text-xs text-muted-foreground">
                      {form.address}, {form.city} - {form.postalCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Phone: {form.phone} | Email: {form.email}
                    </p>
                  </div>
                </div>

                {/* Sample content */}
                <div className="py-6 text-center">
                  <h4 className="text-lg font-bold text-foreground">DONATION RECEIPT</h4>
                  <p className="text-xs text-muted-foreground">Receipt No: RCP-XXXX | Date: DD/MM/YYYY</p>
                </div>

                <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <p>Received from: _______________</p>
                  <p>Amount: _______________</p>
                  <p>In words: _______________</p>
                  <p>Purpose: _______________</p>
                </div>

                <Separator className="my-4" />

                <div className="flex items-end justify-between">
                  <p className="text-xs text-muted-foreground italic">{form.letterheadNote}</p>
                  <div className="text-right">
                    <div className="mb-1 w-32 border-t border-foreground" />
                    <p className="text-xs text-muted-foreground">{form.principalName}</p>
                    <p className="text-xs text-muted-foreground">Principal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
