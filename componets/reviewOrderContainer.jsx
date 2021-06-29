import React from 'react'
import { View, Text, Image } from 'react-native'

const reviewOrderContainer = (props) => {
    return (
        <View style={{marginLeft: 50, alignItems: 'center'}}>
        <View style={{width: 60, height: 60, backgroundColor: '#F6F6F6', borderRadius: 10, flexDirection: 'row', justifyContent: 'center'}}>
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

export default reviewOrderContainer
