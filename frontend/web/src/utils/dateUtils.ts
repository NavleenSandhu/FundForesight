import { format } from "date-fns"

export function displayDate(date: Date) {
    return new Date(date).toISOString().split('T')[0]
}
export function formatDate(date: Date) {
    return format(new Date(date), "E, do MMM, yy")
}