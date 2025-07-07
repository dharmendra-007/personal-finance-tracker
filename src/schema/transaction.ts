import { z } from "zod"

export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than 0")
    .max(9999999.99, "Amount cannot exceed ₹99,99,999.99"),

  date: z
    .string({
      required_error: "Date is required",
    })
    .min(1, "Date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .refine(
      (date) => {
        const inputDate = new Date(date)
        const today = new Date()
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(today.getFullYear() - 10)

        return inputDate <= today && inputDate >= oneYearAgo
      },
      {
        message: "Date must be within the last 10 years and not in the future",
      },
    ),

  description: z
    .string({
      required_error: "Description is required",
    })
    .trim()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters")
    .refine((desc) => desc.length > 0, {
      message: "Description cannot be empty or only whitespace",
    }),

  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  })
})

export const createTransactionSchema = transactionSchema

export const updateTransactionSchema = transactionSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
})

export const transactionIdSchema = z.object({
  id: z
    .string()
    .min(1, "Transaction ID is required")
    .refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
      message: "Invalid transaction ID format",
    }),
})

export interface TransactionQueryParams {
  limit?: number
  offset?: number
  sortBy?: "date" | "amount" | "description" | "createdAt"
  sortOrder?: "asc" | "desc"
  type?: "income" | "expense"
}

export type TransactionInput = z.infer<typeof transactionSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionId = z.infer<typeof transactionIdSchema>
