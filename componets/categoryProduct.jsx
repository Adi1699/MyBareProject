import React from 'react'
import { Image, View, Text, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const categoryProduct = (props) => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={{overflow: 'hidden'}}>
             <TouchableCmp onPress={props.onViewDetails} useForeground>
                 <View>
                    <View style={{flexDirection: 'row', marginTop: 30, justifyContent: 'center', marginLeft: 30}}>
                        <Image source={ {uri: props.image} } width={30} height={30}/>
                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                            <Text>{props.title}</Text>
                            <Text>₹{props.price}</Text>
                        </View>

                        <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginRight: 30}}>
                            <TouchableOpacity onPress={props.onAddToCart}>
                                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <SvgXml xml={xml.blueplus}/>
                                    <Text>Add to Cart</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>    
                        <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: 330}}/>
                    </View>  
                </View> 
            </TouchableCmp>
        </View>
    )
}

export default categoryProduct
