import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Dimensions, Alert ,Image} from 'react-native';
import MapView, { Marker ,Polyline} from 'react-native-maps';
import fetchNearbyPoliceStations from '../nearbyservices/policeStation';
import {fetchNearbyTollPlazas} from '../nearbyservices/TollPlazas';
import { setupDatabase } from '../database/highwaydb';
import { insertHighwaysData } from '../database/InsertData';
import { showDatabaseData } from '../database/fetchingdb';
import { Fontisto , MaterialCommunityIcons ,Feather} from '@expo/vector-icons';
import { fetchNearbyHospitals } from '../nearbyservices/Hospitals';
import * as Location from 'expo-location';
import { database } from '../firebase';
import { ref,onValue , set} from 'firebase/database';


const GetHelp = ({ route }) => {
  const { latitude, longitude , HighwayName , currentAddress} = route.params;
  const [userLocation, setUserLocation] = useState({ latitude, longitude });
  const [policeStations, setPoliceStations] = useState('');
  const [tollPlazas, setTollPlazas] = useState(null);
  const [nearbyHospital , setNearbyHospital] = useState('');
  const [nearbyDrivers, setNearbyDrivers] = useState('');
  const [driverPathCoords, setDriverPathCoords] = useState([]);
  const [driverLocation , setDriverLocation] = useState('');
  const [initialRegion, setInitialRegion] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [polylineCoords, setPolylineCoords] = useState([]);

  useEffect(() => {
      setupDatabase(); // Create database table if not exists
      //insertHighwaysData();
      //showDatabaseData();
      fetchNearbyPoliceStations(latitude, longitude) // Use the imported function
      .then((stations) => setPoliceStations(stations))
      .catch((error) => {
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
      });
      fetchNearbyHospitals(latitude, longitude)
      .then(hospitals => setNearbyHospital(hospitals))
      .catch(error => {
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
    });
      fetchNearbyTollPlazas(latitude, longitude, HighwayName)
      .then((plazas) => { setTollPlazas(plazas);
          Alert.alert('We have Fetch all the details', 'See the nearest Emergency Services Below.', [{ text: 'OK' }]);
          })
      .catch((error) => {
      Alert.alert('Error', error.message, [{ text: 'OK' }]);
      });  

 }, []);

 useEffect(() => {
  const driverLocationRef = ref(database,'DriverLocation/');

  onValue(driverLocationRef, (snapshot) => {
    const driverData = snapshot.val();
    if (driverData) {
      // Convert the object of objects into an array of objects
      const driversArray = Object.keys(driverData).map(driverId => ({
        id: driverId,
        ...driverData[driverId],
      }));

      // Calculate distance for each driver and sort them based on distance
      const driversWithDistances = driversArray.map(driver => ({
        ...driver,
        distance: calculateDistance(userLocation.latitude, userLocation.longitude, driver.location.latitude, driver.location.longitude),
      }));
      //console.log("drivers",driversWithDistances);
      // Sort drivers based on distance
      const sorteddriver = driversWithDistances.sort((a, b) => a.distance - b.distance);
      //console.log("sorted drivers",sorteddriver);
      // Select top 5 drivers
      const top5Drivers = sorteddriver.slice(0, 5);
      //console.log("top drivers",top5Drivers);
      const nearestone = top5Drivers[0];
      setDriverLocation(nearestone);
      setNearbyDrivers(top5Drivers);
    }
  });
  
}, []);
//console.log("nearby driver " ,nearbydrivers);
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

    //console.log(policeStations.result.name);

    
//console.log("tollplaza data " , tollPlazas.routePatrolNumber);

useEffect(() => {
  // Continuously update user's location
    Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
    setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  });
}, []);
  //console.log(userLocation);
useEffect(() => {
  if (driverLocation) {
    // Fetch directions from Googleq Directions API
    fetchDirections(userLocation, driverLocation.location)
      .then(coords => {
        //console.log(co;ords);
        setPolylineCoords(coords);
        setDriverPathCoords(coords);
      })
      .catch(error => {
        console.error('Error fetching directions:', error);
      });
  }
}, [userLocation, driverLocation]);

useEffect(() => {
  updateMapRegion();
}, [polylineCoords]);



const updateMapRegion = () => {
  if (polylineCoords.length > 0) {
    const coordinates = polylineCoords.map(coord => ({
      latitude: coord.latitude,
      longitude: coord.longitude
    }));
    let maxLat = Math.max.apply(Math, coordinates.map(coord => coord.latitude));
    let minLat = Math.min.apply(Math, coordinates.map(coord => coord.latitude));
    let maxLng = Math.max.apply(Math, coordinates.map(coord => coord.longitude));
    let minLng = Math.min.apply(Math, coordinates.map(coord => coord.longitude));

    const padding = 0.001; // Adjust the padding as needed
    setInitialRegion({
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: (maxLat - minLat) + padding,
      longitudeDelta: (maxLng - minLng) + padding
    });
  }
};

useEffect(() => {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const updateAmbulancePosition = () => {
    if (nearbyDrivers && nearbyDrivers.length > 0 && polylineCoords && polylineCoords.length > 0) {
      const ambulancePosition = polylineCoords.find(coord => coord.latitude === driverLocation.location.latitude && coord.longitude === driverLocation.location.longitude);
      if (ambulancePosition) {
        const currentIndex = polylineCoords.indexOf(ambulancePosition);
        if (currentIndex !== -1 && currentIndex < polylineCoords.length - 1) {
          const distanceToNextPosition = calculateDistance(ambulancePosition.latitude, ambulancePosition.longitude, polylineCoords[currentIndex + 1].latitude, polylineCoords[currentIndex + 1].longitude);
          if (distanceToNextPosition < 0.1) {
            const nextPosition = polylineCoords[currentIndex + 1];
            setDriverLocation(nextPosition);
          }
        }
      }
    }
  };

  updateAmbulancePosition();

}, [nearbyDrivers, polylineCoords]);


const fetchDirections = async (origin, destination) => {
  // Call Google Directions API to get directions
  const apiKey = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU';
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      const points = data.routes[0].overview_polyline.points;
      return decodePolyline(points);
    } else {
      throw new Error('No routes found');
    }
  } catch (error) {
    throw new Error('Error fetching directions');
  }
};

const decodePolyline = (encoded) => {
  // Decode Google Maps polyline
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

const handleCall = (phoneNumber, sname) => {
  //console.log(driverID);
  if (phoneNumber) {
    const mapURI = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const message = `hy ,Check out my location: ${currentAddress}\n\n I am On Highway : ${HighwayName}\n\nOpen in Maps: ${mapURI}`;

    const driverLocationRef = ref(database, `DriverLocation/${driverLocation.id}/emergency`);
    set(driverLocationRef, {
      location: {
        latitude: latitude,
        longitude: longitude
      },
      message: message,
      timestamp: new Date().toISOString()
    }).then(() => {
      Alert.alert(sname, 'Your Call has been initiated to nearest ' + sname, [
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
      ],{ cancelable: true });
    }).catch((error) => {
      Alert.alert('Error', 'Failed to store data in the database', [{ text: 'OK' }]);
      console.error('Error storing data in the database:', error);
    });
  } else {
    Alert.alert('Error', 'Phone number not available', [{ text: 'OK' }]);
  }
};
//console.log(nearbyHospital);
return (
    <View style={styles.container}>
      <MapView style={styles.map} region={initialRegion} showsUserLocation={true} followsUserLocation={true} showsMyLocationButton={true}>    
      {nearbyDrivers && nearbyDrivers.map(driver => (
          <Marker
          key={driver.id}
          coordinate={{
            latitude: driver.location.latitude,
            longitude: driver.location.longitude,
          }}
          title={`Driver ${driver.name}`}
          description={`Distance: ${driver.distance.toFixed(2)} km`}
        >
          <Image
            source={require('../assets/ambulance.png')}
            style={{ width: 30, height: 30 }} // Adjust the size as needed
          />
        </Marker>
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
        {policeStations && policeStations.result.geometry.location.lat && policeStations.result.geometry.location.lng && (
          <Marker
             coordinate={{
               latitude: policeStations.result.geometry.location.lat,
               longitude: policeStations.result.geometry.location.lng,
            }}
            title={policeStations.result.formatted_address}
            image={require('../assets/policeicon.png')} // You can use a custom icon for toll plaza
            style={{ width: 100, height: 100 }}
          />
        )}
        {nearbyHospital && nearbyHospital.location.lat && nearbyHospital.location.lng && (
          <Marker
             coordinate={{
               latitude: nearbyHospital.location.lat,
               longitude: nearbyHospital.location.lng,
            }}
            title={nearbyHospital.name}
            image={require('../assets/policeicon.png')} // You can use a custom icon for toll plaza
            style={{ width: 50, height: 50 }}
          />
        )}
        {driverPathCoords.length > 0 && (
        <Polyline coordinates={driverPathCoords} strokeWidth={7} strokeColor="blue"  lineJoin='round'/>
      )}
      </MapView>
      <View style={styles.infoBox}>
      <>
      <Text>Your Nearby Toll Plaza: {tollPlazas && tollPlazas.TollPlazaName}</Text>
      <Text>Your Nearby Hospital: {nearbyHospital && nearbyHospital.name}</Text>
      <Text>Your Nearby Police Station: {policeStations && policeStations.result.name}</Text>
      <Text>Hospital Open : {nearbyHospital && nearbyHospital.opening_hours}</Text>
      </>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(driverLocation.mobileNumber , sname = "Ambulance")}>
        <Fontisto name="ambulance" size={35} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(tollPlazas.routePatrolNumber , sname = "RoutePatrol")}>
        <MaterialCommunityIcons name="car-emergency" size={40} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(tollPlazas.emergencyNumber , sname = "Highway Emergency")}>
        <Feather name="phone-call" size={40} color="green" />
        </TouchableOpacity>
        
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    
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
