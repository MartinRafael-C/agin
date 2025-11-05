import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ChatInput({ value, onChange, onSend, loading }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Escribe un mensaje..."
        onSubmitEditing={onSend}
        editable={!loading}
      />
      <TouchableOpacity style={styles.button} onPress={onSend} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '...' : 'Enviar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});