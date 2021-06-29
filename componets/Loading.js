import React from 'react';

import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export function Loading({ loading }) {
    if (!loading) {
        return <View />;
    }
    return <View style={styles.overlay}>
        <View style={styles.container}>
            <ActivityIndicator color={'#192341'} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        borderRadius: 8,
    }, 
    text: {
        marginLeft: 8,
        fontSize: 14,    
        fontWeight: '500' 
    }
});