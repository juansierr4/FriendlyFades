import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#800000',
      padding: 5,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#800000',
      padding: 20,
    },
    card: {
      alignSelf: 'center',
      width: width, // Increase width to take up more screen space
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
      fontSize: 20,
      fontFamily: 'Impact',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    detailsText: {
      fontSize: 20,
      fontFamily: 'Impact',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    detailText: {
      fontFamily: 'Impact',
      fontSize: 24,
      fontWeight: 'normal',
      color: 'black',
      textAlign: 'left',
      left: 25,
      marginVertical: 0, // Reduce or adjust as needed
      paddingHorizontal: 0, // Adjust if necessary
    },
    termstext: {
      fontSize: 20,
      fontFamily: 'Times New Roman',
      color: 'white',
      textAlign: 'left',
    },
    heading: {
      fontSize: 24,
      fontFamily: 'Times New Roman',
      color: 'white',
      alignSelf: 'left',
    },
    title: {
      fontFamily: 'Impact',
      fontSize: 36,
      fontWeight: 'bold',
      color: '#rgba(255, 255, 255, 1)',
      marginBottom: 80,
    },
    smalltitle: {
      fontFamily: 'Impact',
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
      marginBottom: 200,
      left: 20,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      resizeMode: 'cover',
    },
    conversation: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff50', // Soft white for separation lines
    },
    name: {
      color: '#fff',
      fontFamily:'Impact',
      fontWeight: 'bold',
      fontSize: 18,
    },
    nameText: {
        fontSize: 20,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'left',
        left:20,
    },
    modalView: {
      height: 800,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    messageContainer: {
      width: '100%',
      paddingHorizontal: 10, // Adjust padding as needed
      flexDirection: 'row',
      justifyContent: 'flex-start', // Align items to start; adjust based on your design
    },
    messageBubble: {
      width: '100%',
      backgroundColor: '#f0f0f0', // A light grey background for the bubble
      borderRadius: 15, // Rounded corners for a softer look
      paddingVertical: 10, // Vertical padding to encase the text comfortably
      paddingHorizontal: 15, // Horizontal padding for the same reason
      marginVertical: 5, // Slight margin to separate consecutive messages
      shadowColor: "#000", // Shadow for a subtle depth effect
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    messageText: {
      color: '#333333', // Dark color for text for better readability
      fontSize: 16, // Slightly larger font for easy reading
      lineHeight: 24, // Adequate line height to improve readability
    },
    messageBubbleOutgoing: {
      width: '100%',
      borderRadius: 15, // Rounded corners for a softer look
      paddingVertical: 10, // Vertical padding to encase the text comfortably
      paddingHorizontal: 15, // Horizontal padding for the same reason
      marginVertical: 5, // Slight margin to separate consecutive messages
      shadowColor: "#000", // Shadow for a subtle depth effect
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      backgroundColor: '#0078FF', // A distinct color for outgoing messages
      color: '#ffffff', // Light color text for contrast against the bubble color
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
      width: width * 0.8, // Adjust width to be 80% of the screen width
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 20, // Increase bottom margin for better spacing
      borderRadius: 5,
      alignSelf: 'center', // Ensure this element is centered
      color: '#222222',
    },
    chatinput: {
      width: width * 0.8, // Adjust width to be 80% of the screen width
      borderColor: '#800000',
      borderWidth: 2, // Increase border width for better visibility
      padding: 15,
      marginBottom: 20, // Increase bottom margin for better spacing
      borderRadius: 5,
      alignSelf: 'center', // Ensure this element is centered
      color: '#222222',
      backgroundColor: '#fff',
    },
    importantinput: {
      width: width * 0.8, // Adjust width to be 80% of the screen width
      backgroundColor: '#fff',
      padding: 15,
      marginBottom: 20,
      borderRadius: 5,
      alignSelf: 'center', // Ensure this element is centered
      color: '#333',
    },
    accessory:{
      flex: 1,
    },
    profileContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#800000',
    },
    profileImage: {
      width: '50%',
      height: '40%',
      borderRadius: 40,
      alignSelf: 'center',
      marginBottom: 0,
    },
    bioText: {
        fontSize: 20,
        fontFamily: 'Impact',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    profileImageContainer: {
      flex: 1,
      justifyContent: 'flex-start', // Align items to the top
      padding: 20, // Adjust as needed
      margin: 0, // Ensure no extra margin  
    },
    editImageButton: {
      position: 'absolute',
      borderRadius: 20,   
      left:20, 
  },
    editIcon: {
      width: 40, // Adjust based on your icon size
      height: 40, // Adjust based on your icon size
      borderRadius: 10,   
  },
    button: {
      backgroundColor: '#9e2a2b',
      padding: 15,
      borderRadius: 15,
      width: '80%',
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    datenextbutton: {
      position: 'absolute', // Position the button absolutely...
      left: 20,             // ...from the left edge of the container
      right: 0,            // ...and from the right edge to stretch across
      bottom: 0,           // ...and from the bottom edge of the container
      backgroundColor: '#9e2a2b',
      padding: 15,
      borderRadius: 15,
      width: '100%',       // The button will stretch across the bottom
      alignItems: 'center',
      justifyContent: 'center', // Center the text inside the button
      marginBottom: 20, // Add space between the button and the pickers if needed
    },
    messagesButton: {
      backgroundColor: '#9e2a2b',
      color: 'white',
      padding: 15,
      borderRadius: 15,
      width: '40%',       // The button will stretch across the bottom
      justifyContent: 'center', // Center the text inside the button
      marginTop: 5, // Add space between the button and the pickers if needed
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
    pickerContainer: {
      flexDirection: 'row', // Arranges children side by side
      justifyContent: 'center', // Evenly spaces children
      alignItems: 'center',
      width: width, // Takes up the full width
      paddingHorizontal: 20, // Optional padding for aesthetics
    },
    picker: {
      flex: 1,
      height: 20,
      width: '100%',
    },
    heightpicker: {
      top: 100,
      flex: 1,
      height: 20,    
      width: '100%',
    },
    datepicker: {
      flex: 1,
      height: 50,
      width: '30%',
    },
    yearpicker: {
      flex: 1,
      height: 50,
      width: '40%',
    },
    genderLabel: {
      fontSize: 24, // Adjust font size as needed
      color: 'white', // Ensure label is visible against the background
      top: 150, // Adjust the top position to shift down
      alignSelf: 'center', // Centers in the parent container  
      marginBottom:100
    },
    pickerAndLabelContainer: {
      width: '80%', // Adjust to control picker width
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#800000', // Ensures consistent background color
      marginBottom: 20, // Ensures spacing from the Next button
      height: 50,
    },
    weightpicker: {
      flexGrow: 1, // Allows the picker to grow while leaving space for the label
      marginRight: 10,
    },
    weightLabel: {
      fontSize: 24, // Adjust font size as needed
      color: 'white',
    },
    pickerLabel: {
      marginRight: 10, // Adjust spacing as needed
      fontSize: 24, // Adjust font size as needed
      color: 'white', // Ensure label is visible against the background
      top: 40, // Adjust the top position to shift down
      alignSelf: 'center', // Centers in the parent container    
    },


    goPremiumContainer: {
      backgroundColor: '#800000', // Maroon background
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
    goPremiumTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      marginStart:10,
    },
    goPremiumText: {
      color: '#FFFFFF',
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 5,
    },
    goPremiumBenefit: {
      color: '#FFFFFF',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 5,
    },
    goPremiumButton: {
      marginTop: 20,
      backgroundColor: '#FFFFFF', // White button for contrast
      padding: 15,
      borderRadius: 25,
      width: '80%',
      alignItems: 'center',
    },
    goPremiumButtonText: {
      color: '#800000', // Text color maroon to match the theme
      fontSize: 18,
      fontWeight: 'bold',
    },
    moreOptionsButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 8,
      borderRadius: 15,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    moreOptionsText: {
      color: 'gray',
      fontSize: 20,
    },
    matchedModalView: {
      height: 400,
      width: 400,
      margin: 20,
      backgroundColor: "#800000",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },

  });

  
