import React from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, Dimensions, Text, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../componets/header';
import appstyles from '../styles/appstyles';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import SearchableDropdown from 'react-native-searchable-dropdown';

const {height, width} = Dimensions.get('window')

// Components
import HistoryCon from '../componets/historyCon';

const searchScreen = (props) => {

    // const products = useSelector(state => state.products.availableProducts);
    const [product, setProduct] = React.useState([]);

    async function productDetails () {
        let res = await axios.get('http://167.172.236.197:8003/api/products/product/')
        let productArray = [...res.data]
        productArray.pop()
        setProduct(productArray)
    }
    
    React.useEffect(() => {
        productDetails()
    },[])


       // ImgURL
       let popular = [];    
       for (const key in product) {
           popular.push({
               itemImgDetail: product[key].images
           })
       }


       // console.log(popular.length)
       let imgURL = [];
       popular.map((value, index) => {
           value.itemImgDetail.map((value, index) => {
               imgURL.push({id: value.id, url: value.image, productID: value.product})
           })
       });
   
    //    console.log(popular)

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
   
    let items = [];
    product.map((value, index) => {
        items.push({
            id: value.id,
            name: value.name
        })
    })

    const [latest, setLatest] = React.useState([]);
    const [value, onChangeText] = React.useState('');

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },1500)  
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header title={"Search"} onPress={() => props.navigation.goBack(null)}/>
                <View style={styles.mainContainer}>
                <SearchableDropdown
                        onTextChange={(text) => setLatest(text)}
                        onItemSelect={(item) => {
                            props.navigation.navigate("Product",{
                                productId: item.id,
                                productTitle: item.name,
                            })
                        }}
                        textInputStyle={{
                            padding: 12,
                            borderWidth: 1,
                            backgroundColor: '#fff',
                            borderRadius: 8,
                        }}
                        itemTextStyle={{
                            color: '#222'
                        }}
                        itemsContainerStyle={{
                            maxHeight: 100,
                        }}
                        items={items}
                        defaultIndex={2}
                        resetValue={false}
                        placeholder="Search"
                        underlineColorAndroid="transparent"
                        resPtValue="false"
                        containerStyle={{ padding: 5, width: 300,}}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#fff',
                            borderColor: '#000',
                            borderWidth: 0.3,
                            borderRadius: 5,
                        }}      
                        listProps={
                            {
                                nestedScrollEnabled: true
                            }
                        }
                    />
                </View>

                {/* <View style={{marginTop: 20, flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 40}}><Text style={{color: appstyles.tabGray}}>Lastest search</Text></View> */}
              
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={styles.history}>
                        {/* {
                            latest.map((value, index) => {
                                return (
                                    <HistoryCon key={index} title={value}/>
                                )
                            })
                        }                                    */}
                    </View>
                </View>

                <View style={{marginTop: 40, flexDirection: 'row', alignSelf: 'flex-start', marginLeft: 40}}><Text style={{color: appstyles.primaryColor, fontSize: 18}}>Popular Products</Text></View>
                 {
                     loading ?  <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                     <ActivityIndicator size="large" color={appstyles.primaryColor} />
                 </View> :  <View style={{flexDirection: 'row'}}>
                    <View style={styles.bottomContainer}>
                            <FlatList 
                                data={popularArray}
                                // keyExtractor={item => item.itemID}
                                keyExtractor={(item, index) => {
                                    return `${item.itemID}product`;
                                }}
                                renderItem={itemData =>    
                                    <View style={{width: width, backgroundColor: '#FCFCFC', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                            <View style={{flexDirection: 'row'}}>
                                            <View style={styles.imgContainer}>  
                                                <Image source={{uri: `http://167.172.236.197:8003${itemData.item.itemImgURL}`}} style={{width: 65, height: 65}}
                                                />
                                            </View>
                                                <View style={{flexDirection: 'column'}}>
                                                    <Text style={{fontSize: 18, marginLeft: 30}}>{itemData.item.itemTitle}</Text>                 
                                                    <View style={{flexDirection: 'row', marginTop: 12}}>
                                                        <View style={{flexDirection: 'row', marginLeft: 30}}>
                                                            <SvgXml xml={xml.yellowStar}/>
                                                            <Text>4.6</Text>
                                                        </View>
                                                        <View style={{marginLeft: 30, flexDirection: 'row'}}>
                                                            <Text>86</Text>
                                                            <Text style={{marginLeft: 5}}>Reviews</Text>
                                                        </View>
                                                        <View style={{marginLeft: 50}}>
                                                        <TouchableOpacity 
                                                            onPress={() => {
                                                                props.navigation.navigate("Product",{
                                                                    productId: itemData.item.itemID,
                                                                    productTitle: itemData.item.itemTitle,
                                                                })
                                                            }}>
                                                            <SvgXml xml={xml.threeDots}/>
                                                        </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    </View>   
                                                </View>
                                      </View>
                                }
                            />
                    </View>
                 
                </View>
                 }
               
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    txtInput: {
        borderColor: 'gray', 
        borderWidth: 1, 
        width: Dimensions.get('window').width - 70, 
        backgroundColor: '#fff', 
        zIndex: 1, 
        borderRadius: 12,
        paddingLeft: 50,
        paddingRight: 10,
        paddingVertical: 8,
    },
    mainContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
    },
    iconStyle: {
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 2
   },
   history: {
        flexDirection: 'column',
        alignItems: 'center',
        // alignItems: 'center',
        // backgroundColor: 'red', 
        flex: 1, 
        // backgroundColor: 'red',
        // alignItems: 'flex-start',
   },
   bottomContainer: {
        flex: 1,
        flexDirection: 'column', 
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    
    },
    imgContainer: {
        width: 90, 
        height: 90, 
        backgroundColor: '#EDEDED', 
        borderRadius: 18, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

export default searchScreen
