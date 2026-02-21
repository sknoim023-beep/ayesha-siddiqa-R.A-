"use client"

import { useState, useMemo } from "react"
import { useApp } from "@/lib/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"

const COLORS = ["oklch(0.52 0.14 155)", "oklch(0.78 0.12 85)", "oklch(0.6 0.118 184.704)", "oklch(0.65 0.18 45)"]

type Period = "monthly" | "quarterly" | "yearly"

function getMonthName(m: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m]
}

export function ReportsView() {
  const { donations, expenses } = useApp()
  const [period, setPeriod] = useState<Period>("monthly")
  const [year, setYear] = useState("2026")

  const filteredDonations = useMemo(() => donations.filter(d => d.date.startsWith(year)), [donations, year])
  const filteredExpenses = useMemo(() => expenses.filter(e => e.date.startsWith(year)), [expenses, year])

  const totalDonations = filteredDonations.reduce((s, d) => s + d.amount, 0)
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0)
  const balance = totalDonations - totalExpenses

  const chartData = useMemo(() => {
    if (period === "monthly") {
      return Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, "0")
        const prefix = `${year}-${month}`
        const don = filteredDonations.filter(d => d.date.startsWith(prefix)).reduce((s, d) => s + d.amount, 0)
        const exp = filteredExpenses.filter(e => e.date.startsWith(prefix)).reduce((s, e) => s + e.amount, 0)
        return { name: getMonthName(i), donations: don, expenses: exp, balance: don - exp }
      })
    }
    if (period === "quarterly") {
      return [
        { name: "Q1 (Jan-Mar)", months: ["01", "02", "03"] },
        { name: "Q2 (Apr-Jun)", months: ["04", "05", "06"] },
        { name: "Q3 (Jul-Sep)", months: ["07", "08", "09"] },
        { name: "Q4 (Oct-Dec)", months: ["10", "11", "12"] },
      ].map(q => {
        const don = filteredDonations.filter(d => q.months.some(m => d.date.startsWith(`${year}-${m}`))).reduce((s, d) => s + d.amount, 0)
        const exp = filteredExpenses.filter(e => q.months.some(m => e.date.startsWith(`${year}-${m}`))).reduce((s, e) => s + e.amount, 0)
        return { name: q.name, donations: don, expenses: exp, balance: don - exp }
      })
    }
    // yearly - show last 5 years
    return Array.from({ length: 5 }, (_, i) => {
      const y = String(parseInt(year) - 4 + i)
      const don = donations.filter(d => d.date.startsWith(y)).reduce((s, d) => s + d.amount, 0)
      const exp = expenses.filter(e => e.date.startsWith(y)).reduce((s, e) => s + e.amount, 0)
      return { name: y, donations: don, expenses: exp, balance: don - exp }
    })
  }, [period, year, filteredDonations, filteredExpenses, donations, expenses])

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>()
    filteredExpenses.forEach(e => map.set(e.category, (map.get(e.category) || 0) + e.amount))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredExpenses])

  const donationByPurpose = useMemo(() => {
    const map = new Map<string, number>()
    filteredDonations.forEach(d => map.set(d.purpose, (map.get(d.purpose) || 0) + d.amount))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredDonations])

  const handleExport = () => {
    const header = "Period,Donations,Expenses,Balance\n"
    const rows = chartData.map(d => `${d.name},${d.donations},${d.expenses},${d.balance}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${year}-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["2024", "2025", "2026"].map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">&#2547;{totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{filteredDonations.length} transactions in {year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">&#2547;{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{filteredExpenses.length} transactions in {year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            {balance >= 0 ? <TrendingUp className="h-4 w-4 text-primary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>&#2547;{balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{balance >= 0 ? "Surplus" : "Deficit"} for {year}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Donations vs Expenses ({period})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.02 155)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => `\u09F3${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="donations" name="Donations" fill="oklch(0.52 0.14 155)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="oklch(0.78 0.12 85)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.02 155)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => `\u09F3${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="balance" stroke="oklch(0.52 0.14 155)" strokeWidth={2} dot={{ fill: "oklch(0.52 0.14 155)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {expenseByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `\u09F3${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No expense data for {year}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Donations by Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            {donationByPurpose.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={donationByPurpose} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {donationByPurpose.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `\u09F3${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No donation data for {year}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Donations</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right text-primary">&#2547;{row.donations.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive">&#2547;{row.expenses.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-semibold ${row.balance >= 0 ? "text-primary" : "text-destructive"}`}>
                    &#2547;{row.balance.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right text-primary">&#2547;{totalDonations.toLocaleString()}</TableCell>
                <TableCell className="text-right text-destructive">&#2547;{totalExpenses.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
                  &#2547;{balance.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
