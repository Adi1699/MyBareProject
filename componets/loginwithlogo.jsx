import React from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';



const loginwithlogo = (props) => {
    return (
        <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity onPress={props.onPress}>
            <View style={styles.ImgContainer}>
                <Image source={require('../assets/images/rectangleBox.png')} style={{height: 60, width: 60, resizeMode: 'cover'}}/>
            </View>
            <View style={{marginLeft: 12, marginTop: 12}}>
                <SvgXml xml={props.icon} width={35} height={35}/>
            </View>
            </TouchableOpacity>
       </View>
    )
}


const styles = StyleSheet.create({
    ImgContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
});

export default loginwithlogo
