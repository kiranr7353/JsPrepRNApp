import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BookOpen, Code2, Bookmark, FileCode } from 'lucide-react-native';
import { MainTab } from '../types';

interface MobileBottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  bookmarkCount: number;
}

const tabs: { id: MainTab; label: string; Icon: any }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'qa', label: 'Q&A', Icon: BookOpen },
  { id: 'programming', label: 'Coding', Icon: Code2 },
  { id: 'bookmarks', label: 'Saved', Icon: Bookmark },
  { id: 'export', label: 'RN Code', Icon: FileCode },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onTabChange, bookmarkCount }) => {
  return (
    <View style={styles.nav}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <TouchableOpacity key={id} onPress={() => onTabChange(id)} style={styles.tab}>
            <View>
              <Icon size={20} color={isActive ? '#60a5fa' : '#94a3b8'} />
              {id === 'bookmarks' && bookmarkCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bookmarkCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    color: '#94a3b8',
  },
  labelActive: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
