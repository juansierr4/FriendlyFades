const HomeScreen = () => {
  const [users, setUsers] = useState([]); // State to store other users' data
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swiperKey, setSwiperKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedUserName, setMatchedUserName] = useState('');
  const [matchedUserImageUrl, setMatchedUserImageUrl] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial fade anim value

  const db = getFirestore();
  const auth = getAuth();

  const requestLocationPermission = async () => {
    let permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (permissionResult === RESULTS.DENIED) {
      permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    return permissionResult === RESULTS.GRANTED;
  };

  const fetchAndStoreUserLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Location Permission', 'Location permission is required to find users near you.');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const geohash = geohashForLocation([latitude, longitude]);
        //assume method to get uid
        const currentUserUid = auth.currentUser.uid;
        //stores location in firebase under user doc
        await setDoc(doc(db, "users", currentUserUid), { location: {latitude, longitude, geohash} }, { merge: true });
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Failed to get your location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
    );
  };

  const fetchUsersData = async () => {
    const { latitude, longitude } = await fetchCurrentUserLocation();
    const currentUserUid = auth.currentUser.uid;
    const swipesRef = collection(db, "swipes");
    const swipesQuery = query(swipesRef, where("swiperId", "==", currentUserUid));
    const swipesSnapshot = await getDocs(swipesQuery);
    const swipesUserIds = swipesSnapshot.docs.map(doc => doc.data().swipedId);

    const radiusInM = 10000;
    const bounds = geohashQueryBounds([latitude, longitude], radiusInM);
    const promises = bounds.map(b => {
      const q = query(collection(db, "users"), orderByd("location.geohash"), startAt(b[0]), endAt(b[1]));
      return getDocs(q);
    });

    const snapshots = await Promise.all(promises);
    let matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const location = doc.data().location;
        const distanceInM = distanceBetween([location.latitude, location.longitude], [latitude, longitude]);
        if (distanceInM <= radiusInM){
          matchingDocs.push({ ...doc.data(), id: doc.id });
        }
      }
    }
    setUsers(matchingDocs.filter(user => !swipedUserId.includes(user.id)));
  };
  
  useEffect(() => {
    fetchAndStoreUserLocation().then(fetchUsersData);
  }, []);
