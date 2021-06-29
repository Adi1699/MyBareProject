import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';


const offerContainer = () => {
    return (
        <View style={{flexDirection: 'row'}}>
        <SvgXml xml={xml.tag} width={15} height={15} marginTop={20}/>
        <View style={{width: 250}}>
             <Text style={{marginLeft: 10, marginTop: 15, fontSize: 12}}>Bank Offer 5% unlimited Cashback on Axis Bank Credit Card</Text>
        </View>
        <View style={{alignSelf: 'center', marginLeft: 35}}>
            <TouchableOpacity>
                 <SvgXml xml={xml.rightArrow} width={12} height={12}/>
            </TouchableOpacity>
        </View>
    </View>
    )
}

export default offerContainer
