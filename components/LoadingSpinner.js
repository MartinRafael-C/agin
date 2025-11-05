import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#007AFF" />
      <Text style={styles.text}>Pensando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  text: { marginLeft: 10, color: '#666', fontStyle: 'italic' },
});