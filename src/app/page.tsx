"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, AlertTriangle, IndianRupee } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import type { TransactionInput } from "../schema/transaction"
import { toast } from "sonner"
import { StatsCard } from "@/components/stats-card"
import { FinancialInsights } from "@/components/financial-insights"
import { MonthlyExpensesChart } from "@/components/monthly-expenses-chart"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"

export interface Transaction {
  _id?: string
  amount: number
  date: string
  description: string
  type: "income" | "expense"
}
interface FinancialStats {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  transactionCount: number
  expenseRatio: number
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const financialStats: FinancialStats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalBalance = totalIncome - totalExpenses
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      transactionCount: transactions.length,
      expenseRatio,
    }
  }, [transactions])

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)
    axios.get("/api/transactions")
    .then((res) => {
        setTransactions(res.data.data || [])
    })
    .catch((err) => {
      const message = err.response.data.message || "Failed to load transactions"
      setError("Failed to load transactions")
      toast.error(message)
    })
    .finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleAddTransaction = async (transaction: TransactionInput) => {
    axios.post("/api/transactions", transaction)
    .then((res) => {
      setTransactions((prev) => [res.data.data, ...prev])
      toast.success("Transaction added successfully.")
    })
    .catch((err) => {
      const message = err.response.data.message || "something went wrong"
      toast.error(message)
    })
    .finally(() => setIsFormOpen(false))
  }

  const handleEditTransaction = async (id: string, transaction: TransactionInput) => {
    axios.put(`/api/transactions/${id}`, transaction)
    .then((res) => {
      const data = res.data?.data
      setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)))
      toast.success("Transaction updated successfully.")
    })
    .catch((err) => {
      const message = err.response.data.message || "something went wrong"
      toast.error(message)
    })
    .finally(() => {
      setEditingTransaction(null)
      setIsFormOpen(false)
    })
  }

  const handleDeleteTransaction = async (id: string) => {
    axios.delete(`/api/transactions/${id}`)
    .then(() => {
      setTransactions((prev) => prev.filter((t) => t._id !== id))
      toast.success("Transaction deleted successfully.")
    })
    .catch((err) => {
      const message = err.response.data.message || "Something went wrong" 
      toast.error(message)
    })
  }

  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  if (error && transactions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchTransactions} className="gradient-card">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-emerald-400">
              Personal Finance Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Track your expenses and visualize your spending patterns</p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="gradient-card w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Income" value={financialStats.totalIncome} icon={TrendingUp} gradient="success-gradient" prefix="₹" className="bg-gradient-to-r from-green-800 to-green-600"/>

          <StatsCard title="Total Expenses" value={financialStats.totalExpenses} icon={TrendingDown} gradient="warning-gradient" prefix="₹" className="bg-gradient-to-r from-red-800 to-orange-600
"/>
          <StatsCard
            title="Balance"
            value={financialStats.totalBalance}
            icon={financialStats.totalBalance >= 0 ? PiggyBank : DollarSign}
            gradient={financialStats.totalBalance >= 0 ? "info-gradient" : "warning-gradient"}
            prefix="₹"
            className="bg-gradient-to-l from-purple-600 
"
          />
          <StatsCard title="Transactions" value={financialStats.transactionCount} icon={IndianRupee} gradient="neutral-gradient" 
          className="bg-gradient-to-r from-lime-900 to-yellow-700

"/>
        </div>

        <FinancialInsights stats={financialStats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-lg border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Monthly Expenses
              </CardTitle>
              <CardDescription>Your spending trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyExpensesChart transactions={transactions.filter((t) => t.type === "expense")} />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList
                transactions={transactions}
                onEdit={openEditForm}
                onDelete={handleDeleteTransaction}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        <TransactionForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSubmit={editingTransaction ? (data) => handleEditTransaction(editingTransaction._id!, data) : handleAddTransaction}
          initialData={editingTransaction}
          isEditing={!!editingTransaction}
        />
      </div>
    </div>
  )
}
