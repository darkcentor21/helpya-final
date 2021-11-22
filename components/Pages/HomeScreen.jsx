import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Modal, Pressable, LogBox, Image, Alert } from 'react-native'

import { db } from '../../firebase';
import { collection, doc, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { useDispatch, useSelector } from "react-redux";
import { bottom } from 'styled-system';
import { TextInputMask } from 'react-native-masked-text'

LogBox.ignoreLogs(['Setting a timer']);

export default function HomeScreen() {

    // const []
    const logInData = useSelector((state) => state.loginReducer);

    const usersCollectionRef = collection(db, "users");
    const jobsCOllectionRef = collection(db, "jobs");


    const [jobs, setJobs] = useState([])
    const [workers, setWorkers] = useState([])

    useEffect(() => {
        handleGetusers()
        handleGetJobs()
    }, [])
    const handleGetusers = async () => {
        const data = await getDocs(usersCollectionRef);
        setWorkers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const handleGetJobs = async () => {
        const data = await getDocs(jobsCOllectionRef);
        setJobs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        // console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const [openUserModal, setUserModal] = useState(false)
    const [selectedWorker, setSelectedWorker] = useState({ skills: [] })

    const [bookingData, setBookingData] = useState({
        jobTitle: '',
        jobDescription: '',
        address: ''
    })
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")

    const handleAddBooking = async () => {
        await addDoc(jobsCOllectionRef, {
            address: bookingData.address,
            description: bookingData.jobDescription,
            jobTitle: bookingData.jobTitle,
            dateStart: Timestamp.fromDate(new Date(dateStart)),
            dateEnd: Timestamp.fromDate(new Date(dateEnd)),
            worker: selectedWorker,
            client: logInData.user[0],
            status: 'Pending',
            review: ''
        }).then((res) => {
            setUserModal(!openUserModal);
            Alert.alert(
                "Success",
                "Booking Successfully Added"
            );
        }).catch((error) => {
            Alert.alert(
                "Error",
                error
            );
        })
    }

    const [search, setSearch] = useState("");
    // const searchItem = (e) => {
    //     setSearch(e.target.value);
    //     setPage(0);
    // };

    let accountSearch = workers.filter((files) => {
        return (
            files.skills.toString().toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
        );
    });

    return (
        <SafeAreaView>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for specific skills"
                    onChangeText={(text) => {
                        setSearch(text)
                    }}
                />
                <View>
                    <Text style={{ fontSize: 14, padding: 20, marginBottom: 15, }}>List of Available Workers and Clients</Text>
                </View>

            </View>


            <ScrollView style={{ marginTop: 50, padding: 10, height: '74%', width: '100%' }}>

                {accountSearch.map((worker, key) =>

                    <TouchableOpacity key={key} style={styles.list}
                        onPress={() => {
                            setUserModal(true)
                            setSelectedWorker(worker)

                        }}

                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{
                                    uri: worker.photo
                                }}
                                style={{ width: 75, height: 75, borderRadius: 400 / 2 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                <Text style={{ color: '#34495e', fontSize: 20 }}>{worker.fullname}</Text>
                                <Text style={{ color: '#34495e', }}>
                                    {worker.skills.map((skill, key) =>
                                        worker.skills.length === key + 1 ? skill + '' : skill + ', '
                                    )}
                                </Text>
                                <Text style={{ color: '#34495e', fontSize: 20, marginTop: 10 }}>{worker.rating.toFixed(0)}/<Text style={{ fontSize: 15 }}>5</Text></Text>


                            </View>
                        </View>


                    </TouchableOpacity>
                )}

            </ScrollView>


            <Modal
                animationType="slide"
                transparent={true}
                visible={openUserModal}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setUserModal(!openUserModal);
                }}
            >
                <View style={{}}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 20 }}>Book an Appointment</Text>

                        <View style={{ flexDirection: 'row', marginTop: 25, height: 100 }}>
                            <Image
                                source={{
                                    uri: selectedWorker.photo
                                }}
                                style={{ width: 75, height: 75, borderRadius: 400 / 2 }}
                            />
                            <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                <Text style={{ color: '#34495e', fontSize: 20 }}>{selectedWorker.fullname}</Text>
                                <Text style={{ color: '#34495e', }}>
                                    {selectedWorker.skills.map((skill, key) =>
                                        selectedWorker.skills.length === key + 1 ? skill + '' : skill + ', '
                                    )}
                                </Text>

                            </View>


                        </View>
                        {/* <View style={{ flexDirection: 'row', height:300 }}> */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setBookingData({
                                    ...bookingData,
                                    jobTitle: text
                                })
                            }}
                            value={bookingData.jobTitle}
                            placeholder="Job Title"
                            keyboardType="default"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setBookingData({
                                    ...bookingData,
                                    address: text
                                })
                            }}
                            value={bookingData.address}
                            placeholder="Address"
                            keyboardType="default"
                        />
                        <TextInput
                            style={styles.inputTextArea}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(text) => {
                                setBookingData({
                                    ...bookingData,
                                    jobDescription: text
                                })
                            }}
                            value={bookingData.jobDescription}
                            placeholder="Job Description"
                            keyboardType="default"
                        />

                        <TextInputMask
                            style={styles.input}
                            type={'datetime'}
                            options={{
                                format: 'MM/DD/YYYY'
                            }}
                            placeholder='Date Start (12/23/2021)'
                            value={dateStart}
                            onChangeText={(text) => {
                                setDateStart(text)
                            }}
                        />
                        <TextInputMask
                            style={styles.input}
                            type={'datetime'}
                            options={{
                                format: 'MM/DD/YYYY'
                            }}
                            placeholder='Date End (12/23/2021)'
                            value={dateEnd}
                            onChangeText={(text) => {
                                setDateEnd(text)
                            }}
                        />

                        <View style={{ height: 200, flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#e67e22',
                                    padding: 5,
                                    height: 30,
                                    borderRadius: 4,
                                    justifyContent: 'flex-end',
                                    marginTop: 10,
                                    bottom: 0
                                }}
                                onPress={() => setUserModal(!openUserModal)}
                            >
                                <Text style={{ color: '#fff', fontSize: 20 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#16a085',
                                    padding: 5,
                                    height: 30,
                                    borderRadius: 4,
                                    justifyContent: 'flex-end',
                                    marginTop: 10,
                                    bottom: 0,
                                    marginLeft: 10,
                                }}
                                onPress={handleAddBooking}
                            >
                                <Text style={{ color: '#fff', fontSize: 20 }}>Request Booking</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    modalView: {
        margin: 0,

        height: '100%',
        backgroundColor: "white",

        padding: 35,
        alignItems: "flex-start",
        elevation: 5
    },

    // input: {
    //     height: 40,
    //     margin: 12,
    //     borderWidth: 1,
    //     padding: 10,
    // },
    inputTextArea: {
        height: 100,
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#7f8c8d',
        paddingTop: 15,
        paddingLeft: 25,
        borderRadius: 15,
        color: '#7f8c8d',
        backgroundColor: '#fff',
        textAlignVertical: 'top'
    },
    input: {
        height: 40,
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#7f8c8d',
        paddingLeft: 25,
        borderRadius: 15,
        color: '#7f8c8d',
        backgroundColor: '#fff'
    },
    list: {
        height: 120,
        width: "100%",
        padding: 15,
        backgroundColor: 'white',
        color: '#34495e',
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

    }
});