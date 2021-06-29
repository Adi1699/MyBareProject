import React from 'react'
import { SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Text, FlatList, Image, TextInput } from 'react-native'
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import { useSelector, useDispatch } from 'react-redux';
import * as cartWholesaleActions from '../redux/actions/cartWholeSale';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';
import Modal from 'react-native-modal';
import { TouchableRipple } from 'react-native-paper';
import { AuthContext } from '../componets/context';
import {Picker} from '@react-native-picker/picker';
import NumberFormat from 'react-number-format';
import { showMessage } from 'react-native-flash-message';
// Components
import Header from '../componets/header';
import appstyles from '../styles/appstyles';
import axios from 'axios';
import { connect } from 'react-redux';
import { removeFromCartWholesale } from '../redux/actions/cartWholeSale';

const {height, width} = Dimensions.get('window')

const _orderScreen = (props) => {
   
    const { cartWholeSale, removeFromCartWholesale } = props;

    const onTapRemoveFromCart = (product) => {
        removeFromCartWholesale(product)
    }

    // console.log(props)

    let wholesaleVarient = props.route.params.productWholesaleVarient;
    let wholesaleVarientPrice = props.route.params.productWholesalePrice;
    let wholesaleVarientComm = props.route.params.productWholesaleComm;
    let wholesaleVarientId = props.route.params.productWholesale;
    let wholesaleManufactureId = '';
    
    wholesaleManufactureId = props.route.params.productWholesaleCartId;

    // Handling Transport Checkboxs
    const [checkboxValue, setCheckboxValue] = React.useState([
        {
            label: 'Trailer',
            value: 'trailer',
            checked: false
        },
        {
            label: 'Truck',
            value: 'truck',
            checked: false
        },
        {
            label: 'All',
            value: 'all',
            checked: false
        },
        {
            label: 'Other',
            value: 'other',
            checked: false
        },
    ])

    let chooseVehicle = '';
    checkboxValue.map((value) => {
        // console.log('Hello')
        if ( value.checked === true) {
            chooseVehicle = value.label
        }
        // console.log(value.checked)
    })

    const checkboxHandler = (value, index) => {
        const newValue = checkboxValue.map((checkbox, i) => {
         if (i !== index)
           return {
             ...checkbox,
             checked: false,
           }
         if (i === index) {
           const item = {
             ...checkbox,
             checked: !checkbox.checked,
           }
           return item
         }
        return checkbox
      })
      setCheckboxValue(newValue)
      }    

    const [isSelect, setOnSelected] = React.useState(false);
    const [selectAddress, setSelectedAddress] = React.useState([]);
    const [addressSecond, setAddressSecond] = React.useState([]);
    const dispatch = useDispatch();

    let manufacturerOrderId = '';
   
    manufacturerOrderId = props.route.params.productWholesale;
    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;
 
    const [userAddressDetail, setUserAddressDetails] = React.useState({
        name: '',
        phone: '',
        address: '',
        pincode: undefined,
        city: '',
        state: '',
    });

    const { switchState } = React.useContext(AuthContext);

    // New Address Model
    const [isAddressModelVisible, setAddressBarVisible] = React.useState('');
    const toggleAddressModel = () => {
        setAddressBarVisible(!isAddressModelVisible);
    }

    // Order details
    let finalCartItem = [];
    if ( switchState === true ) {
        for (const key in cartWholeSale.items) {
            cartWholeSale.items[key].map((value, index) => {
                if ( value.userToken === token ) {
                    finalCartItem.push({
                        ProductID: value.itemCartItemId,
                        ProductName: value.itemCartItemTitle,
                        ProductValue: value.itemCartItemQuantity,
                        ProductSize: value.itemCartItemVariant,
                        ProductImageURL: value.itemCartItemImage,
                        ProductPrize: value.itemCartItemPrice,
                        ProductQuantity: value.itemCartItemQuantity,
                        ProductBrand: value.itemCartItemBrand,
                        ProductHSN: value.itemCartItemHSNCode,
                        ProductCategoryName: value.itemCartItemCategory,
                        ProductCatgoryId: value.itemCartItemID,
                        ProductCategorySub: value.itemCartItemSub,
                        ProductMainId: value.itemCartProductID,
                        ProductTotal: value.itemCartItemTotal
                    })
                }
            })
        }
    }

    // const cartItems = useSelector(state =>  {
    //     const transformedCartItem = [];
    //     for (const key in state.cart.items) {
    //         transformedCartItem.push({
    //             productId: key,
    //             itemCartTitle: state.cart.items[key].productTitle,
    //             itemCartPrice: state.cart.items[key].productPrice,
    //             quantity: state.cart.items[key].quantity,
    //             itemCartSum: state.cart.items[key].sum,
    //             itemCartVariant: state.cart.Size[key],
    //             itemCartImage: state.cart.items[key].productImage,
    //             itemCartHSNCode: state.cart.HSNCode[key],
    //             itemCartBrand: state.cart.Brand[key],
    //             itemCartCategory: state.cart.Category[key],
    //             itemCartCategoryID: state.cart.CategoryID[key],
    //             itemCartSubCategory: state.cart.SubCategory[key],
    //             itemCartRetailerProductID: state.cart.ProductID[key]
    //         });
    //     }
    //     return transformedCartItem.sort((a, b) => 
    //       a.productId > b.productId ? 1 : -1
    //     );
    // });

    // const cartWholesaleItems = useSelector(state => {
    //     const transformedWholesaleCartItem = [];
    //     for (const key in state.cartWholeSale.items) {
    //         transformedWholesaleCartItem.push({
    //             productWholesaleId: key,
    //             itemCartWholesaleTitle: state.cartWholeSale.items[key].productTitle,
    //             itemCartWholesalePrice: state.cartWholeSale.items[key].productPrice,
    //             quantityWholesale: state.cartWholeSale.items[key].quantity,
    //             itemCartWholesaleSum: state.cartWholeSale.items[key].sum,
    //             itemCartWholesaleVariant: state.cartWholeSale.Size[key],
    //             itemCartWholesaleImage: state.cartWholeSale.items[key].productImage,
    //             itemCartWholesaleHSNCode: state.cartWholeSale.HSNCode[key],
    //             itemCartWholesaleBrand: state.cartWholeSale.Brand[key],
    //             itemCartWholesaleCategory: state.cartWholeSale.Category[key],
    //             itemCartWholesaleCategoryID: state.cartWholeSale.CategoryID[key],
    //             itemCartWholesaleSubCategory: state.cartWholeSale.SubCategory[key],
    //             itemCartWholesaleProductID: state.cartWholeSale.ProductID[key]
    //         });
    //     }
    //     return transformedWholesaleCartItem.sort((a, b) => 
    //         a.productId > b.productId ? 1 : -1
    //     );
    // });

    // let finalCartItem = [];
    // if ( switchState === true ) {
    //     cartWholesaleItems.map((value, index) => {
    //         finalCartItem.push({
    //             ProductID: value.productWholesaleId,
    //             ProductName: value.itemCartWholesaleTitle,
    //             ProductValue: value.quantityWholesale,
    //             ProductSize: value.itemCartWholesaleVariant,
    //             ProductImageURL: value.itemCartWholesaleImage,
    //             ProductPrize: value.itemCartWholesalePrice,
    //             ProductQuantity: value.quantityWholesale,
    //             ProductBrand: value.itemCartWholesaleBrand,
    //             ProductHSN: value.itemCartWholesaleHSNCode
    //         })
    //     })
    // } else {
    //     cartItems.map((value, index) => {
    //         finalCartItem.push({
    //             ProductID: value.productId,
    //             ProductName: value.itemCartTitle,
    //             ProductValue: value.quantity,
    //             ProductSize: value.itemCartVariant,
    //             ProductImageURL: value.itemCartImage,
    //             ProductPrize: value.itemCartPrice,
    //             ProductQuantity: value.quantity,
    //             ProductBrand: value.itemCartBrand,
    //             ProductHSN: value.itemCartHSNCode,
    //         })
    //     })
    // }

      // Backend Intgration 
      let itemHSNCode = '';
      let categoryName = '';
      let categoryID = undefined;
      let ProductWeight = 0;
      let itemSize = [];
      let productPrice = undefined;
      let itemQuantity = [];
      let WholesaleProductId = undefined;
      let ProdID = undefined;
      let WholesaleSub = [];
      let itemBrand = '';
      let finalPrice = [];
      finalCartItem.map((value, index) => {
          ProductWeight = value.ProductQuantity
          itemSize.push(value.ProductSize),
          itemHSNCode = value.ProductHSN,
          categoryID = value.ProductCatgoryId
          itemQuantity.push(value.ProductQuantity),
          WholesaleProductId = value.ProductMainId,
          categoryName = value.ProductCategoryName,
          WholesaleSub = value.ProductCategorySub,
          productPrice = value.ProductPrize,
          ProdID = value.ProductMainId,
          itemBrand = value.ProductBrand,
          finalPrice.push(value.ProductTotal)
      })

    //   console.log(finalPrice)

    let sum = finalPrice.reduce(function(a, b){
        return a + b;
    }, 0);


    let quantity = itemQuantity.reduce(function(prev, curr){
        return (Number(prev) || 0) + (Number(curr) || 0);
    });


    const [temp, setTemp] = React.useState([]);
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
    let pincode = '';
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


    // console.log(manufacturerOrderId)

    const [transporter, setTransporter] = React.useState([]);
    const processedOrder = async() => {
        await axios.post(`http://167.172.236.197:8003/api/orders/transporters/${manufacturerOrderId}/`, {
            "state": `${orderPlaceAddress}`,
            "weight": `${ProductWeight}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setTransporter(res.data);
            // console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        }) 
    }

    let trackName = '';
    let truckType = false;
    transporter.map((value, index) => {
        trackName = value.truck_name,
        truckType = value.trailer
    });

    let showVehicle  = false;
    let otherVehicle = false;
    if (chooseVehicle === 'All' || truckType === true && chooseVehicle === 'Trailer') {
         showVehicle = true;
    } else if (chooseVehicle === 'All' || truckType === false && chooseVehicle === 'Truck') {
        showVehicle = true;
    } else if (chooseVehicle === 'All' || truckType === false && chooseVehicle === 'Other') {
        showVehicle = false;
    } else {
        showVehicle = false;
    }

    if ( chooseVehicle === 'Other' ) {
        otherVehicle = true;
    } else {
        otherVehicle = false;
    }

    const [customerVehicle, setCustomerVehicle] = React.useState({
        company: "",
        phone: "",
        email: "",
        address: ""
    });

    const [note, setNote] = React.useState('');

    const [isTransportModelVisible, setTransportBarVisible] = React.useState(false);

    const toggleTransportModel = () => {
        setTransportBarVisible(!isTransportModelVisible);
    }


    let truckId = undefined;
    let truckName = '';
    let capacity = undefined;
    let trailer = false;
    let price = undefined;
    let local_transport = false;
    let guarantee = undefined;
    let variance = undefined;
    let transport = undefined;
    let transporterDetail = [];
    let email = '';
    let company = '';
    let final_price = undefined;
    let truck_qty = undefined;

    transporter.map((value, index) => {
        truckId = value.id,
        truckName = value.truck_name, 
        capacity = value.capacity,
        trailer = value.trailer,
        price = value.price,
        local_transport = value.local_transport,
        guarantee = value.guarantee_capacity,
        variance = value.variance_price,
        transport = value.transport,
        transporterDetail = value.transporter,
        final_price = value.price
    })

    company =  transporterDetail.company;
    email = transporterDetail.email;


    let finalTraspoter = [];
    transporter.map((value, index) => {
        finalTraspoter.push({
            id: value.id,
            name: value.truck_name,
            type: value.type,
            price: value.price,
            checked: false
        })
    })

    // Handling Items
    const [transporterId, setTransporterId] = React.useState(undefined);
    const [selectChecked, setSelectChecked] = React.useState(false);
    const toggleItem = (itemId, checked) => {
        setTransporterId(itemId)
        setSelectChecked(checked)
        setSelectChecked(!selectChecked);
    }

    const [product, setProduct] = React.useState({});
    async function prod () {
        try {
            const res = await axios.get('http://167.172.236.197:8003/api/products/product/')
            let productArray = [...res.data]
            setProduct(productArray);
        } catch (e) {
            console.log(e);
        }
    }

    let items = [];
    for (const key in product) {
        if (product[key].id === WholesaleProductId) {
            items.push({
                itemID: product[key].id,
                itemSubCategory: product[key].sub_category,
                itemTitle: product[key].name,
                itemPrice: product[key].manufacturers,
                itemCategory: product[key].category,
                itemTax: product[key].tax,
                itemUser: product[key].user,
                itemTime: product[key].time,
                itemExtraCharge: product[key].extra_charge,
                itemCategorySub: product[key].category
            })
        }
    }

    React.useEffect(() => {
        prod()
    })



    // console.log(wholesaleVarient)

    // let selectitemId = undefined;
    // let selectitemSize = '';
    let selectitemBrand = '';
    // let selectitemPrice = undefined;
    // let selectitemWeight = undefined;
    // let selectitemQuantity = undefined;


    let WholesaleitemId = undefined;
    let WholesaleitemProduct = undefined;
    let WholsaleitemUser = '';
    let WholsaleitemPrice = undefined;
    let WholesaleitemExtra_Charge = undefined
    let WholesaleitemExtra_Charges = []
    let bending = '';
    let cutting = undefined;
    let itemTax = undefined;
    let itemMeasurningUnit = '';
    let itemWeightKg = false;
    let itemTime = '';
    let itemDiscount = undefined;
    let itemName =  '';
    // let itemQuantity = '';
    let WholesaleitemBrand = '';
    let itemPriceVarience = [];
    let finalUserID = '';
    // let WholesaleSub = [];


    {
        if ( WholesaleProductId != null ) {

            items.map((value, index) => {
                itemName = value.itemTitle,
                itemTax = value.itemTax,
                WholsaleitemUser = value.itemUser,
                itemTime = value.itemTime,
                WholesaleitemExtra_Charges = value.itemExtraCharge,
                itemWeightKg = value.weight_in_kg
            })

            items.map((value, index) => {
                value.itemPrice.map((value, index) => {
                         WholesaleitemId = value.id,
                         WholsaleitemPrice = value.price
                         itemMeasurningUnit = value.max_quantity,
                         itemDiscount = value.discount,
                         selectitemBrand = value.brand,
                         itemPriceVarience = value.price_varience,
                         WholesaleitemExtra_Charge = value.extra_charge
                })
            })

            cutting = WholesaleitemExtra_Charges.cutting;
            bending = WholesaleitemExtra_Charges.bending;        
        } else {

        }
    }

    const [order, setOrder] = React.useState([]);
    const createOrder = async() => {
        await axios.post('http://167.172.236.197:8003/api/orders/order/', {
                "truck_type": transporterId,
                "manufacturer": `${manufacturerOrderId}`,
                "user": `${wholesaleManufactureId}`,
                "custom_transporter":{
                    "company": `${customerVehicle.company}`,
                    "email": `${customerVehicle.email}`,
                    "phone": `${customerVehicle.phone}`,
                    "address": `${customerVehicle.address}`
                },
                "note_manufacturer":"",
                     "note_transporter": `${note}`,
                "product": "",
                "sizes": itemSize,
                "quantity": itemQuantity,
                "coupon_code":null,
                "shipping_address":{
                "contacts":[
                {
                    "name": `${name}`,
                    "phone": `${phone}`
                }
                ],
                "state": `${state}`,
                "pincode": `${pincode}`,
                "city": `${city}`,
                "town":"",
                "address": `${UserAdress}`
                },
                "product_details":[
                {
                    "brand": `${itemBrand}`,
                    "category":{
                    "id": categoryID,
                    "category": `${categoryName}`,
                    "sub_category":[
                        `${WholesaleSub}`
                    ]
                },
                "hsn_code": `${itemHSNCode}`,
                "product_id": ProdID,
                "price_varience": wholesaleVarient,
            "manufacturer_product":{
                "id": WholesaleitemId,
                "price": WholsaleitemPrice,
                "wholesale_commission": wholesaleVarientComm,
                "discount": itemDiscount,
                "extra_charge": WholesaleitemExtra_Charge,
                "max_quantity": `${itemMeasurningUnit}`,
                "time": `${itemTime}`,
                "product": WholesaleProductId,
                "user": `${manufacturerOrderId}`,
                "brand": `${itemBrand}`,
                "price_variance": itemPriceVarience,
                "extra_charges":{
                "bending": `${bending}`,
                "cutting": cutting
               },
                "tax": itemTax,
                "measuring_unit": `${itemMeasurningUnit}`,
                "name": `${itemName}`,
                "weight_in_kg": itemWeightKg
                },
                "truck_type_data":{
                    "id": truckId,
                    "truck_name": `${truckName}`,
                    "capacity": capacity,
                    "trailer": trailer,
                    "price": price,
                    "local_transport": local_transport,
                    "guarantee_capacity": guarantee,
                    "variance_price": variance,
                    "transport": transport,
                    "transporter":{
                    "email": `${email}`,
                    "company": `${company}`,
                "contacts":[
                ]
             },
                "final_price": price,
                "truck_qty":1
              }
             }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            setOrder(res.data);
            console.log(res.data);
        }).
        catch(error => {
            console.log(error);
        })
    };

    let orderCost = Math.round(order.final_price); 
    // console.log(orderCost / 10)
    let roundOffPrice = orderCost / 10;
    let orderLoading = order.loading_cost; 
    let orderGst = order.gst; 
    let delivery = order.transportation_cost; 
    let orderId = order.id;
    let insurance = order.insurance;
    let insuranceRate = order.insurance_percent;

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
    },[])

    let AVAILABLE_Credits =  Math.round(userCredit);

    const confirmOrder = async() => {
        await axios.get(`http://167.172.236.197:8003/api/orders/order/${orderId}/confirm/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            console.log(res.data);
        }).
        catch(error => {
            console.log(error);
        });
    }

     // Deleting from backend
     const deleteFromBackendCartWholesale = async () => {
        await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
            "cart": {
                "r": {
                    "orders": [
                    ]
                },
                "w": {
                    "orders": []
                }
            },
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const removeItem = (ProductID) => {
        dispatch(cartWholesaleActions.deleteCartWholesaleItem(ProductID));  
        deleteFromBackendCartWholesale(); 
    }

    const [isReview, setReviewSection] = React.useState(false);
    const toggleReview = () => {
        setReviewSection(!isReview);
    }



    return (
        <SafeAreaView style={styles.container}>
            <Header title={"Order"} onPress={() => 
                props.navigation.goBack(null)
            }/>

            <ScrollView horizontal={false}>   
            <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: 10}}>
                <Text style={{fontSize: 20, color: appstyles.primaryColor, fontWeight: 'bold'}}>Order Details : </Text>
            </View>    

            {
                finalCartItem.map((value, index) => {
                    return (
                        <View key={index} style={{width: width, height: 150, backgroundColor: '#fff', flexDirection: 'row', marginTop: 8}}>
                        <View style={{width: 6, height: 150, backgroundColor: appstyles.primaryColor}}></View>
                        <View style={{flexDirection: 'column', marginTop: 5}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                <Text style={{color: appstyles.tabGray}}>BRAND</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductBrand}</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 135}}>
                                                <Text style={{color: appstyles.tabGray}}>PRODUCT</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductName}</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 270 }}>
                                                <Text style={{color: appstyles.tabGray}}>HSN CODE</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductHSN}</Text>
                                        </View>
                                </View>
        
                                <View style={{flexDirection: 'row', marginTop: 8}}>
                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                <Text style={{color: appstyles.tabGray}}>SIZE</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductSize}</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', position: 'absolute', right: 0, bottom: 0, top: 0, left: 135}}>
                                                <Text style={{color: appstyles.tabGray}}>QUANTITY</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700',}}>{value.ProductQuantity} KG</Text>
                                        </View>
                                </View>
        
                                <View style={{flexDirection: 'row', marginTop: 8}}>
                                        <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                <Text style={{color: appstyles.tabGray}}>PRICE</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>₹{value.ProductPrize}.00</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 134}}>
                                                <Text style={{color: appstyles.tabGray}}>TOTAL AMOUNT</Text>
                                                <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>₹{value.ProductTotal}.00</Text>
                                        </View>
                                </View>
                        </View>
                    </View>
                    );
                })
            }

            <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 15, marginLeft: 10}}/>

            <View style={{alignSelf: 'flex-start', marginLeft: 20, marginTop: 10, flexDirection: 'row', width: width}}>
                <Text style={{fontSize: 20, color: appstyles.primaryColor, fontWeight: '700'}}>Add Delivery Info</Text>
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

            <View style={{alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column', width: width, height: 200}}>
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

            <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 15, marginLeft: 10}}/>

            </ScrollView> 
            
            <TouchableRipple
                style={styles.btnCart} 
                onPress={async () => {
                    processedOrder()
                    toggleTransportModel();
                }}>
                <Text style={{color: appstyles.white, fontSize: 18}}>Save</Text>
            </TouchableRipple>

            {/* Transport */}
            <Modal isVisible={isTransportModelVisible} animationIn={'fadeInDown'} animationOut={'fadeOutDown'}>
            <View style={{backgroundColor: '#FBFBFB', width: 340, height: 500, borderRadius: 25, alignItems: 'center', marginLeft: -5}}>
                            <View style={styles.modelHeader}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5}}>
                                     <Text style={{color: appstyles.primaryColor, fontSize: 20, fontWeight: 'bold'}}>Available Transporters</Text>
                                </View>
                                <View style={{alignSelf: 'center', flex: 1, alignItems: 'flex-end', marginRight: 20}}>
                                    <TouchableOpacity onPress={toggleTransportModel}>
                                        <SvgXml xml={xml.cross} width={18} height={18}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView>
                            <View style={{alignSelf: 'flex-start', marginLeft: 5, marginTop: 10}}>
                                <View style={{flexDirection: 'row', marginTop: 6}}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate("FeedBack")}>
                                    <Text style={{fontSize: 12, textDecorationLine: 'underline', color: '#878787'}}>Contact Us</Text>
                                    </TouchableOpacity>
                                    <Text style={{fontSize: 12, marginLeft: 5, color: '#878787'}}>for more clarification on transport services.</Text>
                                </View>
                            </View>    

                            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', marginTop: 20, width: width, marginLeft: 30}}>

                                    <View style={{flexDirection: 'row', marginLeft: -20}}>
                                        {
                                            checkboxValue.map((checkbox, i) => (
                                                <View key={i} style={{marginLeft: 5}}>
                                                    <CircleCheckBox 
                                                        checked={checkbox.checked}
                                                        outerColor={'#192341'}
                                                        innerColor={'#192341'}  
                                                        label={checkbox.label}
                                                        styleLabel={styles.label}
                                                        onToggle={(value) => checkboxHandler(value, i)}
                                                        labelPosition={LABEL_POSITION.RIGHT}  
                                                    />
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>

                            <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 30, marginTop: 15}}/>
                            
                            {
                                otherVehicle ?  <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    
                                    <Text style={{fontSize: 18, color: appstyles.primaryColor, marginTop: 10, marginLeft: -110}}>Provide Your Transporter Details</Text>
                                    <View style={{alignSelf: 'flex-start', marginLeft: 10, marginTop: 20}}>
                                        <Text>Company</Text>
                                        <TextInput 
                                            style={{width: width - 90, height: 50, borderWidth: 0.3, marginTop: 5, padding: 10}}
                                            value={customerVehicle.company}
                                            onChangeText={text => setCustomerVehicle({...customerVehicle, company: text})}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                                        <View style={{alignSelf: 'flex-start', marginLeft: 10, marginTop: 20}}>
                                            <Text>Phone</Text>
                                            <TextInput 
                                                style={{width: width - 200, height: 50, borderWidth: 0.3, marginTop: 5, padding: 10}}
                                                value={customerVehicle.phone}
                                                onChangeText={text => setCustomerVehicle({...customerVehicle, phone: text})}
                                            />
                                        </View>
                                        <View style={{alignSelf: 'flex-start', marginLeft: 10, marginTop: 20}}>
                                            <Text>Email</Text>
                                            <TextInput 
                                                style={{width: width - 210, height: 50, borderWidth: 0.3, marginTop: 5, padding: 10}}
                                                value={customerVehicle.email}
                                               onChangeText={text => setCustomerVehicle({...customerVehicle, email: text})}
                                            />
                                        </View>
                                    </View>
                                    <View style={{alignSelf: 'flex-start', marginLeft: 10, marginTop: 20}}>
                                        <Text>Complete Address</Text>
                                        <TextInput 
                                            style={{width: width - 90, height: 50, borderWidth: 0.3, marginTop: 5, padding: 10}}
                                            value={customerVehicle.address}
                                            onChangeText={text => setCustomerVehicle({...customerVehicle, address: text})}
                                        />
                                    </View>
                                 </View>  : 
                            <View>
                                <View style={{flexDirection: 'row', marginTop: 10}}>
                                    <Text style={{marginLeft: 15, fontWeight: '700', fontSize: 16}}>Vehicle</Text>
                                    <Text style={{marginLeft: 15, fontWeight: '700', fontSize: 16}}>Type</Text>
                                    <Text style={{marginLeft: 15, fontWeight: '700', fontSize: 16}}>Estimated Cost</Text>
                                    <Text style={{marginLeft: 15, fontWeight: '700', fontSize: 16}}>Select</Text>
                                </View>

                                {
                                    showVehicle ? 
                                    <View>
                                          {
                                            finalTraspoter.map((value, index) => (
                                                <View key={index} style={{flexDirection: 'row', marginTop: 10}}>
                                                <Text style={{marginLeft: 15, fontWeight: '700', fontSize: 14}}>{value.name} X 1</Text>
                                                <Text style={{fontWeight: '700', position: 'absolute', bottom: 0, top: 0, right: 0, left: 85 }}>{value.name}</Text>
                                                <NumberFormat
                                                    value={value.price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'₹'}
                                                    renderText={formattedValue => <Text style={{fontSize: 16, position: 'absolute', bottom: 0, top: 0, right: 0, left: 155 }}>{formattedValue}</Text>} // <--- Don't forget this!
                                                    />
                                                <View style={{position: 'absolute', bottom: 0, top: 0, right: 0, left: 270}}>  
                                                <CircleCheckBox 
                                                    checked={selectChecked}
                                                    outerColor={'#192341'}
                                                    innerColor={'#192341'}  
                                                    onToggle={() => toggleItem(value.id, value.checked)}
                                                    labelPosition={LABEL_POSITION.RIGHT}  
                                                />   
                                                </View>   
                                            </View>
                                            ))
                                        } 
                                    </View> : <View></View>
                                } 

                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20, alignSelf: 'flex-start', marginLeft: 20}}>
                                <View style={{width: width - 60, height: 80, backgroundColor: '#fff', borderRadius: 8, borderWidth: 0.6, marginBottom: 20}}>
                                <TextInput 
                                        placeholder={'Note to transporter'}
                                        value={note}
                                        multiline={true}
                                        onChangeText={setNote}
                                        style={{paddingLeft: 10}}
                                    />
                                </View>
                            </View>

                            </View> 
                            }
                            
                            <TouchableRipple
                                style={styles.btnCartOrder} 
                                onPress={async () => {
                                    createOrder();
                                    // processedOrder();
                                    setTimeout(toggleTransportModel, 1000);
                                    toggleReview();
                                }}>
                                <Text style={{color: appstyles.white, fontSize: 18}}>Place Order</Text>
                            </TouchableRipple>
                            </ScrollView>
                        </View>
            </Modal>    
            

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
                                    // addNewAddress();
                                    // toggleAddressModel();
                                    // setTimeout(updatedAddress, 4000);
                                }} rippleCentered={true}>
                                     <View style={{width: 250, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
                                          <Text style={{color: appstyles.white, fontSize: 18}}>Add</Text>
                                     </View>
                                </TouchableRipple>
                            </View>
                            </ScrollView>
                        </View>
                </Modal>

                {/* Confirm Order Screen Modal */}
                <Modal isVisible={isReview} style={{backgroundColor: '#fff', margin: 0, alignItems: undefined, justifyContent: undefined}}>
                        <View style={{ flex: 1}}>
                            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1}}>
                            <ScrollView horizontal={false}>   
                                    <View style={{alignSelf: 'flex-start', marginLeft: 5, marginTop: 15}}>
                                        <Text style={{fontSize: 20, color: appstyles.primaryColor, fontWeight: 'bold'}}>Order Details : </Text>
                                    </View>    

                                    {
                                        finalCartItem.map((value, index) => {
                                            return (
                                                <View key={index} style={{width: width, height: 150, backgroundColor: '#fff', flexDirection: 'row', marginTop: 8}}>
                                                <View style={{width: 6, height: 150, backgroundColor: appstyles.primaryColor}}></View>
                                                <View style={{flexDirection: 'column', marginTop: 5}}>
                                                        <View style={{flexDirection: 'row', width: width}}>
                                                                <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                        <Text style={{color: appstyles.tabGray}}>BRAND</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductBrand}</Text>
                                                                </View>
                                                                <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 135}}>
                                                                        <Text style={{color: appstyles.tabGray}}>PRODUCT</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductName}</Text>
                                                                </View>
                                                                <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 270 }}>
                                                                        <Text style={{color: appstyles.tabGray}}>HSN CODE</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductHSN}</Text>
                                                                </View>
                                                        </View>
                                
                                                        <View style={{flexDirection: 'row', marginTop: 8}}>
                                                                <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                        <Text style={{color: appstyles.tabGray}}>SIZE</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>{value.ProductSize}</Text>
                                                                </View>
                                                                <View style={{flexDirection: 'column', position: 'absolute', right: 0, bottom: 0, top: 0, left: 135}}>
                                                                        <Text style={{color: appstyles.tabGray}}>QUANTITY</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700',}}>{value.ProductQuantity} KG</Text>
                                                                </View>
                                                        </View>
                                
                                                        <View style={{flexDirection: 'row', marginTop: 8}}>
                                                                <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                                        <Text style={{color: appstyles.tabGray}}>PRICE</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>₹{value.ProductPrize}.00</Text>
                                                                </View>
                                                                <View style={{flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, right: 0, left: 134}}>
                                                                        <Text style={{color: appstyles.tabGray}}>TOTAL AMOUNT</Text>
                                                                        <Text style={{color: appstyles.primaryColor, fontSize: 16, fontWeight: '700'}}>₹{value.ProductTotal}.00</Text>
                                                                </View>
                                                        </View>
                                                </View>
                                            </View>
                                            );
                                        })
                                    }

                                <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15, marginLeft: 5}}/>

                                <View style={{flexDirection: 'column', marginLeft: 5}}>
                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>ORDER TOTAL</Text>
                                        <NumberFormat
                                            value={sum}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>TOTAL QTY</Text>
                                        <Text style={{fontSize: 16, marginRight: 20}}>{quantity} Kg</Text>
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>INSURANCE({insuranceRate}%)</Text>
                                        <NumberFormat
                                            value={insurance}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Delivered In</Text>
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
                                        <Text style={{fontSize: 16}}>LOADING CHARGE</Text>
                                        <NumberFormat
                                            value={orderLoading}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>TOTAL GST</Text>
                                        <NumberFormat
                                            value={orderGst}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>TOTAL AMOUNT</Text>
                                        <NumberFormat
                                            value={orderCost}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>CURRENT PAYABLE AMOUNT</Text>
                                        <NumberFormat
                                            value={roundOffPrice}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, fontWeight: '700', marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 3, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, color: appstyles.tabGray}}>CREDIT LIMIT</Text>
                                        <Text style={{fontSize: 16, color: appstyles.tabGray, marginRight: 20}}>₹00.0</Text>
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 3, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16}}>USED CREDIT</Text>
                                        <Text style={{fontSize: 16, marginRight: 20}}>₹100.0</Text>
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 3, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700', color: '#28A745'}}>AVAILABLE CREDIT</Text>
                                        <NumberFormat
                                            value={AVAILABLE_Credits}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            style={{fontSize: 16, marginRight: 20, color: '#28A745'}}
                                            prefix={'₹'}
                                            renderText={formattedValue => <Text style={{fontSize: 16, color: '#28A745', marginRight: 20}}>{formattedValue}</Text>} // <--- Don't forget this!
                                            />
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>               
                                </View>
                                </ScrollView> 
                                
                                <TouchableRipple
                                    style={styles.btnCart} 
                                    onPress={async () => {
                                        deleteFromBackendCartWholesale();
                                        setTimeout(confirmOrder, 5000);
                                        setTimeout(toggleReview, 1000); 
                                        onTapRemoveFromCart();
                                        showMessage({
                                            message: "Order is Confirmed",
                                            description: 'Your order is in progress.',
                                            type: 'success',
                                            duration: 4000,
                                            icon: 'success',
                                            style: styles.messageContainer,
                                            color: '#fff',
                                            animationDuration: 300,
                                            backgroundColor: '#28A745',
                                        })
                                        setTimeout(() => {
                                            props.navigation.navigate("MyOrder")
                                        }, 5000);
                                    }}>
                                    <Text style={{color: appstyles.white, fontSize: 18}}>Confirm Order</Text>
                                </TouchableRipple>     

                            </View>
                                    
                        </View>
                    </Modal>

        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    const cartWholeSale = state.cartWholeSale;
    return { cartWholeSale };  
}; 

const orderScreen = connect(mapStateToProps, {removeFromCartWholesale})(_orderScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
   txtInput: {
        borderColor: 'gray', 
        borderWidth: 1, 
        height: 100,
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        width: Dimensions.get('window').width - 110, 
        backgroundColor: '#fff', 
        paddingBottom: 50,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 20
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
        width: 340, 
        height:60, 
        borderTopLeftRadius: 25, 
        borderTopRightRadius: 25
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
    label: {
        color: appstyles.primaryColor,
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700'
    },
    labelSelect: {
        color: appstyles.primaryColor,
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '700'
    },
    iconStylePass: {
        // zIndex: 2, 
        marginLeft: 240,
        marginTop: 5
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
btnCart: {
    width: width,
    height: 60,
    backgroundColor: appstyles.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
},
btnCartOrder: {
    width: width - 70,
    borderRadius: 8,
    marginLeft: 25,
    marginTop: 60,
    marginBottom: 20,
    height: 60,
    backgroundColor: appstyles.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
},
messageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
}
});

export default orderScreen
