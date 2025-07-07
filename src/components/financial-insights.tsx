import { Alert, AlertDescription } from "./ui/alert"
import { AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react"

interface FinancialStats {
  totalIncome: number
  totalExpenses: number
  totalBalance: number
  transactionCount: number
  expenseRatio: number
}

interface FinancialInsightsProps {
  stats: FinancialStats
}

export function FinancialInsights({ stats }: FinancialInsightsProps) {
  const getInsights = () => {
    const insights = []

    // Expense ratio insights
    if (stats.expenseRatio > 80) {
      insights.push({
        type: "warning" as const,
        icon: AlertTriangle,
        message: `Your expenses are ${stats.expenseRatio.toFixed(1)}% of your income. Consider reducing spending to improve your financial health.`,
      })
    } else if (stats.expenseRatio > 50) {
      insights.push({
        type: "info" as const,
        icon: Info,
        message: `Your expenses are ${stats.expenseRatio.toFixed(1)}% of your income. You're spending moderately but could save more.`,
      })
    } else if (stats.totalIncome > 0) {
      insights.push({
        type: "success" as const,
        icon: CheckCircle,
        message: `Great job! Your expenses are only ${stats.expenseRatio.toFixed(1)}% of your income. You're saving well.`,
      })
    }

    // Balance insights
    if (stats.totalBalance < 0) {
      insights.push({
        type: "warning" as const,
        icon: AlertTriangle,
        message: "You're spending more than you earn. Consider creating a budget to track your expenses.",
      })
    } else if (stats.totalBalance > stats.totalIncome * 0.2) {
      insights.push({
        type: "success" as const,
        icon: TrendingUp,
        message: "Excellent! You're saving more than 20% of your income. Keep up the good work!",
      })
    }

    // Transaction count insights
    if (stats.transactionCount === 0) {
      insights.push({
        type: "info" as const,
        icon: Info,
        message: "Start by adding your first transaction to begin tracking your finances.",
      })
    } else if (stats.transactionCount < 5) {
      insights.push({
        type: "info" as const,
        icon: Info,
        message: "Add more transactions to get better insights into your spending patterns.",
      })
    }

    return insights
  }

  const insights = getInsights()

  if (insights.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Financial Insights</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <Alert
            key={index}
            className={`glass-card ${
              insight.type === "warning"
                ? "border-orange-200 dark:border-orange-800"
                : insight.type === "success"
                  ? "border-green-200 dark:border-green-800"
                  : "border-blue-200 dark:border-blue-800"
            }`}
          >
            <insight.icon
              className={`h-4 w-4 ${
                insight.type === "warning"
                  ? "text-orange-600"
                  : insight.type === "success"
                    ? "text-green-600"
                    : "text-blue-600"
              }`}
            />
            <AlertDescription className="text-sm">{insight.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  )
}
