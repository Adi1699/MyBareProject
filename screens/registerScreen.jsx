import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text, ScrollView, SafeAreaView, TouchableOpacity, Platform} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';
import appstyles from '../styles/appstyles';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from "react-native-vector-icons/Ionicons"
import { Checkbox } from 'react-native-paper';
import { TouchableRipple } from 'react-native-paper';
import { AuthContext } from '../componets/context';
import { Loading } from '../componets/Loading';
import { showMessage } from 'react-native-flash-message';

const {height, width} = Dimensions.get('window')

const registerScreen = (props) => {

    // console.log(props)
    // console.log(props.route.params.v)

    const { 
        auth: {register},
    } = React.useContext(AuthContext);


    const [regdata, setregdata] = React.useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        company: "",
        password: "",
        repassword: "",
        v:"",
    })

    regdata.v = props.route.params.v;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

   const [checked, setChecked] = React.useState(Platform.OS === 'ios' ? true : false);

   return(
      <SafeAreaView style={styles.container}>
             <Loading loading = {loading}/>   
            <LinearGradient
               colors={['#1A2442', '#949AAB']}
               style={styles.linearGradient}>
           <ScrollView contentContainerStyle = {styles.contentContainer} style={{width: width}}>
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
                  <Icon style={styles.homeIconStyle} color="#777777" size={25} name="person-sharp"/>
                       <TextInput
                          style={styles.txtInput}
                          onChangeText={text => setregdata({...regdata, fname: text})}
                          value={regdata.fname}
                          placeholder="First Name *"
                       />

                    <Icon style={styles.LastIconStyle} color="#777777" size={25} name="person-sharp"/>
                       <TextInput
                          style={styles.txtLastInput}
                          onChangeText={text => setregdata({...regdata, lname: text})}
                          value={regdata.lname}
                          placeholder="Last Name *"
                       />
                   
                   <Icon style={styles.phoneIconStyle} color="#777777" size={25} name="call-sharp"/>
                       <TextInput
                          style={styles.txtInputPhone}
                          onChangeText={text => setregdata({...regdata, email: text})}
                          value={regdata.email}
                          keyboardType={'email-address'}
                          placeholder="Email *"
                       />
                    <Icon style={styles.mailIconStyle} color="#777777" size={25} name="mail" />
                       <TextInput
                          style={styles.txtInputMail}
                          onChangeText={text => setregdata({...regdata, phone: text})}
                          phone={regdata.phone}
                          keyboardType={'phone-pad'}
                          placeholder="Phone Number *"
                       />
                    <Icon style={styles.companyIconStyle} color="#777777" size={25} name="business" />
                       <TextInput
                          style={styles.txtInputMail}
                          onChangeText={text => setregdata({...regdata, company: text})}
                          phone={regdata.company}
                          placeholder="Company *"
                       />
                   <Icon style={styles.passIconStyle} color="#777777" size={25} name="lock-closed" />
                       <TextInput
                          style={styles.txtInputPassword}
                          onChangeText={text => setregdata({...regdata, password: text})}
                          value={regdata.password}
                          placeholder="Password *"
                          secureTextEntry
                       />
                   <Icon style={styles.rePassIconStyle} color="#777777" size={25} name="lock-closed" />   
                       <TextInput
                          style={styles.txtInputRePassword}
                          onChangeText={text => setregdata({...regdata, repassword: text})}
                          value={regdata.repassword}
                          placeholder="Re-Password *"
                          secureTextEntry
                       /> 
                </View> 

                <View style={styles.bottomContainer}>
                    <Checkbox
                        color="#192341"
                        uncheckedColor="#192341"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                             setChecked(!checked)
                        }}    
                    />

                    <Text style={{marginTop: 8, color: '#fff'}}>I have read all</Text> 
                    <Text style={{marginTop: 8, color: '#192341', marginLeft: 4, fontWeight: 'bold'}}>Terms & Conditions</Text>
                    
                </View>

                
                <TouchableRipple 
                       rippleColor={"#192341"}
                       style={styles.btnSignInContainer} 
                       onPress={async () => {
                           try {
                             setLoading(true);  
                             await register(regdata.fname, regdata.company, regdata.lname, regdata.email, regdata.phone, regdata.password, regdata.v);
                             setLoading(false);
                             showMessage({
                                message: "You are successfully registered",
                                description: "Please Sign-In your account.",
                                type: 'success',
                                duration: 2000,
                                icon: 'success',
                                style: styles.messageContainer,
                                color: '#fff',
                                animationDuration: 300,
                                backgroundColor: '#192341',
                             })
                            } catch(e) {
                               setError(e.message);
                               setLoading(false);
                            // console.log(e);                          
                            }
                        }}
                        >
                      <Text style={styles.txtSideTitle}>Sign Up</Text>
                 </TouchableRipple>

               <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 20}}>
                    <Text style={{marginTop: 8, color: '#fff'}}>If you have an account?</Text> 
                    <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
                         <Text style={{marginTop: 8, color: '#192341', marginLeft: 4, fontWeight: 'bold', fontStyle: 'italic'}}>Sign In here</Text>
                    </TouchableOpacity>
                </View>

                </ScrollView>
              </LinearGradient>
           </SafeAreaView>
  
   );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    linearGradient:{
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
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
        justifyContent: 'space-between',
        marginTop: 40,
        // alignItems: 'center',
        position: 'relative',   
    },
    roundImg: {
        // flex: 1,
        resizeMode: "cover",
        marginTop: 10,
        justifyContent: 'center',
    },
    iconCon: {
        position: 'relative',
        top: -58,
        left: 33,
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
    txtLastInput: {
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
    txtInputPhone: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        marginTop: 20,
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
        
    },
    txtInputPhone: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        marginTop: 20,
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
        
    },
    txtInputMail: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        marginTop: 20,
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
        
    },
    txtInputPassword: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        marginTop: 20,
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
        
    },
    txtInputRePassword: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        marginTop: 20,
        borderRadius: 15,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
        
    },
    homeIconStyle: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 2
     },
     LastIconStyle: {
        position: 'absolute',
        left: 10,
        top: 75,
        zIndex: 2
     },
    phoneIconStyle: {
        position: 'absolute',
        left: 10,
        top: 208,
        zIndex: 2
    },
    mailIconStyle: {
        position: 'absolute',
        left: 10,
        top: 142,
        zIndex: 2
    },
    companyIconStyle: {
        position: 'absolute',
        left: 10,
        top: 272,
        zIndex: 2
    },
    passIconStyle: {
        position: 'absolute',
        left: 10,
        top: 340,
        zIndex: 2
    },
    rePassIconStyle: {
        position: 'absolute',
        left: 10,
        top: 405,
        zIndex: 2
    },
    contentContainer: {
        alignItems: 'center'
        
    },
    bottomContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 40,
        marginTop: 20,
    },
    bottomBoxContainer: {
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
    btnSignInContainer: {
        marginTop: 16,
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
    txtSideTitle: {
        color: appstyles.white,
        fontSize:  18,
        textAlign: 'center',
    },
    ImgContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    messageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }

});

export default registerScreen;