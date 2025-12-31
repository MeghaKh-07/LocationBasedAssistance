import React, { useState ,useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, database } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { ref, set } from 'firebase/database';


const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const navigation = useNavigation();

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth ,email, password)
            .then(userCreds => {
                //console.log(userCreds);
                const user = userCreds.user;
                set(ref(database , `UserData/${user.uid}`),{
                    name : name,
                    email: email,
                    mobileNumber: mobileNumber,
                });
                console.log('Registered with: ', user?.email);
                navigation.replace('Address');
            })
            .catch(error => alert(error.message));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.inputContainer}>
            <TextInput
                    placeholder='Name'
                    style={styles.input}
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    placeholder='Email'
                    style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    placeholder='Password'
                    style={styles.input}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
                <TextInput
                    placeholder='Mobile Number'
                    style={styles.input}
                    value={mobileNumber}
                    onChangeText={text => setMobileNumber(text)}
                />
            </View>
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default SignupScreen;
