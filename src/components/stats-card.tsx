import { StatsCardProps } from "@/types/stats-card"
import { Card, CardContent } from "./ui/card"
import { cn } from "@/lib/utils"

interface UpdatedStatsCardProps extends StatsCardProps {
  className?: string
  contentClassName?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradient,
  prefix = "",
  suffix = "",
  className = "",
  contentClassName = "",
}: UpdatedStatsCardProps) {
  const formatValue = (val: number) => {
    if (prefix === "₹") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    }
    return `${prefix}${val.toLocaleString("en-IN")}${suffix}`
  }

  return (
    <Card
      className={cn(
        `${gradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-white/70`,
        className,
      )}
    >
      <CardContent className={cn("p-6", contentClassName)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{formatValue(value)}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
