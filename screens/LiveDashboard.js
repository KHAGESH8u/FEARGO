import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NeumorphicView from '../components/NeumorphicView';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;
const cardPadding = isLargeScreen ? 24 : 16;
const cardMargin = isLargeScreen ? 24 : 12;

export default function LiveDashboard({ onEndSession, onBack }) {
  // Original Question State
  const [questions, setQuestions] = useState([
    { id: 1, text: "I didn't understand the formula in step 3." },
    { id: 2, text: "Could you repeat the definition of Neumorphism?" },
  ]);

  // --- NEW PULSE SYSTEM STATE ---
  const [pulseActive, setPulseActive] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [pulseHistory, setPulseHistory] = useState([]);

  // Current active data. Total 45 students connected.
  const [responsesCount, setResponsesCount] = useState({ gotIt: 0, sortOf: 0, lost: 0, total: 0 });

  const handleDismiss = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const startPulse = () => {
    setPulseActive(true);
    setPulseCount(prev => prev + 1);
    // Hardcoding the request's specific numbers as the "live" snapshot for demo purposes
    setResponsesCount({ gotIt: 28, sortOf: 10, lost: 7, total: 45 });
  };

  // Safe wrapper for calculating percentages
  const getPercentage = (value, total) => {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
  };

  const endPulse = () => {
    setPulseActive(false);

    // Save to history log
    if (responsesCount.total > 0) {
      const gotItPct = getPercentage(responsesCount.gotIt, responsesCount.total);
      setPulseHistory([{ id: pulseCount, title: `Topic Feedback`, gotItPct }, ...pulseHistory]);
    }

    // Reset Data for next pulse
    setResponsesCount({ gotIt: 0, sortOf: 0, lost: 0, total: 0 });
  };

  const isHighConfusion = pulseActive && ((responsesCount.lost / responsesCount.total) > 0.4);

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── SKY-BLUE HEADER ── */}
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
        <View style={styles.maxWidthContainer}>


          {/* SECTION 1 — SESSION JOIN CARD */}
          <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
            <View style={isLargeScreen ? styles.row : styles.column}>
              <View style={[styles.flex1, styles.qrSection]}>
                <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Scan to Join Session</Text>
                <NeumorphicView inset={true} style={styles.qrContainer}>
                  <Ionicons name="qr-code-outline" size={70} color="#2f3542" />
                </NeumorphicView>
                <Text style={styles.secondaryText}>
                  Students can scan this QR code to join the session instantly.
                </Text>
              </View>

              <View style={[styles.flex1, styles.joinCodeSection]}>
                <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Session Code</Text>
                <View style={[styles.codeRow, { marginBottom: 16 }]}>
                  <NeumorphicView style={styles.pillContainer}>
                    <Text style={styles.largeCodeText} numberOfLines={1} adjustsFontSizeToFit>4821</Text>
                  </NeumorphicView>
                  <TouchableOpacity>
                    <NeumorphicView style={styles.iconButton}>
                      <Ionicons name="copy-outline" size={20} color="#4f8cff" />
                    </NeumorphicView>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </NeumorphicView>

          {/* END SESSION CARD */}
          <NeumorphicView style={[styles.card, { padding: cardPadding }, styles.spacingTop]}>
            <View style={{ flexDirection: isLargeScreen ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.cardTitle, { marginBottom: isLargeScreen ? 0 : 12 }]}>Session Management</Text>
              <TouchableOpacity onPress={onEndSession}>
                <NeumorphicView style={[styles.pulseButtonDanger, { paddingVertical: 10, paddingHorizontal: 20 }]}>
                  <Ionicons name="power" size={18} color="#FF5C5C" style={{ marginRight: 8 }} />
                  <Text style={[styles.pulseButtonText, { color: '#FF5C5C', fontSize: 14 }]}>End Session</Text>
                </NeumorphicView>
              </TouchableOpacity>
            </View>
          </NeumorphicView>

          {/* SECTION 2 — SESSION INFO */}
          <View style={styles.spacingTop}>
            <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
              <View style={styles.centerContent}>
                <Ionicons name="people" size={32} color="#4f8cff" />
                <Text style={styles.metricNumber} numberOfLines={1} adjustsFontSizeToFit>45</Text>
                <Text style={styles.cardLabel}>Students Connected</Text>
              </View>
            </NeumorphicView>
          </View>

          {/* NEW SECTION — PULSE CONTROL PANEL */}
          <NeumorphicView style={[styles.card, { padding: cardPadding }, styles.spacingTop]}>
            <Text style={styles.cardTitle}>Pulse Check Control</Text>

            <View style={[isLargeScreen ? styles.row : styles.column, { alignItems: 'center', justifyContent: 'space-between' }]}>

              {/* Primary Action Button */}
              <TouchableOpacity onPress={pulseActive ? endPulse : startPulse} style={isLargeScreen ? { flex: 1 } : { width: '100%', marginBottom: 20 }}>
                <NeumorphicView style={pulseActive ? styles.pulseButtonDanger : styles.pulseButtonPrimary}>
                  <Ionicons name="pulse" size={24} color={pulseActive ? "#FF5C5C" : "#4f8cff"} style={{ marginRight: 8 }} />
                  <Text style={[styles.pulseButtonText, pulseActive && { color: '#FF5C5C' }]}>
                    {pulseActive ? 'End Pulse Check' : 'Start Pulse Check'}
                  </Text>
                </NeumorphicView>
              </TouchableOpacity>

              {/* Status Display */}
              <View style={[styles.centerContent, isLargeScreen ? { flex: 1 } : { width: '100%', marginBottom: 20 }]}>
                <View style={styles.statusRow}>
                  <Text style={styles.cardLabel}>Pulse Status:  </Text>
                  {pulseActive ? (
                    <View style={styles.statusBadgeActive}>
                      <View style={styles.glowingDot} />
                      <Text style={styles.statusTextActive}>Active</Text>
                    </View>
                  ) : (
                    <Text style={styles.statusTextClosed}>Closed</Text>
                  )}
                </View>
                <Text style={styles.secondaryText}>
                  Responses Received: {pulseActive ? responsesCount.total : 0} / 45
                </Text>
              </View>

            </View>
          </NeumorphicView>

          {/* SECTION 3 — LIVE COMPREHENSION CARDS */}
          {pulseActive && (
            <Text style={[styles.pulseHistoryLabel, { textAlign: 'center', marginBottom: 12 }]}>
              Pulse #{pulseCount} — Topic Feedback
            </Text>
          )}

          <View style={[isLargeScreen ? styles.row : styles.rowWrap, styles.spacingTop]}>

            {/* GOT IT */}
            <NeumorphicView
              style={[styles.smallCard, styles.flex1, { opacity: pulseActive ? 1 : 0.4 }, isLargeScreen ? { marginRight: cardMargin } : styles.mobileCardMargin]}
              isGlow={pulseActive}
              glowColor="#4CAF50"
            >
              <View style={styles.centerContent}>
                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                {pulseActive ? (
                  <>
                    <Text style={[styles.metricNumber, { color: '#4CAF50' }]} numberOfLines={1}>{responsesCount.gotIt}</Text>
                    <Text style={styles.cardLabelSmall}>Got It</Text>
                    <Text style={styles.subtitleText}>{responsesCount.gotIt} responses</Text>
                    <Text style={styles.percentageText}>{getPercentage(responsesCount.gotIt, responsesCount.total)}</Text>
                  </>
                ) : (
                  <View style={{ height: 80, justifyContent: 'center' }}>
                    <Text style={styles.waitingText}>Waiting for{'\n'}Pulse Check</Text>
                  </View>
                )}
              </View>
            </NeumorphicView>

            {/* SORT OF */}
            <NeumorphicView
              style={[styles.smallCard, styles.flex1, { opacity: pulseActive ? 1 : 0.4 }, isLargeScreen ? { marginRight: cardMargin } : styles.mobileCardMargin]}
            >
              <View style={styles.centerContent}>
                <MaterialCommunityIcons name="head-lightbulb-outline" size={28} color="#FFC107" />
                {pulseActive ? (
                  <>
                    <Text style={[styles.metricNumber, { color: '#FFC107' }]} numberOfLines={1}>{responsesCount.sortOf}</Text>
                    <Text style={styles.cardLabelSmall}>Sort Of</Text>
                    <Text style={styles.subtitleText}>{responsesCount.sortOf} responses</Text>
                    <Text style={styles.percentageText}>{getPercentage(responsesCount.sortOf, responsesCount.total)}</Text>
                  </>
                ) : (
                  <View style={{ height: 80, justifyContent: 'center' }}>
                    <Text style={styles.waitingText}>Waiting for{'\n'}Pulse Check</Text>
                  </View>
                )}
              </View>
            </NeumorphicView>

            {/* LOST */}
            <NeumorphicView
              style={[styles.smallCard, styles.flex1, { opacity: pulseActive ? 1 : 0.4 }, isLargeScreen ? {} : styles.mobileCardMargin]}
            >
              <View style={styles.centerContent}>
                <Ionicons name="alert-circle" size={28} color="#FF5C5C" />
                {pulseActive ? (
                  <>
                    <Text style={[styles.metricNumber, { color: '#FF5C5C' }]} numberOfLines={1}>{responsesCount.lost}</Text>
                    <Text style={styles.cardLabelSmall}>Lost</Text>
                    <Text style={styles.subtitleText}>{responsesCount.lost} responses</Text>
                    <Text style={styles.percentageText}>{getPercentage(responsesCount.lost, responsesCount.total)}</Text>
                  </>
                ) : (
                  <View style={{ height: 80, justifyContent: 'center' }}>
                    <Text style={styles.waitingText}>Waiting for{'\n'}Pulse Check</Text>
                  </View>
                )}
              </View>
            </NeumorphicView>
          </View>

          {/* SECTION 4 — LIVE UNDERSTANDING CHART */}
          <NeumorphicView style={[styles.card, { padding: cardPadding, opacity: pulseActive ? 1 : 0.5 }, styles.spacingTop]}>
            <Text style={styles.cardTitle}>Pulse Check Results</Text>

            <View style={styles.chartContainer}>
              <NeumorphicView style={styles.donutOuter}>
                {/* Show empty gray circle if inactive, otherwise show colored fragments */}
                {!pulseActive ? (
                  <View style={[styles.donutMaskGreen, { borderColor: '#d1d9e6', borderWidth: 80 }]} />
                ) : (
                  <>
                    <View style={styles.donutMaskGreen} />
                    <View style={styles.donutMaskYellow} />
                    <View style={styles.donutMaskRed} />
                  </>
                )}
                <NeumorphicView style={styles.donutInner} />
              </NeumorphicView>

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} /><Text style={styles.cardLabelSmall}>Got It</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} /><Text style={styles.cardLabelSmall}>Sort Of</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FF5C5C' }]} /><Text style={styles.cardLabelSmall}>Lost</Text></View>
              </View>
            </View>
          </NeumorphicView>

          {/* SECTION 5 — CONFUSION ALERT (Conditionally Visible) */}
          {isHighConfusion && (
            <NeumorphicView style={[styles.card, { padding: cardPadding }, styles.spacingTop]} isGlow={true} glowColor="#FFC107">
              <View style={styles.alertRow}>
                <View style={styles.alertIcon}>
                  <Ionicons name="warning" size={28} color="#FFC107" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.alertTitle}>Alert: Many students are confused</Text>
                  <Text style={styles.alertSubtext}>
                    More than 40% of students selected "Lost". Consider pausing and re-explaining the topic.
                  </Text>
                </View>
              </View>
            </NeumorphicView>
          )}

          {/* NEW SECTION — PULSE HISTORY (Optional Display) */}
          <NeumorphicView style={[styles.card, { padding: cardPadding }, styles.spacingTop]}>
            <Text style={styles.cardTitle}>Pulse History</Text>
            <View style={styles.questionsContainer}>
              {pulseHistory.length === 0 ? (
                <Text style={styles.secondaryText}>No pulses run yet for this session.</Text>
              ) : (
                pulseHistory.map((ph, idx) => (
                  <View key={idx} style={styles.historyRow}>
                    <Ionicons name="analytics" size={20} color="#6b7280" />
                    <Text style={[styles.cardLabelSmall, { marginLeft: 12, flex: 1, textAlign: 'left' }]}>Pulse {ph.id} — {ph.title}</Text>
                    <Text style={[styles.percentageText, { marginTop: 0 }]}>{ph.gotItPct} Got It</Text>
                  </View>
                ))
              )}
            </View>
          </NeumorphicView>

          {/* SECTION 6 — ANONYMOUS QUESTION QUEUE */}
          <NeumorphicView style={[styles.card, { padding: cardPadding }, styles.spacingTop]}>
            <Text style={styles.cardTitle}>Anonymous Questions</Text>
            <View style={styles.questionsContainer}>
              {questions.length === 0 ? (
                <Text style={styles.secondaryText}>No questions at the moment.</Text>
              ) : (
                questions.map((q) => (
                  <NeumorphicView key={q.id} style={styles.questionCard}>
                    <Text style={styles.questionText}>"{q.text}"</Text>
                    <View style={styles.questionActions}>
                      <TouchableOpacity>
                        <NeumorphicView style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>Answer</Text>
                        </NeumorphicView>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDismiss(q.id)}>
                        <NeumorphicView style={styles.actionButtonSecondary}>
                          <Text style={styles.actionButtonTextSecondary}>Dismiss</Text>
                        </NeumorphicView>
                      </TouchableOpacity>
                    </View>
                  </NeumorphicView>
                ))
              )}
            </View>
          </NeumorphicView>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Sky-Blue Header ──
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
  headerPageTitle: { fontSize: 16, fontWeight: '600', color: 'rgba(0, 0, 0, 0.9)', padding: 10 },
  backPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  backPillText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },
  scrollContainer: { padding: Platform.OS === 'web' ? 40 : 16, alignItems: 'center', backgroundColor: '#e0e5ec', minHeight: '100%' },
  maxWidthContainer: { width: '100%', maxWidth: 1200 },
  pageTitle: { fontSize: isLargeScreen ? 28 : 22, fontWeight: 'bold', color: '#2f3542', fontFamily: Platform.OS === 'ios' ? 'Inter' : 'sans-serif', marginBottom: isLargeScreen ? 40 : 20, marginTop: isLargeScreen ? 0 : 20, textAlign: isLargeScreen ? 'left' : 'center' },
  card: { borderRadius: 24, marginBottom: isLargeScreen ? 24 : 16 },
  smallCard: { borderRadius: 20, padding: 12, marginBottom: isLargeScreen ? 24 : 16 },
  cardTitle: { fontSize: isLargeScreen ? 20 : 18, fontWeight: 'bold', color: '#2f3542', marginBottom: 16, textAlign: isLargeScreen ? 'left' : 'center' },
  row: { flexDirection: 'row' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  column: { flexDirection: 'column' },
  flex1: { flex: 1, minWidth: isLargeScreen ? 0 : 90 },
  mobileCardMargin: { marginHorizontal: 4 },
  spacingTop: { marginTop: 0 },
  spacingMedium: { height: 24 },
  centerContent: { alignItems: 'center', justifyContent: 'center' },

  // Custom Pulse Elements
  pulseButtonPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, backgroundColor: '#e0e5ec' },
  pulseButtonDanger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 30, backgroundColor: '#e0e5ec' },
  pulseButtonText: { fontSize: 18, fontWeight: 'bold', color: '#4f8cff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusBadgeActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0ebf6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#4f8cff33' },
  glowingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f8cff', marginRight: 6 },
  statusTextActive: { fontSize: 16, fontWeight: 'bold', color: '#4f8cff' },
  statusTextClosed: { fontSize: 16, fontWeight: 'bold', color: '#6b7280' },
  timerText: { fontSize: 32, fontWeight: 'bold', color: '#2f3542', letterSpacing: 2 },
  waitingText: { textAlign: 'center', fontSize: 13, color: '#6b7280', fontWeight: 'bold', fontStyle: 'italic' },
  subtitleText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  pulseHistoryLabel: { fontSize: 14, fontWeight: 'bold', color: '#4f8cff', letterSpacing: 1 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#d1d9e6' },

  qrSection: { alignItems: 'center', borderRightWidth: isLargeScreen ? 1 : 0, borderBottomWidth: isLargeScreen ? 0 : 1, borderColor: '#d1d9e6', paddingRight: isLargeScreen ? 24 : 0, paddingBottom: isLargeScreen ? 0 : 16, marginBottom: isLargeScreen ? 0 : 16 },
  qrContainer: { width: 120, height: 120, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  secondaryText: { fontSize: 14, color: '#6b7280', textAlign: 'center', paddingHorizontal: 8 },
  joinCodeSection: { paddingLeft: isLargeScreen ? 24 : 0, alignItems: isLargeScreen ? 'flex-start' : 'center', paddingTop: isLargeScreen ? 0 : 12 },
  codeRow: { flexDirection: 'row', alignItems: 'center' },
  pillContainer: { borderRadius: 30, paddingVertical: 10, paddingHorizontal: 20, marginRight: 12, maxWidth: 150 },
  largeCodeText: { fontSize: isLargeScreen ? 32 : 24, fontWeight: 'bold', color: '#2f3542', textAlign: 'center' },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  linkText: { fontSize: isLargeScreen ? 18 : 16, color: '#4f8cff', fontWeight: '600', marginRight: 12 },
  iconButtonSmall: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  metricNumber: { fontSize: isLargeScreen ? 36 : 28, fontWeight: 'bold', color: '#2f3542', marginVertical: 4, textAlign: 'center' },
  cardLabel: { fontSize: isLargeScreen ? 16 : 14, fontWeight: '600', color: '#2f3542', textAlign: 'center' },
  cardLabelSmall: { fontSize: 12, fontWeight: '600', color: '#2f3542', textAlign: 'center' },
  percentageText: { fontSize: 14, fontWeight: 'bold', color: '#6b7280', marginTop: 4 },
  chartContainer: { alignItems: 'center', marginVertical: 16 },
  donutOuter: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  donutInner: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#e0e5ec', zIndex: 10 },
  donutMaskGreen: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 30, borderColor: '#4CAF50', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '45deg' }] },
  donutMaskYellow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 30, borderColor: '#FFC107', borderTopColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '45deg' }] },
  donutMaskRed: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 30, borderColor: '#FF5C5C', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '-45deg' }] },
  legendContainer: { flexDirection: 'row', marginTop: 24, justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  alertRow: { flexDirection: 'row', alignItems: 'center' },
  alertIcon: { marginRight: 12 },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#2f3542', marginBottom: 4 },
  alertSubtext: { fontSize: 12, color: '#6b7280', lineHeight: 18 },
  questionsContainer: { marginTop: 8 },
  questionCard: { padding: 16, borderRadius: 16, marginBottom: 16, flexDirection: 'column', alignItems: 'flex-start' },
  questionText: { fontSize: 14, color: '#2f3542', fontStyle: 'italic', marginBottom: 16 },
  questionActions: { flexDirection: 'row', gap: 10 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  actionButtonText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 12 },
  actionButtonSecondary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  actionButtonTextSecondary: { color: '#6b7280', fontWeight: 'bold', fontSize: 12 }
});
