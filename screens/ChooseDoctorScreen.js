import React,{useEffect,useState,useLayoutEffect} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
    ScrollView,
    Pressable, ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
//import Geolocation from '@react-native-community/geolocation';
import Alert from 'react-native/Libraries/Alert/Alert';
import { Platform, PermissionsAndroid,} from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import MapView,{Marker}  from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import DoctorProfileScreen from './DoctorProfileScreen'
import * as Animatable from 'react-native-animatable';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

const ChooseDoctorScreen = ({ navigation, route }) => {
    const [longitude, setLongitude] = React.useState(false);
    const [latitude, setLatitude] = React.useState(false);
    interface IGeolocation {
        latitude: number;
        longitude: number;
    }
    const [location, setLocation] = React.useState(null);

    const [granted, setGranted] = React.useState(null);
    console.log(route.params);
    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [appointmentViewVisible, setAppointmentViewVisible] = useState(false);
    const [doctorVisible, setDoctorVisible] = useState(true);
    const [personalVisible, setPersonalVisible] = useState(false);
    const [addressVisible, setAddressVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({
        '2021-05-16': {selected: true, marked: true, selectedColor: 'blue'},
    })

    const [firstName, setFirstName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [doctor,setDoctor]=useState({
        id:'',
        firstname:'',
        lastname:'',
        mail: '',
        phone:'',
        professional_info:{
            speciality:'',
            location:'',
        },

        picture_url:null,
    });
    const findCoordinates = async() => {
        try {
            let granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the gps1");
                setGranted(PermissionsAndroid.RESULTS.GRANTED)
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.log("problem");
            console.warn(err);
        }


    };
    useEffect(
        () => {

            if(addressVisible) {

                (() => findCoordinates())();
            }
        },[addressVisible]
    );
    useEffect(
        () => {

            if(addressVisible) {

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the gps2");
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const {latitude, longitude} = position.coords;
                            setLocation({
                                latitude,
                                longitude,
                            });
                            console.log("position", position);

                        },
                        (error) => {
                            // See error code charts below.
                            console.log(error.code, error.message);
                        },
                        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                    )
                }
            }
        }, [granted]
    );



    const db = firestore().collection('user').where('type','==','doctor')
       // .where('professional_info.speciality','==',route.params.spec)
     //   .where('professional_info.location','==',route.params.loc);

    useEffect(
        ()=>
        {

            db.onSnapshot(
                querySnapshot=>{
                    const list = [];
                    const image_url='';
                    querySnapshot.forEach(
                        (doc)=>{


                            list.push({
                                id: doc.id,
                                firstname: doc.data()['name']['firstname'],
                                lastname : doc.data()['name']['lastname'],
                                mail : doc.data()['mail'],
                                phone : doc.data()['phone'],
                                professional_info: {
                                    speciality: doc.data()['professional_info']['speciality'],
                                    location: doc.data()['professional_info']['location'],
                                },
                                picture_url: doc.data()['picture_url']
                            })




                        }
                    )

                    setItems(list);
                    if (loading) {
                        setLoading(false);
                    }

                    console.log(list)
                }
            )

        },[]
    );


    return (
        <View style={styles.container}>

            <Image
                style={{ flex:1, justifyContent: 'flex-end',width:width*1.2}}
                source={require("../assets/header.png")}
            />

            <View style={{flex: 12}}>
                {items &&(
                    <FlatList
                        data={items}

                        renderItem={({ item }) => {
                            return (

                                <View style={styles.action2}>
                                    <TouchableOpacity   style={styles.action2}
                                                        onPress={() => {
                                                            setViewVisible(true);
                                                            setCurrentItem(item);
                                                        }}
                                    >



                                    {item.picture_url &&
                                    (<View style={{flex:1,alignSelf:'center'}}>
                                        <Image source={{ uri: item.picture_url }}
                                               style={styles.image}
                                        />
                                    </View>)


                                    }
                                    {!item.picture_url &&
                                    ( <View style={{flex:1,alignSelf:'center'}}>
                                        <Image source={require('../assets/DoctorInfromation/avatar.png')}
                                               style={styles.image}
                                        />
                                    </View>)
                                    }

                                    <View style={{flex:3,alignSelf:'center'}}>
                                        <View style={{flex:1}}>

                                        </View>
                                        <Text style={{alignSelf: 'flex-start',fontSize: 18,color: '#19769F', flex:2,}}> Dr.{item.firstname}{"\r"}{item.lastname}</Text>
                                        <Text style={{alignSelf: 'flex-start',fontSize: 15,color: '#B9B8B8', flex:2,}}> {item.professional_info.speciality}</Text>
                                        <View style={{
                                            flexDirection: 'row', flexWrap: "wrap", flex:2,}}>
                                            <Image source={require('../assets/FindDoctor/placeholder.png')} style={{resizeMode:'stretch',height:'70%',width:'5%',aspectRatio: 0.8}}/>
                                            <Text style={{alignSelf:'center',fontSize: 15,color: '#B9B8B8'}}> {item.professional_info.location}</Text>
                                        </View>

                                    </View>
                                    </TouchableOpacity>

                                    </View>
                            );
                        }}
                    />

                    )
                }

            </View>
            { currentItem &&
                <Modal isVisible={viewVisible}
                       onBackdropPress={() => {
                           setViewVisible(false);
                           setDoctorVisible(true);
                           setPersonalVisible(false);
                           setAddressVisible(false);
                       }}
                       onSwipeComplete={() => setViewVisible(false)}
                       swipeDirection={'down'}
                       deviceWidth={width}
                       deviceHeight={height}
                       style={{margin: 0}}
                       backdropTransitionOutTiming={0}
                       animationInTiming={1300}
                       animationOut={'slideOutDown'}
                       animationOutTiming={1300}
                >

                    <View style={{
                        backgroundColor: '#fff',
                        top : 0,
                        width: width,
                        height: height * 0.7,
                        alignItems: 'center',
                    }}>

                            <View style={{


                                width:width*1.2,
                                height:"10%",
                                alignItems:'center',
                                alignContent: 'center',

                                borderColor: '#e2e2e2',
                              }
                            }

                        >
                                <ImageBackground
                                    style={{  height:"100%",width:width*1.2, flexDirection: 'row',  flexWrap: "wrap",alignItems:'center',
                                        alignContent: 'center',}}
                                    source={require("../assets/header.png")}
                                >
                                <View style={{flex:3,height:"100%",
                                    alignContent: 'center',}}

                                >
                                    <Icon.Button name="ios-arrow-back" size={40} backgroundColor="transparent" style={{marginLeft:50}}
                                                 onPress={()=>{
                                        setViewVisible(false);
                                        setPersonalVisible(false);
                                        setAddressVisible(false);
                                        setDoctorVisible(true);
                                    }} ></Icon.Button>
                                </View>
                                    <View style={{flex:3}}></View>
                                <View style={{flex:9,alignItems:'flex-start'}}>
                                    <Text style={{color:'#fff',fontSize:30}}>Doctor</Text>
                                </View>
                                </ImageBackground>
                            </View>


                        {
                            doctorVisible && (
                                <Animatable.View

                                    style={{height: '66%'}}>
                                    <View style={styles.header}>

                                        <Image source={{ uri: currentItem.picture_url }}
                                               style={{
                                                   height: '60%',
                                                   borderRadius: 400 / 2,

                                                   aspectRatio: 1,
                                               }}/>

                                        <Text style={styles.blueText}>Dr.{currentItem.firstname}{"\r"}{currentItem.lastname}</Text>
                                        <Text style={styles.greyText}> {currentItem.professional_info.speciality}</Text>

                                    </View>
                                    <View style={styles.action3}>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <TouchableOpacity style={{height:'40%'}}>
                                            <Image source={require('../assets/FindDoctor/photo-camera.png')}
                                                   style={styles.img}/>
                                            </TouchableOpacity>
                                            <Text style={styles.blueText}>photos</Text>

                                        </View>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <TouchableOpacity style={{height:'40%'}}>
                                                <Image source={require('../assets/FindDoctor/navigation.png')}
                                                       style={styles.img}   />
                                            </TouchableOpacity>
                                            <Text style={styles.blueText}>0.7 KM</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <TouchableOpacity style={{height:'40%'}}>
                                            <Image source={require('../assets/FindDoctor/phone-call.png')}
                                                   style={styles.img}/>
                                            </TouchableOpacity>
                                            <Text style={styles.blueText}>call</Text>
                                        </View>


                                    </View>

                                </Animatable.View>
                            )
                        }


                        <TouchableOpacity style={styles.action}
                                          onPress={() => {
                                              if (!personalVisible) {
                                                  setAddressVisible(false);
                                                  setPersonalVisible(true);
                                                  setDoctorVisible(false);
                                              }
                                              if(personalVisible)
                                              {
                                                  setPersonalVisible(false);
                                                  setDoctorVisible(true);
                                              }

                                          }}
                        >
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image source={require('../assets/FindDoctor/user.png')}
                                       style={{height: '50%', resizeMode: 'stretch', aspectRatio: 1}}/>
                            </View>
                            <View style={{flex: 5}}>
                                <Text style={{fontSize: 20, color: 'grey'}}>Personal information</Text>
                            </View>

                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image source={require('../assets/FindDoctor/left-arrow.png')}
                                       style={{height: '30%', resizeMode: 'stretch', aspectRatio: 0.8}}/>
                            </View>
                        </TouchableOpacity>
                        {
                            personalVisible && (
                                <Animatable.View


                                    style={{backgroundColor: 'red', height: '66%'}}>
                                    <Text> hello</Text>
                                </Animatable.View>
                            )
                        }


                        <TouchableOpacity style={styles.action}
                                          onPress={() => {
                                              if (!addressVisible) {
                                                  setDoctorVisible(false);
                                                  setPersonalVisible(false);
                                                  setAddressVisible(true);
                                              }
                                              if(addressVisible)
                                              {
                                                  setAddressVisible(false);
                                                  setPersonalVisible(true);
                                              }

                                          }}
                        >
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image source={require('../assets/FindDoctor/placeholder.png')}
                                       style={{height: '50%', resizeMode: 'stretch', aspectRatio: 0.8}}/>
                            </View>
                            <View style={{flex: 5}}>
                                <Text style={{fontSize: 20, color: 'grey'}}>Working address</Text>
                            </View>

                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image source={require('../assets/FindDoctor/left-arrow.png')}
                                       style={{height: '30%', resizeMode: 'stretch', aspectRatio: 0.8}}/>
                            </View>
                        </TouchableOpacity>
                        {
                            addressVisible && (
                                <Animatable.View


                                    style={{ height: '66%',...StyleSheet.absoluteFillObject,marginTop:"42%"}}>
                                    {location && (
                                        <MapView
                                            style={styles.map}
                                            region={{
                                                latitude: location.latitude,
                                                longitude: location.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}>
                                            <Marker
                                                coordinate={{
                                                    latitude: location.latitude,
                                                    longitude: location.longitude,
                                                }}
                                            />
                                        </MapView>

                                    )}
                                </Animatable.View>
                            )
                        }

                    </View>

                        <TouchableOpacity
                            style={{alignContent: 'center',marginTop:"5%",marginBottom:'13%',height : height*0.1}}
                            onPress={()=>{ setViewVisible(false);
                                setDoctorVisible(true);
                                setPersonalVisible(false);
                                setAddressVisible(false);
                                setAppointmentViewVisible(true);
                            }}
                        >
                            <Image source={require('../assets/FindDoctor/book.png')}    style={{resizeMode: 'stretch',width : width*0.98,alignItems: 'center',height : height*0.12}}/>

                        </TouchableOpacity>


                </Modal>

            }

            {currentItem &&
            <Modal isVisible={appointmentViewVisible}
                   onBackdropPress={() => {
                       setAppointmentViewVisible(false);

                   }}
                   onSwipeComplete={() => setViewVisible(false)}
                   swipeDirection={'down'}
                   deviceWidth={width}
                   deviceHeight={height}
                   style={{margin: 0}}
                   backdropTransitionOutTiming={0}
                   animationInTiming={1300}

            >

                <View style={{
                    backgroundColor: '#fff',
                    top: 0,
                    width: width,
                    height: height * 0.7,
                    alignItems: 'center',
                }}>
                    <View style={{

                        flex:1,
                        width:width*1.2,
                        height:"10%",
                        alignItems:'center',
                        alignContent: 'center',

                        borderColor: '#e2e2e2',
                    }
                    }

                    >
                        <ImageBackground
                            style={{  height:"100%",width:width*1.2, flexDirection: 'row',  flexWrap: "wrap",alignItems:'center',
                                alignContent: 'center',}}
                            source={require("../assets/header.png")}
                        >
                            <View style={{flex:3,height:"100%",
                                alignContent: 'center',}}

                            >
                                <Icon.Button name="ios-arrow-back" size={40} backgroundColor="transparent" style={{marginLeft:50}}
                                             onPress={()=>{
                                                 setAppointmentViewVisible(false);

                                             }} ></Icon.Button>
                            </View>
                            <View style={{flex:3}}></View>
                            <View style={{flex:9,alignItems:'flex-start'}}>
                                <Text style={{color:'#fff',fontSize:30}}>Doctor</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{flex:0.5}}>

                    </View>
                  <View style={{flex:7 ,width:"80%",alignSelf:'center'}}>
                      <Calendar
                          onDayPress={(day) => { setSelectedDate(day); setMarkedDates({
                              [day.dateString]: {selected: true, selectedColor: '#19769F'}});console.log('selected day', markedDates);}}
                          enableSwipeMonths={true}

                          markedDates={markedDates}


                      />

                  </View>
                </View>

                <TouchableOpacity
                    style={{alignContent: 'center',marginTop:"5%",marginBottom:'13%',height : height*0.1}}

                >
                    <Image source={require('../assets/FindDoctor/book.png')} style={{
                        resizeMode: 'stretch',
                        width: width * 0.98,
                        alignItems: 'center',
                        height: height * 0.12
                    }}/>

                </TouchableOpacity>
            </Modal>
            }
        </View>
    );
};

export default ChooseDoctorScreen;

const {height} = Dimensions.get("screen");const {width} = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    image:{
        height: "75%",alignSelf:'center', borderRadius: 400/ 2,marginTop:'15%',borderWidth :2, borderColor: '#e2e2e2',aspectRatio: 1
    },
    action3: {
        alignItems:'center',
        alignContent: 'center',
        flexDirection: "row",
        flexWrap: "wrap",
        width:width,
        flex:1,
    },
    img:{

        height:'90%',
        resizeMode:'stretch',
        aspectRatio:1,


    },
    header: {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: height*0.001,
        paddingHorizontal: width*0.001,
        borderRadius: 400/ 2
    },

    map: {
        ...StyleSheet.absoluteFillObject,


    },
    action2: {
        flex : 1,
        flexDirection: 'row',
        width:width,
        height:height*0.13,
        borderWidth : 0.7,
        borderTopWidth:0,
        flexWrap: "wrap",
        borderColor: '#e2e2e2',


    },
    blueText:{

        color:'#19769F',
        fontSize:17,
        marginTop:'3%'
    },
    greyText:{
        color:'#B9B8B8',
        fontSize:15,
        marginTop:'1%'
    },
    action: {

        flexDirection: 'row',
        width:width,
        height:"12%",
        borderWidth : 0.7,

        flexWrap: "wrap",
        borderColor: '#e2e2e2',
        alignItems:'center',
        alignContent:'center',
        alignSelf: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
});
