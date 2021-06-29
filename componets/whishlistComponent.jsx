import React from 'react'
import { SvgXml } from 'react-native-svg';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import xml from './svgxml';
import { Checkbox } from 'react-native-paper';

const {height, width} = Dimensions.get('window')

const whishlistComponent = (props) => {
    const [checked, setChecked] = React.useState(false);

    return (
        <View style={styles.mainContainer}>
        <View style={{flexDirection: 'row'}}>
            <View style={styles.checkBoxContainer}>
                <Checkbox 
                    color="#192341"
                    uncheckedColor="#A9A9A9"
                    status={props.checked}
                    onPress={props.onCheck} 
                />
            </View>  

            <View style={{flexDirection: 'column', marginTop: 24, marginLeft: 45}}>
                    <Text style={{fontSize: 15}}>{props.title}</Text>
            </View>
            
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 30}}>
                <TouchableOpacity 
                    onPress={props.onPress}>         
                    <SvgXml xml={xml.rightArrow}  marginTop={26} width={18} height={18}/> 
                </TouchableOpacity>
            </View>
       </View> 
       <Image source={require('../assets/images/VectorLine.png')} style={{width: width, marginTop: 10, marginLeft: 15}}/>
     </View>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        marginLeft: -8,
        marginTop: 5,
        width: width,
        // backgroundColor: 'red'
    },
    checkBoxContainer: {
        marginTop: 18,
        position: 'absolute',
        left: 8,
    }
});

export default whishlistComponent
