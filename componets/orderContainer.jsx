import React from 'react'
import { Image, View, Text } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"
import appstyles from '../styles/appstyles';
import { TouchableOpacity } from 'react-native-gesture-handler';


const orderContainer = (props) => {
    return (
        <View style={{alignItems: 'center', height: 120, marginTop: 10, width: 110}}>
            <View style={{position: 'absolute', zIndex: 1, left: 75, top: -6}}>
                <TouchableOpacity onPress={props.onPress}>
                   <Icon name="remove-circle-sharp" size={20} color={appstyles.primaryColor}/>
                </TouchableOpacity>
            </View>
            <View style={{width: 60, height: 60, backgroundColor: '#F6F6F6', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image  source={require('../assets/images/steelphoto.png')} style={{width: 45, height: 45}}/>
                </View>
            </View>
            <View style={{marginTop: 10}}>
                <Text>{props.title}</Text>
            </View>
        </View>
    )
}

export default orderContainer
