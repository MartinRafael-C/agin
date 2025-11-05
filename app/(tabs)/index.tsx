// index.js
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';

// === COMPONENTES (dentro del mismo archivo) ===
const MessageBubble = ({ text, isUser }) => (
  <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
    <Text style={[styles.bubbleText, isUser && styles.userText]}>{text}</Text>
  </View>
);

const ChatInput = ({ value, onChange, onSend, loading }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChange}
      placeholder="Escribe un mensaje..."
      onSubmitEditing={onSend}
      editable={!loading}
      autoFocus
    />
    <TouchableOpacity style={[styles.sendButton, loading && styles.sendButtonDisabled]} onPress={onSend} disabled={loading}>
      <Text style={styles.sendText}>{loading ? 'Enviando' : 'Enviar'}</Text>
    </TouchableOpacity>
  </View>
);

const LoadingBubble = () => (
  <View style={[styles.bubble, styles.botBubble]}>
    <ActivityIndicator size="small" color="#666" />
    <Text style={[styles.bubbleText, { marginLeft: 8 }]}>Gemini está pensando...</Text>
  </View>
);

// === ESTILOS ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { flex: 1 },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    marginHorizontal: 12,
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
  },
  bubbleText: { fontSize: 16, color: '#000' },
  userText: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#aaa' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

// === APP PRINCIPAL ===
export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', text: '¡Hola! Soy tu asistente con Gemini. ¿En qué te ayudo?', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // === OBTENER API KEY DE FORMA SEGURA ===
  const API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.GEMINI_API_KEY;

  useEffect(() => {
    if (!API_KEY) {
      Alert.alert('Error', 'API Key no encontrada. Configura .env o EAS Secrets.');
    }
  }, [API_KEY]);

  // === ENVIAR MENSAJE A GEMINI ===
  const sendToGemini = async (prompt) => {
    if (!API_KEY) throw new Error('API Key no configurada');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  // === ENVIAR MENSAJE ===
  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Añadir burbuja de "pensando..."
    const thinkingId = 'thinking';
    setMessages(prev => [...prev, { id: thinkingId, text: '', isUser: false, thinking: true }]);

    try {
      const reply = await sendToGemini(inputText);
      setMessages(prev => prev.filter(m => m.id !== thinkingId));
      setMessages(prev => [...prev, { id: Date.now().toString(), text: reply, isUser: false }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => prev.filter(m => m.id !== thinkingId));
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: 'Lo siento, no pude conectarme con Gemini. Revisa tu conexión o API Key.', isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // === RENDERIZAR MENSAJE ===
  const renderMessage = ({ item }) => {
    if (item.thinking) return <LoadingBubble />;
    return <MessageBubble text={item.text} isUser={item.isUser} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.list}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
          loading={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === IMPORTS FALTANTES (React Native) ===
import { Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';