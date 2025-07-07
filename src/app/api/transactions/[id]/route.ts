import connectMongoDB from "@/lib/db"
import Transaction from "@/lib/models/Transaction"
import { createTransactionSchema } from "@/schema/transaction"
import { validateRequestBody } from "@/lib/utils/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params } : {
  params : Promise<{ id: string }>
} ) {
  try {
    await connectMongoDB()

    const validation = await validateRequestBody(request, createTransactionSchema)
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      (await params).id,
      validation.data,
      { new: true, runValidators: true }
    )

    if (!updatedTransaction) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedTransaction })
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update transaction" },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params } : {
  params : Promise<{ id: string }>
} ) {
  try {
    await connectMongoDB()

    const deletedTransaction = await Transaction.findByIdAndDelete((await params).id)

    if (!deletedTransaction) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Transaction deleted successfully" })
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}
