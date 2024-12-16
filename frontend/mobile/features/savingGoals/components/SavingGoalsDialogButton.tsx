import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addSavingGoal, editSavingGoal } from '@/store/savingGoals/savingGoalsSlice';
import { addDays } from 'date-fns';
import { displayDate } from '@/utils/dateUtils';

interface SavingGoalsDialogButtonProps {
    formType: "Create" | "Edit";
    goalId?: number;
}

const SavingGoalsDialogButton: React.FC<SavingGoalsDialogButtonProps> = ({ formType, goalId }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const styles = StyleSheet.create({
        button: {
            padding: 10,
            backgroundColor: colors.primary,
            borderRadius: 10,
        },
        buttonText: {
            color: colors.primaryForeground,
            fontSize: 14,
            fontWeight: "600",
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
        },
        label: {
            margin: 4,
            fontWeight: '600',
        },
        errorText: {
            color: colors.destructive
        }
    });

    const [isDialogVisible, setDialogVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const savingGoal = useSelector((state: RootState) =>
        state.savingGoals.savingGoals.find((goal) => goal.goalId === goalId)
    );

    const today = new Date();
    const [formValues, setFormValues] = useState({
        goalName: formType === "Edit" ? savingGoal?.goalName || "" : "",
        targetAmount: formType === "Edit" ? savingGoal?.targetAmount.toString() || "0" : "0",
        startDate: formType === "Create" ? displayDate(today) : undefined,
        endDate: formType === "Edit" ? displayDate(new Date(savingGoal!.endDate)) || "" : displayDate(addDays(today, 30)),
    });

    const [formErrors, setFormErrors] = useState({
        goalName: '',
        targetAmount: '',
        startDate: '',
        endDate: ''
    });

    const validateForm = () => {
        let valid = true;
        let errors = {
            goalName: '',
            targetAmount: '',
            startDate: '',
            endDate: ''
        };

        if (formValues.goalName.trim().length === 0) {
            errors.goalName = 'This field is required';
            valid = false;
        }

        if (parseFloat(formValues.targetAmount) <= 0) {
            errors.targetAmount = 'Target amount must be greater than 0';
            valid = false;
        }

        if (formType === "Create" && isNaN(new Date(formValues.startDate!).getTime())) {
            errors.startDate = 'Invalid start date';
            valid = false;
        }

        if (isNaN(new Date(formValues.endDate).getTime())) {
            errors.endDate = 'Invalid end date';
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleInputChange = (name: string, value: string) => {
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleFormSubmit = () => {
        if (validateForm()) {
            if (formType === "Create") {
                const newGoal = {
                    goalName: formValues.goalName,
                    targetAmount: parseFloat(formValues.targetAmount),
                    currentAmount: 0,
                    startDate: new Date(formValues.startDate!),
                    endDate: new Date(formValues.endDate),
                    status: "ACTIVE" as const,
                };
                dispatch(addSavingGoal(newGoal));
            } else {
                const updatedGoal = {
                    ...savingGoal!,
                    goalName: formValues.goalName,
                    targetAmount: parseFloat(formValues.targetAmount),
                    endDate: new Date(formValues.endDate),
                };
                dispatch(editSavingGoal(updatedGoal));
            }
            setDialogVisible(false);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)} >
                <Text style={styles.buttonText}>{formType} Goal</Text>
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title={`${formType} Saving Goal`}
                description={formType === "Create" ? "Create a new saving goal with the details below." : "Edit the saving goal details below."}
                propStyles={{ dialogContainer: { top: "20%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Goal Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="eg. Car, House"
                        value={formValues.goalName}
                        onChangeText={(value) => handleInputChange('goalName', value)}
                    />
                    {formErrors.goalName && <Text style={styles.errorText}>{formErrors.goalName}</Text>}

                    <Text style={styles.label}>Target Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Target Amount"
                        keyboardType="numeric"
                        value={formValues.targetAmount}
                        onChangeText={(value) => handleInputChange('targetAmount', value)}
                    />
                    {formErrors.targetAmount && <Text style={styles.errorText}>{formErrors.targetAmount}</Text>}

                    {formType === "Create" && (
                        <>
                            <Text style={styles.label}>Start Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start Date"
                                value={formValues.startDate}
                                onChangeText={(value) => handleInputChange('startDate', value)}
                            />
                            {formErrors.startDate && <Text style={styles.errorText}>{formErrors.startDate}</Text>}
                        </>
                    )}

                    <Text style={styles.label}>End Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="End Date"
                        value={formValues.endDate}
                        onChangeText={(value) => handleInputChange('endDate', value)}
                    />
                    {formErrors.endDate && <Text style={styles.errorText}>{formErrors.endDate}</Text>}
                </ScrollView>
                <DialogFooter func={handleFormSubmit}>
                    {formType}
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default SavingGoalsDialogButton;