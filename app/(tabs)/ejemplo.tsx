import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

const COLORS = {
  primary: "#4C7CF0",
  primaryDark: "#3A63D6",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  shadow: "#000000",
};

export default function App() {
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState("");

  const showMessage = (msg: string) => {
    if (Platform.OS === "web") {
      alert(msg);
      return;
    }

    setMessageText(msg);
    setMessageVisible(true);
  };

  const closeMessage = () => setMessageVisible(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Tu app aquí */}

      <Pressable
      style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 5 , justifyContent: "center", alignItems: "center", marginTop:200 }}
        onPress={() => {
          showMessage("Este es un ejmplo");
        }}
      >
        <Text>Presioname</Text>
      </Pressable>
      <CustomMessageModal
        visible={messageVisible}
        message={messageText}
        onClose={closeMessage}
      />
    </View>
  );
}

function CustomMessageModal({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>i</Text>
          </View>

          <Text style={styles.title}>Aviso</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EAF1FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
