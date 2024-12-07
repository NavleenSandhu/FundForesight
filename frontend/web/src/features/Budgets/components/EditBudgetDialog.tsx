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
    });
    type EditBudgetFormInputs = {
        category_name: string,
    }
    const budget = useSelector((state: RootState) => state.budgets.budgets.find(budget => budget.budget_id === budget_id))
    const form = useForm<EditBudgetFormInputs>({
        resolver: zodResolver(editBudgetSchema),
        defaultValues: { category_name: budget?.category_name || "" }
    });

    const handleBudgetEditSubmit = async (data: EditBudgetFormInputs) => {
        dispatch(editBudget({
            ...budget!,
            ...{
                category_name: data.category_name
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
