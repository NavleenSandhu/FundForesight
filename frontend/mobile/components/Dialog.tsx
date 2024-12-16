import { Colors } from "@/constants/Colors";
import React, { ReactNode } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface DialogProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    description?: string;
    propStyles?: any;
}

export const Dialog: React.FC<DialogProps> = ({
    visible,
    onClose,
    children,
    title,
    description,
    propStyles,
}) => {
    const opacity = React.useRef(new Animated.Value(0)).current;

    // Animate the dialog opening and closing
    React.useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, opacity]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Overlay */}
            <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
                <Animated.View style={[styles.overlay, { opacity }]} />
            </TouchableOpacity>

            {/* Dialog Content */}
            <Animated.View
                style={[
                    styles.dialogContainer,
                    {
                        opacity,
                        transform: [
                            {
                                scale: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.9, 1],
                                }),
                            },
                        ],
                    },
                    propStyles.dialogContainer
                ]}
            >
                {title && <Text style={styles.title}>{title}</Text>}
                {description && <Text style={styles.description}>{description}</Text>}
                <View style={styles.childrenContainer}>{children}</View>
            </Animated.View>
        </Modal>
    );
};

export const DialogHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
    <View style={styles.header}>
        <Text style={styles.headerText}>{children}</Text>
    </View>
);

export const DialogFooter: React.FC<{ children: ReactNode, func: ()=> void }> = ({ children, func }) => (
    <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={func} >
            <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 1,
    },
    dialogContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        zIndex: 2,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 15,
    },
    childrenContainer: {
        marginVertical: 10,
    },
    closeButton: {
        marginTop: 15,
        alignSelf: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
    },
    closeButtonText: {
        fontSize: 16,
        color: "#333",
    },
    header: {
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        padding: 10,
        backgroundColor: Colors.light.primary,
        borderRadius: 10,
    },
    buttonText: {
        color: Colors.light.primaryForeground,
        fontSize: 14,
        fontWeight: "bold",
    },
});
