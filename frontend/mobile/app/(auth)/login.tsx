import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginFormInputs = {
    email: string;
    password: string;
};

const minPasswordLen: number = 8;

const Login = () => {
    const colorScheme = useColorScheme()
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            color: colors.text
        },
        subtitle: {
            textAlign: 'center',
            marginVertical: 8,
            color: colors.text
        },
        form: {
            width: '100%',
            maxWidth: 400,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            marginBottom: 4,
            fontWeight: '600',
            color: colors.text
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            color: colors.cardForeground,
            borderRadius: 10,
            padding: 8,
        },
        button: {
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 10,
            alignItems: 'center',
        },
        buttonText: {
            color: colors.primaryForeground,
            fontWeight: 'bold',
        },
        errorText: {
            color: colors.destructive,
            marginTop: 4,
        },
        footerText: {
            textAlign: 'center',
            marginTop: 16,
            color: colors.text
        },
        link: {
            color: colors.primary,
            fontWeight: 'bold',
            fontSize: 16,
        },
        dividerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 16,
        },
        divider: {
            flex: 1,
            height: 1,
            backgroundColor: '#ccc',
        },
        dividerText: {
            marginHorizontal: 8,
        },
        googleButton: {
            backgroundColor: '#fff',
            borderColor: '#ccc',
            borderWidth: 1,
        },
    });

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const [error, setError] = useState("");
    const router = useRouter()
    const handleLogin = async (data: LoginFormInputs) => {
        setError("");
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_GATEWAY_URL}/login`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (res.status === 200) {
                const cookies = res.headers.get('set-cookie')
                AsyncStorage.setItem('token', cookies?.split(';')[0] || '')
                router.replace("/overview");
            } else {
                const errorMessage = await res.json();
                setError(errorMessage.message);
                console.error("Error while Login");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Enter your email and password below to login</Text>
            <View style={styles.form}>
                <Controller
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: 'Invalid email address'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                        </View>
                    )}
                    name="email"
                />
                <Controller
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: minPasswordLen,
                            message: `Password must be at least ${minPasswordLen} characters`
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                        </View>
                    )}
                    name="password"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit(handleLogin)}>
                        <Text style={styles.buttonText}>Sign In with Email</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.footerText}>
                <Text>Don’t have an account?{" "}</Text>
                <Text style={styles.link} onPress={() => { router.replace('/register') }}>Sign up</Text>
            </Text>
        </SafeAreaView >
    );
};

export default Login;