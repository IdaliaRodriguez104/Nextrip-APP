import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../../firebaseConfig";

export default function ChatList() {
  interface User {
    names: string;
    email: string;
    image?: string;
  }

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [usersData, setUsersData] = useState<{ [key: string]: User }>({});
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<any[]>([]);

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const otroUsuario = chat.participantes.find(
        (uid: string) => uid !== userId,
      );
      const userInfo = usersData[otroUsuario];

      return (
        userInfo?.email?.toLowerCase().includes(search.toLowerCase()) ||
        userInfo?.names?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [chats, usersData, search, userId]);

  const clearInput = () => setSearch("");

  useEffect(() => {
    if (!userId) return;

    const unsubscribeChats = onSnapshot(collection(db, "chats"), (snapshot) => {
      const lista: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        if (data.participantes?.includes(userId)) {
          lista.push({ id: docSnap.id, ...data });
        }
      });

      setChats(lista);
    });

    const dbRT = getDatabase();
    const userRef = ref(dbRT, "/users");

    const unsubscribeUsers = onValue(userRef, (snap) => {
      if (snap.exists()) {
        setUsersData(snap.val());
      }
    });

    return () => {
      unsubscribeChats();
      unsubscribeUsers();
    };
  }, [userId]);

  const renderChatItem = ({ item }: any) => {
    const otroUsuario = item.participantes.find(
      (uid: string) => uid !== userId,
    );
    const userInfo = usersData[otroUsuario];

    return (
      <Pressable
        style={({ pressed }) => [styles.chatCard, pressed && { opacity: 0.92 }]}
        onPress={() =>
          router.push({
            pathname: "/messages/chat",
            params: {
              chatId: item.id,
              otroUsuario,
            },
          })
        }
      >
        <View style={styles.avatarWrap}>
          {userInfo?.image ? (
            <Image style={styles.imgUser} source={{ uri: userInfo.image }} />
          ) : (
            <View style={styles.avatarFallback}>
              <Image
                style={styles.icon}
                source={require("../../assets/images/person_300dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.png")}
              />
            </View>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatTopRow}>
            <Text style={styles.chatName}>{userInfo?.names || "Usuario"}</Text>
            <MaterialIcons name="chevron-right" size={22} color="#9aa4b2" />
          </View>

          <Text style={styles.chatEmail}>
            {userInfo?.email || "Cargando..."}
          </Text>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.ultimoMensaje || "Sin mensajes todavía"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.titleSearch}>Conversa con el mundo</Text>
            <Text style={styles.subtitle}>Tus chats activos aparecen aquí</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color="#64748b" />
          <TextInput
            placeholder="Buscar personas por nombre o correo"
            style={styles.inputSearch}
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={clearInput} hitSlop={10}>
              <MaterialIcons name="clear" size={22} color="#64748b" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredChats}
        style={styles.containerList}
        contentContainerStyle={[
          styles.listContent,
          filteredChats.length === 0 && { flex: 1 },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialIcons
              name="chat-bubble-outline"
              size={42}
              color="#2b7fff"
            />
            <Text style={styles.emptyTitle}>No hay chats para mostrar</Text>
            <Text style={styles.emptyText}>
              Intenta buscar por nombre o correo.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f9ff",
  },

  header: {
    backgroundColor: "#2b7fff",
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  titleSearch: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 12,
  },

  subtitle: {
    marginLeft: 12,
    marginTop: 2,
    fontSize: 13,
    color: "#eaf2ff",
    opacity: 0.95,
  },

  back: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#3282f9",
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  inputSearch: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#1f2937",
  },

  containerList: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e7eef9",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  avatarWrap: {
    marginRight: 12,
  },

  imgUser: {
    height: 54,
    width: 54,
    borderRadius: 27,
    backgroundColor: "#f3f4f5",
  },

  avatarFallback: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2b7fff",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: 30,
    height: 30,
  },

  chatInfo: {
    flex: 1,
  },

  chatTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chatName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
    paddingRight: 8,
  },

  chatEmail: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748b",
  },

  lastMessage: {
    marginTop: 8,
    fontSize: 13,
    color: "#334155",
    opacity: 0.85,
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
