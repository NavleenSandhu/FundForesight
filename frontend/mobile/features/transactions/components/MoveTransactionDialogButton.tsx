import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import ModalSelector from 'react-native-modal-selector';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { updateTransaction } from '@/store/transactions/transactionsSlice';
import { editBudget } from '@/store/budgets/budgetsSlice';
import { Transaction } from '@/models/Transaction';
import { MaterialIcons } from '@expo/vector-icons';

interface MoveTransactionDialogButtonProps {
    transaction: Transaction;
}

const MoveTransactionDialogButton: React.FC<MoveTransactionDialogButtonProps> = ({ transaction }) => {
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
        picker: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            marginBottom: 10,
        },
        errorText: {
            color: colors.destructive
        },
        label: {
            margin: 4,
            fontWeight: '600',
        },
    });

    const [isDialogVisible, setDialogVisible] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(transaction.budgetId.toString());
    const dispatch = useDispatch<AppDispatch>();
    const { budgets } = useSelector((state: RootState) => state.budgets);

    const updateBudgetId = () => {
        const previousBudgetId = transaction.budgetId;
        const newBudgetId = parseInt(selectedBudget);
        const updatedTransaction: Transaction = { ...transaction, budgetId: newBudgetId };
        dispatch(updateTransaction(updatedTransaction));
        const transactionAmount = transaction.transactionType === 'EXPENSE' ? transaction.amount : -transaction.amount;

        const prevBudget = budgets.find(budget => budget.budget_id === previousBudgetId)!;
        dispatch(editBudget({ ...prevBudget, remaining_amount: prevBudget.remaining_amount + transactionAmount }));

        const newBudget = budgets.find(budget => budget.budget_id === newBudgetId)!;
        dispatch(editBudget({ ...newBudget, remaining_amount: newBudget.remaining_amount - transactionAmount }));

        setDialogVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)}>
                <MaterialIcons name='repeat' style={styles.buttonText}/>
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Move Transaction"
                description="Assign this transaction to a different budget."
                propStyles={{ dialogContainer: { top: "30%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Select Budget</Text>
                    <ModalSelector
                        data={budgets.filter(budget => budget.budget_id !== transaction.budgetId).map((budget) => ({ key: budget.budget_id, label: budget.category_name }))}
                        style={styles.picker}
                        onChange={(option) => setSelectedBudget(option.key.toString())}
                        initValue={budgets.find((budget) => budget.budget_id === transaction.budgetId)?.category_name}
                        initValueTextStyle={{ textAlign: 'left', color: Colors.light.text }}
                        selectedKey={selectedBudget}
                    />
                </ScrollView>
                <DialogFooter func={updateBudgetId}>
                    Save Changes
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default MoveTransactionDialogButton;