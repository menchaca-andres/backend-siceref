export const toDate = (value: Date | string | undefined) => {
    if (value === undefined || value instanceof Date) return value

    return new Date(`${value}T00:00:00.000Z`)
}
