import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addTransaction } from '@/store/transactions/transactionsSlice';

const AddTransactionDialogButton = () => {
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
        picker: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            marginBottom: 10,
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
    })
    const [isDialogVisible, setDialogVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const { budgets } = useSelector((state: RootState) => state.budgets)

    const [formValues, setFormValues] = useState<{
        budgetId: string;
        amount: string;
        merchantName: string;
        transactionDate: string;
        transactionType: 'EXPENSE' | 'INCOME';
    }>({
        budgetId: budgets[0].budget_id.toString(),
        amount: '0',
        merchantName: '',
        transactionDate: new Date().toISOString().slice(0, 16),
        transactionType: 'EXPENSE'
    });

    const [formErrors, setFormErrors] = useState({
        budgetId: '',
        amount: '',
        merchantName: '',
        transactionDate: '',
        transactionType: ''
    });

    const validateForm = () => {
        let valid = true;
        let errors = {
            budgetId: '',
            amount: '',
            merchantName: '',
            transactionDate: '',
            transactionType: ''
        };

        if (!budgets.find(budget => budget.budget_id === parseInt(formValues.budgetId))) {
            errors.budgetId = 'Invalid budget';
            valid = false;
        }

        if (parseFloat(formValues.amount) <= 0) {
            errors.amount = 'Amount has to be greater than 0';
            valid = false;
        }

        if (formValues.merchantName.trim().length === 0) {
            errors.merchantName = 'This field is required';
            valid = false;
        }

        if (isNaN(new Date(formValues.transactionDate).getTime())) {
            errors.transactionDate = 'Invalid time format';
            valid = false;
        }

        if (formValues.transactionType !== 'EXPENSE' && formValues.transactionType !== 'INCOME') {
            errors.transactionType = 'Invalid transaction type';
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
            const newTransaction = {
                budgetId: parseInt(formValues.budgetId),
                amount: parseFloat(formValues.amount),
                merchantName: formValues.merchantName,
                transactionDate: new Date(formValues.transactionDate),
                transactionType: formValues.transactionType
            };
            dispatch(addTransaction(newTransaction));
            setDialogVisible(false);
        }
    };


    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)} ><Text style={styles.buttonText}>Add Transaction</Text></TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Add Transaction"
                description="Enter the details for a transactions and associate it to a budget."
                propStyles={{ dialogContainer: { top: "20%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Merchant Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="eg. Walmart, Amazon"
                        placeholderTextColor={colors.mutedForeground}
                        value={formValues.merchantName}
                        onChangeText={(value) => handleInputChange('merchantName', value)}
                    />
                    {formErrors.merchantName && <Text style={styles.errorText}>{formErrors.merchantName}</Text>}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor={colors.mutedForeground}
                        keyboardType="numeric"
                        value={formValues.amount}
                        onChangeText={(value) => handleInputChange('amount', value)}
                    />
                    {formErrors.amount && <Text style={styles.errorText}>{formErrors.amount}</Text>}

                    <Text style={styles.label}>Transaction Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Transaction Date"
                        placeholderTextColor={colors.mutedForeground}
                        value={formValues.transactionDate}
                        onChangeText={(value) => handleInputChange('transactionDate', value)}
                    />
                    {formErrors.transactionDate && <Text style={styles.errorText}>{formErrors.transactionDate}</Text>}

                    <Text style={styles.label}>Transaction Type</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {['EXPENSE', 'INCOME'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 10 }}
                                onPress={() => handleInputChange('transactionType', type)}
                            >
                                <View
                                    style={styles.radioButton}
                                >
                                    {formValues.transactionType === type && (
                                        <View
                                            style={styles.radioSelected}
                                        />
                                    )}
                                </View>
                                <Text>{type.charAt(0) + type.slice(1).toLowerCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {formErrors.transactionType && <Text style={styles.errorText}>{formErrors.transactionType}</Text>}

                    <Text style={styles.label}>Budget</Text>
                    <ModalSelector
                        data={budgets.map((budget) => ({ key: budget.budget_id, label: budget.category_name }))}
                        style={styles.picker}
                        onChange={(option) => handleInputChange('budgetId', option.key.toString())}
                        initValue={budgets.find((budget) => budget.budget_id === parseInt(formValues.budgetId))?.category_name}
                        initValueTextStyle={{ textAlign: 'left', color: Colors.light.text }}
                        selectedKey={formValues.budgetId}
                    />
                    {formErrors.budgetId && <Text style={styles.errorText}>{formErrors.budgetId}</Text>}
                </ScrollView>
                <DialogFooter func={handleFormSubmit}>
                    Add
                </DialogFooter>
            </Dialog>
        </View>
    )
}

export default AddTransactionDialogButton