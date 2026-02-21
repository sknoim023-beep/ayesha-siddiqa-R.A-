"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import type { Expense } from "@/lib/types"
import { generateId } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Search, Download, Trash2 } from "lucide-react"

const CATEGORIES = ["Salary", "Utilities", "Supplies", "Maintenance", "Transport", "Food", "Events", "Furniture", "Books", "Other"]

export function ExpenseManagement() {
  const { expenses, addExpense, deleteExpense } = useApp()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0], amount: 0, category: "Salary",
    payee: "", description: "", paymentMode: "Cash", approvedBy: "Principal", receiptRef: "",
  })

  const filtered = expenses.filter((e) => {
    const ms = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.payee.toLowerCase().includes(search.toLowerCase())
    const mc = catFilter === "all" || e.category === catFilter
    return ms && mc
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSave = () => {
    if (!form.amount || !form.description) { toast.error("Amount and description required!"); return }
    const e: Expense = { id: generateId(), ...form, createdAt: new Date().toISOString().split("T")[0] }
    addExpense(e)
    toast.success("Expense recorded!")
    setForm({ date: new Date().toISOString().split("T")[0], amount: 0, category: "Salary", payee: "", description: "", paymentMode: "Cash", approvedBy: "Principal", receiptRef: "" })
    setIsOpen(false)
  }

  const exportCSV = () => {
    const headers = "Date,Amount,Category,Payee,Description,Mode,ApprovedBy\n"
    const rows = filtered.map((e) => `${e.date},${e.amount},${e.category},${e.payee},${e.description},${e.paymentMode},${e.approvedBy}`).join("\n")
    const blob = new Blob([headers + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "expenses.csv"; a.click(); URL.revokeObjectURL(url)
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search expenses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="py-1.5 text-sm">Total: {total.toLocaleString()} Tk</Badge>
        <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Record Expense</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record New Expense</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
                <div className="flex flex-col gap-1.5"><Label>Amount (Tk) *</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Payment Mode</Label>
                  <Select value={form.paymentMode} onValueChange={(v) => setForm((p) => ({ ...p, paymentMode: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5"><Label>Payee</Label><Input value={form.payee} onChange={(e) => setForm((p) => ({ ...p, payee: e.target.value }))} /></div>
              <div className="flex flex-col gap-1.5"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} /></div>
              <div className="flex flex-col gap-1.5"><Label>Receipt Reference</Label><Input value={form.receiptRef} onChange={(e) => setForm((p) => ({ ...p, receiptRef: e.target.value }))} /></div>
              <Button onClick={handleSave}>Record Expense</Button>
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Payee</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mode</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No expenses found</td></tr>
                ) : filtered.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{e.description}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{e.category}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{e.payee}</td>
                    <td className="px-4 py-3 font-medium text-destructive">{e.amount.toLocaleString()} Tk</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.paymentMode}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { deleteExpense(e.id); toast.success("Deleted!") }} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
