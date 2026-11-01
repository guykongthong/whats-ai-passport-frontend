import type { FieldErrors } from "@/types/FieldErrors"

export function validateRequired(fields: Record<string, string>): FieldErrors {
    const error: FieldErrors = {}

    for (const inputData in fields) {
        if (fields[inputData]?.trim() === '') {
            error[inputData] = `${inputData} is required!`
        }
    }

    return error
}

export function validateChoices(options: string[], correctIndex: number): string | undefined {
    const filledOptions = options.filter((opt) => opt.trim())
    if (filledOptions.length < 2) {
        return 'At least 2 choices are required.'
    }
    if (correctIndex === 0) {
        return 'No correct answer set.'
    }
    return undefined
}