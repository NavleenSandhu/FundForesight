import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countryCodes } from '@/constants/countryCodes'
import ModalSelector from 'react-native-modal-selector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addProfile } from '@/store/profile/profileSlice';
import { addBudget } from '@/store/budgets/budgetsSlice';
import { endOfMonth, startOfMonth } from 'date-fns';
type RegisterFormInputs = {
    username: string;
    email: string;
    password: string;
    countryCode: string;
};

const minUsernameLen: number = 3;
const maxUsernameLen: number = 40;
const minPasswordLen: number = 8;

const Register = () => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

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
            borderRadius: 10,
            padding: 8,
            color: colors.text
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

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            countryCode: '',
        },
    });
    const [error, setError] = useState("");
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>()
    const handleRegister = async (data: RegisterFormInputs) => {
        setError("");
        const { email, password, username, countryCode } = data
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_GATEWAY_URL}/register`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, username })
            });
            dispatch(addProfile(countryCode))
            const now = Date.now()
            dispatch(addBudget({
                category_name: 'Other',
                initial_amount: 500,
                remaining_amount: 500,
                start_date: startOfMonth(now),
                end_date: endOfMonth(now)
            }))
            dispatch(addBudget({
                category_name: 'Groceries',
                initial_amount: 500,
                remaining_amount: 500,
                start_date: startOfMonth(now),
                end_date: endOfMonth(now)
            }))
            dispatch(addBudget({
                category_name: 'Rent',
                initial_amount: 700,
                remaining_amount: 700,
                start_date: startOfMonth(now),
                end_date: endOfMonth(now)
            }))
            if (res.status === 201) {
                router.replace("/overview");
            } else {
                const errorMessage = await res.json();
                setError(errorMessage.message);
                console.error("Error while registering");
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create an account to start managing your finances</Text>
            <View style={styles.form}>
                <Controller
                    control={control}
                    rules={{
                        required: 'Username is required',
                        minLength: {
                            value: minUsernameLen,
                            message: `Username must be at least ${minUsernameLen} characters`
                        },
                        maxLength: {
                            value: maxUsernameLen,
                            message: `Username must not be more than ${maxUsernameLen} characters`
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                            {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
                        </View>
                    )}
                    name="username"
                />
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
                <Controller
                    control={control}
                    rules={{ required: 'Country code is required' }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Country</Text>
                            <ModalSelector
                                data={countryCodes.map((country) => ({ key: country.code, label: country.name }))}
                                initValue="Select your country"
                                onChange={(option) => onChange(option.key)}
                                initValueTextStyle={{ color: colors.text }}
                                style={{ backgroundColor: colors.card }}
                                selectTextStyle={{ color: colors.text }}
                            >
                                <TextInput
                                    style={styles.input}
                                    editable={false}
                                    placeholder="Select your country"
                                    value={value}
                                />
                            </ModalSelector>
                            {errors.countryCode && <Text style={styles.errorText}>{errors.countryCode.message}</Text>}
                        </View>
                    )}
                    name="countryCode"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit(handleRegister)}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.footerText}>
                <Text>Already have an account?{" "}</Text>
                <Text style={styles.link} onPress={() => { router.replace('/login') }}>Log In</Text>
            </Text>
        </SafeAreaView>
    );
};

export default Register;