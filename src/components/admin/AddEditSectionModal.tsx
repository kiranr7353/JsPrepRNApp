import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { DescriptionFormBlock } from './DescriptionFormBlock';
import { FormDescription, SectionDataWrapper, emptyDescription, addEditSection } from '../../services/adminApi';

type Mode = 'addSection' | 'addDescription' | 'editDescription' | 'deleteDescription' | 'deleteSection';

interface Props {
  visible: boolean;
  mode: Mode;
  categoryId: string;
  topicId: string;
  conceptTitle: string;
  sectionId: number;
  // For edit/delete: pass the existing section's full data array and the description index
  existingData?: FormDescription[];
  editDescriptionIndex?: number;
  // All sections of the concept (needed to send the complete data array on every write)
  allSectionsRaw?: SectionDataWrapper[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEditSectionModal: React.FC<Props> = ({
  visible, mode, categoryId, topicId, conceptTitle, sectionId,
  existingData = [], editDescriptionIndex = 0, allSectionsRaw = [],
  onClose, onSuccess,
}) => {
  const [descriptions, setDescriptions] = useState<FormDescription[]>([emptyDescription(1)]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (mode === 'addSection' || mode === 'addDescription') {
      setDescriptions([emptyDescription(1)]);
    } else if (mode === 'editDescription' && existingData.length > 0) {
      setDescriptions([existingData[editDescriptionIndex] ?? emptyDescription(1)]);
    } else if (mode === 'deleteDescription' || mode === 'deleteSection') {
      setDescriptions(existingData);
    }
  }, [visible, mode]);

  const handleClose = () => { setIsSaving(false); onClose(); };

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
    // Safety guard for edit/delete ops
    const needsExisting = mode === 'editDescription' || mode === 'deleteDescription' || mode === 'addDescription';
    if (needsExisting && existingData.length === 0) {
      Alert.alert('Safety Check Failed', 'Existing description data is missing. Saving is blocked to prevent data loss. Please close and reopen the concept.');
      return;
    }
    setIsSaving(true);
    try {
      let updatedSections: SectionDataWrapper[];

      if (mode === 'deleteSection') {
        // Remove the entire section
        updatedSections = allSectionsRaw.filter((s) => s.sectionId !== sectionId);
      } else {
        let dataToSend: FormDescription[];

        if (mode === 'addSection') {
          dataToSend = descriptions;
        } else if (mode === 'addDescription') {
          // Append new description to existing section
          dataToSend = [...existingData, ...descriptions];
        } else if (mode === 'editDescription') {
          dataToSend = existingData.map((d, i) =>
            i === editDescriptionIndex ? descriptions[0] : d
          );
        } else {
          // deleteDescription
          dataToSend = existingData.filter((_, i) => i !== editDescriptionIndex);
        }

        if (mode === 'addSection') {
          updatedSections = [...allSectionsRaw, { description: dataToSend, sectionId }];
        } else {
          const found = allSectionsRaw.some((s) => s.sectionId === sectionId);
          updatedSections = found
            ? allSectionsRaw.map((s) => s.sectionId === sectionId ? { ...s, description: dataToSend } : s)
            : [...allSectionsRaw, { description: dataToSend, sectionId }];
        }
      }

      await addEditSection({ sectionId, categoryId, title: conceptTitle, topicId, data: updatedSections });
      onSuccess();
      handleClose();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Operation failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const headerTitle =
    mode === 'addSection' ? 'Add Section' :
    mode === 'addDescription' ? 'Add Description' :
    mode === 'editDescription' ? 'Edit Description' :
    mode === 'deleteDescription' ? 'Delete Description' :
    'Delete Section';
  const actionLabel = (mode === 'deleteDescription' || mode === 'deleteSection') ? 'Delete' : 'Save';
  const actionColor = (mode === 'deleteDescription' || mode === 'deleteSection') ? '#ef4444' : '#2563eb';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <Text style={styles.headerSub}>{conceptTitle}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
          {mode === 'deleteSection' ? (
            <View style={styles.deleteConfirm}>
              <Text style={styles.deleteText}>Delete entire Section {sectionId}?</Text>
              <Text style={styles.deleteSubText}>This will remove all {existingData.length} description{existingData.length !== 1 ? 's' : ''} in this section.</Text>
              <Text style={styles.deleteWarning}>This action cannot be undone.</Text>
            </View>
          ) : mode === 'deleteDescription' ? (
            <View style={styles.deleteConfirm}>
              <Text style={styles.deleteText}>Delete this description block from Section {sectionId}?</Text>
              {existingData[editDescriptionIndex]?.header ? (
                <Text style={styles.deleteTitle}>{existingData[editDescriptionIndex].header}</Text>
              ) : null}
              <Text style={styles.deleteWarning}>This action cannot be undone.</Text>
            </View>
          ) : (
            <>
              {descriptions.map((desc, idx) => (
                <DescriptionFormBlock
                  key={idx}
                  desc={desc}
                  index={idx}
                  onChange={(updated) => updateDesc(idx, updated)}
                  onRemove={() => removeDesc(idx)}
                  showRemove={(mode === 'addSection' || mode === 'addDescription') && descriptions.length > 1}
                />
              ))}
              {(mode === 'addSection' || mode === 'addDescription') && (
                <TouchableOpacity onPress={addDesc} style={styles.addDescBtn}>
                  <Plus size={14} color="#60a5fa" />
                  <Text style={styles.addDescText}>Add Another Description</Text>
                </TouchableOpacity>
              )}
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
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 11, color: '#60a5fa', marginTop: 2 },
  closeBtn: { padding: 6 },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  addDescBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 },
  addDescText: { fontSize: 13, color: '#60a5fa', fontWeight: '600' },
  deleteConfirm: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  deleteText: { fontSize: 14, color: '#cbd5e1', textAlign: 'center' },
  deleteSubText: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
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
