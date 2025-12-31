import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const Fire = ({route }) => {
  const { latitude, longitude } = route.params;
  const [initialRegion, setInitialRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [nearestFireStation, setNearestFireStation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchNearestFireStation();
  }, []);

  const fetchNearestFireStation = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=15000&type=fire_station&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const fireStation = data.results[0];
        setNearestFireStation({
          latitude: fireStation.geometry.location.lat,
          longitude: fireStation.geometry.location.lng,
          name: fireStation.name,
        });
      } else {
        Alert.alert('No nearby fire stations found.');
      }
    } catch (error) {
      console.error('Error fetching fire station:', error);
    }
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handlePickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.uri);
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={initialRegion} showsUserLocation={true}>
        {initialRegion && (
          <Marker
            coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
            title="Your Location"
          />
        )}
        {nearestFireStation && (
          <Marker
            coordinate={{ latitude: nearestFireStation.latitude, longitude: nearestFireStation.longitude }}
            title={nearestFireStation.name}
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleCall('101')}>
          <Ionicons name="flame" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleCall('102')}>
          <Ionicons name="medical" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleCall('100')}>
          <Ionicons name="shield" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Ionicons name="camera" size={32} color="#fff" />
        </TouchableOpacity>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
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
    height: '60%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  iconButton: {
    backgroundColor: '#FD0139',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePicker: {
    backgroundColor: '#FD0139',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default Fire;
