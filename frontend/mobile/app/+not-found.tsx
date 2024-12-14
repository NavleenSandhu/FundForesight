import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
    return (
            <ThemedView style={styles.container}>
                <ThemedText type="title">This screen doesn't exist.</ThemedText>
                <Link href="/home" style={styles.link}>
                    <ThemedText type="link">Go to home screen!</ThemedText>
                </Link>
            </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});