import React from 'react';
import { SafeAreaView, StyleSheet, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import Header from '../componets/header';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import HTML from "react-native-render-html";
import appstyles from '../styles/appstyles';

const terms  = (props) => {

    const {user} = React.useContext(AuthContext);
    const [data, setData] = React.useState([]);

    let token = "";
    token = user.data.token;

    React.useEffect(() => {
        axios.get('http://167.172.236.197:8003/api/general/content/terms/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setData(res.data);
        });
    },[]);

    let content = '';
    data.map((value, index) => {
        content = value.value.content;
    })
    
    const contentWidth = useWindowDimensions().width;

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        },1000)  
    });

    return (
        <SafeAreaView style={styles.container}>
             <Header title={"Terms & Conditions"} onPress={() => props.navigation.goBack(null)}/>
             {
                 loading ?  <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                 <ActivityIndicator size="large" color={appstyles.primaryColor} />
                </View> :   <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <HTML source={{ html: content }} contentWidth={contentWidth} containerStyle={{marginLeft: 18}} />
                </View>
             }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});

export default terms;