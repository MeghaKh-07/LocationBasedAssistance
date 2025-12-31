import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const VehicleBreakdownPage = ({ route, navigation }) => {
  const { latitude, longitude, highwayName, currentAddress } = route.params;
  const [initialRegion, setInitialRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedBreakdown, setSelectedBreakdown] = useState('');
  const [nearbyServices, setNearbyServices] = useState([]);

  useEffect(() => {
    if (selectedBreakdown) {
      fetchNearbyServices(selectedBreakdown);
    }
  }, [selectedBreakdown]);

  const fetchNearbyServices = async (type) => {
    const breakdownTypes = {
      'Tire Puncture': 'car_repair',
      'Battery Issue': 'car_repair',
      'Engine Failure': 'car_repair',
      'Fuel Issue': 'gas_station',
    };

    const serviceType = breakdownTypes[type] || 'car_repair';

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${serviceType}&key=YOUR_API_KEY`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        setNearbyServices(data.results);
      } else {
        Alert.alert('Error', 'Failed to fetch nearby services.');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to fetch nearby services.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={initialRegion} showsUserLocation={true}>
        {nearbyServices.map((service, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: service.geometry.location.lat,
              longitude: service.geometry.location.lng,
            }}
            title={service.name}
            description={service.vicinity}
          />
        ))}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>Vehicle Breakdown Assistance</Text>
        <Text style={styles.subHeaderText}>{currentAddress}</Text>
        <Text style={styles.subHeaderText}>Highway: {highwayName}</Text>
        <Picker
          selectedValue={selectedBreakdown}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedBreakdown(itemValue)}
        >
          <Picker.Item label="Select Breakdown Type" value="" />
          <Picker.Item label="Tire Puncture" value="Tire Puncture" />
          <Picker.Item label="Battery Issue" value="Battery Issue" />
          <Picker.Item label="Engine Failure" value="Engine Failure" />
          <Picker.Item label="Fuel Issue" value="Fuel Issue" />
        </Picker>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  infoContainer: {
    padding: 20,
    width: width,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '80%',
  },
});

export default VehicleBreakdownPage;
