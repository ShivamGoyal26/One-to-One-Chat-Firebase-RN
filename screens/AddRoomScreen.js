
import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';


export default function AddRoomScreen({ navigation }) {

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Users')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });
        setUsers(data);

        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: 'black' }} />}
        renderItem={(item) => {
          return (
            <TouchableOpacity onPress={() => { navigation.navigate('RoomChat', { item: item.item }) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Image
                  source={{
                    uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png'
                  }}
                  style={{ width: 40, height: 40, borderRadius: 400 / 2 }}
                />
                <View style={{ padding: 10, width: '100%', }}>
                  <Text style={{ color: 'black', fontSize: 20 }}>{item.item.name}</Text>
                  <Text style={{ fontSize: 12, color: 'grey' }}>{item.item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>

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