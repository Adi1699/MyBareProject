import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';

const cardContainer = (props) => {
    return (
        <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'space-around'}}>
                <View style={{flexDirection: 'row', marginTop: 12 }}>
                    <CircleCheckBox 
                        checked={true}
                        outerColor={'#192341'}
                        innerColor={'#192341'}    
                        onToggle={(checked) => console.log('My state is: ', checked)}
                        labelPosition={LABEL_POSITION.RIGHT}  
                    />
                </View>

                <View style={styles.cardBox}>
                    <Text style={{marginTop: 12, fontSize: 16}}>{props.title}</Text>
                </View>

        </View>
        <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20}}/>
    </View>
    )
}

const styles = StyleSheet.create({
    cardBox: {
        width: 280,
        height: 50,
        backgroundColor: '#fff',
        marginLeft: 20,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        paddingLeft: 20,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 6,
    }
});



export default cardContainer
