import React from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';

const addressBox = (props) => {

    const [value, onChangeText] = React.useState(''); 

    return (
        <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-around', marginBottom: 20}}>
        <View style={{flexDirection: 'row', marginTop: 10 }}>
            <CircleCheckBox 
                checked={true}
                outerColor={'#192341'}
                innerColor={'#192341'}  
                onToggle={(checked) => console.log('My state is: ', checked)}
                labelPosition={LABEL_POSITION.RIGHT}  
            />
            </View>
            <View>
                  <View style={styles.txtInput}>
                      <TextInput 
                         value={props.value}
                         onChangeText={props.onChangeText}
                         placeholder="Address"
                      />
                  </View>
            </View>

         
        <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginLeft: 10}}>
            <TouchableOpacity
                rippleCentered={true}>
                    <SvgXml xml={xml.trash} width={20} height={20} />
            </TouchableOpacity>
       </View>
    </View>
    )
}

const styles = StyleSheet.create({
    txtInput: {
        borderColor: 'gray', 
        borderWidth: 1, 
        height: 60,
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        width: Dimensions.get('window').width - 110, 
        backgroundColor: '#fff', 
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 20
   }
});

export default addressBox
