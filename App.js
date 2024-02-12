import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');

const cardData = [
    { id: 1, color: 'lightgrey', images: [require('./images/TerryCrews1.jpg'), require('./images/TerryCrews2.jpg')] },
    { id: 2, color: 'lightblue', images: [require('./images/Khabib1.jpg'), require('./images/Khabib2.webp')] },
];

const App = () => {
  const [currentImageIndices, setCurrentImageIndices] = useState(new Map());
  // Adding a force update state
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleTapCard = (cardIndex) => {
      setCurrentImageIndices(prev => {
          const newIndices = new Map(prev);
          const card = cardData[cardIndex];
          const currentIndex = newIndices.get(card.id) || 0;
          newIndices.set(card.id, (currentIndex + 1) % card.images.length);
          return newIndices;
      });
      // Force component to re-render
      setForceUpdate(prev => prev + 1);
  };

  return (
      <View style={styles.container}>
          <Swiper
              key={forceUpdate} // Force re-render by changing the key
              cardHorizontalMargin={0}
              cardVerticalMargin={0}
              verticalSwipe={true}
              cards={cardData}
              renderCard={(card, index) => {
                  const currentImageIndex = currentImageIndices.get(card.id) || 0;
                  return (
                      <TouchableOpacity key={`${card.id}-${currentImageIndex}`} onPress={() => handleTapCard(index)} activeOpacity={1}>
                          <View style={[styles.card, { backgroundColor: card.color }]}>
                              <Image
                                  source={card.images[currentImageIndex]}
                                  style={styles.cardImage}
                                  resizeMode="cover"
                              />
                              <Text style={styles.text}>{card.color}</Text>
                          </View>
                      </TouchableOpacity>
                  );
              }}
              backgroundColor="#F5F5F5"
              cardIndex={0}
              infinite={true}
              stackSize={3}
              stackSeparation={15}
              // Your other Swiper configurations
          />
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      alignSelf: 'center',
      width: width * 0.95,
      height: height * 0.85,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 10,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
  });

export default App;