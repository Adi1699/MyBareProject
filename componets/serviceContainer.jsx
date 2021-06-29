import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity,  } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';


const serviceContainer = (props) => {
    return (    
        <View style={styles.container}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <SvgXml xml={props.icon} marginTop={5} width={30} marginLeft={-5}/>
                    <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 12}}>
                        <Text style={{fontSize: 12}}>{props.titleTop}</Text>
                        <Text style={{fontSize: 12}}>{props.titleBottom}</Text>
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: 170,
        height: 60,
        marginTop: 15,
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
    }
});

export default serviceContainer
