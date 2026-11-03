import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { FormQAAnswer, emptyQAAnswer, addInterviewQA, updateInterviewQA, DescriptionSnippet, FormTableColumn, FormTableRow } from '../../services/adminApi';

type Mode = 'add' | 'edit' | 'delete';

interface Props {
  visible: boolean;
  mode: Mode;
  categoryId: string;
  topicId: string;
  existingQuestion?: { id: string; question: string; answers: FormQAAnswer[]; enabled?: boolean };
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEditQAModal: React.FC<Props> = ({
  visible, mode, categoryId, topicId, existingQuestion, onClose, onSuccess,
}) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<FormQAAnswer[]>([emptyQAAnswer(1)]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (mode === 'edit' && existingQuestion) {
      setQuestion(existingQuestion.question);
      setAnswers(existingQuestion.answers.length > 0 ? existingQuestion.answers : [emptyQAAnswer(1)]);
    } else {
      setQuestion('');
      setAnswers([emptyQAAnswer(1)]);
    }
  }, [visible, mode]);

  const handleClose = () => { setIsSaving(false); onClose(); };

  const updateAnswer = (idx: number, patch: Partial<FormQAAnswer>) => {
    setAnswers((prev) => prev.map((a, i) => i === idx ? { ...a, ...patch } : a));
  };

  const addAnswer = () => setAnswers((prev) => [...prev, emptyQAAnswer(prev.length + 1)]);
  const removeAnswer = (idx: number) => setAnswers((prev) => prev.filter((_, i) => i !== idx));

  const addSnippet = (idx: number) => {
    updateAnswer(idx, { snippets: [...answers[idx].snippets, { url: '', imageUploaded: false }] });
  };
  const updateSnippet = (aIdx: number, sIdx: number, url: string) => {
    const next = answers[aIdx].snippets.map((s, i) => i === sIdx ? { ...s, url } : s);
    updateAnswer(aIdx, { snippets: next });
  };
  const removeSnippet = (aIdx: number, sIdx: number) => {
    updateAnswer(aIdx, { snippets: answers[aIdx].snippets.filter((_, i) => i !== sIdx) });
  };

  const addPoint = (aIdx: number) => {
    const a = answers[aIdx];
    const pt = { id: a.pointsData.length + 1, pointHeader: '', value: '', code: '', snippets: [] as DescriptionSnippet[] };
    updateAnswer(aIdx, { pointsData: [...a.pointsData, pt] });
  };
  const updatePoint = (aIdx: number, pIdx: number, patch: object) => {
    const next = answers[aIdx].pointsData.map((p, i) => i === pIdx ? { ...p, ...patch } : p);
    updateAnswer(aIdx, { pointsData: next });
  };
  const removePoint = (aIdx: number, pIdx: number) => {
    updateAnswer(aIdx, { pointsData: answers[aIdx].pointsData.filter((_, i) => i !== pIdx) });
  };

  const handleSave = async () => {
    if (mode !== 'delete' && !question.trim()) {
      Alert.alert('Required', 'Please enter a question.'); return;
    }
    setIsSaving(true);
    try {
      if (mode === 'add') {
        await addInterviewQA({ categoryId, topicId, questionId: Date.now().toString(), question: question.trim(), type: 'add', data: answers });
      } else if (mode === 'edit' && existingQuestion) {
        await updateInterviewQA({ categoryId, topicId, questionId: existingQuestion.id, question: question.trim(), enabled: existingQuestion.enabled ?? true, type: 'request', data: answers });
      } else if (mode === 'delete' && existingQuestion) {
        await updateInterviewQA({ categoryId, topicId, questionId: existingQuestion.id, question: existingQuestion.question, enabled: false, type: 'request', data: existingQuestion.answers });
      }
      onSuccess();
      handleClose();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Operation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const headerTitle = mode === 'add' ? 'Add Question' : mode === 'edit' ? 'Edit Question' : 'Delete Question';
  const actionLabel = mode === 'delete' ? 'Delete' : 'Save';
  const actionColor = mode === 'delete' ? '#ef4444' : '#2563eb';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {mode === 'delete' ? (
            <View style={styles.deleteConfirm}>
              <Text style={styles.deleteText}>Delete this question?</Text>
              <Text style={styles.deleteTitle}>{existingQuestion?.question}</Text>
              <Text style={styles.deleteWarning}>This will disable the question from appearing. This cannot be undone.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Question *</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Enter interview question"
                placeholderTextColor="#64748b"
                value={question}
                onChangeText={setQuestion}
                multiline
                numberOfLines={3}
              />

              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>Answer Blocks</Text>
              {answers.map((answer, aIdx) => (
                <View key={aIdx} style={styles.answerBlock}>
                  <View style={styles.blockHeader}>
                    <Text style={styles.blockTitle}>Answer Block {aIdx + 1}</Text>
                    {answers.length > 1 && (
                      <TouchableOpacity onPress={() => removeAnswer(aIdx)} style={styles.iconBtn}>
                        <Trash2 size={14} color="#f87171" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="Answer text"
                    placeholderTextColor="#64748b"
                    value={answer.answer}
                    onChangeText={(v) => updateAnswer(aIdx, { answer: v })}
                    multiline
                    numberOfLines={3}
                  />
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    placeholder="Code example (optional)"
                    placeholderTextColor="#64748b"
                    value={answer.code}
                    onChangeText={(v) => updateAnswer(aIdx, { code: v })}
                    multiline
                    numberOfLines={3}
                  />

                  {/* Snippets */}
                  <View style={styles.row}>
                    <Text style={styles.fieldLabel}>Snippet Images</Text>
                    <TouchableOpacity onPress={() => addSnippet(aIdx)} style={styles.addSmallBtn}>
                      <Plus size={12} color="#60a5fa" />
                      <Text style={styles.addSmallText}>Add URL</Text>
                    </TouchableOpacity>
                  </View>
                  {answer.snippets.map((snip, sIdx) => (
                    <View key={sIdx} style={styles.urlRow}>
                      <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="Paste Firebase Storage URL"
                        placeholderTextColor="#64748b"
                        value={snip.url}
                        onChangeText={(v) => updateSnippet(aIdx, sIdx, v)}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity onPress={() => removeSnippet(aIdx, sIdx)} style={styles.iconBtn}>
                        <Trash2 size={14} color="#f87171" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Note */}
                  <View style={styles.toggleRow}>
                    <Text style={styles.fieldLabel}>Add Note</Text>
                    <Switch
                      value={answer.hasNote}
                      onValueChange={(v) => updateAnswer(aIdx, { hasNote: v })}
                      trackColor={{ false: '#334155', true: '#2563eb' }}
                      thumbColor="#fff"
                    />
                  </View>
                  {answer.hasNote && (
                    <TextInput
                      style={[styles.input, styles.multiline]}
                      placeholder="Note text"
                      placeholderTextColor="#64748b"
                      value={answer.note}
                      onChangeText={(v) => updateAnswer(aIdx, { note: v })}
                      multiline
                      numberOfLines={2}
                    />
                  )}

                  {/* Points */}
                  <View style={styles.toggleRow}>
                    <Text style={styles.fieldLabel}>Add Points</Text>
                    <Switch
                      value={answer.hasPoints}
                      onValueChange={(v) => updateAnswer(aIdx, { hasPoints: v, pointsData: v && answer.pointsData.length === 0 ? [{ id: 1, pointHeader: '', value: '', code: '', snippets: [] }] : answer.pointsData })}
                      trackColor={{ false: '#334155', true: '#2563eb' }}
                      thumbColor="#fff"
                    />
                  </View>
                  {answer.hasPoints && (
                    <View style={styles.pointsSection}>
                      {answer.pointsData.map((pt, pIdx) => (
                        <View key={pIdx} style={styles.pointBlock}>
                          <View style={styles.row}>
                            <Text style={styles.pointLabel}>Point {pIdx + 1}</Text>
                            <TouchableOpacity onPress={() => removePoint(aIdx, pIdx)} style={styles.iconBtn}>
                              <Trash2 size={12} color="#f87171" />
                            </TouchableOpacity>
                          </View>
                          <TextInput
                            style={styles.input}
                            placeholder="Point header (optional)"
                            placeholderTextColor="#64748b"
                            value={pt.pointHeader}
                            onChangeText={(v) => updatePoint(aIdx, pIdx, { pointHeader: v })}
                          />
                          <TextInput
                            style={[styles.input, styles.multiline]}
                            placeholder="Point value *"
                            placeholderTextColor="#64748b"
                            value={pt.value}
                            onChangeText={(v) => updatePoint(aIdx, pIdx, { value: v })}
                            multiline
                            numberOfLines={2}
                          />
                          <TextInput
                            style={[styles.input, styles.codeInput]}
                            placeholder="Point code (optional)"
                            placeholderTextColor="#64748b"
                            value={pt.code}
                            onChangeText={(v) => updatePoint(aIdx, pIdx, { code: v })}
                            multiline
                            numberOfLines={2}
                          />
                        </View>
                      ))}
                      <TouchableOpacity onPress={() => addPoint(aIdx)} style={styles.addPointBtn}>
                        <Plus size={12} color="#60a5fa" />
                        <Text style={styles.addSmallText}>Add Another Point</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Table */}
                  <View style={styles.toggleRow}>
                    <Text style={styles.fieldLabel}>Add Table</Text>
                    <Switch
                      value={answer.hasTable}
                      onValueChange={(v) => updateAnswer(aIdx, { hasTable: v })}
                      trackColor={{ false: '#334155', true: '#2563eb' }}
                      thumbColor="#fff"
                    />
                  </View>
                  {answer.hasTable && (
                    <View style={styles.tableSection}>
                      <View style={styles.row}>
                        <TextInput
                          style={[styles.input, { flex: 1, marginBottom: 0 }]}
                          placeholder="Column 1 header"
                          placeholderTextColor="#64748b"
                          value={answer.tableColumns[0]?.value || ''}
                          onChangeText={(v) => {
                            const cols = [...answer.tableColumns] as FormTableColumn[];
                            cols[0] = { value: v };
                            updateAnswer(aIdx, { tableColumns: cols });
                          }}
                        />
                        <View style={{ width: 8 }} />
                        <TextInput
                          style={[styles.input, { flex: 1, marginBottom: 0 }]}
                          placeholder="Column 2 header"
                          placeholderTextColor="#64748b"
                          value={answer.tableColumns[1]?.value || ''}
                          onChangeText={(v) => {
                            const cols = [...answer.tableColumns] as FormTableColumn[];
                            cols[1] = { value: v };
                            updateAnswer(aIdx, { tableColumns: cols });
                          }}
                        />
                      </View>
                      {answer.tableData.map((row, rIdx) => (
                        <View key={rIdx} style={[styles.row, { marginTop: 6 }]}>
                          <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder={`Row ${rIdx + 1}, Col 1`}
                            placeholderTextColor="#64748b"
                            value={row.value1}
                            onChangeText={(v) => {
                              const rows = [...answer.tableData] as FormTableRow[];
                              rows[rIdx] = { ...rows[rIdx], value1: v };
                              updateAnswer(aIdx, { tableData: rows });
                            }}
                          />
                          <View style={{ width: 8 }} />
                          <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder={`Row ${rIdx + 1}, Col 2`}
                            placeholderTextColor="#64748b"
                            value={row.value2}
                            onChangeText={(v) => {
                              const rows = [...answer.tableData] as FormTableRow[];
                              rows[rIdx] = { ...rows[rIdx], value2: v };
                              updateAnswer(aIdx, { tableData: rows });
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => updateAnswer(aIdx, { tableData: answer.tableData.filter((_, i) => i !== rIdx) })}
                            style={[styles.iconBtn, { marginLeft: 4 }]}
                          >
                            <Trash2 size={12} color="#f87171" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity
                        onPress={() => updateAnswer(aIdx, { tableData: [...answer.tableData, { value1: '', value2: '' }] })}
                        style={[styles.addPointBtn, { marginTop: 6 }]}
                      >
                        <Plus size={12} color="#60a5fa" />
                        <Text style={styles.addSmallText}>Add Row</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}

              <TouchableOpacity onPress={addAnswer} style={styles.addAnswerBtn}>
                <Plus size={14} color="#60a5fa" />
                <Text style={styles.addAnswerText}>Add Another Answer Block</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[styles.saveBtn, { backgroundColor: actionColor }]}
          >
            {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>{actionLabel}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  closeBtn: { padding: 6 },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  fieldLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8, fontSize: 12, color: '#f1f5f9', marginBottom: 8,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  codeInput: { minHeight: 56, textAlignVertical: 'top', fontFamily: 'monospace', fontSize: 11, color: '#93c5fd' },
  answerBlock: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, marginBottom: 10 },
  blockHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  blockTitle: { fontSize: 12, color: '#60a5fa', fontWeight: '700' },
  iconBtn: { padding: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  addSmallText: { fontSize: 11, color: '#60a5fa', fontWeight: '600' },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 },
  pointsSection: { marginTop: 4 },
  pointBlock: { backgroundColor: '#020617', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#1e293b' },
  pointLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  addPointBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 },
  tableSection: { marginTop: 4 },
  addAnswerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
  addAnswerText: { fontSize: 13, color: '#60a5fa', fontWeight: '600' },
  deleteConfirm: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  deleteText: { fontSize: 14, color: '#cbd5e1', textAlign: 'center' },
  deleteTitle: { fontSize: 16, color: '#f8fafc', fontWeight: '700', textAlign: 'center' },
  deleteWarning: { fontSize: 12, color: '#f87171', textAlign: 'center' },
  footer: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#1e293b' },
  cancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155',
  },
  cancelText: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
