import React from 'react'
import { Text, StyleSheet, SafeAreaView, View, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import { TouchableRipple } from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';

// Components
import ServiceContainer from '../componets/serviceContainer';
import Product from '../componets/productContainer';
import NewProduct from '../componets/newProduct';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ProductCate from '../componets/categoryProduct';
import * as cartActions from '../redux/actions/cart';
import ToggleSwitch from 'toggle-switch-react-native';
import { AuthContext } from '../componets/context';

const {height, width} = Dimensions.get('window')

const challanges = [
    {
        id: "1",
        uri: require('../assets/images/FlatlistImg1.png'),
        name: "Steel1"
    },
    {
        id: "2",
        uri: require('../assets/images/FlatlistImg1.png'),
        name: "Steel2"
    },
    {
        id: "3",
        uri: require('../assets/images/FlatlistImg1.png'),
        name: "Steel3"
    },
]


const Item = ({id, uri, name, index, scrollx}) => {
    const inputRange = [(index - 1) * width, index * width, (index+1) * width]
    const scale = scrollx.interpolate({
        inputRange,
        outputRange: [0.7,1,0.7],
    });
    return(
        <Animated.View style={[styles.imgcontainer,{
            transform: [{scale}]
        }]}>
            <Image source={uri} style={styles.imageMain}/>
        </Animated.View>
    )
}


const HomeScreen = (props) => {

    const scrollX = React.useRef(new Animated.Value(0)).current
    const [shouldShow, setshouldShow] = React.useState(true);
    
    const { gettingBol } = React.useContext(AuthContext);

    // BackendAPI Hook for Products
    const [product, setProducts] = React.useState([]);
    const [category, setCateory] = React.useState([]);


    React.useEffect(() => {
        productDetails()
    },[])

    
    async function productDetails () {
        let res = await axios.get('http://167.172.236.197:8003/api/products/popular-product/')
        let categoryRes = await axios.get('http://167.172.236.197:8003/api/products/category/')
        let productArray = [...res.data]
        productArray.pop()
        setProducts(productArray)
        setCateory(categoryRes.data)
    }
    
    // ImgURL
    let popular = [];    
    for (const key in product) {
        popular.push({
            itemImgDetail: product[key].images,
        })
    }

    // console.log(popular.length)
    let imgURL = [];
    popular.map((value, index) => {
        value.itemImgDetail.map((value, index) => {
            imgURL.push({id: value.id, url: value.image, productID: value.product})
        })
    });

    function getUnique(arr, comp) {

        const unique = arr.map(e => e[comp])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter((e) => arr[e]).map(e => arr[e]);

        return unique;
    }

    let ImgArray = getUnique(imgURL, 'productID');
    
    let popularArray = [];
    for (const key in product, ImgArray) {
        popularArray.push({
            itemID: product[key].id,
            itemTitle: product[key].name,
            itemImgURL: ImgArray[key].url,
        })
    }

    // Brands
    let items = [];
    for (const key in product) {
        items.push({
            brandDetails: product[key].retailer,
        })
    }

    let brands = [];
    items.map((value, index) => {
        value.brandDetails.map((value, index) => {
            brands.push(value.brand)
        })
    })

    const dispatch = useDispatch();

    // Toggle States
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [isChangeLabel, setChangeLabel ] = React.useState(false);

    const onToggleSwitch = () => {
        setChangeLabel(!isChangeLabel);
        setIsSwitchOn(!isSwitchOn);
        gettingBol(!isSwitchOn);
        if (isSwitchOn === false) {
            showMessage({
                message: "Switched to Wholesale",
                type: 'success',
                duration: 1000,
                titleStyle: {fontSize: 18},
                style: styles.messageContainer,
                color: '#fff',
                animationDuration: 300,
                backgroundColor: '#5bbce4',
            })
        } else {
            showMessage({
                message: "Switched to Retail",
                type: 'success',
                duration: 1000,
                titleStyle: {fontSize: 18},
                style: styles.messageContainer,
                color: '#fff',
                animationDuration: 300,
                backgroundColor: '#5bbce4',
            })
        }
    }

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },2500)  
    });

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                   <SvgXml xml={xml.headerImg} width={30} height={30} marginTop={6}/> 
                   <SvgXml xml={xml.title} width={110} height={30} marginTop={6}/>                    
                      <View style={{marginTop: 12, marginLeft: 100}}>
                        <Ripple 
                                // backgroundColor={'red'}
                                rippleCentered={true}
                                rippleContainerBorderRadius={10}
                                rippleColor={'#808080'}
                                onPress={() => props.navigation.navigate("Search")}>
                                <SvgXml xml={xml.search} width={20} height={20} />
                        </Ripple> 
                     </View>

                   <View style={{position: 'absolute', left: 270, top: 5, right: 0, bottom: 0, flexDirection: 'column'}}>
                       <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 12, color: appstyles.primaryColor, fontWeight: '700'}}>{isChangeLabel ? 'WHOLESALE' : 'RETAIL'}</Text>
                      </View>
                      <View style={{marginLeft: 23, marginTop: 3}}>
                            <ToggleSwitch
                                    isOn={isSwitchOn}
                                    onColor="#192341"
                                    offColor="#192341"
                                    size='small'
                                    onToggle={isOn => onToggleSwitch(!isSwitchOn)}
                            />
                        </View>   
                   </View>
                </View>

                 {
                    loading ?   <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={appstyles.primaryColor} />
                </View> : <View style={{flex: 1}}>
                <View style={styles.upperSlideContainer}>
                        <FlatList 
                            data={category}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            // keyExtractor={item => item.id}
                            keyExtractor={(item, index) => { return `${item.id}category`; }}
                            renderItem={itemData => 
                            <TouchableOpacity onPress={() => 
                                    props.navigation.navigate("Category", {
                                        categoryId: itemData.item.id,
                                        categoryName: itemData.item.category,
                                    })}>
                                <View style={{flexDirection: 'row', marginLeft: 6, marginBottom: 18}}>
                                    <View style={{width: 125, height: 40, backgroundColor: appstyles.primaryColor, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{color: '#fff', fontSize: 12}}>{itemData.item.category}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', marginLeft: 3}}><SvgXml xml={xml.lightLine}/></View>
                                </View> 
                            </TouchableOpacity>
                        }
                        />
                </View>

                    <ScrollView horizontal={false}>  
                    <View style={{flexDirection: 'column', width: width}}>
                        <View style={{flexDirection: 'column', width: width, height: 300, marginTop: 6}}>
                        <Animated.FlatList
                            data={challanges}
                            renderItem={({item, index}) => <Item {...item} index={index} scrollx={scrollX}/>}
                            keyExtractor={item => item.id}
                            horizontal={true}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                                {useNativeDriver: true}
                            )}
                            pagingEnabled={true}
                            style={styles.flatList}
                            showsHorizontalScrollIndicator={false}
                         />
                        </View>
                        <View style={{flexDirection: 'row',flex: 1, marginTop: -120, justifyContent: 'space-around', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'column',}}>
                                        <ServiceContainer icon={xml.ShoppingVan} titleTop={"Fast and Hassle"} titleBottom={"Free Delivery"} />
                                        <ServiceContainer icon={xml.prize} titleTop={"Quality Products"} titleBottom={"& Verified Suppliers"}/>
                                        <ServiceContainer icon={xml.refundBox} titleTop={"Easy Refund Policy"} titleBottom={""}/>
                                    </View> 
                                    <View style={{flexDirection: 'column',}}>
                                    <ServiceContainer icon={xml.securePay} titleTop={"Secured"} titleBottom={"Payment Options"} />
                                        <ServiceContainer icon={xml.clock} titleTop={"24/7"} titleBottom={"customer service"}/>
                                        <ServiceContainer icon={xml.announcement} titleTop={"Best Festival"} titleBottom={"Offers"}/>
                                    </View>
                        </View>
                    </View>
                    <Image source={require('../assets/images/offer-banner.jpg')} style={{width: width, height: 80, marginTop: 15}}/>
                    <View style={styles.bottomContainer}>
                        <View style={{flexDirection: 'row', flex: 1, marginLeft: 20, marginTop: 10}}>
                            <Text style={{fontSize: 16, color: appstyles.primaryColor}}>Weak-End Deals</Text>
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 160}}>
                                {/* <TouchableOpacity><Text style={{color: appstyles.primaryColor, fontStyle: 'italic'}}>view all</Text></TouchableOpacity> */}
                            </View>
                        </View>
                        <View style={styles.bottomSlideContainer}>
                            <FlatList 
                                    data={popularArray}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => { return `${item.itemID}product`; }}
                                    renderItem={itemData => 
                                    <View  style={{flexDirection: 'column', alignItems: 'center', marginLeft: 25, justifyContent: 'center'}}>
                                        <TouchableOpacity onPress={() => {
                                            if (isSwitchOn === false) {
                                                props.navigation.navigate("Product", {
                                                    productId: itemData.item.itemID,
                                                    productTitle: itemData.item.itemTitle,
                                                })
                                            } else {
                                                props.navigation.navigate("ProductWholeSale", {
                                                    productId: itemData.item.itemID,
                                                    productTitle: itemData.item.itemTitle,
                                                })
                                            }
                                        }
                                        }>
                                        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 110, height: 130}}>
                                            <Image source={{uri: `http://167.172.236.197:8003${itemData.item.itemImgURL}`}} style={styles.image} />
                                            <Text style={{marginTop: 10, marginBottom: 10}}>{itemData.item.itemTitle}</Text> 
                                         </View>
                                        </TouchableOpacity>              
                                    </View>    
                                    }/>
                        </View> 
                    </View>
                    <View style={styles.popularContainer}>
                        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 20}}>
                            <Text style={{fontSize: 16, color: appstyles.primaryColor}}>Popular Products</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 150}}>
                                {/* <TouchableOpacity><Text style={{color: appstyles.primaryColor, fontStyle: 'italic'}}>view all</Text></TouchableOpacity> */}
                            </View>
                        </View>            
                         <View style={styles.bottomSlideContainer}>
                                     <FlatList 
                                            data={popularArray}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item, index) => { return `${item.itemID}product`; }}
                                            renderItem={itemData => 
                                            <View  style={{flexDirection: 'column', alignItems: 'center', marginLeft: 25, justifyContent: 'center'}}>
                                                <TouchableOpacity onPress={() => {
                                                     if (isSwitchOn === false) {
                                                        props.navigation.navigate("Product", {
                                                            productId: itemData.item.itemID,
                                                            productTitle: itemData.item.itemTitle,
                                                        })
                                                      } else {
                                                          props.navigation.navigate("ProductWholeSale", {
                                                              productId: itemData.item.itemID,
                                                              productTitle: itemData.item.itemTitle,
                                                        })
                                                    }                                     
                                                }}>
                                                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 110, height: 130}}>
                                                    <Image source={{uri: `http://167.172.236.197:8003${itemData.item.itemImgURL}`}} style={styles.image} />
                                                    <Text style={{marginTop: 10, marginBottom: 10}}>{itemData.item.itemTitle}</Text> 
                                                </View>
                                                </TouchableOpacity>                 
                                            </View>    
                                            }/>
                           </View>   
                    </View>
                    <Image source={require('../assets/images/offer-banner.jpg')} style={{width: width, height: 80, marginTop: 15}}/>                 
                    <View style={styles.bottomContainer}>
                        <View style={{flexDirection: 'row', flex: 1, marginLeft: 20, marginTop: 10}}>
                            <Text style={{fontSize: 16, color: appstyles.primaryColor, fontWeight: 'bold'}}>New Arrivals</Text>
                            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', marginLeft: 180}}>
                                <TouchableOpacity><Text style={{color: appstyles.primaryColor, fontStyle: 'italic'}}>view all</Text></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.bottomSlideContainer}>
                            <FlatList 
                                    data={product}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item, index) => { return `${item.id}product`; }}
                                    renderItem={itemData =>    
                                        <NewProduct 
                                            title={itemData.item.name}
                                            onPress={() => {
                                                props.navigation.navigate("Product", {
                                                    productId: itemData.item.id,
                                                    productTitle: itemData.item.title,
                                                })
                                            }}
                                        />
                                        
                                }/>
                        </View>
                    </View>
                    {/* <View style={styles.bottomContainer}>
                        <View style={{flexDirection: 'row', marginLeft: 20, marginTop: 10}}>
                            <Text style={{fontSize: 16, color: appstyles.primaryColor, fontWeight: 'bold'}}>Popular Brands</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 155}}><TouchableOpacity><Text style={{color: appstyles.primaryColor, fontStyle: 'italic'}}>view all</Text></TouchableOpacity></View>
                        </View>
                        <View style={styles.bottomSlideContainer}>
                            <FlatList 
                                data={brands}
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                renderItem={itemData => <Product title={itemData.item} /> } />
                        </View>
                    </View> */}
                </ScrollView>
                </View>
                }  

        </SafeAreaView>
    )  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,

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
        paddingLeft: 10,
        paddingTop: 3,
        shadowRadius: 3.84, 
        elevation: 10,
   },
   upperSlideContainer: {
       flexDirection: 'row',
       backgroundColor: '#fff',
       height: 40,
       marginTop: 5
       
   },
   bottomSlideContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        backgroundColor: '#EDEDED',
        marginBottom: 20,
        // height: 95,

   },
    titleTxt: {
        color: appstyles.primaryColor,
        fontSize: 16,
        marginLeft: 10,
        marginTop: 10,
   },
    bottomContainer: {
        flex: 1,
        flexDirection: 'column', 
        backgroundColor: '#EDEDED', 
        marginTop: 20,
        marginBottom: 10,
        
   },
   popularContainer: {
        flex: 1,
        flexDirection: 'column', 
        backgroundColor: '#EDEDED', 
        marginTop: 20,
        marginBottom: 10,
   },
   linearGradient: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        // position: 'absolute',
        width: '100%',
        height: '100%',
   },
   item: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 35,
    width: 95,
    marginTop: 5
  },
  title: {
    fontSize: 32,
    color: appstyles.primaryColor,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10
  },

  Catecontainer: {
    flex: 1,
    alignItems: 'center',
},
txtInput: {
    borderColor: '#000', 
    borderWidth: 1, 
    width: Dimensions.get('window').width - 250, 
    backgroundColor: '#fff', 
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 8,
    marginTop: 10
},
txtInputTwo: {
    borderColor: '#000', 
    borderWidth: 1, 
    width: Dimensions.get('window').width - 250, 
    backgroundColor: '#fff', 
    borderRadius: 10,
    paddingLeft: 10,
    paddingVertical: 8,
    marginLeft: 10,
    marginTop: 10
},
image: {
    height: 70,
    width: 70,
    borderRadius: 8
},
flatList: {
    maxHeight: height/3,
},
imgcontainer: {
    height: height/3.25,
    width: width,
    borderRadius: 10,
    overflow: 'hidden'
},
imageMain: {
    height: '100%',
    width: '100%'
},

messageContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 80,
}


});

export default HomeScreen;
