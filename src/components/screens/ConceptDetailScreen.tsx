import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Minus, Plus, RotateCcw, X } from 'lucide-react-native';
import { Category, Topic } from '../../types';
import { collectText, getConceptText, getMediaUrls } from './TopicDetailScreen';

interface ConceptDetailScreenProps {
  category: Category;
  topic: Topic;
  concept: any;
}

function getDescriptionSections(concept: any) {
  const dataMap = concept.data && !Array.isArray(concept.data) && typeof concept.data === 'object'
    ? concept.data
    : null;
  const sections = Array.isArray(concept.description)
    ? concept.description
    : Array.isArray(dataMap?.description)
      ? dataMap.description
      : Array.isArray(concept.data) ? concept.data : [];

  if (sections.length === 0) {
    return [{ header: '', text: getConceptText(concept), media: getMediaUrls(concept) }];
  }

  return sections.map((section: any, index: number) => ({
    header: section.header || section.title || section.question || `Section ${index + 1}`,
    text: [
      ...collectText(section.data),
      ...collectText(section.description),
      ...collectText(section.pointsData),
      ...collectText(section.points),
    ],
    media: getMediaUrls(section),
  }));
}

export const ConceptDetailScreen: React.FC<ConceptDetailScreenProps> = ({ category, topic, concept }) => {
  const [zoom, setZoom] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const mediaUrls = getMediaUrls(concept);
  const title = concept.name || concept.title || concept.conceptName || concept.concept_title || 'Concept';
  const textBlocks = getConceptText(concept);
  const descriptionSections = getDescriptionSections(concept);

  const changeZoom = (amount: number) => setZoom((current) => Math.min(3, Math.max(1, Number((current + amount).toFixed(1)))));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.crumb}><Text style={styles.crumbText}>{category.title} / {topic.title}</Text></View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CONCEPT</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Detailed explanation and reference material</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>Explanation</Text>
        {descriptionSections.map((section, sectionIndex) => (
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

      {mediaUrls.length > 0 && (
        <View style={styles.mediaSection}>
          <View style={styles.mediaHeader}>
            <Text style={styles.sectionTitle}>Reference Images</Text>
            <View style={styles.zoomControls}>
              <TouchableOpacity onPress={() => changeZoom(-0.25)} style={styles.zoomButton} accessibilityLabel="Zoom out"><Minus size={15} color="#cbd5e1" /></TouchableOpacity>
              <Text style={styles.zoomLabel}>{Math.round(zoom * 100)}%</Text>
              <TouchableOpacity onPress={() => changeZoom(0.25)} style={styles.zoomButton} accessibilityLabel="Zoom in"><Plus size={15} color="#cbd5e1" /></TouchableOpacity>
              <TouchableOpacity onPress={() => setZoom(1)} style={styles.zoomButton} accessibilityLabel="Reset zoom"><RotateCcw size={14} color="#cbd5e1" /></TouchableOpacity>
            </View>
          </View>
          <Text style={styles.mediaHint}>Click an image to open it larger.</Text>
          {mediaUrls.filter((url) => !descriptionSections.some((section) => section.media.includes(url))).map((url) => (
            <TouchableOpacity key={url} onPress={() => setActiveImage(url)} activeOpacity={0.85} style={styles.imageFrame}>
              <Image source={{ uri: url }} style={[styles.image, { transform: [{ scale: zoom }] }]} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      )}

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
  mediaSection: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12 },
  mediaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  mediaHint: { fontSize: 11, color: '#64748b', marginTop: 5, marginBottom: 10 },
  zoomControls: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  zoomButton: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  zoomLabel: { minWidth: 42, textAlign: 'center', fontSize: 10, color: '#cbd5e1' },
  imageFrame: { minHeight: 180, marginTop: 10, overflow: 'hidden', borderRadius: 8, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 280 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.96)' },
  closeButton: { position: 'absolute', top: 24, right: 20, zIndex: 2, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  modalScrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalImage: { width: 900, height: 700, maxWidth: '100%' },
});
