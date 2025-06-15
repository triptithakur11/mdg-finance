import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFinance } from "../context/FinanceContext";

const AccountScreen = () => {
  const { user, updateUser, balance, goals } = useFinance();
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfession(user.profession || "");
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const showModal = () => {
    setIsEditing(true);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (name.trim()) {
      await updateUser({
        name: name.trim(),
        profession: profession.trim(),
        avatar,
      });
      hideModal();
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setAvatar(base64Image);

        const updatedUser = {
          ...user,
          avatar: base64Image,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const totalSavings = goals.reduce(
    (total, goal) => total + goal.currentAmount,
    0
  );
  const activeGoals = goals.filter(
    (goal) => goal.currentAmount < goal.targetAmount
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>

        <Surface style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={pickImage}
            >
              <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name || "Add your name"}</Text>
            <Text style={styles.userProfession}>
              {profession || "Add your profession"}
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={showModal}
            style={styles.editButton}
            icon="pencil"
            buttonColor="#222"
          >
            Edit Profile
          </Button>
        </Surface>

        <Surface style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Statistics</Text>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#666" />
            <Text style={styles.settingText}>Current Balance :</Text>
            <Text style={[styles.settingText, { marginLeft: -10 }]}>
              ₹{balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="target" size={24} color="#222" />
            <Text style={styles.settingText}>Active Goals :</Text>
            <Text style={[styles.settingText, { marginLeft: -50 }]}>
              {activeGoals}
            </Text>
          </View>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="piggy-bank" size={24} color="#222" />
            <Text style={styles.settingText}>Total Savings :</Text>
            <Text style={[styles.settingText, { marginLeft: -40 }]}>
              ₹{totalSavings.toFixed(2)}
            </Text>
          </View>
        </Surface>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: "#222",
                primary: "#222",
                onSurface: "#222",
                placeholder: "#222",
              },
            }}
          />
          <TextInput
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: "#222",
                primary: "#222",
                onSurface: "#222",
                placeholder: "#222",
              },
            }}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            disabled={!name.trim()}
            buttonColor="#222"
          >
            Save Changes
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FA",
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#222",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  userProfession: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#222",
    width: "80%",
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 12,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#222",
  },
});

export default AccountScreen;
