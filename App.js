import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from "./componets/context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import FlashMessage from 'react-native-flash-message';
import { MenuProvider } from 'react-native-popup-menu';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

// Redux
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import cartReducer from './redux/reducers/ cart';
import cartWholeSaleReducer from './redux/reducers/cartWholesale';
import wishlistReducer from './redux/reducers/wishlist';
import { createAction } from './componets/createAction';

import { sleep } from './utils/sleep';
import MainStack from './screenstacks/mainStack';
import AuthStack from './screenstacks/authStack';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['wishlist']
}

const rootReducer = combineReducers({
    cart: cartReducer,  
    cartWholeSale: cartWholeSaleReducer,
    wishlistItemsReducer: persistReducer(persistConfig, wishlistReducer),
})

const store = createStore(rootReducer, applyMiddleware(thunk));
const appPersist = persistStore(store);

export default function App(props) {

  const [googleSign, setGoogleSign] = React.useState(false);
  const [state, dispatch] = React.useReducer((state, action) => {

    switch(action.type) {
      case 'SET_USER':
        return {
          ...state,
          user: {...action.payload},
        };
      case 'REMOVE_USER':
        return {
          ...state,
          user: undefined,
        };
      case 'EMAIL_VERIFICATION':
          return {
            ...state,
            user: {...action.verification},
          };
      default:
        return state;  
    }
  },{
    user: undefined,
  });

  const auth = React.useMemo(() => ({
    login: async(email, password) => {
      await sleep(2000);
      const {data} = await axios.post('http://167.172.236.197:8003/api/accounts/login/', {
        "email": `${email}`,
        "password": `${password}`,
      });

      const user = {
        data
      };
      dispatch(createAction('SET_USER', user));
    },
    googleLogin: async() => {
      const config = {
        androidClientId: `889541747246-8khqfboi0f0h8vst1n838l159avmtt5n.apps.googleusercontent.com`,
        iosClientId: `889541747246-aos66mockrrvp72bmio1sn7krfs76kcn.apps.googleusercontent.com`,
        scopes: ['profile', 'email']
      };

     await Google
        .logInAsync(config)
        .then((result) => {
          const {type, accessToken} = result;
            const user = {
              result
            };
            if (type === 'success') {
              setTimeout(() =>  dispatch(createAction('SET_USER', user)), 1000);
            } else {
              
            }
        })
        .catch(error => {
          console.log(error);
          // handleMessage('An error occurred. Check your connection and try again.');
        })
    },
    facebookLogin: async() => {
        try {
          await Facebook.initializeAsync({
            appId: '166823905465763',
          });
          const {
            type,
            token,
            userId,
            expirationDate,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          const user = {
            token,
            userId,
          }
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            setTimeout(() =>  dispatch(createAction('SET_USER', user)), 1000);
            // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);

          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
    },
    logout: async() => {
      dispatch(createAction('REMOVE_USER'));
    },
    email_verify: async(email) => {
      await sleep(2000);
      const {data} =  await axios.post('http://167.172.236.197:8003/api/accounts/email-verify/', {
        "email": `${email}`,
        "frontend_url": `${'exp://192.168.1.3:19000/--/register?email='}${email}&v=`,
      }); 
    },
    register: async(fname, company, lname, email, phone, password, v) => {
      await sleep(2000);
      const {data} = await axios.post('http://167.172.236.197:8003/api/accounts/register/', {
        "first_name" : `${fname}`,
        "company": `${company}`,
        "last_name": `${lname}`,
        "email": `${email}`,
        "phone": `${phone}`,
        "password": `${password}`,
        "link": `${v}`,
      });
      // console.log(v)
    },
  }), 
     [],
  );

  const [switchState, setSwitchState] = React.useState(false);
  const gettingBol = (isSwitchOn) => {
      setSwitchState(isSwitchOn);
  };

  return (
    <AuthContext.Provider value={{auth, user: state.user, gettingBol, switchState}}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={appPersist}> 
          <MenuProvider>
          <SafeAreaProvider>
            {
              state.user ? (
                <MainStack />
              ) : (
                <AuthStack />
              )
            }
            <FlashMessage position="bottom"/>
          </SafeAreaProvider>
          </MenuProvider>
      </PersistGate>
    </Provider>
    </AuthContext.Provider>
  );
}

