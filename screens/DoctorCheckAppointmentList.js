import React, { Fragment } from 'react';
import PushController from '../components/PushController';
import auth,{ firebase }  from "@react-native-firebase/auth"
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity, ScrollView, FlatList, Dimensions, StatusBar, SafeAreaView,
} from 'react-native';
import {Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import moment from "moment";
import { Divider } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {useState,useEffect} from 'react';
import {Title} from 'react-native-paper';
import {PageContext} from '../components/context';
function ProfileScreen() {

    // const db=firebase.firestore();
    const [utilisateur,setUtilisateur] = React.useContext(PageContext);
    const [items,setItems] = useState(false);
    const db = firestore().collection('user').doc(utilisateur.id).collection('appointment')
    let pushData = [
        {
            title: "First push",
            message: "First push message"
        },
        {
            title: "Second push",
            message: "Second push message"
        }
    ]

   const _renderItem = ({ item }) => (
        <View key={item.title}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
        </View>
    );
    useEffect(()=>{

        db.onSnapshot(
            querySnapshot=>{
                const list = [];

                querySnapshot.forEach(
                    (doc)=>{

                        doc.data()['docRef'].get().then((documentSnapshot)=>{
                            console.log('doc is ',documentSnapshot)
                           list.push({
                               id: moment(documentSnapshot.data()['date']).toString(),

                           })
                       })





                    }
                )

                setItems(list);


                console.log(list)
            }
        )
    },[])




    //console.log(route);
    return (

        <Fragment>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                    <Header />
                    <View style={styles.listHeader}>
                        <Text>Push Notifications</Text>
                    </View>
                    <View style={styles.body}>
                        <FlatList
                            data={pushData}
                            renderItem={(item ) => _renderItem(item)}
                            keyExtractor={(item ) => item.title}
                        />
                        {/* <LearnMoreLinks /> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <PushController/>
        </Fragment>

    );
};

export default ProfileScreen;
const {height} = Dimensions.get("screen");const {width} = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        alignItems: "center"
    },
    scrollView: {backgroundColor: Colors.lighter,},
    listHeader:{ backgroundColor: '#eee', color: "#222", height: 44, padding: 12},
    title:{fontSize: 18, fontWeight: 'bold', paddingTop: 10},
    message:{ fontSize: 14, paddingBottom: 15, borderBottomColor: "#ccc", borderBottomWidth: 1},
    engine: { position: 'absolute', right: 0,},
    body: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 10, },
    sectionContainer: { marginTop: 32, paddingHorizontal: 24, },
    sectionTitle: { fontSize: 24, fontWeight: '600', color: Colors.black},
    sectionDescription: { marginTop: 8, fontSize: 18, fontWeight: '400', color: Colors.dark,},
    highlight: { fontWeight: '700'},
    footer: { color: Colors.dark, fontSize: 12, fontWeight: '600', padding: 4, paddingRight: 12, textAlign: 'right',},


});


