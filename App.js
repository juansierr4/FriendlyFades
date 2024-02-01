import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';

//Get the Window's width and height
const { height, width } = Dimensions.get( 'window' );

//Sample card data
const cardData = [
  { id: 1, color: 'lightgrey', images: [{uri:'https://wallpapercave.com/wp/wp2313951.jpg' }, {uri:'https://th.bing.com/th/id/R.8850da8bb324198606655820ce27475f?rik=rnGdS6O52A233g&riu=http%3a%2f%2fcdn01.cdn.justjared.com%2fwp-content%2fuploads%2f2014%2f12%2fowens-shirtless%2fterry-owens-goes-shirtless-in-rio-03.jpg&ehk=889qL0YT6WMYJAdnb3B%2bi8gqAmtXzFrc58YO75EthhQ%3d&risl=&pid=ImgRaw&r=0'}]},
  { id: 2, color: 'lightblue', images: [{uri:'https://wallpapercave.com/wp/wp5634572.jpg' }, {uri:'https://www.ocregister.com/wp-content/uploads/2017/12/ldn-l-ufc219-khabib-17-1229.jpg?w=526'}]},
  { id: 3, color: 'beige', images: [{uri:'https://2.bp.blogspot.com/-i9IuglM3Bo8/Ta-alUofK0I/AAAAAAAAAAY/l9CNuj-3Kmc/s1600/awesomeblackguy.jpg' }, {uri:'https://th.bing.com/th/id/OIP.GEa3i7M1EdnES0LO80mhRwAAAA?rs=1&pid=ImgDetMain'}]},
  { id: 4, color: 'orange', images: [{uri:'https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/rZJIMvhmliwmde8a6/videoblocks-overweight-man-with-glass-of-beer-on-white-background-fat-guy-drinking-alcohol-unhealthy-way-of-life_hwgh6ntgnb_thumbnail-1080_01.png' }, {uri:'https://www.bing.com/images/search?view=detailV2&ccid=ez9%2fgmqd&id=8C9611506C92478411DE3391673863CE90B5223E&thid=OIP.ez9_gmqdzK-ciGhi5npqFgHaEK&mediaurl=https%3a%2f%2fdm0qx8t0i9gc9.cloudfront.net%2fthumbnails%2fvideo%2frZJIMvhmliwmde8a6%2fvideoblocks-fat-man-pours-beer-from-bottle-into-a-beer-glass-obese-man-with-big-belly-isolated-on-white-background-drinking-alcohol-leads-to-obesity_rdb6htl3s_thumbnail-1080_01.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.7b3f7f826a9dccaf9c886862e67a6a16%3frik%3dPiK1kM5jOGeRMw%26pid%3dImgRaw%26r%3d0&exph=1080&expw=1920&q=fat+guy+with+beer&simid=607989081380447703&FORM=IRPRST&ck=982D30EB281D153A7239583412EB7460&selectedIndex=24&itb=0'}]},
  { id: 5, color: 'pink', images: [{uri:'https://th.bing.com/th/id/R.9e8a235b88f43441604c91fe2b036703?rik=Lq3cqfHbWM1TjA&pid=ImgRaw&r=0'}, {uri:'https://th.bing.com/th/id/R.475fedb211dd600d11693162ecbe8b61?rik=Jj5emxOazfPT1A&riu=http%3a%2f%2fi1.mirror.co.uk%2fincoming%2farticle6774948.ece%2fALTERNATES%2fs615%2fCollin-Clarke4.jpg&ehk=lZcCxmUZkgyh2GQMPugxsEUUzlrqqZg2mGzHLgV1Xxc%3d&risl=&pid=ImgRaw&r=0'}]}
];

//main app component
const App = () => {
  const [currentImages, setCurrentImages] = useState(cardData.reduce((acc, card) => {
    acc[card.id] = 0;
    return acc;
  }, {}));
  
  const handleImageTap = (cardID) => {
    setCurrentImages(prevImages => {
      const newImages = { ...prevImages };
      const card = cardData.find(card => card.id === cardID);
      const imageCount = card.images.length;
      newImages[cardID] = (newImages[cardID] + 1) % imageCount;
      return newImages;
    });
  };

  const handleSwipeBottom = () => {
    console.log('Swiped Down!');
    // Handle actions when swiped left
  };

  const handleSwipeTop = () => {
    console.log('Swiped Up!');
    // Handle actions when swiped right
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
          const currentImageIndex = currentImages[card.id];
          const currentImage = card.images[currentImageIndex];

          return (
            <TouchableOpacity 
              key={card.id} 
              style={{ ...styles.card, backgroundColor: card.color }} 
              onPress={() => handleImageTap(card.id)}
            >
              <Image source={currentImage} style={styles.cardImage}/>
              <Text style={styles.text}>{card.color}</Text>
            </TouchableOpacity>
          );
        }}
        onSwipedBottom={handleSwipeBottom}
        onSwipedTop={handleSwipeTop}
        backgroundColor='#F5F5F5'
        cardIndex={0}
        infinite={true} // for making it loop (1st card will appear after last card is swiped)
        stackSize={3}
        stackSeparation={height * 0.03}
        animateCardOpacity
        animateOverlayLabelsOpacity
        overlayLabels={{
          bottom: {
            title: '✖',
            style: {
              label: {
                backgroundColor: 'red',
                borderRadius: width * 0.5,
                height: height * 0.1,
                width: height * 0.1,
                textAlign: 'center',
                color: '#fff',
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: height * 0.05,
                marginLeft: -height * 0.05
              }
            }
          },
          top: {
            title: '✔',
            style: {
              label: {
                backgroundColor: 'green',
                borderRadius: width * 0.5,
                height: height * 0.1,
                width: height * 0.1,
                textAlign: 'center',
                color: '#fff',
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: height * 0.05,
                marginLeft: height * 0.05
              }
            }
          },
        }}
      />
    </View>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    alignSelf: 'center',
    width: width * 0.95,
    height: height * 0.99,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#fff'
  },
  cardImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
});

// Export app component
export default App;