import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen({ route }) {

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;


    const [messages, setMessages] = useState([
    ]);

    async function handleSend(message) {

        var text = message[0].text;

        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        console.log(array1[0] + array1[1])
        newId = array1[0] + array1[1];
        console.log(newId)

        await firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email
                }
            })

    }

    useEffect(() => {

        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        newId = array1[0] + array1[1];

        const messagesListener = firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();

                    const data = {
                        _id: doc.id,
                        ...firebaseData
                    };

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.email
                        };
                    }

                    return data;
                });

                setMessages(messages);
            });

        return () => messagesListener();
    }, []);


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

