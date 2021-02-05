import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GiftedChat, Composer } from 'react-native-gifted-chat';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

import ImagePicker from 'react-native-image-picker';

export default function RoomScreen({ route }) {

    // This is for the image 

    const [image, setImage] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const [uploading, setUploading] = useState(false);

    // This is the for the message 

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;


    const [messages, setMessages] = useState(null);

    // renderComposer = props => {
    //     return (
    //       <View style={{flexDirection: 'row'}}>
    //         <Composer {...props} />
    //         <CustomImageButton />
    //         <CustomAttachButton />
    //       </View>
    //     );
    //   }

    async function addImage(image) {
        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        newId = array1[0] + array1[1];

        await firestore()
        .collection('Chats')
        .doc(newId)
        .collection('Chat')
        .add(
            {
                image,
                createdAt: new Date().getTime(),
                user:{
                    _id: currentUser.uid,
                    email: currentUser.email,
                }
            }
        )
    }

    async function handleSend(message) {

        var text = message[0].text;

        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        newId = array1[0] + array1[1];

        await firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email,
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
            // renderComposer={this.renderComposer}
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
