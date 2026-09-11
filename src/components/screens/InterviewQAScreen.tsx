import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, FlatList,
} from 'react-native';
import { Search, Bookmark, ChevronDown, ChevronUp, Eye, EyeOff, Filter, RefreshCw } from 'lucide-react-native';
import { Category, QuestionAnswer } from '../../types';
import { QUESTIONS_ANSWERS as FALLBACK_QA, CATEGORIES as FALLBACK_CATEGORIES } from '../../data/prepData';
import { fetchInterviewQAFromBackend } from '../../services/api';

interface InterviewQAScreenProps {
  initialCategoryId?: string;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, type: 'qa') => void;
  selectedQuestion?: QuestionAnswer | null;
  categories?: Category[];
  questions?: QuestionAnswer[];
  onRefresh?: () => void;
}

const PAGE_SIZE = 40;

export const InterviewQAScreen: React.FC<InterviewQAScreenProps> = ({
  initialCategoryId, bookmarkedIds, onToggleBookmark, selectedQuestion,
  categories = FALLBACK_CATEGORIES, questions = FALLBACK_QA, onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Junior' | 'Mid' | 'Senior'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(selectedQuestion?.id ?? questions[0]?.id ?? null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [allQuestions, setAllQuestions] = useState<QuestionAnswer[]>(questions);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => { if (questions.length > 0) setAllQuestions(questions); }, [questions]);
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [selectedCategory, selectedDifficulty, searchQuery]);

  useEffect(() => {
    if (selectedCategory === 'all') return;
    let mounted = true;
    async function load() {
      const existing = allQuestions.filter((q) => q.categoryId === selectedCategory);
      if (existing.length === 0) {
        setIsLoadingCategory(true);
        try {
          const remote = await fetchInterviewQAFromBackend(selectedCategory);
          if (mounted && remote.length > 0) {
            setAllQuestions((prev) => {
              const next = [...prev];
              remote.forEach((rq) => { if (!next.some((n) => n.id === rq.id)) next.push(rq); });
              return next;
            });
          }
        } catch (err) { console.warn(err); }
        finally { if (mounted) setIsLoadingCategory(false); }
      }
    }
    load();
    return () => { mounted = false; };
  }, [selectedCategory]);

  const filteredQuestions = allQuestions.filter((q) => {
    const matchCat = selectedCategory === 'all' || q.categoryId === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchDiff && matchSearch;
  });

  const visible = filteredQuestions.slice(0, visibleCount);

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={14} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search questions, concepts, tags..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        <TouchableOpacity
          onPress={() => setSelectedCategory('all')}
          style={[styles.catBtn, selectedCategory === 'all' && styles.catBtnActive]}
        >
          <Text style={[styles.catBtnText, selectedCategory === 'all' && styles.catBtnTextActive]}>
            All ({allQuestions.length})
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[styles.catBtn, selectedCategory === cat.id && styles.catBtnActive]}
          >
            <Text style={[styles.catBtnText, selectedCategory === cat.id && styles.catBtnTextActive]}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoadingCategory && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#60a5fa" />
          <Text style={styles.loadingText}>Fetching live questions...</Text>
        </View>
      )}

      {/* Difficulty + Practice Mode */}
      <View style={styles.filterRow}>
        <View style={styles.diffRow}>
          {(['All', 'Junior', 'Mid', 'Senior'] as const).map((lvl) => (
            <TouchableOpacity
              key={lvl}
              onPress={() => setSelectedDifficulty(lvl)}
              style={[styles.diffBtn, selectedDifficulty === lvl && styles.diffBtnActive]}
            >
              <Text style={[styles.diffBtnText, selectedDifficulty === lvl && styles.diffBtnTextActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setPracticeMode(!practiceMode)}
          style={[styles.quizBtn, practiceMode && styles.quizBtnActive]}
        >
          {practiceMode ? <EyeOff size={12} color="#fbbf24" /> : <Eye size={12} color="#94a3b8" />}
          <Text style={[styles.quizBtnText, practiceMode && { color: '#fbbf24' }]}>Quiz</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.countText}>
        Showing {Math.min(visibleCount, filteredQuestions.length)} of {filteredQuestions.length} questions
      </Text>

      {/* Questions */}
      <FlatList
        data={visible}
        keyExtractor={(q) => q.id}
        style={styles.questionList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Filter size={32} color="#475569" />
            <Text style={styles.emptyTitle}>No questions found</Text>
            <Text style={styles.emptySub}>Try resetting your filters</Text>
          </View>
        }
        ListFooterComponent={
          filteredQuestions.length > visibleCount ? (
            <TouchableOpacity onPress={() => setVisibleCount((p) => p + 40)} style={styles.loadMoreBtn}>
              <Text style={styles.loadMoreText}>Load Next 40 ({filteredQuestions.length - visibleCount} remaining)</Text>
              <ChevronDown size={16} color="#60a5fa" />
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item: q }) => {
          const isExpanded = expandedId === q.id;
          const isBookmarked = bookmarkedIds.includes(q.id);
          const isHidden = practiceMode && !revealedIds.has(q.id);

          return (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => setExpandedId(isExpanded ? null : q.id)}
                style={styles.cardHeader}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.metaRow}>
                    <View style={[styles.diffPill, q.difficulty === 'Senior' ? styles.pillSenior : q.difficulty === 'Mid' ? styles.pillMid : styles.pillJunior]}>
                      <Text style={styles.diffPillText}>{q.difficulty}</Text>
                    </View>
                    <Text style={styles.catName}>{q.categoryName}</Text>
                  </View>
                  <Text style={styles.question}>{q.question}</Text>
                  <View style={styles.tagsRow}>
                    {q.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => onToggleBookmark(q.id, 'qa')}
                    style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
                  >
                    <Bookmark size={16} color={isBookmarked ? '#fbbf24' : '#64748b'} fill={isBookmarked ? '#fbbf24' : 'none'} />
                  </TouchableOpacity>
                  {isExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.answerBody}>
                  {isHidden ? (
                    <View style={styles.hiddenBox}>
                      <Text style={styles.hiddenText}>Quiz mode: Test your answer first!</Text>
                      <TouchableOpacity
                        onPress={() => setRevealedIds((prev) => { const n = new Set(prev); n.add(q.id); return n; })}
                        style={styles.revealBtn}
                      >
                        <Text style={styles.revealBtnText}>Reveal Answer</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.answerText}>{q.answer}</Text>
                      {q.explanationPoints && q.explanationPoints.length > 0 && (
                        <View style={styles.pointsBox}>
                          <Text style={styles.pointsTitle}>Key Takeaways:</Text>
                          {q.explanationPoints.map((pt, i) => (
                            <View key={i} style={styles.pointRow}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.pointText}>{pt}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {q.snippets && q.snippets.map((snip, i) =>
                        snip.url ? (
                          <Image key={i} source={{ uri: snip.url }} style={styles.snippetImg} resizeMode="contain" />
                        ) : null
                      )}
                      {q.codeSnippet && (
                        <View style={styles.codeBox}>
                          <Text style={styles.codeLabel}>Example Code</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={styles.codeText}>{q.codeSnippet}</Text>
                          </ScrollView>
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  searchWrap: { margin: 12, marginBottom: 0, position: 'relative' },
  searchIcon: { position: 'absolute', left: 10, top: 10, zIndex: 1 },
  searchInput: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 12, paddingLeft: 32, paddingRight: 12, paddingVertical: 8,
    fontSize: 12, color: '#f1f5f9',
  },
  catScroll: { marginTop: 10, height: 44, minHeight: 44, flexGrow: 0, flexShrink: 0 },
  catContent: { minHeight: 44, paddingHorizontal: 12, gap: 8, alignItems: 'center' },
  catBtn: {
    minHeight: 34, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    justifyContent: 'center', backgroundColor: '#111c32', borderWidth: 1, borderColor: '#334155',
  },
  catBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  catBtnText: { fontSize: 12, color: '#cbd5e1', fontWeight: '600' },
  catBtnTextActive: { color: '#fff' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, marginTop: 6 },
  loadingText: { fontSize: 11, color: '#60a5fa' },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
  diffRow: { flexDirection: 'row', gap: 4 },
  diffBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  diffBtnActive: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  diffBtnText: { fontSize: 11, color: '#64748b' },
  diffBtnTextActive: { color: '#60a5fa', fontWeight: '600' },
  quizBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
  },
  quizBtnActive: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' },
  quizBtnText: { fontSize: 11, color: '#94a3b8' },
  countText: { fontSize: 11, color: '#64748b', paddingHorizontal: 12, marginTop: 8, marginBottom: 4 },
  questionList: { flex: 1, minHeight: 0 },
  listContent: { padding: 12, gap: 10, paddingBottom: 32 },
  emptyBox: { alignItems: 'center', paddingVertical: 48, backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  emptyTitle: { fontSize: 12, fontWeight: '600', color: '#e2e8f0', marginTop: 8 },
  emptySub: { fontSize: 11, color: '#64748b', marginTop: 4 },
  loadMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, backgroundColor: '#0f172a', borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', marginTop: 4,
  },
  loadMoreText: { fontSize: 12, color: '#60a5fa', fontWeight: '600' },
  card: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, overflow: 'hidden' },
  cardHeader: { padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardHeaderLeft: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  diffPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pillSenior: { backgroundColor: 'rgba(244,63,94,0.2)' },
  pillMid: { backgroundColor: 'rgba(245,158,11,0.2)' },
  pillJunior: { backgroundColor: 'rgba(52,211,153,0.2)' },
  diffPillText: { fontSize: 10, fontWeight: 'bold', color: '#e2e8f0' },
  catName: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  question: { fontSize: 12, fontWeight: 'bold', color: '#f1f5f9', lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { backgroundColor: '#1e293b', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  tagText: { fontSize: 9, color: '#94a3b8' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookmarkBtn: { padding: 6, borderRadius: 8 },
  bookmarkBtnActive: { backgroundColor: 'rgba(251,191,36,0.1)' },
  answerBody: { padding: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1e293b', backgroundColor: 'rgba(2,6,23,0.4)', gap: 12 },
  hiddenBox: { alignItems: 'center', paddingVertical: 16, gap: 10 },
  hiddenText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },
  revealBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  revealBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  answerText: { fontSize: 12, color: '#e2e8f0', lineHeight: 20 },
  pointsBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#1e293b', gap: 6 },
  pointsTitle: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointRow: { flexDirection: 'row', gap: 6 },
  bullet: { fontSize: 11, color: '#60a5fa', fontWeight: 'bold' },
  pointText: { fontSize: 11, color: '#cbd5e1', flex: 1, lineHeight: 16 },
  snippetImg: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#020617' },
  codeBox: { backgroundColor: '#020617', borderRadius: 8, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' },
  codeLabel: { fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', padding: 8, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  codeText: { fontSize: 11, color: '#93c5fd', fontFamily: 'monospace', padding: 12, lineHeight: 18 },
});
