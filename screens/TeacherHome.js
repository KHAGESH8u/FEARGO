import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
  ScrollView, Dimensions, Platform, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NeumorphicView from '../components/NeumorphicView';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

// ── Mock past sessions ──────────────────────────────────────────────────────
const PAST_SESSIONS = [
  { id: 's1', code: '4821', date: 'March 28, 2026', duration: '52 min', students: 45 },
  { id: 's2', code: '3194', date: 'March 26, 2026', duration: '38 min', students: 40 },
  { id: 's3', code: '7732', date: 'March 24, 2026', duration: '45 min', students: 38 },
];

export default function TeacherHome({ onCreateSession, onViewSummary, onBack }) {

  const renderSessionCard = (session) => (
    <NeumorphicView key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionCardTop}>
        {/* Left: Meta */}
        <View style={styles.sessionMeta}>
          <View style={styles.codeRow}>
            <Ionicons name="keypad-outline" size={14} color="#4f8cff" style={{ marginRight: 5 }} />
            <Text style={styles.sessionCode}>Session: {session.code}</Text>
          </View>
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{session.date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{session.duration}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{session.students} students</Text>
            </View>
          </View>
        </View>

        {/* Right: View Summary Button */}
        <TouchableOpacity onPress={() => onViewSummary(session)} activeOpacity={0.8}>
          <NeumorphicView style={styles.viewSummaryBtn}>
            <Ionicons name="bar-chart-outline" size={14} color="#4f8cff" style={{ marginBottom: 3 }} />
            <Text style={styles.viewSummaryText}>View{"\n"}Summary</Text>
          </NeumorphicView>
        </TouchableOpacity>
      </View>
    </NeumorphicView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── SKY-BLUE HEADER (same as SessionSummary) ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Ionicons name="pulse" size={24} color="#fff" />
          <Text style={styles.headerAppName}>ClassPulse</Text>
        </View>
        <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
          <View style={styles.backPill}>
            <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.backPillText}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* ── SECTION 2: WELCOME ── */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, Host a Session </Text>
          
        </View>

        {/* ── SECTION 3: CREATE SESSION BUTTON ── */}
        <TouchableOpacity onPress={onCreateSession} activeOpacity={0.85} style={styles.createButtonWrapper}>
          <NeumorphicView style={styles.createButton} isGlow={true} glowColor="#4f8cff">
            <View style={styles.createButtonInner}>
              <View style={styles.createIconCircle}>
                <Ionicons name="add-circle" size={32} color="#fff" />
              </View>
              <View style={styles.createTextBlock}>
                <Text style={styles.createButtonLabel}>Create Session</Text>
                <Text style={styles.createButtonSub}>Generates a unique code + QR for students</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
            </View>
          </NeumorphicView>
        </TouchableOpacity>

        {/* ── SECTION 4: PAST SESSIONS ── */}
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#4f8cff" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Session Review Summary</Text>
        </View>

        {PAST_SESSIONS.length === 0 ? (
          <NeumorphicView style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={40} color="#d1d9e6" />
            <Text style={styles.emptyTitle}>No previous sessions found.</Text>
            <Text style={styles.emptySubtext}>
              Start your first session using the Create Session button.
            </Text>
          </NeumorphicView>
        ) : (
          PAST_SESSIONS.map(renderSessionCard)
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },

  // ── Header ────────────────────────────────────────────────────────────────
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
  headerPageTitle: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  backPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  backPillText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContainer: {
    paddingHorizontal: isLargeScreen ? 60 : 16,
    paddingTop: 28,
    paddingBottom: 16,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Welcome ───────────────────────────────────────────────────────────────
  welcomeSection: { alignItems: 'center', marginBottom: 28 },
  welcomeTitle: { fontSize: 26, fontWeight: 'bold', color: '#2f3542', textAlign: 'center' },
  welcomeSubtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginTop: 8, lineHeight: 22, maxWidth: 360 },

  // ── Create Button ─────────────────────────────────────────────────────────
  createButtonWrapper: { width: '100%', marginBottom: 32 },
  createButton: {
    borderRadius: 24,
    backgroundColor: '#4f8cff',
    padding: 20,
  },
  createButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  createTextBlock: { flex: 1 },
  createButtonLabel: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  createButtonSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 },

  // ── Section Header ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1dce8',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2f3542' },

  // ── Session Cards ─────────────────────────────────────────────────────────
  sessionCard: { borderRadius: 16, padding: 14, marginBottom: 10 },
  sessionCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sessionMeta: { flex: 1, marginRight: 12 },
  codeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sessionCode: { fontSize: 15, fontWeight: 'bold', color: '#2f3542' },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  metaText: { fontSize: 12, color: '#6b7280' },

  viewSummaryBtn: {
    width: 68,
    height: 68,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  viewSummaryText: { fontSize: 11, fontWeight: '700', color: '#4f8cff', textAlign: 'center', lineHeight: 14 },

  // ── Empty State ───────────────────────────────────────────────────────────
  emptyCard: { borderRadius: 20, padding: 36, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#2f3542', marginTop: 14, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#94a3b8', marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
