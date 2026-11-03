import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { FormDescription, FormPoint, emptyPoint } from '../../services/adminApi';

interface Props {
  desc: FormDescription;
  index: number;
  onChange: (updated: FormDescription) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const DescriptionFormBlock: React.FC<Props> = ({ desc, index, onChange, onRemove, showRemove }) => {
  const update = (patch: Partial<FormDescription>) => onChange({ ...desc, ...patch });

  const addPoint = () => {
    const next = [...desc.pointsData, emptyPoint(desc.pointsData.length + 1)];
    update({ pointsData: next });
  };

  const updatePoint = (pIdx: number, patch: Partial<FormPoint>) => {
    const next = desc.pointsData.map((p, i) => i === pIdx ? { ...p, ...patch } : p);
    update({ pointsData: next });
  };

  const removePoint = (pIdx: number) => {
    update({ pointsData: desc.pointsData.filter((_, i) => i !== pIdx) });
  };

  const addImageUrl = () => update({ snippet: [...desc.snippet, { url: '', imageUploaded: false }] });

  const updateImageUrl = (iIdx: number, url: string) => {
    const next = desc.snippet.map((s, i) => i === iIdx ? { ...s, url } : s);
    update({ snippet: next });
  };

  const removeImageUrl = (iIdx: number) => update({ snippet: desc.snippet.filter((_, i) => i !== iIdx) });

  const addTableRow = () => update({ tableData: [...desc.tableData, { value1: '', value2: '' }] });
  const removeTableRow = (rIdx: number) => update({ tableData: desc.tableData.filter((_, i) => i !== rIdx) });

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={styles.blockTitle}>Description {index + 1}</Text>
        {showRemove && (
          <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
            <Trash2 size={14} color="#f87171" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Header"
        placeholderTextColor="#64748b"
        value={desc.header}
        onChangeText={(v) => update({ header: v })}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Enter Description"
        placeholderTextColor="#64748b"
        value={desc.data}
        onChangeText={(v) => update({ data: v })}
        multiline
        numberOfLines={3}
      />

      {/* Image URLs */}
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Code Snippet Image URLs</Text>
        <TouchableOpacity onPress={addImageUrl} style={styles.addSmallBtn}>
          <Plus size={12} color="#60a5fa" />
          <Text style={styles.addSmallText}>Add URL</Text>
        </TouchableOpacity>
      </View>
      {desc.snippet.map((snip, iIdx) => (
        <View key={iIdx} style={styles.urlRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Paste Firebase Storage URL"
            placeholderTextColor="#64748b"
            value={snip.url}
            onChangeText={(v) => updateImageUrl(iIdx, v)}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => removeImageUrl(iIdx)} style={styles.iconBtn}>
            <Trash2 size={14} color="#f87171" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Points */}
      <View style={styles.toggleRow}>
        <Text style={styles.fieldLabel}>Add Points</Text>
        <Switch
          value={desc.hasPoints}
          onValueChange={(v) => update({ hasPoints: v, pointsData: v && desc.pointsData.length === 0 ? [emptyPoint(1)] : desc.pointsData })}
          trackColor={{ false: '#334155', true: '#2563eb' }}
          thumbColor="#fff"
        />
      </View>
      {desc.hasPoints && (
        <View style={styles.pointsSection}>
          {desc.pointsData.map((point, pIdx) => (
            <View key={pIdx} style={styles.pointBlock}>
              <View style={styles.row}>
                <Text style={styles.pointLabel}>Point {pIdx + 1}</Text>
                <TouchableOpacity onPress={() => removePoint(pIdx)} style={styles.iconBtn}>
                  <Trash2 size={12} color="#f87171" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Point Header (optional)"
                placeholderTextColor="#64748b"
                value={point.pointHeader}
                onChangeText={(v) => updatePoint(pIdx, { pointHeader: v })}
              />
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Point Value *"
                placeholderTextColor="#64748b"
                value={point.value}
                onChangeText={(v) => updatePoint(pIdx, { value: v })}
                multiline
                numberOfLines={2}
              />
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="Point Code (optional)"
                placeholderTextColor="#64748b"
                value={point.code}
                onChangeText={(v) => updatePoint(pIdx, { code: v })}
                multiline
                numberOfLines={2}
              />
            </View>
          ))}
          <TouchableOpacity onPress={addPoint} style={styles.addPointBtn}>
            <Plus size={12} color="#60a5fa" />
            <Text style={styles.addSmallText}>Add Another Point</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Table */}
      <View style={styles.toggleRow}>
        <Text style={styles.fieldLabel}>Add Table</Text>
        <Switch
          value={desc.hasTable}
          onValueChange={(v) => update({ hasTable: v })}
          trackColor={{ false: '#334155', true: '#2563eb' }}
          thumbColor="#fff"
        />
      </View>
      {desc.hasTable && (
        <View style={styles.tableSection}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Column 1 header"
              placeholderTextColor="#64748b"
              value={desc.tableColumns[0]?.value || ''}
              onChangeText={(v) => {
                const cols = [...desc.tableColumns];
                cols[0] = { value: v };
                update({ tableColumns: cols });
              }}
            />
            <View style={{ width: 8 }} />
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Column 2 header"
              placeholderTextColor="#64748b"
              value={desc.tableColumns[1]?.value || ''}
              onChangeText={(v) => {
                const cols = [...desc.tableColumns];
                cols[1] = { value: v };
                update({ tableColumns: cols });
              }}
            />
          </View>
          {desc.tableData.map((row, rIdx) => (
            <View key={rIdx} style={[styles.row, { marginTop: 6 }]}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder={`Row ${rIdx + 1}, Col 1`}
                placeholderTextColor="#64748b"
                value={row.value1}
                onChangeText={(v) => {
                  const rows = [...desc.tableData];
                  rows[rIdx] = { ...rows[rIdx], value1: v };
                  update({ tableData: rows });
                }}
              />
              <View style={{ width: 8 }} />
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder={`Row ${rIdx + 1}, Col 2`}
                placeholderTextColor="#64748b"
                value={row.value2}
                onChangeText={(v) => {
                  const rows = [...desc.tableData];
                  rows[rIdx] = { ...rows[rIdx], value2: v };
                  update({ tableData: rows });
                }}
              />
              <TouchableOpacity onPress={() => removeTableRow(rIdx)} style={[styles.iconBtn, { marginLeft: 4 }]}>
                <Trash2 size={12} color="#f87171" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addTableRow} style={[styles.addPointBtn, { marginTop: 6 }]}>
            <Plus size={12} color="#60a5fa" />
            <Text style={styles.addSmallText}>Add Row</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 12, marginBottom: 10 },
  blockHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  blockTitle: { fontSize: 12, color: '#60a5fa', fontWeight: '700' },
  removeBtn: { padding: 4 },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 12, color: '#f1f5f9', marginBottom: 8 },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  codeInput: { minHeight: 56, textAlignVertical: 'top', fontFamily: 'monospace', fontSize: 11, color: '#93c5fd' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 6 },
  addSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  addSmallText: { fontSize: 11, color: '#60a5fa', fontWeight: '600' },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  iconBtn: { padding: 6 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 },
  pointsSection: { marginTop: 4 },
  pointBlock: { backgroundColor: '#020617', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#1e293b' },
  pointLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  addPointBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 },
  tableSection: { marginTop: 4 },
});
