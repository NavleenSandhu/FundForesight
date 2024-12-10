import { format } from "date-fns"

export function displayDate(date: Date) {
    return new Date(date).toLocaleDateString("en-CA")
}
export function formatDate(date: Date) {
    return format(new Date(date), "E, do MMM, yy")
}

export function formatDateAndTime(date: Date) {
    return format(new Date(date), "E, do MMM, yy HH:mm")
}

