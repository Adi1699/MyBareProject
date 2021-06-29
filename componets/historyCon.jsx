import React from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Dimensions, Text } from 'react-native';
import { TouchableOpacity} from 'react-native-gesture-handler'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const historyCon = (props) => {
    return (
        <View style={{flexDirection: 'row', marginTop: 15, width: 300}}>

        <SvgXml xml={xml.histroyClock}/>
        <Text style={{color: '#A8A8A8', marginLeft: 10}}>{props.title}</Text>
        <View style={{flexDirection: 'row', marginLeft: 160, position: 'absolute', left: 120}}>
            <TouchableOpacity>
               <SvgXml xml={xml.closeblue} marginTop={4}/>
            </TouchableOpacity>
       </View>

    </View>
    )
}

export default historyCon
