import type { LucideIcon } from "lucide-react"

export type StatsCardProps = {
  title: string
  value: number
  icon: LucideIcon
  gradient: string
  prefix?: string
  suffix?: string
}