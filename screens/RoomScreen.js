import React, { useState, useContext, useEffect, PermissionsAndroid } from 'react';
import { StyleSheet, View, Platform, TouchableOpacity, Alert } from 'react-native';
import {
    GiftedChat,
    Composer,
    Send,
} from 'react-native-gifted-chat';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import storage from '@react-native-firebase/storage';

export default function RoomScreen({ route }) {

    // This is for the image 

    const [uploading, setUploading] = useState(false);
    const [fileUri, setFileUri] = useState(null);

    // This is the for the message 

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;
    const [messages, setMessages] = useState(null);


    // Storing the message to the cloud firestore  
    async function handleSend(message) {

        // message[0].text ? text = message[0].text : image = message;

        const text = message[0].text ? message[0].text : message;


        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        var newId = array1[0] + array1[1];

        await firestore()
            .collection('Chats')
            .doc(newId)
            .collection('Chat')
            .add({
                // image,
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email,
                }
            })

    }

    // Fetching all the messages from the cloud firestore 

    useEffect(() => {

        const array1 = [currentUser.email, oppositeUserId]
        array1.sort()
        var newId = array1[0] + array1[1];

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

    const launch = async () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                setFileUri(response.uri)
                uploadImage(source)

            }
        });

    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <AntDesign name='downcircleo' size={30} color='#6646ee' />
            </View>
        );
    }

    // HERE WE ARE UPLOADING THE IMAGE ON THE FIRESTORE 

    const uploadImage = async (data) => {
        const { uri } = data;
        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setUploading(true);
        const task = storage()
            .ref(filename)
            .putFile(uploadUri);
        try {
            await task;
            console.log("Uploading...")
        } catch (e) {
            console.error(e);
        }
        setUploading(false);
        Alert.alert(
            'Photo uploaded!',
            'Your photo has been uploaded to Firebase Cloud Storage!'
        );
        const url = await storage()
            .ref(filename)
            .getDownloadURL();
        handleSend(url)
    };

    function renderSend(props) {
        return (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={launch}>
                    <Ionicons name='attach' size={35} color='#6646ee' />
                </TouchableOpacity>
                <Send {...props}>
                    <View style={styles.sendingContainer}>
                        <Ionicons name='send' size={28} color='#6646ee' />
                    </View>
                </Send>
            </View>
        );
    }

    return (
        console.log(messages),
        <GiftedChat

            messages={messages}

            onSend={message => handleSend(message)}
            user={{
                _id: currentUser.uid,
                // avatar: messages.text
            }}
            placeholder="Type a message..."
            showUserAvatar={true}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            showAvatarForEveryMessage={true}
            renderSend={renderSend}
            alwaysShowSend
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
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
    btnSection: {
        width: 225,
        height: 50,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        marginBottom: 10
    },
    btnText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold'
    },
    sendingContainer: {
        marginRight: 10,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
