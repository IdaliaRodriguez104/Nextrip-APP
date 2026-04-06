import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
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
  description?: string;
  image?: string;
  bithday?: string;
  cityLive?: string;
  date?: string;
  placeBorn?: string;
}

export default function SelectType() {
  const { perfilUser } = useLocalSearchParams();
  const userId = Array.isArray(perfilUser) ? perfilUser[0] : perfilUser;

  const [userData, setUserData] = useState<User | null>(null);

  const showMessage = (msg: string) => {
    Platform.OS === "web" ? alert(msg) : Alert.alert(msg);
  };

  const logout = async () => {
    try {
      const auth = getAuth();
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
          id: userId as string,
          ...data,
        });
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const detailItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    value?: string,
  ) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <MaterialIcons name={icon} size={20} color="#2b7fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "No disponible"}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>

          <View style={styles.headerTextBox}>
            <Text style={styles.headerTitle}>Perfil del usuario</Text>
            <Text style={styles.headerSubtitle}>
              Información visible dentro del chat
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardProfile}>
        <View style={styles.avatarWrap}>
          {userData?.image ? (
            <Image
              style={styles.avatar}
              source={{ uri: userData.image }}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Image
                style={styles.fallbackIcon}
                source={require("../../assets/images/person_300dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png")}
                contentFit="contain"
              />
            </View>
          )}
        </View>

        <Text style={styles.name}>{userData?.names || "Usuario"}</Text>
        <Text style={styles.email}>
          {userData?.email || "Correo no disponible"}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <MaterialIcons name="chat" size={16} color="#2b7fff" />
            <Text style={styles.badgeText}>Contacto en chat</Text>
          </View>
          <View style={styles.badge}>
            <MaterialIcons name="verified" size={16} color="#2b7fff" />
            <Text style={styles.badgeText}>Perfil público</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="info-outline" size={20} color="#2b7fff" />
          <Text style={styles.sectionTitle}>Acerca de</Text>
        </View>
        <Text style={styles.description}>
          {userData?.description?.trim() || "Sin descripción disponible."}
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="person-outline" size={20} color="#2b7fff" />
          <Text style={styles.sectionTitle}>Datos principales</Text>
        </View>

        <View style={styles.detailsContainer}>
          {detailItem("cake", "Cumpleaños", userData?.bithday)}
          {detailItem("location-city", "Ciudad donde vive", userData?.cityLive)}
          {detailItem("place", "Lugar de nacimiento", userData?.placeBorn)}
          {detailItem("event", "Fecha registrada", userData?.date)}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="security" size={20} color="#2b7fff" />
          <Text style={styles.sectionTitle}>Privacidad</Text>
        </View>
        <Text style={styles.privacyText}>
          Esta información ayuda a identificar el perfil dentro del chat y
          mejorar la confianza entre usuarios.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f9ff",
  },
  content: {
    paddingBottom: 28,
  },
  header: {
    backgroundColor: "#2b7fff",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 50
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#3282f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextBox: {
    marginLeft: 14,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#eaf2ff",
    opacity: 0.95,
  },
  cardProfile: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarWrap: {
    marginTop: 4,
    marginBottom: 14,
  },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#f3f4f5",
  },
  avatarFallback: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#2b7fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackIcon: {
    width: 62,
    height: 62,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#edf4ff",
    borderWidth: 1,
    borderColor: "#d7e6ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    color: "#245fbf",
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
    textAlign: "justify",
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fbff",
    borderWidth: 1,
    borderColor: "#e6eefc",
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eaf2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
  },
});
