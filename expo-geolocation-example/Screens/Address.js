import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Button, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { initDatabase, saveAccidentData } from '../database/db';


const Address = ({ navigation }) => {
  const [highwayNumber, setHighwayNumber] = useState('');
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('');
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    initDatabase();
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Please allow the app to access your location.',
        [{ text: 'OK' }]
      );
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    if (coords) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU`
        );
        const data = await response.json();

        if (data.status === 'OK') {
          const address = data.results[0].formatted_address;
          setDisplayCurrentAddress(address);

          // Fetch nearby roads
          fetchNearbyRoads(coords.latitude, coords.longitude);
        } else {
          console.error('Error fetching address:', data.status);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }

      setInitialRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const fetchNearbyRoads = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=route&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU&libraries=places`
      );
      const data = await response.json();
      //console.log(data);

      if (data.results.length > 0) {
        // Get the highway number from the first nearby road
        const highwayNumber = data.results[0].name;
        Alert.alert('Highway Number', 'Want to Update', [
          {
            text: 'No',
            onPress: () => setHighwayNumber(highwayNumber),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        
        
      } else {
        // If no nearby roads found, prompt the user to enter a highway number
        Alert.alert(
          'Highway Number',
          'Please enter the highway number:',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error fetching nearby roads:', error);
    }
  };
  //console.log(highwayNumber);
  const openAddressOnMap = () => {
    const addressURI = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayCurrentAddress)}`;
    Linking.openURL(addressURI);
  };

  const handleGetHelp = async () => {
    if (!highwayNumber) {
      // If no highway number is entered, prompt the user to enter it
      Alert.alert(
        'Highway Number',
        'Please enter the highway number:',
        [
          {
            text: 'OK',
            onPress: () => console.log("ok Pressed"),
          }
        ],
        { cancelable: false }
      );
      return;
    }
    try {
      // Save accident data to SQLite database
      saveAccidentData(displayCurrentAddress, highwayNumber, initialRegion.latitude, initialRegion.longitude);
      // Navigate to new screen and pass highway number as parameter
      navigation.navigate('HelpPage', { latitude: initialRegion.latitude, longitude: initialRegion.longitude , HighwayName : highwayNumber , currentAddress : displayCurrentAddress});
    } catch (err) {
      console.error('Error saving accident data:', err);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation={true}  >
        {initialRegion && (
          <Marker
            coordinate={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude
            }}
            title={displayCurrentAddress}
          />
        )}
      </MapView>

      <View style={styles.headerContainer}>
        <Image source={require('../assets/geo.png')} style={styles.image} />
        <Text style={styles.headerText}>{displayCurrentAddress}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Highway Number"
          placeholderTextColor="#ccc"
          value={highwayNumber}
          onChangeText={setHighwayNumber}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleGetHelp}>
            <Text style={styles.buttonText}>Get Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openAddressOnMap}>
            <Text style={styles.buttonText}>Open Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width,
    height: '90%',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    width: width,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#FD0139',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Address;
