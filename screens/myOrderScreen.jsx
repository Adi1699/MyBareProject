import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, Image, ScrollView, Dimensions, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import xml from '../componets/svgxml';
import { SvgXml } from 'react-native-svg';
import appstyles from '../styles/appstyles';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import NumberFormat from 'react-number-format';
import Modal from 'react-native-modal';
import { showMessage } from 'react-native-flash-message';
const {height, width} = Dimensions.get('window')

const myOrderScreen = (props) => {

    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;

    const { switchState } = React.useContext(AuthContext);

    const [orderList, setOrderList] = React.useState([]);
    const [wholesaleorderList, setWholesaleOrderList] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://167.172.236.197:8003/api/orders/retail/order-list/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            setTimeout(() => {
                setOrderList(res.data);
            },5000);
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    React.useEffect(() => {
        axios.get('http://167.172.236.197:8003/api/orders/order/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            setTimeout(() => {
                setWholesaleOrderList(res.data);
            },5000);
        })
        .catch(error => {
            console.log(error);
        })
    }, []);

    const [isOrderDetail, setOrderDetail] = React.useState(false);
    const [selectId, setSelectedId] = React.useState('');

    const toggleDetail = (orderID) => {
        setSelectedId(orderID);
        setOrderDetail(!isOrderDetail);
    }


    let extra_data = [];
    let truck = '';
    let delivery = '';
    let gst = '';
    let tcs = '';
    let loading_cost = '';
    let paidAmount = 0;
    let finalPrice = 0;
    let status = '';
    let remaining = 0;
    let id = 0;

    let totalorder = [];
    let totalQuantity = [];
    let brand = '';
    let hsnCode = '';
    let priceVar = [];
    let name = '';
    let bending = '';
    let tax = '';
    let insurance = '';
    let insuranceRate = '';
    let size = '';
    let price = undefined;
    let quantity = undefined;
    let coupon = [];
    let finalTotalItems = [];
    let sum = undefined;
    let quantityfinal = undefined;

    if ( switchState === true ) {
        wholesaleorderList.map((value, index) => {
            if ( selectId === value.id ) {
                extra_data = value.extra_data,
                truck = value.transporter.days_required,
                delivery = value.transportation_cost,
                gst = value.gst,
                tcs = Math.round(value.tcs),
                loading_cost = Math.round(value.loading_cost),
                paidAmount = Math.round(value.paid_amount),
                finalPrice = Math.round(value.final_price),
                status = value.status,
                id = value.id,
                insurance = value.insurance
                insuranceRate = value.insurance_percent,
                coupon = value.coupon_code
            }
        })

        extra_data.map((value, index) => {
            brand = value.brand,
            hsnCode = value.hsn_code,
            priceVar = value.price_varience,
            name = value.manufacturer_product.name,
            bending = value.manufacturer_product.extra_charges.bending
            tax = value.manufacturer_product.tax
        })

        priceVar.map((value, index) => {
            finalTotalItems.push({
                size: value.size,
                price: value.price,
                quantity: value.quantity,
            }) 
        })

        finalTotalItems.map((value, index) => {
            totalQuantity.push(value.quantity),
            totalorder.push(value.price)
        })
      
        quantityfinal = totalQuantity.reduce(function(prev, curr){
            return (Number(prev) || 0) + (Number(curr) || 0);
        }, 0);

        // console.log(totalorder)
        let covertedQuan = totalQuantity.map(i => Number(i));
        let finalpriceWithQuan = [];
        
        for (const key in totalorder, covertedQuan) {
            finalpriceWithQuan.push(covertedQuan[key] * totalorder[key]) 
        }
    
        sum = finalpriceWithQuan.reduce(function(a, b){
            return a + b;
        }, 0);

        remaining = finalPrice - paidAmount;

    } else {
        orderList.map((value, index) => {
            if ( selectId === value.id ) {
                extra_data = value.extra_data,
                truck = value.truck_type.days_required,
                delivery = value.transportation_cost,
                gst = value.gst,
                tcs = Math.round(value.tcs),
                loading_cost = Math.round(value.loading_cost),
                paidAmount = Math.round(value.paid_amount),
                finalPrice = Math.round(value.final_price),
                status = value.status,
                id = value.id
            }

        })

        extra_data.map((value, index) => {
            brand = value.brand,
            hsnCode = value.hsn_code,
            priceVar = value.price_varience,
            name = value.retailer_product.name,
            bending = value.retailer_product.extra_charges.bending
            tax = value.retailer_product.tax
        })

        priceVar.map((value, index) => {
            finalTotalItems.push({
                size: value.size,
                price: value.price,
                quantity: value.quantity
            })
        })
        

        priceVar.map((value, index) => {
            totalQuantity.push(value.quantity)
            totalorder.push(value.price)
        })

        let finalpriceWithQuan = [];
        for (const key in totalorder, totalQuantity) {
            finalpriceWithQuan.push(totalQuantity[key] * totalorder[key])
        }     
        
        sum = finalpriceWithQuan.reduce(function(a, b){
            return a + b;
        }, 0);

        quantityfinal = totalQuantity.reduce(function(a, b){
            return a + b;
        }, 0);

        remaining = finalPrice - paidAmount;
    }

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

    const remainingPayment = async() => {
        await axios.get(`http://167.172.236.197:8003/api/orders/retail/order/${id}/pay/remaining/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }   

    const remainingPaymentWholesale = async() => {
        await axios.get(`http://167.172.236.197:8003/api/orders/order/${id}/pay/remaining/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }   

    // Wholesale orderlist
    let finalOrderlist = [];
    if ( switchState === true ) {
        wholesaleorderList.map((value, index) => {
            finalOrderlist.push({
                orderid: value.id,
                orderDate: value.date,
                orderStatus: value.status
            })
        })
    } else {
        orderList.map((value, index) => {
            finalOrderlist.push({
                orderid: value.id,
                orderDate: value.date,
                orderStatus: value.status
            })
        })
    }

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },6000)  
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.txtTitle}>My Order</Text>
            </View>  
            
            <View style={{flex: 1, alignSelf: 'flex-start', width: width}}>
                 <Text style={{fontSize: 20, marginLeft: 20, marginTop: 20}}>Order History</Text>
                                        {
                            loading ?  <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={appstyles.primaryColor} />
                        </View> :    <ScrollView>
                        {
                            finalOrderlist.map((value, index) => {
                                return (
                                    <View key={index} style={{flexDirection: 'column'}}>
                                    <View style={styles.bottomContainer}>
                                                <View style={styles.historyContainer}>
                                                 <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1, marginLeft: 10}}>
                                                <SvgXml xml={xml.rightTick} width={18} marginTop={30}/>
                                                <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between', flex: 1}}>
                                                    <View style={{flexDirection: 'column', marginTop: 24}}>
                                                    <TouchableOpacity onPress={() => toggleDetail(value.orderid)}>
                                                        <Text style={{fontSize: 16}}>#ORDER{value.orderid}</Text>
                                                     </TouchableOpacity>
                                                        <NumberFormat
                                                            value={value.orderDate}
                                                            displayType={'text'}
                                                            format="####/##/##"
                                                            mask={['M', 'M', 'Y', 'Y']}
                                                            renderText={formattedValue => <Text style={{color: appstyles.grayColor}}>{formattedValue}</Text>} 
                                                            />
                                                    </View>
    
                                                    <View style={{marginTop: 24, marginRight: 10}}>
                                                        <Text style={{fontSize: 16, alignSelf: 'flex-end'}}>{value.orderStatus}</Text>
                                                    </View>
                                                </View>
                                        </View>
                                        </View>
                                    </View>
                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: 330, marginTop: 10, marginLeft: 10}}/>
                               </View>
                                );
                            })
                        }
                        </ScrollView>
                        }
                        
                     
            </View>
        
            <Modal isVisible={isOrderDetail} style={{backgroundColor: '#fff', margin: 0, alignItems: undefined, justifyContent: undefined}}>
                        <View style={{ flex: 1}}>
                            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1}}>
                            <ScrollView horizontal={false}>   

                                <View style={{width: width, height: 60, backgroundColor: '#F7F7F7', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 20, marginLeft: 20}}>Order Details</Text>
                                        <Text style={{fontSize: 16, marginLeft: 20, color: appstyles.grayColor}}>ORDER ID: ORDER{id}</Text>
                                </View>

                                        {
                                            finalTotalItems.map((value, index) => {
                                                return (      
                                                        <View key={index} style={{width: width, height: 150, backgroundColor: '#fff', flexDirection: 'row', marginTop: 8}}>
                                                        <View style={{width: 6, height: 155, backgroundColor: appstyles.primaryColor}}></View>
                                                        <View style={{flexDirection: 'column', marginTop: 5}}>
                                                                <View style={{flexDirection: 'row', width: width}}>
                                                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                                <Text style={{color: appstyles.tabGray}}>BRAND</Text>
                                                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{brand}</Text>
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 135}}>
                                                                                <Text style={{color: appstyles.tabGray}}>PRODUCT</Text>
                                                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{name}</Text>
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 270 }}>
                                                                                <Text style={{color: appstyles.tabGray}}>HSN CODE</Text>
                                                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{hsnCode}</Text>
                                                                        </View>
                                                                </View>
                                        
                                                                <View style={{flexDirection: 'row', marginTop: 8}}>
                                                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                                <Text style={{color: appstyles.tabGray}}>SIZE</Text>
                                                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.size}</Text>
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', position: 'absolute', right: 0, bottom: 0, top: 0, left: 135}}>
                                                                                <Text style={{color: appstyles.tabGray}}>QUANTITY</Text>
                                                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700',}}>{value.quantity} {switchState ? 'Pcs' : 'KG'}</Text>
                                                                        </View>
                                                                </View>
                                        
                                                                <View style={{flexDirection: 'row', marginTop: 8}}>
                                                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                                <Text style={{color: appstyles.tabGray}}>PRICE</Text>
                                                                                <NumberFormat
                                                                                    value={value.price}
                                                                                    displayType={'text'}
                                                                                    thousandSeparator={true}
                                                                                    prefix={'₹'}
                                                                                    renderText={formattedValue => <Text style={{fontSize: 16, fontWeight: '700', color: appstyles.primaryColor}}>{formattedValue}</Text>} // <--- Don't forget this!
                                                                                    />
                                                                            
                                                                        </View>
                                                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 134}}>
                                                                                <Text style={{color: appstyles.tabGray}}>TOTAL AMOUNT</Text>
                                                                                <NumberFormat
                                                                                    value={value.price * value.quantity}
                                                                                    displayType={'text'}
                                                                                    thousandSeparator={true}
                                                                                    prefix={'₹'}
                                                                                    renderText={formattedValue => <Text style={{fontSize: 16, fontWeight: '700', color: appstyles.primaryColor}}>{formattedValue}</Text>} // <--- Don't forget this!
                                                                                    />
                                                                            
                                                                        </View>
                                                                </View>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        }

                    
                                <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15, marginLeft: 5}}/>
                                
                                <View style={{width: width - 10, height: 130, borderRadius: 5, borderWidth: 0.5, marginLeft: 3, justifyContent: 'space-evenly'}}>
                                <View style={{marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 14, color: '#424649'}}>Order Total:</Text>
                                        <NumberFormat
                                            value={sum}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 14, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>
                                    {
                                        switchState ? <View style={{marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>Coupon Applied:</Text>
                                        <NumberFormat
                                            value={bending}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                        </View> :  <View style={{marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{fontSize: 16, color: '#424649'}}>bending</Text>
                                            <NumberFormat
                                                value={bending}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'₹'}
                                                renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                                />
                                        </View>
                                    }
                    
                                    <View style={{marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 14, color: '#424649'}}>{name}(GST):</Text>
                                        <NumberFormat
                                            value={tax}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'%'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <View style={{marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>Delivered In</Text>
                                        <NumberFormat
                                            value={truck}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>
                                </View>


                                <View style={{width: width, height: 60, backgroundColor: '#F7F7F7', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 20, marginLeft: 20}}>Billing</Text>
                                </View>

                                <View style={{flex: 1, width: width - 10, borderWidth: 0.5, borderRadius: 5, marginLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{flexDirection: 'column', marginLeft: 5}}>
                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>TOTAL QUANTITY</Text>
                                        <Text style={{fontSize: 16, marginRight: 20}}>{quantityfinal} {switchState ? 'Pcs' : 'KG'}</Text>
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>ORDER TOTAL</Text>
                                        <NumberFormat
                                            value={sum}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    {
                                        switchState ?  <View></View> : <View style={{flexDirection: 'column'}}>
                                        <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>
                                    </View>
                                    }


                                    {
                                        switchState ?   <View style={{flexDirection: 'column'}}>
                                        <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                        <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                            <Text style={{fontSize: 16, color: '#424649'}}>INSURANCE({insuranceRate}%)</Text>
                                            <NumberFormat
                                                value={insurance}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'₹'}
                                                renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                                />
                                        </View>

                                        <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>
                                    </View> : <View></View>
                                    }
                                  
                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>TRANSPORTAION COST</Text>
                                        <NumberFormat
                                            value={delivery}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>LOADING COST</Text>
                                        <NumberFormat
                                            value={loading_cost}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>TOTAL GST</Text>
                                        <NumberFormat
                                            value={gst}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>TCS</Text>
                                        <NumberFormat
                                            value={tcs}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: '#424649'}}>TOTAL AMOUNT</Text>
                                        <NumberFormat
                                            value={finalPrice}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>PAID AMOUNT</Text>
                                        <NumberFormat
                                            value={paidAmount}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, fontWeight: '700', marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 3, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>REMAINING AMOUNT</Text>
                                        <NumberFormat
                                            value={remaining}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, fontWeight: '700', marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>    
                                </View>

                                <View style={{width: width - 20, height: 50, backgroundColor: '#F7F7F7', borderRadius: 8, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>ORDER STATUS: {status}</Text>
                                </View>

                                <View style={{alignSelf: 'flex-start', marginLeft: 5, marginTop: 15}}>
                                    <Text>Available Credits</Text>
                                </View>
                             
                                {
                                    AVAILABLE_Credits <= finalPrice ?  
                                    <View style={{flexDirection: 'column'}}>
                                        <View style={{width: width - 20, height: 70, backgroundColor: '#F8D7DA', borderRadius: 8, marginTop: 8, justifyContent: 'center', marginBottom: 20}}>
                                                <View style={{marginLeft: 20, marginTop: 5}}>
                                                    <NumberFormat
                                                        value={AVAILABLE_Credits}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        prefix={'Rs.'}
                                                        renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20, color: '#77232B'}}>{formattedValue}</Text>} // <--- Don't forget this!
                                                        />
                                                    <Text style={{color: appstyles.tabGray}}>Insufficient credit available.</Text>
                                                </View>
                                    </View> 
                                    <View style={{alignSelf: 'flex-start', marginLeft: 8, marginTop: 20, marginBottom: 20}}>
                                                    <TouchableOpacity onPress={() => props.navigation.navigate("Payment")}>
                                                        <View style={{width: 150, height: 50, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                                                            <Text style={{fontSize: 18, color: '#fff'}}>Make Payment</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                    </View>
                            </View>
                                   : 
                                    <View style={{alignSelf: 'flex-start', marginLeft: 10}}>
                                    <View style={{width: 150, height: 60, borderRadius: 8, backgroundColor: '#D4EDDA', alignSelf: 'flex-start', marginTop: 8, marginLeft: 5, justifyContent: 'center'}}>
                                    <View style={{marginLeft: 20}}>
                                        <NumberFormat
                                            value={AVAILABLE_Credits}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'Rs.'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20, color: '#1A5B29'}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                        </View>
                                </View>
                                {
                                    remaining === 0 ? <View style={{width: width - 50, height: 50, borderRadius: 8, backgroundColor: '#D4EDDA', marginTop: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 18, color: '#1A5B29'}}>Payment Completed</Text>
                                    </View> : <View style={{alignSelf: 'flex-start', marginLeft: 8, marginTop: 20, marginBottom: 20}}>
                                    <TouchableOpacity onPress={async() => {
                                        if ( switchState === true ) {
                                            remainingPaymentWholesale();
                                            showMessage({
                                                message: "Payment Completed",
                                                type: 'success',
                                                duration: 3000,
                                                icon: 'success',
                                                style: styles.messageContainer,
                                                color: '#fff',
                                                animationDuration: 300,
                                                backgroundColor: '#28A745',
                                            })
                                        } else {
                                            remainingPayment();
                                            showMessage({
                                                message: "Payment Completed",
                                                type: 'success',
                                                duration: 3000,
                                                icon: 'success',
                                                style: styles.messageContainer,
                                                color: '#fff',
                                                animationDuration: 300,
                                                backgroundColor: '#28A745',
                                            })
                                        }   
                                    }}>
                                        <View style={{width: 150, height: 50, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                                            <Text style={{fontSize: 18, color: '#fff'}}>Pay</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                }
                               
                            </View>
                        }

                                </View>

                                <View style={{alignSelf: 'flex-end', marginTop: 20, marginRight: 10, marginBottom: 20}}>
                                    <TouchableOpacity onPress={toggleDetail}>
                                        <View style={{width: 100, height: 50, backgroundColor: '#5A6268', justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                                            <Text style={{fontSize: 18, color: '#fff'}}>Close</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                             </ScrollView> 
                            </View>
                        </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,
    },
    upperContainer: {
        flexDirection: 'row',
        backgroundColor: appstyles.white,
        marginTop: 50,
    },
    upperBottomContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    bottomContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },
    historyContainer: {
        flexDirection: 'row',
        width: width,
        height: 60,
        // backgroundColor: 'red'
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
        elevation: 6,
        },
        txtTitle: {
            marginTop: 8,
            marginLeft: 20,
            fontWeight: 'bold',
            fontSize: 18,
            color: '#27304D'
            },
            messageContainer: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }    
});

export default myOrderScreen
