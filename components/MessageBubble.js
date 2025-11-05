import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ text, isUser }) {
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.bot]}>
      <Text style={[styles.text, isUser && styles.userText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  text: { color: '#000', fontSize: 16 },
  userText: { color: '#fff' },
});