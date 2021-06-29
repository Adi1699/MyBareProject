import React from 'react';
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window')


const notificationComponent = (props) => {
    return (
        <View style={styles.mainContainer}>
            <View style={{flexDirection: 'row'}}>
              <SvgXml xml={props.icon} width={30} marginTop={30} height={25} marginLeft={5} />
              <View style={{flexDirection: 'column', marginTop: 24, marginLeft: 12}}>
                    <Text style={{fontSize: 15}}>{props.title}</Text>
                    <Text style={{color: appstyles.grayColor, marginLeft: -1}}>{props.date}</Text>
             </View> 
           </View> 
           <Image source={require('../assets/images/VectorLine.png')} style={{width: width, marginTop: 10, marginLeft: 10,}}/>
         </View>

    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        marginLeft: -8,
        marginTop: 5,
        // backgroundColor: 'red'
    },
});


export default notificationComponent
