import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, TextInput, SafeAreaProvider, Touchable, Alert } from 'react-native'
import { useDispatch, useSelector } from "react-redux";

import { db } from '../../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, query, where } from 'firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';

export default function Profile(navigation) {
    const dispatch = useDispatch();

    const logInData = useSelector((state) => state.loginReducer);

    const updateProfile = async () => {

    }

    const handleUpdateLogin = async () => {
        const q = query(collection(db, "users"), where("userId", "==", logInData.user[0].userId))
        const getquery = await getDocs(q);
        const k = getquery.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        console.log(k)
        dispatch({
            type: "loginData",
            data: k,
        });
    }

    const [newSkill, setNewSkill] = useState("")
    const [openUpdateSkills, setUpdateSkill] = useState(false)
    const addSkill = async () => {
        if (newSkill === "") {
            Alert.alert(
                "Error",
                "Empty Input. Please input Skill"
            );
        } else {
            const userDoc = doc(db, "users", logInData.user[0].id);
            await updateDoc(userDoc, {
                skills: arrayUnion(newSkill)
            });

            handleUpdateLogin()
            setUpdateSkill(!openUpdateSkills)
        }

    }

    const removeSkill = async (skill) => {
        const userDoc = doc(db, "users", logInData.user[0].id);
        await updateDoc(userDoc, {
            skills: arrayRemove(skill)
        });

        handleUpdateLogin()
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={openUpdateSkills}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setUpdateSkill(!openUpdateSkills);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <TextInput
                                // style={styles.input}
                                onChangeText={(text) => setNewSkill(text)}
                                value={newSkill}
                                style={{ textAlign: 'center', fontSize: 20 }}
                                placeholder="Input Skill Here, (eg. Mason, Carpenter, Pipe Fitter)"
                                keyboardType="default"
                            />
                        </View>
                        {/* <Text style={styles.modalText}>Hello World!</Text> */}
                        <View style={{ flexDirection: 'row', marginTop: 50 }}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#16a085',
                                    padding: 5,
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    marginTop: 10
                                }}
                                onPress={addSkill}
                            >
                                <Text style={{ color: 'white', fontSize: 20 }}>Add Skill</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#e67e22',
                                    padding: 5,
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    marginTop: 10,
                                    marginLeft: 5
                                }}
                                onPress={() => setUpdateSkill(!openUpdateSkills)}
                            >
                                <Text style={{ color: 'white', fontSize: 20 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>



            <View style={styles.list}>

                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                        source={{
                            uri: logInData.user[0].photo
                        }}
                        style={{ width: 100, height: 100, borderRadius: 400 / 2 }}
                    />
                    <Text style={{ fontSize: 35, marginTop: 30 }}>{logInData.user[0].fullname}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        {logInData.user[0].skills.map((row, key) =>
                            <View style={{ backgroundColor: '#2980b9', marginRight: 5, padding: 4, borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, color: 'white' }}>
                                    {row}
                                </Text>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { removeSkill(row) }}>
                                    <Icon type="ionicons" name="close-circle-sharp" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}


                        <TouchableOpacity style={{
                            // backgroundColor: '#16a085',
                            padding: 5,
                            borderRadius: 4,
                            justifyContent: 'center',
                        }} onPress={() => setUpdateSkill(true)}>
                            <Icon type="Entypo" name="add-circle-sharp" size={30} color="#16a085" />

                        </TouchableOpacity>

                    </View>

                </View>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={
                        {
                            padding: 10,
                            borderRadius: 10,
                            justifyContent: 'center',
                        }
                    }>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({

    modalView: {
        margin: 0,
        // marginTop:100,
        justifyContent: 'center',
        // position:'relative',
        height: 250,
        backgroundColor: "white",
        // borderRadius: 20,
        // padding: 35,
        alignItems: "center",
        elevation: 5
    },

    input: {
        height: 40,
        width: '90%',
        borderWidth: 1,
        borderColor: '#7f8c8d',
        paddingLeft: 25,
        borderRadius: 25,
        color: '#7f8c8d',
        backgroundColor: '#fff'
    },
    list: {
        height: 300,
        width: "100%",
        padding: 15,
        backgroundColor: 'white',
        color: '#fff',
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        // justifyContent: 'flex-start',
        flexDirection: 'column'
    }
});
