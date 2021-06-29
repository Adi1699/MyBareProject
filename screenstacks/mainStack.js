import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Screens
import loginScreen from '../screens/loginScreen';
import registerScreen from '../screens/registerScreen';
import verificationScreen from '../screens/verificationScreen';
import EditProfile from '../screens/editProfile';
import menuOverLay from '../screens/menuOverlayScreen';
import MyOrder from '../screens/myOrderScreen';
import WhishList from '../screens/whishlistScreen';
import PaymentDetailScreen from '../screens/paymentDetailScreen';
import FeedBack from '../screens/feedbackScreen';
import Search from '../screens/searchScreen';
import CartScreen from '../screens/cartScreen';
import OrderScreen from '../screens/orderScreen';
import Product from '../screens/productScreen';
import Error from '../componets/errorModel'; 
import Sample from '../screens/sample';
import Terms from '../screens/terms';
import Category from '../screens/categoryScreen';
import ProductWholeSale from '../screens/../screens/productScreenWholesale';
import Shipping from '../screens/shippingAddress';
//ScreenStacks
import tabStack from './tabStack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const MainStack = () => {
    return(
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Tab" screenOptions={{headerShown: false}}>
                  <Stack.Screen name="Tab" component={tabStack}/>
                  <Stack.Screen name="Login" component={loginScreen}/>
                  <Stack.Screen name="Register" component={registerScreen}/>
                  <Stack.Screen name="Verification" component={verificationScreen}/>
                  <Stack.Screen name="EditProfile" component={EditProfile}/>
                  <Stack.Screen name="Menu" component={menuOverLay}/>
                  <Stack.Screen name="MyOrder" component={MyOrder}/>
                  <Stack.Screen name="WhishList" component={WhishList}/>
                  <Stack.Screen name="Payment" component={PaymentDetailScreen}/>
                  <Stack.Screen name="FeedBack" component={FeedBack}/>
                  <Stack.Screen name="Search" component={Search}/>
                  <Stack.Screen name="Cart" component={CartScreen}/>
                  <Stack.Screen name="Order" component={OrderScreen}/>
                  <Stack.Screen name="Product" component={Product}/>
                  <Stack.Screen name="Error" component={Error}/>
                  <Stack.Screen name="Sample" component={Sample}/>
                  <Stack.Screen name="Terms" component={Terms}/>
                  <Stack.Screen name="ProductWholeSale" component={ProductWholeSale}/>
                  <Stack.Screen name="Category" component={Category}/>
                  <Stack.Screen name="Shipping" component={Shipping}/>
                </Stack.Navigator>
              </NavigationContainer>
    );
}

export default MainStack;