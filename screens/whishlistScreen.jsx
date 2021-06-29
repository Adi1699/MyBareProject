import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import appstyles from '../styles/appstyles';
import { addToWishlist, removeFromWishlist } from '../redux/actions/wishlist';
import { connect } from 'react-redux';
import { AuthContext } from '../componets/context';
const {height, width} = Dimensions.get('window')

const _whishlistScreen = (props) => {

    const { wishlistItemsReducer } = props;
    const { wishlist } = wishlistItemsReducer;

    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;

    // console.log(wishlist)
    let finalWishlist = [];
    wishlist.map((value, index) => {
        value.map((item, index) => {
            if ( value[0].itemWishlistUserToken === token ) {
                finalWishlist.push({
                    itemId: value[0].itemWishlistId,
                    itemName: value[0].itemWishlistTitle,
                    itemSize: value[0].itemWishlistSize,
                    itemPrice: value[0].itemWishlistPrice,
                    itemToken: value[0].itemWishlistUserToken,
                    itemSymbol: value[0].itemWishlistQuanSymBol
                })
            }
        })
    })


    const { switchState } = React.useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                            onPress={() => {}}>
                            <SvgXml xml={xml.Arrow} width={12} height={45} onPress={() => props.navigation.goBack(null)}/>
                    </TouchableOpacity>
                    <SvgXml xml={xml.wishlist} width={20} height={20} style={styles.iconContainer}/>
                    <Text style={styles.txtTitle}>Wishlist</Text>
                </View>
                
                <View style={{marginLeft: 20}}>
                       <FlatList 
                            data={finalWishlist}
                            keyExtractor={(item, index) => {
                                return `${item.itemId}product`;
                            }}
                            renderItem={itemData =>    
                                <View style={styles.mainContainer}>
                                    <View style={{flexDirection: 'row'}}>    
                                        <View style={{flexDirection: 'column', marginTop: 24, marginLeft: 20}}>
                                                <Text style={{fontSize: 18, color: appstyles.primaryColor, fontWeight: '700'}}>{itemData.item.itemName}</Text>
                                        </View>
                                        <View style={{marginTop: 24, marginLeft: 10, flexDirection: 'row'}}>
                                            <Text style={{fontSize: 18, fontWeight: '700'}}>({itemData.item.itemSize})</Text>
                                            <Text style={{fontSize: 18, fontWeight: '700', marginLeft: 3}}>{itemData.item.itemSymbol}</Text>
                                        </View>
                                        <View style={{marginTop: 24, marginLeft: 10}}>
                                            <Text style={{fontSize: 18, fontWeight: '700'}}>₹ {itemData.item.itemPrice}</Text>
                                        </View>  
                                    </View>  
                                    <Image source={require('../assets/images/VectorLine.png')} style={{width: width - 20, marginTop: 10}}/>
                                </View>
                             }
                        />
                </View>
            </View>
       </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    wishlistItemsReducer: state.wishlistItemsReducer
})

const whishlistScreen = connect(mapStateToProps, { addToWishlist, removeFromWishlist })(_whishlistScreen)

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: width,
        height: 50,
        marginLeft: 5,
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
        marginTop: 12,
        marginLeft: 18,
        color: '#192341'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,
    },
    mainContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        marginLeft: -8,
        marginTop: 5,
        width: width,
        // backgroundColor: 'red'
    },
    checkBoxContainer: {
        marginTop: 18,
        position: 'absolute',
        left: 8,
    }
});

export default whishlistScreen;
