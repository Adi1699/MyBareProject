import React from 'react'
import { Text, StyleSheet, SafeAreaView, View, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Animated, ActivityIndicator, Platform, TouchableNativeFeedback } from 'react-native'
import appstyles from '../styles/appstyles';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import { TouchableRipple } from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

// Components
import Header from '../componets/header';
import { AuthContext } from '../componets/context';

const {height, width} = Dimensions.get('window')
const CategoryScreen = (props) => {

    let title = '';
    title = props.route.params.categoryName;

    const { switchState } = React.useContext(AuthContext);

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    // console.log(title)
    const [product, setProducts] = React.useState([]);
    const [category, setCateory] = React.useState([]);

    async function productDetails () {
        let res = await axios.get('http://167.172.236.197:8003/api/products/product/')
        let resCategory = await axios.get('http://167.172.236.197:8003/api/products/category/')
        let productArray = [...res.data]
        productArray.pop()
        setProducts(productArray)
        setCateory(resCategory.data)
    }

    React.useEffect(() => {
        productDetails()
    },[])

    // Finding Category
    let findedCategory = [];
    for (const key in category) {
        if (category[key].category === title) {
            findedCategory.push({
                categoryTitle: category[key].category,
                categoryProducts: category[key].sub_category
            })
        }
    }

    // Finding products
    let categoryProductslist;
    findedCategory.map((value, index) => {
        categoryProductslist = value.categoryProducts
    })

    let findedProducts = [];
    for (const key in product) {
        if ( product[key].category.category === title ) {
            findedProducts.push(product[key]);
        }    
    }

    // ImgURL
    let popular = [];    
    for (const key in findedProducts) {
        popular.push({
            itemImgDetail: findedProducts[key].images,
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

    // Base Price
    let productBasePrice = [];
    if ( switchState === false ) {
        for( const key in findedProducts ) {
        findedProducts.map((value, index) => {
            value.retailer.map((value, index) => {
                productBasePrice.push(value.price)
            })
        })
    }
    } else {
        for (const key in findedProducts) {
        findedProducts.map((value, index) => {
            value.manufacturers.map((value, index) => {
                productBasePrice.push(value.base_price)
            })
        })
      }     
    }
   
    let productDetail = [];
    for (const key in findedProducts, productBasePrice, ImgArray) {
        productDetail.push({
            itemID: findedProducts[key].id,
            itemTitle: findedProducts[key].name,
            itemImgURL: ImgArray[key].url,
            itemBasePrice: productBasePrice[key]
        })
    }

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },2500)  
    });


    return (
        <SafeAreaView style={styles.container}>
            <Header title={title} onPress={() => props.navigation.goBack(null)} />

            {
                loading ? <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color={appstyles.primaryColor} />
            </View> : <ScrollView style={{flex: 1}} >
            <View style={styles.Catecontainer}>
            <Image source={require('../assets/images/offer-banner.jpg')} style={{width: width, height: 80}}/>
            <View style={{flex: 1, width: width, backgroundColor: '#fff'}}>
                <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 30}}>  
                        <TouchableOpacity >
                        <View style={{width: 90, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1}}>
                            <SvgXml xml={xml.filter}/>
                            <Text style={{marginLeft: 8}}>Filter</Text>
                        </View>
                        </TouchableOpacity>
                        <View style={{marginLeft: 10, flexDirection: 'row', flex: 1}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{marginTop: 10, marginLeft: 10}}><TouchableOpacity><Text style={{color: appstyles.primaryColor, fontSize: 16}}>Popularity</Text></TouchableOpacity></View>
                            <View style={{marginLeft: 20, marginTop: 10}}><TouchableOpacity><Text style={{color: appstyles.primaryColor, fontSize: 16}}>Newest</Text></TouchableOpacity></View>
                            <View style={{marginLeft: 20, marginTop: 10}}><TouchableOpacity><Text style={{color: appstyles.primaryColor, fontSize: 16}}>Most Expensive</Text></TouchableOpacity></View>
                        </ScrollView>
                        </View>
                </View>

                <View style={{flexDirection: 'column', marginBottom: 60, marginTop: 15}}>

                        {
                            productDetail.map((value, index) => {
                                return (
                                    <View key={index} style={{overflow: 'hidden'}}>
                                    <TouchableCmp  useForeground onPress={() => {
                                         if (switchState === false) {
                                            props.navigation.navigate("Product", {
                                                productId: value.itemID,
                                                productTitle: value.itemTitle,
                                            })
                                        } else {
                                            props.navigation.navigate("ProductWholeSale", {
                                                productId: value.itemID,
                                                productTitle: value.itemTitle,
                                            })
                                        }
                                    }}>
                                        <View>
                                           <View style={{flexDirection: 'row', marginTop: 30, justifyContent: 'center', alignSelf: 'flex-start', marginLeft: 30}}>
                                               <Image  source={{uri: `http://167.172.236.197:8003${value.itemImgURL}`}} style={styles.image}/>
                                               <View style={{flexDirection: 'column', marginLeft: 20}}>
                                                   <Text style={{fontSize: 16}}>{value.itemTitle}</Text>
                                                   <Text style={{marginTop: 5, fontSize: 16}}>₹{value.itemBasePrice}.00</Text>
                                               </View>
                       
                                           </View>
                                           <View style={{alignItems: 'center'}}>    
                                               <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: 330}}/>
                                           </View>  
                                       </View> 
                                   </TouchableCmp>
                               </View>        
                                );
                            })
                        }

                        {/* <FlatList 
                            data={productDetail}
                            horizontal={false}
                            keyExtractor={(item, index) => { return `${item.itemID}product`; }}
                            renderItem={itemData =>    
                                <View style={{overflow: 'hidden'}}>
                                <TouchableCmp  useForeground onPress={() => {
                                     if (switchState === false) {
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
                                    <View>
                                       <View style={{flexDirection: 'row', marginTop: 30, justifyContent: 'center', alignSelf: 'flex-start', marginLeft: 30}}>
                                           <Image  source={{uri: `http://167.172.236.197:8003${itemData.item.itemImgURL}`}} style={styles.image}/>
                                           <View style={{flexDirection: 'column', marginLeft: 20}}>
                                               <Text style={{fontSize: 16}}>{itemData.item.itemTitle}</Text>
                                               <Text style={{marginTop: 5, fontSize: 16}}>₹{itemData.item.itemBasePrice}.00</Text>
                                           </View>
                   
                                       </View>
                                       <View style={{alignItems: 'center'}}>    
                                           <Image source={require('../assets/images/VectorLine.png')} style={{marginTop: 20, width: 330}}/>
                                       </View>  
                                   </View> 
                               </TouchableCmp>
                           </View>                            
                            } /> */}
                </View>
            </View>
           
           
            <Modal animationIn={'fadeInLeft'} animationOut={'fadeOutRight'}>
                <View style={{backgroundColor: '#FEFEFE', width: 260, height: 350, borderRadius: 25, alignItems: 'center', marginLeft: 35}}> 
                    <View style={{flexDirection: 'row',marginLeft: 20, alignItems: 'flex-start', marginTop: 10}}>
                            <Text style={{color: appstyles.primaryColor, fontSize: 22, fontWeight: 'bold'}}>Fliter</Text>
                        <View style={{alignSelf: 'flex-end', flex: 1, alignSelf: 'center', alignItems: 'flex-end', marginRight: 20}}>
                            <TouchableOpacity><SvgXml xml={xml.cross} width={18} height={18}/></TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView horizontal={false}>
                    <View style={{flexDirection: 'column', alignSelf: 'flex-start', marginTop: 10}}>
                        <Text style={{color: appstyles.primaryColor, fontSize: 16, marginLeft: 20}}>Category</Text>
                        <View style={{flexDirection: 'row'}}>
                            {/* <FlatList 
                                data={category}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                // keyExtractor={item => item.id}
                                keyExtractor={(item, index) => {
                                    return `${item.id}product`;
                                }}
                                renderItem={itemData =>    
                                    <View style={{width: 100, height: 30, backgroundColor: appstyles.primaryColor, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 15, marginLeft: 10}}><Text style={{color: appstyles.white}}>{itemData.item.title}</Text></View> 
                                }
                            /> */}
                        </View>
                    </View>
                    <Text style={{color: appstyles.primaryColor, fontSize: 16, marginLeft: 20, marginTop: 15, alignSelf: 'flex-start'}}>Sort by</Text>                        
                    <View style={{flexDirection: 'column', alignSelf: 'flex-start'}}>
                        <View style={{flexDirection: 'row'}}>
                                <View style={{width: 70, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 20, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>Popularity</Text></View>
                                <View style={{width: 65, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>Newest</Text></View>
                                <View style={{width: 60, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>Oldest</Text></View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                                <View style={{width: 75, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 20, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>High Price</Text></View>
                                <View style={{width: 75, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>Low Price</Text></View>
                                <View style={{width: 60, height: 35, backgroundColor: appstyles.primaryColor, borderRadius: 12, marginLeft: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 12}}>Review</Text></View>
                        </View>
                    </View>
                    <Text style={{color: appstyles.primaryColor, fontSize: 16, marginLeft: 20, alignSelf: 'flex-start', marginTop: 15}}>Price Range</Text>
                    <View style={{flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 20}}>
                        <TextInput
                            style={styles.txtInput}
                            // onChangeText={text => onChangeText(text)}
                            // value={value}
                            placeholder="Min Price"
                            keyboardType='number-pad'
                            />
                        <TextInput
                            style={styles.txtInputTwo}
                            // onChangeText={text => onChangeText(text)}
                            // value={value}
                            placeholder="Max Price"
                            keyboardType='number-pad'
                            />
                    </View>
                    <View style={{marginTop: 20, alignSelf: 'center',  marginBottom: 15}}>
                        <TouchableRipple title="Hide Model" onPress={() => {}} rippleCentered={true}>
                            <View style={{width: 220, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}><Text style={{color: appstyles.white, fontSize: 18}}>Apply Filter</Text></View>
                        </TouchableRipple>
                    </View>
                    </ScrollView>
                </View>
            </Modal>
            </View>
            </ScrollView>
            }

            
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,
        marginTop: 20

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
       height: 45,
    //    marginTop: 50
       
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
}


});


export default CategoryScreen;

