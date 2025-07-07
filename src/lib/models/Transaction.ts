import mongoose, { type Document, Schema } from "mongoose"

export interface ITransaction extends Document {
  amount: number
  date: string
  description: string
  type: "income" | "expense"
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

TransactionSchema.index({ date: -1, createdAt: -1 })

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)
