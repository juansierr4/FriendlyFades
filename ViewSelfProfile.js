import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './AppStyles'; // Ensure this path is correct

const ViewSelfProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleTapImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex + 1 < userData.profileImageUrls.length ? prevIndex + 1 : 0
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleTapImage}
        activeOpacity={1}
      >
        <Image
          source={{ uri: userData.profileImageUrls[currentImageIndex] }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.textSection}>
          <Text style={styles.nameText}>{userData.name}</Text>
          <Text style={styles.detailsText}>Age: {userData.age}</Text>
          <Text style={styles.detailsText}>Height: {userData.height}</Text>
          <Text style={styles.detailsText}>Weight: {userData.weight}</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.messagesButton} onPress={() => navigation.goBack()}>
        <Text style={{ color: 'white', fontSize: 24, fontFamily: 'Impact' }}>Go Back</Text>
        </TouchableOpacity>    
        </View>
  );
};

export default ViewSelfProfile;
