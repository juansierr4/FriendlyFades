import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from './AppStyles.js';


function Premium({ navigation }) {
  
  return (
    
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 40, top: 40 }]}>Friendly Fades</Text>
      <Text style={styles.tmtitle}>Swipe up</Text>
      <Text style={styles.tmtitle2}>to Square Up</Text>
      </View>
      
  );
}
export default Premium;
