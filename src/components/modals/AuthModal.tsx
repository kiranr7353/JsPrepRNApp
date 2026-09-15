import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { X, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react-native';
import { auth, saveStoredUserData } from '../../services/firebase';
import { syncLoginWithBackend, syncRegistrationWithBackend } from '../../services/api';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setLoading(true);
    const guestProfile: UserProfile = {
      uid: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'candidate@jsprep.dev',
      displayName: 'Guest Candidate',
      isGuest: true,
      bookmarkedQAIds: ['js-1', 'react-1'],
      bookmarkedPQAIds: ['p-1'],
      completedQuestions: ['js-1'],
    };
    await saveStoredUserData(guestProfile);
    onUserUpdated(guestProfile);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in both email and password'); return; }
    if (isRegister && password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError(null);
    try {
      const cred = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const refreshToken = (cred.user as any).refreshToken || '';
      const nameParts = name.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || email.split('@')[0];
      const lastName = nameParts.slice(1).join(' ');

      if (isRegister) {
        await syncRegistrationWithBackend({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          idToken,
          refreshToken,
          code: '+91',
          phoneNumber: '',
          dob: null,
        });
      } else {
        await syncLoginWithBackend(idToken, refreshToken);
      }

      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: isRegister ? (name || email.split('@')[0]) : (cred.user.displayName || email.split('@')[0]),
        isGuest: false,
        bookmarkedQAIds: user.bookmarkedQAIds,
        bookmarkedPQAIds: user.bookmarkedPQAIds,
        completedQuestions: user.completedQuestions,
      };
      await saveStoredUserData(profile);
      onUserUpdated(profile);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.logo}><Text style={styles.logoText}>JP</Text></View>
                <View>
                  <Text style={styles.title}>{isRegister ? 'Create Account' : 'Candidate Sign In'}</Text>
                  <Text style={styles.sub}>Firebase Auth & Firestore Synced</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={16} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Auth status */}
            <View style={styles.firebaseBadge}>
              <Text style={styles.firebaseBadgeText}>Signed in as: <Text style={{ fontWeight: 'bold' }}>{user.email || email || 'Guest Candidate'}</Text></Text>
              <View style={styles.onlinePill}><Text style={styles.onlinePillText}>Online</Text></View>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <AlertCircle size={14} color="#f87171" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isRegister && (
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrap}>
                  <User size={14} color="#64748b" style={styles.inputIcon} />
                  <TextInput value={name} onChangeText={setName} placeholder="Your Name" placeholderTextColor="#64748b" style={styles.input} />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Mail size={14} color="#64748b" style={styles.inputIcon} />
                <TextInput value={email} onChangeText={setEmail} placeholder="dev@example.com" placeholderTextColor="#64748b" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            {isRegister && (
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrap}>
                  <Lock size={14} color="#64748b" style={styles.inputIcon} />
                  <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" placeholderTextColor="#64748b" style={styles.input} secureTextEntry />
                </View>
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={14} color="#64748b" style={styles.inputIcon} />
                <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#64748b" style={styles.input} secureTextEntry />
              </View>
            </View>

            <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[styles.submitBtn, loading && styles.submitBtnDisabled]}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitBtnText}>{isRegister ? 'Register' : 'Sign In'}</Text>}
            </TouchableOpacity>

            <View style={styles.divider}><Text style={styles.dividerText}>or</Text></View>

            <TouchableOpacity onPress={handleGuestLogin} disabled={loading} style={styles.guestBtn}>
              <Sparkles size={14} color="#fbbf24" />
              <Text style={styles.guestBtnText}>Continue as Guest Candidate</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setIsRegister(!isRegister); setError(null); }} style={styles.toggleBtn}>
              <Text style={styles.toggleBtnText}>
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  content: { padding: 20, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 10, color: '#94a3b8' },
  closeBtn: { padding: 6, borderRadius: 8, backgroundColor: '#1e293b' },
  firebaseBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 10 },
  firebaseBadgeText: { fontSize: 11, color: '#cbd5e1' },
  onlinePill: { backgroundColor: 'rgba(52,211,153,0.1)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  onlinePillText: { fontSize: 10, color: '#34d399', fontWeight: 'bold' },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(244,63,94,0.1)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.3)', borderRadius: 10, padding: 10 },
  errorText: { fontSize: 11, color: '#fca5a5', flex: 1 },
  field: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#cbd5e1' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#020617', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 12, color: '#fff', paddingVertical: 10 },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  divider: { alignItems: 'center' },
  dividerText: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  guestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingVertical: 12 },
  guestBtnText: { fontSize: 12, fontWeight: '600', color: '#e2e8f0' },
  toggleBtn: { alignItems: 'center', paddingBottom: 8 },
  toggleBtnText: { fontSize: 11, color: '#60a5fa' },
});
