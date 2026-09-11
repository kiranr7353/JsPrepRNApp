import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { X, Sparkles, Send, Bot, User } from 'lucide-react-native';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const SAMPLE_PROMPTS = ['Quiz me on React Hooks', 'Explain Event Loop microtasks', 'Why React Native over Flutter?'];

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "👋 Hi! I'm your JsPrep AI Interview Coach. Ask me to explain any JavaScript or React concept, quiz you on AWS/DevOps architecture, or critique your interview answers!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) handleSend(initialPrompt);
  }, [initialPrompt, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      if (lower.includes('event loop') || lower.includes('microtask')) {
        reply = 'The Event Loop continuously checks if the Call Stack is empty. When clear, it empties the Microtask Queue (Promises, queueMicrotask) completely BEFORE processing a single Macrotask (setTimeout, setInterval). Microtasks starve Macrotasks!';
      } else if (lower.includes('closure')) {
        reply = 'A closure gives an inner function access to an outer function\'s scope even after the outer function has executed. Common use cases: data privacy, function factories, and currying.';
      } else if (lower.includes('react native') || lower.includes('flutter')) {
        reply = 'React Native leverages your existing React/TS skillset, uses native OEM components, and allows code sharing across Web and Mobile. Flutter compiles Dart to native arm code and renders with Impeller/Skia.';
      } else if (lower.includes('aws') || lower.includes('vpc')) {
        reply = 'Key AWS tip: Security Groups are stateful firewalls at the ENI/instance level (allow rules only), while NACLs are stateless firewalls at the subnet level (allow and deny rules evaluated in numerical order).';
      } else if (lower.includes('quiz') || lower.includes('question')) {
        reply = 'Senior JS Quiz:\n\nWhat is the output of:\n`console.log(typeof (function*(){})());`\n\nAnswer: "object" — calling a generator returns a generator object!';
      } else {
        reply = `Great question! Structure your response using STAR (Situation, Task, Action, Result) or state trade-offs: performance, readability, scalability. For "${text}", focus on memory implications and real-world edge cases.`;
      }
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: reply }]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 600);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiIcon}>
                <Sparkles size={16} color="#fbbf24" />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Interview Coach</Text>
                <Text style={styles.headerSub}>Gemini Powered</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Quick Prompts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll} contentContainerStyle={styles.promptsContent}>
            {SAMPLE_PROMPTS.map((p, i) => (
              <TouchableOpacity key={i} onPress={() => handleSend(p)} style={styles.promptChip}>
                <Text style={styles.promptChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Messages */}
          <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
            {messages.map((m) => (
              <View key={m.id} style={[styles.msgRow, m.sender === 'user' && styles.msgRowUser]}>
                <View style={[styles.avatar, m.sender === 'user' ? styles.avatarUser : styles.avatarAI]}>
                  {m.sender === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color="#fbbf24" />}
                </View>
                <View style={[styles.bubble, m.sender === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={[styles.bubbleText, m.sender === 'user' && styles.bubbleTextUser]}>{m.text}</Text>
                </View>
              </View>
            ))}
            {isTyping && (
              <View style={styles.typingRow}>
                <Text style={styles.typingText}>Coach is preparing advice...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputBar}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask a question or request a mock interview..."
              placeholderTextColor="#64748b"
              style={styles.input}
              multiline
            />
            <TouchableOpacity onPress={() => handleSend()} disabled={!input.trim()} style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}>
              <Send size={16} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.75)' },
  sheet: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '85%', overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b', backgroundColor: '#020617' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 10, color: '#94a3b8' },
  closeBtn: { padding: 6, borderRadius: 8, backgroundColor: '#1e293b' },
  promptsScroll: { maxHeight: 44, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  promptsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, alignItems: 'center' },
  promptChip: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  promptChipText: { fontSize: 11, color: '#cbd5e1' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarUser: { backgroundColor: '#2563eb' },
  avatarAI: { backgroundColor: 'rgba(245,158,11,0.2)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: '#2563eb', borderTopRightRadius: 4 },
  bubbleAI: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 12, color: '#e2e8f0', lineHeight: 18 },
  bubbleTextUser: { color: '#fff' },
  typingRow: { paddingLeft: 36 },
  typingText: { fontSize: 11, color: '#64748b', fontStyle: 'italic' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#1e293b', backgroundColor: '#020617' },
  input: { flex: 1, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 12, color: '#fff', maxHeight: 80 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
});
