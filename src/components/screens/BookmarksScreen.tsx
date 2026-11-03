import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Bookmark, Trash2, BookOpen, Code2, Database, RefreshCw, CheckCircle2, UploadCloud } from 'lucide-react-native';
import { QuestionAnswer, ProgrammingQuestion } from '../../types';
import { QUESTIONS_ANSWERS, PROGRAMMING_QUESTIONS } from '../../data/prepData';
import { seedCurriculumToFirestore } from '../../services/firebase';

interface BookmarksScreenProps {
  bookmarkedQAIds: string[];
  bookmarkedPQAIds: string[];
  onToggleBookmark: (id: string, type: 'qa' | 'pqa') => void;
  onSelectQuestion: (question: QuestionAnswer) => void;
  onNavigateTab: (tab: any) => void;
  isFirebaseConnected: boolean;
  questions?: QuestionAnswer[];
  programmingQuestions?: ProgrammingQuestion[];
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  bookmarkedQAIds, bookmarkedPQAIds, onToggleBookmark, onSelectQuestion, onNavigateTab,
  questions = QUESTIONS_ANSWERS, programmingQuestions = PROGRAMMING_QUESTIONS,
}) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'coding'>('qa');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const bookmarkedQuestions = questions.filter((q) => bookmarkedQAIds.includes(q.id));
  const bookmarkedProblems = programmingQuestions.filter((p) => bookmarkedPQAIds.includes(p.id));

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing to Firebase Firestore...');
    try {
      const result = await seedCurriculumToFirestore();
      setSyncStatus(result.success ? `${result.count} items synced!` : result.message);
    } catch (err: any) {
      setSyncStatus(`Notice: ${err?.message || 'Cached locally'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Firebase Status */}
      <View style={styles.firebaseCard}>
        <View style={styles.firebaseRow}>
          <View style={styles.firebaseLeft}>
            <Database size={16} color="#34d399" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.firebaseTitle}>Firebase Firestore</Text>
              <Text style={styles.firebaseSub}>Project: jsprep-ed0c8</Text>
            </View>
          </View>
          <View style={styles.firebaseRight}>
            <TouchableOpacity onPress={handleSync} disabled={isSyncing} style={styles.syncBtn}>
              {isSyncing ? <ActivityIndicator size="small" color="#60a5fa" /> : <UploadCloud size={12} color="#60a5fa" />}
              <Text style={styles.syncBtnText}>{isSyncing ? 'Syncing...' : 'Sync'}</Text>
            </TouchableOpacity>
            <View style={styles.connectedBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          </View>
        </View>
        {syncStatus && (
          <View style={styles.syncStatus}>
            <CheckCircle2 size={14} color="#34d399" />
            <Text style={styles.syncStatusText}>{syncStatus}</Text>
          </View>
        )}
      </View>

      {/* Sub Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('qa')}
          style={[styles.tabBtn, activeTab === 'qa' && styles.tabBtnActive]}
        >
          <BookOpen size={14} color={activeTab === 'qa' ? '#fff' : '#94a3b8'} />
          <Text style={[styles.tabBtnText, activeTab === 'qa' && styles.tabBtnTextActive]}>
            Interview Q&A ({bookmarkedQuestions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('coding')}
          style={[styles.tabBtn, activeTab === 'coding' && styles.tabBtnActive]}
        >
          <Code2 size={14} color={activeTab === 'coding' ? '#fff' : '#94a3b8'} />
          <Text style={[styles.tabBtnText, activeTab === 'coding' && styles.tabBtnTextActive]}>
            Coding ({bookmarkedProblems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {activeTab === 'qa' ? (
        bookmarkedQuestions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Bookmark size={32} color="#475569" />
            <Text style={styles.emptyTitle}>No saved questions yet</Text>
            <Text style={styles.emptySub}>Star questions while browsing to revise them.</Text>
            <TouchableOpacity onPress={() => onNavigateTab('qa')} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Browse Interview Questions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {bookmarkedQuestions.map((q) => (
              <View key={q.id} style={styles.itemCard}>
                <TouchableOpacity
                  onPress={() => { onSelectQuestion(q); onNavigateTab('qa'); }}
                  style={styles.itemLeft}
                >
                  <View style={styles.itemMeta}>
                    <View style={styles.diffPill}>
                      <Text style={styles.diffPillText}>{q.difficulty}</Text>
                    </View>
                    <Text style={styles.itemCat}>{q.categoryName}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>{q.question}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onToggleBookmark(q.id, 'qa')} style={styles.deleteBtn}>
                  <Trash2 size={16} color="#f87171" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )
      ) : (
        bookmarkedProblems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Code2 size={32} color="#475569" />
            <Text style={styles.emptyTitle}>No saved coding problems</Text>
            <Text style={styles.emptySub}>Bookmark algorithms to practice later.</Text>
            <TouchableOpacity onPress={() => onNavigateTab('programming')} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Explore Coding Challenges</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {bookmarkedProblems.map((p) => (
              <View key={p.id} style={styles.itemCard}>
                <TouchableOpacity onPress={() => onNavigateTab('programming')} style={styles.itemLeft}>
                  <View style={styles.itemMeta}>
                    <View style={[styles.diffPill, { backgroundColor: 'rgba(167,139,250,0.2)' }]}>
                      <Text style={[styles.diffPillText, { color: '#c4b5fd' }]}>{p.difficulty}</Text>
                    </View>
                    <Text style={styles.itemCat}>{p.category}</Text>
                  </View>
                  <Text style={styles.itemTitle}>{p.title}</Text>
                  <Text style={styles.itemDesc} numberOfLines={1}>{p.description}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onToggleBookmark(p.id, 'pqa')} style={styles.deleteBtn}>
                  <Trash2 size={16} color="#f87171" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  firebaseCard: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 12, gap: 8 },
  firebaseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  firebaseLeft: { flexDirection: 'row', alignItems: 'center' },
  firebaseTitle: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
  firebaseSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  firebaseRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  syncBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 5,
    backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
    borderRadius: 8,
  },
  syncBtnText: { fontSize: 11, color: '#60a5fa', fontWeight: '600' },
  connectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(52,211,153,0.1)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.2)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },
  connectedText: { fontSize: 11, color: '#34d399', fontWeight: '600' },
  syncStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(30,58,138,0.4)', borderRadius: 8, padding: 8 },
  syncStatusText: { fontSize: 11, color: '#93c5fd', flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 4, gap: 4 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#2563eb' },
  tabBtnText: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold' },
  tabBtnTextActive: { color: '#fff' },
  emptyBox: { alignItems: 'center', paddingVertical: 48, backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', gap: 8 },
  emptyTitle: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
  emptySub: { fontSize: 11, color: '#64748b' },
  emptyBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginTop: 4 },
  emptyBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  list: { gap: 10 },
  itemCard: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  itemLeft: { flex: 1 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  diffPill: { backgroundColor: 'rgba(96,165,250,0.2)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  diffPillText: { fontSize: 9, fontWeight: 'bold', color: '#93c5fd' },
  itemCat: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: '#f1f5f9', lineHeight: 18 },
  itemDesc: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  deleteBtn: { padding: 6 },
});
