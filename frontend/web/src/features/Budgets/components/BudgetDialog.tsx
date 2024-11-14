import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Budget } from "@/models/Budget"
import { addBudget, editBudget } from "@/store/budgets/budgetsSlice"
import { AppDispatch } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogClose, DialogDescription } from "@/components/ui/dialog"
import React from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { z } from "zod"

interface BudgetDialogProps {
    formType: 'Create' | 'Edit',
    budget?: Budget,
    setBudget?: (budget: Budget) => void
}

const BudgetDialog: React.FC<BudgetDialogProps> = ({ formType, budget, setBudget }) => {
    const dispatch = useDispatch<AppDispatch>();
    const amountMessage = 'Amount has to be greater than 0'
    const budgetFormSchema = z.object({
        category_name: z.string().trim().min(1, 'This field is required'),
        ...(formType === 'Create' && {
            initial_amount: z.string({ invalid_type_error: amountMessage })
                .transform(val => parseFloat(val))
                .refine(val => val > 0, amountMessage)
        }),
    })

    type BudgetFormInputs = {
        category_name: string,
        initial_amount: number
    }
    const form = useForm<BudgetFormInputs>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: {
            category_name: budget ? budget.category_name : "",
            initial_amount: formType === 'Create' ? 0 : undefined
        }
    })

    const handleBudgetSubmit = async (data: BudgetFormInputs) => {
        const now = new Date()
        const nextMonthBegin = formType === 'Create' ? new Date(Date.UTC(now.getFullYear() + (now.getMonth() === 11 ? 1 : 0), (now.getMonth() + 1) % 12, 1, 0, 0, 0)) : budget?.start_date
        const nextMonthEnd = formType === 'Create' ? new Date(Date.UTC(nextMonthBegin!.getFullYear(), nextMonthBegin!.getMonth() + 1, 0, 23, 59, 59)) : budget?.end_date
        const formBudget = {
            category_name: data.category_name,
            initial_amount: formType === 'Create' ? data.initial_amount : budget!.initial_amount,
            remaining_amount: formType === 'Create' ? data.initial_amount : budget!.remaining_amount,
            start_date: nextMonthBegin!,
            end_date: nextMonthEnd!
        }
        console.log(formBudget);
        
        if (formType === 'Create') {
            dispatch(addBudget(formBudget))
            return
        }
        const updatedBudget = {
            ...formBudget,
            ...{
                budget_id: budget!.budget_id,
                user_id: budget!.user_id
            }
        }
        dispatch(editBudget(updatedBudget))
        setBudget!(updatedBudget)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{formType} budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{formType} budget</DialogTitle>
                    {formType == 'Create' && <DialogDescription>Create a budget for next month.</DialogDescription>}
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleBudgetSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name='category_name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Category Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {formType === 'Create' && <FormField
                            control={form.control}
                            name="initial_amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Amount"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            {...field}
                                            value={field.value as number} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">{formType}</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default BudgetDialog
