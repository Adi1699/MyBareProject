import React from 'react'
import { Image, StyleSheet, View, Text, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const {height, width} = Dimensions.get('window')

const popularProduct = (props) => {
    return (
        <View style={{width: width, backgroundColor: '#FCFCFC', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imgContainer}>  
                   <Image source={require('../assets/images/steelphoto.png')}
                   style={{width: 65, height: 65}}
                   />
              </View>
                 <View style={{flexDirection: 'column'}}>
                    <Text style={{fontSize: 18, marginLeft: 30}}>{props.title}</Text>                 
                    <View style={{flexDirection: 'row', marginTop: 12}}>
                        <View style={{flexDirection: 'row', marginLeft: 30}}>
                             <SvgXml xml={xml.yellowStar}/>
                             <Text>4.6</Text>
                        </View>
                        <View style={{marginLeft: 30, flexDirection: 'row'}}>
                             <Text>86</Text>
                             <Text style={{marginLeft: 5}}>Reviews</Text>
                        </View>
                        <View style={{marginLeft: 50}}>
                        <TouchableOpacity onPress={props.onPress}>
                                <SvgXml xml={xml.threeDots}/>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </View>   
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    imgContainer: {
        width: 90, 
        height: 90, 
        backgroundColor: '#EDEDED', 
        borderRadius: 18, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

export default popularProduct
