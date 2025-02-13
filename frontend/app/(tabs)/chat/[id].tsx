import React, { useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, DocumentData, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "@/src/config/FirebaseConfig";
import { useAuth } from "@/src/context/AuthContext";
import { convertDate } from "@/src/utils/date";

const ChatPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");

  const flatListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    if (!user) return;

    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`);
    const q = query(msgCollectionRef, orderBy("sentAt", "asc"));

    const subscribe = onSnapshot(q, (groups: DocumentData) => {
      const groupMessages = groups.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(groupMessages);
    });

    return subscribe;
  }, []);

  const sendMessage = async () => {
    if (!user) return;

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) return;

    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`);

    await addDoc(msgCollectionRef, {
      message: trimmedMessage,
      sender: user?.uid,
      senderName: user?.displayName,
      sentAt: serverTimestamp(),
    });

    setMessage("");
  };

  const groupMessagesByDate = (messages: DocumentData[]) => {
    const grouped: { date: string; data: DocumentData[] }[] = [];
    let currentDate = "";

    messages.forEach((msg) => {
      const messageDate = msg.sentAt?.toDate().toLocaleDateString() || "Unknown Date";

      if (messageDate !== currentDate) {
        grouped.push({ date: messageDate, data: [] });
        currentDate = messageDate;
      }

      grouped[grouped.length - 1].data.push(msg);
    });

    return grouped;
  };

  const renderItem = ({ item }: { item: DocumentData }) => {
    if (!item.message) {
      // Render date header
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{convertDate(item.date, '/', false)}</Text>
        </View>
      );
    }

    // Render message
    const isMyMessage = item.sender === user?.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {item.senderName} •{" "}
          {item.sentAt?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  const groupedMessages = groupMessagesByDate(messages).flatMap((group) => [
    { date: group.date },
    ...group.data,
  ]);

  // SafeAreaView: Removes control of bottom due to conflict with KeyboardAvoidingView
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          keyExtractor={(item, index) => item.id || item.date || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.messageInput}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!message.trim()}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A5ACD",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#EEE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#D1E7FF",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  otherMessage: {
    backgroundColor: "#E6E6FA",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 10,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    backgroundColor: "#F9F9F9",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#6A5ACD",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});