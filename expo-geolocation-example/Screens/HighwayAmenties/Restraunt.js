import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Dimensions ,TextInput,Text , TouchableOpacity} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const API_KEY = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU';

const HighwayAmenities = ({ route }) => {
  const { latitude, longitude } = route.params;
  const [selectedAmenity, setSelectedAmenity] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');
  const [amenityMarkers, setAmenityMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (selectedAmenity && selectedAmenity !== 'Others') {
      fetchNearbyAmenities(selectedAmenity);
    }
  }, [selectedAmenity]);

  useEffect(() => {
    if (customAmenity) {
    }
  }, [customAmenity]);

  const fetchNearbyAmenities = async (amenityType) => {
    const types = {
      'Restaurant': 'restaurant',
      'Police station': 'police',
      'Petrol pump': 'gas_station',
      'Medical shop': 'pharmacy',
    };

    const type = types[amenityType] || amenityType;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${type}&keyword=${type}&name=${type}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        setAmenityMarkers(data.results);
      } else {
        Alert.alert('Error', 'Failed to fetch amenities.');
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      Alert.alert('Error', 'Failed to fetch amenities.');
    }
  };
  const handleSearch = () => {
    if (customAmenity) {
      fetchNearbyAmenities(customAmenity);
    } else {
      Alert.alert('Error', 'Please enter an amenity type.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {amenityMarkers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.geometry.location.lat,
              longitude: marker.geometry.location.lng
            }}
            title={marker.name}
            description={marker.vicinity}
          />
        ))}
      </MapView>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAmenity}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedAmenity(itemValue); 
            setCustomAmenity('');
        }}
        >
          <Picker.Item label="Select an Amenity" value="" />
          <Picker.Item label="Restaurant" value="Restaurant" />
          <Picker.Item label="Police station" value="Police station" />
          <Picker.Item label="Petrol pump" value="Petrol pump" />
          <Picker.Item label="Medical shop" value="Medical shop" />
          <Picker.Item label="Others" value="Others" />
        </Picker>   
      </View>
      {selectedAmenity === 'Others' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter amenity type"
            value={customAmenity}
            onChangeText={setCustomAmenity}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome5 name="search-location" size={12} color="black" />
          </TouchableOpacity>
        </View>
      )}
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
    height: height * 0.8,
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 20,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 100,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 10,
  },
});

export default HighwayAmenities;
