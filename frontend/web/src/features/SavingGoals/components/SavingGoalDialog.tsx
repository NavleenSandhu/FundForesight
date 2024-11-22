import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSavingGoal, editSavingGoal } from "@/store/savingGoals/savingGoalsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { z } from "zod";

interface SavingGoalDialogProps {
    formType: "Create" | "Edit";
    goalId?: number;
}

const SavingGoalDialog: React.FC<SavingGoalDialogProps> = ({ formType, goalId }) => {
    const dispatch = useDispatch<AppDispatch>();

    const createSavingGoalSchema = z.object({
        goalName: z.string().trim().min(1, "This field is required"),
        targetAmount: z.string()
            .transform((val) => parseFloat(val))
            .refine((val) => val > 0, "Target amount must be greater than 0"),
        startDate: z.string().refine((val) => !!Date.parse(val), "Invalid start date"),
        endDate: z.string().refine((val) => !!Date.parse(val), "Invalid end date"),
    });

    const editSavingGoalSchema = z.object({
        goalName: z.string().trim().min(1, "This field is required"),
        targetAmount: z.string()
            .transform((val) => parseFloat(val))
            .refine((val) => val > 0, "Target amount must be greater than 0"),
        endDate: z.string().refine((val) => !!Date.parse(val), "Invalid end date"),
    });

    const savingGoalSchema = formType === "Create" ? createSavingGoalSchema : editSavingGoalSchema;

    type SavingGoalFormInputs = {
        goalName: string;
        targetAmount: number;
        startDate?: string;
        endDate: string;
    };

    const savingGoal = useSelector((state: RootState) =>
        state.savingGoals.savingGoals.find((goal) => goal.goalId === goalId)
    );

    const defaultValues =
        formType === "Create"
            ? { goalName: "", targetAmount: 0, startDate: new Date().toISOString().split("T")[0], endDate: "" }
            : {
                goalName: savingGoal?.goalName || "",
                targetAmount: savingGoal?.targetAmount || 0,
                endDate: new Date(savingGoal!.endDate).toISOString().split("T")[0] || "",
            };

    const form = useForm<SavingGoalFormInputs>({
        resolver: zodResolver(savingGoalSchema),
        defaultValues,
    });

    const handleSubmit = async (data: SavingGoalFormInputs) => {
        if (formType === "Create") {
            const newGoal = {
                goalName: data.goalName,
                targetAmount: data.targetAmount,
                currentAmount: 0,
                startDate: new Date(data.startDate!),
                endDate: new Date(data.endDate),
                status: "ACTIVE" as const,
            };
            dispatch(addSavingGoal(newGoal));
        } else {
            const updatedGoal = {
                ...savingGoal!,
                goalName: data.goalName,
                targetAmount: data.targetAmount,
                endDate: new Date(data.endDate),
            };
            dispatch(editSavingGoal(updatedGoal));
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{formType} Saving Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>{formType} Saving Goal</DialogTitle>
                    {formType === "Create" && (
                        <DialogDescription>Create a new saving goal with the details below.</DialogDescription>
                    )}
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="goalName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Goal Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="targetAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Target Amount"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            {...field}
                                            value={field.value as number}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {formType === "Create" && (
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">{formType}</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default SavingGoalDialog;
