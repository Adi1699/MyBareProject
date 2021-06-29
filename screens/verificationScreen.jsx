import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { AuthContext } from "../componets/context";
import { TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import appstyles from '../styles/appstyles';
import xml from '../componets/svgxml';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginWithLogo from '../componets/loginwithlogo';
import { Loading } from '../componets/Loading';
import { showMessage } from 'react-native-flash-message';
const {height, width} = Dimensions.get('window')


const verificationScreen = (props) => {
    
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const { auth: {email_verify}, } = React.useContext(AuthContext);
 
    return (
        <SafeAreaView style={styles.container}>   
            <Loading loading={loading}/> 
        <LinearGradient
           colors={['#1A2442', '#949AAB']}
           style={styles.linearGradient}>
            <Image 
                style={styles.backImg}
                source={require('../assets/images/background.png')}
            />
            <View style={styles.topContainer}>
                <View style={{flexDirection: 'column', marginTop: 60, alignItems: 'flex-end', borderRightWidth: 2, borderColor: "#888EBD", paddingRight: 12}}>
                      <Text style={styles.txtTitle}>Steel</Text>
                      <Text style={styles.txtTitle}>On</Text>
                      <Text style={styles.txtTitle}>Web</Text>
                </View>
                
                <View style={{marginTop: 50, marginLeft: 20}}>
                      <Text style={styles.txtSideTitle}>The House of</Text>
                      <Text style={styles.txtSideTitle}>Industrial Products</Text>
                </View>
            
            </View>
            
            <View style={styles.mailContainer}>
                <Icon style={styles.iconStyle} color="#777777" size={25} name="mail" />
               <TextInput
                    style={styles.txtInput}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    placeholder="Email *"
                    keyboardType={'email-address'}
                />
            </View>

             <TouchableRipple 
                   rippleColor={"transparent"}
                   style={styles.btnSignInContainer} 
                   onPress={async () => {
                       try {
                           setLoading(true);
                           await email_verify(email);
                           setLoading(false);
                           showMessage({
                               message: "Successfully Sent",
                               description: "Please check your mailbox and click on the link to verify.",
                               type: 'success',
                               duration: 4000,
                               icon: 'success',
                               style: styles.messageContainer,
                               color: '#fff',
                               animationDuration: 300,
                               backgroundColor: '#192341',
                           })
                       } catch(e) {
                           setError(e.message);
                           setLoading(false);
                           showMessage({
                            message: "Something Wrong",
                            description: "Invaild email",
                            type: 'danger',
                            duration: 4000,
                            icon: 'danger',
                            style: styles.messageContainer,
                            color: '#fff',
                            animationDuration: 300,
                            backgroundColor: 'red',
                        })
                        // console.log(e);
                       }
                   }}
                   >
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Register email</Text>
             </TouchableRipple> 

             <View style={styles.bottomContainer}>
                    <LoginWithLogo icon={xml.apple}/>
                    <LoginWithLogo icon={xml.facebook}/>
                    <LoginWithLogo icon={xml.google} />
             </View>

             
             <View style={{flexDirection: 'row'}}>
                  <Text style={{color: appstyles.white, marginTop: 45}}>If you have an account?</Text>
                  <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
                       <Text style={{color: "#192341", marginTop: 45, marginLeft: 5, fontStyle: 'italic', fontWeight: 'bold'}}>Sign In here</Text>
                  </TouchableOpacity>
             </View>
        </LinearGradient>
    </SafeAreaView>
          
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30,
    },
    linearGradient:{
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        width: width,
        height: height,
        zIndex: -2
    },
    backImg: {
        resizeMode: 'contain',
        height: 300,
        opacity: 0.4,
        zIndex: 0,
        position: 'absolute',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 200,
        width: 250, 
    },
    txtTitle: {
        color: appstyles.white,
        fontSize: 35,
        fontWeight: 'bold',
    },
    txtSideTitle: {
        color: appstyles.white,
        fontSize:  18,
        textAlign: 'center',
    },
    mailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
        position: 'relative',
        marginTop: 80,
        
    },
    txtInput: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
    },
    iconStyle: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 2
   },
   btnSignInContainer: {
       marginTop: 18,
       paddingVertical: 10,
       paddingHorizontal: 12,
       backgroundColor: '#192341',
       width: 280,
       height: 45,
       alignItems: 'center',
       borderRadius: 15,
       shadowColor: "#000",
       shadowOffset: {
	     width: 0,
	     height: 2,
        },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
       elevation: 8,
   },
   bottomContainer: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        // alignSelf: 'center',
        // alignItems: 'center',
        marginTop: 30,
        marginLeft: 75,
        marginRight: 50,
        // flex: 1,
        justifyContent: 'center'
   },
   boxContainer: {
       width: 60,
       height: 60,
       borderRadius: 18,
       justifyContent: 'center',
       marginLeft: 15,
       marginRight: 15,
       backgroundColor: appstyles.white,
   },
   messageContainer: {
       borderTopLeftRadius: 10,
       borderTopRightRadius: 10,
   }
});

export default verificationScreen
