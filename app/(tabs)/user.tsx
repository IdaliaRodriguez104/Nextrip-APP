import { View, Text, Pressable } from "react-native";

import { StyleSheet } from "react-native";
        import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";

import { useRef, useState } from "react";
export default function SelectType() {

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  const [rating, setRating] = useState(0);
  
  
 
const [hover, setHover] = useState(0);


  
  
  

const scale = useRef(new Animated.Value(1)).current;

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

  const types = ["Playa", "Montaña", "Restaurante", "Parque"];

  return (
    <View style={styles.container}>

  <Pressable
    style={styles.selectButton}
    onPress={() => setOpen(!open)}
  >
    <Text style={styles.selectText}>
      {type || "Seleccionar tipo"}
    </Text>
  </Pressable>

  {open && (
    <View style={styles.menu}>
      {types.map((item) => (
        <Pressable
          key={item}
          style={styles.option}
          onPress={() => {
            setType(item);
            setOpen(false);
          }}
        >
          <Text style={styles.optionText}>{item}</Text>
        </Pressable>
      ))}
      <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
        >

          <Picker.Item label="Seleccionar tipo" value="" />
          <Picker.Item label="Playa" value="Playa" />
          <Picker.Item label="Montaña" value="Montaña" />
          <Picker.Item label="Restaurante" value="Restaurante" />
          <Picker.Item label="Parque" value="Parque" />

        </Picker>
    </View>
  )}
<View style={styles.ratingContainer}>
  {[1,2,3,4,5].map((item) => (
    <Pressable key={item} onPress={() => setRating(item)}>
      <MaterialIcons
        name={item <= rating ? "star" : "star-border"}
        size={32}
        color="#FFD700"
      />
    </Pressable>
  ))}
</View>
<View style={{ flexDirection: "row" }}>
  {[1,2,3,4,5].map((item) => (
    <Pressable
      key={item}
      onPress={() => {
        setRating(item);
        animateStar();
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcons
          name={item <= rating ? "star" : "star-border"}
          size={35}
          color="#FFD700"
        />
      </Animated.View>
    </Pressable>
  ))}
</View>
<Text style={{marginLeft:8}}>
  {rating} / 5
</Text>
<View style={{ flexDirection: "row" }}>
  {[1,2,3,4,5].map((item) => (
    <Pressable
      key={item}
      onPress={() => setRating(item)}
      onHoverIn={() => setHover(item)}
      onHoverOut={() => setHover(0)}
    >
      <MaterialIcons
        name={item <= (hover || rating) ? "star" : "star-border"}
        size={35}
        color="#FFD700"
      />
    </Pressable>
  ))}
</View>
</View>
  );
}


const styles = StyleSheet.create({

  // Contenedor general
  container: {
    marginVertical: 10,
    width: "100%",
  },
  ratingContainer:{
  flexDirection:"row",
  marginTop:5
},

  // Botón principal del select
  selectButton: {
    borderWidth: 1,
    borderColor: "#b4b4b4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  // Texto del botón
  selectText: {
    fontSize: 16,
    color: "#333",
  },

  // Contenedor del menú desplegable
  menu: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  // Cada opción del menú
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  // Texto de cada opción
  optionText: {
    fontSize: 16,
    color: "#444",
  },

});