import type { NextRequest } from "next/server"
import type { ZodSchema } from "zod"
import { ZodError } from "zod"

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<ApiResponse<T>> {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)

    return {
      success: true,
      message: "Validation successful",
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ")

      return {
        success: false,
        message: errorMessage,
      }
    }

    return {
      success: false,
      message: "Invalid JSON format",
    }
  }
}
