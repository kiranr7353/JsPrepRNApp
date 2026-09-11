import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { UserProfile } from '../types';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onAuthClick?: () => void;
  onAIClick?: () => void;
  user: UserProfile;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title, subtitle, showBack, onBack, onAuthClick, onAIClick, user,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ChevronLeft size={24} color="#cbd5e1" />
          </TouchableOpacity>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.right}>
        {onAIClick && (
          <TouchableOpacity onPress={onAIClick} style={styles.aiBtn}>
            <Sparkles size={14} color="#fbbf24" />
            <Text style={styles.aiBtnText}>AI Coach</Text>
          </TouchableOpacity>
        )}
        {onAuthClick && (
          <TouchableOpacity onPress={onAuthClick} style={styles.authBtn}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'G'}
              </Text>
            </View>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  backBtn: { marginRight: 4, marginLeft: -4 },
  titleWrap: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 11, color: '#94a3b8', marginTop: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 5,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)',
    borderRadius: 8,
  },
  aiBtnText: { fontSize: 11, color: '#fbbf24', fontWeight: '600' },
  authBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: '#1e293b',
    borderWidth: 1, borderColor: '#334155',
    borderRadius: 20,
  },
  avatar: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34d399' },
});
