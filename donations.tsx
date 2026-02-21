"use client"

import { useState, useRef } from "react"
import { useApp } from "@/lib/context"
import type { Donation } from "@/lib/types"
import { generateId, getNextReceiptNumber, amountToWords } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Search, Download, Trash2, Printer, Eye, BookOpen } from "lucide-react"

export function DonationManagement() {
  const { donations, settings, addDonation, deleteDonation } = useApp()
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [viewingReceipt, setViewingReceipt] = useState<Donation | null>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({
    donorName: "", donorPhone: "", donorAddress: "",
    amount: 0, date: new Date().toISOString().split("T")[0],
    paymentMode: "Cash", purpose: "", notes: "",
  })

  const filtered = donations.filter((d) =>
    d.donorName.toLowerCase().includes(search.toLowerCase()) ||
    d.receiptNumber.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSave = () => {
    if (!form.donorName || !form.amount) { toast.error("Donor name and amount are required!"); return }
    const d: Donation = {
      id: generateId(),
      receiptNumber: getNextReceiptNumber(),
      ...form,
      createdAt: new Date().toISOString().split("T")[0],
    }
    addDonation(d)
    toast.success("Donation recorded! Receipt: " + d.receiptNumber)
    setViewingReceipt(d)
    setForm({ donorName: "", donorPhone: "", donorAddress: "", amount: 0, date: new Date().toISOString().split("T")[0], paymentMode: "Cash", purpose: "", notes: "" })
    setIsAddOpen(false)
  }

  const printReceipt = () => {
    if (!printRef.current) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    printWindow.document.write(`
      <html><head><title>Donation Receipt</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
        .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #16a34a; padding: 30px; }
        .header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
        .logo { width: 60px; height: 60px; background: #16a34a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
        .logo img { width: 56px; height: 56px; border-radius: 6px; object-fit: cover; }
        .school-info h1 { margin: 0; font-size: 16px; color: #16a34a; }
        .school-info p { margin: 2px 0; font-size: 11px; color: #666; }
        .title { text-align: center; margin: 20px 0; }
        .title h2 { margin: 0; font-size: 20px; border-bottom: 2px solid #16a34a; display: inline-block; padding-bottom: 4px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
        .field { margin-bottom: 12px; font-size: 13px; }
        .field label { font-weight: 600; color: #333; }
        .amount-box { background: #f0fdf4; border: 1px solid #16a34a; padding: 12px; border-radius: 6px; margin: 16px 0; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
        .sig-line { border-top: 1px solid #333; width: 150px; text-align: center; padding-top: 4px; font-size: 12px; }
        .footer { text-align: center; margin-top: 20px; font-style: italic; font-size: 11px; color: #888; }
        @media print { body { padding: 0; } }
      </style></head><body>
      ${printRef.current.innerHTML}
      <script>window.print(); window.close();</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  const exportCSV = () => {
    const headers = "Receipt,Donor,Phone,Amount,Date,Mode,Purpose\n"
    const rows = filtered.map((d) => `${d.receiptNumber},${d.donorName},${d.donorPhone},${d.amount},${d.date},${d.paymentMode},${d.purpose}`).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "donations.csv"; a.click(); URL.revokeObjectURL(url)
  }

  const totalDonations = donations.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search donations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Badge variant="secondary" className="py-1.5 text-sm">Total: {totalDonations.toLocaleString()} Tk</Badge>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export</Button>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Record Donation</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record New Donation</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><Label>Donor Name *</Label><Input value={form.donorName} onChange={(e) => setForm((p) => ({ ...p, donorName: e.target.value }))} /></div>
                <div className="flex flex-col gap-1.5"><Label>Phone</Label><Input value={form.donorPhone} onChange={(e) => setForm((p) => ({ ...p, donorPhone: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Address</Label><Input value={form.donorAddress} onChange={(e) => setForm((p) => ({ ...p, donorAddress: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><Label>Amount (Tk) *</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} /></div>
                <div className="flex flex-col gap-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Payment Mode</Label>
                  <Select value={form.paymentMode} onValueChange={(v) => setForm((p) => ({ ...p, paymentMode: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5"><Label>Purpose</Label><Input value={form.purpose} onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2} /></div>
              {form.amount > 0 && (
                <p className="text-sm text-muted-foreground">In words: <span className="font-medium text-foreground">{amountToWords(form.amount)}</span></p>
              )}
              <Button onClick={handleSave}>Record Donation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Receipt #</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Donor</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mode</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Purpose</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No donations found</td></tr>
                ) : filtered.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-primary">{d.receiptNumber}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{d.donorName}</td>
                    <td className="px-4 py-3 font-medium text-primary">{d.amount.toLocaleString()} Tk</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{d.paymentMode}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{d.purpose}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewingReceipt(d)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Preview Dialog */}
      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Donation Receipt</span>
              <Button size="sm" onClick={printReceipt}><Printer className="mr-2 h-3.5 w-3.5" />Print Receipt</Button>
            </DialogTitle>
          </DialogHeader>
          {viewingReceipt && (
            <div ref={printRef}>
              <div className="receipt rounded-lg border-2 border-primary p-6">
                {/* Letterhead */}
                <div className="flex items-center gap-4 border-b-2 border-primary pb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <BookOpen className="h-7 w-7 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">{settings.schoolName}</h3>
                    <p className="text-xs text-muted-foreground">{settings.address}, {settings.city} - {settings.postalCode}</p>
                    <p className="text-xs text-muted-foreground">Phone: {settings.phone} | Email: {settings.email}</p>
                  </div>
                </div>

                <div className="py-4 text-center">
                  <h4 className="text-lg font-bold text-foreground">DONATION RECEIPT</h4>
                </div>

                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Receipt No: <span className="font-mono font-medium text-foreground">{viewingReceipt.receiptNumber}</span></span>
                  <span className="text-muted-foreground">Date: <span className="font-medium text-foreground">{viewingReceipt.date}</span></span>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div><span className="font-medium text-foreground">Received from:</span> <span className="text-foreground">{viewingReceipt.donorName}</span></div>
                  {viewingReceipt.donorAddress && <div><span className="font-medium text-foreground">Address:</span> <span className="text-foreground">{viewingReceipt.donorAddress}</span></div>}
                  {viewingReceipt.donorPhone && <div><span className="font-medium text-foreground">Phone:</span> <span className="text-foreground">{viewingReceipt.donorPhone}</span></div>}

                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Amount:</span>
                      <span className="text-xl font-bold text-primary">{viewingReceipt.amount.toLocaleString()} Tk</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">In Words: {amountToWords(viewingReceipt.amount)}</p>
                  </div>

                  <div><span className="font-medium text-foreground">Payment Mode:</span> <span className="text-foreground">{viewingReceipt.paymentMode}</span></div>
                  {viewingReceipt.purpose && <div><span className="font-medium text-foreground">Purpose:</span> <span className="text-foreground">{viewingReceipt.purpose}</span></div>}
                </div>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-xs italic text-muted-foreground">{settings.letterheadNote}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-1 w-36 border-t border-foreground" />
                    <p className="text-xs font-medium text-foreground">{settings.principalName}</p>
                    <p className="text-xs text-muted-foreground">Principal</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  function handleDelete(id: string) {
    deleteDonation(id)
    toast.success("Donation deleted!")
  }
}
