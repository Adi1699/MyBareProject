import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import NumberFormat from 'react-number-format';
import { addToCart, deleteFromCart } from '../redux/actions/cart';
import { connect } from 'react-redux';
import CartComponent from '../componets/cartComponent';

const {height, width} = Dimensions.get('window')

const arr = [
     {
        "items":  [
           [
             {
              "itemCartItemBrand": "JINDAL",
              "itemCartItemCategory": "MS TMT Bar",
              "itemCartItemHSNCode": "7214",
              "itemCartItemID": 7,
              "itemCartItemId": 2,
              "itemCartItemImage": "/media/product/images/tmt_bar_iFZEnCG.png",
              "itemCartItemPrice": 1011,
              "itemCartItemQuantity": 1,
              "itemCartItemSub":  [
                "MS TMT Bar -Fe 500",
                "MS TMT Bar -Fe 550",
              ],
              "itemCartItemTitle": "MS TMT Bar",
              "itemCartItemVariant": "10",
              "itemCartProductID": 37,
              "showItem": true,
              "userToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjI3MjE3NTA2LCJqdGkiOiI1YjM0ODdiOTAyMTg0OWMzODU2OTMxYmE3ZWNmZGM1ZiIsInVzZXJfaWQiOiJjOTA4MTg0Mi04ZjkyLTQ1ZDAtOThlOC1iYzM5YTU2Yzk2ZTkifQ.Wo0wk1lGiYtrIbij82t2Zog7JWqqUUnJGAGXt_GGX94",
            },
          ],
        ],
      } 
];



const _sample = (props) => {

    const { cart, addToCart, removeFromCart } = props;

    // console.log(cart)

    arr.map((value, index) => {
        value.items.map((value,index) => {
            value.map((value, index) => {
                console.log(value.itemCartItemVariant)
            })
        })
    })
        

      return (
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              
                <CartComponent />

          </View>
      );
}

const mapStateToProps = (state) => {
    const cart = state.cart;
    return { cart };  
}; 

const Sample = connect(mapStateToProps, { addToCart, deleteFromCart })(_sample)

const styles = StyleSheet.create({
    menu: {
        fontSize: 18,
        color: 'red'
    }
});



export default Sample;

