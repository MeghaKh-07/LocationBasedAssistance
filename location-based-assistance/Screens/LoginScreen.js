import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import {signInWithEmailAndPassword} from 'firebase/auth'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View,ScrollView } from 'react-native';
import { auth, database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                //console.log("user" , user);
                // Check if document exists for the logged-in user
                const userRef = ref(database, `UserData/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        // Document exists, navigate to home screen
                        navigation.replace('Address');
                    } else {
                        // Document does not exist, handle it accordingly
                        // You may choose to redirect to the registration screen or handle it differently
                        console.log("User document does not exist in the database.");
                    }
                });
            }
        });

        return unsubscribe;
    }, []);

    
    const handleRegister = () => {
        navigation.navigate('SignUpScreen');
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth , email, password)
            .then(userCreds => {
                const user = userCreds.user;
                navigation.replace('Address');
                console.log('LoggedIn with: ', user?.email);
                
            })
            .catch(error => alert(error.message));
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='height'>
            
            <View style={styles.inputContainer}>
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
            </View>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>New User ? Register</Text>
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

export default LoginScreen;
