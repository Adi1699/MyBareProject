import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const {height, width} = Dimensions.get('window')

const iconHeader = (props) => {
    return (
        <View style={styles.headerContainer}>
           <TouchableOpacity onPress={props.onPress}>
             <SvgXml xml={xml.Arrow} width={12} height={45}/>
           </TouchableOpacity>
           <SvgXml xml={props.icon} width={props.width} height={props.height} style={styles.iconContainer}/>
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
        elevation: 10,

   },
   txtTitle: {
        marginTop: 8,
        marginLeft: 12,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#27304D'
    
    },
iconContainer: {
        marginTop: 3,
        marginLeft: 18,
        color: '#192341'
    }
});

export default iconHeader;
