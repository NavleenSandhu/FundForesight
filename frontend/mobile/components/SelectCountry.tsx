import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView } from 'react-native';
import { Dialog, DialogFooter } from '@/components/Dialog';
import { Colors } from '@/constants/Colors';
import ModalSelector from 'react-native-modal-selector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { addProfile } from '@/store/profile/profileSlice';
import { countryCodes } from '@/constants/countryCodes';

const SelectCountry: React.FC = () => {
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
        label: {
            margin: 4,
            fontWeight: '600',
        },
    });

    const [isDialogVisible, setDialogVisible] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0].code);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = () => {
        dispatch(addProfile(selectedCountryCode));
        setDialogVisible(false);
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)}>
                <MaterialIcons name='public' style={styles.buttonText} />
            </TouchableOpacity>
            <Dialog
                visible={isDialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Select Country"
                description="Choose your country from the list."
                propStyles={{ dialogContainer: { top: "30%", left: "11%" } }}
            >
                <ScrollView>
                    <Text style={styles.label}>Select Country</Text>
                    <ModalSelector
                        data={countryCodes.map((code) => ({ key: code.code, label: `${code.name} (${code.code})` }))}
                        style={styles.picker}
                        onChange={(option) => setSelectedCountryCode(option.key.toString())}
                        initValue={countryCodes[0].name}
                        initValueTextStyle={{ textAlign: 'left', color: Colors.light.text }}
                        selectedKey={selectedCountryCode}
                    />
                </ScrollView>
                <DialogFooter func={handleSubmit}>
                    Save Changes
                </DialogFooter>
            </Dialog>
        </View>
    );
};

export default SelectCountry;