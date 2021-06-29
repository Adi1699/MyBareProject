import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

import xml from '../componets/svgxml';


const {height, width} = Dimensions.get('window')


const header = (props) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={props.onPress}>
                 <SvgXml xml={xml.Arrow} width={12} height={45}/>
           </TouchableOpacity>
           <Text style={styles.txtTitle}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: width,
        height: 50,
        // marginTop: 32,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        paddingLeft: 20,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 6,
        },
    txtTitle: {
        marginTop: 8,
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#27304D'
        },

});

export default header
