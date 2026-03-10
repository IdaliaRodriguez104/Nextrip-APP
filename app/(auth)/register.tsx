import { View, Text, TextInput, Button, StyleSheet, Platform, Alert, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ExternalLink } from "@/components/external-link";
import { Image } from "expo-image";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDatabase, push, ref, set } from "firebase/database";
export default function Login() {

const router = useRouter();

const [regEmail, setRegEmail] = useState("");
const [regPassword, setRegPassword] = useState("");
const [names, setNames] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [placeBorn, setPlaceBorn] = useState("");
const [date, setDate] = useState(new Date());
const [show, setShow] = useState(false);
const [city, setCity] = useState("");

  const showMessage = (msg: string) => {
  Platform.OS === "web" ? alert(msg) : Alert.alert(msg); 
  }


  
  const register = async () => {
    if (!regEmail || !regPassword || !names) {
      showMessage('Por favor completa correo y contraseña');
      return;
    }
    if (regPassword !== confirmPassword) {
      showMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
      showMessage("¡Registro correcto! Bienvenido/a");
        const db = getDatabase();
        await set(ref(db, "users/" + user.uid), {
        names,
        email: regEmail,
        placeBorn,
        birthday: date.toISOString().split("T")[0],
        cityLive: city,
        });

      setNames("");
      setPlaceBorn('');
      setDate(new Date());
      setRegEmail('');
      setRegPassword('');
      setCity('');
      router.push("/login");
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          showMessage('El correo ya está en uso');
          return;
        }
        showMessage(error.message);
      } else {
        showMessage(String(error));
      }
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
  setShow(false);

  if (selectedDate) {
    setDate(selectedDate);
  }
};

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
      <View style={styles.Image}>
        <Image
        source={require("../../assets/images//assignment_ind_280dp_297CFF_FILL0_wght400_GRAD0_opsz48.png")}
        style={{width:70, height:70}}
      />
      </View>
      
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Únete y descubre esta increíble app.</Text>
      <View style={styles.contentInputs}>
        <Text style={styles.TextInputs}>Nombres y apellidos</Text>
        <TextInput placeholder="Ingresa tus nombres" placeholderTextColor={'#6c7474'} value={names} onChangeText={setNames} autoCapitalize="none" keyboardType="email-address" style={styles.input}/>

        <Text style={styles.TextInputs}>Correo electrónico</Text>
        <TextInput placeholder="Ingresa tu correo electrónico" placeholderTextColor={'#6c7474'} value={regEmail} onChangeText={setRegEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input}/>

        <Text style={styles.TextInputs}>Contraseña</Text>
        <TextInput placeholder="Ingresa tu contraseña" placeholderTextColor={'#6c7474'} value={regPassword} onChangeText={setRegPassword} secureTextEntry style={styles.input}/>

        <Text style={styles.TextInputs}>Confirme su contraseña</Text>
        <TextInput placeholder="Ingresa tu correo electrónico" placeholderTextColor={'#6c7474'} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" keyboardType="email-address" style={styles.input}/>

        <Text style={styles.TextInputs}>Fecha de nacimiento</Text>
        <Pressable onPress={() => setShow(true)} style={{ borderWidth:1, borderColor:'#6c7474', borderRadius:10, padding:10}}> <Text>{date.toLocaleDateString()}</Text></Pressable> {show && ( <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />)}
        
        <Text style={styles.TextInputs}>Ciudad de nacimiento</Text>
        <TextInput placeholder="Ingresa tu Ciudad de nacimiento" placeholderTextColor={'#6c7474'} value={placeBorn} onChangeText={setPlaceBorn} style={styles.input}/>

        <Text style={styles.TextInputs}>Ciudad donde vives actualmente</Text>
        <TextInput placeholder="Ingresa tu Ciudad donde vives actualmente" placeholderTextColor={'#6c7474'} value={city} onChangeText={setCity} style={styles.input}/>




        <Pressable onPress={register} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Registrarme</Text>
        </Pressable>
        <View style={{alignItems:"center", marginTop:25}}>
        </View>
        
      </View>
      <Text style={styles.footer}>© 2026 Turismo Local. Todos los derechos reservados.</Text>
    </View>
    </ScrollView>
    
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    backgroundColor: '#297cff',
  },
  contentInputs: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 30,
  },
  Image: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    padding: 20,
  },
  footer:{
    fontSize: 13,
    fontWeight: 400,
    marginBottom: 3,
    color: '#faf9f9',
    marginTop: 25,
  },
  TextInputs: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
    color: '#2b2c2c',
    marginTop: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 500,
    lineHeight: 50,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 300,
    color: '#fffefe',
    marginBottom: 35,
    opacity: 0.7,
  },
  Text: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 3,
    color: '#494d4d',
    marginTop: 5,
  },
  link: {
    marginLeft:5,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
    color: '#2a86f0',
    marginTop: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E6EEF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: "100%",
    minWidth: 310,
    color: '#2b2c2c',
  },
  primaryAction: {
    marginTop: 10,
    backgroundColor: '#088cdd',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: "100%",
  },
  primaryActionText: {
    color: '#FFF',
    fontWeight: '700',
  },

});
