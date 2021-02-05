import React, { useState, useContext, useEffect, Fragment } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import {
    GiftedChat,
    Composer,
    Actions,
    ActionsProps,
} from 'react-native-gifted-chat';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RoomScreen({ route }) {

    // This is for the image 

    const [filePath, setFilePath] = useState(null);
    const [fileData, setFileData] = useState(0);
    const [fileUri, setFileUri] = useState(false);

    // This is the for the message 

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const oppositeUserId = route.params.item.email;
    const [messages, setMessages] = useState(null);

    // Adding the image to the cloud firestore 


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
                    user: {
                        _id: currentUser.uid,
                        email: currentUser.email,
                    }
                }
            )
    }

    // Storing the message to the cloud firestore  
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

    // Fetching all the messages from the cloud firestore 

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

    // This will help the user to select the image for the uploading 

    const launch = () => {
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
                // console.log('response', JSON.stringify(response));
                setFilePath(response),
                    setFileData(response.data),
                    setFileUri(response.uri)

            }
        });

    }

    //   SHOW THE PREVIEW OF THE SELECTED IMAGE 

    renderFileUri = () => {
        if (fileUri) {
            return <Image
                source={{ uri: fileUri }}
                style={styles.images}
            />
        } else {
            <Text>Nothing to show here</Text>
        }
    }

    // CALLING THE FUNCTION TO SELECT THE IMAGE FROM THE GALLERY

    const renderComposer = props => {
        return (
            <View style={{ flexDirection: 'row', padding: 5 }}>
                <Composer {...props} />
              <Ionicons name='attach' size = {35} color = "black" onPress={launch} />
            </View>
        );
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={message => handleSend(message)}
            user={{ _id: currentUser.uid }}
            placeholder="Type a message..."
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
            renderComposer={renderComposer}            
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
    }
});
