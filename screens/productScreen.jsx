import React from 'react'
import { SafeAreaView, StyleSheet,View, Dimensions, TouchableOpacity, Text, Image, ScrollView, FlatList, Animated, Picker, TextInput, ActivityIndicator} from 'react-native'
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import Ripple from 'react-native-material-ripple';
import { TouchableRipple } from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";
import { connect } from 'react-redux';
import { showMessage } from 'react-native-flash-message'; 
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/actions/wishlist';
import { addToCart, deleteFromCart } from '../redux/actions/cart';
// Components
import axios from 'axios';
import { AuthContext } from '../componets/context';
const {height, width} = Dimensions.get('window')

const Item = ({id, uri, name, index, scrollx}) => {
    const inputRange = [(index - 1) * width, index * width, (index+1) * width]
    const scale = scrollx.interpolate({
        inputRange,
        outputRange: [1, 1.4, 1],
    });
    return (
        <Animated.View style={[styles.imgcontainer, {
            transform: [{scale}]
        }]}>
            <Image source={{uri: `http://167.172.236.197:8003${uri}`}} style={styles.image}/>
        </Animated.View>
    )
}

const _productScreen = (props) => {

    const { user } = React.useContext(AuthContext);
    const { switchState } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;
    
    const scrollX = React.useRef(new Animated.Value(0)).current

    const productId = props.route.params.productId
    // console.log(productId)
    const [product, setProduct] = React.useState([]);
    const [categorylist, setCateorylist] = React.useState([]);
    const [Productcategory, setCateoryProduct] = React.useState("None");
    const [Size, setSize] = React.useState('');
    const [brand, setBrand] = React.useState('');
    const [increaseQuantity, setIncreaseQuantity] = React.useState(undefined);


    async function prod () {
        try {
            const res = await axios.get('http://167.172.236.197:8003/api/products/product/')
            let resCategory = await axios.get('http://167.172.236.197:8003/api/products/category/')
            let productArray = [...res.data]
            setProduct(productArray);
            setCateorylist(resCategory.data)
        } catch (e) {
            console.log(e);
        }
    }

    let items = [];
    for (const key in product) {
        if (product[key].id === productId) {
            items.push({
                itemID: product[key].id,
                itemSubCategory: product[key].sub_category,
                itemTitle: product[key].name,
                itemDesc: product[key].desc,
                imageUrl: product[key].images,
                itemPrice: product[key].retailer,
                itemCategory: product[key].category,
                itemHSNCode: product[key].hsn_code,
                itemTax: product[key].tax,
            })
        }
    }

    let productBrand = [];
    items.map((value, index) => {
        value.itemPrice.map((value, index) => {
            productBrand.push(value.brand)
        })
    })


    let itemName = '';
    let itemDesc = '';
    let itemHSNCode = '';
    let itemProductID = undefined;
    let productIdRequest = undefined;
    items.map((value, index) => {
        itemName = value.itemTitle;
        itemDesc = value.itemDesc;
        itemHSNCode = value.itemHSNCode;
        itemProductID = value.itemID;
        productIdRequest = value.itemID;
    })
    
    React.useEffect(() => {
        prod()
        // setLoading(false);
    },[])

    // ImageURL's
    let imageURL = [];
    items.map((value, index) => {
        imageURL = value.imageUrl
    })

    // Price & Brands
    let itemPrice = null;
    let itemBrands = '';
    let itemPriceVarience = [];
    items.map((value, index) => {
        value.itemPrice.map((value, index) => {
            itemPrice = value.price,
            itemBrands = value.brand,
            itemPriceVarience = value.price_varience
        })
    })

    // Category
    let category = []
    let subCategory = '';
    let categoryID = undefined;
    let categoryName = '';
    items.map((value, index) => {
        category = value.itemCategory.sub_category,
        subCategory = value.itemSubCategory,
        categoryID = value.itemCategory.id,
        categoryName = value.itemCategory.category
    })

    // price_varience
    let variPrice = [];
    let retailerDetails = [];
    let itemSize = [];
    let itemID = [];
    itemPriceVarience.map((value, index) => {
        variPrice.push(value.price)
        retailerDetails.push(value.retailer)
        itemSize.push(value.size)
        itemID.push(value.id)
    })

    // console.log(retailerDetails)

    let finalPrice = [];

    for (const key in variPrice) {
        finalPrice.push(
            variPrice[key] + itemPrice
        )
    }

    // finalItemVariantArray
    let totalitem = [];
    for (const key in itemSize, finalPrice, itemID) {
        totalitem.push({
            itemSize: itemSize[key],
            itemBrand: itemBrands,
            itemPrice: finalPrice[key],
            itemId: itemID[key],
        })
    }

    let itemprice = null;
    let itemVariantID = null;
    for (const key in totalitem) {
        if (totalitem[key].itemSize === Size) {
            itemprice = totalitem[key].itemPrice,
            itemVariantID = totalitem[key].itemId
        }
    }

    // console.log(itemprice)

    let itemsize = null;
    for (const key in totalitem) {
        if (totalitem[key].itemSize === Size) {
            itemsize = totalitem[key].itemSize
        }
    }

    let itemsizes = [];
    for (const key in itemBrands) {
        if (itemBrands === brand) {
            itemsizes = itemSize
        }
    }



    let image = [];
    for (const key in imageURL) {
        image = imageURL[key].image;
    }

    let finalTotalPrice = increaseQuantity * itemprice;

    // Add to Cart
    let cartItems = [];
    items.map((value, index) => {
        cartItems.push({
            itemCartItemId: itemVariantID,
            itemCartItemTitle: value.itemTitle,
            itemCartItemPrice: itemprice,
            itemCartItemQuantity: increaseQuantity,
            itemCartItemVariant: Size, 
            itemCartItemImage: image,
            itemCartItemHSNCode: itemHSNCode,
            itemCartItemBrand: itemBrands,
            itemCartItemCategory: categoryName,
            itemCartItemID: categoryID,
            itemCartItemSub: category,
            itemCartProductID: itemProductID,
            userToken: token,
            showItem: true,
            itemCartItemTotal: finalTotalPrice
        })
    })


    // cart
    const { cart, addToCart, deleteFromCart } = props;

    let productCartId = undefined;
    let productCart = [];
    for ( const key in cart.items ) {
        cart.items[key].map((value, index) => {
            productCart.push(value)
            productCartId = value.itemCartProductID
            // pr.push(value.itemCartItemVariant)
        })
    }

    console.log(productCart)

    // console.log(productCartId)

    const onTapAddToCart = (product) => {
        addToCart(product)
    }

    const onTapRemoveFromCart = (product) => {
        deleteFromCart(product)
    }

    let CartSize = [];
    for ( const key in cart.items ) {
        cart.items[key].map((value, index) => {
            CartSize.push(value.itemCartItemVariant)
        })
    }

    const isExistToCart = (product) => {
        for ( const key in CartSize ) {
            if (CartSize[key] === Size) {
                // console.log("Pass");
                return true;
            } else {

            }
        }
        return false;
    }

    // WholeSale Session Store
    const { cartWholeSale } = props;
    let cartWholesaleItem = [];
    if ( switchState === false ) {
        for (const key in cartWholeSale.items) {
            cartWholeSale.items[key].map((value, index) => {
                if ( value.userToken === token ) {
                    cartWholesaleItem.push({
                        ProductSize: value.itemCartItemVariant,
                        ProductPrize: value.itemCartItemPrice,
                        ProductQuantity: value.itemCartItemQuantity,
                        ProductBrand: value.itemCartItemBrand,
                        ProductHSN: value.itemCartItemHSNCode,
                        ProductCategoryName: value.itemCartItemCategory,
                        ProductCatgoryId: value.itemCartItemID,
                        ProductCategorySub: value.itemCartItemSub,
                        ProductMainId: value.itemCartProductID
                    })
              }
            })
        }
    }

    let finalVarientWholesaleItems = [];
    for (const key in cartWholeSale.items) {
        cartWholeSale.items[key].map((value, index) => {
            finalVarientWholesaleItems.push({
                size: value.itemCartItemVariant,
                quantity: value.itemCartItemQuantity,
                brand: value.itemCartItemBrand
            })
        })
    }

    let itemHSNWholesaleCode = '';
    let itemBrandWholesale = '';
    let categoryWholesale = '';
    let categoryIDWholesale = undefined;
    let itemProductIDWholesale = undefined;
    let categoryNameWholesale = '';
    cartWholesaleItem.map((value, index) => {
        itemHSNWholesaleCode = value.ProductHSN,
        itemBrandWholesale = value.ProductBrand,
        categoryWholesale = value.ProductCategorySub,
        categoryIDWholesale = value.ProductCatgoryId,
        itemProductIDWholesale = value.ProductMainId
        categoryNameWholesale = value.ProductCategoryName
    })

    // Backend Integration
    let finalVarientItems = [];
    for (const key in cart.items) {
        cart.items[key].map((value, index) => {
            finalVarientItems.push({
                size: value.itemCartItemVariant,
                quantity: value.itemCartItemQuantity,
                brand: value.itemCartItemBrand
            })
        })
    }

    const uploadToProductRetailer = async() => {
        await axios.post('http://167.172.236.197:8003/api/retailers/product-retailer/', {
            "product_details": [
                {
                    "hsn_code": `${itemHSNCode}`,
                    "price_varience": finalVarientItems,
                    "brand":  `${itemBrands}`,
                    "category": {
                        "category": `${categoryName}`,
                        "sub_category": [
                            `${category}`
                        ],
                        "id": categoryID,
                    },
                    "product_id": itemProductID,
                },
            ]
        }, {
            'Authorization': `Bearer ${token}`
        })
        .then(res => {
            // console.log(res.data);
        }).
        catch(error => {
            console.log(error);
        })
    }

    const addTOCART = async () => {
        await axios.post('http://167.172.236.197:8003/api/retailers/cart/', {
            "cart": {
                "r": {
                    "orders": [
                        {
                            "products": [
                                {
                                    "brand": `${itemBrands}`,
                                    "category": {
                                        "id": categoryID,
                                        "category": `${categoryName}`,
                                        "sub_category": [
                                            `${category}`,
                                        ]
                                    },
                                    "hsn_code": `${itemHSNCode}`,
                                    "product_id": itemProductID,
                                    "price_varience":  finalVarientItems,
                                }
                            ]
                        }
                    ]
                },
                "w": {
                    "orders": [
                        {
                            "products": [
                                {
                                    "hsn_code": `${itemHSNWholesaleCode}`,
                                    "price_varience": finalVarientWholesaleItems,
                                    "brand": `${itemBrandWholesale}`,
                                    "category": {
                                        "category": `${categoryNameWholesale}`,
                                        "sub_category": [
                                            `${categoryWholesale}`
                                        ],
                                        "id": categoryIDWholesale
                                    },
                                    "product_id": itemProductIDWholesale
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
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Request Product

    const [request, setRequest] = React.useState({
        size: '',
    });

    const [userData, setUserData] = React.useState('');
    React.useEffect((value, index) => {
        axios.get('http://167.172.236.197:8003/api/accounts/update/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setUserData(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[]);

    let userID = '';
    userID = userData.id;

    const sentRequest = async() => {
        await axios.post('http://167.172.236.197:8003/api/general/request-variant/', {
            "product": productIdRequest,
            "size": `${request.size}`,
            "user": `${userID}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).
        then(res => {
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
            showMessage({
                message: "Somthing Wrong!",
                type: 'danger',
                duration: 4000,
                icon: 'info',
                style: styles.messageContainer,
                color: '#fff',
                animationDuration: 300,
                backgroundColor: 'red',
            })
        })
    };

    let address = '';
    let city = '';
    let state = '';
    let finalAddress = '';
    city = userData.city;
    address = userData.address;
    state = userData.state;

    if ( address != null ) {
        finalAddress = address + ', ' + city + ', ' + state;
    } else {
        finalAddress = 'Address not found!';
    }
   
    // // Wishlist
    const { wishlistItemsReducer, addToWishlist, removeFromWishlist } = props;
    const { wishlist } = wishlistItemsReducer;

    // console.log(wishlist)

    let quanSymbol = 'KG';
    let wishlistItems = [];
    items.map((value, index) => {
        wishlistItems.push({
            itemWishlistId: itemVariantID,
            itemWishlistTitle: value.itemTitle,
            itemWishlistSize: Size,
            itemWishlistPrice: itemprice,
            itemWishlistUserToken: token,
            itemWishlistQuanSymBol: quanSymbol
        })
    })

    const onTapAddToWishlist = (product) => {
           addToWishlist(product)
    }

    const onTapRemoveFromWishlist = (product) => {
        removeFromWishlist(product)
    }

    // console.log(typeof wishlist)
    const isExist = (product) => {
        if (wishlist.filter(item => item[0].itemWishlistId === itemVariantID && item[0].itemWishlistUserToken === token).length > 0) {
            return true;
        }
        return false;
    }

    const dispatch = useDispatch();


    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },2000)  
    });

    return (
        <SafeAreaView style={styles.container}>
    
            {
                loading ?  <View style={{flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color={appstyles.primaryColor} />
        </View> :  <View>
            <View style={styles.headerContainer}>
                    <TouchableOpacity>
                        <SvgXml xml={xml.Arrow} width={12} height={45} onPress={() => props.navigation.goBack(null)}/>
                    </TouchableOpacity>
                
                    <Text style={styles.txtTitle}>{itemName}</Text>
                
                   <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginLeft: 70, marginRight: 20}}>                     

                        <Ripple 
                                // backgroundColor={'red'}
                                rippleCentered={true}
                                rippleContainerBorderRadius={10}
                                rippleColor={'#808080'}
                                onPress={() => props.navigation.navigate("Search")}>
                                <SvgXml xml={xml.search} width={20} height={20} />
                        </Ripple> 
                    </View>   
            </View>
    
            <ScrollView horizontal={false}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <View style={{flexDirection: 'column', alignSelf: 'flex-start', alignItems: 'flex-start', marginTop: 20, marginLeft: 10}}>
                                <View style={{flexDirection: 'row', width: 120}}>
                                    <Text style={{color: appstyles.primaryColor, fontSize: 20, fontWeight: 'bold'}}>{itemName}</Text>
                                </View>
                                <View style={{width: 120, marginTop: 15, flexDirection: 'column'}}>
                                    <Text style={{fontSize: 10, marginBottom: 20}}>{itemDesc}</Text>
                                </View>

                        </View>

                        <View style={{flexDirection: 'column'}}>
                            <View style={{marginTop: 20, borderRadius: 15, width: width - 190, borderWidth: 1, borderColor: '#8C91A0', height: 50}}>
                                     <Picker style={{borderWidth: 1}}
                                            selectedValue={Productcategory}
                                            onValueChange={(value, index) => {
                                                setCateoryProduct(value)
                                            }}>
                                                
                                            <Picker.Item label={subCategory} value={subCategory}/>
                                            {
                                                category.map((item, index) => {
                                                    return(
                                                        <Picker.Item label={item} value={item} key={index}/>
                                                    );
                                                })
                                            }
                                    </Picker>                                      
                            </View>

                            <View style={styles.ImgContainer}>
                                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,}}>
                                    <Animated.FlatList
                                        data={imageURL} 
                                        horizontal={true}
                                        scrollEventThrottle={16}
                                        pagingEnabled={true}
                                        keyExtractor={(item, index) => {
                                            return `${item.id}imageURL`;
                                        }}
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.flatList}
                                        renderItem={({item, index}) =>
                                            // console.log(item.image)
                                            <Item uri={item.image} index={index} scrollx={scrollX}/>
                                            }
                                        onScroll={Animated.event(
                                            [{nativeEvent: {contentOffset: {x: scrollX}}}],
                                            {useNativeDriver: true}
                                        )}
                                    />

                                </View>
                                <View style={{alignSelf: 'flex-end'}}>
                                    
                                    {
                                        isExist(wishlistItems) ?
                                                  <View style={{alignSelf: 'flex-end'}}>
                                                    <TouchableOpacity onPress={() => {
                                                            onTapRemoveFromWishlist(wishlistItems)
                                                    }}>
                                                        <View style={{width: 30, height: 40, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                                            <SvgXml xml={xml.cross} width={20} height={20}/>
                                                        </View>
                                                    </TouchableOpacity>  
                                            </View> :   <TouchableOpacity onPress={() => {
                                            if ( itemsize != null ) {
                                                onTapAddToWishlist(wishlistItems)
                                            } else {
                                                showMessage({
                                                    message: "Size not selected",
                                                    description: "Please select any size for adding to Wishlist.",
                                                    type: 'danger',
                                                    duration: 4000,
                                                    icon: 'danger',
                                                    style: styles.messageContainer,
                                                    color: '#fff',
                                                    animationDuration: 300,
                                                    backgroundColor: 'red',
                                                })
                                            }
                                            
                                            }}>
                                                <View style={{width: 30, height: 40, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                                                    <SvgXml xml={xml.wishlist} width={20} height={20}/>
                                                </View>
                                            </TouchableOpacity> 
                                    }
 
                                    
                                </View>

                               
                            </View> 
                        </View>
                </View>
       
                {
                    itemPriceVarience.length === 0 ?  <View style={{width: 220, height: 30, borderRadius: 5, backgroundColor: '#DC3545', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginLeft: 20}}>
                    <Text style={{fontSize: 12, color: '#fff'}}>This product is currently not available.</Text>
                </View> : <View></View> 
                }

            <View style={styles.detailContainer}>
                <View style={{flexDirection: 'column', alignSelf: 'flex-start', marginLeft: 20}}>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text style={{color: appstyles.primaryColor, fontSize: 18, fontWeight: '700'}}>Available Sizes (MM)</Text>
                    </View>

                    <View style={{flexDirection: 'column', marginLeft: 12}}>
                        <View style={{marginTop: 20}}>
                            <Text style={{color: appstyles.primaryColor, fontSize: 18}}>Brand</Text>
                        </View>
                        
                        <View style={{marginTop: 10, borderRadius: 15, width: width - 65, borderWidth: 1, borderColor: '#8C91A0'}}>
                            <Picker style={{borderWidth: 1}}
                                selectedValue={brand}
                                onValueChange={(value, index) => {
                                    setBrand(value)
                                }}>
                                <Picker.Item label="None" value="None"/>
                                <Picker.Item label={itemBrands} value={itemBrands}/>
                            </Picker>                                     
                        </View>
                        
                        <View style={{alignItems: 'center'}}>    
                             <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: 290}}/>
                        </View>  
                        
                    </View>
                    
                    <View style={{flexDirection: 'column', marginTop: 15, justifyContent: 'space-between', alignItems: 'center'}}>                
                           
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 10}}>
                                    <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>{itemsize} MM</Text>
                                        <Text style={{fontWeight: 'bold', fontSize: 16}}>₹ {itemprice}</Text>
                                    </View>
                                </View>
                                <View style={{alignSelf: 'center', flexDirection: 'row', marginLeft: 50}}>
                                    <InputSpinner
                                        height={35}
                                        color={'#fff'}
                                        width={120}
                                        rounded={false}
                                        buttonTextColor={appstyles.primaryColor}
                                        value={increaseQuantity}
                                        onIncrease={text => setIncreaseQuantity(text)}
                                        // onDecrease={props.onDecrease}
                                        buttonStyle={{
                                            borderTopLeftRadius: 10, 
                                            borderTopRightRadius: 10,
                                            borderBottomRightRadius: 10,
                                            borderBottomLeftRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#D8D8D8',
                                         }}>
                                   </InputSpinner>
                                </View>
                                         
                                {
                                    isExistToCart(cartItems) ?  <View>
                                        <TouchableOpacity onPress={() => onTapRemoveFromCart(cartItems)}>
                                            <View style={{width: 50, height: 50, borderWidth: 0.5, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginLeft: 35}}>
                                                <SvgXml xml={xml.trash} />
                                            </View>
                                        </TouchableOpacity>
                                    </View> : <View>
                                    <TouchableOpacity onPress={() => {
                                          if ( increaseQuantity != null ) {
                                            if ( productCart.length === 0 ) {
                                                onTapAddToCart(cartItems);
                                                showMessage({
                                                    message: "Added to Cart",
                                                    type: 'info',
                                                    duration: 4000,
                                                    icon: 'info',
                                                    style: styles.messageContainer,
                                                    color: '#fff',
                                                    animationDuration: 300,
                                                    backgroundColor: '#5bbce4',
                                                });
                                            } else if (productCartId === itemProductID)  {
                                                onTapAddToCart(cartItems);
                                                showMessage({
                                                    message: "Added to Cart",
                                                    type: 'info',
                                                    duration: 4000,
                                                    icon: 'info',
                                                    style: styles.messageContainer,
                                                    color: '#fff',
                                                    animationDuration: 300,
                                                    backgroundColor: '#5bbce4',
                                                });
                                              } else {
                                                showMessage({
                                                    message: "Cart is full",
                                                    type: 'danger',
                                                    description: 'Please checkout previous items in cart.',
                                                    duration: 4000,
                                                    icon: 'danger',
                                                    style: styles.messageContainer,
                                                    color: '#fff',
                                                    animationDuration: 300,
                                                    backgroundColor: '#DC3545',
                                                });
                                              
                                              }
                                        } else {
                                            showMessage({
                                                message: "Empty Quantity",
                                                description: 'Please select any size and increase quantity.',
                                                type: 'danger',
                                                duration: 4000,
                                                icon: 'info',
                                                style: styles.messageContainer,
                                                color: '#fff',
                                                animationDuration: 300,
                                                backgroundColor: '#DC3545',
                                            })
                                        }
                                    }}>
                                        <View style={{width: 50, height: 50, borderWidth: 0.5, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: appstyles.primaryColor, marginLeft: 35}}>
                                            <SvgXml xml={xml.cart} />
                                        </View>
                                    </TouchableOpacity>
                                </View>      
                                }
                                
                            </View>     

                        
                             <View style={{marginTop: 15, borderRadius: 15, width: width - 65, borderWidth: 1, borderColor: '#8C91A0'}}>
                                <Picker style={{borderWidth: 1}}
                                    selectedValue={Size}
                                    onValueChange={(value, index) => {
                                        setSize(value)
                                    }}>
                                    <Picker.Item label="Sizes (MM)" value="None"/>
                                    {
                                        itemsizes.map((value, index) => {
                                            return (
                                                <Picker.Item label={value} value={value} key={index}/>
                                            );
                                        })
                                    }
                                   
                               </Picker>                                     
                            </View> 
                                
                    </View>

                      
                    <View style={{flexDirection: 'column', marginLeft: 12}}>
                        <View style={{marginTop: 20}}>
                            <Text style={{color: appstyles.primaryColor, fontSize: 18}}>Request custom size</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                             <TextInput 
                                   value={request.size}
                                   onChangeText={text => setRequest({...request, size: text})}
                                   placeholder={'Kg'}
                                   style={{width: width - 145, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#8C91A0', paddingLeft: 15}}
                             />
                            <TouchableOpacity onPress={async() => {
                                if ( request.size.length !== 0 ) {
                                    try {
                                        sentRequest();
                                        showMessage({
                                            message: "Request Sent",
                                            description: "Requested varient will be availble after verification.",
                                            type: 'info',
                                            duration: 4000,
                                            icon: 'info',
                                            style: styles.messageContainer,
                                            color: '#fff',
                                            animationDuration: 300,
                                            backgroundColor: '#000',
                                        })
                                    } catch(error) {
                                        console.log(error);
                                    }
                            } else {
                                showMessage({
                                    message: "Empty",
                                    type: 'danger',
                                    duration: 4000,
                                    icon: 'info',
                                    style: styles.messageContainer,
                                    color: '#fff',
                                    animationDuration: 300,
                                    backgroundColor: 'red',
                                })
                            }
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: 80, height: 50, borderRadius: 12, backgroundColor: appstyles.primaryColor, marginLeft: 15}}>
                                    <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Request</Text>
                                </View>
                             </TouchableOpacity>
                        </View>
                     </View>      

                </View>
                <View style={{alignItems: 'center'}}>    
                   <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: 330}}/>
                </View>   

                <View style={{marginTop: 20, marginLeft: 25, alignSelf: 'flex-start'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 16}}>Deliver to: </Text>
                    <View style={{width: 250, height: 40}}>
                         <Text style={{fontWeight: 'bold', fontSize: 16}}> {finalAddress}</Text>
                    </View>
                </View>
            </View>


                <View style={{flexDirection: 'column', marginBottom: 30}}>
                        <View style={{marginLeft: 25, marginTop: 20, alignSelf: 'flex-start', flexDirection: 'row'}}>
                            <Text style={{fontSize: 16, color: appstyles.primaryColor, fontWeight: 'bold'}}>Product Details</Text>
                            <View style={{flexDirection: 'row',flex: 1, justifyContent: 'flex-end', marginRight: 20}}>
                                <TouchableOpacity >
                                    <View style={styles.roundCatalogContainer}><Text style={{fontSize: 11}}>Download Catalog</Text></View>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        <View style={{width: 300, flex: 1, marginTop: 10, marginLeft: 25, flexDirection: 'column'}}>
                            <Text style={{fontSize: 12, marginBottom: 20}}>{itemDesc}</Text>
                        </View>
                </View>
            </View>

            </ScrollView>
                {
                    isExistToCart(cartItems) ?   <TouchableRipple
                    style={styles.btnCart} 
                    onPress={async () => {
                            try {
                                uploadToProductRetailer();
                                addTOCART();
                                setTimeout(() => {
                                    props.navigation.navigate("Cart")
                                },3000);
                            } catch (error) {
                                console.log(error);
                            }
                    }}>
                    <Text style={{color: appstyles.white, fontSize: 18}}>Checkout</Text>
                </TouchableRipple>  : <View></View>
                }
             </View>
            } 
            
           
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    const wishlistItemsReducer = state.wishlistItemsReducer;
    const cart = state.cart;
    const cartWholeSale = state.cartWholeSale;
    return { wishlistItemsReducer, cart, cartWholeSale  };  
};

const productScreen = connect(mapStateToProps, { addToWishlist, removeFromWishlist, addToCart, deleteFromCart })(_productScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FAFAFA'
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: width,
        height: 50,
        marginTop: 32,
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
        marginLeft: 20,
        fontWeight: 'bold',
        fontSize: 18,
        color: appstyles.primaryColor,
        },
    ImgContainer: {
        width: 170,
        height: 150,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center'
    },
    detailContainer: {
        flex: 1,
        width: width,
        backgroundColor: appstyles.white,
        marginTop: 30,
        alignItems: 'center'   
    },
    btnCart: {
        width: width,
        height: 60,
        backgroundColor: appstyles.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundContainer: {
        width: 60, height: 25, borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundCatalogContainer: {
        width: 100, height: 25, borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        elevation: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        maxHeight: height/3
    },
    image: {
        height: '90%',
        width: '75%'
    },
    imgcontainer: {
        height: 150,
        width: 200,
        borderRadius: 10,
        overflow: 'hidden'
    },
    messageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 70,
    }
});

export default productScreen
