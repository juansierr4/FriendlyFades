import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setName(userData.name);
                setAge(userData.age);
                setBio(userData.bio);
            } else{
                Alert.alert("No user data found.");
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async() => {
        const userRef = doc(db, "users", auth.currentUser.uid);
        try {
            await updateDoc(userRef, {
                name: name,
                age: age,
                bio: bio,
            });
            Alert.alert("Profile updated succesfully!");
            navigation.goBack();
        } catch (error){
            Alert.alert("Error updating profile", error.message);
        }
    };

    return (
        <View>
            <Text>Name:</Text>
            <TextInput value={name} onChangeText={setName} />

            <Text>Age:</Text>
            <TextInput value={age} onChangeText={setAge} keyboardType="numeric" />
            
            <Text>Bio:</Text>
            <TextInput value={bio} onChangeText={setBio} multiline />

            <Button title="Update Profile" onPress={handleUpdate} />
        </View>
    );
};

export default EditProfileScreen;