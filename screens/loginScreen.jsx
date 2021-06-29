import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text , SafeAreaView, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';
import appstyles from '../styles/appstyles';
import xml from '../componets/svgxml';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableRipple } from 'react-native-paper';
import LoginWithLogo from '../componets/loginwithlogo';
import { AuthContext } from "../componets/context";
import { Loading } from '../componets/Loading';
import { showMessage } from 'react-native-flash-message';

const {height, width} = Dimensions.get('window')

const loginScreen = (props) => {
  
    const [logindata, setlogindata] = React.useState({
        email: "",
        password: "",
    })

    const { 
        auth: {login},
        auth: {googleLogin},
        auth: {facebookLogin},
    } = React.useContext(AuthContext);
    
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    return (
        <SafeAreaView style={styles.container}>    
            <Loading loading = {loading}/>   
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
                    {/* <SvgXml xml={xml.titleLine} width={30} height={120} marginTop={60} /> */}
                    
                    <View style={{marginTop: 50, marginLeft: 20}}>
                          <Text style={styles.txtSideTitle}>The House of</Text>
                          <Text style={styles.txtSideTitle}>Industrial Products</Text>
                    </View>
                
                </View>
                
                
                <View style={styles.mailContainer}>
                    <Icon style={styles.iconStyle} color="#777777" size={25} name="mail" />
                   <TextInput
                        style={styles.txtInput}
                        onChangeText={text => setlogindata({...logindata, email: text})}
                        value={logindata.email}
                        placeholder="Email"
                        keyboardType={'email-address'}
                    />
                   <Icon style={styles.iconStylePass} color="#777777" size={25} name="lock-closed" />
                   <TextInput
                        style={styles.txtInputPass}
                        onChangeText={text => setlogindata({...logindata, password: text})}
                        value={logindata.password}
                        secureTextEntry={true}
                        placeholder="Password"
                    />
                </View>

                 <TouchableRipple 
                       rippleColor={"transparent"}
                       style={styles.btnSignInContainer} 
                       onPress={async () => {
                            try {
                                setLoading(true);
                                await login(logindata.email, logindata.password);
                            } catch (e) {
                                setError(e);
                                setLoading(false);
                                showMessage({
                                    message: "Something Wrong",
                                    description: 'Invaild email or password',
                                    // description: error,
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
                       }}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>Sign In</Text>
                 </TouchableRipple> 

                 <View style={styles.bottomContainer}>
                        <LoginWithLogo icon={xml.apple}/>
                        <LoginWithLogo icon={xml.facebook} onPress={() => facebookLogin()}/>
                        <LoginWithLogo icon={xml.google} onPress={() => googleLogin()} />
                 </View>

               
                 <View style={{flexDirection: 'row'}}>
                      <Text style={{color: appstyles.white, marginTop: 25}}>Don't have any account?</Text>
                      <TouchableOpacity onPress={() => props.navigation.navigate("Verification")}>
                           <Text style={{color: "#192341", marginTop: 25, marginLeft: 5, fontStyle: 'italic', fontWeight: 'bold'}}>Sign Up here</Text>
                      </TouchableOpacity>
                 </View>
            </LinearGradient>
        </SafeAreaView>
    );
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
        marginTop: 50,
        
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
    txtInputPass: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        borderRadius: 15,
        paddingLeft: 50,
        marginTop: 20,
        paddingRight: 10,
        paddingVertical: 8,
    },
    iconStyle: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 2
   },
    iconStylePass: {
        position: 'absolute',
        left: 10,
        top: 75,
        zIndex: 2
   },
   btnSignInContainer: {
       marginTop: 25,
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

export default loginScreen;