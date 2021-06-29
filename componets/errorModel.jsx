import React from 'react'
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import appstyles from '../styles/appstyles';
import Ripple from 'react-native-material-ripple';
import { TouchableRipple } from 'react-native-paper';


const errorModel = () => {
    const [isModelVisible, setModelVisiable] = React.useState(false);

    const toggleModel = () => {
        setModelVisiable(!isModelVisible);
    }

    return (
        <View style={{marginTop: 50, alignItems: 'center'}}>
            <Button title="Show Model" onPress={toggleModel}/>
            <Modal isVisible={isModelVisible}>
                <View style={{backgroundColor: '#FEFEFE', width: 260, height: 350, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}}>
                    
                    <View style={{alignSelf: 'flex-end', marginRight: 20}}>
                      <TouchableOpacity onPress={toggleModel}>
                        <SvgXml xml={xml.cross}/>
                      </TouchableOpacity>
                    </View>

                    <SvgXml xml={xml.breakConnection}/>
                    <Text style={{color: appstyles.primaryColor, fontSize: 20, marginTop: 15}}>Ooppsss....</Text>
                    <Text style={{fontSize: 16, marginTop: 30}}>Connection lost !!..</Text>
                    <Text style={{color: '#6C6C6C'}}>Please check your internet connection</Text>
                    
                    <View style={{marginTop: 20}}>
                    <TouchableRipple title="Hide Model" onPress={() => {}} rippleCentered={true}>
                        <View style={{width: 100, height: 40, backgroundColor: appstyles.primaryColor, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}>
                           <Text style={{color: appstyles.white, fontSize: 18}}>Retry</Text>
                        </View>
                    </TouchableRipple>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({});

export default errorModel
