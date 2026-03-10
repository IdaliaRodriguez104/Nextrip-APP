import { View, Text, TextInput, StyleSheet, Platform, Alert, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../../firebaseConfig';

import { Link } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";

export default function Login() {

  const router = useRouter();


  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const showMessage = (msg: string) => {
  Platform.OS === "web" ? alert(msg) : Alert.alert(msg); 
  }



  const login = async () => {
    if (!loginEmail || !loginPassword) {
      showMessage('Por favor completa correo y contraseña');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      showMessage('Ingreso correcto');
      setLoginEmail('');
      setLoginPassword('');
      
      router.replace("/(tabs)/home");
    } catch (error: any) {
      showMessage(error.message || 'Error al iniciar sesión');
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={styles.container}>
      <View style={styles.Image}>
        <Image
        source={require("../../assets/images/distance_250dp_2679FF_FILL0_wght400_GRAD0_opsz48.png")}
        style={{width:70, height:70}}
        />
      </View>
      
          

      <Text style={styles.title}>Nextrip</Text>
      <Text style={styles.subtitle}>Descubre lugares increíbles</Text>
      <View style={styles.contentInputs}>
        <Text style={styles.TextInputs}>Correo electrónico</Text>
        <TextInput placeholder="Ingresa tu correo electrónico" placeholderTextColor={'#6c7474'} value={loginEmail} onChangeText={setLoginEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input}/>

        <Text style={styles.TextInputs}>Contraseña</Text>
        <TextInput placeholder="Ingresa tu contraseña" placeholderTextColor={'#6c7474'} value={loginPassword} onChangeText={setLoginPassword} secureTextEntry style={styles.input}/>

        <Pressable onPress={login} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Iniciar sesión</Text>
        </Pressable>
        <View style={{alignItems:"center", marginTop:25}}>
        <ThemedText>
          <Text style={styles.Text}>¿No tienes una cuenta?</Text><Link href="/register" style={styles.link}>Regístrate aquí</Link>
        </ThemedText>
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
    color: '#2b2c2c',
    minWidth: 300, 
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
