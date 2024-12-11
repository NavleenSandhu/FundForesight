import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editBudget } from '@/store/budgets/budgetsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from "zod"

interface EditBudgetDialogProps {
    budget_id: number
}

const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({ budget_id }) => {
    const dispatch = useDispatch<AppDispatch>();
    const editBudgetSchema = z.object({
        category_name: z.string().trim().min(1, 'This field is required'),
        initial_amount: z.string()
            .transform(val => parseFloat(val))
            .refine(val => val > 0, 'Amount has to be greater than 0'),
    });
    type EditBudgetFormInputs = {
        category_name: string,
        initial_amount: number,
    }
    const budget = useSelector((state: RootState) => state.budgets.budgets.find(budget => budget.budget_id === budget_id))
    const form = useForm<EditBudgetFormInputs>({
        resolver: zodResolver(editBudgetSchema),
        defaultValues: {
            category_name: budget?.category_name || "",
            initial_amount: budget?.initial_amount || 0,
        }
    });

    const handleBudgetEditSubmit = async (data: EditBudgetFormInputs) => {
        const diffInitial = data.initial_amount - budget!.initial_amount
        dispatch(editBudget({
            ...budget!,
            ...{
                category_name: data.category_name,
                initial_amount: data.initial_amount,
                remaining_amount: budget!.remaining_amount + diffInitial
            }
        }))
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Edit budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>Edit budget</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleBudgetEditSubmit)} className="space-y-6">
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
                                    <Label htmlFor="amount">Amount Limit</Label>
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Edit</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}

export default EditBudgetDialog
