
import {Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Animated } from "react-native";
import { useRef } from "react";
import { getDatabase, push, ref, set } from "firebase/database";

import Svg, { Rect } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";


export default function UserScreen() {
  //Variables
  const [open, setOpen] = useState(false);
  //Variables para el modal de agregar categoria
  const [openSelect, setOpenSelect] = useState(false);
  //Animaciones para el modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  //Variables de la BD
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubication, setUbication] = useState("");
  const [image, setImage] = useState<String | null| any>(null);
  //Tipos de categorias
  const types = ["Selecciona una categoría", "Monumento","Histórico","Playa", "Montana", "Naturaleza","Restaurante", "Parque", "Museo", "Otro"];
  const [rating, setRating] = useState(0);
  //Animacion de las estrellas
  const scale = useRef(new Animated.Value(1)).current;

  //Funcion para mostrar mensajes
  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg); 
  }

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
  //Funcion para abrir el menu
  const openMenu = () => {
  setOpen(true);

  Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  //Funcion para cerrar el menu
  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  //Funcion para obtener el texto de la calificacion
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

  //Funcion para agregar lugar en la BD
  const addPlace = async () => {
    try {

      const db = getDatabase();

      const newPlaceRef = push(ref(db, "places"));
      if (type === "Selecciona una categoría") {
        return showMessage("Selecciona una categoría");
      }
      if (!name || !type || !descripcion || !ubication || !rating) {
        return showMessage("Todos los campos son obligatorios");
      }
      await set(newPlaceRef, {
        name,
        type,
        descripcion,
        ubication,
        rating,
        image,
      });

      setName("");
      setType("");
      setDescripcion("");
      setUbication("");
      setRating(0);
      setImage(null);

      showMessage("Lugar agregado correctamente");

    } catch (error:any) {
      showMessage(error.message);
    }
  };


  //Funcion para seleccionar imagen
 
  const pickImage = async () => {

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4,3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
  };
    return(
        <ScrollView style={styles.background}>
          <View style={styles.container}>
            {
            <View style={styles.Image}>
                    <Image
                    source={require("../../assets/images/add_a_photo_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={{width:70, height:70}}
                    />
              </View>
            }

                  <Text style={styles.title}>
                    Bienvenido Comparte tu experiencia
                  </Text>
                  <Text style={styles.subtitle}>
                    Comparte tus experiencias con el mundo
                  </Text>
          </View>

          <View style={styles.addContent}>
            <Text style={styles.label}>Foto principal *</Text>
            <View style={styles.containerUpload}>
                <View style={styles.imagenMain}>
                  
                  <Svg style={styles.svgBorder}><Rect x="2" y="1" width="99%" height="99%" fill="none" stroke="#b4b4b4" strokeWidth="2" strokeDasharray={"8,4"} rx={"16"} />
                  </Svg>

                  <Pressable style={styles.pressableUpload} onPress={pickImage}>

                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={styles.imageNew}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../../assets/images/upload_100dp_666666_FILL0_wght400_GRAD0_opsz48.png")}
                          style={styles.imageUpload}
                        />

                        <View>
                          <Text style={styles.textUpload}>Subir imagen</Text>
                          <Text style={styles.textUpload2}>
                            Toca para seleccionar una imagen
                          </Text>
                        </View>
                      </>
                    )}

                  </Pressable>                               
                </View>
            </View>
              <View >
                    <Text style={styles.label}>Nombre del lugar *</Text>
                    <TextInput style={styles.inputLabelName} value={name} placeholderTextColor="#5c5b5b" placeholder="Ej: Playa Paraíso, Torre Eiffel..." onChangeText={setName}/>
                  </View>
                <View>
                
                <Text style={styles.label}>Tipo *</Text>
                <Pressable style={styles.selectButton}
                  onPress={() => 
                        setOpenSelect(!openSelect)}>
                          <View style={styles.selectContent}>
                             <Text style={styles.selectText}>
                                {type || "Selecciona una categoría"}
                              </Text>
                          <MaterialIcons name="arrow-drop-down" size={22} color={"#5c5b5b"} />
                          </View>
                  
                </Pressable>
                {openSelect && (
                  <View style={styles.menu}>
                      {types.map((item) => (
                        <Pressable 
                          key={item} 
                          style={styles.optionPressable} 
                          onPress={() => { 
                            
                                  setType(item); 
                                  setOpenSelect(false); 
                        }}>
                        <Text style={styles.optionText}>{item}</Text>

                        </Pressable>
                      ))}
                  </View>                  
                )}
              </View>
              <View >
                <Text style={styles.label}>Descripcion *</Text>
                <TextInput style={styles.inputDescription} value={descripcion} onChangeText={setDescripcion}  placeholderTextColor="#5c5b5b" multiline={true} numberOfLines={4} textAlignVertical="top" placeholder="Comparte tu experiencia, qué te gustó, consejos para otros viajeros..."/>
              </View>
              <View>
                <Text style={styles.label}>Calificacion *</Text>
                  <View style={styles.inputQualify}>
                    <View style={styles.starRow}>
                      {[1,2,3,4,5].map((item) => (
                      <Pressable key={item}  onPress={() =>{
                        setRating((item));
                        animateStar();
                      }}>
                        <Animated.View style={{transform:[{scale: scale}]}}>
                          <MaterialIcons name={item <= rating ? "star" : "star-border"}
                          size={30}
                          color={"#f5c700"}/>
                        </Animated.View>
                      </Pressable>
                    ))}
                    </View>
                    
                    <View>
                      <Text style={styles.ratingText}>{getRatingText()}</Text>
                    </View>
                </View>
                
              </View>
                
              <View>
                <Text style={styles.label}>Ubicación *</Text>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("../../assets/images/add_location_alt_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={styles.inputIcon}
                  />
                  <TextInput placeholder="Ciudad, Pais"style={styles.input} placeholderTextColor="#5c5b5b" underlineColorAndroid={"#8f101000"} value={ubication} onChangeText={setUbication} />
                </View>
              </View>
              
              <View style={styles.attach}>
                <Image
                  source={require("../../assets/images/attach_file_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                  style={styles.inputIcon}
                />
              
              <Pressable style={styles.button} onPress={pickImage}>
                <Text>Adjuntar más imagenes (opcional)</Text>
              </Pressable>

              {open && (
                <Pressable style={styles.overlayFull} onPress={closeMenu}>
                  <Animated.View
                    style={[
                      styles.dropdown,
                      {
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Pressable onPress={closeMenu}>
                      <Text style={styles.option}>Camara</Text>
                    </Pressable>

                    <Pressable onPress={() => {
                      pickImage();
                      closeMenu();
                    }}>
                      <Text style={styles.option}>Fotos</Text>
                    </Pressable>
                  </Animated.View>
                </Pressable>
              )}
              <View >
                
              </View>
              </View>
              
            <Pressable style={styles.btnadd} onPress={addPlace}>
              <Text style={styles.txtBtnAdd}>Agregar</Text>
            </Pressable>
              
          </View>
          
        </ScrollView>
    );

}

const styles = StyleSheet.create({
  containerUpload:{
  backgroundColor: "#ffffff",
  padding: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#ebe8e8",
  marginBottom: "4%"
  },
  pressableUpload:{
  justifyContent:"center",
  alignItems:"center",
  width:"100%",
  height:"100%"
  },
  title:{
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
    color: "#ffffff",
    marginLeft: 10,
  },
  subtitle:{
    fontSize: 13,
    color: "#ffffff",
    opacity: 0.6,
    marginLeft: 10,
  },
  imagenMain:{
    height:180,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f5",
    borderRadius: 16,

  },
  textUpload: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#3a3a3a",
    opacity: 0.8,
  },
  textUpload2: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#646464",
    opacity: 0.8,
  },
  imageUpload: {
    height: 60,
    width: 60,
    opacity: 0.7,
  },
  svgBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    },
  imageNew: {
    width: "98%",
    height: "98%", // mantiene proporción cuadrada
    borderRadius: 16,
    alignSelf: "center",
  },
  background:{
    backgroundColor: "#297cff",
  },
  inputContainer:{
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#E6EEF5',
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
  },
  inputQualify:{


  borderWidth: 1,
  height: 90,
  borderColor: '#E6EEF5',
  borderRadius: 16,
  padding: 10,
  backgroundColor: "#fff",
  elevation: 5,
  alignItems: "center",
  justifyContent: "center"
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  ratingText:{
    textAlign: "center",
    marginLeft: 12,
    fontSize: 16,
    color: "#3a3a3a",
    opacity: 0.9,
  },
  btnadd:{
    marginTop: "5%",
    marginBottom: "16%",
    backgroundColor: "#297cff",
    borderRadius: 10,
    padding: 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  txtBtnAdd: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  containerSelect: {
    marginVertical: 10,
    width: "100%",
  },


  selectButton: {
    borderWidth: 1,
    borderColor: "#cccccc00",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectContent:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectText: {
    fontSize: 15,
    color: "#6c7474",
    
  },


  menu: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#79787849",
    borderRadius: 10,
    backgroundColor: "#ffffffb7",
    overflow: "hidden",

  },


  optionPressable: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#bebbbb49",
    
  },


  optionText: {
    fontSize: 14.5,
    color: "#444",
  },
  inputIcon:{
    width:24,
    height:24,
    marginRight:8
  },

  input:{
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#2c445800',
    paddingVertical: 0,
    color: '#2b2c2c',
    minWidth: 300, 
  },
  label:{
    fontSize: 14,
    fontWeight: '600',
    color: '#2b2c2c',
    marginBottom: 5,
    marginTop: 7
  },
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    backgroundColor: "#297cff", 
    marginBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  addContent: {
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  icon: {
    width: 30,
    aspectRatio: 1,
  },
  button:{
    alignItems:"center",
    justifyContent: "center",
    padding:10,
  },
  Image: {
    alignItems:"center",
    justifyContent: "center",
    backgroundColor: '#ffffff',
    borderRadius: "100%",
    width: "40%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  row:{
    flexDirection: "row",
    alignItems: "center",
    gap: 10

  },
  inputLabel:{
    borderWidth: 1,
    borderColor: '#e6eef500',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    height: 45,
    minWidth: 310,
    color: '#2b2c2c',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputLabelName:{
    backgroundColor: "#fff",
    borderColor: '#e6eef500',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    height: 45,
    minWidth: 310,
    color: '#2b2c2c',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputDescription:{
    borderWidth: 1,
    borderColor: "#cccccc00",
    borderRadius: 10,
    padding: 12,
    height: 120,
    fontSize: 14,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modal:{
    backgroundColor:"rgba(0, 0, 0, 0)",
    },
  overlayFull:{
    position:"absolute",
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:"transparent",
    zIndex:10
  },
  dropdown:{
    position:"absolute",
    bottom:"1%",
    left:"120%",
    width:160,
    backgroundColor:"#fff",
    borderRadius:10,
    padding:10,
    elevation:5,
    shadowColor:"#000",
    shadowOpacity:0.2,
    shadowRadius:4
  },

  option:{
    padding:10
  },
  attach:{
    flexDirection: "row",
    height: "9%",
    backgroundColor: "#ffffff",
    marginTop: 10,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    color: '#2b2c2c',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EEF5',
    
   
    
  },

  
});