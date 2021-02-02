import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const App = props => {
  return(
    <View>
      <Text>
        This is the main Screen
      </Text>
    </View>
  )
}

styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
    }
});

export default App;