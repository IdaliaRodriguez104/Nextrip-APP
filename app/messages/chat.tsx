import { addDoc, onSnapshot, orderBy, query,  doc, setDoc, updateDoc, collection } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../firebaseConfig";
import { serverTimestamp } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { router, useLocalSearchParams } from "expo-router";
import { getDatabase, onValue, ref } from "firebase/database";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";



export default function Chat() {
interface User {
    names: string;
    email: string;
    image: any;
  }
const { chatId } = useLocalSearchParams(); 
const { otroUid} = useLocalSearchParams(); 
const { otroUsuario} = useLocalSearchParams(); 
const [userData, setUserData] = useState<User | null>(null); 
const [mensaje, setMensaje] = useState(""); 
const [mensajes, setMensajes] = useState<any[]>([]); 
const[anotherUid, setAnotherUid] = useState<any>(null); 
const chatIdStr = Array.isArray(chatId) ? chatId[0] : chatId; 
const otroUidStr = Array.isArray(otroUid) ? otroUid[0] : otroUid;
const auth = getAuth(); 
const user = auth.currentUser; 
const userId = user?.uid; 
const flatListRef = useRef<FlatList>(null); 

  useEffect(() => { 
    if (otroUidStr) { 
      setAnotherUid(otroUidStr); 

    } else if (otroUsuario) { 
      setAnotherUid(otroUsuario);
    } 
  }, [otroUidStr, otroUsuario]);
  console.log("este el id del otro usuarios",anotherUid)
  useEffect(() => {
    if (!anotherUid) return;
    const db = getDatabase();
    const UserRef = ref(db, `/users/${anotherUid}`);
    const unsubscribe = onValue(UserRef, (snapshot) => {
      const data = snapshot.val();
        if (data) {
          setUserData({uid: anotherUid, 
            ...data,
            });
          } else {
            setUserData(null);
              }
          });  
            return () => unsubscribe();
    }, [anotherUid]);
  


  const showMessage = (msg: string) => {
      Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
    };


useEffect(() => {
  if (!chatIdStr) return;
 
  

  const q = query(
    collection(db, "chats", chatIdStr, "mensajes"),
    orderBy("fecha", "asc")
  );


  const unsubscribe = onSnapshot(q, (snapshot) => {
    const lista: any[] = [];

    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });

    setMensajes(lista);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  });

  return unsubscribe;
}, [chatIdStr]);


  const enviarMensaje = async () => {
    

  if (mensaje.trim() === "") return;
  await setDoc(
    doc(db, "chats", chatIdStr),
    {
      participantes: [userId, anotherUid],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );


  await addDoc(
    collection(db, "chats", chatIdStr, "mensajes"),
    {
      usuario: auth.currentUser?.email,
      texto: mensaje,
      fecha: serverTimestamp(),
    }
  );


  await updateDoc(
    doc(db, "chats", chatIdStr),
    {
      ultimoMensaje: mensaje,
      updatedAt: serverTimestamp(),
    }
  );

  setMensaje("");
};

  const renderItem = ({ item }: any) => {

    const esMio = item.usuario === auth.currentUser?.email;

    return (
      <View
        style={[
          styles.mensajeContainer,
          esMio ? styles.mio : styles.otro
        ]}
      >
        <Text style={styles.usuario}>{item.usuario}</Text>
        <Text>{item.texto}</Text>
      </View>
    );
  };
  console.log("Este es el otroUid",anotherUid)
  return (
    <View style={{flex: 1}}>
       <View>
        <Pressable style={styles.header} onPress={()=> router.push({
          pathname: "/messages/[perfilUser]",
          params: {perfilUser: anotherUid ? anotherUid : otroUidStr},
        }) }>
          <View style={styles.back}>
          <Pressable
              onPress={() => {
                router.back();
              }}
            >
            <MaterialIcons name="arrow-back" size={24} color={"white"} />
         </Pressable>
        </View>
       <View style={{backgroundColor: "#2b7fff", borderRadius: 50}}>
          {userData?.image ? (
            <Image style={styles.imgUser} source={{ uri: userData.image }} />
          ) : (
            <Image style={styles.icon} source={require("../../assets/images/person_300dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png")}/>
          )}
        </View>
        <View style={styles.infoUser}>
          <Text style={styles.name}>{userData?.names}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>
        </Pressable>
      </View>



      <FlatList
        ref={flatListRef}
        data={mensajes}
        style={styles.container}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.inputContainer}>

        <TextInput
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChangeText={setMensaje}
          style={styles.input}
        />

        <Pressable
          style={styles.boton}
          onPress={enviarMensaje}
        >
          <MaterialIcons name="send" size={24} color="white"/>
        </Pressable>

      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f9ff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b7fff",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#3282f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  imgUser: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#f3f4f5",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  infoUser: {
    marginLeft: 10,
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },

  email: {
    marginTop: 2,
    fontSize: 12,
    color: "#e8f1ff",
    opacity: 0.9,
  },

  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },

  mensajeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 6,
    borderRadius: 18,
    maxWidth: "78%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  mio: {
    backgroundColor: "#dff7e5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },

  otro: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#e8eef7",
  },

  usuario: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#d7e2f3",
    backgroundColor: "#f8fbff",
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1f2937",
  },

  boton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2b7fff",
    marginLeft: 10,
    borderRadius: 24,
    shadowColor: "#2b7fff",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});