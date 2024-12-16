import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addBudget } from '@/store/budgets/budgetsSlice';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';

const CreateBudgetDialogButton = () => {
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
        },
        radioButton: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },
        radioSelected: {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: colors.primary,
        }
    });

    const [isDialogVisible, setDialogVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const [formValues, setFormValues] = useState({
        category_name: '',
        initial_amount: '0',
        month: 'Current'
    });

    const [formErrors, setFormErrors] = useState({
        category_name: '',
        initial_amount: '',
        month: ''
    });

    const validateForm = () => {
        let valid = true;
        let errors = {
            category_name: '',
            initial_amount: '',
            month: ''
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
            const now = new Date();
            const nextMonthBegin = startOfMonth(addMonths(now, 1));
            const nextMonthEnd = endOfMonth(addMonths(now, 2));
            dispatch(addBudget({
                category_name: formValues.category_name,
                initial_amount: parseFloat(formValues.initial_amount),
                remaining_amount: parseFloat(formValues.initial_amount),
                start_date: formValues.month === 'Current' ? startOfMonth(now) : nextMonthBegin,
                end_date: formValues.month === 'Current' ? endOfMonth(now) : nextMonthEnd
            }));
            setDialogVisible(false);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)} >
                <Text style={styles.buttonText}>Create Budget</Text>
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Create Budget"
                description="Create a budget for a month."
                propStyles={{ dialogContainer: { top: "25%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Category Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="eg. Groceries, Rent"
                        value={formValues.category_name}
                        onChangeText={(value) => handleInputChange('category_name', value)}
                    />
                    {formErrors.category_name && <Text style={styles.errorText}>{formErrors.category_name}</Text>}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        keyboardType="numeric"
                        value={formValues.initial_amount}
                        onChangeText={(value) => handleInputChange('initial_amount', value)}
                    />
                    {formErrors.initial_amount && <Text style={styles.errorText}>{formErrors.initial_amount}</Text>}

                    <Text style={styles.label}>Month</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {['Current', 'Next'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}
                                onPress={() => handleInputChange('month', type)}
                            >
                                <View
                                    style={styles.radioButton}
                                >
                                    {formValues.month === type && (
                                        <View
                                            style={styles.radioSelected}
                                        />
                                    )}
                                </View>
                                <Text style={{ color: colors.text }}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <DialogFooter func={handleFormSubmit}>
                    Create
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default CreateBudgetDialogButton;