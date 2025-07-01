import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const quickPrompts = [
  { label: 'Analyze TSLA', color: '#e0e7ff', icon: <FontAwesome5 name="chart-line" size={16} color="#2563eb" /> },
  { label: 'Market Summary', color: '#fef9c3', icon: <Ionicons name="stats-chart" size={16} color="#eab308" /> },
  { label: 'Portfolio Review', color: '#fee2e2', icon: <MaterialIcons name="pie-chart" size={16} color="#dc2626" /> },
];

const suggestionCards = [
  {
    label: 'Analyze AAPL stock performance',
    icon: <FontAwesome5 name="chart-bar" size={22} color="#2563eb" />,
    color: '#e0e7ff',
  },
  {
    label: 'What are the top tech stocks to watch?',
    icon: <Ionicons name="md-bulb" size={22} color="#059669" />,
    color: '#bbf7d0',
  },
  {
    label: 'Explain P/E ratio and its importance',
    icon: <MaterialIcons name="functions" size={22} color="#a21caf" />,
    color: '#f3e8ff',
  },
  {
    label: 'Market outlook for Q4 2024',
    icon: <Ionicons name="earth" size={22} color="#ea580c" />,
    color: '#fed7aa',
  },
];

export default function Chat() {
  const [input, setInput] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>AI Stock Analysis</Text>
          </Text>
          <Text style={styles.subtitle}>Get intelligent insights powered by advanced AI</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.dotLive} />
              <Text style={styles.statusText}>Live Market</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#fee2e2', marginLeft: 8 }]}>
              <Ionicons name="flash" size={12} color="#ef4444" />
              <Text style={[styles.statusText, { color: '#ef4444', marginLeft: 2 }]}>AI Powered</Text>
            </View>
          </View>
        </View>

        {/* Main Icon */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <View style={styles.mainIcon}>
            <MaterialIcons name="insert-chart" size={40} color="#fff" />
          </View>
        </View>

        {/* Welcome */}
        <Text style={styles.welcome}>
          Welcome to <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>StockGPT!</Text>
        </Text>
        <Text style={styles.desc}>
          Your AI-powered financial advisor. Ask me anything about stocks, markets, or investment strategies.
        </Text>

        {/* Suggestion Cards */}
        <View style={styles.suggestionGrid}>
          {suggestionCards.map((card, idx) => (
            <TouchableOpacity key={idx} style={[styles.suggestionCard, { backgroundColor: card.color }]}>
              <View style={styles.suggestionIcon}>{card.icon}</View>
              <Text style={styles.suggestionLabel}>{card.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#888" style={{ position: 'absolute', right: 12, top: 18 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Chat Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask about stocks, market analysis, or investment strategies…"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quick Prompts */}
      <View style={styles.quickPromptRow}>
        {quickPrompts.map((prompt, idx) => (
          <TouchableOpacity key={idx} style={[styles.quickPrompt, { backgroundColor: prompt.color }]}>
            {prompt.icon}
            <Text style={styles.quickPromptText}>{prompt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 36, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f3f4f6' },
  logo: { fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { color: '#666', fontSize: 13, marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  dotLive: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 4 },
  statusText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold' },
  mainIcon: { backgroundColor: '#ef4444', borderRadius: 20, padding: 18, marginBottom: 10 },
  welcome: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 12 },
  desc: { color: '#444', fontSize: 14, textAlign: 'center', marginHorizontal: 24, marginTop: 4, marginBottom: 18 },
  suggestionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: 8 },
  suggestionCard: { width: '46%', margin: '2%', borderRadius: 14, padding: 16, minHeight: 80, justifyContent: 'center', position: 'relative' },
  suggestionIcon: { marginBottom: 8 },
  suggestionLabel: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: '#f3f4f6' },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#f3f4f6', borderRadius: 8, marginRight: 8 },
  sendBtn: { backgroundColor: '#fb7185', borderRadius: 8, padding: 10 },
  quickPromptRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 10, backgroundColor: '#fff' },
  quickPrompt: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginTop: 8 },
  quickPromptText: { marginLeft: 5, fontSize: 13, fontWeight: 'bold', color: '#222' },
});