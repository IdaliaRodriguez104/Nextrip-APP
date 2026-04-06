import { ThemedText } from "@/components/themed-text";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, Animated, PanResponder } from "react-native";

interface Place {
  id: string;
  name: string;
  description: string;
  image: any;
  type: string;
  rating: number;
}
export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState<string>("");
  const [id, setId] = useState<string>("");

  const clearInput = () => {
    setSearch("");
  };
  const showMessage = (msg: string) => {Platform.OS === "web" ? alert(msg) : Alert.alert(msg);}
  const filteredPlaces = places
    .filter((place) =>
      place.name.toLowerCase().includes(search.toLowerCase()) || place.type.toLowerCase().includes(search.toLowerCase())
  );

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),

     onPanResponderRelease: () => {}
    })
  ).current;
  
  useEffect(() => {
    const db = getDatabase();
    const unidadesRef = ref(db, "/places");
    const unsubscribe = onValue(unidadesRef, (snapshot) => {
    const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPlaces(list);
      } else {
        setPlaces([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1}}>
    
      <ScrollView style={{ flex: 1}}>
        
        <View>
          <View style={styles.searchbox}>
            <Text style={styles.titleSearch}>Explorar Lugares</Text>
            <View style={styles.searchContainer}>
              <MaterialIcons
                name="search"
                size={22}
                color="#3d3d3d"
                style={{ marginRight: 6 }}
              />
              <TextInput
                placeholder="Buscar destinos por nombre o tipo"
                style={styles.inputSearch}
                placeholderTextColor="#3d3d3d"
                underlineColorAndroid={"#8f101000"}
                value={search}
                onChangeText={setSearch}
              />
              <Pressable onPress={clearInput} style={{opacity: 0.7}}>
                <MaterialIcons
                  name="clear"
                  size={22}
                  color="#3d3d3d"
                  style={{ marginRight: 6 }}
              />
              </Pressable>
              
            </View>
          </View>
        </View>
        {places.length === 0 && (
          <View style={styles.EmptyResults}>
            <Text style={styles.noplacestext}>NOT FOUND</Text>
            <Image
              source={require("../../assets/images/android_wifi_4_bar_off_600dp_666666_FILL0_wght400_GRAD0_opsz48.png")}
              style={styles.emptyImage}
            />
          </View>
        )}
        {search.length > 0 ? (

          <View>
            <Text style={styles.titleContent}>Resultados para: {search}</Text>

            {filteredPlaces.map((places) => (
              <View key={places.id} style={styles.shadowContainer}>
                <Pressable onPress={()=> router.push({
                pathname: `../places/${places.id}`,
                params: {id: places.id}})}>
                <Image source={{ uri: places.image }} style={styles.img} />
                <ThemedText style={styles.star}>
                    <MaterialIcons
                      name="star"
                      size={20}
                      color="#FFD700"
                      style={{ marginRight: 5 }}
                    />
                    {Number(places.rating)}
                  </ThemedText>
                <View style={styles.containerPlaces}>
                  <ThemedText style={styles.name}>{places.name}</ThemedText>
                  <ThemedText style={styles.description} numberOfLines={3} ellipsizeMode="tail" >
                    {places.description}
                  </ThemedText>
                  <ThemedText style={styles.type}>{places.type}</ThemedText>

                </View>
                </Pressable>
              </View>
            ))}
        </View>
        ) : (
        
        
        <View>
          <Text style={styles.titleContent}>Destinos Populares</Text>
          {places.map((places) => (
            <View key={places.id} style={styles.shadowContainer}>
              <Pressable onPress={()=> router.push({
                pathname: `../places/${places.id}`,
                params: {id: places.id}})}>
              <Image source={{ uri: places.image }} style={styles.img} />
              <ThemedText style={styles.star}>
                  <MaterialIcons
                    name="star"
                    size={20}
                    color="#FFD700"
                    style={{ marginRight: 5 }}
                  />
                  {Number(places.rating)}
                </ThemedText>
              <View style={styles.containerPlaces}>
                <ThemedText style={styles.name}>{places.name}</ThemedText>
                <ThemedText style={styles.description} numberOfLines={3} ellipsizeMode="tail" >
                  {places.description}
                </ThemedText>
                <ThemedText style={styles.type}>{places.type}</ThemedText>
              </View>
              </Pressable>
            </View>
          ))}
        </View>
        )}
        
      </ScrollView>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.button,
          {
            transform: pan.getTranslateTransform()
          }
        ]}
      >
        <Pressable onPress={() => router.push("../messages/chats")} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chat" size={20} color="#fff" style={{ marginRight: 5 }} />
          <Text style={{ color: "#fff" }}>Chat</Text>
        </Pressable>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  searchbox: {
    backgroundColor: "#2b7fff",
    width: "100%",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#888282",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#2B7FFF",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  titleContent: {
    fontSize: 19,
    fontWeight: "600",
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
  },
  star: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    top: 8,
    right: 8,
    backgroundColor: "#ddecfa",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 20,
    paddingVertical: 3,
  },
  shadowContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#7e7d7d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderRadius: 12,
  },

  containerPlaces: {
    backgroundColor: "#fff",
    borderBottomLeftRadius:12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: "#e7e7e7",

  },
  img: {
    width: "100%",
    height: 180, // mantiene proporción cuadrada
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  type: {
    backgroundColor: "#dbeafe",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    color: "#155dfc",
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: "#6d6d6d",
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginLeft: 10,
  },
  titleSearch: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  inputSearch: {
    flex: 1,
    height: "100%",
    borderWidth: 1,
    borderColor: "#2c445800",
    paddingVertical: 0,
    color: "#2b2c2c",
    minWidth: 260,
  },
  searchContainer: {
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    elevation: 5,
    borderBlockColor: "#8f101000",
  },
  EmptyResults: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    backgroundColor: "#c8d7ee",
    borderRadius: 20,
    color: "#ffffff",
    marginTop: 20,
  },
  noplacestext: {
    fontSize: 20,
    fontWeight: "800",
    color: "#666666",
    marginTop: 30,
    marginBottom: 20,
  },
  emptyImage: {
    width: "60%", // ocupa 60% del contenedor
    aspectRatio: 1, // mantiene proporción cuadrada
    resizeMode: "contain",
  },
});
