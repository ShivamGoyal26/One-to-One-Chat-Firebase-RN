import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { AuthContext } from '../Navigation/AuthProvider';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore'

export default function SignupScreen({ navigation }) {

  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  function AddUser() {
    // if (roomName.length > 0) {
      firestore()
        .collection('Users')
        .add({
          name: name,
          createdAt: new Date().getTime(),
          email: email,
        })
        // .then(docRef => {
        //   docRef.collection('MESSAGES').add({
        //     text: `You have joined the room ${roomName}.`,
        //     createdAt: new Date().getTime(),
        //     system: true
        //   });
        //   navigation.navigate('Home');
        // });
    // }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Register to chat</Title>
      <FormInput
        labelName='Name'
        value={name}
        autoCapitalize='none'
        onChangeText={nameData => setName(nameData)}
      />

      <FormInput
        labelName='Email'
        value={email}
        autoCapitalize='none'
        onChangeText={userEmail => setEmail(userEmail)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={userPassword => setPassword(userPassword)}
      />
      <FormButton
        title='Signup'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => {
            register(email, password);
            AddUser();

        } }
      />
      <FormButton
          title='Already Registered? Login here'
          modeValue='text'
          uppercase={false}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.goBack()}
        />
      {/* <IconButton
        icon='home'
        size={30}
        style={styles.navButton}
        color='#6646ee'
        onPress={() => navigation.goBack()}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
    color: 'black'
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  }
});