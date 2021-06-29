import React from 'react'
import { SafeAreaView, StyleSheet, View, Text, Dimensions, ScrollView, Picker, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import xml from '../componets/svgxml';
import { SvgXml } from 'react-native-svg';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import appstyles from '../styles/appstyles';
import Modal from 'react-native-modal';
import { showMessage } from 'react-native-flash-message';

const {height, width} = Dimensions.get('window')

const editProfile = (props) => {

    const { user } = React.useContext(AuthContext);
    const [data, setData] = React.useState(null);
    const [getdata, setGetData] = React.useState([]);
    const [selectState, setSelectedState] = React.useState();
    const [selectCity, setSelectedCity] = React.useState();
    let token = '';

    const [isModelVisible, setModelVisiable] = React.useState(false);
    const toggleModel = () => {
        setModelVisiable(!isModelVisible);
    }

    const [isModelOTPVisible, setModelOTPVisiable] = React.useState(false);
    const toggleOTPModel = () => {
        setModelOTPVisiable(!isModelOTPVisible);
    }

    const getUserData = async () => {
         const response = await axios.get('http://167.172.236.197:8003/api/accounts/update/', {
                headers: {
                   'Authorization': `Bearer ${token}`
                }
            });
        setGetData(response.data);
    }

    React.useEffect(() => {
        getUserData();
    },[]);
    
    // console.log(getdata);

    const [editprofile, setProfile] = React.useState({
        company: undefined,
        gstNo: undefined,
        firstName: undefined,
        lastName: undefined,
        phone: undefined,
        email: undefined,
        cinNo: undefined,
        state: undefined,
        city: undefined,
        pincode: undefined,
        address: undefined,
    });
    
    const { onChange } = props;

    // console.log(user.result.accessToken)
    token = user.data.token;
    // token = user.result.idToken;
    // console.log(token)
    const handleUpdate = async() => {
    await axios.post('http://167.172.236.197:8003/api/accounts/update/', {
            "first_name": `${editprofile.firstName}`,
            "last_name": `${editprofile.lastName}`,
            "email": `${editprofile.email}`,
            "phone": `${editprofile.phone}`,
            "state": `${editprofile.state}`,
            "city": `${editprofile.city}`,
            "address": `${editprofile.address}`,
            "pincode": `${editprofile.pincode}`,
            "company": `${editprofile.company}`,
            "gst": `${editprofile.gstNo}`,
            "tin": `${editprofile.cinNo}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setData(res.data);
            
        })
        .catch(error => {
            console.log(error);
        }); 
    }

    // Change password

    const [password, setPassword] = React.useState({
        oldpassword: "",
        newpassword: "",
        repassword: "",
    });

    const [changePass, setChangePass] = React.useState(null);

    const changePassword = async () => {
        await axios.post('http://167.172.236.197:8003/api/accounts/change-password/', {
            "confirm_new": `${password.repassword}`,
            "new_password": `${password.newpassword}`,
            "old_password": `${password.oldpassword}`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setChangePass(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    // console.log(changePass);
    // Verify Phone

    const [otpRequest, setotpRequest] = React.useState(null);

    const [otp, setOTP] = React.useState({
        otpNumber: "",
    });

    const [verified, onVerified] = React.useState(null);

    const sendOTP = async() => {
        await axios.get('http://167.172.236.197:8003/api/accounts/phone-verify/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setotpRequest(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const verifyPhone = async() => {
        await axios.post('http://167.172.236.197:8003/api/accounts/phone-verify/', {
            "otp": `${otp.otpNumber}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            onVerified(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    const [phoneState, setPhoneState] = React.useState(false);

    return (
           <SafeAreaView style={styles.container}>
               {/* <Header icon={xml.ProfileIcon} title="Profile" width={18} height={40} onPress={() => props.navigation.goBack(null)}/> */}
               
               <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
                        <SvgXml xml={xml.Arrow} width={12} height={45}/>
                    </TouchableOpacity>
                    <SvgXml xml={xml.ProfileIcon} width={18} height={40} style={styles.iconContainer}/>
                    <Text style={styles.txtTitle}>EditProfile</Text>
                    <View style={{marginLeft: 160}}>
                        <Menu>
                        <MenuTrigger text='⋮' customStyles={{triggerText: {fontSize: 30}}}/>
                        <MenuOptions>
                            <MenuOption value={1} onSelect={toggleModel} >
                                <Text style={{color: appstyles.primaryColor, fontSize: 16}}>Change Password</Text>
                            </MenuOption>
                            <MenuOption value={2}>
                            <Text style={{color: 'red', fontSize: 16}}>Delete Account</Text>
                            </MenuOption>
                        </MenuOptions>
                        </Menu>
                    </View>
               </View>
             
               <ScrollView contentContainerStyle = {{alignItems: 'center'}} style={{width: width}}>

                        <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 25, marginTop: 20}}>
                            <Text style={{fontSize: 18, color: appstyles.primaryColor}}>PERSONAL DETAIL</Text>
                        </View>

                         <View style={styles.txtInputContainer}>
                        
                            <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                placeholder="First Name"
                                onChangeText={(text) => setProfile({...editProfile, firstName: text})}
                                value={editprofile.firstName}
                                // defaultValue={props.firstName}
                             />
                             <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, lastName: text})}
                                // defaultValue={getdata.last_name}
                                value={editprofile.lastName}
                                placeholder="Last Name"
                             />
                            <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, company: text})}
                                // defaultValue={getdata.company}
                                value={editprofile.company}
                                // defaultValue={editprofile.company}
                                placeholder="Iraitech"
                             />
                            <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, gstNo: text})}
                                // defaultValue={getdata.gst}
                                value={editprofile.gstNo}
                                // defaultValue={editprofile.gstNo}
                                placeholder="GST No"
                             />

                            <TextInput 
                                style={styles.mailInput}
                                value={editprofile.email}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, email: text})}
                                // defaultValue={getdata.email}
                                // defaultValue={editprofile.email}
                                placeholder="abc@gmail.com"
                             />
                            { 
                                phoneState ? 
                                <View style={{flexDirection: 'row'}}>
                                     <TextInput 
                                        style={styles.phoneInput}
                                        value={editprofile.phone}
                                        selectionColor={'#000'}
                                        theme={{ colors: {primary: '#D3D3D3'}}}
                                        onChangeText={text => setProfile({...editprofile, phone: text})}
                                        // defaultValue={getdata.phone}
                                        // defaultValue={editprofile.phone}
                                        keyboardType={"phone-pad"}
                                        placeholder="123 456 789"
                                />
                                </View> :   <View style={{flexDirection: 'row'}}>
                                <TextInput 
                                    style={styles.phoneInput}
                                    value={editprofile.phone}
                                    selectionColor={'#000'}
                                    theme={{ colors: {primary: '#D3D3D3'}}}
                                    onChangeText={text => setProfile({...editprofile, phone: text})}
                                    // defaultValue={getdata.phone}
                                    // defaultValue={editprofile.phone}
                                    keyboardType={"phone-pad"}
                                    placeholder="123 456 789"
                                />
                                <View style={{marginTop: 25}}>
                                    <TouchableOpacity onPress={async () => {
                                        try {
                                            sendOTP();
                                            showMessage({
                                                message: "OTP Successfully Send.",
                                                description: "Please check and verify your phone number.",
                                                type: 'success',
                                                duration: 4000,
                                                icon: 'success',
                                                style: styles.messageContainer,
                                                color: '#fff',
                                                animationDuration: 300,
                                                backgroundColor: '#192341',
                                            })
                                            toggleOTPModel();
                                        } catch(e) {
                                            console.log(e);
                                        }
                                    }}>
                                        <View style={{width: 70, height: 60, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center', marginTop: -13,marginLeft: -1}}>
                                            <Text style={{color: '#fff'}}>Send OTP</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                             </View>
                            } 
                          
                            <TextInput 
                                style={styles.mailInput}
                                value={editprofile.cinNo}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, cinNo: text})}
                                // defaultValue={getdata.tin}
                                // defaultValue={editprofile.cinNo}
                                placeholder="CIN No"
                             />

                            <TextInput 
                                style={styles.mailInput}
                                value={editprofile.state}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, state: text})}
                                // defaultValue={getdata.state}
                                // defaultValue={editprofile.cinNo}
                                placeholder="State"
                             />

                            <TextInput 
                                style={styles.mailInput}
                                value={editprofile.city}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, city: text})}
                                // defaultValue={getdata.city}
                                // defaultValue={editprofile.cinNo}
                                placeholder="City"
                             />

                             {/* <View style={{marginTop: 20, borderRadius: 5, width: width - 55, borderWidth: 1, borderColor: '#8C91A0', height: 60, marginLeft: 5}}>
                                    <Picker style={{borderWidth: 1}}
                                            selectedValue={selectState}
                                            onValueChange={(value, index) => {
                                                setSelectedState(value)
                                            }}>
                                            <Picker.Item label={editprofile.state} value={editprofile.state} color="#474F67"/>
                                             {
                                                data.map((value, index) => {
                                                    return (
                                                    <Picker.Item label={value} value={value} key={index}/>
                                                    );
                                                })
                                            }                   
                                </Picker> 
                            </View>
                            

                            <View style={{marginTop: 20, borderRadius: 5, width: width - 55, borderWidth: 1, borderColor: '#8C91A0', height: 60, marginLeft: 5}}>
                                <Picker style={{borderWidth: 1}}
                                    selectedValue={selectCity}
                                    onValueChange={(value, index) => {
                                        setSelectedCity(value)
                                    }}>
                                
                                    <Picker.Item label={editprofile.city} value={editprofile.city} color="#474F67"/>
                                    <Picker.Item label={city} value={city} key={index} />
                                    {
                                        city.map((value, index) => {
                                            return (
                                                <Picker.Item label={value} value={value} key={index} />
                                            );
                                        })
                                    }
                                 
                                </Picker>                                     
                            </View> */}

                            <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, address: text})}
                                // value={getdata.address}
                                // defaultValue={getdata.address}
                                value={editprofile.address}
                                // defaultValue={editprofile.address}
                                placeholder="Xyz Street, xyz colony, Church Gate, Mum"
                             />

                            <TextInput 
                                style={styles.mailInput}
                                selectionColor={'#000'}
                                value={editprofile.pincode}
                                theme={{ colors: {primary: '#D3D3D3'}}}
                                onChangeText={text => setProfile({...editprofile, pincode: text})}
                                // defaultValue={getdata.pincode}
                                // defaultValue={editprofile.pincode}
                                placeholder="143001"
                             />
                            <TouchableRipple
                                rippleColor={"red"}
                                style={styles.btnSaveContainer}
                                onPress={async() => {
                                        handleUpdate();
                                        setTimeout(getUserData, 4000);
                                }}
                                > 
                                <Text style={{fontSize: 20, color: '#fff', textAlign: 'center', marginTop: 5}}>Save</Text>
                             </TouchableRipple>
                        </View>
                     </ScrollView>

                     <Modal isVisible={isModelVisible} animationIn={'fadeInUp'} animationOut={'fadeOutUp'}>
                            <View style={{backgroundColor: '#FEFEFE', width: 300, height: 450, borderRadius: 25, alignItems: 'center', marginLeft: 15, }}> 
                                <View style={styles.modelHeader}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: 'bold'}}>Change Password</Text>
                                    </View>
                                    <View style={{alignSelf: 'center', flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                                        <TouchableOpacity onPress={toggleModel}>
                                            <SvgXml xml={xml.cross} width={16} height={16}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            
                                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}> 
                                        <View style={{marginTop: 8}}>
                                            <TextInput 
                                                placeholder={"Old Password"}
                                                style={styles.changepasswordInput}
                                                theme={{ colors: {primary: '#D3D3D3'}}}
                                                mode={'outlined'}
                                                secureTextEntry={true}
                                                value={password.oldpassword}
                                                onChangeText={text => setPassword({...password, oldpassword: text})}
                                            />
                                        </View>

                                        <View style={{marginTop: 8}}>
                                            <TextInput 
                                                placeholder={"New Password"}
                                                style={styles.changepasswordInput}
                                                theme={{ colors: {primary: '#D3D3D3'}}}
                                                mode={'outlined'}
                                                secureTextEntry={true}
                                                value={password.newpassword}
                                                onChangeText={text => setPassword({...password, newpassword: text})}
                                            />
                                        </View>

                                        <View style={{marginTop: 8}}>
                                            <TextInput 
                                                placeholder={"Re-enter new password"}
                                                style={styles.changepasswordInput}
                                                theme={{ colors: {primary: '#D3D3D3'}}}
                                                mode={'outlined'}
                                                secureTextEntry={true}
                                                value={password.repassword}
                                                onChangeText={text => setPassword({...password, repassword: text})}
                                            />
                                        </View>
                                    
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, alignSelf: 'flex-end'}}>
                                        <TouchableOpacity onPress={async () => {
                                            try {
                                                changePassword();
                                                toggleModel();
                                                showMessage({
                                                    message: "Password Successfully Changed",
                                                    type: 'success',
                                                    duration: 4000,
                                                    icon: 'success',
                                                    style: styles.messageContainer,
                                                    color: '#fff',
                                                    animationDuration: 300,
                                                    backgroundColor: '#192341',
                                                })
                                            } catch(e) {
                                                console.log(e);
                                            }
                                        }}>
                                            <View style={{width: 100, height: 40, borderRadius: 10, backgroundColor: appstyles.primaryColor, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>Change</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={toggleModel}>
                                            <View style={{width: 100, height: 40, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{color: appstyles.primaryColor, fontSize: 16}}>cancel</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                        
                            </View>
                        </Modal>

                        <Modal isVisible={isModelOTPVisible} animationIn={'fadeInUp'} animationOut={'fadeOutUp'}>
                            <View style={{backgroundColor: '#FEFEFE', width: 300, height: 350, borderRadius: 25, alignItems: 'center', marginLeft: 15, }}> 
                                <View style={styles.modelHeader}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                        <Text style={{color: appstyles.primaryColor, fontSize: 20, fontWeight: 'bold'}}>Enter OTP</Text>
                                    </View>
                                    <View style={{alignSelf: 'center', flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                                        <TouchableOpacity onPress={toggleOTPModel}>
                                            <SvgXml xml={xml.cross} width={16} height={16}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            
                                <View style={{flexDirection: 'column', marginTop: 10}}>
                                         <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
                                            <Text style={{fontSize: 18, fontWeight: '700'}}>OTP Sent !</Text>
                                            <Text style={{fontSize: 15, color: '#AAAEB1', marginTop: 6}}>OTP has been sent to </Text>
                                            <Text style={{fontSize: 18, fontWeight: '700', marginTop: 18}}>Enter OTP</Text>
                                         </View>   
                                         <View>
                                             <TextInput 
                                                 placeholder={"- - - - - -"}
                                                 style={styles.changepasswordInput}
                                                 theme={{ colors: {primary: '#D3D3D3'}}}
                                                 mode={'outlined'}
                                                 value={otp.otpNumber}
                                                 onChangeText={text => setOTP({...otp, otpNumber: text})}
                                             />
                                         </View>
                                        
                                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 8}}>
                                            <Text style={{color: 'red'}}>Resend OTP in seconds</Text>
                                        </View>

                                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 16}}>
                                        <TouchableOpacity onPress={async () => {
                                                try {
                                                    verifyPhone();
                                                    setPhoneState(true);
                                                    showMessage({
                                                        message: "Successfully Verified.",
                                                        type: 'success',
                                                        duration: 4000,
                                                        icon: 'success',
                                                        style: styles.messageContainer,
                                                        color: '#fff',
                                                        animationDuration: 300,
                                                        backgroundColor: '#192341',
                                                    })
                                                    toggleOTPModel();
                                                } catch(e) {
                                                    console.log(e);
                                                }
                                            }}>
                                                <View style={{width: 70, height: 40, borderRadius: 8, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center'}}>
                                                    <Text style={{color: '#fff'}}>Verify</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>


                                </View>
                                        
                            </View>
                        </Modal>

           </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 110,
    },
    profileImg: {
        height: 100,
        width: 100,
        marginTop: 50,
    },
    txtUserName: {
        fontSize: 20,
        marginTop: 20,

    },
    txtInputContainer: {
        flexDirection: 'column',
        // backgroundColor: 'red',
        alignItems: 'center',
        marginTop: 10
    },
    mailInput: {
        width: Dimensions.get('window').width - 30, 
        backgroundColor: '#fff', 
        overflow: 'hidden',
        paddingLeft: 14,
        paddingRight: 10,
        marginTop: 12,
        borderWidth: 1,
        height: 60,
        borderRadius: 3
    },
    phoneInput: {
        width: Dimensions.get('window').width - 100, 
        backgroundColor: '#fff', 
        overflow: 'hidden',
        paddingLeft: 8,
        paddingRight: 10,
        marginTop: 12,
        borderWidth: 1,
        height: 60,
        borderRadius: 3
    },
    changepasswordInput: {
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        overflow: 'hidden',
        paddingLeft: 14,
        paddingRight: 10,
        marginTop: 12,
        // borderWidth: 0.2,
        borderColor: appstyles.primaryColor
    },
    btnSaveContainer: {
        marginTop: 80,
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#192341',
        width: 250,
        height: 60,
        alignItems: 'center',
        borderRadius: 7,
        marginLeft: 1,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 8,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: width,
        height: 50,
        // marginTop: 32,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        paddingLeft: 20,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 10,
   },
   txtTitle: {
        marginTop: 8,
        marginLeft: 12,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#27304D'
    
    },
iconContainer: {
        marginTop: 3,
        marginLeft: 18,
        color: '#192341'
    },
    modelHeader: {
        shadowColor: "#000",
        flexDirection: 'row',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        paddingLeft: 20,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 6,
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        width: 300, 
        height:50, 
        borderTopLeftRadius: 25, 
        borderTopRightRadius: 25
    },
    messageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

export default editProfile;
