import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'react-native-svg';
import appstyles from '../styles/appstyles';

const popularContainer = (props) => {
    return (
        <View style={{marginBottom: 10}}>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', }}><Text style={{fontWeight: 'bold', alignSelf: 'center'}}>{props.title}</Text></View> 
                <TouchableOpacity onPress={props.onPressFirst}>  
                    <View style={styles.squareBox}>
                        <Image source={props.imagefirst} style={{width: 60, height: 60}}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onPressSecond}>
                    <View style={styles.squareBox}>
                        <Image source={props.imageSecond} style={{width: 55, height: 55}}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onPressThird}>
                    <View style={styles.squareBox}>
                        <Image source={props.imageThird} style={{width: 55, height: 55}}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onPressFourth}>
                    <View style={styles.squareBox}>
                        <Image source={props.imageForth} style={{width: 55, height: 56}}/>
                    </View>    
                </TouchableOpacity>
            </View>
            <Image source={require('../assets/images/products/boxLine.png')} style={{marginBottom: 8, marginLeft: 32, width: 135}}/>

            <View style={styles.roundContainer}>
               <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 12, marginTop: 1, fontSize: 10, color: '#939393'}}>5 mm Bar</Text>
                </View>   
                <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 9, marginTop: 1, fontSize: 10,  color: '#939393'}}>12 mm Bar</Text>
                </View>    
                <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 9, marginTop: 1, fontSize: 10,  color: '#939393'}}>18 mm Bar</Text>
                </View>   
                <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 9, marginTop: 1, fontSize: 10,  color: '#939393'}}>10 mm Bar</Text>
                </View>   
                <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 9, marginTop: 1, fontSize: 10,  color: '#939393'}}>15 mm Bar</Text>
                </View>   
                <View style={{width: 70, height: 20, borderWidth: 1, borderRadius: 15}}>
                    <Text style={{marginLeft: 9, marginTop: 1, fontSize: 10,  color: '#939393'}}>Thin wire</Text>
                </View>   
            </View>    

            <TouchableOpacity>
                 <View style={{width: 90, height: 30, borderWidth: 1.25, borderRadius: 5, marginLeft: 55, marginTop: 10}}><Text style={{marginLeft: 11, marginTop: 3, color: appstyles.primaryColor}}>view more</Text></View>
            </TouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: 160,
        height: 180,
        // backgroundColor: 'red',
        marginTop: 10,
        marginLeft: 20,
    },
    roundContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: 160,
        height: 79,
        justifyContent: 'space-evenly',
        // backgroundColor: 'red',
        alignContent: 'space-around',
        marginLeft: 15,
    },
    squareBox: {
        width: 65,
        height: 65,
        borderWidth: 4,
        marginTop: 10,
        borderColor: appstyles.white,
    }
});

export default popularContainer
