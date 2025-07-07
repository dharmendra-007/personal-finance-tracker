"use client"

import { useEffect, useState } from "react"
import { IndianRupee, FileText, Loader, Calendar as CalanderIcon } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "./ui/dialog"
import { transactionSchema, type TransactionInput } from "../schema/transaction"
import type { Transaction } from "../app/page"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { format } from "date-fns"

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionInput) => void
  initialData?: Transaction | null
  isEditing?: boolean
}

export function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: TransactionFormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "expense",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: Number(initialData.amount) || 0,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        description: initialData.description || "",
        type: initialData.type || "expense",
      })
    } else {
      form.reset({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        description: "",
        type: "expense",
      })
    }
  }, [initialData, form])

  const handleSubmit = async (data: TransactionInput) => {
    onSubmit(data)
    if (!isEditing) {
      form.reset({
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        description: "",
        type: "expense",
      })
    }
  }

  const handleClose = () => {
    form.reset({
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "expense",
    })
    onClose()
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTitle />
      <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border border-white/30">
        <DialogDescription className="sr-only">
          {isEditing ? "Edit transaction form" : "Add new transaction form"}
        </DialogDescription>
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center ">
              {isEditing ? "Edit Transaction" : "Add New Transaction"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Transaction Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={form.formState.isSubmitting}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Income
                              </div>
                            </SelectItem>
                            <SelectItem value="expense">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Expense
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Amount (₹)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="1"
                            placeholder="0"
                            disabled={form.formState.isSubmitting}
                            className="h-11 pl-10"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="w-full">
                              <Button
                                variant="calender"
                                className={`w-full h-11 justify-start text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                                disabled={form.formState.isSubmitting}
                              >
                                <CalanderIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {field.value
                                  ? new Date(field.value).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                  : "Pick a date"}
                              </Button>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                              }}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Description</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="Enter transaction description..."
                            disabled={form.formState.isSubmitting}
                            className="min-h-[80px] pl-10 resize-y"
                            maxLength={200}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/200 characters
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-1/2 h-11 bg-red-900/90 hover:bg-red-900 !border-white/30 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-1/2 h-11 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 bg-green-800 hover:bg-green-900"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : (
                      `${isEditing ? "Update" : "Add"} Transaction`
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
