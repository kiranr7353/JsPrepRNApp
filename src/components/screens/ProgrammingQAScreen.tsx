import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Bookmark, Code2, Copy, Check, Terminal, Cpu } from 'lucide-react-native';
import { ProgrammingQuestion } from '../../types';
import { PROGRAMMING_QUESTIONS as FALLBACK_PQA } from '../../data/prepData';

interface ProgrammingQAScreenProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, type: 'pqa') => void;
  problems?: ProgrammingQuestion[];
}

export const ProgrammingQAScreen: React.FC<ProgrammingQAScreenProps> = ({
  bookmarkedIds, onToggleBookmark, problems = FALLBACK_PQA,
}) => {
  const problemList = problems.length > 0 ? problems : FALLBACK_PQA;
  const [selected, setSelected] = useState<ProgrammingQuestion>(problemList[0]);
  const [activeTab, setActiveTab] = useState<'solution' | 'starter'>('solution');
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (problemList.length > 0 && !problemList.some((p) => p.id === selected.id)) {
      setSelected(problemList[0]);
    }
  }, [problemList]);

  const handleRunCode = () => {
    setIsExecuting(true);
    setConsoleOutput('Running test cases in sandbox...');
    setTimeout(() => {
      setConsoleOutput(`> Running tests for: ${selected.title}\n✓ Test case 1 passed\n✓ Test case 2 passed\n\nALL TEST CASES PASSED`);
      setIsExecuting(false);
    }, 600);
  };

  const isBookmarked = bookmarkedIds.includes(selected.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Problem Selector */}
      <View>
        <Text style={styles.sectionLabel}>Interview Coding Problems</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.problemList}>
          {problemList.map((prob) => {
            const isSelected = selected.id === prob.id;
            return (
              <TouchableOpacity
                key={prob.id}
                onPress={() => { setSelected(prob); setConsoleOutput(null); }}
                style={[styles.probCard, isSelected && styles.probCardActive]}
                activeOpacity={0.8}
              >
                <View style={styles.probMeta}>
                  <View style={[styles.diffPill, prob.difficulty === 'Hard' ? styles.pillHard : prob.difficulty === 'Medium' ? styles.pillMed : styles.pillEasy]}>
                    <Text style={styles.diffPillText}>{prob.difficulty}</Text>
                  </View>
                  <Text style={styles.probCat}>{prob.category}</Text>
                </View>
                <Text style={styles.probTitle} numberOfLines={2}>{prob.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Problem Detail */}
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <View style={styles.detailHeaderLeft}>
            <View style={styles.metaRow}>
              <View style={[styles.diffPill, selected.difficulty === 'Hard' ? styles.pillHard : selected.difficulty === 'Medium' ? styles.pillMed : styles.pillEasy]}>
                <Text style={styles.diffPillText}>{selected.difficulty}</Text>
              </View>
              <Text style={styles.probCat}>{selected.category}</Text>
            </View>
            <Text style={styles.detailTitle}>{selected.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onToggleBookmark(selected.id, 'pqa')}
            style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
          >
            <Bookmark size={16} color={isBookmarked ? '#fbbf24' : '#94a3b8'} fill={isBookmarked ? '#fbbf24' : 'none'} />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{selected.description}</Text>

        {/* Complexity */}
        <View style={styles.complexityRow}>
          <View style={styles.complexityPill}>
            <Cpu size={12} color="#60a5fa" />
            <Text style={styles.complexityText}>Time: <Text style={{ fontWeight: 'bold' }}>{selected.timeComplexity}</Text></Text>
          </View>
          <View style={styles.complexityPill}>
            <Cpu size={12} color="#a78bfa" />
            <Text style={styles.complexityText}>Space: <Text style={{ fontWeight: 'bold' }}>{selected.spaceComplexity}</Text></Text>
          </View>
        </View>

        {/* Code Tabs */}
        <View style={styles.tabBar}>
          <View style={styles.tabBtns}>
            {(['solution', 'starter'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              >
                <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleRunCode} disabled={isExecuting} style={styles.runBtn}>
            <Play size={12} color="#fff" fill="#fff" />
            <Text style={styles.runBtnText}>{isExecuting ? 'Running...' : 'Run Code'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeBox}>
          <Text style={styles.codeText}>
            {activeTab === 'solution' ? selected.solutionCode : selected.starterCode}
          </Text>
        </ScrollView>

        {/* Console */}
        {consoleOutput && (
          <View style={styles.console}>
            <View style={styles.consoleHeader}>
              <Terminal size={12} color="#34d399" />
              <Text style={styles.consoleTitle}>Console Output</Text>
              <TouchableOpacity onPress={() => setConsoleOutput(null)} style={{ marginLeft: 'auto' }}>
                <Text style={styles.consoleClear}>Clear</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.consoleText}>{consoleOutput}</Text>
          </View>
        )}

        {/* Explanation */}
        <View style={styles.explanationBox}>
          <Text style={styles.explanationLabel}>Approach & Edge Cases:</Text>
          <Text style={styles.explanationText}>{selected.explanation}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 14, gap: 14, paddingBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  problemList: { gap: 8 },
  probCard: {
    width: 180, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 12, padding: 10,
  },
  probCardActive: { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)' },
  probMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  diffPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pillHard: { backgroundColor: 'rgba(244,63,94,0.2)' },
  pillMed: { backgroundColor: 'rgba(245,158,11,0.2)' },
  pillEasy: { backgroundColor: 'rgba(52,211,153,0.2)' },
  diffPillText: { fontSize: 9, fontWeight: 'bold', color: '#e2e8f0' },
  probCat: { fontSize: 9, color: '#64748b' },
  probTitle: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0', lineHeight: 16 },
  detailCard: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 14, gap: 12 },
  detailHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  detailHeaderLeft: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  detailTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  bookmarkBtn: { padding: 8, borderRadius: 10, backgroundColor: '#1e293b' },
  bookmarkBtnActive: { backgroundColor: 'rgba(251,191,36,0.1)' },
  description: { fontSize: 12, color: '#cbd5e1', lineHeight: 20 },
  complexityRow: { flexDirection: 'row', gap: 8 },
  complexityPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  complexityText: { fontSize: 11, color: '#cbd5e1' },
  tabBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tabBtns: { flexDirection: 'row', backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 8, padding: 3, gap: 2 },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#2563eb' },
  tabBtnText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  tabBtnTextActive: { color: '#fff' },
  runBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8,
  },
  runBtnText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  codeBox: { backgroundColor: '#020617', borderRadius: 10, borderWidth: 1, borderColor: '#1e293b', padding: 12 },
  codeText: { fontSize: 11, color: '#67e8f9', fontFamily: 'monospace', lineHeight: 18 },
  console: { backgroundColor: '#020617', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)', padding: 10, gap: 6 },
  consoleHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  consoleTitle: { fontSize: 10, color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace' },
  consoleClear: { fontSize: 10, color: '#94a3b8' },
  consoleText: { fontSize: 11, color: '#34d399', fontFamily: 'monospace', lineHeight: 18 },
  explanationBox: { backgroundColor: 'rgba(2,6,23,0.6)', borderRadius: 10, borderWidth: 1, borderColor: '#1e293b', padding: 12, gap: 4 },
  explanationLabel: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  explanationText: { fontSize: 12, color: '#cbd5e1', lineHeight: 20 },
});
