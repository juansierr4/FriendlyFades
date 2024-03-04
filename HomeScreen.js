import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { styles } from './AppStyles.js';

//Home Screen Component
const cardData = [
  { id: 1, text: 'whats up my yall, who wants to see my giant lizard? Yes, I said that, whats up my yall, who wants to see my giant lizard?', images: [require('./images/TerryCrews1.jpg'), require('./images/TerryCrews2.jpg')], tags: ['Karate', 'Boxing'] },
  { id: 2, text: 'yes brother', images: [require('./images/Khabib1.jpg'), require('./images/Khabib2.webp')], tags: ['MMA', 'Wrestling'] },
  { id: 3, text: 'hi guys', images: [require('./images/Zach1.webp'), require('./images/Zach2.jpg')], tags: ['new', 'taekwondo'] },
];

const HomeScreen = () => {
    const [currentImageIndices, setCurrentImageIndices] = useState({});
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [swiperKey, setSwiperKey] = useState(0);

    const handleTapImage = (cardId) => {
        setCurrentImageIndices(prevIndices => ({
          ...prevIndices,
          [cardId]: (prevIndices[cardId] === undefined ? 1 : (prevIndices[cardId] + 1) % cardData.find(card => card.id === cardId).images.length),
        }));
        setSwiperKey(prevkey => prevkey + 1);
      };
    const handleSwipe = (cardIndex) => {
        setCurrentCardIndex(cardIndex + 1);
      };
  
    //Beginning of Swiper component
    return (
      <View style={styles.container}>
        <Swiper
          key={swiperKey}
          backgroundColor='#800000'
          cardHorizontalMargin={0}
          cardVerticalMargin={0}
          verticalSwipe={true}
          horizontalSwipe={false}
          cards={cardData}
          renderCard={(card) => {
            const currentImageIndex = currentImageIndices[card.id] || 0;
            return (
              <TouchableOpacity 
                style={styles.card}
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
                  <View style={styles.tagsContainer}>
                    {card.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          onSwiped={handleSwipe}
          cardIndex={currentCardIndex}
          stackSize={cardData.length}
          stackSeparation={15}
        />
      </View>
    );
    //End of Swiper component
  }//End of Home Screen Component

  export default HomeScreen;