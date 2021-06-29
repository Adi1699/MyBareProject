import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const starComponent = () => {
    const [defaultRating, setdefaultRating] = React.useState(3);
    const [maxRating, setmaxRating] = React.useState([1,2,3,4,5]);

    return (
        <View>
            <View style={styles.customRatingStar}>
               {
                   maxRating.map((item, key) => {
                       return(
                           <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                                onPress={() => setdefaultRating(item)}>

                               <Image 
                                    style={styles.starImgStyle}
                                    source={
                                        item <= defaultRating
                                        ? {uri: 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'}
                                        : {uri: 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'}
                                    }
                               />

                           </TouchableOpacity>
                       )
                   })
               }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    starImgStyle: {
       width: 40,
       height: 40,
       resizeMode: 'cover',
       marginLeft: 10,     
    },

    customRatingStar: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    }
});

export default starComponent
