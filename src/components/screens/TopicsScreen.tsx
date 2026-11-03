import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { Category, Topic } from '../../types';

interface TopicsScreenProps {
  category: Category;
  onOpenQuestions: () => void;
  onSelectTopic: (topic: Topic) => void;
}

export const TopicsScreen: React.FC<TopicsScreenProps> = ({ category, onOpenQuestions, onSelectTopic }) => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.intro}>
      <View style={styles.iconBox}>
        <BookOpen size={20} color="#60a5fa" />
      </View>
      <View style={styles.introCopy}>
        <Text style={styles.eyebrow}>TRACK CURRICULUM</Text>
        <Text style={styles.title}>{category.title} Topics</Text>
        <Text style={styles.description}>{category.description}</Text>
      </View>
    </View>

    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>Topics & Concepts</Text>
        <Text style={styles.sectionSubtitle}>Build your foundation before practicing questions.</Text>
      </View>
      <Text style={styles.count}>{category.topics.length} topics</Text>
    </View>

    <View style={styles.topicList}>
      {category.topics.map((topic, index) => (
        <TouchableOpacity key={topic.id} style={styles.topicCard} onPress={() => onSelectTopic(topic)} activeOpacity={0.8}>
          {topic.imageUrl ? (
            <Image source={{ uri: topic.imageUrl }} style={styles.topicImage} resizeMode="cover" />
          ) : null}
          <View style={styles.topicHeader}>
            <View style={styles.number}><Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text></View>
            <View style={styles.topicHeading}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.level}>{topic.level}</Text>
            </View>
          </View>
          <Text style={styles.summary}>{topic.summary}</Text>
          <View style={styles.concepts}>
            {topic.subtopics.map((concept) => (
              <View key={concept} style={styles.conceptPill}>
                <Text style={styles.conceptText}>{concept}</Text>
              </View>
            ))}
          </View>
          <View style={styles.topicAction}>
            <Text style={styles.topicActionText}>View concepts</Text>
            <ChevronRight size={14} color="#60a5fa" />
          </View>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity onPress={onOpenQuestions} style={styles.questionsButton} activeOpacity={0.8}>
      <Text style={styles.questionsButtonText}>View {category.title} Interview Q&A</Text>
      <ChevronRight size={17} color="#fff" />
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  intro: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 14 },
  iconBox: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(96,165,250,0.14)', marginRight: 12 },
  introCopy: { flex: 1 },
  eyebrow: { fontSize: 10, color: '#60a5fa', fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 21, color: '#f8fafc', fontWeight: '800', marginTop: 4 },
  description: { fontSize: 12, color: '#94a3b8', lineHeight: 18, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, color: '#f8fafc', fontWeight: '800' },
  sectionSubtitle: { fontSize: 11, color: '#64748b', marginTop: 3 },
  count: { fontSize: 11, color: '#60a5fa', fontWeight: '700' },
  topicList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  topicCard: { width: '48%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, overflow: 'hidden' },
  topicImage: { width: '100%', height: 90 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 14 },
  number: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', marginRight: 10 },
  numberText: { fontSize: 11, color: '#60a5fa', fontWeight: '800' },
  topicHeading: { flex: 1 },
  topicTitle: { fontSize: 14, color: '#f8fafc', fontWeight: '700' },
  level: { fontSize: 10, color: '#fbbf24', fontWeight: '700', marginTop: 3 },
  summary: { fontSize: 12, color: '#94a3b8', lineHeight: 18, marginTop: 12, paddingHorizontal: 14 },
  concepts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12, paddingHorizontal: 14 },
  conceptPill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: '#1e293b' },
  conceptText: { fontSize: 10, color: '#cbd5e1' },
  topicAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 12, paddingHorizontal: 14, paddingBottom: 14 },
  topicActionText: { fontSize: 11, color: '#60a5fa', fontWeight: '700' },
  questionsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13, borderRadius: 9, backgroundColor: '#2563eb' },
  questionsButtonText: { fontSize: 12, color: '#fff', fontWeight: '700' },
});
