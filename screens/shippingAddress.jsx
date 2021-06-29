import React from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, Text, ScrollView, TextInput } from 'react-native'
import Header from '../componets/header';
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import Modal from 'react-native-modal';
import { TouchableRipple } from 'react-native-paper';

const {height, width} = Dimensions.get('window')

const shippingAddress = (props) => {

    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;

    const [temp, setTemp] = React.useState([]);
    const [addressSecond, setAddressSecond] = React.useState([]);
    const [selectAddress, setSelectedAddress] = React.useState([]);

        // address
        React.useEffect((value, index) => {
            axios.get('http://167.172.236.197:8003/api/accounts/update/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => {
                setTemp(JSON.parse(res.data.secondary_address));
                setAddressSecond(JSON.parse(res.data.secondary_address));
            })
            .catch(error => {
                console.log(error);
            })
        },[]);

    let userSecondayAddress = [];
    userSecondayAddress  =  addressSecond;

    let address = [];
    userSecondayAddress.map((value, index) => {
            address.push(value.address)
    })

    let setUserAdress = [];
    userSecondayAddress.map((value, index) => {
        if ( value.address === selectAddress ) {
            setUserAdress.push(value);
        }
    })

    let city = '';
    let state = '';
    let pincode = null;
    let UserAdress = '';
    let UserContacts = [];
    setUserAdress.map((value, index) => {
        city = value.city,
        state = value.state,
        pincode = value.pincode,
        UserContacts.push(value.contacts)
        UserAdress = value.address
    })

    let name = '';
    let phone = '';
    UserContacts.map((value, index) => {
        value.map((value, index) => {
            name = value.name,
            phone = value.phone
        })
    })

    let orderPlaceAddress = '';
    orderPlaceAddress = state + '-' + city;

      // New Address Model
      const [isAddressModelVisible, setAddressBarVisible] = React.useState(false);
      const toggleAddressModel = () => {
          setAddressBarVisible(!isAddressModelVisible);
      }

      const [userAddressDetail, setUserAddressDetails] = React.useState({
        name: '',
        phone: '',
        address: '',
        pincode: undefined,
        city: '',
        state: '',
    });
    
    const updatedAddress = async() => {
        await  axios.get('http://167.172.236.197:8003/api/accounts/update/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setTemp(JSON.parse(res.data.secondary_address));
            setAddressSecond(JSON.parse(res.data.secondary_address));
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        })
     };

    let emptyArray = [];
    emptyArray.push(temp);

    let addedNewAddress = [];
    addedNewAddress.push({
        contacts: [{name:  userAddressDetail.name, phone: userAddressDetail.phone}],
        address: userAddressDetail.address,
        city: userAddressDetail.city,
        state: userAddressDetail.state,
        pincode: userAddressDetail.pincode,
        town: "",
    })

    let hello = [];
    emptyArray.map((value, index) => {
        hello = value.concat(addedNewAddress)
    })

    // console.log(hello);

    let finalUploadAddress = JSON.stringify(hello); 



    const addNewAddress = async() => {
        await axios.post('http://167.172.236.197:8003/api/accounts/update/', {
            "secondary_address": `${finalUploadAddress}`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            console.log(res.data);
        }).
        catch(error => {
            console.log(error);
        })
    }


    return (
        <SafeAreaView>
            <Header title={"Shipping Address"} onPress={() => props.navigation.goBack(null)}/>

            <View style={{marginTop: 20, marginLeft: 30}}>
                <Text style={{fontSize: 18, color: appstyles.primaryColor, fontWeight: 'bold'}}>SHIPPING ADDRESS</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: 10, borderRadius: 15, width: width - 85, borderWidth: 1, borderColor: '#8C91A0', marginLeft: 20}}>
                        <Picker style={{width: 280, height: 50, borderWidth: 0.2, borderRadius: 8}} 
                            selectedValue={selectAddress}
                            onValueChange={(value, index) => {
                                setSelectedAddress(value)
                            }}>
                            <Picker.Item label="Primary Address" value="primary"/>
                                            {
                                                 address.map((value, index) => {
                                                    return (
                                                        <Picker.Item label={value} value={value} key={index} />
                                                    );
                                                   
                                                })    
                                            }
                            </Picker>
                </View>

                <View style={{flexDirection: 'row', marginTop: 6, marginLeft: 20}}>
                    <TouchableOpacity onPress={toggleAddressModel}>
                        <SvgXml xml={xml.cirleplus} width={20} height={20} marginTop={20}/> 
                    </TouchableOpacity>
                </View>  
            </View>

            <View style={{alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column', width: width, height: 200, marginTop: 30}}>
                 <View style={{flexDirection: 'row', width: width}}>
                      <View style={{flexDirection: 'column', marginLeft: 30}}>
                          <Text style={{color: appstyles.tabGray}}>NAME</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{name}</Text>
                      </View>
                      <View style={{flexDirection: 'column', position: 'absolute', right: 0, top: 0, bottom: 0, left: 220}}>
                          <Text style={{color: appstyles.tabGray}}>PHONE NO.</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{phone}</Text>
                      </View>
                 </View>

                 <View style={{flexDirection: 'row', marginTop: 10, width: width}}>
                      <View style={{flexDirection: 'column', marginLeft: 30}}>
                          <Text style={{color: appstyles.tabGray}}>ADDRESS</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{UserAdress}</Text>
                      </View>
                      <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 220}}>
                          <Text style={{color: appstyles.tabGray}}>PINCODE</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{pincode}</Text>
                      </View>
                 </View>

                 <View style={{flexDirection: 'row', marginTop: 10, width: width}}>
                      <View style={{flexDirection: 'column', marginLeft: 30}}>
                          <Text style={{color: appstyles.tabGray}}>CITY</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{city}</Text>
                      </View>
                      <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 220}}>
                          <Text style={{color: appstyles.tabGray}}>STATE</Text>
                          <Text style={{color: appstyles.primaryColor, fontSize: 18}}>{state}</Text>
                      </View>
                 </View>
            </View>
            
              {/* Address Modal */}
              <Modal isVisible={isAddressModelVisible} animationIn={'fadeInDown'} animationOut={'fadeOutUp'} >
                        <View style={{backgroundColor: '#FBFBFB', width: 320, height: 550, borderRadius: 25, alignItems: 'center', marginLeft: 3}}>
                            <View style={styles.modelHeaderAddress}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                                     <Text style={{color: appstyles.primaryColor, fontSize: 20, fontWeight: 'bold'}}>Add New Address</Text>
                                </View>
                                <View style={{alignSelf: 'center', flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                                    <TouchableOpacity onPress={toggleAddressModel}>
                                        <SvgXml xml={xml.cross} width={18} height={18}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView>
                                <View style={{backgroundColor: '#fff', width: 320, marginTop: 10, flex: 1, marginBottom: 20, borderRadius: 20}}>
                                    <View style={{marginTop: 10, marginLeft: 20,}}>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    placeholder={'Name*'}
                                                    value={userAddressDetail.name}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, name: text})}
                                                />
                                            </View>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    value={userAddressDetail.city}
                                                    placeholder={'City*'}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, city: text})}
                                                />
                                            </View>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    placeholder={'Pincode*'}
                                                    value={userAddressDetail.pincode}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, pincode: text})} 
                                                />
                                            </View>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    placeholder={'State*'}
                                                    value={userAddressDetail.state}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, state: text})} 
                                                />
                                            </View>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    placeholder={'Phone*'}
                                                    value={userAddressDetail.phone}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, phone: text})} 
                                                />
                                            </View>
                                            <View style={styles.txtInputModel}>
                                                <TextInput 
                                                    placeholder={'Address*'}
                                                    value={userAddressDetail.address}
                                                    multiline={true}
                                                    onChangeText={text => setUserAddressDetails({...userAddressDetail, address: text})}
                                                />
                                            </View>
                                                                                                                                                                              
                                     </View>
                            </View> 
                          
                            <View style={{alignSelf: 'center', marginBottom: 10}}>
                                <TouchableRipple onPress={async() => {
                                    addNewAddress();
                                    toggleAddressModel();
                                    setTimeout(updatedAddress, 4000);
                                }} rippleCentered={true}>
                                     <View style={{width: 250, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                                          <Text style={{color: appstyles.white, fontSize: 18}}>Add</Text>
                                     </View>
                                </TouchableRipple>
                            </View>
                            </ScrollView>
                        </View>
                </Modal>

        </SafeAreaView>
    );  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    txtInputModel: {
        borderColor: 'gray', 
        borderWidth: 1, 
        height: 50,
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        width: Dimensions.get('window').width - 80, 
        backgroundColor: '#fff', 
        paddingLeft: 10,
        paddingTop: 10,
        paddingRight: 35,
        marginTop: 10
    },
    modelHeaderAddress: {
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
        width: 320, 
        height:60, 
        borderTopLeftRadius: 25, 
        borderTopRightRadius: 25
    },
});

export default shippingAddress;