import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileCode } from 'lucide-react-native';

export const ReactNativeExportScreen: React.FC = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <View style={styles.card}>
      <FileCode size={40} color="#60a5fa" />
      <Text style={styles.title}>React Native Project</Text>
      <Text style={styles.sub}>
        This app IS the React Native project.{'\n'}
        You are running the converted JsPrep app natively on iOS / Android via Expo.
      </Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Stack</Text>
        <Text style={styles.infoValue}>Expo + React Native + TypeScript</Text>
        <Text style={styles.infoLabel}>Backend</Text>
        <Text style={styles.infoValue}>Firebase Firestore + JsPrep REST API</Text>
        <Text style={styles.infoLabel}>Auth</Text>
        <Text style={styles.infoValue}>Firebase Authentication</Text>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 24, alignItems: 'center', paddingBottom: 48 },
  card: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 20, padding: 24, alignItems: 'center', gap: 12, width: '100%',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  infoBox: { width: '100%', backgroundColor: '#020617', borderRadius: 12, padding: 16, gap: 6, marginTop: 8 },
  infoLabel: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5 },
  infoValue: { fontSize: 13, color: '#e2e8f0', marginBottom: 8 },
});
