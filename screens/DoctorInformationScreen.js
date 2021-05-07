import React, {useEffect} from 'react';
import {
    View,
    Text,
    Button,
    Image,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    TextInput,
    Platform, PermissionsAndroid, Picker,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {  Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreScreen from './ExploreScreen';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import ProfileScreen from './ProfileScreen';
import DetailsScreen from './DetailsScreen';
import SettingsScreen from './SettingsScreen';
import MainTabScreen from './MainTabScreen';
import HomeScreen from './HomeScreen';
//import Geolocation from '@react-native-community/geolocation';
import Alert from 'react-native/Libraries/Alert/Alert';
import { SearchBar } from 'react-native-elements';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView,{Marker}  from 'react-native-maps';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FindDoctorScreen from './FindDoctorScreen';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import validator from 'validator';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer'
import auth, {firebase} from '@react-native-firebase/auth';
import ChooseDoctorScreen from './ChooseDoctorScreen';
const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SettingsStack = createStackNavigator();
import * as ImagePicker from "react-native-image-picker"
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
const GOOGLE_PLACES_API_KEY = 'AIzaSyCr7GbsKQ2p9oL6F43YqbyxqT7QbV79b5g'; // never save your real api key in a snack!
const DoctorInformationScreen = ({navigation}) => {
    let newWidth = 480;
    let newHeight =480;
    let compressFormat = 'PNG';
    let quality = 100;
    let rotation = 0;
    let outputPath = null;

    const {colors} = useTheme();
    const usersCollection = firestore().collection('patient');
    const [email, setEmail] = React.useState('');
    const [showLoading, setShowLoading] = React.useState(false);

    const [photo, setPhoto] = React.useState(null);
    const [selectedSpeciality, setSelectedSpeciality] = React.useState("Speciality");
    const [selectedLocation, setSelectedLocation] = React.useState("Location");
    //const { signUp } = React.useContext(AuthContext);

    const [longitude, setLongitude] = React.useState(false);
    const [latitude, setLatitude] = React.useState(false);
    interface IGeolocation {
        latitude: number;
        longitude: number;
    }
    const [location, setLocation] = React.useState(null);
    const [markerPosition, setMarkerLocation] = React.useState(null);

    const [granted, setGranted] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [userId, setUserId] = React.useState(auth().currentUser.uid);



    const __addPic =()=>
    { console.log("picking image")
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

   launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                setFile({
                    filePath: response,
                    fileData: response.data,
                    fileUri: response.uri
                });
            }
        });



   }

   useEffect(
       ()=>{
           if(file)
           {


               ImageResizer.createResizedImage(
                   file.fileUri,
                   newWidth,
                   newHeight,
                   compressFormat,
                   quality,
                   rotation,
                   outputPath,
               )
                   .then((response) => {
                       // response.uri is the URI of the new image that can now be displayed, uploaded...
                       //resized image uri
                       let uri = response.uri;
                       //generating image name
                       let imageName = 'profile_picture/' + userId;
                       //to resolve file path issue on different platforms
                       let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                       //setting the image name and image uri in the state
                       setImage({
                           uploadUri,
                           imageName,
                       });
                       setData({
                           ...data,
                           picture:image
                       })
                       console.log("image resizing ==",image)
                   })
                   .catch((err) => {
                       console.log('image resizing error => ', err);
                   });

           }
       },[file]
   )


    const __doAdd = async() => {

console.log("user id is",userId);


        if(image)
        {
            const ref = firebase.storage().ref(image.imageName);
           await
                ref.putFile(image.uploadUri)
                .then((snapshot) => {
                    //You can check the image is now uploaded in the storage bucket
                    console.log(image.imageName," has been successfully uploaded.");
                })
                .catch((e) => console.log('uploading image error => ', e));
           await  ref.getDownloadURL()
               .then(async(url) => {
                   await  firestore()
                       .collection('user')
                       .doc(userId)
                       .update({
                           picture_url:url,
                           professional_info:
                               {   location : selectedLocation.toLowerCase(),
                                   speciality: selectedSpeciality.toLowerCase()
                               }
                       })
               })
               .catch(e=>{console.log(e);})


        }

        auth()

            .signOut()
            .then(() => console.log('User signed out!'));
        console.log('informations done');
    }
    const handleChoosePhoto = () => {
        launchImageLibrary({ noData: true }, (response) => {
            // console.log(response);
            if (response) {
                setPhoto(response);
            }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#ffff' barStyle="dark-content"/>



            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <View style={{flex:1}}>
                <Text style={styles.text_header}>Working Information</Text>

                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        Please Fill this Form
                    </Text>
                </View>
                    <TouchableOpacity
                        style={{resizeMode: 'stretch',width: width*0.5,alignSelf: 'center',height: width*0.5,flex:1}}
                        onPress={() =>{__addPic()}}
                    >
                        {!image && <Image source={require('../assets/DoctorInfromation/avatar.png')}
                                          style={{width: width*0.5, height: width*0.5,alignSelf:'center', borderRadius: 400/ 2}}
                        />

                        }

                        {image &&
                        <Image source={{ uri: image.uploadUri }}
                               style={{width: width*0.5, height: width*0.5,alignSelf:'center', borderRadius: 400/ 2}}
                        />
                        }
                    </TouchableOpacity>
                    <View style={styles.action2} >
                        <Picker
                            mode = 'dropdown'
                            selectedValue={selectedLocation}
                            style={{flex: 1,
                                marginTop: Platform.OS === 'ios' ? 0 : 4,
                                height:height*0.065,
                                marginLeft: 18,
                                color: 'grey',

                                fontSize : height*0.03}}

                            onValueChange={(itemValue, itemIndex) => setSelectedLocation(itemValue)}

                        >
                            <Picker.Item label="curent location" value="curent location" />
                            <Picker.Item label="Ariana" value="Ariana" />
                            <Picker.Item label="Béja" value="Béja" />
                            <Picker.Item label="Ben Arous" value="Ben Arous" />
                            <Picker.Item label="Bizerte" value="Bizerte" />
                            <Picker.Item label="Gabès" value="Gabès" />
                            <Picker.Item label="Gafsa" value="Gafsa" />
                            <Picker.Item label="Jendouba" value="Jendouba" />
                            <Picker.Item label="Kairouan" value="Kairouan" />
                            <Picker.Item label="Kasserine" value="Kasserine" />
                            <Picker.Item label="Kébili" value="Kébili" />
                            <Picker.Item label="Le Kef" value="Le Kef" />
                            <Picker.Item label="Mahdia" value="Mahdia" />
                            <Picker.Item label="La Manouba" value="La Manouba" />
                            <Picker.Item label="Médenine" value="Médenine" />
                            <Picker.Item label="Monastir" value="Monastir" />
                            <Picker.Item label="Nabeul" value="Nabeul" />
                            <Picker.Item label="Sfax" value="Sfax" />
                            <Picker.Item label="Sidi Bouzid" value="Sidi Bouzid" />
                            <Picker.Item label="Siliana" value="Siliana" />
                            <Picker.Item label="Sousse" value="Sousse" />
                            <Picker.Item label="Tataouine" value="Tataouine" />
                            <Picker.Item label="Tozeur" value="Tozeur" />
                            <Picker.Item label="Tunis" value="Tunis" />
                            <Picker.Item label="Zaghouan" value="Zaghouan" />



                        </Picker>
                    </View>

    <View style={styles.action2}>
        <Picker
            mode = 'dropdown'
            selectedValue={selectedSpeciality}
            style={{flex: 1,
                marginTop: Platform.OS === 'ios' ? 0 : 4,
                height:height*0.065,
                marginLeft: 18,
                color: 'grey',

                fontSize : height*0.03}}

            onValueChange={(itemValue, itemIndex) => setSelectedSpeciality(itemValue)}

        >

            <Picker.Item label="Speciality" value="Speciality" />
            <Picker.Item label="ALLERGY AND IMMUNOLOGY" value="ALLERGY AND IMMUNOLOGY" />
            <Picker.Item label="ANESTHESIOLOGY" value="ANESTHESIOLOGY" />
            <Picker.Item label="DERMATOLOGY" value="DERMATOLOGY" />
            <Picker.Item label="DIAGNOSTIC RADIOLOGY" value="DIAGNOSTIC RADIOLOGY" />
            <Picker.Item label="EMERGENCY MEDICINE" value="EMERGENCY MEDICINE" />
            <Picker.Item label="FAMILY MEDICINE" value="FAMILY MEDICINE" />
            <Picker.Item label="INTERNAL MEDICINE" value="INTERNAL MEDICINE" />
            <Picker.Item label="NEUROLOGY" value="NEUROLOGY" />
            <Picker.Item label="OBSTETRICS AND GYNECOLOGY" value="OBSTETRICS AND GYNECOLOGY" />
            <Picker.Item label="PATHOLOGY" value="PATHOLOGY" />
            <Picker.Item label="PEDIATRICS" value="PEDIATRICS" />
            <Picker.Item label="PHYSICAL MEDICINE AND REHABILITATION" value="PHYSICAL MEDICINE AND REHABILITATION" />
            <Picker.Item label="PSYCHIATRY" value="PSYCHIATRY" />
        </Picker>
    </View>



                    <TouchableOpacity
        style={{resizeMode: 'stretch',width : width*0.9,alignItems: 'center',height : height*0.12,flex:1}}
        onPress={() => {__doAdd (  )}}
    >
        <Image source={require('../assets/SignUp/Button.png')}    style={{resizeMode: 'stretch',width : width*0.98,alignItems: 'center',height : height*0.12}}/>

    </TouchableOpacity>
</View>




            </Animatable.View>
        </View>
    );
}

export default DoctorInformationScreen;
const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: ('#3b8abd'),

        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize:25,
        }
    }}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
            title:'Home',
            headerLeft: () => (
                <Icon.Button name="ios-menu" size={40} backgroundColor="#3b8abd" onPress={() => navigation.openDrawer()}></Icon.Button>
            )
        }} />
    </HomeStack.Navigator>
);

const {height} = Dimensions.get("screen");const {width} = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        alignItems: "center"
    },
    map: {
        flex:8,


    },
    header: {
        flex: 1,
        paddingVertical: height*0.05,
        paddingHorizontal: width*0.05,
    },
    action2: {



        height:height*0.08,
        width:width*0.9,
        marginBottom: 20,
        borderWidth : 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#cfcfcf',
        paddingBottom: 1.5
    },
    footer: {
        flex: 15,
        backgroundColor: '#ffffff',

        paddingHorizontal: width*0.05
    },
    text_header: {
        color: '#2d7ba7',

        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        marginTop : 10,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : 4,
        height:height*0.065,
        paddingLeft: 20,
        color: '#b1b1b1',
        fontSize : height*0.025
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: height*0.04,




    },
    color_textPrivate: {
        color: 'grey',
        fontSize:height*0.02
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
});
