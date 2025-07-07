"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Transaction } from "../app/page"
import { useMemo } from "react"

interface MonthlyExpensesChartProps {
  transactions: Transaction[]
}

interface ChartDataItem {
  month: string
  year: number
  monthIndex: number
  expenses: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const chartData = useMemo(() => {

    const months : ChartDataItem[] = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        expenses: 0,
      })
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date)
      const monthData = months.find(
        (m) => m.year === transactionDate.getFullYear() && m.monthIndex === transactionDate.getMonth(),
      )
      if (monthData) {
        monthData.expenses += transaction.amount
      }
    })

    return months
  }, [transactions])

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black/70 border rounded-lg p-3 shadow-md border-white/30">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Expenses:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No data to display. Add some transactions to see your monthly expenses.</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
          <YAxis className="text-muted-foreground" fontSize={12} tickFormatter={(value) => `₹${value}`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
