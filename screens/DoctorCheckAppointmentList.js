import React from 'react';

import auth,{ firebase }  from "@react-native-firebase/auth"
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity, ScrollView,
} from 'react-native';
import { Divider } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {useState,useEffect} from 'react';
import {Title} from 'react-native-paper';
import {PageContext} from '../components/context';
function ProfileScreen() {

    // const db=firebase.firestore();
    const [utilisateur,setUtilisateur] = React.useContext(PageContext);





    //console.log(route);
    return (


            <View style={styles.container}>
                <Text>{utilisateur.id}</Text>
            </View>

    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        alignItems: "center"
    },

});


