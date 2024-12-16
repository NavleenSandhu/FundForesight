import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme, } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/Colors';
import CustomCarousel from '@/components/CustomCarousel';


const BudgetsOverview = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme || 'light'];


    const styles = StyleSheet.create({
        container: {
            padding: 16,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: colors.card,
            borderColor: colors.border,
            margin: 15,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 16,
            color: colors.primary
        },
        noBudgetsText: {
            textAlign: 'center',
            fontSize: 16,
        },
        createBudgetLink: {
            fontWeight: 'bold',
        },
    });

    const { budgets, loading } = useSelector((state: RootState) => state.budgets);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budgets</Text>
            {loading && budgets.length === 0 ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : !loading && budgets.length === 0 ? (
                <Text style={styles.noBudgetsText}>
                    No budgets created.{" "}

                </Text>
            ) : (
                <CustomCarousel
                    data={budgets}
                />
            )}
        </View>
    );
};


export default BudgetsOverview;