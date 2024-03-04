import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#800000',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#800000',
    },
    card: {
      alignSelf: 'center',
      width: width * 0.95, // Increase width to take up more screen space
      height: height * 0.80, // Increase height
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
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    detailText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    title: {
      fontFamily: 'Impact',
      fontSize: 36,
      fontWeight: 'bold',
      color: '#rgba(255, 255, 255, 1)',
      marginBottom: 80,
    },
    smalltitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 0,
    },
    tmtitle: {
      fontFamily: 'Impact',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 0,
    },
    tmtitle2: {
      fontFamily: 'Impact',
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 300,
      left: 20,
    },
    privacytitle:{
      fontsize: 12,
      color: '#FFFFFF',
      marginBottom: 15,
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
    tagsContainer: {
      flexDirection: 'row', // Arrange tags in a row
      flexWrap: 'wrap', // Allow wrapping to the next line
      justifyContent: 'center', // Center tags horizontally
      marginTop: 5, // Space from text
    },
    tag: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent tag background
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      margin: 5,
    },
    tagText: {
      color: '#000', // Text color
      fontSize: 12,
    },
    conversation: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff50', // Soft white for separation lines
    },
    name: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    lastMessage: {
      color: '#fff',
      fontSize: 14,
    },
    chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#ffffff50',
      padding: 12,
      backgroundColor: '#800000',
    },
    input: {
      width: '40%',
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
      right: 80,
      color: '#222222',
    },
    importantinput: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        color: '#333',
    },
    profileContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#800000',
    },
    profileImage: {
      width: '80%',
      height: '50%',
      borderRadius: 15,
      marginTop: 20,
    },
    bioText: {
      color: '#fff',
      marginTop: 10,
    },
    button: {
      backgroundColor: '#9e2a2b',
      padding: 15,
      borderRadius: 15,
      width: '80%',
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    switchText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginTop: 20,
    },
    settingsButton: {
      position: 'absolute',
      top: 80,
      right: 10,
      backgroundColor: '#9e2a2b',
      borderRadius: 5,
      padding: 10,
    },
    menuItem: {
      color: 'black',
      padding : 5,
    },
    settingsItem: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dimmed background
    },
    settingsMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    },
    settingsIcon: {
      position: 'absolute',
      top: 20, // Adjust the position as needed
      right: 20,
      padding: 10, // Add padding for easier touch
      zIndex: 1,
    },
    settingsImage: {
      width: 40, // Set the width and height of your icon
      height: 40,
    },
  });
  