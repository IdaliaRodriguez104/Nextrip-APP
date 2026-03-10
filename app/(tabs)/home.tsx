import { ThemedText } from '@/components/themed-text';
import { Text } from '@react-navigation/elements';
import { Image } from 'expo-image';
import { StyleSheet, ScrollView, View, TextInput } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import StarRating from 'react-native-star-rating-widget';
import { ThemeContext } from '@react-navigation/native';

interface Place {
  id: string;
  name: string;
  description: string;
  img: any;
  type: string;
  ranting: number;
}
export default function HomeScreen() {
  const [places, setPlaces] = useState<Place[]>([]);

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
  return () =>unsubscribe();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      
    <View>
      <View style={styles.searchbox}>
        <Text style={styles.titleSearch}>Explorar Lugares</Text>
        <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#3d3d3d" style={{ marginRight: 6}} />
        <TextInput
          placeholder="Buscar destinos..."
          style={styles.inputSearch}
          placeholderTextColor="#3d3d3d"
          underlineColorAndroid={"#8f101000"}
        />
        </View>
      </View>
    </View>
    {places.length === 0 &&<View style={styles.EmptyResults}>
       <Text style={styles.noplacestext}>NOT FOUND</Text> 
      <Image
        source={require("../../assets/images/android_wifi_4_bar_off_600dp_666666_FILL0_wght400_GRAD0_opsz48.png")}
        style={styles.emptyImage}
        />
    </View>}
    <Text style={styles.titleContent}>Destinos Populares</Text>
    <View>
      
      {places.map((places) => (
          <View key={places.id} style={styles.containerPlaces}>
            <Image source={{ uri: places.img }} style={styles.img}/>
            <ThemedText style={styles.name}>{places.name}</ThemedText>
            <ThemedText style={styles.description}>{places.description}</ThemedText>
            <ThemedText style={styles.type}>{places.type}</ThemedText>
            <ThemedText style={styles.star}>
               <MaterialIcons
                name="star"
                size={20}
                color="#FFD700"
                style={{ marginRight: 5 }}
              />
              {Number(places.ranting)}
            </ThemedText>
          </View>
      )) }
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchbox :{
    backgroundColor: '#2b7fff',
    width:"100%",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#888282",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  titleContent: {
    fontSize: 19,
    fontWeight: '600',
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
  },
  star:{
    position:"absolute",
    display: "flex",
    alignItems: "center",
    top: 9,
    right: 9, 
    backgroundColor: "#ddecfa",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 20, 
    paddingVertical: 3,
  },
  containerPlaces: {
    justifyContent: "center",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    shadowColor: "#b3afaf",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    marginBottom: 20,
    
  },
  img:{
    width: "100%",
    height: 180, // mantiene proporción cuadrada
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  type:{
    backgroundColor: "#dbeafe",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 20,
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
  name:{
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    marginLeft: 10,
  },
  titleSearch: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 20
  },
  inputSearch:{
    flex: 1,
    height: "100%",
    borderWidth: 1,
    borderColor: '#2c445800',
    paddingVertical: 0,
    color: '#2b2c2c',
    minWidth: 300, 
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
    marginTop: 20
  },
  noplacestext: {
    fontSize: 20,
    fontWeight: '800',
    color: '#666666',
    marginTop: 30,
    marginBottom: 20
  },
  emptyImage: {
    width: "60%",   // ocupa 60% del contenedor
    aspectRatio: 1, // mantiene proporción cuadrada
    resizeMode: "contain"

  }
  
});
