import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import RNRasa from 'react-native-rasa';

const DetailsScreen = ({navigation}) => {
    const HOST = 'http://localhost:5005';
    const [state, setState] = React.useState({

        messages: [
            {
                _id: 1,
                text: `Hi! I am DoctorSina.\n\nHow may I help you with today?`,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'FAQ Bot',
                    avatar: 'https://i.imgur.com/7k12EPD.png'
                }
            }
        ]
    });
   function  onSend(messages = []) {
        setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
    }

    return (

          <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <RNRasa
                  host={HOST}
                  onSendMessFailed={(error) => console.log(error)}
                  emptyResponseMessage="Sorry, I don't understand"
                  onEmptyResponse={() => console.log('Handle with your custom action')}
              />


      </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
