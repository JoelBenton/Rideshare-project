import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { addDoc, collection, DocumentData, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { FIRESTORE_DB } from '@/src/config/FirebaseConfig'
import { useAuth } from '@/src/context/AuthContext'
import { defaultStyles } from '@/src/constants/themes'

const ChatPage = () => {
  const { id } = useLocalSearchParams<{ id: string}>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>('');

  const flatListRef = useRef<FlatList>(null);
  
  useLayoutEffect(() => {
    if (!user) return;

    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`)
    const q = query(msgCollectionRef, orderBy('sentAt', 'asc'))
    
    // `onSnapshot` sets up a real-time listener on the Firestore query and updates the `messages` state whenever new data is available.
    const subscribe = onSnapshot(q, (groups: DocumentData) => {
      const groupMessages = groups.docs.map((doc) => {
        return { id: doc.id, ...doc.data()}
      });
      
      setMessages(groupMessages)
    });
    
    return subscribe
  }, []);
  
  const sendMessage = async () => {
    if (!user) return;

    const msg = message.trim();
    if (msg.length === 0) return;
    
    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`)
    
    await addDoc(msgCollectionRef, {
      message: msg,
      sender: user.uid,
      senderName: user.displayName,
      sentAt: serverTimestamp(), // As name suggests, uses the servers time not the local users. Allows for unity of timezone around server.
    });

    setMessage('');
  }

  const renderMessage = ({ item }: { item: DocumentData}) => {
    if (!user) return;
    const myMessage = item.sender === user.uid;
    
    return (
      <View style={[styles.messageContainer, myMessage ? styles.currentUserMessageContainer : styles.otherUserMessageContainer]}>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={myMessage ? styles.currentUserMessageDate : styles.otherUserMessageDate}>{item.senderName} - {item.sentAt?.toDate().toLocaleDateString()}</Text>
      </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
        <FlatList 
          ref={flatListRef} 
          data={messages} 
          keyExtractor={(item) => item.id} 
          renderItem={renderMessage} 
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        <View style={styles.inputContainer}>
          <TextInput multiline value={message} onChangeText={(text) => setMessage(text)} style={styles.messageInput} />
          <TouchableOpacity disabled={message === ''} style={styles.button} onPress={sendMessage}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatPage

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? -35 : 0,
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  messageInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageContainer: {
    padding: 10,
    marginTop: 5,
    marginHorizontal: 20, 
    borderRadius: 10,
    maxWidth: '80%',
  },
  currentUserMessageContainer: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end'
  },
  otherUserMessageContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 16,
    fontFamily: defaultStyles.fontFamily,
    alignSelf: 'flex-end'
  },
  currentUserMessageDate: {
    fontSize: 9,
    color: 'gray',
    fontFamily: defaultStyles.fontFamily,
    alignSelf: 'flex-end'
  },
  otherUserMessageDate: {
    fontSize: 9,
    color: 'gray',
    fontFamily: defaultStyles.fontFamily,
    alignSelf: 'flex-start'
  }
})