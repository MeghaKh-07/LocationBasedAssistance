import React from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity } from 'react-native';

const image = { uri: 'https://img.freepik.com/free-vector/ambulance-flat-design_23-2147944321.jpg?w=740&t=st=1714501068~exp=1714501668~hmac=1243d9e3e0bf1f1f0f0aecb7abba18d9e86b1ade72c931c0005f60022bd3191e' };

const Home = ({ navigation }) => {

  const handleOnPress = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.button} onPress={handleOnPress}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode:'cover'
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    resizeMode:'center', // Ensure the entire image fits as background
  },
  overlay: {
    paddingVertical: 20, // Adjust as needed
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue', // Change color as needed
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
