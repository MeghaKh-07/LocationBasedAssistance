import React, { useState, useRef} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Linking, ScrollView, Modal} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';

const LockoutHelp = () => {
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carType, setCarType] = useState('');
  const [carInfoSubmitted, setCarInfoSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  //const videoRef = useRef(null);

  const handleSubmitCarInfo = () => {
    if (carMake && carModel && carType) {
      setCarInfoSubmitted(true);
    } else {
      Alert.alert('Error', 'Please provide complete car information.');
    }
  };

  const handleCallLocksmith = () => {
    const locksmithPhoneNumber = 'tel:1234567890';
    Linking.openURL(locksmithPhoneNumber);
  };

  const handleCallRoadsideAssistance = () => {
    const roadsideAssistanceNumber = 'tel:0987654321';
    Linking.openURL(roadsideAssistanceNumber);
  };

  const handleCallPolice = () => {
    Alert.alert(
      'Emergency',
      'Are you sure you want to call the police? This should be used for emergencies only.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL('tel:911') },
      ],
      { cancelable: false }
    );
  };

  const handleManufacturerHelp = () => {
    Alert.alert(
      'Manufacturer Help',
      'Please contact your car manufacturer for remote unlocking services.',
      [{ text: 'OK' }]
    );
  };

  const openManualUnlockGuide = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getYoutubeEmbedUrl = () => {
    const query = `${carMake} ${carModel} ${carType} unlock`;
    const encodedQuery = encodeURIComponent(query);
    console.log(`https://www.youtube.com/results?search_query=${encodedQuery}`)
    return `https://www.youtube.com/results?search_query=${encodedQuery}`;
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!carInfoSubmitted ? (
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Enter Your Car Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Car Make (e.g., Toyota)"
            placeholderTextColor="#ccc"
            value={carMake}
            onChangeText={setCarMake}
          />
          <TextInput
            style={styles.input}
            placeholder="Car Model (e.g., Camry)"
            placeholderTextColor="#ccc"
            value={carModel}
            onChangeText={setCarModel}
          />
          <Picker
            selectedValue={carType}
            style={styles.picker}
            onValueChange={(itemValue) => setCarType(itemValue)}
          >
            <Picker.Item label="Select Car Type" value="" />
            <Picker.Item label="Automatic" value="Automatic" />
            <Picker.Item label="Smart" value="Smart" />
            <Picker.Item label="Regular" value="Regular" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleSubmitCarInfo}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.helpContainer}>
          <Text style={styles.title}>Locked Out of Your Car?</Text>
          <Text style={styles.subtitle}>Choose an option below for assistance:</Text>
          {carType.toLowerCase().includes('smart') || carType.toLowerCase().includes('automatic') ? (
            <>
              <View style={styles.videoContainer}>
              <WebView
                source={{ uri: getYoutubeEmbedUrl() }}
                style={styles.video}
              />
              </View>
              <TouchableOpacity style={styles.button} onPress={openManualUnlockGuide}>
                <Text style={styles.buttonText}>Written Guide to Unlock</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleManufacturerHelp}>
                <Text style={styles.buttonText}>Contact Car Manufacturer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={openManualUnlockGuide}>
                <Text style={styles.buttonText}>Manual Unlocking Guide</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCallLocksmith}>
                <Text style={styles.buttonText}>Call a Locksmith</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonEmergency} onPress={handleCallPolice}>
                <Text style={styles.buttonText}>Emergency: Call Police</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manual Unlocking Guide</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>
                1. **Check for Spare Keys**: Ensure you don't have a spare key hidden somewhere.
              </Text>
              <Text style={styles.modalText}>
                2. **Use a Wire Hanger**: Straighten a wire hanger and create a hook at the end. Slide it between the weather stripping and the window, then try to hook the lock mechanism.
              </Text>
              <Text style={styles.modalText}>
                3. **Use a Slim Jim**: If you have a slim jim tool, insert it between the window and weather stripping and use it to unlock the door.
              </Text>
              <Text style={styles.modalText}>
                4. **Call for Professional Help**: If you can't unlock the car, it's best to call a locksmith or roadside assistance.
              </Text>
              <Text style={styles.modalText}>
                5. **Break a Window (as a Last Resort)**: If it's an emergency and someone is in danger inside the car, break a window to gain access. Choose the window furthest from the person to minimize harm.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  helpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    width: '80%',
    height: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonEmergency: {
    backgroundColor: '#FF4136',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalScroll: {
    maxHeight: 300,
    width: '100%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});

export default LockoutHelp;
