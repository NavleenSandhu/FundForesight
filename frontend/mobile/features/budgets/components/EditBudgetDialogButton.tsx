import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { editBudget } from '@/store/budgets/budgetsSlice';

interface EditBudgetDialogButtonProps {
    budget_id: number;
}

const EditBudgetDialogButton: React.FC<EditBudgetDialogButtonProps> = ({ budget_id }) => {
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
            fontWeight: "bold",
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
    const budget = useSelector((state: RootState) => state.budgets.budgets.find(budget => budget.budget_id === budget_id));

    const [formValues, setFormValues] = useState({
        category_name: budget?.category_name || '',
        initial_amount: budget?.initial_amount.toString() || '0',
    });

    const [formErrors, setFormErrors] = useState({
        category_name: '',
        initial_amount: '',
    });

    const validateForm = () => {
        let valid = true;
        let errors = {
            category_name: '',
            initial_amount: '',
        };

        if (formValues.category_name.trim().length === 0) {
            errors.category_name = 'This field is required';
            valid = false;
        }

        if (parseFloat(formValues.initial_amount) <= 0) {
            errors.initial_amount = 'Amount has to be greater than 0';
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
            const diffInitial = parseFloat(formValues.initial_amount) - budget!.initial_amount;
            dispatch(editBudget({
                ...budget!,
                category_name: formValues.category_name,
                initial_amount: parseFloat(formValues.initial_amount),
                remaining_amount: budget!.remaining_amount + diffInitial
            }));
            setDialogVisible(false);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)} >
                <Text style={styles.buttonText}>Edit Budget</Text>
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Edit Budget"
                description="Edit your budget details."
                propStyles={{ dialogContainer: { top: "25%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Category Name</Text>
                    <TextInput
                        style={[styles.input, budget?.category_name === 'Other' && { color: Colors.light.mutedForeground }]}
                        placeholder="eg. Groceries, Rent"
                        placeholderTextColor={colors.mutedForeground}
                        value={formValues.category_name}
                        onChangeText={(value) => handleInputChange('category_name', value)}
                        editable={budget?.category_name !== 'Other'}
                    />
                    {formErrors.category_name && <Text style={styles.errorText}>{formErrors.category_name}</Text>}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor={colors.mutedForeground}
                        keyboardType="numeric"
                        value={formValues.initial_amount}
                        onChangeText={(value) => handleInputChange('initial_amount', value)}
                    />
                    {formErrors.initial_amount && <Text style={styles.errorText}>{formErrors.initial_amount}</Text>}
                </ScrollView>
                <DialogFooter func={handleFormSubmit}>
                    Edit
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default EditBudgetDialogButton;