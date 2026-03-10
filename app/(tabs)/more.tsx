
import { ThemedView } from "@/components/themed-view";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Animated } from "react-native";
import { useRef } from "react";
import { getDatabase, push, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function UserScreen() {
  
  const [open, setOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg); 
  }
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubication, setUbication] = useState("");
  const [image, setImage] = useState<String | null| any>(null);
  const [ranting, setRanting] = useState("");




  const addPlace = async () => {
    try {

      const db = getDatabase();

      const newPlaceRef = push(ref(db, "places"));

      await set(newPlaceRef, {
        name,
        type,
        descripcion,
        ubication,
        ranting,
        image,
      });

      setName("");
      setType("");
      setDescripcion("");
      setUbication("");
      setRanting("");
      setImage(null);

      showMessage("Lugar agregado correctamente");

    } catch (error:any) {
      showMessage(error.message);
    }
  };



  const openMenu = () => {
  setOpen(true);

  Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  };
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
            <View style={styles.Image}>
                    <Image
                    source={require("../../assets/images/add_a_photo_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={{width:70, height:70}}
                    />
                  </View>

                  <Text style={styles.title}>
                    Bienvenido Comparte tu experiencia
                  </Text>
          </View>

          <View style={styles.addContent}>
               <View >
               
                  {image ? (
                    <View>
                      <Image
                        source={{ uri: image }}
                        style={styles.imageNew}
                      />
                  </View>
                  ) : (
                    <View style={styles.landscape}>
                      <Image
                        source={require("../../assets/images/landscape_2_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                        style={{ width: 70, height: 70}}
                      />
                  </View>
                )}
           
                <View >
                  <Text style={styles.label}>Nombre del lugar</Text>
                  <TextInput style={styles.inputLabel} value={name} onChangeText={setName}/>
                </View>
              </View>
              <View>
                <Text style={styles.label}>Tipo</Text>
                <TextInput style={styles.inputLabel} value={type} onChangeText={setType}/>
              </View>
              <View >
                <Text style={styles.label}>Descripcion</Text>
                <TextInput style={styles.inputLabel} value={descripcion} onChangeText={setDescripcion}/>
              </View>
              <View>
                <Text style={styles.label}>Rating</Text>

                <TextInput
                  style={styles.inputLabel}
                  value={String(ranting)}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(text) => {
                    const num = Number(text);

                    if (num >= 1 && num <= 5) {
                      setRanting(String(num));
                    } else if (text === "") {
                      setRanting("1");
                    }
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../../assets/images/add_location_alt_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                  style={styles.inputIcon}
                />
                <TextInput placeholder="Ubicación..."style={styles.input} placeholderTextColor="#3d3d3d" underlineColorAndroid={"#8f101000"} value={ubication} onChangeText={setUbication} />
              </View>
              <View style={styles.attach}>
                <Image
                  source={require("../../assets/images/attach_file_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                  style={styles.inputIcon}
                />
                <Pressable style={styles.button} onPress={openMenu}>
                <Text>Adjuntar imagen</Text>
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
              
            <Pressable style={styles.btnadd} onPress={addPlace}>Publicar</Pressable>
              
          </View>
          
        </ScrollView>
    );

}

const styles = StyleSheet.create({
  title:{
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
    color: "#ffffff",
  },
  landscape:{
    alignItems: "center",
    marginTop: 20,
  },
  imageNew: {
    width: "100%",
    height: 150, // mantiene proporción cuadrada
    resizeMode: "cover",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
  btnadd:{
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#297cff",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    width: "60%",
    alignItems: "center",
    marginStart: "20%",
  },

  inputIcon:{
    width:24,
    height:24,
    marginRight:8
  },

  input:{
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#2c445800',
    paddingVertical: 0,
    color: '#2b2c2c',
    minWidth: 300, 
  },
  label:{
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
    color: '#2b2c2c',
    marginTop: 5,
  },
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    marginHorizontal: 20,
  },
  background:{
    backgroundColor: '#297cff',
  },
  addContent: {
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20
  },
  icon: {
    width: 30,
    aspectRatio: 1,
  },
  button:{
    width:"48%",
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
    resizeMode: "contain"
  },
  row:{
    flexDirection: "row",
    alignItems: "center",
    gap: 10

  },
  inputLabel:{
    borderWidth: 1,
    borderColor: '#E6EEF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    height: 50,
    minWidth: 310,
    color: '#2b2c2c',
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
    marginTop: 10,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    color: '#2b2c2c',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6EEF5',
    
   
    
  },

  
});