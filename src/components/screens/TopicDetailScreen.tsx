import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BookOpen, CircleCheck } from 'lucide-react-native';
import { Category, Topic } from '../../types';
import { fetchConceptsFromBackend } from '../../services/api';
import { getTopicStudyGuide } from '../../data/topicDetails';

interface TopicDetailScreenProps {
  category: Category;
  topic: Topic;
  onSelectConcept: (concept: any) => void;
}

export function collectText(value: unknown): string[] {
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)];
  if (Array.isArray(value)) return value.flatMap(collectText);
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;
  const fields = ['data', 'text', 'content', 'value', 'point', 'points', 'pointsData', 'description', 'explanation', 'title', 'header'];
  return fields.flatMap((field) => collectText(record[field]));
}

export function getConceptText(concept: any, guideNote?: { description: string; points: string[] }) {
  const values = [
    ...collectText(concept.data),
    ...collectText(concept.description),
    ...collectText(concept.details),
    ...collectText(concept.content),
    ...collectText(concept.pointsData),
    ...collectText(concept.points),
    ...collectText(concept.keyPoints),
    ...collectText(concept.bullets),
  ];
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length > 0) return uniqueValues;
  if (guideNote) return [guideNote.description, ...guideNote.points];
  return ['Understand the core principles, practical usage, and interview considerations for this concept.'];
}

export function getMediaUrls(concept: any): string[] {
  const findUrls = (value: any): string[] => {
    if (typeof value === 'string') return value.startsWith('http') ? [value] : [];
    if (Array.isArray(value)) return value.flatMap(findUrls);
    if (!value || typeof value !== 'object') return [];
    return [value.url, value.imageUrl, value.downloadURL].filter((url): url is string => typeof url === 'string')
      .concat(Object.values(value).flatMap(findUrls));
  };
  return [...new Set(findUrls(concept))];
}

export const TopicDetailScreen: React.FC<TopicDetailScreenProps> = ({ category, topic, onSelectConcept }) => {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchConceptsFromBackend(topic.backendTopicId || topic.id, category.id)
      .then((items) => {
        if (!mounted) return;
        setConcepts(items);
        setIsLive(items.length > 0);
      })
      .catch(() => {
        if (mounted) setConcepts([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [category.id, topic.backendTopicId, topic.id]);

  const fallbackConcepts = topic.subtopics.map((name) => ({ name, description: 'Core concept for this topic.' }));
  const visibleConcepts = concepts.length > 0 ? concepts : fallbackConcepts;
  const studyGuide = getTopicStudyGuide(topic.id, category.id, topic.title);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.iconBox}><BookOpen size={22} color="#60a5fa" /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>{category.title.toUpperCase()}</Text>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.level}>{topic.level}</Text>
        </View>
      </View>

      <View style={styles.overviewCard}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{studyGuide.detailedOverview || topic.summary}</Text>
        <View style={styles.statusRow}>
          {isLoading ? <ActivityIndicator size="small" color="#60a5fa" /> : <CircleCheck size={14} color={isLive ? '#34d399' : '#fbbf24'} />}
          <Text style={styles.status}>{isLoading ? 'Loading concepts from API...' : isLive ? 'Live concepts loaded from API' : 'Showing local concepts'}</Text>
        </View>
      </View>

      <View style={styles.takeawaysCard}>
        <Text style={styles.sectionTitle}>Key Takeaways</Text>
        {studyGuide.keyTakeaways.map((takeaway, index) => (
          <View key={`${takeaway}-${index}`} style={styles.takeawayRow}>
            <CircleCheck size={14} color="#34d399" />
            <Text style={styles.takeawayText}>{takeaway}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Concepts in this topic</Text>
        <Text style={styles.count}>{visibleConcepts.length}</Text>
      </View>

      <View style={styles.conceptList}>
        {visibleConcepts.map((concept, index) => {
          const name = concept.name || concept.title || concept.conceptName || concept.concept_title || `Concept ${index + 1}`;
          const guideNote = studyGuide.subtopicNotes.find((note) => note.name.toLowerCase() === name.toLowerCase());
          const textBlocks = getConceptText(concept, guideNote);
          const mediaUrls = getMediaUrls(concept);
          return (
            <TouchableOpacity key={`${name}-${index}`} onPress={() => onSelectConcept(concept)} activeOpacity={0.8} style={styles.conceptCard}>
              <View style={styles.conceptNumber}><Text style={styles.numberText}>{String(index + 1).padStart(2, '0')}</Text></View>
              <View style={styles.conceptCopy}>
                <Text style={styles.conceptTitle}>{name}</Text>
                {textBlocks.map((text, textIndex) => <Text key={`${text}-${textIndex}`} style={textIndex === 0 ? styles.conceptDescription : styles.conceptPoints}>{textIndex === 0 ? text : `• ${text}`}</Text>)}
                {mediaUrls.map((url: string) => <Image key={url} source={{ uri: url }} style={styles.snippetImage} resizeMode="contain" />)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  hero: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 14 },
  iconBox: { width: 46, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(96,165,250,0.14)', marginRight: 12 },
  heroCopy: { flex: 1 },
  eyebrow: { fontSize: 10, color: '#60a5fa', fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 21, color: '#f8fafc', fontWeight: '800', marginTop: 4 },
  level: { fontSize: 11, color: '#fbbf24', fontWeight: '700', marginTop: 4 },
  overviewCard: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12 },
  sectionTitle: { fontSize: 15, color: '#f8fafc', fontWeight: '800' },
  overview: { fontSize: 13, color: '#94a3b8', lineHeight: 20, marginTop: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  status: { fontSize: 11, color: '#64748b' },
  takeawaysCard: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, gap: 9 },
  takeawayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  takeawayText: { flex: 1, fontSize: 12, color: '#cbd5e1', lineHeight: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { fontSize: 11, color: '#60a5fa', fontWeight: '700' },
  conceptList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  conceptCard: { width: '48%', minHeight: 88, flexDirection: 'row', padding: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10 },
  conceptNumber: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', marginRight: 9 },
  numberText: { fontSize: 10, color: '#60a5fa', fontWeight: '800' },
  conceptCopy: { flex: 1 },
  conceptTitle: { fontSize: 12, color: '#f8fafc', fontWeight: '700' },
  conceptDescription: { fontSize: 10, color: '#94a3b8', lineHeight: 15, marginTop: 5 },
  conceptPoints: { fontSize: 10, color: '#60a5fa', lineHeight: 15, marginTop: 5 },
  snippetImage: { width: '100%', height: 120, marginTop: 8, borderRadius: 6, backgroundColor: '#020617' },
});
