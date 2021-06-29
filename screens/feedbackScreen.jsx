import React from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, ScrollView, Dimensions } from 'react-native'
import IconHeader from '../componets/iconHeader';
import xml from '../componets/svgxml';
import appstyles from '../styles/appstyles';
import { TouchableRipple } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../componets/context';
import { showMessage } from 'react-native-flash-message';
import { sleep } from '../utils/sleep';


const {height, width} = Dimensions.get('window')

const feedbackScreen = (props) => {

    const { user } = React.useContext(AuthContext);
    const [data, setData] = React.useState(null);

    let token = "";
    token = user.data.token;

    const [feedback, setFeedback] = React.useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        desc: "",
    });

    const handleSubmit = () => {
        axios.post('http://167.172.236.197:8003/api/general/contact-us/' , {
            "desc": `${feedback.desc}`,
            "email": `${feedback.email}`,
            "name": `${feedback.name}`,
            "phone": `${feedback.phone}`,
            "subject": `${feedback.subject}`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            setData(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <IconHeader icon={xml.help} title={"FeedBack & Help"} width={22} heigth={30} onPress={() => props.navigation.goBack(null)}/>
            
            <ScrollView style={{width: width}}>
                <View style={{alignItems: 'center', marginTop: 30}}>

                    <TextInput 
                        style={styles.titleInput}
                        onChangeText={text => setFeedback({...feedback, name: text})}
                        value={feedback.name}
                        placeholder="Name *"
                    />

                    <TextInput 
                        style={styles.titleInput}
                        onChangeText={text => setFeedback({...feedback, phone: text})}
                        value={feedback.phone}
                        keyboardType={'phone-pad'}
                        placeholder="Phone *"
                    />

                    <TextInput 
                        style={styles.titleInput}
                        onChangeText={text => setFeedback({...feedback, email: text})}
                        value={feedback.email}
                        placeholder="Email *"
                    />

                    <TextInput 
                        style={styles.titleInput}
                        onChangeText={text => setFeedback({...feedback, subject: text})}
                        value={feedback.subject}
                        placeholder="Subject *"
                    />

                    <TextInput 
                        style={styles.describeInput}
                        onChangeText={text => setFeedback({...feedback, desc: text})}
                        value={feedback.desc}
                        maxLength={100}
                        placeholder="Description *"
                    />

                    <Text style={{fontStyle: 'italic', alignSelf: 'flex-end', marginRight: 30, color: '#BEBEBE'}}>min 100 words</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
                        <Image source={require('../assets/images/VectorLine.png')} style={{width: 150, marginTop: 20, alignSelf: 'flex-start'}}/>
                        <Text style={{color: appstyles.primaryColor, fontSize: 20, marginLeft: 15, marginTop: 5}}>or</Text>    
                        <Image source={require('../assets/images/VectorLine.png')} style={{width: 160, marginTop: 20, marginLeft: 15}}/>
                    </View>

               </View>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Text style={{color: appstyles.primaryColor, fontSize: 20, marginTop: 8}}>Give a MissedCall</Text>
                        <Text style={{color: appstyles.primaryColor, fontSize: 20, marginTop: 5}}>999 999 9999</Text>

                        <Text style={{color: '#BEBEBE', marginTop: 8}}>Our Customer Executive will reach</Text>
                        <Text style={{color: '#BEBEBE'}}>back to you as soon as possible.</Text>    

                        <TouchableRipple
                        style={styles.btnSubmit}
                        onPress={() => {
                            handleSubmit()
                            sleep(2000)
                            showMessage({
                                message: "Successfully Submit",
                                description: "Thanks for giving us your feedback.",
                                type: 'success',
                                icon: 'success',
                                duration: 4000,
                                animationDuration: 300,
                                backgroundColor: '#192341',
                                color: '#fff',
                                style: styles.messageContainer,
                                
                            })
                        }}>
                            <Text style={{color: appstyles.white, fontSize: 20, alignSelf: 'center', marginTop: 15, fontWeight: 'bold'}}>Submit</Text>
                        </TouchableRipple>
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: appstyles.white,
    },
    roundContainer: {
        width: 290,
        height: 60,
        borderRadius: 50,
        marginTop: 50,
        backgroundColor: '#F8F8F8'
    },
    titleInput: {
        width: 300,
        height: 40,
        paddingLeft: 15,
        marginTop: 20,
        borderWidth: 0.50,
        borderRadius: 5,
    },
    describeInput: {
        width: 300,
        height: 200,
        paddingBottom: 170,
        paddingLeft: 15,
        marginTop: 20,
        borderWidth: 0.50,
        borderRadius: 5,
    },
    btnSubmit: {
        width: 250,
        height: 60,
        borderRadius: 6,
        backgroundColor: appstyles.primaryColor,
        marginTop: 30,
        marginBottom: 30,
    },
    messageContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

export default feedbackScreen
