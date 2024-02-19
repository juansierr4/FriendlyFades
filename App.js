import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const { width, height } = Dimensions.get('window');

const cardData = [
    { id: 1, text: 'whats up my yall, who wants to see my giant lizard? Yes, I said that, whats up my yall, who wants to see my giant lizard?', color: 'lightgrey', images: [require('./images/TerryCrews1.jpg'), require('./images/TerryCrews2.jpg')] },
    { id: 2, text: 'yes brother', color: 'lightblue', images: [require('./images/Khabib1.jpg'), require('./images/Khabib2.webp')] },
    { id: 3, text: 'hi guys', color: 'lightred', images: [require('./images/Zach1.webp'), require('./images/Zach2.jpg')] },
];

const App = () => {
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0);

  const handleTapImage = (cardId) => {
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [cardId]: (prevIndices[cardId] === undefined ? 0 : (prevIndices[cardId] + 1) % cardData.find(card => card.id === cardId).images.length),
    }));
    setSwiperKey(prevkey => prevkey + 1);
  };

  const handleSwipe = (cardIndex) => {
    setCurrentCardIndex(cardIndex + 1);
  };

  return (
    <View style={styles.container}>
      <Swiper
        key={swiperKey}
        cardHorizontalMargin={0}
        cardVerticalMargin={0}
        verticalSwipe={true}
        horizontalSwipe={false}
        cards={cardData}
        renderCard={(card) => {
          const currentImageIndex = currentImageIndices[card.id] || 0;
          return (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => handleTapImage(card.id)}
              activeOpacity={1}
            >
              <Image
                key={currentImageIndex}
                source={card.images[currentImageIndex]}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textSection}>
                <Text style={styles.text}>{card.text}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        onSwiped={handleSwipe}
        cardIndex={currentCardIndex}
        backgroundColor="#F5F5F5"
        stackSize={cardData.length}
        stackSeparation={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  card: {
    alignSelf: 'center',
    width: width * 0.95, // Increase width to take up more screen space
    height: height * 0.95, // Increase height
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'flex-end', // Align children to the bottom
    alignItems: 'center',
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textSection: { // Dedicated text section at the bottom of the card
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderBottomLeftRadius: 20, // Match the card's border radius
    borderBottomRightRadius: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%', // Image will take up the entire card size
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
});


export default App;
