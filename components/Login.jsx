import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Google from 'expo-google-app-auth';
import { useDispatch, useSelector } from "react-redux";

import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, } from 'firebase/firestore'

import Logo from './Assets/logo.png'

export default function Login({ navigation }) {
    const dispatch = useDispatch();
    const logInData = useSelector((state) => state.loginReducer);

    const usersCollectionRef = collection(db, "users");

    const [newUser, setNewUser] = useState([])

    const validateUser = async (result) => {
        const q = query(collection(db, "users"), where("userId", "==", result.user.id))
        const getquery = await getDocs(q);
        const k = getquery.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        if (getquery.size === 0) {
            await addDoc(usersCollectionRef, {
                email: result.user.email,
                fullname: result.user.name,
                userId: result.user.id,
                photo: result.user.photoUrl,
                skills: [],
                address: '',
                rating: Number(0),
                contace: '',
                new: true
            })
            validateUser(result)
        } else {
            dispatch({
                type: "loginData",
                data: k,
            });
            navigation.navigate('Main')
        }
        // console.log(getquery.size);
        // console.log(result.user.email);

    }

    async function signInWithGoogleAsync() {
        try {
            const result = await Google.logInAsync({
                // behavior: 'web',
                androidClientId: '60883324779-mah4gsru374aj8h7ug8ul7o4iqnqndpe.apps.googleusercontent.com',
                androidStandaloneAppClientId: '797497243651-9lhv45v1cc8j79k09q4dp6g39i7g9uj8.apps.googleusercontent.com',
                // iosClientId: '60883324779-mah4gsru374aj8h7ug8ul7o4iqnqndpe.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                validateUser(result)
                // console.log(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./Assets/logo.png')} style={{ width: 200, height: 200 }} />
            <Button title="Sign in with Google" onPress={signInWithGoogleAsync} />
        </View>
    )
}
