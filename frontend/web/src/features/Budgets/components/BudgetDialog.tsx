import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addBudget, editBudget } from "@/store/budgets/budgetsSlice"
import { AppDispatch, RootState } from "@/store/store"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"
import { addMonths, startOfMonth, endOfMonth } from "date-fns"
import { Label } from "@/components/ui/label"


interface BudgetDialogProps {
    formType: 'Create' | 'Edit',
    budget_id?: number,
}

const BudgetDialog: React.FC<BudgetDialogProps> = ({ formType, budget_id }) => {
    const dispatch = useDispatch<AppDispatch>();
    const amountMessage = 'Amount has to be greater than 0'
    const createBudgetSchema = z.object({
        category_name: z.string().trim().min(1, 'This field is required'),
        initial_amount: z.string()
            .transform(val => parseFloat(val))
            .refine(val => val > 0, amountMessage),
        month: z.string().min(1, "This field is required")
    });
    const editBudgetSchema = z.object({
        category_name: z.string().trim().min(1, 'This field is required'),
    });

    const budgetFormSchema = formType === 'Create' ? createBudgetSchema : editBudgetSchema;

    type BudgetFormInputs = {
        category_name: string,
        initial_amount: number,
        month: 'Current' | 'Next'
    }
    const budget = useSelector((state: RootState) => state.budgets.budgets.find(budget => budget.budget_id === budget_id))

    const defaultValues = formType === 'Create'
        ? { category_name: "", initial_amount: 0, month: 'Current' }
        : { category_name: budget?.category_name || "" };


    const form = useForm<BudgetFormInputs>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues
    });

    if (!budget && formType !== 'Create') {
        console.error("Budget not found!");
        return;
    }

    const handleBudgetSubmit = async (data: BudgetFormInputs) => {
        const now = new Date()
        const nextMonthBegin = formType === 'Create' ? startOfMonth(addMonths(now, 1)) : budget?.start_date;
        const nextMonthEnd = formType === 'Create' ? endOfMonth(addMonths(now, 2)) : budget?.end_date;
        const formBudget = {
            category_name: data.category_name,
            initial_amount: formType === 'Create' ? data.initial_amount : budget!.initial_amount,
            remaining_amount: formType === 'Create' ? data.initial_amount : budget!.remaining_amount,
            start_date: nextMonthBegin!,
            end_date: nextMonthEnd!
        }

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
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{formType} budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
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
                                    <Label htmlFor="categoryName">Category Name</Label>
                                    <FormControl>
                                        <Input id="categoryName" placeholder="eg. Groceries, Rent" {...field} />
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
                        />}
                        {formType === 'Create' && <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>

                                </FormItem>
                            )}
                        >

                        </FormField>

                        }
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
