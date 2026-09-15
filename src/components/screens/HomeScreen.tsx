import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image,
} from 'react-native';
import { Code2, Atom, Server, Cloud, Box, Cpu, FileCode, Palette, Workflow, Layers, Terminal, Sparkles, ChevronRight, Flame, RefreshCw, Globe2, BookOpen } from 'lucide-react-native';
import { Category, QuestionAnswer, UserProfile } from '../../types';
import { CATEGORIES as FALLBACK_CATEGORIES, QUESTIONS_ANSWERS as FALLBACK_QA } from '../../data/prepData';

interface HomeScreenProps {
  onSelectCategory: (category: Category) => void;
  onSelectTopic: (topic: any) => void;
  onNavigateTab: (tab: any) => void;
  onSelectQuestion: (question: QuestionAnswer) => void;
  user: UserProfile;
  onOpenAICoach: () => void;
  categories?: Category[];
  favoriteTopics?: any[];
  questions?: QuestionAnswer[];
  isLiveApi?: boolean;
  onRefreshApi?: () => void;
  isSyncing?: boolean;
}

const ICON_MAP: Record<string, any> = {
  Code2, Atom, Server, Cloud, Box, Cpu, FileCode, Palette, Workflow, Layers, Terminal,
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectCategory, onSelectTopic, onNavigateTab, onSelectQuestion, user, onOpenAICoach,
  categories = FALLBACK_CATEGORIES, questions = FALLBACK_QA,
  favoriteTopics = [],
  isLiveApi = false, onRefreshApi, isSyncing = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dailyQuestion = questions[0] ?? FALLBACK_QA[0];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* API Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Globe2 size={16} color="#34d399" />
          <View style={{ marginLeft: 8 }}>
            <View style={styles.statusRow}>
              <Text style={styles.statusTitle}>Firestore & JsPrep Backend</Text>
              <View style={styles.statusBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.statusBadgeText}>
                  {isLiveApi ? `${questions.length} Questions Synced` : 'Connecting'}
                </Text>
              </View>
            </View>
            <Text style={styles.statusSub}>jsprep-ed0c8 • /interviewQ&A</Text>
          </View>
        </View>
        {onRefreshApi && (
          <TouchableOpacity onPress={onRefreshApi} disabled={isSyncing} style={styles.refreshBtn}>
            {isSyncing ? <ActivityIndicator size="small" color="#60a5fa" /> : <RefreshCw size={12} color="#60a5fa" />}
            <Text style={styles.refreshText}>{isSyncing ? 'Syncing...' : 'Refresh'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <View style={styles.liveBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveBadgeText}>{isLiveApi ? 'Live Data Loaded' : 'Firebase Synced'}</Text>
            </View>
            <Text style={styles.heroTitle}>Master Full-Stack & Cloud</Text>
            <Text style={styles.heroSub}>Prepare for Senior React, JS & DevOps technical interviews.</Text>
          </View>
          <View style={styles.streakBox}>
            <Flame size={14} color="#f59e0b" />
            <Text style={styles.streakText}>5 Days</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{questions.length}+</Text>
            <Text style={styles.statLabel}>Interview Q&As</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#34d399' }]}>{user.bookmarkedQAIds.length}</Text>
            <Text style={styles.statLabel}>Bookmarked</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#60a5fa' }]}>{categories.length}</Text>
            <Text style={styles.statLabel}>Tracks</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search tracks, React hooks, AWS..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Daily Question */}
      {dailyQuestion && (
        <TouchableOpacity
          onPress={() => { onSelectQuestion(dailyQuestion); onNavigateTab('qa'); }}
          style={styles.dailyCard}
          activeOpacity={0.8}
        >
          <View style={styles.dailyHeader}>
            <View style={styles.dailyBadge}>
              <Sparkles size={14} color="#60a5fa" />
              <Text style={styles.dailyBadgeText}>Question of the Day</Text>
            </View>
            <View style={styles.diffBadge}>
              <Text style={styles.diffText}>{dailyQuestion.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.dailyQuestion} numberOfLines={2}>{dailyQuestion.question}</Text>
          <View style={styles.dailyFooter}>
            <Text style={styles.dailyCat}>{dailyQuestion.categoryName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={styles.dailyAction}>Solve & View Answer</Text>
              <ChevronRight size={12} color="#60a5fa" />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {favoriteTopics.length > 0 && (
        <View style={styles.favoriteSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Favorite Topics</Text>
              <Text style={styles.favoriteSubtitle}>Continue learning from your saved topics.</Text>
            </View>
            <Text style={styles.seeAll}>{favoriteTopics.length} saved</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoriteList}>
            {favoriteTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                onPress={() => onSelectTopic(topic)}
                style={styles.favoriteCard}
                activeOpacity={0.85}
              >
                {topic.imageUrl ? (
                  <Image source={{ uri: topic.imageUrl }} style={styles.favoriteImage} resizeMode="cover" />
                ) : (
                  <View style={styles.favoriteImageFallback}><BookOpen size={28} color="#60a5fa" /></View>
                )}
                <Text style={styles.favoriteTitle} numberOfLines={2}>{topic.title}</Text>
                <Text style={styles.favoriteDescription} numberOfLines={3}>{topic.summary}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories Grid */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Tracks ({filteredCategories.length})</Text>
          <TouchableOpacity onPress={() => onNavigateTab('qa')} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={styles.seeAll}>Browse All Q&A</Text>
            <ChevronRight size={12} color="#60a5fa" />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {filteredCategories.map((category) => {
            const IconComponent = ICON_MAP[category.iconName] || Code2;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onSelectCategory(category)}
                style={styles.categoryCard}
                activeOpacity={0.8}
              >
                <View style={styles.cardTop}>
                  <View style={styles.iconBox}>
                    <IconComponent size={16} color="#60a5fa" />
                  </View>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{category.badge}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{category.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={1}>{category.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardCount}>{category.totalQuestions} Q&A</Text>
                  <Text style={styles.cardExplore}>Explore</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* AI Coach Banner */}
      <View style={styles.aiBanner}>
        <View style={styles.aiLeft}>
          <View style={styles.aiIcon}>
            <Sparkles size={16} color="#fbbf24" />
          </View>
          <View>
            <Text style={styles.aiTitle}>Practice with AI Coach</Text>
            <Text style={styles.aiSub}>Ask mock questions or get deep explanations.</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onOpenAICoach} style={styles.aiStartBtn}>
          <Text style={styles.aiStartText}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  statusBar: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusTitle: { fontSize: 11, fontWeight: 'bold', color: '#e2e8f0' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(52,211,153,0.1)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)',
    borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2,
  },
  statusBadgeText: { fontSize: 9, color: '#34d399', fontWeight: '600' },
  statusSub: { fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginTop: 2 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },
  refreshBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: 'rgba(96,165,250,0.1)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
    borderRadius: 8,
  },
  refreshText: { fontSize: 11, color: '#60a5fa', fontWeight: '600' },
  heroCard: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155',
    borderRadius: 16, padding: 16,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(96,165,250,0.15)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8,
  },
  liveBadgeText: { fontSize: 10, color: '#93c5fd', fontWeight: '600', textTransform: 'uppercase' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroSub: { fontSize: 12, color: '#cbd5e1', marginTop: 4, lineHeight: 18 },
  streakBox: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  streakText: { fontSize: 12, color: '#fbbf24', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#334155', gap: 8 },
  statBox: { flex: 1, backgroundColor: 'rgba(2,6,23,0.4)', borderRadius: 12, padding: 8, alignItems: 'center' },
  statNum: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  searchWrap: { position: 'relative' },
  searchInput: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 12, color: '#f1f5f9',
  },
  clearBtn: { position: 'absolute', right: 12, top: 10 },
  clearText: { fontSize: 12, color: '#94a3b8' },
  favoriteSection: { gap: 10 },
  favoriteSubtitle: { fontSize: 11, color: '#64748b', marginTop: 3 },
  favoriteList: { gap: 12, paddingRight: 16 },
  favoriteCard: { width: 235, paddingBottom: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, overflow: 'hidden' },
  favoriteImage: { width: '100%', height: 132, backgroundColor: '#1e293b' },
  favoriteImageFallback: { width: '100%', height: 132, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' },
  favoriteTitle: { fontSize: 14, color: '#f8fafc', fontWeight: '800', marginHorizontal: 12, marginTop: 10 },
  favoriteDescription: { fontSize: 11, color: '#94a3b8', lineHeight: 16, marginHorizontal: 12, marginTop: 6 },
  dailyCard: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)',
    borderRadius: 12, padding: 14,
  },
  dailyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dailyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dailyBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#60a5fa', textTransform: 'uppercase' },
  diffBadge: { backgroundColor: 'rgba(245,158,11,0.2)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  diffText: { fontSize: 10, color: '#fcd34d', fontWeight: '600' },
  dailyQuestion: { fontSize: 12, fontWeight: '600', color: '#f1f5f9', lineHeight: 18 },
  dailyFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  dailyCat: { fontSize: 11, color: '#94a3b8' },
  dailyAction: { fontSize: 11, color: '#60a5fa', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: 0.5 },
  seeAll: { fontSize: 11, color: '#60a5fa', fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: {
    width: '47.5%', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 12, padding: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  cardBadge: { backgroundColor: '#1e293b', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  cardBadgeText: { fontSize: 9, color: '#cbd5e1', fontWeight: '600' },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  cardDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1e293b' },
  cardCount: { fontSize: 10, color: '#94a3b8' },
  cardExplore: { fontSize: 10, color: '#60a5fa', fontWeight: '600' },
  aiBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(245,158,11,0.05)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)',
    borderRadius: 12, padding: 12,
  },
  aiLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  aiIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 12, fontWeight: 'bold', color: '#fef3c7' },
  aiSub: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  aiStartBtn: { backgroundColor: '#f59e0b', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  aiStartText: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
});
