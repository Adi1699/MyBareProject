import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';

const Tab = createBottomTabNavigator();

import HomeScreen from '../screens/HomeScreen';
import MenuOverLay from '../screens/menuOverlayScreen';
import CartScreen from '../screens/cartScreen';
import appstyles from '../styles/appstyles';
import { Platform } from 'react-native';

const tabStack = ({ navigation }) => {

    return (
        <Tab.Navigator
           initialRouteName="Home"
           screenOptions={({ route }) => ({
               tabBarIcon: ({ focused, color, size,}) => {
                   let iconName;
                   
                   if (route.name === "Menu") {
                       iconName = xml.menu;
                   } else if (route.name === "Home") {
                       iconName = xml.home;
                   } else if (route.name === "Cart") {
                       iconName = xml.cart;
                   } 
                   return <SvgXml xml={iconName} height={size} width={size} color={color}/>
               } 

           })}
           tabBarOptions={{
               activeTintColor: appstyles.white,
               keyboardHidesTabBar: true,
               inactiveTintColor: appstyles.tabGray,
               style: {
                   height: Platform.OS ==='android' ? 65 : 90,
                   backgroundColor: appstyles.primaryColor,
                   borderTopWidth: 2,
                   paddingTop: 5,
               }, 
               labelStyle: {
                   fontSize: 13,
                   marginTop: 0,
                   marginBottom: 8,
               },
           }}
           >
            <Tab.Screen name="Menu" component={MenuOverLay}/>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Cart" component={CartScreen}/>
        </Tab.Navigator>    
    )
}

export default tabStack
