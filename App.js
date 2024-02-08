import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

// Get the Window's width and height
const { height, width } = Dimensions.get('window');

// Sample card data
const cardData = [
  { id: 1, color: 'lightgrey', images: [require('./images/TerryCrews1.jpg'), require('./images/TerryCrews2.jpg')] },
  { id: 2, color: 'lightblue', images: [require('./images/Khabib1.jpg'), require('./images/Khabib2.webp')] },
];

// Main app component
const App = () => {
  const [currentImageIndices, setCurrentImageIndices] = useState(cardData.reduce((acc, card) => ({
    ...acc,
    [card.id]: 0,
  }), {}));

  const handleTapCard = (cardIndex) => {
    const cardId = cardData[cardIndex].id;
    setCurrentImageIndices(prevIndices => ({
      ...prevIndices,
      [cardId]: (prevIndices[cardId] + 1) % cardData[cardIndex].images.length,
    }));
  };

  // Component's rendering
  return (
    <View style={styles.container}>
      <Swiper
        cardHorizontalMargin={0}
        cardVerticalMargin={0}
        verticalSwipe={true}
        cards={cardData}
        renderCard={(card) => {
          const currentImageIndex = currentImageIndices[card.id];
          return (
            <View key={`${card.id}-${currentImageIndex}`} style={{ ...styles.card, backgroundColor: card.color }}>
              <Image
                source={card.images[currentImageIndex]}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.text}>{card.color}</Text>
            </View>
          );
        }}
        onTapCard={(cardIndex) => handleTapCard(cardIndex)}
        backgroundColor="#F5F5F5"
        cardIndex={0}
        infinite={true}
        stackSize={3}
        stackSeparation={15}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: 'black',
                borderColor: 'black',
                color: 'white',
                borderWidth: 1,
                borderRadius: 5,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: -30,
              },
            },
          },
          right: {
            title: 'FIGHT',
            style: {
              label: {
                backgroundColor: 'black',
                borderColor: 'black',
                color: 'white',
                borderWidth: 1,
                borderRadius: 5,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: 30,
              },
            },
          },
        }}
      />
    </View>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    alignSelf: 'center',
    width: width * 0.9,
    height: height * 0.75,
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
