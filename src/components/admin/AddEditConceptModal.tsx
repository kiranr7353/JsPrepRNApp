import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { DescriptionFormBlock } from './DescriptionFormBlock';
import {
  FormDescription, emptyDescription,
  addConcept, editConcept, deleteConcept,
} from '../../services/adminApi';

type Mode = 'add' | 'edit' | 'delete';

interface Props {
  visible: boolean;
  mode: Mode;
  categoryId: string;
  topicId: string;
  existingTitle?: string;
  nextConceptId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEditConceptModal: React.FC<Props> = ({
  visible, mode, categoryId, topicId, existingTitle = '', nextConceptId = 1, onClose, onSuccess,
}) => {
  const [title, setTitle] = useState(mode === 'edit' ? existingTitle : '');
  const [descriptions, setDescriptions] = useState<FormDescription[]>([emptyDescription(1)]);
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setTitle(mode === 'edit' ? existingTitle : '');
    setDescriptions([emptyDescription(1)]);
    setIsSaving(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const updateDesc = (idx: number, updated: FormDescription) => {
    setDescriptions((prev) => prev.map((d, i) => i === idx ? updated : d));
  };

  const removeDesc = (idx: number) => {
    setDescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const addDesc = () => {
    setDescriptions((prev) => [...prev, emptyDescription(prev.length + 1)]);
  };

  const handleSave = async () => {
    if (mode === 'add' || mode === 'edit') {
      if (!title.trim()) { Alert.alert('Required', 'Please enter a concept title.'); return; }
    }
    setIsSaving(true);
    try {
      if (mode === 'add') {
        await addConcept({ categoryId, topicId, id: nextConceptId, title: title.trim(), data: descriptions });
      } else if (mode === 'edit') {
        await editConcept({ currentTitle: existingTitle, changedTitle: title.trim(), categoryId, topicId });
      } else {
        await deleteConcept({ title: existingTitle, categoryId, topicId });
      }
      onSuccess();
      handleClose();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Operation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const modalTitle = mode === 'add' ? 'Add Concept' : mode === 'edit' ? 'Edit Concept' : 'Delete Concept';
  const actionLabel = mode === 'add' ? 'Save' : mode === 'edit' ? 'Save Changes' : 'Delete';
  const actionColor = mode === 'delete' ? '#ef4444' : '#2563eb';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{modalTitle}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {mode === 'delete' ? (
            <View style={styles.deleteConfirm}>
              <Text style={styles.deleteText}>
                Are you sure you want to delete the concept:
              </Text>
              <Text style={styles.deleteTitle}>{existingTitle}</Text>
              <Text style={styles.deleteWarning}>This action cannot be undone.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder={mode === 'edit' ? 'New concept title' : 'Enter Concept Title'}
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={setTitle}
              />
              {mode === 'edit' && (
                <View style={styles.currentBox}>
                  <Text style={styles.currentLabel}>Current title:</Text>
                  <Text style={styles.currentValue}>{existingTitle}</Text>
                </View>
              )}

              {mode === 'add' && (
                <>
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Descriptions</Text>
                  {descriptions.map((desc, idx) => (
                    <DescriptionFormBlock
                      key={idx}
                      desc={desc}
                      index={idx}
                      onChange={(updated) => updateDesc(idx, updated)}
                      onRemove={() => removeDesc(idx)}
                      showRemove={descriptions.length > 1}
                    />
                  ))}
                  <TouchableOpacity onPress={addDesc} style={styles.addDescBtn}>
                    <Plus size={14} color="#60a5fa" />
                    <Text style={styles.addDescText}>Add Another Description</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </ScrollView>

        {/* Footer */}
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
  fieldLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#f1f5f9', marginBottom: 12,
  },
  currentBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#1e293b', marginBottom: 12 },
  currentLabel: { fontSize: 10, color: '#64748b', marginBottom: 2 },
  currentValue: { fontSize: 13, color: '#cbd5e1', fontWeight: '600' },
  addDescBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
  addDescText: { fontSize: 13, color: '#60a5fa', fontWeight: '600' },
  deleteConfirm: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  deleteText: { fontSize: 14, color: '#cbd5e1', textAlign: 'center' },
  deleteTitle: { fontSize: 18, color: '#f8fafc', fontWeight: '800', textAlign: 'center' },
  deleteWarning: { fontSize: 12, color: '#f87171', textAlign: 'center' },
  footer: {
    flexDirection: 'row', gap: 10, padding: 16,
    borderTopWidth: 1, borderTopColor: '#1e293b',
  },
  cancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155',
  },
  cancelText: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
