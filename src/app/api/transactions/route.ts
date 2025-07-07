import connectMongoDB from "@/lib/db"
import Transaction from "@/lib/models/Transaction"
import { createTransactionSchema } from "@/schema/transaction"
import { validateRequestBody } from "@/lib/utils/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    await connectMongoDB()

    const transactions = await Transaction.find().sort({ date: -1 }).lean()

    return NextResponse.json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    })
  } catch{
    return NextResponse.json(
      { success: false, 
        message: "Failed to fetch transactions" 
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB()

    const validation = await validateRequestBody(request, createTransactionSchema)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, 
          message: validation.message 
        },
        { status: 400 },
      )
    }

    const transaction = new Transaction(validation.data)
    const savedTransaction = await transaction.save()

    return NextResponse.json(
      {
        success: true,
        message: "Transaction created successfully",
        data: savedTransaction,
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json(
      { success: false, 
        message: "Failed to create transaction" 
      },
      { status: 500 },
    )
  }
}
