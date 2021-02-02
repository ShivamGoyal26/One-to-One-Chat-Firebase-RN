import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
// import {AuthContext} from '../Navigation/AuthProvider';


export default function HomeScreen({ navigation }) {

  // const { user } = useContext(AuthContext);

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  // const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Users')
      // .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs
        console.log(data)
        setUsers(data);

        if (loading) {
          setLoading(false);
        }
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._data.email}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: 'black' }} />}
        renderItem={(item) => {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
              <Image
                source={{
                  uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png'
                }}
                style={{ width: 40, height: 40, borderRadius: 400 / 2 }}
              />
              <View style={{ padding: 10, width: '100%', }}>
                <Text style={{ color: 'black', fontSize: 20 }}>{item.item._data.name}</Text>
                <Text style={{ fontSize: 12, color: 'grey' }}>{item.item._data.email}</Text>
              </View>
            </View>


          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    color: 'black'
  },
  listDescription: {
    fontSize: 16,
    color: 'black'
  },
});