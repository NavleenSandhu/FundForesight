import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

const BalanceCard = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme || 'light'];

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 10,
            padding: 20,
            overflow: 'hidden',
        },
        totalBalanceText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.card,
            marginBottom: 10,
        },
        balanceText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 20,
        },
        row: {
            flexDirection: 'row',
        },
        moneyContainer: {
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 10,
            marginHorizontal: 40,
            padding: 10,
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainerText: {
            fontSize: 16,
            color: colors.primary,
            marginRight: 5,
        },
        incomeAmount: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#4caf50',
            marginTop: 5,
        },
        expenseAmount: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#f44336',
            marginTop: 5,
        },
        skeletonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        skeletonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        skeleton: {
            width: '48%',
            height: 20,
            borderRadius: 4,
        },
        skeletonItem: {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(171, 184, 211, 0.15)',
            borderRadius: 4,
        },
    });

    const { total30DayExpense, total30DayIncome, balance } = useSelector((state: RootState) => state.transactions);
    const { profile } = useSelector((state: RootState) => state.profile);


    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(109, 128, 254, 1)', 'rgba(35, 210, 253, 1)']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {balance > 0 && (
                    <>
                        <Text style={styles.totalBalanceText}>Total Balance</Text>
                        <Text style={styles.balanceText}>
                            {profile.currency} {balance}
                        </Text>
                    </>
                )}
                <View style={styles.row}>
                    <View style={styles.moneyContainer}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconContainerText}>Income</Text>
                            <MaterialIcons name="trending-up" size={24} color={colors.mutedForeground} />
                        </View>
                        <Text style={styles.incomeAmount}>{profile.currency} {total30DayIncome.toFixed(2)}</Text>
                    </View>
                    <View style={styles.moneyContainer}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconContainerText}>Expense</Text>
                            <MaterialIcons name="trending-down" size={24} color={colors.mutedForeground} />
                        </View>
                        <Text style={styles.expenseAmount}>{profile.currency} {total30DayExpense.toFixed(2)}</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};


export default BalanceCard