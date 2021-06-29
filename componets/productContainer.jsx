import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'

const productContainer = (props) => {
    // console.log(props.imageUrl)
    return (
        <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 35}}>
            <TouchableOpacity onPress={props.onPress}>
                {/* <Image source={{uri: `http://167.172.236.197:8003${props.imageUrl}`}} width={30} height={30}/> */}
                <Image source={require('../assets/images/steelphoto.png')}/>
           </TouchableOpacity>
           <Text style={{marginTop: 10, marginBottom: 10}}>{props.title}</Text>     
        </View>    

    )
}

export default productContainer
