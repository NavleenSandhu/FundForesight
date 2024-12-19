import React from 'react';
import { View, Text, StyleSheet, useColorScheme, } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/Colors';
import CustomCarousel from '@/components/CustomCarousel';
import { ThemedText } from '@/components/ThemedText';


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
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
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
            marginVertical: 10,
        }
    });

    const { budgets } = useSelector((state: RootState) => state.budgets);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budgets</Text>
            {
                budgets.length === 0 ? (
                    <ThemedText style={styles.noBudgetsText} type='subtitle'>
                        No budgets created.
                    </ThemedText>
                ) : (
                    <CustomCarousel
                        data={budgets}
                    />
                )}
        </View>
    );
};


export default BudgetsOverview;