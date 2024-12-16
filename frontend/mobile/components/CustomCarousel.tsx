import { Colors } from "@/constants/Colors";
import { Budget } from "@/models/Budget";
import { RootState } from "@/store/store";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from 'expo-router';
const { width: screenWidth } = Dimensions.get("window");



interface CustomCarouselProps {
    data: Budget[];
    itemWidth?: number;
    inactiveSlideScale?: number;
    inactiveSlideOpacity?: number;
    onSnapToItem?: (index: number) => void;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
    data,
    itemWidth = screenWidth * 0.83,
    inactiveSlideScale = 0.9,
    inactiveSlideOpacity = 0.5,
    onSnapToItem,
}) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = StyleSheet.create({
        carouselContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        carouselItem: {
            flexDirection: "column",
            alignItems: "center",
        },
        card: {
            borderRadius: 15,
            backgroundColor: colors.card,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        title: {
            textAlign: "center",
            marginVertical: 10,
            fontSize: 20,
            fontWeight: "bold",
            color: colors.text,
        },
        budgetInfo: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 10,
        },
        currencies: {
            color: colors.text,
        },
        date: {
            color: colors.mutedForeground,
        },
        pagination: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 15,
        },
        dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeDot: {
            backgroundColor: colors.primary,
        },
        inactiveDot: {
            backgroundColor: colors.card,
        },
        button: {
            padding: 8,
            backgroundColor: colors.primary,
            borderRadius: 10,
        },
        buttonText: {
            color: colors.primaryForeground,
            fontSize: 14,
            fontWeight: "bold",
        },
    });
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { profile } = useSelector((state: RootState) => state.profile);

    const handleSnapToItem = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
        setCurrentIndex(index);
        onSnapToItem?.(index);
    };

    return (
        <View style={styles.carouselContainer}>
            <Animated.FlatList
                data={data}
                keyExtractor={(item) => item.budget_id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={itemWidth}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={{ alignItems: "center" }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                onMomentumScrollEnd={handleSnapToItem}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 1) * itemWidth,
                        index * itemWidth,
                        (index + 1) * itemWidth,
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [inactiveSlideScale, 1, inactiveSlideScale],
                        extrapolate: "clamp",
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [inactiveSlideOpacity, 1, inactiveSlideOpacity],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    width: itemWidth,
                                    transform: [{ scale }],
                                    opacity,
                                },
                            ]}
                        >
                            <View style={styles.carouselItem}>
                                <Text style={styles.title}>{item.category_name}</Text>
                                <View style={styles.budgetInfo}>
                                    <Text style={styles.currencies} >
                                        <Text style={{ fontWeight: "bold" }}>
                                            {profile.currency} {item.remaining_amount}
                                        </Text>
                                        <Text>
                                            /{item.initial_amount}
                                        </Text>
                                    </Text>
                                    <Text style={styles.date}>Ends on {new Date(item.end_date).toLocaleDateString()}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => router.push(`/budgets/${item.budget_id}`)} style={styles.button}><Text style={styles.buttonText}>View</Text></TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    );
                }}
            />
            <View style={styles.pagination}>
                {data.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};


export default CustomCarousel;
