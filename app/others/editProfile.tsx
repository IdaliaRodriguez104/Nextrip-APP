
import {Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import { Alert,Platform, Pressable, ScrollView, StyleSheet, TextInput, View, Animated, PanResponder } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { use, useEffect, useRef, useState } from "react";

import { getDatabase, onValue, push, ref, set, update } from "firebase/database";
import {getAuth} from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Circle } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";


export default function UserScreen() {


  //Variables
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;


  //Variables de la BD
  const [names, setName] = useState("");
  const [cityLive, setCityLive] = useState("");
  const [description, setDescription] = useState("");
  const [placeBorn, setPlaceBorn] = useState("");
  const [image, setImage] = useState<String | null| any>(null);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());


  //Funcion para mostrar mensajes
  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg); 
  }



   //Función para subir em Cloudinary las imagenes: 
  const uploadImageCloudinary = async (uri: any) => {
  if (!uri) throw new Error("No hay URI de imagen.");

  try {
    const data = new FormData();

    if (Platform.OS === "web") {
      // En web convertimos la URL a blob/file
      const response = await fetch(uri);
      const blob = await response.blob();

      // 'file' debe ser un File/Blob con nombre
      // @ts-ignore
      data.append("file", blob, "photo.jpg");
    } else {
      // En Android/iOS se manda con objeto que tiene uri, name, type
      data.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
    }

    // upload_preset EXACTAMENTE como está en Cloudinary (case sensitive)
    data.append("upload_preset", "Nextrip");

    // opcional: cloud_name no es necesario en body si ya lo pones en la URL
    const url = "https://api.cloudinary.com/v1_1/djmeu6v6q/image/upload";

    const res = await fetch(url, {
      method: "POST",
      body: data,
      // NO poner headers: { "Content-Type": "multipart/form-data" }
    });
    {/** */}
    const result = await res.json();
    //console.log("Cloudinary raw response:", result);

    if (!res.ok) {
      // lanzar con el mensaje que devuelva Cloudinary para depurar
      const msg = result?.error?.message || JSON.stringify(result);
      throw new Error("Cloudinary upload failed: " + msg);
    }

    return result.secure_url; // URL final
  } catch (err: any) {
    showMessage(err.message);
    //console.error("uploadImageCloudinary error:", err);
    throw err;
  }
};

    useEffect(() => {
        if (!userId) return;
        const db = getDatabase();
        const UserRef = ref(db, `/users/${userId}`);
        const unsubscribe = onValue(UserRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setName(data?.names ?? "");
            setDescription(data?.description ?? "");
            setCityLive(data?.cityLive ?? "");
            setPlaceBorn(data?.placeBorn ?? "");
            setImage(data?.image ?? "");
            if (data?.date) {
                setDate(new Date(data.date));
                }
          } 
        });  
        return () => unsubscribe();
      }, [userId]);


  const updateDate = async () => {
    
    
    
    try {
        
    let imageUri = image;
      if (image && image.startsWith("file") || image.startsWith("blob")) {
        imageUri = await uploadImageCloudinary(image);
        }
    if (!names || !description) {
    return showMessage("Todos los campos son obligatorios");
    }

      const db = getDatabase();
      const newDatesRef = ref(db, `users/${userId}`);


  
      await update(newDatesRef, {
        names,
        description,
        placeBorn,
        cityLive,
        image: imageUri,
        date: date ?? new Date(),
      });

   
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


  const onChange = (event: any, selectedDate?: Date) => {
  setShow(false);

  if (selectedDate) {
    setDate(selectedDate);
  }
};
    return(
        <ScrollView style={styles.background}>
          <View style={styles.container}>
            <View style={styles.back}>
            <Pressable onPress={() => {router.back()}}>
              <MaterialIcons name="arrow-back" size={24}/>
            </Pressable>
          </View>
            <View style={styles.Image}>
                    <Image
                    source={require("../../assets/images/add_a_photo_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={{width:70, height:70}}
                    />
              </View>

                  <Text style={styles.title}>
                    Actualiza tu perfil
                  </Text>
                  <Text style={styles.subtitle}>
                    Comparte tus datos con el mundo
                  </Text>
          </View>

          <View style={styles.addContent}>
            <Text style={styles.label}>Foto de perfil *</Text>

            <View style={{alignItems: "center", justifyContent: "center"}}>
                <View style={styles.containerUpload}>
                    <View style={styles.imagenMain}>
                    
                    <Svg style={styles.svgBorder}>
                        <Circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="none"
                            stroke="#b4b4b4"
                            strokeWidth={2}
                            strokeDasharray="8,4"
                        />
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

            </View>
            <View >
                <Text style={styles.label}>Nombres y apellidos*</Text>
                <TextInput style={styles.inputLabelName} value={names} placeholderTextColor="#5c5b5b" placeholder="Nombres y Apellidos" onChangeText={setName}/>
            </View>
            <View >
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <View >
                <Pressable style={styles.date} onPress={() => setShow(true)}> 
                <Text style={date ? styles.dateText : styles.placeholder}>
                  {date ? date.toLocaleDateString() : "Selecciona una fecha"}
                </Text>
                <Text style={styles.icon}>📅</Text>
                </Pressable> 
                {show && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onChange}/>
                )}
            </View>
            <View >
                <Text style={styles.label}>Descripcion *</Text>
                <TextInput style={styles.inputDescription} value={description} onChangeText={setDescription}  placeholderTextColor="#5c5b5b" multiline={true} numberOfLines={4} textAlignVertical="top" placeholder="Comparte como te describes con otros viajeros..."/>
            </View>
            <View>
                <Text style={styles.label}>Lugar de nacimiento</Text>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("../../assets/images/add_location_alt_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={styles.inputIcon}
                  />
                  <TextInput placeholder="Ciudad, Pais"style={styles.input} placeholderTextColor="#5c5b5b" underlineColorAndroid={"#8f101000"} value={placeBorn} onChangeText={setPlaceBorn} />
                </View>
            </View>
            <View>
                <Text style={styles.label}>Lugar de vivencia actual</Text>
                <View style={styles.inputContainer}>
                  <Image
                    source={require("../../assets/images/add_location_alt_170dp_2B7FFF_FILL0_wght400_GRAD0_opsz48.png")}
                    style={styles.inputIcon}
                  />
                  <TextInput placeholder="Ciudad, Pais"style={styles.input} placeholderTextColor="#5c5b5b" underlineColorAndroid={"#8f101000"} value={cityLive} onChangeText={setCityLive} />
                </View>
            </View>
            
           </View>
    
            
            <Pressable style={styles.btnadd} onPress={updateDate}>
              <Text style={styles.txtBtnAdd}>Actualizar</Text>
            </Pressable>
              
          </View>
          
        </ScrollView>
    );

}

const styles = StyleSheet.create({
  containerUpload:{
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  back:{
    backgroundColor: "#e7f3f5",
    borderRadius: 100,
    padding: 12,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    top: 40,
    left: 20,
  },
  pressableUpload:{
  justifyContent:"center",
  alignItems:"center",
  width:"100%",
  height:"100%"
  },
  date: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 16,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginBottom: 16,

  // sombra moderna
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
  },

  dateText: {
    fontSize: 15,
    color: "#1F2937",
  },

  placeholder: {
    fontSize: 15,
    color: "#9CA3AF",
  },

  icon: {
    fontSize: 18,
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
    height:160,
    width: 160,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f5",
    borderRadius: 80,

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
    paddingHorizontal: 12
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
    width: "95%",
    height:  "95%", // mantiene proporción cuadrada
    borderRadius: 80,
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
    padding:30,
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

  Image: {
    alignItems:"center",
    justifyContent: "center",
    backgroundColor: '#ffffff',
    borderRadius: "100%",
    width: "40%",
    aspectRatio: 1,
    resizeMode: "contain",
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
 
});