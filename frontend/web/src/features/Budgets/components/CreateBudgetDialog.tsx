import { z } from "zod"
import { addMonths, startOfMonth, endOfMonth } from "date-fns"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addBudget } from "@/store/budgets/budgetsSlice"

const CreateBudgetDialog = () => {
    const dispatch = useDispatch<AppDispatch>()
    const amountMessage = 'Amount has to be greater than 0'
    const createBudgetSchema = z.object({
        category_name: z.string().trim().min(1, 'This field is required'),
        initial_amount: z.string()
            .transform(val => parseFloat(val))
            .refine(val => val > 0, amountMessage),
        month: z.string().min(1, "This field is required")
    });

    type CreateBudgetFormInputs = {
        category_name: string,
        initial_amount: number,
        month: 'Current' | 'Next'
    }

    const form = useForm<CreateBudgetFormInputs>({
        resolver: zodResolver(createBudgetSchema),
        defaultValues: { category_name: "", initial_amount: 0, month: 'Current' }
    });

    const handleBudgetCreateSubmit = async (data: CreateBudgetFormInputs) => {
        const now = new Date()
        const nextMonthBegin = startOfMonth(addMonths(now, 1))
        const nextMonthEnd = endOfMonth(addMonths(now, 2))
        dispatch(addBudget({
            category_name: data.category_name,
            initial_amount: data.initial_amount,
            remaining_amount: data.initial_amount,
            start_date: data.month === 'Current' ? startOfMonth(now) : nextMonthBegin,
            end_date: data.month === 'Current' ? endOfMonth(now) : nextMonthEnd
        }))
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Create budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>Create budget</DialogTitle>
                    <DialogDescription>Create a budget for a month.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleBudgetCreateSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name='category_name'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="categoryName">Category Name</Label>
                                    <FormControl>
                                        <Input id="categoryName" placeholder="eg. Groceries, Rent" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="initial_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="amount">Amount</Label>
                                    <FormControl>
                                        <Input id="amount"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            {...field}
                                            value={field.value as number} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="month">Month</Label><br />
                                    <FormControl>
                                        <div className="flex mx-6">
                                            <Label htmlFor="current" className="cursor-pointer">Current</Label>
                                            <input className="mx-2 mr-6" id="current"
                                                type="radio"
                                                {...field}
                                                value="Current" />
                                            <Label htmlFor="next" className="ml-6 cursor-pointer">Next</Label>
                                            <input className="mx-2" id="next"
                                                type="radio"
                                                {...field}
                                                value="Next" />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Create</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBudgetDialog
