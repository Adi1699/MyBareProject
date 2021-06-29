import React from 'react'
import { View, Dimensions, StyleSheet, Image, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import InputSpinner from "react-native-input-spinner";
import appstyles from '../styles/appstyles';


const {height, width} = Dimensions.get('window')


const Item = React.createContext();

const cartComponent = (props) => {

    //  const [noOfProducts, onAddProducts] = React.useState(0);
    return (
        <View style={{width: width, justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 15}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16}}>#{props.index}</Text>
            </View>
            <View style={styles.imgContainer}>  
                <Image source={{uri: `http://167.172.236.197:8003${props.imageURL}`}}
                // <Image source={{uri: `http://167.172.236.197:8003${itemData.item.itemImgURL}`}} style={{width: 65, height: 65}}
                style={{width: 50, height: 50}} 
                />
            </View>
            <View style={{flexDirection: 'column'}}>
                <Text style={{fontSize: 16, marginLeft: 20}}>{props.productName}</Text> 
                <Text style={{fontSize: 14, marginLeft: 20, marginTop: 3}}>Est. Price/KG  ₹{props.price}.00</Text>  
                <Text style={{fontSize: 14, marginLeft: 20, fontWeight: 'bold', marginTop: 3}}>Size: {props.size} KG</Text>  
                <Text style={{fontSize: 14, marginLeft: 20, marginTop: 3, fontWeight: 'bold'}}>Quantity(KG): {props.quantity}</Text>
                    {/* <View style={{flexDirection: 'row', flex: 1, position: 'absolute', marginTop: 75, marginLeft: 110}}>
                        <View style={{marginLeft: 80, width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={props.onRemove}
                                rippleCentered={true}>
                                    <SvgXml xml={xml.trash} width={20} height={20}/>
                            </TouchableOpacity>
                       </View>
                    </View> */}
            </View>
        </View>
            <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: width - 50}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    imgContainer: {
        width: 70, 
        height: 70, 
        backgroundColor: '#EDEDED', 
        borderRadius: 18, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: 5,
        marginLeft: 20
    }
});


export default cartComponent;
export { Item };