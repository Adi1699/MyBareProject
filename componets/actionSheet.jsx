import React from 'react'
import { Text, StyleSheet, View, Dimensions, Animated} from 'react-native';
import { SvgXml } from 'react-native-svg';
import xml from '../componets/svgxml';
import appstyles from '../styles/appstyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from './context';

const {height, width} = Dimensions.get('window')
const actionSheet = (props) => {

    const { user } = React.useContext(AuthContext);
    let token = '';
    token = user.data.token;

    const alignment = React.useRef(new Animated.Value(0)).current;
    const [openSheet, setOpenSheet] = React.useState(false);
    
    const [shouldShow, setshouldShow] = React.useState(false);

    const handleOpenSheet = () => {
        setOpenSheet(!openSheet)
        setshouldShow(!shouldShow)
        if (openSheet){
            Animated.timing(alignment, {
                toValue: 140,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(alignment, {
                toValue: 10,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }

    }

    const [coupon, setCoupons] = React.useState([]);
    const assignCoupon = async() => {
        await axios.get('http://167.172.236.197:8003/api/orders/assign-coupon/', {
            headers: {
                'Authorization': `Bearer ${token}`   
            }
        })
        .then(res => {
            // console.log(res.data);
            setCoupons(res.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    React.useEffect(() => {
         assignCoupon();
    },[])

    return (

        <Animated.View style={[styles.bottomSheetContainer, {transform: [{translateY: alignment}]}]}>
    
            <View style={styles.SheetContent}>
                <View style={{position: 'absolute', top: -30, alignSelf: 'center'}}>                     
                    <TouchableOpacity onPress={() => handleOpenSheet()}>
                        <View style={styles.SheetOpenBtn}>
                            {
                                openSheet ? <Icon name="chevron-down-outline" color={'#fff'} size={20}/> : <Icon name="chevron-up-outline" color={'#fff'} size={20}/>
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                {
                    shouldShow ? (
                        <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 20}}>
                             <View style={{marginTop: 10, borderRadius: 15, width: width - 65, borderWidth: 1, borderColor: '#8C91A0'}}>
                              <Picker style={{width: 280, height: 50, borderWidth: 0.2, borderRadius: 8}}>
                                    <Picker.Item label="No Coupons available" value="None"/>
                                    {
                                        coupon.map((value, index) => {
                                            return (
                                                <Picker.Item label={value}  value={value} key={index}/>
                                            );
                                        })
                                    }
                              </Picker>
                             </View>
                             <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                                    <TouchableOpacity onPress={props.onDelete}>
                                        <View style={{width: 130, height: 50, marginTop: 20, borderRadius: 6, borderWidth: 0.5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: 'red', fontSize: 18}}>Delete Order</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{marginLeft: 20}}>
                                        <TouchableOpacity>
                                            <View style={{width: 130, height: 50, marginTop: 20, borderRadius: 6, backgroundColor: appstyles.primaryColor, justifyContent: 'center', alignItems: 'center'}}>
                                                    <Text style={{color: '#fff', fontSize: 18}}>{props.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                             </View>   
                       </View>  
                    
                    ) : (

                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 175, alignItems: 'center'}}>
                                <Text style={{color: appstyles.primaryColor, fontSize: 18, fontWeight: 'bold'}}>{props.title}</Text>
                            </View>
                            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 30}}>
                                <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
                                    <View style={{width: 50, height: 50, backgroundColor: appstyles.primaryColor, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}>
                                        <SvgXml xml={xml.rightWhiteArrow}/>  
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    )
                }
                


            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    SheetContent: {
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        position: 'relative',
        borderWidth: 0.5,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
    },
    SheetOpenBtn: {
        height: 30,
        width: 40,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: appstyles.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomSheetContainer: {
        height: 330, 
        backgroundColor: '#fff', 
        width: Dimensions.get('screen').width,
        position: 'absolute',
        zIndex: 1,
        bottom: -100,
    }
});

export default actionSheet
