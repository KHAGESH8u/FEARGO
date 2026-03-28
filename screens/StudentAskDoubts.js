import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
  TextInput, ScrollView, Dimensions, Platform, StatusBar, KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NeumorphicView from '../components/NeumorphicView';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

// ─── MOCK: Pre-seeded answered doubts ───────────────────────────────────────
const INITIAL_ANSWERED = [
  {
    id: 'a1',
    question: 'Why does the formula change in step 2?',
    answer: 'The formula changes because the covariance becomes negative in that step.',
    timestamp: '10 minutes ago',
  },
];

export default function StudentAskDoubts({ sessionCode, onLeave, onPulseCheck }) {
  const [doubtText, setDoubtText] = useState('');
  const [pendingDoubts, setPendingDoubts] = useState([]);
  const [answeredDoubts, setAnsweredDoubts] = useState(INITIAL_ANSWERED);
  const nextId = React.useRef(1);

  const submitDoubt = () => {
    if (doubtText.trim().length === 0) return;
    const newDoubt = {
      id: `p${nextId.current++}`,
      question: doubtText.trim(),
      timestamp: 'Just now',
    };
    setPendingDoubts(prev => [newDoubt, ...prev]);
    setDoubtText('');
  };

  // ─── Renders ────────────────────────────────────────────────────────────────

  const renderPendingCard = (item) => (
    <NeumorphicView key={item.id} style={styles.doubtCard}>
      <View style={styles.doubtCardRow}>
        {/* Question */}
        <View style={styles.doubtTextWrapper}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#4f8cff" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.doubtQuestionText}>"{item.question}"</Text>
        </View>
        {/* Badge */}
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingBadgeText}>Pending</Text>
        </View>
      </View>
      <Text style={styles.timestampText}>Submitted {item.timestamp}</Text>
    </NeumorphicView>
  );

  const renderAnsweredCard = (item) => (
    <NeumorphicView key={item.id} style={styles.doubtCard}>
      <View style={styles.doubtCardRow}>
        <View style={styles.doubtTextWrapper}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#4CAF50" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.doubtQuestionText}>"{item.question}"</Text>
        </View>
        <View style={styles.answeredBadge}>
          <Text style={styles.answeredBadgeText}>Answered</Text>
        </View>
      </View>
      
    </NeumorphicView>
  );

  // ─── UI ─────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── SHARED SKY-BLUE HEADER (matches StudentJoin.js) ── */}
      <View style={styles.headerBar}>
        {/* Left: Logo */}
        <View style={styles.headerLeft}>
          <Ionicons name="pulse" size={24} color="#fff" />
          <Text style={styles.headerAppName}>ClassPulse</Text>
        </View>
        
        {/* Right: Pulse (temp dev) + Leave */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={onPulseCheck} activeOpacity={0.8}>
            <View style={styles.pulseDevButton}>
              <Ionicons name="pulse" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.pulseDevText}>Pulse</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLeave} activeOpacity={0.8}>
            <View style={styles.headerRight}>
              <View style={styles.activeDot} />
              <Text style={styles.headerConnected}>Leave</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── SECTION 2: PAGE TITLE ── */}
          <View style={styles.pageTitleSection}>
            <Text style={styles.pageTitle}>Ask Doubts</Text>
            <Text style={styles.pageSubtitle}>Submit your question anonymously to the teacher.</Text>
          </View>

          {/* ── SECTION 3: DOUBT INPUT CARD ── */}
          <NeumorphicView style={styles.card}>
            <Text style={styles.inputLabel}>Your Question</Text>
            <NeumorphicView inset={true} style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                placeholder={`"I didn't understand the formula in step 3."`}
                placeholderTextColor="#a0aab5"
                value={doubtText}
                onChangeText={setDoubtText}
              />
            </NeumorphicView>
            <Text style={styles.helperText}>Your question will be submitted anonymously.</Text>

            {/* ── SECTION 4: SUBMIT BUTTON ── */}
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={submitDoubt}
              disabled={doubtText.trim().length === 0}
              activeOpacity={0.8}
            >
              <View style={[styles.submitButton, { opacity: doubtText.trim().length > 0 ? 1 : 0.45 }]}>
                <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.submitButtonText}>Submit Doubt</Text>
              </View>
            </TouchableOpacity>
          </NeumorphicView>

          {/* ── SECTION 5: PENDING DOUBTS ── */}
          <NeumorphicView style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={20} color="#FFC107" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Pending Doubts</Text>
              {pendingDoubts.length > 0 && (
                <View style={styles.countBubble}>
                  <Text style={styles.countBubbleText}>{pendingDoubts.length}</Text>
                </View>
              )}
            </View>

            {pendingDoubts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#d1d9e6" />
                <Text style={styles.emptyStateText}>No pending doubts.</Text>
              </View>
            ) : (
              pendingDoubts.map(renderPendingCard)
            )}
          </NeumorphicView>

          {/* ── SECTION 6: ANSWERED DOUBTS ── */}
          <NeumorphicView style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done-outline" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Answered Doubts</Text>
              {answeredDoubts.length > 0 && (
                <View style={[styles.countBubble, { backgroundColor: '#e8f5e9' }]}>
                  <Text style={[styles.countBubbleText, { color: '#4CAF50' }]}>{answeredDoubts.length}</Text>
                </View>
              )}
            </View>

            {answeredDoubts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="hourglass-outline" size={32} color="#d1d9e6" />
                <Text style={styles.emptyStateText}>No answered doubts yet.</Text>
              </View>
            ) : (
              answeredDoubts.map(renderAnsweredCard)
            )}
          </NeumorphicView>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 12,
    paddingBottom: 14,
    backgroundColor: '#0ea5e9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAppName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 8, letterSpacing: 0.5 },
  headerCenter: { alignItems: 'center' },
  headerSessionLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '500', letterSpacing: 0.5 },
  headerSessionCode: { fontSize: 18, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f91111ff', marginRight: 6 },
  headerConnected: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  pulseDevButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,200,0,0.35)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  pulseDevText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scrollContainer: {
    paddingHorizontal: isLargeScreen ? 60 : 16,
    paddingTop: 28,
    paddingBottom: 16,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Page Title ──────────────────────────────────────────────────────────────
  pageTitleSection: { alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#2f3542' },
  pageSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 6, textAlign: 'center' },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: { borderRadius: 24, padding: 20, marginBottom: 20 },

  // ── Input ───────────────────────────────────────────────────────────────────
  inputLabel: { fontSize: 15, fontWeight: '600', color: '#2f3542', marginBottom: 12 },
  textAreaContainer: { borderRadius: 16, padding: 16, minHeight: 120 },
  textArea: { fontSize: 15, color: '#2f3542', flex: 1, outlineStyle: 'none', lineHeight: 22 },
  helperText: { fontSize: 12, color: '#94a3b8', marginTop: 10, fontStyle: 'italic' },

  // ── Submit Button ────────────────────────────────────────────────────────────
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4f8cff',
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

  // ── Section Header ───────────────────────────────────────────────────────────
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2f3542', flex: 1 },
  countBubble: {
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countBubbleText: { fontSize: 13, fontWeight: 'bold', color: '#FFC107' },

  // ── Doubt Cards ──────────────────────────────────────────────────────────────
  doubtCard: { borderRadius: 18, padding: 16, marginBottom: 12 },
  doubtCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  doubtTextWrapper: { flexDirection: 'row', flex: 1, marginRight: 12 },
  doubtQuestionText: { fontSize: 14, color: '#2f3542', fontStyle: 'italic', flex: 1, lineHeight: 20 },
  timestampText: { fontSize: 12, color: '#94a3b8' },

  // ── Badges ───────────────────────────────────────────────────────────────────
  pendingBadge: {
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  pendingBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#FFC107' },
  answeredBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  answeredBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#4CAF50' },

  // ── Teacher Response ─────────────────────────────────────────────────────────
  teacherResponseBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.07)',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  teacherResponseLabel: { fontSize: 11, fontWeight: 'bold', color: '#4CAF50', marginBottom: 4, letterSpacing: 0.5 },
  teacherResponseText: { fontSize: 14, color: '#2f3542', lineHeight: 20 },

  // ── Empty States ─────────────────────────────────────────────────────────────
  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyStateText: { fontSize: 14, color: '#a0aab5', marginTop: 10 },
});
