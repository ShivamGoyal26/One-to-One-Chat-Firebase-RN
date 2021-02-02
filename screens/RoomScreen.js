import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AuthContext } from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen({ route }) {

    // function renderSystemMessage(props) {
    //     return (
    //         <SystemMessage
    //             {...props}
    //             wrapperStyle={styles.systemMessageWrapper}
    //             textStyle={styles.systemMessageText}
    //         />
    //     );
    // }

    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const thread = route.params.thread;

    const [messages, setMessages] = useState([]);

    async function handleSend(messages) {
        const text = messages[0].text;

        await firestore()
            .collection('THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    email: currentUser.email
                }
            });

        await firestore()
            .collection('THREADS')
            .doc(thread._id)
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    }
                },
                { merge: true }
            );
    }



    // useEffect(() => {
    //     console.log({ user });
    // }, []);

    useEffect(() => {
        const messagesListener = firestore()
            .collection('THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();

                    const data = {
                        _id: doc.id,
                        // text: '',
                        // createdAt: new Date().getTime(),
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

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <AntDesign name='downcircleo' size={30} color='#6646ee' />
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Ionicons name='send' size={28} color='#6646ee' />
                </View>
            </Send>
        );
    }

    function renderBubble(props) {
        return (
            // Step 3: return the component
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Here is the color change
                        backgroundColor: '#6646ee',
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

  

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            // user={{ _id: 1, name: 'User Test' }}
            user={{ _id: currentUser.uid }}
            renderBubble={renderBubble}
            placeholder="Type a message..."
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
            renderLoading={renderLoading}
            // renderSystemMessage={renderSystemMessage}
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