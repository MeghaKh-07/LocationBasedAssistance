import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Network from 'expo-network';
import * as SMS from 'expo-sms';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
import { Ionicons } from '@expo/vector-icons';

const LostOrStrandedHelp = ({route }) => {
  const { latitude, longitude, HighwayName, currentAddress } = route.params;
  const [isOffline, setIsOffline] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [image, setImage] = useState(null);
  const [listening, setListening] = useState(false);
  

  console.log(HighwayName);
  useEffect(() => {
    checkNetworkStatus();
    initializeVoice();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkStatus = await Network.getNetworkStateAsync();
      setIsOffline(!networkStatus.isConnected);
    } catch (error) {
      console.error('Network status check failed', error);
    }
  };

  const initializeVoice = async () => {
    try {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;
    } catch (error) {
      console.error('Voice initialization error', error);
    }
  };

  const handleAddContact = () => {
    if (newContact) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact('');
    } else {
      Alert.alert('Error', 'Please enter a valid contact.');
    }
  };

  const handleSendSOS = async () => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device.');
        return;
      }
      if (emergencyContacts.length === 0) {
        Alert.alert('Error', 'Please add at least one emergency contact.');
        return;
      }
      const message = `SOS: I am lost at ${currentAddress}. Please help!`;
      await SMS.sendSMSAsync(emergencyContacts, message);
      Alert.alert('SOS Sent', 'Your emergency contacts have been notified.');
    } catch (error) {
      console.error('Error sending SOS', error);
    }
  };

  const pickImageAndSend = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        //console.log(result.assets[0].uri)
        setImage(result.assets[0].uri);
        handleSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };

  const handleSendImage = async (uri) => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device.');
        return;
      }
      if (emergencyContacts.length === 0) {
        Alert.alert('Error', 'Please add at least one emergency contact.');
        return;
      }
      await SMS.sendSMSAsync(emergencyContacts, `Image of my surroundings: ${uri}`);
      Alert.alert('Image Sent', 'Your emergency contacts have received the image.');
    } catch (error) {
      console.error('Error sending image', error);
    }
  };

  const onSpeechStart = () => {
    setListening(true);
    Speech.speak('Listening for your command');
  };

  const onSpeechEnd = () => {
    setListening(false);
  };

  const onSpeechResults = (event) => {
    const command = event.value[0].toLowerCase();
    handleVoiceCommand(command);
  };

  const onSpeechError = (event) => {
    console.error('Speech recognition error', event.error);
    setListening(false);
    Alert.alert('Error', 'Speech recognition error. Please try again.');
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('send sos')) {
      handleSendSOS();
    } else if (command.includes('take picture')) {
      pickImageAndSend();
    } else if (command.includes('send image')) {
      handleSendImage(image);
    } else if (command.includes('download map')) {
      handleDownloadMap();
    } else {
      Speech.speak('Sorry, I did not understand that command.');
    }
  };

  const handleVoiceAssist = async () => {
    try {
      if (listening) {
        await Voice.stop();
      } else {
        await Voice.start('en-US');
      }
    } catch (error) {
      console.error('Voice assist error', error);
      Alert.alert('Error', 'Voice assist error. Please try again.');
    }
  };

  const handleDownloadMap = () => {
    // Implement functionality to download offline maps
    Alert.alert('Download Map', 'Offline map has been downloaded.');
  };

  return (
    <ScrollView style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        <Marker coordinate={{ latitude, longitude }} title={currentAddress} />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current Location: {currentAddress}</Text>
        <Text style={styles.infoText}>Highway: {HighwayName}</Text>
      </View>

      <View style={styles.contactsContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add Emergency Contact"
          placeholderTextColor="#ccc"
          value={newContact}
          onChangeText={setNewContact}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.buttonText}>Add Contact</Text>
        </TouchableOpacity>
        {emergencyContacts.length > 0 && (
          <View style={styles.contactsList}>
            {emergencyContacts.map((contact, index) => (
              <Text key={index} style={styles.contactText}>{contact}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSendSOS}>
          <Text style={styles.buttonText}>Send SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={pickImageAndSend}>
          <Ionicons name="camera" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVoiceAssist}>
          <Text style={styles.buttonText}>{listening ? 'Stop Listening' : 'Voice Assist'}</Text>
        </TouchableOpacity>
        {isOffline && (
          <TouchableOpacity style={styles.button} onPress={handleDownloadMap}>
            <Text style={styles.buttonText}>Download Offline Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: 300,
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactsContainer: {
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#FD0139',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  contactsList: {
    marginTop: 10,
  },
  contactText: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#FD0139',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    width: '48%',
  },
  iconButton: {
    backgroundColor: '#FD0139',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    width: '48%',
  },
});

export default LostOrStrandedHelp;
