import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
function TransactionListItemSkeleton() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>

                {/* Merchant Name Skeleton */}
                <View style={styles.merchantNameSkeleton}>
                    <SkeletonPlaceholder.Item height={20} width="100%" borderRadius={4} />
                </View>

                {/* Transaction Amount Skeleton */}
                <View style={styles.transactionAmountSkeleton}>
                    <SkeletonPlaceholder.Item height={25} width="100%" borderRadius={4} />
                </View>

            </View>
            {/* Transaction Date Skeleton */}
            <View style={styles.transactionDateSkeleton}>
                <SkeletonPlaceholder.Item height={20} width="100%" borderRadius={4} />
            </View>
        </View>
    );
}

const styles = {
    container: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        margin: 10,
        marginHorizontal: 20,
    },
    row: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },
    merchantNameSkeleton: {
        flex: 1,
        marginRight: 10,
    },
    transactionAmountSkeleton: {
        flex: 1,
        marginLeft: 10,
    },
    transactionDateSkeleton: {
        marginTop: 10,
    },
};

export default TransactionListItemSkeleton;