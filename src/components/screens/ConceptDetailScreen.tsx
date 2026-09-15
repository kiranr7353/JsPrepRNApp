import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Category, Topic } from '../../types';
import { collectText, getConceptText, getMediaUrls } from './TopicDetailScreen';

interface ConceptDetailScreenProps {
  category: Category;
  topic: Topic;
  concept: any;
}

interface DescriptionSection {
  header: string;
  text: string[];
  media: string[];
}

function getDescriptionSections(concept: any): DescriptionSection[] {
  const dataMap = concept.data && !Array.isArray(concept.data) && typeof concept.data === 'object'
    ? concept.data
    : null;
  const sections = Array.isArray(concept.description)
    ? concept.description
    : Array.isArray(dataMap?.description)
      ? dataMap.description
      : Array.isArray(concept.data)
        ? concept.data
        : dataMap
          ? Object.values(dataMap).flatMap((entry: any) => Array.isArray(entry?.description) ? entry.description : [entry])
          : [];

  if (sections.length === 0) {
    return [{ header: '', text: getConceptText(concept), media: getMediaUrls(concept) }];
  }

  return sections
    .map((section: any, index: number) => ({ section, index }))
    .sort((a: { section: any; index: number }, b: { section: any; index: number }) => {
      const aOrder = Number(a.section.sectionId ?? a.section.displayOrder ?? a.section.order ?? a.section.id);
      const bOrder = Number(b.section.sectionId ?? b.section.displayOrder ?? b.section.order ?? b.section.id);
      const aHasOrder = Number.isFinite(aOrder);
      const bHasOrder = Number.isFinite(bOrder);
      if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
      if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ section }: { section: any }, index: number) => ({
    header: section.header
      || section.title
      || section.question
      || section.data?.header
      || (Array.isArray(section.description) ? section.description.find((part: any) => part?.header)?.header : '')
      || '',
    text: (Array.isArray(section.description) ? section.description : [section]).flatMap((part: any) => [
      ...collectText(part.data),
      ...collectText(part.description),
      ...collectText(part.pointsData),
      ...collectText(part.points),
      ...collectText(part.code),
      ...collectText(part.snippet),
    ]),
    media: getMediaUrls(section),
    }));
}

export const ConceptDetailScreen: React.FC<ConceptDetailScreenProps> = ({ category, topic, concept }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const title = concept.name || concept.title || concept.conceptName || concept.concept_title || 'Concept';
  const textBlocks = getConceptText(concept);
  const descriptionSections = getDescriptionSections(concept);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.crumb}><Text style={styles.crumbText}>{category.title} / {topic.title}</Text></View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CONCEPT</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Detailed explanation and reference material</Text>
      </View>

      <View style={styles.contentCard}>
        {descriptionSections.map((section: DescriptionSection, sectionIndex: number) => (
          <View key={`${section.header}-${sectionIndex}`} style={styles.descriptionSection}>
            {section.header ? <Text style={styles.descriptionHeader}>{section.header}</Text> : null}
            {section.text.map((text: string, textIndex: number) => (
              <Text key={`${text}-${textIndex}`} style={textIndex === 0 ? styles.body : styles.point}>{textIndex === 0 ? text : `• ${text}`}</Text>
            ))}
            {section.media.map((url: string) => (
              <TouchableOpacity key={url} onPress={() => setActiveImage(url)} activeOpacity={0.85} style={styles.inlineImageFrame}>
                <Image source={{ uri: url }} style={styles.inlineImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        {descriptionSections.length === 1 && !descriptionSections[0].header && textBlocks.length === 0 ? (
          <Text style={styles.body}>No description content available.</Text>
        ) : null}
      </View>

      <Modal visible={activeImage !== null} transparent animationType="fade" onRequestClose={() => setActiveImage(null)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.closeButton} onPress={() => setActiveImage(null)} accessibilityLabel="Close image viewer"><X size={22} color="#fff" /></Pressable>
          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            contentContainerStyle={styles.modalScrollContent}
            centerContent
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {activeImage && <Image source={{ uri: activeImage }} style={styles.modalImage} resizeMode="contain" />}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  crumb: { paddingHorizontal: 2 },
  crumbText: { fontSize: 11, color: '#64748b' },
  hero: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 14 },
  eyebrow: { fontSize: 10, color: '#60a5fa', fontWeight: '800', letterSpacing: 1 },
  title: { fontSize: 22, color: '#f8fafc', fontWeight: '800', marginTop: 5 },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 5 },
  contentCard: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12 },
  sectionTitle: { fontSize: 15, color: '#f8fafc', fontWeight: '800' },
  body: { fontSize: 13, color: '#cbd5e1', lineHeight: 21, marginTop: 10 },
  point: { fontSize: 12, color: '#60a5fa', lineHeight: 19, marginTop: 8 },
  descriptionSection: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1e293b' },
  descriptionHeader: { fontSize: 13, color: '#f8fafc', fontWeight: '700', marginBottom: 4 },
  inlineImageFrame: { minHeight: 160, marginTop: 10, overflow: 'hidden', borderRadius: 8, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  inlineImage: { width: '100%', height: 260 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.96)' },
  closeButton: { position: 'absolute', top: 24, right: 20, zIndex: 2, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  modalScrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalImage: { width: 900, height: 700, maxWidth: '100%' },
});
