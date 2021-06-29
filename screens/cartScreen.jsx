import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Image, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
//Components
import Cart from '../componets/cartComponent';
import Header from '../componets/header';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from '../componets/actionSheet';
import * as cartActions from '../redux/actions/cart';
import * as cartWholesaleActions from '../redux/actions/cartWholeSale';
import appstyles from '../styles/appstyles';
import { AuthContext } from '../componets/context';
import {Picker} from '@react-native-picker/picker';
import { sleep } from '../utils/sleep';
import { TouchableRipple } from 'react-native-paper';
import NumberFormat from 'react-number-format';
import { showMessage } from 'react-native-flash-message';
import { addToCart, deleteFromCart, removeFromCart } from '../redux/actions/cart';
import { addToCartWholesale, deleteCartWholesaleItem, removeFromCartWholesale } from '../redux/actions/cartWholeSale';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('window')

const _cartScreen = (props) => {

    const { switchState } = React.useContext(AuthContext);
    const [data, setData] = React.useState([]);
    const [retailData, setRetailData] = React.useState([]);
    const [selectState, setSelectedState] = React.useState([]);
    const [selectAddress, setSelectedAddress] = React.useState([]);
    const [ManufactureUserID, setManufactureUserID] = React.useState('');
    const [actionState, setActionState] = React.useState(false);
    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;
    const { cart, addToCart, removeFromCart } = props;
    const { cartWholeSale, addToCartWholesale, removeFromCartWholesale } = props;

    let title = '';  
    let cartState = false;
    let finalCartItem = [];
    if ( switchState === true ) {
        for (const key in cartWholeSale.items) {
            cartWholeSale.items[key].map((value, index) => {
                if ( value.userToken === token ) {
                    title = value.itemCartItemBrand
                    cartState = value.showItem
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
    } else {
        for (const key in cart.items) {
            // console.log(cart.items[key])
            cart.items[key].map((value, index) => {
                if ( value.userToken === token ) {
                    title = value.itemCartItemBrand
                    cartState = value.showItem
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

    const onTapRemoveFromCart = (product) => {
        if ( switchState === true ) {
            removeFromCartWholesale(product)
        } else {
            removeFromCart(product)
        }
    }

    // // Selecting Delivery state dailog.
    const [isModelVisible, setModelVisiable] = React.useState(false);

    const toggleModel = () => {
        setModelVisiable(!isModelVisible);
    }

    // // Backend Intgration 
    let itemHSNCode = '';
    let itemsize = [];
    let increaseQuantity = undefined;
    let itemBrands = '';
    let category = [];
    let categoryID;
    let itemProductID = [];
    let ProdID = undefined;
    let categoryName = '';
    let productPrice = undefined;
    let RetailerProductID = undefined;

    finalCartItem.map((value, index) => {
        itemHSNCode = value.ProductHSN,
        itemsize.push(value.ProductSize),
        increaseQuantity = value.ProductQuantity,
        itemBrands = value.ProductBrand,
        category = value.ProductCategorySub,
        categoryID = value.ProductCatgoryId,
        itemProductID = value.ProductID,
        categoryName = value.ProductCategoryName,
        productPrice = value.ProductPrize,
        ProdID = value.ProductMainId
    });

    
    let finalvarient = [];
    finalCartItem.map((value, index) => {
        finalvarient.push({
            size: value.ProductSize,
            quantity: value.ProductQuantity,
            brand: value.ProductBrand
        });
    });

    // console.log(finalvarient)

    // // console.log("---------------------------------")
    // // console.log(cartItems)

    // // console.log(RetailerProductID)
    
    // let itemWholesaleHSNCode = [];
    // let itemWholesalesize = [];
    // let increaseWholesaleQuantity = [];
    // let itemBrandsWholesale = [];
    // let Wholesalecategory = [];
    // let categoryWholesaleID = [];
    // let itemProductWholesaleID = [];
    // let categoryWholesaleName = [];
    // let WholesaleProductID = [];
    // cartWholesaleItems.map((value, index) => {
    //     itemWholesaleHSNCode = value.itemCartWholesaleHSNCode,
    //     itemWholesalesize = value.itemCartWholesaleVariant,
    //     increaseWholesaleQuantity = value.quantityWholesale,
    //     itemBrandsWholesale = value.itemCartWholesaleBrand,
    //     Wholesalecategory = value.itemCartWholesaleCategory,
    //     categoryWholesaleID = value.itemCartWholesaleCategoryID,
    //     itemProductWholesaleID = value.productWholesaleId,
    //     categoryWholesaleName = value.itemCartWholesaleCategory,
    //     WholesaleProductID = value.itemCartWholesaleProductID
    // });


    const checkWholesaleItem = async() => {
        await axios.post('http://167.172.236.197:8003/api/manufacturers/product-manufacturer/', {
            "product_details": [
                {
                    "hsn_code": `${itemHSNCode}`,
                    "price_varience": finalvarient,
                    "brand":  `${itemBrands}`,
                    "category": {
                        "category": `${categoryName}`,
                        "sub_category": [
                            `${category}`
                        ],
                        "id": categoryID,
                    },
                    "product_id": ProdID,
                },
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setData(res.data);
            // console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    // console.log(finalvarient)

    const checkRetailItem = async() => {
        await axios.post('http://167.172.236.197:8003/api/retailers/product-retailer/', {
            "product_details": [
                {
                    "hsn_code": `${itemHSNCode}`,
                    "price_varience": finalvarient,
                    "brand":  `${itemBrands}`,
                    "category": {
                        "category": `${categoryName}`,
                        "sub_category": [
                            `${category}`
                        ],
                        "id": categoryID,
                    },
                    "product_id": ProdID,
                },
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            setRetailData(res.data);
            // console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }


    // // Deleting from backend
    // const deleteFromBackendCartWholesale = async () => {
    //     await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
    //         "cart": {
    //             "r": {
    //                 "orders": [
    //                     {
    //                         "products": [
    //                             {
    //                                 "brand": `${itemBrands}`,
    //                                 "category": {
    //                                     "id": `${categoryID}`,
    //                                     "category": `${categoryName}`,
    //                                     "sub_category": [
    //                                         `${category}`,
    //                                     ]
    //                                 },
    //                                 "hsn_code": `${itemHSNCode}`,
    //                                 "product_id": `${itemProductID}`,
    //                                 "price_varience": [
    //                                     {
    //                                         "size": `${itemsize}`,
    //                                         "brand": `${itemBrands}`,
    //                                         "quantity": increaseQuantity,
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             },
    //             "w": {
    //                 "orders": []
    //             }
    //         },
    //     }, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //     .then(res => {
    //         console.log(res.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });
    // }
 
    const deleteFromBackendCartRetailer = async () => {
        await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
            "cart": {
                "r": {
                    "orders": []
                },
                "w": {
                    "orders": [
                      
                    ]
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

    // const { cart, addToCart, removeFromCart } = props;

    // console.log(cart)

    // const removeItem = (product) => {
    //     if ( switchState === true ) {       
    //         dispatch(cartWholesaleActions.deleteCartWholesaleItem(ProductID));  
    //         deleteFromBackendCartWholesale(); 
    //     } else {
    //         // dispatch(cartActions.removeFromCart(ProductID));
          
    //         // deleteFromBackendCartRetailer();
    //     }
    // }


    // const onTapRemoveFromCart = (product) => {
    //     deleteFromCart(product);
    // }

    // const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    // const cartWholeSaleAmount = useSelector(state => state.cartWholeSale.totalAmount);
    // let finalTotalPrize = 0;
    // if ( switchState === true ) {
    //     finalTotalPrize = cartWholeSaleAmount
    // } else {
    //     finalTotalPrize = cartTotalAmount
    // }

    // Proceed to Order cart for Wholesale Product

    let itemFinalBrand = '';

    let itemFinalManufacturerId = undefined;
    let itemFinalManufacturerPrice = undefined;
    let itemFinalManufacturerCommission = [];
    let itemFinalManufacturerDiscount = undefined;
    let itemFinalManufacturerExtra = [];
    let itemFinalManufacturerMaxQuantity = undefined;
    let itemFinalManufacturerTime = '';
    let itemFinalManufacturerProduct = [];
    let itemFinalManufacturerUser = '';
    let itemFinalManufacturerBrand = '';
    let itemFinalManufacturerExtraCharge = undefined;

    let itemFinalManufacturerPriceVariance= [];
    let itemFinalManufacturerBending = '';
    let itemFinalManufacturerCutting = undefined;
    let itemFinalManufacturerTax = undefined;
    let itemFinalManufacturerMeasuringUnit = undefined;
    let itemFinalManufacturerName = '';
    let itemFinalManufacturerWeight = false;
    let itemFinalManufacturerCategory = [];
    let itemFinalManufacturerSubCategory = [];
    let itemComm = undefined;

    // Checking and finding right product from all retailers. 
    let findSizes = [];
    let productDetails = [];
    let productWholesaleid = '';
    let price = undefined;
    data.map((value, index) => {
        if ( value.state === selectState ) {
            productWholesaleid = value.id
            value.products.map((item, index) => {
                productDetails.push(item);
                item.price_variance.map((data, index) => {
                    findSizes.push(data);
                })
            })
        }
    })

    let findedSizes = [];
    findSizes.map((value, index) => {
        for (const key in itemsize) {
            if ( value.size === itemsize[key] ) {
                findedSizes.push(value)
            }
       } 
     })

     let min = Math.min.apply(null, findedSizes.map(item => item.price));
     let minId = Math.min.apply(null, findedSizes.map(item => item.id));

     let selectWholesaleItems = [];
     let gettingrestWholesaleData = [];
 
     finalCartItem.map((value, index) => {
         gettingrestWholesaleData.push({
             brand: value.ProductBrand,
             quantity: value.ProductQuantity,
             price: value.ProductPrize,
         });
     });

     findedSizes.map((value, index) => {
        if (value.price === min) {
            selectWholesaleItems.push({
                size: value.size, 
                weight: value.weight,
                id: value.id
             })
        } else if (value.id === minId ){
            selectWholesaleItems.push({
                size: value.size, 
                weight: value.weight,
                id: value.id
             })  
                    
        } else {
            selectWholesaleItems.push({
                size: value.size, 
                weight: value.weight,
                id: value.id
             })
        }
    });

    // console.log(gettingrestWholesaleData)

    let finalSelectedWholesaleItems = [];
    for (const key in gettingrestWholesaleData, selectWholesaleItems) {
        finalSelectedWholesaleItems.push({
            id: selectWholesaleItems[key].id,
            price: gettingrestWholesaleData[key].price,
            quantity: gettingrestWholesaleData[key].quantity,
            size: selectWholesaleItems[key].size,
            weight: selectWholesaleItems[key].weight,
            brand: gettingrestWholesaleData[key].brand
        });
    }

     productDetails.map((value, index) => { 
        for (const key in value) {
            if ( value[key].id === itemFinalManufacturerId ) {
                itemFinalBrand = value.brand,
                itemComm = value.wholesale_commission
                price = value.price
            }
        }
     })

    // //  console.log(price)

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

    React.useEffect(() => {
        prod()
    },[]);
    
    let items = [];
    for (const key in product) {
        if (product[key].id === ProdID) {
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
                itemCategorySub: product[key].category,
                itemMeasuring: product[key].measuring_unit,
                itemWeight: product[key].weight_in_kg
            })
        }
    }

    items.map((value, index) => {
        itemFinalManufacturerName = value.itemTitle,
        itemFinalManufacturerTax = value.itemTax,
        itemFinalManufacturerUser = value.itemUser,
        itemFinalManufacturerTime = value.itemTime,
        itemFinalManufacturerExtra = value.itemExtraCharge,
        itemFinalManufacturerCategory = value.itemCategorySub,
        itemFinalManufacturerMeasuringUnit = value.itemMeasuring,
        itemFinalManufacturerWeight = value.itemWeight
    });

    {
        if ( ProdID != null ) {
            itemFinalManufacturerCutting = itemFinalManufacturerExtra.cutting;
            itemFinalManufacturerBending = itemFinalManufacturerExtra.bending;
           
            items.map((value, index) => {
                value.itemPrice.map((value, index) => {
                        itemFinalManufacturerId = value.id,
                        itemFinalManufacturerPrice = value.price
                        itemFinalManufacturerDiscount = value.discount,
                        itemFinalManufacturerMaxQuantity = value.max_quantity,
                        itemFinalManufacturerBrand = value.brand,
                        itemFinalManufacturerPriceVariance= value.price_varience,
                        itemFinalManufacturerExtraCharge = value.extra_charge
                })
            })
        }
    }
    
    // // console.log(itemFinalManufacturerPrice)
    // let finalVarientPrice = itemFinalVarientPrize + itemFinalManufacturerPrice;
    
    // // console.log(itemFinalManufacturerPrice)

    const addTOWholesaleCART = async () => {
        await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
            "cart": {
                "r": {
                    "orders": [
                       
                    ]
                },
                "w": {
                    "orders": [
                        {
                            "products": [
                                {
                                    "brand": `${itemFinalManufacturerBrand}`,
                                    "category": {
                                        "id": categoryID,
                                        "category": `${categoryName}`,
                                        "sub_category": [
                                            `${category}`
                                        ]
                                    },
                                    "hsn_code": `${itemHSNCode}`,
                                    "product_id": ProdID,
                                    "price_varience": finalSelectedWholesaleItems,
                                    "manufacturer_product": {
                                        "id": itemFinalManufacturerId,
                                        "price": itemFinalManufacturerPrice,
                                        "wholesale_commission": itemComm,
                                        "discount": itemFinalManufacturerDiscount,
                                        "extra_charge": itemFinalManufacturerExtraCharge,
                                        "max_quantity": itemFinalManufacturerMaxQuantity,
                                        "time": `${itemFinalManufacturerTime}`,
                                        "product": ProdID,
                                        "user":`${itemFinalManufacturerUser}`,
                                        "brand":`${itemFinalManufacturerBrand}`,
                                        "price_variance": itemFinalManufacturerPriceVariance,
                                        "extra_charges": {
                                            "bending": `${itemFinalManufacturerBending}`,
                                            "cutting": itemFinalManufacturerCutting,
                                        },
                                        "tax": itemFinalManufacturerTax,
                                        "measuring_unit": itemFinalManufacturerMeasuringUnit,
                                        "name": `${itemFinalManufacturerName}`,
                                        "weight_in_kg": itemFinalManufacturerWeight
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res.data);
            setManufactureUserID(res.data.user);
        })
        .catch(error => {
            console.log(error);
        });
    };

    let pickerStates = [];
    if ( switchState === true ) {
        pickerStates = data;
    } else {
        pickerStates = retailData;
    }

    // Retail Product
    let RetailitemId = undefined;
    let RetailitemProduct = undefined;
    let RetailitemUser = '';
    let RetailitemPrice = undefined;
    let RetailitemExtra_Charge = undefined
    let RetailitemExtra_Charges = []
    let bending = '';
    let cutting = undefined;
    let itemTax = undefined;
    let  itemMeasurningUnit = '';
    let itemWeightKg = false;
    let itemTime = '';
    let itemName =  '';
    let itemQuantity = '';
    let retailitemBrand = '';
    let itemPriceVarience = [];
    let finalUserID = '';


    let findSizesRetailer = [];
    let productDetailsRetailer = [];
    retailData.map((value, index) => {
        if ( value.state === selectState ) {
            value.products.map((value, index) => {
                productDetailsRetailer.push(value);
                value.price_variance.map((data, index) => {
                    findSizesRetailer.push(data);
                })
            })
        }
    });
 
    // console.log(findSizesRetailer)

    // console.log(itemsize)

    let retailerState = '';
    retailData.map((value, index) => {
        retailerState = value.state;
    });

    let findedSizesRetailer = [];
    findSizesRetailer.map((value, index) => {
        for (const key in itemsize) {
            if ( value.size === itemsize[key] ) {
                findedSizesRetailer.push(value)
            } 
        }
    });

    // console.log(findedSizesRetailer)

    let minRetailer = Math.min.apply(null, findedSizesRetailer.map(item => item.price));
    let minIdRetailer = Math.min.apply(null, findedSizesRetailer.map(item => item.id));

    let selectItems = [];
    let gettingrestData = [];

    finalCartItem.map((value, index) => {
        gettingrestData.push({
            brand: value.ProductBrand,
            quantity: value.ProductQuantity,
            price: value.ProductPrize,
        });
    });

    // console.log(gettingrestData)

    findedSizesRetailer.map((value, index) => {
            if (value.price === minRetailer) {
                selectItems.push({
                   size: value.size, 
                   weight: value.weight,
                   id: value.id
                })
           } else if (value.id === minIdRetailer ){
               selectItems.push({
                   size: value.size, 
                   weight: value.weight,
                   id: value.id
                })
           } else {
               selectItems.push({
                   size: value.size, 
                   weight: value.weight,
                   id: value.id
                })
           }
    });

    let finalSelectedItems = [];
    for (const key in gettingrestData, selectItems) {
        finalSelectedItems.push({
            id: selectItems[key].id,
            price: gettingrestData[key].price,
            quantity: gettingrestData[key].quantity,
            size: selectItems[key].size,
            weight: selectItems[key].weight,
            brand: gettingrestData[key].brand
        });
    }

    {
        if ( ProdID != null ) {
            let itemsRetailer = [];
            for (const key in product) {
                if (product[key].id === ProdID) {
                    itemsRetailer.push({
                        itemID: product[key].id,
                        itemSubCategory: product[key].sub_category,
                        itemTitle: product[key].name,
                        itemPrice: product[key].retailer,
                        itemCategory: product[key].category,
                        itemTax: product[key].tax,
                        itemUser: product[key].user,
                        itemTime: product[key].time,
                        itemExtraCharge: product[key].extra_charge,
                        itemCategorySub: product[key].category,
                        itemMeasuring: product[key].measuring_unit,
                        itemWeight: product[key].weight_in_kg
                        // itemFinalRetailerWeight = product[key].weight_in_kg
                    })
                }
            }
            let extraCharges = [];
            itemsRetailer.map((value, index) => {
                itemTax = value.itemTax,
                RetailitemUser = value.itemUser,
                itemTime = value.itemTime,
                extraCharges = value.itemExtraCharge,
                itemMeasurningUnit = value.itemMeasuring,
                itemName = value.itemTitle,
                itemWeightKg = value.itemWeight
            })

            bending = extraCharges.bending;
            cutting = extraCharges.cutting;
        
            itemsRetailer.map((value, index) => {
                value.itemPrice.map((value, index) => {
                    RetailitemId = value.id,
                    RetailitemPrice = value.price,
                    retailitemBrand = value.brand,
                    itemPriceVarience = value.price_varience,
                    itemQuantity = value.max_quantity,
                    RetailitemExtra_Charge = value.extra_charge
                })
            })
            

            let retailerPrice = [];
            let BasePrice = [];
            itemPriceVarience.map((value, index) => {
                for (const key in itemsize) {
                    if (value.size === itemsize[key]) {
                        retailerPrice.push(value.retailer)
                        BasePrice.push(value.price)
                    }
                }
            })

            let findedPrice = [];
            let finalRetailComm = [];
            retailerPrice.map((value, index) => {
                findedPrice.push(value.price) 
                finalUserID = value.user_id
                finalRetailComm.push(value.retail_commission),
                RetailitemProduct =  value.product_id
            })

            // // console.log(finalRetailComm)
            // for (const key in BasePrice, findedPrice, finalRetailComm) {
            //     selectitemPrice
            // }
            // selectitemPrice = BasePrice + findedPrice + finalRetailComm;
            // setRetailerProduct({itemPrice: BasePrice + findedPrice + finalRetailComm});

        } else {
            // console.log("Cart Empty!")
        }
    }

    // console.log(RetailitemProduct)


    const addTORetailerCART = async () => {
        await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
            "cart": {
                "r": {
                    "orders": [
                        {
                            "products":[
                            {
                                "brand": `${retailitemBrand}`,
                                "category":{
                                    "id": categoryID,
                                    "category": `${categoryName}`,
                                    "sub_category":[
                                            `${category}`,
                                ]
                            },
                            "hsn_code": `${itemHSNCode}`,
                            "product_id": ProdID,
                            "price_varience": finalSelectedItems,
                            "retailer_product":{
                                "id": RetailitemId,
                                "product": RetailitemProduct,
                                "user": `${finalUserID}`,
                                "price":  RetailitemPrice,
                                "extra_charge": RetailitemExtra_Charge,
                                "price_variance": itemPriceVarience,
                                "extra_charges": {
                                    "bending": `${bending}`,
                                    "cutting": cutting
                                },
                                "tax": itemTax,
                                "measuring_unit": `${itemMeasurningUnit}`,
                                "name": `${itemName}`,
                                "weight_in_kg": itemWeightKg
                              }
                            }
                          ]
                        }
                    ]
                },
                "w": {
                    "orders": [
                       
                    ]
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

    const [isOrder, setOrderSection] = React.useState(false);
    const [order, setOrder] = React.useState([]);
    const toggleSection = () => {
        setOrderSection(!isOrder);
    }

    const [isReview, setReviewSection] = React.useState(false);
    const toggleReview = () => {
        setReviewSection(!isReview);
    }

    const [addressSecond, setAddressSecond] = React.useState([]);
    React.useEffect((value, index) => {
        axios.get('http://167.172.236.197:8003/api/accounts/update/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
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

    // // console.log(address)
    let setUserAdress = [];
    userSecondayAddress.map((value, index) => {
        if ( value.address === selectAddress ) {
            setUserAdress.push(value);
        }
    })


    let city = '';
    let state = '';
    let pincode = undefined;
    let UserAdress = '';
    let UserContacts = [];
    setUserAdress.map((value, index) => {
            city = value.city,
            state = value.state,
            pincode = value.pincode,
            UserContacts.push(value.contacts)
            UserAdress = value.address
        // console.log(value);
    })

    let name = '';
    let phone = '';
    UserContacts.map((value, index) => {
        value.map((value, index) => {
            name = value.name,
            phone = value.phone
        })
    })
   
    let finalTotalPrize = 0;
    if ( switchState === true ) {
        // finalTotalPrize = cartWholeSaleAmount
    } else {
        // finalTotalPrize = 
    }


    const [isFindError, setFindError] = React.useState(false);
    const createOrderRetailer = async() => {
        await axios.post('http://167.172.236.197:8003/api/orders/retail/order/', 
           {
            "product_details":[
                {
                    "brand": `${retailitemBrand}`,
                    "category":{
                    "id": categoryID,
                    "category": `${categoryName}`,
                    "sub_category":[
                            `${category}`
                        ]
                    },
                    "hsn_code": `${itemHSNCode}`,
                    "product_id": RetailitemProduct,
                    "price_varience": finalSelectedItems,
                    "retailer_product":{
                         "id": RetailitemId,
                         "product": RetailitemProduct,
                         "user": `${finalUserID}`,
                         "price": RetailitemPrice,
                         "extra_charge": RetailitemExtra_Charge,
                         "price_variance": itemPriceVarience,
                         "extra_charges":{
                            "bending": `${bending}`,
                            "cutting": cutting
                          },
                        "tax": itemTax,
                        "measuring_unit": `${itemMeasurningUnit}`,
                        "name": `${itemName}`,
                        "weight_in_kg": itemWeightKg
                         }
                        }
                      ],
                        "shipping_address":{
                        "contacts":[
                        {
                        "name": `${name}`,
                        "phone": `${phone}`
                        }
                        ],
                        "state": `${state}`,
                        "pincode": pincode,
                        "city": `${city}`,
                        "town":"",
                        "address": `${UserAdress}`
                        },
                        "retailer": `${finalUserID}`,
                        "state": `${retailerState}`
                    },
               
                 {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).
            then(res => {
                setOrder(res.data);
                setTimeout(toggleReview, 1000);
                console.log(res.data)
            }).
            catch(error => {
                setFindError(true);
                // console.log(error);
                showMessage({
                    message: "Route is not available on this address",
                    type: 'danger',
                    duration: 3000,
                    icon: 'danger',
                    style: styles.messageContainer,
                    color: '#fff',
                    animationDuration: 300,
                    backgroundColor: 'red',
                })
            })
        }

        let orderCost = Math.round(order.final_price); 
        let roundOffPrice = orderCost / 10;
        let orderLoading = Math.round(order.loading_cost); 
        let orderGst = order.gst; 
        let delivery = order.transportation_cost; 
        let orderId = order.id;

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

        let finalTotalQuantity = [];
        let finalTotalPrice = [];

        finalCartItem.map((value, index ) => {
            finalTotalQuantity.push(value.ProductQuantity),
            finalTotalPrice.push(value.ProductTotal)
        })

        let sum = finalTotalPrice.reduce(function(a, b){
            return a + b;
        }, 0);

        let quantity = finalTotalQuantity.reduce(function(a, b){
            return a + b;
        }, 0);

        // console.log(quantity)

        const confirmOrder = async() => {
            await axios.get(`http://167.172.236.197:8003/api/orders/retail/order/${orderId}/confirm/`, {
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

    return (        
            <SafeAreaView style={styles.container}>
                {
                    isReview ? <Header title={"Confirm Order"} onPress={toggleReview} /> : <View style={styles.headerContainer}>
                    <Text style={styles.txtTitle}>Cart</Text>
                </View>  
                }    
                    {/* <Header title={"Cart"}/> */}
                    {
                        cartState ?   <View style={{flexDirection: 'column', width: width - 15,  borderWidth: 0.5, borderRadius: 6}}>
                        <View style={{width: 100, height: 30, backgroundColor: '#5B5B5B', justifyContent: 'center', alignItems: 'center', borderRadius: 6, marginLeft: 8, marginTop: 10}}>
                            <Text style={{fontSize: 16, color: '#fff'}}>{title}</Text>
                        </View>

                        <View style={{marginTop: 10}}> 
                            {
                                finalCartItem.map((value, index) => {
                                    return (
                                        <View key={index}>
                                            <Cart
                                                index = {index}
                                                price = {value.ProductPrize} 
                                                productName={value.ProductName} 
                                                value={value.ProductValue}
                                                size={value.ProductSize}
                                                imageURL={value.ProductImageURL}
                                                quantity={value.ProductQuantity}
                                                // onRemove={() => onTapRemoveFromCart()} 
                                            />
                                        </View>
                                    );
                                })
                            }             
                        </View>
                    </View> : <View></View>
                    }
                      
                    {
                        actionState ?   <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flex: 1}}>
                        <ActionSheet title={"Place Order"} onDelete={() => onTapRemoveFromCart()} onPress={async() => {
                            if (switchState === true) {
                                   setTimeout(() => {
                                            props.navigation.navigate("Order", {
                                                productWholesale: productWholesaleid,
                                                productWholesalePrice: itemFinalManufacturerPrice,
                                                productWholesaleVarient: finalSelectedWholesaleItems,
                                                productWholesaleComm: itemComm,
                                                productWholesaleCartId: ManufactureUserID     
                                          }, 5000)
                                         })       
                            } else {
        
                            }
                        }}/>  
                    </View> :   <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flex: 1}}>
                                <ActionSheet title={"Proceed"} disabled={finalCartItem.length === 0} onDelete={() => onTapRemoveFromCart()} onPress={async() => {
                                    if (switchState === true) {
                                        checkWholesaleItem();
                                        toggleModel();
                                    } else {
                                        checkRetailItem();
                                        toggleSection();
                                        // toggleReview();
                                    }
                                }}/>  
                        </View>
                    }  
                  

                    <Modal isVisible={isModelVisible} animationIn={'fadeInUp'} animationOut={'fadeOutUp'}>
                            <View style={{backgroundColor: '#FEFEFE', width: 320, height: 300, borderRadius: 25, alignItems: 'center', marginLeft: 5}}> 
                                 <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 20}}>
                                    <Text style={{fontSize: 20, color: appstyles.tabGray}}>Delivery Info</Text>
                                 </View>
                                 <View style={{alignItems: 'center'}}>    
                                    <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 10, width: 280}}/>
                                 </View>   
                                 <View style={{marginTop: 10}}>
                                     <Text style={{color: '#000', fontSize: 15, marginTop: 16, fontWeight: 'bold'}}>Select State from which you want to order</Text>
                                 </View>
                                 <View style={{marginTop: 10, borderRadius: 15, width: width - 85, borderWidth: 1, borderColor: '#8C91A0'}}>
                                        <Picker style={{width: 280, height: 50, borderWidth: 0.2, borderRadius: 8}}
                                            selectedValue={selectState}
                                            onValueChange={(value, index) => {
                                                setSelectedState(value)
                                            }}>
                                            
                                            <Picker.Item label="None" value="None"/ >
                                            {
                                                pickerStates.map((value, index) => {
                                                    return (
                                                        <Picker.Item label={value.state} value={value.state} key={index}/>
                                                    );
                                                })     
                                            }

                                        </Picker>
                                </View>

                                <View style={{alignItems: 'center', marginTop: 10}}>    
                                    <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 10, width: 280}}/>
                                 </View>   
                                
                                <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginRight: 20, marginTop: 20}}>
                                    <TouchableOpacity onPress={toggleModel}>
                                        <View style={{width: 90, height: 50, borderRadius: 8, borderWidth: 0.2, backgroundColor: '#5A6268', justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: '#fff', fontSize: 18}}>Close</Text>
                                        </View>
                                     </TouchableOpacity>
                                     
                                     <TouchableOpacity disabled={selectState.length === 0} onPress={async () => {
                                         if ( switchState === true) {
                                             addTOWholesaleCART();
                                             setActionState(true);
                                             toggleModel();
                                         } else {
                                            // addTORetailerCART();

                                         }
                                     }}>
                                        <View style={{width: 110, height: 50, marginLeft: 10, borderRadius: 8, borderWidth: 0.2, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: '#fff', fontSize: 18}}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
    
                            </View>
                    </Modal>

                    <Modal isVisible={isOrder} animationIn={'fadeInLeft'} animationOut={'fadeOutRight'} hideModalContentWhileAnimating={true} >
                            <View style={{backgroundColor: '#FEFEFE', width: 320, height: 565, borderRadius: 25, alignItems: 'center', marginLeft: 3}}> 
                            <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20, marginTop: 20}}>
                                 <Text style={{fontSize: 20, color: appstyles.tabGray}}>Delivery Info</Text>
                                 </View>
                                 <View style={{alignItems: 'center'}}>    
                                    <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 10, width: 280}}/>
                                 </View>   
                                 <View style={{marginTop: 10}}>
                                     <Text style={{color: '#000', fontSize: 15, marginTop: 16, fontWeight: 'bold'}}>Select State from which you want to order</Text>
                                 </View>
                                 <View style={{marginTop: 10, borderRadius: 15, width: width - 85, borderWidth: 1, borderColor: '#8C91A0'}}>
                                        <Picker style={{width: 280, height: 50, borderWidth: 0.2, borderRadius: 8}}
                                            selectedValue={selectState}
                                            onValueChange={(value, index) => {
                                                setSelectedState(value)
                                            }}>
                                            <Picker.Item label="None" value="None"/ >
                                            {
                                                retailData.map((value, index) => {
                                                    return (
                                                        <Picker.Item label={value.state} value={value.state} key={index}/>
                                                    );
                                                })     
                                            }

                                        </Picker>
                                </View>

                                <View style={{marginTop: 10, alignSelf: 'flex-start', marginLeft: 20}}>
                                     <Text style={{color: '#000', fontSize: 15, marginTop: 16, fontWeight: 'bold'}}>Select Your Shipping Address</Text>
                                 </View>
                                 <View style={{marginTop: 10, borderRadius: 15, width: width - 85, borderWidth: 1, borderColor: '#8C91A0'}}>
                                        <Picker style={{width: 280, height: 50, borderWidth: 0.2, borderRadius: 8}}
                                            selectedValue={selectAddress}
                                            onValueChange={(value, index) => {
                                                setSelectedAddress(value)
                                            }}>
                                            <Picker.Item label="None" value="None" />
                                            {
                                                address.map((value, index) => {
                                                    return (
                                                        <Picker.Item label={value} value={value} key={index} />
                                                    );
                                                   
                                                })     
                                            }
                                        </Picker>
                                </View>
                                
                                <View style={{flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 30, marginTop: 15}}>
                                    <View style={{flexDirection: 'row' }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>State: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 50}}>{state}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>City: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 60}}>{city}</Text> 
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Pincode: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 30}}>{pincode}</Text> 
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Address: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 28}}>{UserAdress}</Text> 
                                                                                                                                                                                                                                                          
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Name: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 44}}>{name}</Text> 
                                                                                                                                                            
                                    </View>
                                    <View style={{flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Phone: </Text> 
                                        <Text style={{fontSize: 16, marginLeft: 40}}>{phone}</Text>                                                                                                                                                                                      
                                    </View>
                                </View>
                            
                                <View style={{flexDirection: 'row', marginTop: 30, alignSelf: 'flex-end', marginRight: 12}}>
                                    <TouchableOpacity onPress={toggleSection}>
                                        <View style={{width: 100, height: 50, backgroundColor: '#5A6268', borderRadius: 8, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: '#fff', fontSize: 18}}>Close</Text>
                                        </View>
                                     </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={async() => {
                                        addTORetailerCART();
                                        try {
                                            setTimeout(createOrderRetailer, 5000);
                                        } catch (error) {
                                           console.log(error);
                                        }
                                        toggleSection();

                                    }}>
                                        <View style={{width: 120, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                                            <Text style={{color: '#fff', fontSize: 18}}>Place Order</Text>
                                        </View>
                                     </TouchableOpacity>
                                </View>

                            </View> 
                    </Modal>

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
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Total Qty:</Text>
                                        <Text style={{fontSize: 16, marginRight: 20}}>{quantity} Kg</Text>
                                    </View>

                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 15, marginTop: 15}}/>

                                    <View style={{marginLeft: 5, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Products Total:</Text>
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
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Delivery Charge:</Text>
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
                                        <Text style={{fontSize: 16}}>LOADING COST:</Text>
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
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>GST:</Text>
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
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Order Total:</Text>
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
                                        <Text style={{fontSize: 16, fontWeight: '700'}}>Current Payable Amount:</Text>
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
                                        deleteFromBackendCartRetailer();
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
    const cart = state.cart;
    const cartWholeSale = state.cartWholeSale;
    return { cart, cartWholeSale };  
}; 

const cartScreen = connect(mapStateToProps, { addToCart, deleteFromCart, removeFromCart, addToCartWholesale, deleteCartWholesaleItem, removeFromCartWholesale })(_cartScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        // marginTop: 5
    },
    btnCart: {
        width: width,
        height: 60,
        backgroundColor: appstyles.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
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
            height: 100,
        }
});

export default cartScreen;