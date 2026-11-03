import React, { useState, useEffect } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { X, Plus, Pencil, Trash2 } from 'lucide-react-native';
import { Category, Topic, UserProfile } from '../../types';
import { AddEditSectionModal } from '../admin/AddEditSectionModal';
import { FormDescription } from '../../services/adminApi';
import { fetchConceptsFromBackend } from '../../services/api';

interface ConceptDetailScreenProps {
  category: Category;
  topic: Topic;
  concept: any;
  user?: UserProfile;
}

interface ParsedPoint {
  header: string;
  text: string;
  code: string;
  snippets: string[];
}

interface ParsedDescription {
  header: string;
  body: string;
  code: string;
  note: string;
  snippets: string[];
  points: ParsedPoint[];
  hasTable: boolean;
  tableColumns: string[];
  tableData: any[];
}

interface ParsedSection {
  sectionId: number;
  descriptions: ParsedDescription[];
}

function getSnippetUrls(snippet: any): string[] {
  if (!Array.isArray(snippet)) return [];
  return snippet
    .map((s: any) => (typeof s === 'string' && s.startsWith('http') ? s : s?.url || s?.imageUrl || s?.downloadURL || ''))
    .filter(Boolean);
}

// Fallback URL collector for unknown/legacy shapes
function collectAllUrls(value: any, visited = new Set<any>()): string[] {
  if (visited.has(value)) return [];
  if (typeof value === 'string') return value.startsWith('http') ? [value] : [];
  if (Array.isArray(value)) { visited.add(value); return value.flatMap((v) => collectAllUrls(v, visited)); }
  if (!value || typeof value !== 'object') return [];
  visited.add(value);
  const direct = [value.url, value.imageUrl, value.downloadURL, value.snippet]
    .filter((u): u is string => typeof u === 'string' && u.startsWith('http'));
  return [...new Set([...direct, ...Object.values(value).flatMap((v) => collectAllUrls(v, visited))])];
}

function parseDescription(desc: any): ParsedDescription {
  return {
    header: desc?.header || desc?.title || '',
    body: typeof desc?.data === 'string' ? desc.data : (typeof desc?.description === 'string' ? desc.description : ''),
    code: typeof desc?.code === 'string' ? desc.code : '',
    note: typeof desc?.note === 'string' ? desc.note : '',
    snippets: getSnippetUrls(desc?.snippet),
    points: Array.isArray(desc?.pointsData)
      ? desc.pointsData
          .map((p: any) => ({
            header: typeof p === 'string' ? '' : (p?.pointHeader || ''),
            text: typeof p === 'string' ? p : (p?.value || p?.data || p?.text || ''),
            code: typeof p === 'string' ? '' : (p?.code || ''),
            snippets: getSnippetUrls(p?.snippet),
          }))
          .filter((p: ParsedPoint) => p.header || p.text || p.code || p.snippets.length > 0)
      : [],
    hasTable: Boolean(desc?.hasTable),
    tableColumns: Array.isArray(desc?.tableColumns) ? desc.tableColumns.map((c: any) => c?.value || String(c)) : [],
    tableData: Array.isArray(desc?.tableData) ? desc.tableData : [],
  };
}

function parseSections(concept: any): ParsedSection[] {
  const topLevel = concept?.data || concept?.description;

  if (Array.isArray(topLevel) && topLevel.length > 0) {
    const first = topLevel[0];

    // Canonical shape: concept.data = [{sectionId, description:[{id, header, data, snippet, pointsData}]}]
    if (first && (first.sectionId !== undefined || Array.isArray(first.description))) {
      return topLevel
        .map((section: any, idx: number) => ({
          sectionId: Number(section.sectionId ?? section.id ?? idx),
          descriptions: Array.isArray(section.description)
            ? section.description
                .slice()
                .sort((a: any, b: any) => Number(a.id ?? 0) - Number(b.id ?? 0))
                .map(parseDescription)
            : [parseDescription(section)],
        }))
        .sort((a, b) => a.sectionId - b.sectionId);
    }

    // Flat description array: [{id, header, data, snippet, pointsData}]
    // Use sectionId: 1 so edits re-save in the correct {description:[...], sectionId:1} format
    return [{
      sectionId: 1,
      descriptions: topLevel
        .slice()
        .sort((a: any, b: any) => Number(a.id ?? a.sectionId ?? 0) - Number(b.id ?? b.sectionId ?? 0))
        .map(parseDescription),
    }];
  }

  // Last-resort fallback
  const urls = collectAllUrls(concept);
  const body = typeof concept?.details === 'string' ? concept.details : (typeof concept?.content === 'string' ? concept.content : '');
  return [{ sectionId: 0, descriptions: [{ header: '', body, code: '', note: '', snippets: urls, points: [], hasTable: false, tableColumns: [], tableData: [] }] }];
}

// Returns the raw description items for a given section, handling both data shapes:
// Shape A (canonical): concept.data = [{sectionId, description:[...]}]
// Shape B (flat):      concept.data = [{id, header, data, snippet, ...}] — items ARE descriptions
function getRawDescriptions(concept: any, sectionId: number): any[] {
  const rawData = concept?.data;
  if (!Array.isArray(rawData) || rawData.length === 0) return [];
  const first = rawData[0];
  const isCanonical = first?.sectionId !== undefined || Array.isArray(first?.description);
  if (isCanonical) {
    const sec = rawData.find((s: any) => Number(s.sectionId ?? s.id ?? 0) === sectionId);
    const descs = Array.isArray(sec?.description) ? sec.description : [];
    // Sort by id to match the display order from parseSections
    return descs.slice().sort((a: any, b: any) => Number(a.id ?? 0) - Number(b.id ?? 0));
  }
  return rawData.slice().sort((a: any, b: any) => Number(a.id ?? a.sectionId ?? 0) - Number(b.id ?? b.sectionId ?? 0));
}

function getAllSectionsRaw(concept: any): Array<{ description: FormDescription[]; sectionId: number }> {
  const rawData = concept?.data;
  if (!Array.isArray(rawData) || rawData.length === 0) return [];
  const first = rawData[0];
  const isCanonical = first?.sectionId !== undefined || Array.isArray(first?.description);
  if (isCanonical) {
    return rawData.map((section: any, idx: number) => ({
      sectionId: Number(section.sectionId ?? section.id ?? idx + 1),
      description: Array.isArray(section.description)
        ? section.description
            .slice()
            .sort((a: any, b: any) => Number(a.id ?? 0) - Number(b.id ?? 0))
            .map((d: any, i: number) => rawDescToFormDesc(d, i + 1))
        : [],
    }));
  }
  return [{
    sectionId: 1,
    description: rawData
      .slice()
      .sort((a: any, b: any) => Number(a.id ?? a.sectionId ?? 0) - Number(b.id ?? b.sectionId ?? 0))
      .map((d: any, i: number) => rawDescToFormDesc(d, i + 1)),
  }];
}

function rawDescToFormDesc(desc: any, id: number): FormDescription {
  return {
    id: Number(desc?.id ?? id),
    header: desc?.header || '',
    data: desc?.data || '',
    snippet: Array.isArray(desc?.snippet) ? desc.snippet : [],
    imageUploaded: Boolean(desc?.imageUploaded),
    hasPoints: Boolean(desc?.hasPoints || (Array.isArray(desc?.pointsData) && desc.pointsData.length > 0)),
    pointsData: Array.isArray(desc?.pointsData)
      ? desc.pointsData.map((p: any, i: number) => ({
          id: Number(p?.id ?? i + 1),
          pointHeader: p?.pointHeader || '',
          value: p?.value || '',
          code: p?.code || '',
          snippet: Array.isArray(p?.snippet) ? p.snippet : [],
        }))
      : [],
    hasTable: Boolean(desc?.hasTable),
    tableColumns: Array.isArray(desc?.tableColumns) ? desc.tableColumns : [{ value: '' }, { value: '' }],
    tableData: Array.isArray(desc?.tableData) ? desc.tableData : [],
    note: desc?.note || '',
  };
}

export const ConceptDetailScreen: React.FC<ConceptDetailScreenProps> = ({ category, topic, concept, user }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [liveConcept, setLiveConcept] = useState<any>(concept);
  const [sectionModal, setSectionModal] = useState<{
    visible: boolean;
    mode: 'addSection' | 'editDescription' | 'deleteDescription';
    sectionId: number;
    existingData: FormDescription[];
    editIndex: number;
    allSectionsRaw: Array<{ description: FormDescription[]; sectionId: number }>;
  }>({ visible: false, mode: 'addSection', sectionId: 0, existingData: [], editIndex: 0, allSectionsRaw: [] });

  // Keep liveConcept in sync if the parent concept prop changes (navigation)
  useEffect(() => { setLiveConcept(concept); }, [concept]);

  const refreshConcept = async (successMessage: string) => {
    try {
      const concepts = await fetchConceptsFromBackend(topic.backendTopicId || topic.id, category.id, true);
      const titleMatch = concept?.title || concept?.name || concept?.conceptName || concept?.concept_title || '';
      const updated = concepts.find((c: any) => {
        const n = c.title || c.name || c.conceptName || c.concept_title || '';
        return n.toLowerCase() === titleMatch.toLowerCase();
      });
      if (updated) setLiveConcept(updated);
    } catch { /* keep existing data */ }
    Alert.alert('Success', successMessage);
  };

  const title = liveConcept?.title || liveConcept?.name || liveConcept?.conceptName || liveConcept?.concept_title || 'Concept';
  const sections = parseSections(liveConcept);

  const renderImage = (url: string) => (
    <TouchableOpacity key={url} onPress={() => setActiveImage(url)} activeOpacity={0.85} style={styles.inlineImageFrame}>
      <Image source={{ uri: url }} style={styles.inlineImage} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.crumb}>
        <Text style={styles.crumbText}>{category.title} / {topic.title}</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>CONCEPT</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Detailed explanation and reference material</Text>
      </View>

      {user?.isAdmin && (
        <TouchableOpacity
          onPress={() => {
            setSectionModal({
              visible: true, mode: 'addSection',
              sectionId: sections.length > 0 ? sections[sections.length - 1].sectionId + 1 : 1,
              existingData: [], editIndex: 0,
              allSectionsRaw: getAllSectionsRaw(liveConcept),
            });
          }}
          style={styles.addSectionBtn}
        >
          <Plus size={14} color="#fff" />
          <Text style={styles.addSectionText}>Add Section</Text>
        </TouchableOpacity>
      )}

      <View style={styles.contentCard}>
        {sections.map((section, sIdx) =>
          section.descriptions.map((desc, dIdx) => (
            <View key={`${sIdx}-${dIdx}`} style={styles.descriptionBlock}>
              <View style={styles.descBlockHeader}>
                {desc.header ? <Text style={styles.descriptionHeader}>{desc.header}</Text> : <View />}
                {user?.isAdmin && (
                  <View style={styles.descAdminRow}>
                    <TouchableOpacity
                      onPress={() => {
                        const rawDescriptions = getRawDescriptions(liveConcept, section.sectionId);
                        setSectionModal({
                          visible: true, mode: 'editDescription',
                          sectionId: section.sectionId,
                          existingData: rawDescriptions.map((d: any, i: number) => rawDescToFormDesc(d, i + 1)),
                          editIndex: dIdx,
                          allSectionsRaw: getAllSectionsRaw(liveConcept),
                        });
                      }}
                      style={styles.descAdminBtn}
                    >
                      <Pencil size={11} color="#60a5fa" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        const rawDescriptions = getRawDescriptions(liveConcept, section.sectionId);
                        setSectionModal({
                          visible: true, mode: 'deleteDescription',
                          sectionId: section.sectionId,
                          existingData: rawDescriptions.map((d: any, i: number) => rawDescToFormDesc(d, i + 1)),
                          editIndex: dIdx,
                          allSectionsRaw: getAllSectionsRaw(liveConcept),
                        });
                      }}
                      style={styles.descAdminBtn}
                    >
                      <Trash2 size={11} color="#f87171" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {desc.body ? <Text style={styles.body}>{desc.body}</Text> : null}

              {/* Description-level code block */}
              {desc.code ? (
                <View style={styles.codeBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={styles.codeText}>{desc.code}</Text>
                  </ScrollView>
                </View>
              ) : null}

              {/* Note */}
              {desc.note ? (
                <View style={styles.noteBox}>
                  <Text style={styles.noteLabel}>Note: </Text>
                  <Text style={styles.noteText}>{desc.note}</Text>
                </View>
              ) : null}

              {/* Snippet images inline — right after the body text of this description */}
              {desc.snippets.length > 0 && (
                <View style={styles.snippetGroup}>
                  <Text style={styles.snippetLabel}>Code Snippets</Text>
                  {desc.snippets.map(renderImage)}
                </View>
              )}

              {/* Points with pointHeader, per-point code block, and inline snippet images */}
              {desc.points.map((point, pIdx) => (
                <View key={`p-${pIdx}`} style={styles.pointBlock}>
                  {point.header ? <Text style={styles.pointHeader}>{point.header}</Text> : null}
                  {point.text ? <Text style={styles.point}>{`• ${point.text}`}</Text> : null}
                  {point.code ? (
                    <View style={styles.codeBox}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Text style={styles.codeText}>{point.code}</Text>
                      </ScrollView>
                    </View>
                  ) : null}
                  {point.snippets.map(renderImage)}
                </View>
              ))}

              {/* Table */}
              {desc.hasTable && desc.tableColumns.length > 0 && (
                <View style={styles.tableContainer}>
                  <View style={styles.tableRow}>
                    {desc.tableColumns.map((col, cIdx) => (
                      <Text key={cIdx} style={[styles.tableCell, styles.tableHeaderCell]}>{col}</Text>
                    ))}
                  </View>
                  {desc.tableData.map((row, rIdx) => (
                    <View key={rIdx} style={styles.tableRow}>
                      {Object.values(row).map((cell, cIdx) => (
                        <Text key={cIdx} style={styles.tableCell}>{String(cell)}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </View>

      <AddEditSectionModal
        visible={sectionModal.visible}
        mode={sectionModal.mode}
        categoryId={category.id}
        topicId={topic.backendTopicId || topic.id}
        conceptTitle={title}
        sectionId={sectionModal.sectionId}
        existingData={sectionModal.existingData}
        editDescriptionIndex={sectionModal.editIndex}
        allSectionsRaw={sectionModal.allSectionsRaw}
        onClose={() => setSectionModal((p) => ({ ...p, visible: false }))}
        onSuccess={() => {
          setSectionModal((p) => ({ ...p, visible: false }));
          const msg =
            sectionModal.mode === 'addSection'
              ? 'Section added successfully!'
              : sectionModal.mode === 'editDescription'
              ? 'Description updated successfully!'
              : 'Description deleted successfully!';
          refreshConcept(msg);
        }}
      />

      <Modal visible={activeImage !== null} transparent animationType="fade" onRequestClose={() => setActiveImage(null)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.closeButton} onPress={() => setActiveImage(null)} accessibilityLabel="Close image viewer">
            <X size={22} color="#fff" />
          </Pressable>
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
  addSectionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 4 },
  addSectionText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  contentCard: { padding: 16, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12 },
  descriptionBlock: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1e293b' },
  descBlockHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  descriptionHeader: { fontSize: 13, color: '#f8fafc', fontWeight: '700', flex: 1 },
  descAdminRow: { flexDirection: 'row', gap: 4 },
  descAdminBtn: { padding: 5, borderRadius: 6, backgroundColor: '#1e293b' },
  body: { fontSize: 13, color: '#cbd5e1', lineHeight: 21, marginTop: 4 },
  snippetGroup: { marginTop: 10 },
  snippetLabel: { fontSize: 11, color: '#60a5fa', fontWeight: '700', marginBottom: 6 },
  pointBlock: { marginTop: 6 },
  pointHeader: { fontSize: 12, color: '#f8fafc', fontWeight: '700', marginBottom: 2 },
  point: { fontSize: 12, color: '#60a5fa', lineHeight: 19 },
  codeBox: { backgroundColor: '#020617', borderRadius: 8, borderWidth: 1, borderColor: '#1e293b', marginTop: 8, padding: 12 },
  codeText: { fontSize: 11, color: '#93c5fd', fontFamily: 'monospace', lineHeight: 18 },
  noteBox: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, backgroundColor: 'rgba(251,191,36,0.07)', borderLeftWidth: 3, borderLeftColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  noteLabel: { fontSize: 12, color: '#fbbf24', fontWeight: '700' },
  noteText: { fontSize: 12, color: '#cbd5e1', lineHeight: 18, flex: 1 },
  inlineImageFrame: { minHeight: 160, marginTop: 8, overflow: 'hidden', borderRadius: 8, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
  inlineImage: { width: '100%', height: 260 },
  tableContainer: { marginTop: 10, borderWidth: 1, borderColor: '#334155', borderRadius: 6, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  tableCell: { flex: 1, fontSize: 11, color: '#cbd5e1', padding: 8 },
  tableHeaderCell: { color: '#f8fafc', fontWeight: '700', backgroundColor: '#1e293b' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.96)' },
  closeButton: { position: 'absolute', top: 24, right: 20, zIndex: 2, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  modalScrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalImage: { width: 900, height: 700, maxWidth: '100%' },
});
