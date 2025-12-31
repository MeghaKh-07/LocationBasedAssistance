import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,TextInput, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const API_KEY = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU';

const FuelShortageService = ({ route }) => {
  const { latitude, longitude } = route.params;
  const [fuelType, setFuelType] = useState('');
  const [fuelQuantity, setFuelQuantity] = useState('');
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [region, setRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    // Fetch nearby stations when component mounts
    fetchNearbyStations();
  }, []);

  const fetchNearbyStations = async () => {
    try {
      // Replace this with actual API call to fetch nearby stations
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=police&keyword=police&name=police&key=${API_KEY}`);
      const data = await response.json();
      
      setStations(data.results);
      //console.log(data.stations);
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
    }
  };

  const handleSelectStation = (station) => {
    setSelectedStation(station);
  };

  const handleRequestService = () => {
    // Perform validation checks before making a request
    if (!fuelType || (!fuelQuantity && fuelType !== 'Electric')) {
      Alert.alert('Incomplete Information', 'Please select fuel type and enter fuel quantity.');
      return;
    }

    // Logic to handle service request based on selected fuel type
    if (fuelType === 'Electric') {
      // Handle electric car charging service
      // Implement order request logic here
      Alert.alert(
        'Electric Car Charging Service',
        `A request for charging ${fuelQuantity} kWh has been sent. Please wait for assistance.`,
        [{ text: 'OK' }]
      );
    } else {
      // Handle petrol or diesel fuel order service
      // Implement order request logic here
      Alert.alert(
        'Fuel Order Service',
        `A request for ${fuelQuantity} liters of ${fuelType} has been sent. Please wait for assistance.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {stations.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng
            }}
            onPress={() => handleSelectStation(marker)}
          />
        ))}
      </MapView>

      <View style={styles.formContainer}>
        <Picker
          selectedValue={fuelType}
          style={styles.picker}
          onValueChange={(itemValue) => setFuelType(itemValue)}
        >
          <Picker.Item label="Select Fuel Type" value="" />
          <Picker.Item label="Petrol" value="Petrol" />
          <Picker.Item label="Diesel" value="Diesel" />
          <Picker.Item label="Electric" value="Electric" />
        </Picker>
        {fuelType !== 'Electric' && (
          <TextInput
            style={styles.input}
            placeholder="Enter Fuel Quantity (Liters)"
            keyboardType="numeric"
            value={fuelQuantity}
            onChangeText={setFuelQuantity}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleRequestService}>
          <Text style={styles.buttonText}>Request Service</Text>
        </TouchableOpacity>
      </View>

      {selectedStation && (
        <View style={styles.selectedStationContainer}>
          <Text style={styles.selectedStationText}>{selectedStation.name}</Text>
          {/* Display additional station details here */}
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    formContainer: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#33A2FF',
      padding: 20,
      borderRadius: 20,
      elevation: 5,
      
    },
    picker: {
      width: '80%',
      height: 50,
      marginBottom: 20,
      backgroundColor: '#f8f8f8',
      borderRadius: 10,
      elevation: 2,
    },
    input: {
      width: '80%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: '#f8f8f8',
      elevation: 2,
    },
    button: {
      backgroundColor: '#FD0139',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      elevation: 3,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    selectedStationContainer: {
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 40,
      elevation: 3,
    },
    selectedStationText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default FuelShortageService;
