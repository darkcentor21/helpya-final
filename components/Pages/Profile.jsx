import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView, SafeAreaProvider, Touchable, Alert } from 'react-native'
import { useDispatch, useSelector } from "react-redux";

import { db, storage } from '../../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, query, where } from 'firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons';
import { borderWidth, justifyContent, padding, paddingBottom } from 'styled-system';
import Unorderedlist from 'react-native-unordered-list'
import { alignItems } from 'styled-system';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

export default function Profile() {
    const dispatch = useDispatch();

    const logInData = useSelector((state) => state.loginReducer);




    // Create a storage reference from our storage service


    useEffect(() => {
        handleGetReviews()
    }, [])

    const [reviews, setReviews] = useState([])
    const handleGetReviews = async () => {
        const q = query(collection(db, "reviews"), where("reviewTo", "==", logInData.user[0].userId))
        await getDocs(q).then(res => {
            const k = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setReviews(k)
            console.log(k)
        })
    }


    const handleUpdateLogin = async () => {
        const q = query(collection(db, "users"), where("userId", "==", logInData.user[0].userId))
        const getquery = await getDocs(q);
        const k = getquery.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
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
    const [modalOpen, setOpenModal] = useState(false)
    const [newRate, setRate] = useState({
    })
    const addRate = async () => {
        const userDoc = doc(db, "users", logInData.user[0].id);
        await updateDoc(userDoc, {
            rate: newRate
        });

        handleUpdateLogin()
    }
    const [newAge, setAge] = useState([])
    const addAge = async () => {
        const userDoc = doc(db, "users", logInData.user[0].id);
        await updateDoc(userDoc, {
            age: newAge
        });

        handleUpdateLogin()
    }
    const [newInfo, setInfo] = useState([])
    const addInfo = async () => {
        const userDoc = doc(db, "users", logInData.user[0].id);
        await updateDoc(userDoc, {
            info: newInfo
        });

        handleUpdateLogin()
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let file = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            //allowsEditing: true,
            //aspect: [4, 3],
            //quality: 1,

        });

        console.log(file);
        const storage = getStorage();
        const storageRef = ref(storage, `file/${file.uri}.jpg`)


        if (!file.cancelled) {
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log(file);
            });
        }
    };

    // Get a reference to the storage service, which is used to create references in your storage bucket




    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#ffcf93" }}>
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
                                multiline={true}
                                placeholder="Input your Skill Here, (eg. Mason, Carpenter, Pipe Fitter)"
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
                    <Text style={{ fontSize: 24, marginTop: 30 }}>{logInData.user[0].fullname}</Text>
                    <Text>Press the Button to Add Skills</Text>
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
                    <View>

                    </View>
                    <View>
                        <Text style={{ fontSize: 30 }}>{logInData.user[0].rating.toFixed(1)}/<Text style={{ fontSize: 15 }}>5</Text></Text>
                    </View>


                </View>
            </View>
            <View style={styles.infoList}>
                <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
                    <Text style={{ padding: 5 }}>Set Hourly Rate:</Text>
                    <TextInput style={{ borderWidth: 1, width: 50, height: 35, borderRadius: 10, paddingLeft: 8, paddingRight: 8, }}
                        placeholder={logInData.user[0].rate}
                        value={newRate}
                        onChangeText={(text) => {
                            setRate(text)
                        }}

                    />
                    <Text style={{ padding: 5 }} > per hr </Text>
                    <TouchableOpacity style={styles.button} onPress={() => addRate()}>
                        <Text style={{ color: 'white' }}>Set Rate</Text>
                    </TouchableOpacity>


                </View>

                <View style={styles.age}>
                    <Text style={{ padding: 5 }}  >Set Age:</Text>
                    <TextInput style={{ borderWidth: 1, width: 50, height: 35, borderRadius: 10, paddingLeft: 8, }}
                        placeholder={logInData.user[0].age}
                        value={newAge}
                        onChangeText={(text) => {
                            setAge(text)
                        }}

                    />

                    <TouchableOpacity style={styles.button} onPress={() => addAge()}>
                        <Text style={{ color: 'white' }} >Set Age</Text>
                    </TouchableOpacity>


                </View>
                <View>
                    <Text style={{ padding: 5 }}>Info:</Text>
                    <TextInput style={{ borderWidth: 1, width: 50, height: 100, width: '100%', borderRadius: 10, paddingLeft: 8, }}
                        placeholder="Short description about yourself"
                        value={newInfo}
                        multiline={true}

                        onChangeText={(text) => {
                            setInfo(text)
                        }}

                    />
                    <TouchableOpacity style={styles.applyButton} onPress={() => addInfo()

                    }>
                        <Text style={{ color: 'white', justifyContent: 'center' }} >Apply Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text>Upload Valid Id Image</Text>
                    </TouchableOpacity>

                </View>



            </View>
            <View style={styles.list}>

                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <ScrollView style={{ padding: 10, height: '100%', width: '100%' }}>
                        <Text style={{ fontSize: 20 }}>Reviews:</Text>
                        {reviews.map(review =>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 15 }}>{review.review}</Text>
                                <Text style={{ fontSize: 20 }}><Text>{review.rating}/</Text><Text style={{ fontSize: 15 }}>5</Text></Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            <View>

                <Modal style visible={modalOpen}
                    animationType='slide'>

                    <View style={StyleSheet.modal}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setOpenModal(false)}>
                            <Icon type="ionicons" name="close" size={45} color="black" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                            <Image source={require('../Assets/logo.png')} style={{ width: 200, height: 200 }} />
                        </View>
                        <Text style={{ padding: 40, fontSize: 24, }}>Helpya is a crowdsourcing application that allows clients to search for manual laborers based on their skills and hire them depending on the client’s needs.</Text>
                        <Text style={{ marginLeft: 10, fontSize: 20, }}>Helpya allows you to:</Text>
                        <Unorderedlist bulletUnicode={0x2022} style={{ marginLeft: 25, fontSize: 30, }}><Text style={{ fontSize: 20 }}>Allows you to Select a specific manual laborer that suits your needs.</Text></Unorderedlist>
                        <Unorderedlist bulletUnicode={0x2022} style={{ marginLeft: 25, fontSize: 30, }}><Text style={{ fontSize: 20 }}>Freedom to choose the jobs that you want to do.</Text></Unorderedlist>
                        <Unorderedlist bulletUnicode={0x2022} style={{ marginLeft: 25, fontSize: 30, }}><Text style={{ fontSize: 20 }}>Communicate with your selected Worker.</Text></Unorderedlist>

                    </View>
                </Modal>



            </View >
        </ScrollView>
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
        marginTop: 10,
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
    },
    infoList: {
        height: 350,
        width: "100%",
        padding: 15,
        backgroundColor: 'white',
        color: '#fff',
        marginTop: 10,
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    button: {
        padding: 10,
        backgroundColor: "#16a085",
        marginLeft: 15,
        color: 'white',
        borderRadius: 15


    },
    applyButton: {
        padding: 10,
        marginTop: 10,
        backgroundColor: "#16a085",
        color: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'


    },
    age: {
        flexDirection: 'row'
    }
});
