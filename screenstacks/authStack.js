import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import loginScreen from '../screens/loginScreen';
import registerScreen from '../screens/registerScreen';
import verificationScreen from '../screens/verificationScreen';
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from 'expo-linking'; 

const prefix = Linking.makeUrl("/");

const AuthStack = createStackNavigator();

const AuthStackScreens = (props) => {

    const [data, setData] = React.useState(null);

    const linking = {
        prefixes: [prefix],
        config: {
          screens: {
              Register: "register",
          },
        },
      }
    
      function handleDeepLink(event) {
          let data = Linking.parse(event.url);
          setData(data)
        }
  
    
        React.useEffect(() => {
          
          async function getInitialURL() {
            const initialURL = await Linking.getInitialURL();
            if (initialURL) setData(Linking.parse(initialURL));
          } 
          
          Linking.addEventListener("url", handleDeepLink);
          if (!data) {
            getInitialURL();
          }
      
          return (() => {
            Linking.removeEventListener("url");
          })
        }, []);
      

    return(
            <NavigationContainer linking={linking}>
                <AuthStack.Navigator headerMode="none" >
                    <AuthStack.Screen name="Login" component={loginScreen}/>
                    <AuthStack.Screen name="Verification" component={verificationScreen}/>
                    <AuthStack.Screen name="Register" component={registerScreen} options={{token: data}}/>
                </AuthStack.Navigator>
            </NavigationContainer>
    );
}

export default AuthStackScreens;