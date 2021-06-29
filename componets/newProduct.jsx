import React from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const newProduct = (props) => {
    return (
        <View style={{flex: 1, flexDirection: 'row', marginLeft: 30}}>
            <View style={styles.ImgContainer}>
                 <Image source={require('../assets/images/steelphoto.png')} style={{height: 80, width: 80, resizeMode: 'cover', flex: 1, flexDirection: 'column'}}/>
            </View>
            <View>
                <SvgXml xml={xml.newSign}/>
            </View>
            <TouchableOpacity onPress={props.onPress}>
                <View style={{flexDirection: 'column', marginLeft: 60, marginTop: 18}}>
                    <Text style={{fontWeight: 'bold'}}>{props.title}</Text>
                    <Text>{props.type}</Text>
                    <Text style={{fontWeight: 'bold'}}>₹{props.price} / kg </Text>
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

export default newProduct
