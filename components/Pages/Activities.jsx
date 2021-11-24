import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Picker, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from "react-redux";
import { alignItems, marginBottom, marginRight, marginTop } from 'styled-system';
import { db } from '../../firebase';


export default function Activities() {
    const logInData = useSelector((state) => state.loginReducer);
    const messageCollectionRef = collection(db, "messaging");
    const ReviewsCollectionRef = collection(db, "reviews")

    useEffect(() => {
        handleGetRequest();
        handleGetJobs();

        // GetChat(openChat.room)

    }, [])

    const GetChat = (jobId) => {
        const messageQ = query(collection(db, "messaging"), where("jobId", "==", jobId))
        onSnapshot(messageQ, (queryMessages) => {
            const k = queryMessages.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            console.log(k)
            setMessages(k)
            setMessageId(k[0].id)
        })
    }


    const [openChat, setOpenChat] = useState({
        open: false,
        recepient: '',
        room: '',
        name: '',
        messageId: ''
    })

    const [messageId, setMessageId] = useState("")
    const [messages, setMessages] = useState([])

    const [chat, setChat] = useState("");

    const openMessages = async (jobId, Recepient) => {
        const q = query(collection(db, "messaging"), where("jobId", "==", jobId))
        const add = await getDocs(q)
        const k = add.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

        if (add.size === 0) {
            await addDoc(messageCollectionRef, {
                jobId: jobId,
                messages: []
            })
            openMessages(jobId, Recepient)
        } else {
            setOpenChat({
                ...openChat,
                open: true,
                recepient: jobId,
                name: Recepient,
            })

            GetChat(jobId)
        }

    }

    const addChat = async () => {

        const newChat = {
            message: chat,
            sender: logInData.user[0].userId,
            createdAt: Timestamp.fromDate(new Date()),
        }

        // const messageQ = query(collection(db, "messaging"), where("jobId", "==", openChat.room))
        const messageDoc = doc(db, "messaging", messageId);
        await updateDoc(messageDoc, {
            messages: arrayUnion(newChat)
        }).then((res) => {
            console.log("ResulTUpdate:" + messages)
        })
    }


    const [jobs, setJobs] = useState([])
    const [requests, setRequest] = useState([])


    const handleGetRequest = async () => {
        const q = query(collection(db, "jobs"), where("client.userId", "==", logInData.user[0].userId))
        await getDocs(q).then((res) => {
            const k = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setRequest(k)
        })

        // const k = getquery.docs.map((doc) => ({ ...doc.data(), id: doc.id}))
    }

    const handleGetJobs = async () => {
        const q = query(collection(db, "jobs"), where("worker.userId", "==", logInData.user[0].userId))
        await getDocs(q).then(res => {
            const k = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setJobs(k)
        })
    }

    const handleUpdateBookings = async (updateStatus, id) => {
        const jobDoc = doc(db, "jobs", id);
        await updateDoc(jobDoc, {
            status: updateStatus
        }).then((res) => {
            handleGetJobs();
            handleGetRequest();
        })
    }
    const [modalOpen, setOpenModal] = useState(false)
    const [activeJobreview, setActiveJobReview] = useState({
        jobId: "",
        userId: "",
        rating: "",
        userDocId: ""
    })
    const openReviewBox = async (jobId, userId, rating, userDocId) => {
        setOpenModal(true);

        const q = query(collection(db, "users"), where("userId", "==", userId))
        let userData = []
        await getDocs(q).then(res => {
            const k = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            userData = k
        })

        console.log(userData)
        setActiveJobReview({
            jobId: jobId,
            userId: userId,
            rating: parseFloat(userData[0].rating),
            userDocId: userDocId
        })
    }


    const [review, setReview] = useState("")
    const [rating, setRating] = useState(5)

    const addReview = async () => {

        await addDoc(ReviewsCollectionRef, {
            review: review,
            reviewedBy: logInData.user[0].userId,
            reviewTo: activeJobreview.userId,
            rating: rating,
            jobId: activeJobreview.jobId,
            dateReview: Timestamp.fromDate(new Date()),
        })

        const userDoc = doc(db, "users", activeJobreview.userDocId);
        const jobDoc = doc(db, "jobs", activeJobreview.jobId);

        let newRating = rating

        if (activeJobreview.rating != 0) {
            newRating = parseFloat((rating + parseFloat(activeJobreview.rating)) / 2)
        } else {
            newRating = rating
        }

        await updateDoc(jobDoc, {
            "worker.rating": newRating
        })

        await updateDoc(userDoc, {
            rating: newRating
        }).then((res1) => {
            setOpenModal(false);
            Alert.alert(
                "Success",
                `Review has been saved Successfully ${rating}`,
            );
        }).catch((error) => {
            Alert.alert(
                "Error",
                error.message
            );
        })

    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffcf93" }}>

            <View style={{ height: 350, }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 24, color: 'black', marginTop: 30, marginBottom: 10, marginLeft: 10, marginRight: 50 }}>My Requests</Text>

                    <TouchableOpacity style={{ marginLeft: 150, marginTop: 30, }} onPress={() => {
                        handleGetRequest()
                        handleGetJobs()
                    }}>

                        <Icon type="ionicons" name="sync" size={35} color="white" />
                    </TouchableOpacity>



                </View>



                <ScrollView style={{ padding: 10, height: '100%', width: '100%' }}>
                    {requests.map((request, key) =>
                        <View style={{ marginBottom: 10 }} key={key}
                            onPress={() => {
                                setUserModal(true)
                                setSelectedWorker(worker)

                            }}
                        >

                            <View style={{ flexDirection: 'row', backgroundColor: 'white', padding: 10, borderRadius: 10, height: 140 }}>
                                <Image
                                    source={{
                                        uri: request.worker.photo
                                    }}
                                    style={{ width: 75, height: 75, borderRadius: 400 / 2 }}
                                />
                                <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                    <Text style={{ color: '#34495e', fontSize: 15 }}>{request.worker.fullname}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#34495e', fontSize: 15 }}>{request.jobTitle}</Text>
                                        <Text style={{
                                            backgroundColor: request.status === "Pending" ? '#e67e22' : request.status === "Accepted" ? "#16a085" : "#e74c3c", color: 'white', fontSize: 13,
                                            padding: 2, marginLeft: 10, borderRadius: 4
                                        }}>
                                            {moment(request.dateStart.toDate()).format("MMM DD, YYYY")}
                                        </Text>
                                        <Text style={{ color: "#34495e", fontSize: 15 }}> - </Text>
                                        <Text style={{
                                            backgroundColor: request.status === "Pending" ? '#e67e22' : request.status === "Accepted" ? "#16a085" : "#e74c3c", color: 'white', fontSize: 13,
                                            padding: 2, borderRadius: 4
                                        }}>
                                            {moment(request.dateEnd.toDate()).format("MMM DD, YYYY")}
                                        </Text>
                                    </View>
                                    <View style={{ flexWrap: 'wrap', alignItems: 'flex-start', width: '90%' }}>

                                        <Text style={{ color: '#34495e', fontSize: 12 }}>{request.description}</Text>
                                    </View>

                                    <Text style={{ color: '#34495e', fontSize: 10 }}>
                                        {request.worker.skills.map((skill, key) =>
                                            request.worker.skills.length === key + 1 ? skill + '' : skill + ', '
                                        )}
                                    </Text>
                                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                                        <Text style={{
                                            backgroundColor: request.status === "Pending" ? '#e67e22' : request.status === "Accepted" ? "#16a085" : "#e74c3c",
                                            padding: 5, color: 'white', fontSize: 12, borderRadius: 5
                                        }}>{request.status}</Text>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#16a085',
                                                padding: 5,
                                                borderRadius: 4,
                                                marginLeft: 5,
                                                bottom: 0,
                                            }}
                                            onPress={() => openMessages(request.id, request.worker.fullname)}
                                        >
                                            <Icon type="ionicons" name="chatbubble-ellipses" size={20} color="white" />
                                        </TouchableOpacity>
                                        {request.worker.rating === 0 && request.status === "Finished" ?
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#16a085',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginLeft: 5,
                                                    bottom: 0,
                                                }}
                                                onPress={() => openReviewBox(request.id, request.worker.userId, request.worker.rating, request.worker.id)} >
                                                <Text style={{ color: 'white' }}>Review User</Text>
                                            </TouchableOpacity>

                                            :
                                            <View></View>

                                        }

                                    </View>
                                    {request.status === "Accepted"
                                        ?
                                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#e67e22',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginRight: 5,
                                                    marginTop: 10,
                                                    bottom: 0,
                                                    width: 50
                                                }}
                                                onPress={() => handleUpdateBookings("Finished", request.id)}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 10 }}>Finish Job</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View>

                                        </View>
                                    }

                                </View>
                            </View>
                        </View>
                    )}

                </ScrollView>
            </View>

            <View style={{ height: 340, padding: 10 }}>
                <Text style={{ flexDirection: 'row', alignSelf: 'flex-start', fontSize: 24, color: 'black', marginBottom: 10 }} >Jobs for Me</Text>
                <ScrollView>
                    {jobs.map((job, key) =>
                        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, marginTop: 10, height: 170, }} key={key}>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                    <Text style={{ color: '#34495e', fontSize: 15 }}>{job.client.fullname}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#34495e', fontSize: 15 }}>{job.jobTitle}</Text>
                                        <Text style={{
                                            backgroundColor: job.status === "Pending" ? '#e67e22' : job.status === "Accepted" ? "#16a085" : "#e74c3c", color: 'white', fontSize: 13,
                                            padding: 2, marginLeft: 10, borderRadius: 4
                                        }}>
                                            {moment(job.dateStart.toDate()).format("MMM DD, YYYY")}
                                        </Text>
                                        <Text style={{ color: "#34495e", fontSize: 15 }}> - </Text>
                                        <Text style={{
                                            backgroundColor: job.status === "Pending" ? '#e67e22' : job.status === "Accepted" ? "#16a085" : "#e74c3c", color: 'white', fontSize: 13,
                                            padding: 2, borderRadius: 4
                                        }}>
                                            {moment(job.dateEnd.toDate()).format("MMM DD, YYYY")}
                                        </Text>
                                    </View>
                                    <View style={{ flexWrap: 'wrap', alignItems: 'flex-start', width: '90%' }}>
                                        <Text style={{ color: '#34495e', fontSize: 12 }}>{job.address}</Text>
                                        <Text style={{ color: '#34495e', fontSize: 12 }}>{job.description}</Text>
                                    </View>

                                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                                        <Text style={{
                                            backgroundColor: job.status === "Pending" ? '#e67e22' : job.status === "Accepted" ? "#16a085" : "#e74c3c",
                                            padding: 5, color: 'white', fontSize: 12, borderRadius: 5
                                        }}>{job.status}</Text>

                                    </View>
                                    {job.status === "Pending" ?

                                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#e67e22',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginRight: 5,
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    bottom: 0,
                                                    width: 65
                                                }}
                                                onPress={() => handleUpdateBookings("Denied", job.id)}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 10 }}>Deny Job</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#16a085',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginBottom: 10,
                                                    marginTop: 10,
                                                    bottom: 0,
                                                    width: 73
                                                }}
                                                onPress={() => handleUpdateBookings("Accepted", job.id)}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 10 }}>Accept Job </Text>
                                            </TouchableOpacity>

                                        </View>

                                        : <View></View>

                                    }
                                    {job.status === "Pending" && job.status === "Accepted" ?

                                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#e67e22',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginRight: 5,
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    bottom: 0,
                                                    width: 65
                                                }}
                                                onPress={() => handleUpdateBookings("Denied", job.id)}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 10 }}>Deny Job</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: '#16a085',
                                                    padding: 5,
                                                    borderRadius: 4,
                                                    marginBottom: 10,
                                                    marginTop: 10,
                                                    bottom: 0,
                                                    width: 73
                                                }}
                                                onPress={() => handleUpdateBookings("Accepted", job.id)}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 10 }}>Accept Job </Text>
                                            </TouchableOpacity>

                                        </View>

                                        : <View></View>

                                    }

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#16a085',
                                            padding: 5,
                                            borderRadius: 4,
                                            bottom: 0,
                                            width: 30,
                                            marginTop: 10,
                                            marginBottom: 10,
                                        }}
                                        onPress={() => openMessages(job.id, job.client.fullname)}
                                    >
                                        <Icon type="ionicons" name="chatbubble-ellipses" size={20} color="white" />
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>


                    )}
                </ScrollView>
            </View>


            <Modal
                animationType="slide"
                transparent={true}
                visible={openChat.open}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setOpenChat(!openChat.open);
                }}
            >
                <View style={{}}>
                    <View style={styles.chatmodalView}>
                        <View style={{ height: '5%', flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
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
                                onPress={() => setOpenChat({ open: false })}
                            >
                                <Icon type="ionicons" name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ flexDirection: 'column', height: '75%', width: '100%', padding: 10, }}>

                            {messages.map(message =>
                                message.messages.map(chat =>
                                    <View style={{ marginBottom: 25, alignItems: chat.sender === logInData.user[0].userId ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{
                                            color: chat.sender === logInData.user[0].userId ? 'white' : 'black',
                                            backgroundColor: chat.sender === logInData.user[0].userId ? '#5ebf95' : '#f2f2f2',
                                            flexWrap: 'wrap',
                                            textAlign: chat.sender === logInData.user[0].userId ? 'right' : 'left',
                                            borderRadius: 10, width: 200, padding: 10
                                        }}>
                                            {chat.message}
                                        </Text>
                                    </View>
                                )

                            )}
                        </ScrollView>
                        <View style={{ height: '20%', flexDirection: 'row', justifyContent: 'flex-end', padding: 20, marginLeft: 20 }}>
                            <TextInput
                                style={styles.chatinputTextArea}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => {
                                    setChat(text)
                                }}
                                value={chat}
                                placeholder="Message"
                                keyboardType="default"
                                clearButtonMode='always'
                            />

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#16a085',
                                    padding: 7.5,
                                    height: 50,
                                    width: 50,
                                    borderRadius: 100,
                                    justifyContent: 'flex-end',
                                    marginTop: 5,
                                    bottom: 0,
                                    marginLeft: 10
                                }}
                                onPress={() =>
                                    addChat()



                                }
                            >
                                <Icon style={{ alignSelf: 'center', paddingBottom: 5 }} type="ionicons" name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal animationType='slide' visible={modalOpen}>

                <View style={styles.modalView}>
                    <View style={{ height: 50, flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'flex-end' }} onPress={() => setOpenModal(false)}>
                            <Icon type="ionicons" name="close" size={45} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text>{activeJobreview.rating}</Text>
                    <View style={{ height: 120 }}>
                        <TextInput
                            style={styles.inputTextArea}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(text) => {
                                setReview(text)
                            }}
                            value={review}
                            placeholder="Review"
                            keyboardType="default"
                            clearButtonMode='always' />
                    </View>


                    <View style={{ height: 60, flexDirection: 'row' }}>
                        <Text style={{ marginTop: 15, marginRight: 20, fontSize: 20 }}>Rating:</Text>
                        <Picker
                            selectedValue={rating}
                            style={{ height: 50, width: 100 }}
                            onValueChange={(itemValue, itemIndex) => setRating(itemValue)}
                        >
                            <Picker.Item label="5" value={5} />
                            <Picker.Item label="4" value={4} />
                            <Picker.Item label="3" value={3} />
                            <Picker.Item label="2" value={2} />
                            <Picker.Item label="1" value={1} />
                        </Picker>
                    </View>
                    { }
                    <TouchableOpacity style={{
                        backgroundColor: '#16a085',
                        padding: 5,
                        width: 100,
                        // height: 35,
                        borderRadius: 4,
                        justifyContent: 'flex-end',
                        marginTop: 10,
                        bottom: 0,
                        marginLeft: 10
                    }} onPress={() => addReview()}>
                        <Text style={{ color: 'white' }}>Send Review</Text>
                    </TouchableOpacity>
                </View>

            </Modal>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    inputTextArea: {
        height: 50,
        width: 270,
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
    chatinputTextArea: {
        height: 50,
        width: '88%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#7f8c8d',
        paddingTop: 15,
        paddingLeft: 25,
        borderRadius: 15,
        color: '#7f8c8d',
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    label: {
        color: 'white',
        margin: 20,
        marginLeft: 0,
    },
    button: {
        marginTop: 40,
        color: 'white',
        height: 40,
        backgroundColor: '#ec5990',
        borderRadius: 4,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 10,
        padding: 8,
        //   backgroundColor: '#0e101c',
    },
    input: {
        backgroundColor: 'white',
        borderColor: '#95a5a6',
        textAlign: 'center',
        borderWidth: 1,
        margin: 5,
        height: 40,
        padding: 10,
        borderRadius: 4,
    },
    list: {
        height: 120,
        width: "100%",
        padding: 15,
        backgroundColor: 'white',
        color: '#34495e',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

    },
    modalView: {
        margin: 0,

        height: '100%',
        backgroundColor: "white",
        width: '100%',
        padding: 10,
        alignItems: "flex-start",
        elevation: 5
    },
    chatmodalView: {

        margin: 0,

        height: '100%',
        backgroundColor: "white",
        width: '100%',
        padding: 10,
        alignItems: "flex-start",
        elevation: 5,
        backgroundColor: "#b3f9db"
    },

    button: {
        justifyContent: 'flex-end',
        padding: 10,

    }
});