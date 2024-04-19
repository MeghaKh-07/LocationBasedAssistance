import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import fetchNearbyPoliceStations from '../nearbyservices/policeStation';
import {fetchNearbyTollPlazas} from '../nearbyservices/TollPlazas';
import { setupDatabase } from '../database/highwaydb';
import { insertHighwaysData } from '../database/InsertData';
import { showDatabaseData } from '../database/fetchingdb';
import { Fontisto , MaterialCommunityIcons ,Feather} from '@expo/vector-icons';



const GetHelp = ({ route }) => {
  const { latitude, longitude , HighwayName , currentAddress} = route.params;
  const [policeStations, setPoliceStations] = useState([]);
  const [tollPlazas, setTollPlazas] = useState('');
  const [initialRegion, setInitialRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
      setupDatabase(); // Create database table if not exists
      //insertHighwaysData();
      //showDatabaseData();
      

      fetchNearbyPoliceStations(latitude, longitude) // Use the imported function
      .then((stations) => setPoliceStations(stations))
      .catch((error) => {
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
      });
 }, []);

  useEffect(() => {
    fetchNearbyTollPlazas(latitude, longitude, HighwayName)
    .then((plazas) => setTollPlazas(plazas))
    .catch((error) => {
      Alert.alert('Error', error.message, [{ text: 'OK' }]);
    });  
 }, []);
//console.log("tollplaza data " , tollPlazas.routePatrolNumber);

const handleCall = (phoneNumber, sname) => {
  if (phoneNumber) {
    const mapURI = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = `Check out my location: ${currentAddress}\n\n I am On Highway : ${HighwayName}\n\nOpen in Maps: ${mapURI}`;
    
    Alert.alert(sname, 'Your Call has been Initiated to nearest ' + sname, [
      { 
        text: 'OK', 
        onPress: () => {
          Linking.openURL(`tel:${phoneNumber}`);
        }
      },
      {
        text: 'Share Location',
        onPress: () => {
          Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`);
        }
      }
    ]);
  } else {
    Alert.alert('Error', 'Phone number not available', [{ text: 'OK' }]);
  }
};

return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation={true}>
        {policeStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: station.location.lat,
              longitude: station.location.lng,
            }}
            title={station.name}
            image={require('../assets/policeicon.png')}
            style={{ width: 30, height: 30 }}
          />
        ))}
        {tollPlazas && tollPlazas.latitude && tollPlazas.longitude && (
          <Marker
             coordinate={{
               latitude: tollPlazas.latitude,
               longitude: tollPlazas.longitude,
            }}
            title="Toll Plaza"
            image={require('../assets/policeicon.png')} // You can use a custom icon for toll plaza
            style={{ width: 30, height: 30 }}
          />
        )}
      </MapView>

      <View style={styles.infoBox}>
        <Text>Your Nearby Toll Plaza: {tollPlazas && tollPlazas.highwayNumber}</Text>
        <Text>Your Nearby Hospital: {tollPlazas && tollPlazas.nearestHospital}</Text>
        <Text>Your Nearby Police Station: {tollPlazas && tollPlazas.nearestPoliceStationName}</Text>
        {/* Add similar text for nearby hospital and police station */}
      </View>

      {/* Buttons for calling */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(tollPlazas.ambulanceNumber , sname = "Ambulance")}>
        <Fontisto name="ambulance" size={35} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(tollPlazas.routePatrolNumber , sname = "RoutePatrol")}>
        <MaterialCommunityIcons name="car-emergency" size={40} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(tollPlazas.emergencyNumber , sname = "Highway Emergency")}>
        <Feather name="phone-call" size={40} color="green" />
        </TouchableOpacity>
        {/* Add buttons for calling hospital and any other emergency service */}
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
    height: '100%',
  },
  infoBox: {
    position: 'absolute',
    bottom: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor : '#B0C4DE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GetHelp;
