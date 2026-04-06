import { ThemedView } from "@/components/themed-view";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface User {
  id?: string;
  names: string;
  email: string;
  description: string;
  image?: string;
}

export default function SelectType() {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userData, setUserData] = useState<User | null>(null);

  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showMessage("Sesión cerrada");
      router.replace("/login");
    } catch (error) {
      showMessage("Error al cerrar sesión");
    }
  };

  useEffect(() => {
    if (!userId) return;

    const db = getDatabase();
    const userRef = ref(db, `/users/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUserData({
          id: userId,
          ...data,
        });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.userBox}>
          <View style={styles.containerImage}>
            {userData?.image ? (
              <Image style={styles.imgUser} source={{ uri: userData.image }} />
            ) : (
              <Image
                style={styles.icon}
                source={require("../../assets/images/person_300dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png")}
              />
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.name}>{userData?.names || "Sin nombre"}</Text>
            <Text style={styles.email}>{userData?.email || "Sin correo"}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {userData?.description || "Sin descripción"}
        </Text>

        <Pressable
          style={styles.btnUpdate}
          onPress={() =>
            router.push({
              pathname: "../others/editProfile",
              params: { id: userId },
            })
          }
        >
          <Text style={styles.txtBtnUpdate}>Editar Perfil</Text>
        </Pressable>
      </View>

      <View style={styles.datesContainer}>
        <View style={styles.dateBox}>
          <ThemedView style={styles.dateInner}>
            <Text style={styles.numberBox}>12</Text>
            <Text style={styles.textBox}>Visitados</Text>
          </ThemedView>
        </View>

        <View style={styles.dateBox}>
          <ThemedView style={styles.dateInner}>
            <Text style={styles.numberBox}>8</Text>
            <Text style={styles.textBox}>Reseñas</Text>
          </ThemedView>
        </View>

        <View style={styles.dateBox}>
          <ThemedView style={styles.dateInner}>
            <Text style={styles.numberBox}>24</Text>
            <Text style={styles.textBox}>Fotos</Text>
          </ThemedView>
        </View>
      </View>

      <View style={styles.containerSettings}>
        <Pressable style={styles.settingBox}>
          <MaterialIcons name="tune" size={25} color="#5a5a5a" />
          <Text style={styles.textSettings}>Configuración</Text>
          <MaterialIcons name="chevron-right" size={25} color="#5a5a5a" />
        </Pressable>

        <Pressable style={styles.notificationsBox}>
          <MaterialIcons name="notifications-none" size={25} color="#5a5a5a" />
          <Text style={styles.textSettings}>Notificaciones</Text>
          <MaterialIcons name="chevron-right" size={25} color="#5a5a5a" />
        </Pressable>

        <Pressable style={styles.helpBox}>
          <MaterialIcons name="help-outline" size={25} color="#5a5a5a" />
          <Text style={styles.textSettings}>Ayuda y soporte</Text>
          <MaterialIcons name="chevron-right" size={25} color="#5a5a5a" />
        </Pressable>
      </View>

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <MaterialIcons name="logout" size={25} color="#fff" />
        <Text style={styles.txtLogout}>Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },

  box: {
    backgroundColor: "#2b7fff",
    width: "100%",
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#888282",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
  },

  container: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 16,
    shadowColor: "#e7e7e7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "#fff",
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  containerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#2b7fff",
    alignItems: "center",
    justifyContent: "center",
  },

  imgUser: {
    width: "100%",
    height: "100%",
  },

  icon: {
    width: 60,
    height: 60,
    tintColor: "#fff",
  },

  infoBox: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },

  email: {
    marginTop: 4,
    opacity: 0.6,
    color: "#111",
  },

  description: {
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.7,
    textAlign: "justify",
    color: "#111",
  },

  btnUpdate: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "#fff",
  },

  txtBtnUpdate: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#111",
  },

  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 18,
    gap: 10,
  },

  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 16,
    shadowColor: "#e7e7e7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 100,
    backgroundColor: "#fff",
  },

  dateInner: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
  },

  numberBox: {
    fontSize: 24,
    color: "#2b7fff",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "700",
  },

  textBox: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    color: "#111",
  },

  containerSettings: {
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  settingBox: {
    paddingHorizontal: 16,
    flexDirection: "row",
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d8d89d",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationsBox: {
    paddingHorizontal: 16,
    flexDirection: "row",
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d8d89d",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  helpBox: {
    paddingHorizontal: 16,
    flexDirection: "row",
    width: "100%",
    height: 64,
    alignItems: "center",
    justifyContent: "space-between",
  },

  textSettings: {
    flex: 1,
    paddingHorizontal: 10,
    color: "#111",
  },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: "#d4183d",
    marginTop: 18,
    marginBottom: 20,
    marginHorizontal: 16,
    paddingVertical: 12,
  },

  txtLogout: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});