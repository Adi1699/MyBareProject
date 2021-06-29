import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import IconHeader from '../componets/iconHeader';
import xml from '../componets/svgxml';
import { SvgXml } from 'react-native-svg';
import appstyles from '../styles/appstyles';
import { TextInput } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import { showMessage } from 'react-native-flash-message';
import RazorpayCheckout from 'react-native-razorpay';
import { RazorpayApikey } from '../utils/config';
import NumberFormat from 'react-number-format';

const {height, width} = Dimensions.get('window')

const paymentDetailScreen = (props) => {

    const { user } = React.useContext(AuthContext);

    const [RazorAmount, setRazorAmount] = React.useState(undefined);
    const [RazorDetail, setRazorDetail] = React.useState([]);
    const [data, setData] = React.useState(0);
    const [getData, setGetData] = React.useState([]);
    const [isShow, setShow] = React.useState(false);
    const [isShowPay, setShowPay] = React.useState(false);

    let token = '';

    const togglePayment = () => {
        setShow(!isShow);
    }

    // console.log(typeof RazorAmount)

    const toggleBankDetails = () => {
        setShowPay(!isShowPay);
    }

    const [paymentDetail, setPaymentDetails] = React.useState({
        amount: "",
        amountNo: "",
        transaction: "",
    })
    
    token = user.data.token;
    const submit = () => {
        axios.post('http://167.172.236.197:8003/api/orders/payment/', {
            "account_number": `${paymentDetail.amountNo}`,
            "amount": `${paymentDetail.amount}`,
            "method": "other",
            "transaction": `${paymentDetail.transaction}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setData(res.data);

            showMessage({
                message: "Successfully",
                description: "Your transaction detail has been sent to administrator, you will be notified as your payment gets verified.",
                type: 'success',
                duration: 4000,
                icon: 'success',
                style: styles.messageContainer,
                color: '#fff',
                animationDuration: 300,
                backgroundColor: '#192341',
            })
            getDetails();
        })
        .catch(error => {
            console.log(error);
        });
    }

    React.useEffect(() => {
        axios.get('http://167.172.236.197:8003/api/orders/payment/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setTimeout(() => {
              setGetData(res.data);
            }, 5000);
        })
        .catch(error => {
            console.log(error);
        });
    },[]);

    const [userCredit, setUserCredit] = React.useState([]);
    React.useEffect((value, index) => {
        axios.get('http://167.172.236.197:8003/api/accounts/update/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setUserCredit(res.data.already_payed_amount);
        })
        .catch(error => {
            console.log(error);
        })
    },[]);

let AVAILABLE_Credits =  Math.round(userCredit);

    // console.log(getData)

    const getDetails = () => {
         axios.get('http://167.172.236.197:8003/api/orders/payment/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setGetData(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    let num = parseInt(RazorAmount)

    const createOrder = async () => {
        const { data } = await axios.post('http://167.172.236.197:8003/api/orders/payment/razorpay/', {
            amount: num,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(data)
        return data;
    };
    
    const [RazorPayConfirm, setRazorPayConfirm] = React.useState(null);

    const onPay = async () => {
        const order = await createOrder();
        var options = {
            name: 'Steel On Web',
            image: 'https://i.imgur.com/3g7nmJC.png',
            description: 'Credit Clearnace',
            order_id: order.id,
            currency: 'INR',
            amount: num,
            key: RazorpayApikey,
            // prefill: {
            //   email: 'useremail@example.com',
            //   contact: '9191919191',
            //   name: 'John Doe',
            // },
            theme: { color: '#192341' },
          };
          RazorpayCheckout.open(options)
            .then(async (res) => {
                 const verified = await verifyPayment(res.checkout_logo, res.org_logo, res.org_name, res.razorpay_order_id, res.razorpay_payment_id, res.razorpay_signature);
                //  alert('Success ' + verified);
                 showMessage({
                    message: "Transaction Success",
                    // description: "Please check your mailbox and click on the link to verify.",
                    type: 'success',
                    duration: 4000,
                    icon: 'success',
                    style: styles.messageContainer,
                    color: '#fff',
                    animationDuration: 300,
                    backgroundColor: '#192341',
                })
                getDetails();
            }) 
            .catch(console.log);
    };

    // console.log(RazorPayConfirm);

    const verifyPayment = async (checkout_logo, org_logo, org_name, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        const { data } = await axios.post('http://167.172.236.197:8003/api/orders/payment/razorpay/verify/', {
            "checkout_logo": `${checkout_logo}`,
            "custom_branding": false,
            "org_logo": `${org_logo}`,
            "org_name": `${org_name}`,
            "razorpay_order_id": `${razorpay_order_id}`,
            "razorpay_payment_id": `${razorpay_payment_id}`,
            "razorpay_signature": `${razorpay_signature}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(data);
        return data.received;
    };

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },4500)  
    });

    return (    
        <SafeAreaView style={styles.container}>
             <IconHeader icon={xml.payment} title={"Payment Details"} heigth={30} width={24} onPress={() => props.navigation.goBack(null)}/>
            <ScrollView horizontal={false}>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <View style={{flexDirection: 'row', marginLeft: 25}}>
                        <Text style={{fontSize: 18, color: appstyles.primaryColor, fontWeight: '700'}}>Available Credits</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end', flexDirection: 'row', flex: 1, marginLeft: 110}}>
                           <NumberFormat
                                 value={AVAILABLE_Credits}
                                 displayType={'text'}
                                 thousandSeparator={true}
                                 prefix={'₹'}
                                 renderText={formattedValue => <Text style={{fontSize: 18, color: appstyles.primaryColor, fontWeight: '700'}}>{formattedValue}</Text>} // <--- Don't forget this!
                          />
                    </View>
                </View>
    
             <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 10, marginLeft: 8}}/>

                <View style={{flexDirection: 'column', width: width, backgroundColor: '#fff', height: 150}}>
                    <View style={{marginLeft: 20, marginTop: 20}}>
                        <Text style={{color: '#7F7F7F'}}>If you have done payment from other sources.</Text>
                        <Text style={{color: '#7F7F7F'}}>Please mention details below</Text>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <View style={{marginLeft: 20}}>
                            <TouchableOpacity onPress={togglePayment}>
                                <View style={styles.roundContainer}>
                                    <Text style={{color: appstyles.primaryColor, fontWeight: '600', fontSize: 13}}>Add Payment Details</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{marginLeft: 15}}>
                            <TouchableOpacity onPress={toggleBankDetails}>
                                <View style={styles.roundCompanyContainer}>
                                        <Text style={{color: appstyles.primaryColor, fontWeight: '600'}}>Company Bank Details</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 24, marginLeft: 15}}/>

                </View>    

                <Collapsible collapsed={isShowPay} align="center">
                      <View style={{flexDirection: 'column', width: width - 40, height: 180, marginLeft: 20, borderWidth: 0.2}}>

                        <View style={{width: width - 41, height: 35, backgroundColor: '#FBFBFB', justifyContent: 'center'}}>
                            <Text style={{fontSize: 16, fontWeight: '700', marginLeft: 10}}>Company Bank Detail</Text>
                        </View>

                        <View style={{flexDirection: 'column'}}>

                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{marginLeft: 10, fontSize: 16}}>Account No. </Text>
                                <Text style={{marginLeft: 46}}>:</Text>
                                <Text style={{marginLeft: 30}}>231445678</Text>
                            </View>


                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{marginLeft: 10, fontSize: 16}}>Acc Holder Name</Text>
                                <Text style={{marginLeft: 14}}>:</Text>
                                <Text style={{marginLeft: 30}}>ABC</Text>
                            </View>


                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{marginLeft: 10, fontSize: 16}}>IFSC Code</Text>
                                <Text style={{marginLeft: 65}}>:</Text>
                                <Text style={{marginLeft: 30}}>231445678</Text>
                            </View>


                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{marginLeft: 10, fontSize: 16}}>Branch</Text>
                                <Text style={{marginLeft: 90}}>:</Text>
                                <Text style={{marginLeft: 30}}>XYZ, Delhi</Text>
                            </View>

                        </View>
                </View>

                <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 15, marginLeft: 15}}/>
        
                </Collapsible>

                <Collapsible collapsed={isShow} align="center">
                      <View style={{flexDirection: 'column', width: width - 25, height: 280, marginLeft: 15, marginTop: 10}}>
                        
                      <View style={{width: width - 25, height: 35, backgroundColor: '#FBFBFB', justifyContent: 'center'}}>
                            <Text style={{fontSize: 16, fontWeight: '700', marginLeft: 10}}>Payment Details</Text>
                      </View>

                      <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', marginLeft: 10}}>
                                <View style={{flexDirection: 'column', marginTop: 8}}>
                                     <Text style={{fontWeight: '700'}}>Amount</Text>
                                     <TextInput 
                                        value={paymentDetail.amount}
                                        onChangeText={text => setPaymentDetails({...paymentDetail, amount: text})}
                                        style={{marginTop: 5, width: 150, height: 50, borderWidth: 1, borderRadius: 3, padding: 10, borderColor: '#C1C1C1', fontSize: 18}}
                                        placeholder={"Rs./-"}
                                        keyboardType={'number-pad'}
                                     />
                                </View>

                                <View style={{flexDirection: 'column', marginTop: 8, marginLeft: 20}}>
                                     <Text style={{fontWeight: '700'}}>Amount No.</Text>
                                     <TextInput 
                                        value={paymentDetail.amountNo}
                                        onChangeText={text => setPaymentDetails({...paymentDetail, amountNo: text})}
                                        style={{marginTop: 5, width: 150, height: 50, borderWidth: 1, borderRadius: 3, padding: 10, borderColor: '#C1C1C1', fontSize: 18}}
                                        placeholder={"Enter Acc No."}
                                        keyboardType={'number-pad'}
                                     />
                                </View>
                            </View>

                            <View style={{flexDirection: 'column', marginTop: 10, marginLeft: 10,}}>
                                 <Text style={{fontWeight: '700'}}>Transaction ID</Text>
                                 <TextInput 
                                    style={{marginTop: 5, width: 320, height: 50, borderWidth: 1, borderRadius: 3, padding: 10, borderColor: '#C1C1C1', fontSize: 18}}
                                    placeholder={"Enter Transaction ID"}
                                    value={paymentDetail.transaction}
                                    onChangeText={text => setPaymentDetails({...paymentDetail, transaction: text})}
                                    keyboardType={'number-pad'}
                                 />
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={() => 
                                    submit()
                                    }>
                                    <View style={{width: 220, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginTop: 20}}>
                                            <Text style={{fontSize: 18, fontWeight: '700', color: '#fff'}}>Submit</Text>
                                    </View>
                                 </TouchableOpacity>

                                 <TouchableOpacity onPress={() => {}}>
                                    <View style={{width: 80, height: 50, backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginTop: 20}}>
                                            <Text style={{fontSize: 18, color: appstyles.primaryColor}}>Cancel</Text>
                                    </View>
                                 </TouchableOpacity>
                            </View>


                      </View>

                        

                </View>

                <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 6, marginLeft: 8}}/>
        
                </Collapsible>

                <View style={{flexDirection: 'column', width: width, height: 150, marginLeft: 20}}>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <Text style={{fontSize: 16}}>Or pay using</Text>
                            <View style={{marginLeft: 16}}>
                              <SvgXml xml={xml.razerLogo}/>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            <TextInput 
                                placeholder={"Enter Amount Rs./-"}
                                value={RazorAmount}
                                onChangeText={text => setRazorAmount(text)}
                                keyboardType={'numeric'}
                                
                                style={{borderWidth: 0.7, width: 170, height: 45, borderRadius: 2, borderColor: '#C1C1C1', padding: 10, fontSize: 16}}
                            />
                            
                            <View style={{marginLeft: 30}}>
                                <TouchableOpacity onPress={() => onPay()}>
                                    <View style={{width: 100, height: 40, backgroundColor: appstyles.primaryColor, borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: '#fff', fontWeight: 'bold'}}>Pay</Text>
                                    </View>
                                </TouchableOpacity>
                             </View>
                        </View>

                        <View style={{marginTop: 16}}>
                             <Text style={{color: appstyles.primaryColor, fontSize: 12}}>Additional charge 3% of total amount.</Text>
                        </View>
                </View>

                <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 6, marginLeft: 8}}/>
        
                <View style={{width: width, flex: 1, flexDirection: 'column'}}>
                        <View style={{marginLeft: 20, marginTop: 5}}>
                            <Text style={{fontSize: 20}}>History</Text>
                        </View>

                    {
                        loading ?  <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={appstyles.primaryColor} />
                    </View> :  <View>
                    {
                        // console.log("Hello")
                        getData.map((value, index) => {
                            return (
                                <View key={index}  style={{flexDirection: 'column'}}>
                                <View style={styles.historyContainer}>
                                        {/* <SvgXml xml={xml.rightTick} width={18} marginTop={30} /> */}
                                        <View style={{flexDirection: 'column', marginTop: 24, position: 'absolute', left: 20, top: 0, right: 0, bottom: 0}}>
                                            <Text style={{fontSize: 14}}>{value.transaction}</Text>
                                            <Text style={{color: appstyles.grayColor, fontSize: 10}}>{value.date}</Text>
                                        </View>

                                        <View style={{marginTop: 24, marginLeft: 230}}>
                                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}>₹{value.amount}/-</Text>
                                            <Text style={{color: appstyles.grayColor}}>Pending</Text>
                                        </View>
                                </View>
                                <Image source={require('../assets/images/VectorLine.png')} style={{width: width, marginTop: 10,}}/>
                                </View>
                            );
                        })
                    }
                    </View>
                    }
                   
                </View>



            </ScrollView>
  
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,
    },
    addCardBtn: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: 120,
        height: 35,
        marginTop: 25,
        marginLeft: 134,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.95,
        paddingLeft: 20,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 4,
        borderRadius: 18,
   },
   historyContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
},
roundContainer: {
    width: 140, height: 30, borderRadius: 15,
    shadowColor: "transparent",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.10,
    shadowRadius: 1, 
    elevation: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
},
roundCompanyContainer: {
    width: 165, height: 30, borderRadius: 15,
    shadowColor: "transparent",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.10,
    shadowRadius: 1, 
    elevation: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
},
messageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
}
});

export default paymentDetailScreen
