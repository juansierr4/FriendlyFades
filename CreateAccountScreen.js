import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { styles } from './AppStyles';

// Define a function component for each step in the account creation process

function NameInput({ navigation, route }) {
  const [name, setName] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.weightLabel}>What's Your Name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GenderInput', { ...route.params, name })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
function GenderInput({ navigation, route }) {
  const [gender, setGender] = useState('');
  return (
    <View style={styles.container}>
    <Text style={styles.genderLabel}>Gender</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        itemStyle={{ color: 'white' }}
        onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
      >
        <Picker.Item label="Please select your gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AgeInput', { ...route.params, gender })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

// Repeat this structure for AgeInput, HeightInput, WeightInput, BioInput, EmailInput, PasswordInput

// Example for the next step, AgeInput
function AgeInput({ navigation, route }) {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => (currentYear - i).toString());

  const calculateAge = (birthYear, birthMonth, birthDay) => {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (!month || !day || !year) {
      Alert.alert("Please select your birthdate");
      return;
    }
    const age = calculateAge(year, month, day);
    navigation.navigate('HeightInput', { ...route.params, age });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pickerLabel}>Birthdate</Text>
      <View style={styles.pickerContainer}>
      <Picker
      selectedValue={month}
      style={styles.datepicker}
      itemStyle={{ color: 'white' }}
      onValueChange={(itemValue) => setMonth(itemValue)}>
            <Picker.Item label="MM" value="" />
          {months.map((m) => (
            <Picker.Item key={m} label={m} value={m}/>
          ))}
        </Picker>
        <Picker
          selectedValue={day}
          style={styles.datepicker}
          itemStyle={{ color: 'white' }}
          onValueChange={(itemValue) => setDay(itemValue)}>
          <Picker.Item label="DD" value="" />
          {days.map((d) => (
            <Picker.Item key={d} label={d} value={d} style={{ backgroundColor: 'white' }}/>
          ))}
        </Picker>
        <Picker
          selectedValue={year}
          style={styles.yearpicker}
          itemStyle={{ color: 'white' }}

          onValueChange={(itemValue) => setYear(itemValue)}>
          <Picker.Item label="Year" value="" />
          {years.map((y) => (
            <Picker.Item key={y} label={y} value={y} style={{ backgroundColor: 'white' }}/>
          ))}
        </Picker>
        </View>
      <TouchableOpacity style={styles.datenextbutton} onPress={handleNext}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function HeightInput({ navigation, route }) {
  const [height, setHeight] = useState('');
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={height}
        style={styles.heightpicker}
        itemStyle={{ color: 'white' }}
        onValueChange={(itemValue, itemIndex) => setHeight(itemValue)}
      >
        <Picker.Item label="How Tall are you?" value="" />
        <Picker.Item label="5'0" value="5'0" />
        <Picker.Item label="5'1" value="5'1" />
        <Picker.Item label="5'2" value="5'2" />
        <Picker.Item label="5'3" value="5'3" />
        <Picker.Item label="5'4" value="5'4" />
        <Picker.Item label="5'5" value="5'5" />
        <Picker.Item label="5'6" value="5'6" />
        <Picker.Item label="5'7" value="5'7" />
        <Picker.Item label="5'8" value="5'8" />
        <Picker.Item label="5'9" value="5'9" />
        <Picker.Item label="5'10" value="5'10" />
        <Picker.Item label="5'11" value="5'11" />
        <Picker.Item label="6'0" value="6'0" />
        <Picker.Item label="6'1" value="6'1" />
        <Picker.Item label="6'2" value="6'2" />
        <Picker.Item label="6'3" value="6'3" />
        <Picker.Item label="6'4" value="6'4" />
        <Picker.Item label="6'5" value="6'5" />
        <Picker.Item label="6'6" value="6'6" />
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WeightInput', { ...route.params, height })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
function WeightInput({ navigation, route }) {
  const [weight, setWeight] = useState('');
  return (
    <View style={styles.container}>
            <Text style={styles.pickerLabel}>How heavy are you?</Text>

            <View style={styles.pickerAndLabelContainer}>

      <Picker
        selectedValue={weight}
        style={styles.weightpicker}
        itemStyle={{ color: 'white' }}

        onValueChange={(itemValue, itemIndex) => setWeight(itemValue)}
      >
        <Picker.Item label="How heavy are you?" value="" />
        <Picker.Item label="100" value="100" />
        <Picker.Item label="105" value="105" />
        <Picker.Item label="110" value="110" />
        <Picker.Item label="115" value="115" />
        <Picker.Item label="120" value="120" />
        <Picker.Item label="125" value="125" />
        <Picker.Item label="130" value="130" />
        <Picker.Item label="135" value="135" />
        <Picker.Item label="140" value="140" />
        <Picker.Item label="145" value="145" />
        <Picker.Item label="150" value="150" />
        <Picker.Item label="155" value="155" />
        <Picker.Item label="160" value="160" />
        <Picker.Item label="165" value="165" />
        <Picker.Item label="170" value="170" />
        <Picker.Item label="175" value="175" />
        <Picker.Item label="180" value="180" />
        <Picker.Item label="185" value="185" />
        <Picker.Item label="190" value="190" />
        <Picker.Item label="195" value="195" />
        <Picker.Item label="200" value="200" />
        <Picker.Item label="205" value="205" />
        <Picker.Item label="210" value="210" />
        <Picker.Item label="215" value="215" />
        <Picker.Item label="220" value="220" />
        <Picker.Item label="225" value="225" />
        <Picker.Item label="230" value="230" />
        <Picker.Item label="235" value="235" />
        <Picker.Item label="240" value="240" />
        <Picker.Item label="245" value="245" />
        <Picker.Item label="250" value="250" />
        <Picker.Item label="255" value="255" />
        <Picker.Item label="260" value="260" />
        <Picker.Item label="265" value="265" />
        <Picker.Item label="270" value="270" />
        <Picker.Item label="275" value="275" />
        <Picker.Item label="280" value="280" />
        <Picker.Item label="285" value="285" />
        <Picker.Item label="290" value="290" />
        <Picker.Item label="295" value="295" />
        <Picker.Item label="300" value="300" />
      </Picker>
      <Text style={styles.weightLabel}>lbs</Text>
      </View>
      <TouchableOpacity
        style={styles.datenextbutton}
        onPress={() => navigation.navigate('UploadImage', { ...route.params, weight })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
function UploadImage({ navigation, route }){
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!')
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      selectionLimit: 4, // No limit on selections
    });
   
    console.log(pickerResult); // Debugging line

    if (!pickerResult.cancelled && pickerResult.assets) {
      const selectedImageUris = pickerResult.assets.map(asset => asset.uri); // Access the uri of the first image
      setImages(prevImages => [...prevImages, ...selectedImageUris]); // Append new images to the existing array
      console.log('Image URIs set:', selectedImageUris);
    }
  };
  const handleNext = async () => {
    if (images.length ===0) {
      Alert.alert("Please select an image first.");
      return;
    }
    try {
      // Upload images one by one
      const urls = [];
      for (const image of images) {
        const url = await uploadImageAsync(image);
        urls.push(url);
      }
    navigation.navigate('BioInput', { ...route.params, profileImageUrls: urls });
    } catch(error){
      console.error("Failed to upload images", error);
      Alert.alert("Failed to upload image.");
    }
  };

  return (
    <View style = {styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text>Pick Image(s)</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={{ width: 100, height: 200 }} />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

async function uploadImageAsync(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storage = getStorage();
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const storageRef = ref(storage, `profile_images/${filename}`);
  const snapshot = await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

function BioInput({ navigation, route }) {
  const [bio, setBio] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.weightLabel}>Enter a bio describing yourself:</Text>
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EmailInput', { ...route.params, bio })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmailInput({ navigation, route }) {
  const [email, setEmail] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.weightLabel}>What's Your Email Address?</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PasswordInput', { ...route.params, email })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
function PasswordInput({ navigation, route }) {
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.weightLabel}>Enter Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FinalStep', { ...route.params, password })}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

// Define the final component to handle user creation and data storage
function FinalStep({ navigation, route }) {
  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async () => {
    const { email, password, name, gender, age, height, weight, profileImageUrls, bio } = route.params;
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      await setDoc(doc(db, "users", user.uid), { // user.uid is used here
        name, 
        gender, 
        age, 
        height, 
        weight, 
        profileImageUrls, // Ensure this is an array of image URLs
        bio,
        uid: user.uid, // Storing user.uid in the document if needed
        profileImageUrl: profileImageUrls[0],
      });
      console.log('User profile created with profileImageUrl:', profileImageUrls[0]);
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text>Create Account</Text>
      </TouchableOpacity>
    </View>
  );};


// Export all components
export { NameInput, GenderInput, AgeInput, HeightInput, WeightInput, UploadImage, BioInput, EmailInput, PasswordInput, FinalStep };