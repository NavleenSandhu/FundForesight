import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppDispatch, RootState } from '@/store/store';
import { addTransaction } from '@/store/transactions/transactionsSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

const AddTransactionDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { budgets } = useSelector((state: RootState) => state.budgets);
    const addTransactionSchema = z.object({
        budgetId: z.string().transform(val => parseInt(val)).refine((val) => !!budgets.find((budget) => budget.budget_id === val), "Invalid budget"),
        amount: z.string().transform(val => parseFloat(val)).refine(val => val > 0, "Amount has to be greater than 0"),
        merchantName: z.string().trim().min(1, "This field is required"),
        transactionDate: z.string().refine((val) => !!Date.parse(val), "Invalid time format"),
        transactionType: z.string().refine((val) => val === 'EXPENSE' || val === 'INCOME', "Invalid transaction type")
    });

    type AddTransactionFormInputs = {
        budgetId: string,
        amount: number,
        merchantName: string,
        transactionDate: string,
        transactionType: 'EXPENSE' | 'INCOME',
    }

    const form = useForm<AddTransactionFormInputs>({
        resolver: zodResolver(addTransactionSchema),
        defaultValues: {
            budgetId: budgets[0].budget_id.toString(),
            amount: 0,
            merchantName: "",
            transactionDate: Date.now().toLocaleString(),
            transactionType: 'EXPENSE'
        }
    })

    const handleAddTransactionSubmit = async (data: AddTransactionFormInputs) => {
        const newTransaction = {
            budgetId: parseInt(data.budgetId),
            amount: data.amount,
            merchantName: data.merchantName,
            transactionDate: new Date(data.transactionDate),
            transactionType: data.transactionType
        }
        dispatch(addTransaction(newTransaction))
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>Enter the details for a transactions and associate it to a budget.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddTransactionSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='merchantName'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor='merchantName'>Merchant Name</Label>
                                    <FormControl>
                                        <Input id='merchantName' placeholder='eg. Amazon, Walmart' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name='amount'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor='amount'>Amount</Label>
                                    <FormControl>
                                        <Input id='amount'
                                            type='number'
                                            step={0.01}
                                            min={0}
                                            placeholder='eg. 100.00'
                                            {...field}
                                            value={field.value as number} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name='transactionDate'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor='transactionDate'>Transaction Date</Label>
                                    <FormControl>
                                        <Input id='transactionDate' type='datetime-local' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name='transactionType'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor='transactionType'>Transaction Type</Label>
                                    <FormControl>
                                        <div className="flex mx-6">
                                            <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                                            <input className="mx-2 mr-6" id="expense"
                                                type="radio"
                                                {...field}
                                                value="EXPENSE" />
                                            <Label htmlFor="income" className="ml-6 cursor-pointer">Income</Label>
                                            <input className="mx-2" id="income"
                                                type="radio"
                                                {...field}
                                                value="INCOME" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name='budgetId'
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor='budgetId'>Budget</Label>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select budget' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {budgets.map((budget) => (
                                                    <SelectItem key={budget.budget_id} value={budget.budget_id.toString()}>
                                                        {budget.category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Add</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddTransactionDialog
