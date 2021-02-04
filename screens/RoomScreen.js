import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen({ route }) {

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const thread = route.params.item;
    const oppositeUserId = route.params.item._id;

    console.log("this is the id of the opposite user");
    console.log(oppositeUserId);

    const [messages, setMessages] = useState([
    ]);

    async function handleSend(message) {

        var text = message[0].text;

        await firestore()
            .collection('Chats')
            .doc(currentUser.uid)
            .collection('AllChatUsers')
            .doc(oppositeUserId)
            .collection('Chat')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email
                }
            });

    }



    useEffect(() => {

    //    firestore()
    //     .collection('Chats')
    //     .doc(currentUser.uid)
    //     .collection('Chat')
    //     .then(querySnapshot => {
    //         console.log('Total Users This is the data');
    //         querySnapshot.forEach(documentSnapshot => {
    //             console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //           });
    //     })

        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])



    return (
        <GiftedChat
            messages={messages}
            onSend={message => handleSend(message)}
            user={{ _id: currentUser.uid }}
            placeholder="Type a message..."
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
        />
    );
}

const styles = StyleSheet.create({
    sendingContainer: {
        marginRight: 10,
        marginBottom: 8,
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemMessageText: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold'
    },
});