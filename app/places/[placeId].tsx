import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";


export default function PlaceDetails() {
  interface Place {
    name: string;
    description: string;
    image: any;
    type: string;
    rating: number;
    ubication: string;
    ownUid: string;
  }
  interface User {
    uid: string;
    names: string;
    email: string;
    description: string;
    image: any;
  }
  interface Review {
    id: string;
    names: string;
    email: string;
    review: string;
    image: any;
    date: string;
    rating: number;
  }
  const [userData, setUserData] = useState<User | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const scale = useRef(new Animated.Value(1)).current;
  //Funcion para animar las estrellas
  const animateStar = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Malo";
      case 2:
        return "Regular";
      case 3:
        return "Bueno";
      case 4:
        return "Muy bueno";
      case 5:
        return "Excelente";
      default:
        return "";
    }
  };
  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
  };
  const { id } = useLocalSearchParams();
  const [places, setPlaces] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState("");

  const generarChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join("_");
  };

  useEffect(() => {
    if (!id) return;

    const db = getDatabase();
    const placeRef = ref(db, `/places/${id}`);
    const unsubscribePlace = onValue(placeRef, (snapshot) => {
      const data = snapshot.val();
      setPlaces(data ? { id: id as string, ...data } : null);
    });
    const favRef = ref(db, `/favorites/${userId}/${id}`);
    const unsubscribeFav = onValue(favRef, (snapshot) => {
      setIsFavorite(snapshot.exists());
    });

    const UserRef = ref(db, `/users/${userId}`);
    const unsubscribeUsers = onValue(UserRef, (snapshot) => {
      const data = snapshot.val();
      setUserData(data ? { uid: userId as string, ...data } : null);
    });

    const reviewRef = ref(db, `/places/${id}/reviews`);
    const unsubscribeReviews = onValue(reviewRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setReviews(list);
      } else {
        setReviews([]);
      }
    });
    return () => {
      unsubscribePlace();
      unsubscribeFav();
      unsubscribeUsers();
      unsubscribeReviews();
    };
  }, [id]);

  const pushReview = async () => {
    if (!review || rating === 0) {
      showMessage("Error, Completa la reseña y la calificación");
      return;
    }

    const db = getDatabase();
    const reviewRef = ref(db, `/places/${id}/reviews`);
    try {
      await push(reviewRef, {
        names: userData?.names,
        email: userData?.email,
        image: userData?.image,
        review: review,
        date: new Date().toISOString(),
        rating: rating,
      });
      console.log(userData?.names);
      console.log(userData?.email);
      console.log(userData?.image);
      console.log(rating);

      setReview("");
      setRating(0);
      setOpen(false);
    } catch (error) {
      showMessage("Error no se pudo publicar la reseña");
      showMessage(String(error));
    }
  };

  const toggleFavorite = () => {
    if (!id || !places) return;

    const db = getDatabase();
    const favRef = ref(db, `/favorites/${userId}/${id}`);

    if (isFavorite) {
      remove(favRef);
      showMessage("Eliminado de favoritos");
    } else {
      set(favRef, places);
      showMessage("Agregado a favoritos");
    }
  };

  if (!places) {
    return (
      <View>
        <Text>Cargando.....</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{ marginTop: 35}}>
        <View>
          <Image
            source={places.image}
            style={styles.Image}
            contentFit="cover"
          />
          <View style={styles.back}>
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <MaterialIcons name="arrow-back" size={24} />
            </Pressable>
          </View>
          <View style={styles.favorite}>
            <Pressable onPress={toggleFavorite}>
              <MaterialIcons
                name={isFavorite ? "favorite" : "favorite-border"}
                size={24}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.Container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.title}>{String(places?.name)}</Text>
            </View>
            <View style={styles.start}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text>{places?.rating}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.type}>{places?.type}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>Acerca de la ubicacion</Text>
            <Text style={styles.description}>{places?.description}</Text>
          </View>
          <View style={styles.containerLocation}>
            <Text style={styles.subTitle}>{}</Text>
            <View
              style={{
                backgroundColor: "#eaebec",
                borderRadius: 10,
                height: 80,
                padding: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.ContainerImage}>
                  <Image
                    source={require("../../assets/images/share_location_100dp_F3F3F5_FILL0_wght400_GRAD0_opsz48.png")}
                    style={styles.IconLocation}
                  />
                </View>
                <View>
                  <Text style={styles.textUbication}>{places?.ubication}</Text>
                  <Pressable>
                    <Text
                      style={{
                        color: "#2b7fff",
                        fontWeight: "600",
                        marginLeft: 12,
                      }}
                    >
                      Ver en Google Maps
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.subTitle}>Reseñas ({reviews?.length})</Text>
            {reviews?.map((review) => (
              <View key={review.id} style={styles.reviewContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{ backgroundColor: "#2b7fff", borderRadius: 100 }}
                  >
                    <Image
                      source={require("../../assets/images/account_circle_100dp_F3F3F5_FILL0_wght400_GRAD0_opsz48.png")}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <View>
                      <Text style={styles.name}>{review.names}</Text>
                      <Text style={styles.date}>{String(review.date)}</Text>
                    </View>
                    <View style={styles.start}>
                      <MaterialIcons name="star" size={24} color="#FFD700" />
                      <Text style={styles.ratingText}>
                        {review.rating ?? "Sin Rating"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Text style={styles.msg}>{review.review}</Text>
                </View>
              </View>
            ))}
          </View>
          <View>
            <Pressable
              style={styles.btnContainer}
              onPress={() => {
                const miUid = auth.currentUser?.uid;
                const otroUid = places?.ownUid;

                if (userId === places?.ownUid) {
                  showMessage("No puedes contactarte contigo mismo");
                  return;
                }
                const chatId = generarChatId(String(miUid), String(otroUid));

                router.push({
                  pathname: `../messages/chat`,
                  params: {
                    chatId,
                    otroUid,
                  },
                });
              }}
            >
              <Text style={styles.btnComent}>Contactar con el propietario</Text>
            </Pressable>
            <Pressable
              style={styles.btnContainer}
              onPress={() => {
                if (!open) setOpen(true);
                else {
                  pushReview();
                }
              }}
            >
              <Text style={styles.btnComent}>
                {open ? "Publicar" : "Comentar"}
              </Text>
            </Pressable>
            <View>
              {open && (
                <View style={styles.containerReview}>
                  <View>
                    <Text style={styles.label}>Reseña *</Text>
                    <TextInput
                      style={styles.inputReview}
                      value={review}
                      onChangeText={setReview}
                      placeholderTextColor="#5c5b5b"
                      multiline={true}
                      numberOfLines={5}
                      textAlignVertical="top"
                      placeholder="Comparte tu experiencia, qué te gustó, consejos para otros viajeros..."
                    />
                  </View>
                  <View>
                    <Text style={styles.label}>Calificacion *</Text>
                    <View style={styles.inputQualify}>
                      <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <Pressable
                            key={item}
                            onPress={() => {
                              setRating(item);
                              animateStar();
                            }}
                          >
                            <Animated.View
                              style={{ transform: [{ scale: scale }] }}
                            >
                              <MaterialIcons
                                name={item <= rating ? "star" : "star-border"}
                                size={30}
                                color={"#f5c700"}
                              />
                            </Animated.View>
                          </Pressable>
                        ))}
                      </View>
                      <View>
                        <Text style={styles.ratingText}>{getRatingText()}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  Container: {
    padding: 20,
  },
  Image: {
    width: "100%",
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  type: {
    backgroundColor: "#dbeafe",
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    color: "#155dfc",
    paddingHorizontal: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },

  description: {
    opacity: 0.7,
    textAlign: "justify",
    marginBottom: 18,
  },
  containerLocation: {
    display: "flex",
    marginBottom: 15,
  },
  IconLocation: {
    height: 30,
    width: 30,
  },
  textUbication: {
    marginLeft: 12,
  },
  reviewContainer: {
    backgroundColor: "ffff",
    borderRadius: 10,
    gap: 10,
    padding: 15,
  },
  date: {
    opacity: 0.7,
    marginLeft: 12,
  },
  msg: {
    opacity: 0.8,
    marginLeft: 63,
    width: "80%",
    textAlign: "justify",
  },
  name: {
    flex: 1,
    marginLeft: 12,
  },
  start: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ContainerImage: {
    backgroundColor: "#2b7fff",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  btnContainer: {
    backgroundColor: "#2b7fff",
    fontWeight: "600",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  btnComent: {
    color: "#ffffff",
    fontWeight: "600",
    padding: 12,
  },
  back: {
    backgroundColor: "#e7f3f5",
    borderRadius: 100,
    padding: 12,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    top: 12,
    left: 12,
  },
  favorite: {
    backgroundColor: "#e7f3f5",
    borderRadius: 100,
    padding: 12,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    top: 12,
    right: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b2c2c",
    marginBottom: 5,
    marginTop: 7,
  },
  inputReview: {
    borderWidth: 1,
    borderColor: "#cccccc00",
    borderRadius: 10,
    padding: 12,
    height: 120,
    fontSize: 14,
  },
  inputQualify: {
    height: 90,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    textAlign: "center",
    marginLeft: 12,
    fontSize: 16,
    color: "#3a3a3a",
    opacity: 0.9,
  },

  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  containerReview: {
    backgroundColor: "#eaebec",
    borderRadius: 10,
    gap: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
});
