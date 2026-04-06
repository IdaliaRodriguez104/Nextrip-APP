import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function UserScreen() {
  interface Place {
    id: string;
    name: string;
    description: string;
    image: any;
    type: string;
    rating: number;
  }

  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
  };
  const [placesFavorites, setPlacesFavorites] = useState<Place[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    const db = getDatabase();
    const FavRef = ref(db, `/favorites/${userId}`);
    const unsubscribe = onValue(FavRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPlacesFavorites(list);
      } else {
        setPlacesFavorites([]);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const toggleFavorite = (id: string) => {
    const db = getDatabase();
    const favRefPlace = ref(db, `/favorites/${userId}/${id}`);

    if (placesFavorites) {
      remove(favRefPlace);
      showMessage("Eliminado de favoritos");
    }
  };

  return (
    <ScrollView>
      <View style={styles.box}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtile}>lugares favoritos</Text>
      </View>
      {placesFavorites.map((place) => (
        <View key={place.id}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: `../places/${place.id}`,
                params: { id: place.id },
              })
            }
          >
            <View style={styles.container}>
              <Image
                source={place.image}
                style={styles.image}
                contentFit="cover"
              />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{place.name}</Text>
                <Text
                  style={styles.descriptionText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {place.description}
                </Text>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#dbeafe",
                        borderRadius: 30,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}
                    >
                      <MaterialIcons name="star" size={24} color="#FFD700" />
                      <Text>{place.rating}</Text>
                    </View>
                    <View style={styles.favorite}>
                      <Pressable onPress={() => toggleFavorite(place.id)}>
                        <MaterialIcons
                          name="favorite"
                          size={28}
                          color="#ff2b2b"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#2b7fff",
    width: "100%",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#888282",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 8,
  },
  subtile: {
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 20,
    marginBottom: 20,
    opacity: 0.7,
  },
  image: {
    height: "100%",
    width: 130,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 10,

    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    // sombra suave moderna
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  textContainer: {
    padding: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    opacity: 0.7,
    textAlign: "justify",
  },
  favorite: {
    backgroundColor: "#e7f3f5",
    borderRadius: 100,
    padding: 12,
  },
});
