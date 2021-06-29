import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import Ripple from 'react-native-material-ripple';
import { AuthContext } from '../componets/context';
import { TouchableRipple } from 'react-native-paper';
import Modal from 'react-native-modal';

const {height, width} = Dimensions.get('window')

const menuOverlayScreen = (props) => {

    const { 
        auth: {logout},
        user
    } = React.useContext(AuthContext);

    const [isModelVisible, setModelVisiable] = React.useState(false);

    const toggleModel = () => {
        setModelVisiable(!isModelVisible);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={{ flex: 1}}>
                <LinearGradient
                        colors={['#808080', '#FFFFFF']}
                        style={styles.linearGradient}>
                            <View style={{flexDirection: 'row' }}>
                                <View style={{flexDirection: 'column', marginLeft: -120}}>
                                        {/* <Text style={{fontSize: 20, marginTop: 70, color: appstyles.primaryColor}}>{user.data.first_name} {user.data.last_name}</Text> */}
                                        {/* <Text style={{fontSize: 18, marginTop: 10, color: '#7F7F7F'}}>{user.data.email}</Text> */}
                                </View>
                            </View>

                    </LinearGradient>    

            
                <View style={styles.componentContainer}>
                        <Text style={{fontSize: 20, color: '#7F7F7F', marginLeft: 28}}>General</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                onPress={() => props.navigation.navigate("EditProfile")}>
                                <Text style={{fontSize: 20,marginTop: 18, marginLeft: 30, color: appstyles.primaryColor}}>Edit Profile</Text>
                                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 45 }}>
                                   <SvgXml xml={xml.ProfileIcon} width={20} height={20} marginTop={20}/>
                                </View>
                                </Ripple>   
                        </View>

                        <SvgXml xml={xml.line} width={10} height={2} />
                        
                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                    onPress={() => props.navigation.navigate("MyOrder")}>
                                    <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>My Orders</Text>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 40}}>
                                        <SvgXml xml={xml.orderBag} width={30} height={30} marginTop={10} />
                                    </View>
                                </Ripple>
                        </View>
                        
                        <SvgXml xml={xml.line} width={10} height={2}/>

                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                        onPress={() => props.navigation.navigate("WhishList")}>
                                        <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>Wishlist</Text>
                                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 45}}>
                                        <SvgXml xml={xml.wishlist} width={20} height={20} marginTop={16} />
                                        </View>
                                </Ripple>
                        </View>


                </View>

                <View style={styles.componentContainerTwo}>
                        <Text style={{fontSize: 20, color: '#7F7F7F', marginLeft: 28}}>Legal</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                onPress={() => props.navigation.navigate("Payment")}>
                                <Text style={{fontSize: 20, marginLeft: 30, marginTop: 14, color: appstyles.primaryColor}}>Payment Details</Text>
                                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 45}}>    
                                <SvgXml xml={xml.payment} width={25} height={25} marginTop={20} marginLeft={120}/>
                                </View>
                                </Ripple>   
                        </View>

                        <SvgXml xml={xml.line} width={10} height={2}/>
                        
                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                    onPress={() => props.navigation.navigate("Terms")}>
                                    <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>Terms & Conditions</Text>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 40}}>
                                    <SvgXml xml={xml.terms} width={30} height={30} marginTop={10} marginLeft={90}/>
                                    </View>
                                </Ripple>
                        </View>
                        
                        <SvgXml xml={xml.line} width={10} height={2}/>               
                </View>

                <View style={styles.componentContainerTwo}>
                        <Text style={{fontSize: 20, color: '#7F7F7F', marginLeft: 28}}>Personal</Text>                    
                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                    onPress={() => props.navigation.navigate("Shipping")}>
                                    <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>Shipping Address</Text>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 45}}>
                                     <SvgXml xml={xml.ProfileIcon} width={25} height={25} marginTop={14} marginLeft={115}/>
                                    </View>
                                </Ripple>
                        </View>
                        
                        <SvgXml xml={xml.line} width={10} height={2}/>

                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                    onPress={() => props.navigation.navigate("FeedBack")}>
                                    <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>Help & FeedBack</Text>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 45}}>
                                     <SvgXml xml={xml.help} width={25} height={25} marginTop={14} marginLeft={115}/>
                                    </View>
                                </Ripple>
                        </View>
                        
                        <SvgXml xml={xml.line} width={10} height={2}/>

                        <View  style={{flexDirection: 'row'}}>
                                <Ripple style={{width: width, height: 55, backgroundColor: appstyles.white, flexDirection: 'row'}}
                                    onPress={toggleModel}>                
                                    <Text style={{fontSize: 20, marginLeft: 30, marginTop: 12, color: appstyles.primaryColor}}>Logout</Text>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 44}}>
                                    <SvgXml xml={xml.logout} width={22} height={22} marginTop={16} />
                                    </View> 
                                </Ripple>
                        </View>
    
                </View>
             </View>
          </ScrollView>

          <Modal isVisible={isModelVisible} animationIn={'fadeInLeft'} animationOut={'fadeOutRight'}>
               <View style={{backgroundColor: '#FEFEFE', width: 260, height: 200, borderRadius: 25, alignItems: 'center', marginLeft: 35}}> 
                    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <SvgXml xml={xml.signOut}/>
                    </View>
                    <View>
                        <Text style={{fontSize: 15, color: appstyles.primaryColor, marginTop: 8, fontWeight: '700'}}>Are you sure you want to Logout ?</Text>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'space-around', marginTop: 16, flexDirection: 'row',}}>
                        <TouchableRipple onPress={() => logout()} rippleColor={appstyles.primaryColor} borderless={true} style={{borderRadius: 15}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', width: 90, height: 40, backgroundColor: appstyles.primaryColor, borderRadius: 16}}>
                                <Text style={{color: '#fff'}}>Logout</Text>
                            </View>
                        </TouchableRipple>
                        <View style={{marginLeft: 20}}>
                            <TouchableRipple onPress={toggleModel} rippleColor={appstyles.primaryColor} borderless={true} style={{borderRadius: 15}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: 90, height: 40, backgroundColor: '#fff', borderColor: appstyles.primaryColor, borderWidth: 1, borderRadius: 16}}>
                                    <Text style={{color: appstyles.primaryColor}}>Cancel</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
               </View>
          </Modal>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '32%',
        zIndex: -2
    },
    profileImg: {
        height: 120,
        width: 120,
        marginTop: 50,
    },
    componentContainer: {
        flexDirection: 'column',
        marginTop: 170,
    },
    componentContainerTwo: {
        flexDirection: 'column',
        marginTop: 30,
    },
    container: {
        flex: 1,
        alignItems: 'center',

    },
    scrollContainer: {
        width: width,
        height: height,
    }
});

export default menuOverlayScreen;
