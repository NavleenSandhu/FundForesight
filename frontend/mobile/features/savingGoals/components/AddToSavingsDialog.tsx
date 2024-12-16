import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { editSavingGoal } from '@/store/savingGoals/savingGoalsSlice';
import { deleteNotification } from '@/store/notifications/notificationsSlice';

interface AddToSavingsDialogProps {
    initialAmount: number;
    notificationId: number;
}

const AddToSavingsDialogButton: React.FC<AddToSavingsDialogProps> = ({ initialAmount, notificationId }) => {
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

    const dispatch = useDispatch<AppDispatch>();
    const savingGoals = useSelector((state: RootState) => state.savingGoals.savingGoals.filter(goal => goal.status === 'ACTIVE'));
    const { profile } = useSelector((state: RootState) => state.profile);

    const [isDialogVisible, setDialogVisible] = useState(false);
    const [inputAmount, setInputAmount] = useState("0");
    const [last, setLast] = useState(false);
    const [end, setEnd] = useState(false);
    const [amount, setAmount] = useState(initialAmount);
    const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
    const [inputs, setInputs] = useState<number[]>([]);

    useEffect(() => {
        if (currentGoalIndex === savingGoals.length - 1) {
            setLast(true);
            setInputAmount(amount.toString());
        }
    }, []);

    const handleFinish = () => {
        inputs.forEach((input, index) => {
            const goal = savingGoals[index];
            const newAmount = goal.currentAmount + input;
            dispatch(editSavingGoal({
                ...goal,
                currentAmount: newAmount,
                status: newAmount >= goal.targetAmount ? 'COMPLETED' : 'ACTIVE'
            }));
        });
        dispatch(deleteNotification(notificationId));
        setDialogVisible(false);
    };

    const handleAdd = () => {
        if (isNaN(parseFloat(inputAmount))) {
            return
        }
        const inputAmountParsed = parseFloat(inputAmount)
        const remainingAmount = amount - inputAmountParsed;
        if (inputAmountParsed > 0 && remainingAmount >= 0) {
            setInputs([...inputs, inputAmountParsed]);
            if (currentGoalIndex === savingGoals.length - 2) {
                setLast(true);
                setInputAmount(remainingAmount.toString());
            } else {
                setInputAmount('0');
            }
            if (currentGoalIndex < savingGoals.length - 1) {
                setCurrentGoalIndex(currentGoalIndex + 1);
            }
            setAmount(remainingAmount);
            if (remainingAmount === 0) {
                setEnd(true);
            }
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)} >
                <Text style={styles.buttonText}>Add to Savings</Text>
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Add to Savings"
                description={end ? `${profile.currency} ${initialAmount} added to savings` : `Add from ${profile.currency} ${amount} to ${savingGoals[currentGoalIndex].goalName}`}
                propStyles={{ dialogContainer: { top: "20%", left: "11%" } }}
            >
                <ScrollView>
                    {!end && (
                        <>
                            <Text style={styles.label}>Amount</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Amount"
                                placeholderTextColor={colors.mutedForeground}
                                keyboardType="numeric"
                                value={inputAmount.toString()}
                                onChangeText={(value) => setInputAmount(value)}
                                editable={!last}
                            />
                        </>
                    )}
                </ScrollView>
                <DialogFooter func={end ? handleFinish : handleAdd}>
                    {end ? 'Finish' : 'Add'}
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default AddToSavingsDialogButton;