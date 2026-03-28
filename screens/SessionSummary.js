import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NeumorphicView from '../components/NeumorphicView';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;
const cardPadding = isLargeScreen ? 24 : 16;
const cardMargin = isLargeScreen ? 24 : 12;

export default function SessionSummary({ onRestart, onBack }) {
  // Track expanded state for Timeline cards (default all to minimized)
  const [expandedPulses, setExpandedPulses] = useState({ 1: false, 2: false, 3: false, 4: false });

  const togglePulse = (id) => {
    setExpandedPulses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // SECTION 1 — SESSION SUMMARY HEADER
  const renderHeader = () => (
    <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
      <Text style={[styles.cardTitle, { fontSize: 24, marginBottom: 12 }]}>Session Summary</Text>
      <View style={isLargeScreen ? styles.rowWrap : styles.column}>
        <View style={styles.metadataItem}><Text style={styles.secondaryText}>Session Code:</Text><Text style={styles.metadataValue}>4821</Text></View>
        <View style={styles.metadataItem}><Text style={styles.secondaryText}>Date:</Text><Text style={styles.metadataValue}>March 28, 2026</Text></View>
        <View style={styles.metadataItem}><Text style={styles.secondaryText}>Duration:</Text><Text style={styles.metadataValue}>52 minutes</Text></View>
        <View style={styles.metadataItem}><Text style={styles.secondaryText}>Participants:</Text><Text style={styles.metadataValue}>45</Text></View>
        <View style={styles.metadataItem}><Text style={styles.secondaryText}>Pulse Checks:</Text><Text style={styles.metadataValue}>5</Text></View>
      </View>
    </NeumorphicView>
  );

  // SECTION 2 — OVERALL CLASS UNDERSTANDING
  const renderDonut = () => (
    <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
      <Text style={styles.cardTitle}>Overall Understanding</Text>
      <View style={styles.chartContainer}>
        <NeumorphicView style={styles.donutOuter}>
           {/* Hardcoded 62/23/15 split using CSS borders */}
           <View style={[styles.donutMaskGreen, { transform: [{ rotate: '45deg' }] }]} />
           <View style={[styles.donutMaskYellow, { transform: [{ rotate: '-60deg' }], borderLeftColor: 'transparent' }]} />
           <View style={[styles.donutMaskRed, { transform: [{ rotate: '230deg' }], borderRightColor: 'transparent', borderTopColor: 'transparent' }]} />
           <NeumorphicView style={styles.donutInner}>
             <Text style={styles.donutCenterMetric}>62%</Text>
             <Text style={styles.donutCenterLabel}>Got It</Text>
           </NeumorphicView>
        </NeumorphicView>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} /><Text style={styles.cardLabelSmall}>Got It: 62%</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} /><Text style={styles.cardLabelSmall}>Sort Of: 23%</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FF5C5C' }]} /><Text style={styles.cardLabelSmall}>Lost: 15%</Text></View>
        </View>
      </View>
    </NeumorphicView>
  );

  // SECTION 3 — PULSE CHECK TIMELINE
  const renderTimeline = () => {
    const timelineData = [
      { id: 1, title: 'Introduction', got: 80, sort: 15, lost: 5 },
      { id: 2, title: 'Core Concept', got: 60, sort: 25, lost: 15 },
      { id: 3, title: 'Example Problems', got: 45, sort: 30, lost: 25 },
      { id: 4, title: 'Advanced Idea', got: 70, sort: 20, lost: 10 },
    ];

    return (
      <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
        <Text style={styles.cardTitle}>Pulse Check Timeline</Text>
        <View style={styles.timelineContainer}>
          {timelineData.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              {/* Vertical line and dot */}
              <View style={styles.timelineNode}>
                <View style={styles.timelineDot} />
                {index !== timelineData.length - 1 && <View style={styles.timelineLine} />}
              </View>
              {/* Content Card */}
              <NeumorphicView style={[styles.smallCard, styles.timelineCard, { paddingVertical: expandedPulses[item.id] ? 12 : 10, paddingHorizontal: 16 }]}>
                <TouchableOpacity 
                   style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedPulses[item.id] ? 12 : 0 }}
                   onPress={() => togglePulse(item.id)}
                   activeOpacity={0.7}
                >
                  <Text style={[styles.timelineTitle, { marginBottom: 0, fontSize: 14 }]}>Pulse {item.id} — {item.title}</Text>
                  <Ionicons name={expandedPulses[item.id] ? "chevron-up" : "chevron-down"} size={16} color="#6b7280" />
                </TouchableOpacity>

                {expandedPulses[item.id] && (
                  <View style={styles.timelineMetrics}>
                     <View style={styles.timelineMetricBox}><Text style={[styles.metricNumberTimeline, {color: '#4CAF50'}]}>{item.got}%</Text><Text style={styles.timelineSecondaryText}>Got It</Text></View>
                     <View style={styles.timelineMetricBox}><Text style={[styles.metricNumberTimeline, {color: '#FFC107'}]}>{item.sort}%</Text><Text style={styles.timelineSecondaryText}>Sort Of</Text></View>
                     <View style={styles.timelineMetricBox}><Text style={[styles.metricNumberTimeline, {color: '#FF5C5C'}]}>{item.lost}%</Text><Text style={styles.timelineSecondaryText}>Lost</Text></View>
                  </View>
                )}
              </NeumorphicView>
            </View>
          ))}
        </View>
      </NeumorphicView>
    );
  };

  // SECTION 4 — TOPIC CONFUSION HEATMAP
  const renderHeatmap = () => {
    // Width mapping based on Lost percentage
    const confusionData = [
      { id: 1, title: 'Introduction', width: '10%' },
      { id: 2, title: 'Core Concept', width: '40%' },
      { id: 3, title: 'Example Problems', width: '80%' },
      { id: 4, title: 'Advanced Idea', width: '25%' },
    ];

    return (
      <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
        <Text style={styles.cardTitle}>Topic Confusion Levels</Text>
        <Text style={[styles.secondaryText, { marginBottom: 20 }]}>Higher bars indicate more students selecting "Lost".</Text>
        
        {confusionData.map(item => (
          <View key={item.id} style={styles.heatmapRow}>
            <Text style={styles.heatmapLabel} numberOfLines={1}>{item.title}</Text>
            <View style={styles.heatmapTrackContainer}>
              <NeumorphicView inset={true} style={styles.heatmapTrack}>
                <View style={[styles.heatmapFill, { width: item.width }]} />
              </NeumorphicView>
            </View>
          </View>
        ))}
      </NeumorphicView>
    );
  };

  // SECTION 5 — ENGAGEMENT STATISTICS
  const renderStats = () => (
    <View style={isLargeScreen ? styles.rowWrap : styles.column}>
       <NeumorphicView style={[styles.smallCard, styles.flex1, { marginHorizontal: isLargeScreen ? 6 : 0 }]}>
         <View style={styles.centerContent}><Text style={styles.metricNumber}>45</Text><Text style={styles.cardLabelSmall}>Total Students Joined</Text></View>
       </NeumorphicView>
       <NeumorphicView style={[styles.smallCard, styles.flex1, { marginHorizontal: isLargeScreen ? 6 : 0 }]}>
         <View style={styles.centerContent}><Text style={styles.metricNumber}>178</Text><Text style={styles.cardLabelSmall}>Total Responses</Text></View>
       </NeumorphicView>
       <NeumorphicView style={[styles.smallCard, styles.flex1, { marginHorizontal: isLargeScreen ? 6 : 0 }]}>
         <View style={styles.centerContent}><Text style={styles.metricNumber}>92%</Text><Text style={styles.cardLabelSmall}>Average Response Rate</Text></View>
       </NeumorphicView>
       <NeumorphicView style={[styles.smallCard, styles.flex1, { marginHorizontal: isLargeScreen ? 6 : 0 }]}>
         <View style={styles.centerContent}><Text style={styles.metricNumber}>12</Text><Text style={styles.cardLabelSmall}>Questions Asked</Text></View>
       </NeumorphicView>
    </View>
  );

  // SECTION 6 — PARTICIPATION TREND
  const renderParticipation = () => {
    const trendData = [ { label: 'P1', val: 95 }, { label: 'P2', val: 90 }, { label: 'P3', val: 82 }, { label: 'P4', val: 88 }, { label: 'P5', val: 92 } ];

    return (
      <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
        <Text style={styles.cardTitle}>Student Participation Over Time</Text>
        <Text style={[styles.secondaryText, { marginBottom: 8 }]}>Percentage of connected students responding to pulses.</Text>
        
        <View style={styles.barChartContainer}>
           {trendData.map((item, idx) => (
             <View key={idx} style={styles.barColumn}>
               <Text style={styles.barValueText}>{item.val}%</Text>
               <NeumorphicView inset={true} style={styles.barTrack}>
                 <View style={[styles.barFill, { height: `${item.val}%` }]} />
               </NeumorphicView>
               <Text style={styles.barLabel}>{item.label}</Text>
             </View>
           ))}
        </View>
      </NeumorphicView>
    );
  };

  // SECTION 7 — ANONYMOUS QUESTIONS SUMMARY
  const renderQuestions = () => {
    const questions = [
      { id: 1, text: "I didn't understand step 2 of the formula." },
      { id: 2, text: "Can you explain covariance again?" },
      { id: 3, text: "Why does the equation change in the second example?" },
    ];
    
    return (
      <NeumorphicView style={[styles.card, { padding: cardPadding }]}>
        <Text style={styles.cardTitle}>Anonymous Questions</Text>
        <View style={styles.questionsContainer}>
          {questions.map((q) => (
              <NeumorphicView key={q.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4f8cff" style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={styles.questionText}>"{q.text}"</Text>
              </View>
              <View style={styles.questionActions}>
                <TouchableOpacity>
                  <NeumorphicView style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Mark Answered</Text>
                  </NeumorphicView>
                </TouchableOpacity>
                <TouchableOpacity>
                  <NeumorphicView style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonTextSecondary}>Save for Next Class</Text>
                  </NeumorphicView>
                </TouchableOpacity>
              </View>
            </NeumorphicView>
          ))}
        </View>
      </NeumorphicView>
    );
  };

  // SECTION 8 — KEY INSIGHTS PANEL
  const renderInsights = () => (
    <NeumorphicView style={[styles.card, { padding: cardPadding }]} isGlow={true} glowColor="#4f8cff">
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Ionicons name="sparkles" size={24} color="#4f8cff" style={{ marginRight: 10 }} />
        <Text style={styles.cardTitle}>Key Insights</Text>
      </View>
      
      <View style={styles.insightBullet}><Ionicons name="ellipse" size={8} color="#4f8cff" style={styles.bulletIcon}/><Text style={styles.insightText}>Most confusion occurred during Pulse 3.</Text></View>
      <View style={styles.insightBullet}><Ionicons name="ellipse" size={8} color="#FF5C5C" style={styles.bulletIcon}/><Text style={styles.insightText}>25% of students were completely lost during Example Problems.</Text></View>
      <View style={styles.insightBullet}><Ionicons name="ellipse" size={8} color="#4CAF50" style={styles.bulletIcon}/><Text style={styles.insightText}>Engagement stayed enthusiastically above 85% for most of the lecture.</Text></View>
      <View style={styles.insightBullet}><Ionicons name="ellipse" size={8} color="#4f8cff" style={styles.bulletIcon}/><Text style={styles.insightText}>Students asked the most questions during the Core Concept explanation.</Text></View>
    </NeumorphicView>
  );

  // SECTION 9 — EXPORT AND ACTION BUTTONS
  const renderActions = () => (
    <View style={[isLargeScreen ? styles.rowWrap : styles.column, { gap: 12 }]}>
       <TouchableOpacity style={isLargeScreen ? { flex: 1} : {width: '100%'}}>
         <NeumorphicView style={styles.actionMainButton}>
            <Ionicons name="download-outline" size={20} color="#4f8cff" style={{ marginRight: 8 }}/>
            <Text style={styles.actionMainText}>Download PDF</Text>
         </NeumorphicView>
       </TouchableOpacity>
       <TouchableOpacity style={isLargeScreen ? { flex: 1} : {width: '100%'}}>
         <NeumorphicView style={styles.actionMainButton}>
            <Ionicons name="share-outline" size={20} color="#2f3542" style={{ marginRight: 8 }}/>
            <Text style={styles.actionMainTextDark}>Share Summary</Text>
         </NeumorphicView>
       </TouchableOpacity>
       <TouchableOpacity style={isLargeScreen ? { flex: 1} : {width: '100%'}} onPress={onRestart}>
         <NeumorphicView style={[styles.actionMainButton, { backgroundColor: '#4f8cff' }]} isGlow={true} glowColor="#4f8cff">
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }}/>
            <Text style={[styles.actionMainText, { color: '#ffffff' }]}>New Session</Text>
         </NeumorphicView>
       </TouchableOpacity>
    </View>
  );

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

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.maxWidthContainer}>
         

          <View style={styles.spacingMedium} />
          {renderHeader()}
          
          {/* Section Row 2 */}
          <View style={[isLargeScreen ? styles.row : styles.column, styles.spacingTop]}>
            <View style={[isLargeScreen ? { flex: 1, marginRight: cardMargin } : { width: '100%' }]}>{renderDonut()}</View>
            <View style={[isLargeScreen ? { flex: 1.5 } : { width: '100%' }]}>{renderTimeline()}</View>
          </View>

          {/* Spacer Section */}
          <View style={styles.spacingTop}>{renderHeatmap()}</View>
          <View style={styles.spacingTop}>{renderStats()}</View>
          
          <View style={[isLargeScreen ? styles.row : styles.column, styles.spacingTop]}>
             <View style={[isLargeScreen ? { flex: 1, marginRight: cardMargin } : { width: '100%' }]}>{renderParticipation()}</View>
             <View style={[isLargeScreen ? { flex: 1.5 } : { width: '100%' }]}>{renderInsights()}</View>
          </View>

          <View style={styles.spacingTop}>{renderQuestions()}</View>
          <View style={styles.spacingTop}>{renderActions()}</View>

          <View style={{ height: 80 }} />
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
  headerPageTitle: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  backPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  backPillText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },

  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },
  scrollContainer: { padding: Platform.OS === 'web' ? 40 : 16, alignItems: 'center', backgroundColor: '#e0e5ec', minHeight: '100%' },
  maxWidthContainer: { width: '100%', maxWidth: 1200 },
  card: { borderRadius: 24, marginBottom: isLargeScreen ? 24 : 16 },
  smallCard: { borderRadius: 20, padding: 16, marginBottom: isLargeScreen ? 24 : 16 },
  cardTitle: { fontSize: isLargeScreen ? 20 : 18, fontWeight: 'bold', color: '#2f3542', marginBottom: 16, textAlign: isLargeScreen ? 'left' : 'center' },
  secondaryText: { fontSize: 14, color: '#6b7280' },
  row: { flexDirection: 'row' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  column: { flexDirection: 'column' },
  flex1: { flex: 1 },
  spacingTop: { marginTop: 0 },
  spacingMedium: { height: 16 },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  metricNumber: { fontSize: 36, fontWeight: 'bold', color: '#2f3542', marginVertical: 4, textAlign: 'center' },
  metricNumberSmall: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  cardLabelSmall: { fontSize: 14, fontWeight: '600', color: '#2f3542', textAlign: 'center' },

  // Metadata Header Section 1
  metadataItem: { flexDirection: isLargeScreen ? 'column' : 'row', justifyContent: isLargeScreen ? 'flex-start' : 'space-between', flex: 1, marginVertical: 4 },
  metadataValue: { fontSize: 16, fontWeight: 'bold', color: '#2f3542', marginTop: isLargeScreen ? 2 : 0 },

  // Donut Section 2
  chartContainer: { alignItems: 'center', marginVertical: 8 },
  donutOuter: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  donutInner: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e0e5ec', zIndex: 10, alignItems: 'center', justifyContent: 'center' },
  donutCenterMetric: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50' },
  donutCenterLabel: { fontSize: 12, color: '#6b7280', fontWeight: 'bold' },
  donutMaskGreen: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 30, borderColor: '#4CAF50', borderBottomColor: 'transparent', borderRightColor: 'transparent' },
  donutMaskYellow: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 30, borderColor: '#FFC107', borderBottomColor: 'transparent', borderRightColor: 'transparent' },
  donutMaskRed: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 30, borderColor: '#FF5C5C', borderTopColor: 'transparent', borderRightColor: 'transparent' },
  legendContainer: { flexDirection: 'row', marginTop: 16, justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },

  // Timeline Section 3
  timelineContainer: { marginTop: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineNode: { width: 24, alignItems: 'center' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4f8cff', marginTop: 14 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#d1d9e6', marginVertical: 4 },
  timelineCard: { flex: 1, marginLeft: 12, marginBottom: 12 },
  timelineTitle: { fontSize: 16, fontWeight: 'bold', color: '#2f3542', marginBottom: 16 },
  timelineMetrics: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineMetricBox: { alignItems: 'center' },
  metricNumberTimeline: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  timelineSecondaryText: { fontSize: 12, color: '#6b7280' },

  // Heatmap Section 4
  heatmapRow: { flexDirection: isLargeScreen ? 'row' : 'column', alignItems: isLargeScreen ? 'center' : 'flex-start', marginBottom: 16 },
  heatmapLabel: { width: isLargeScreen ? 160 : '100%', fontSize: 14, fontWeight: '600', color: '#2f3542', marginBottom: isLargeScreen ? 0 : 8 },
  heatmapTrackContainer: { flex: 1, width: '100%', height: 24 },
  heatmapTrack: { flex: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', backgroundColor: '#e0e5ec' },
  heatmapFill: { height: 24, borderRadius: 12, backgroundColor: '#FF5C5C' },

  // Bar Chart Section 6
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, marginTop: 8, paddingBottom: 8 },
  barColumn: { alignItems: 'center', flex: 1 },
  barTrack: { width: 24, height: 100, borderRadius: 12, justifyContent: 'flex-end', marginVertical: 6, padding: 4 },
  barFill: { width: 16, borderRadius: 8, backgroundColor: '#4f8cff' },
  barValueText: { fontSize: 11, fontWeight: 'bold', color: '#4f8cff' },
  barLabel: { fontSize: 12, fontWeight: '600', color: '#2f3542' },

  // Questions Section 7
  questionsContainer: { marginTop: 8 },
  questionCard: { padding: 16, borderRadius: 16, marginBottom: 12, flexDirection: 'column' },
  questionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingRight: 8 },
  questionText: { fontSize: 14, color: '#2f3542', fontStyle: 'italic', flex: 1, lineHeight: 20 },
  questionActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', paddingLeft: 28 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  actionButtonText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 12 },
  actionButtonSecondary: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  actionButtonTextSecondary: { color: '#6b7280', fontWeight: 'bold', fontSize: 12 },

  // Insights Section 8
  insightBullet: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  bulletIcon: { marginTop: 6, marginRight: 12 },
  insightText: { fontSize: 16, color: '#2f3542', flex: 1, lineHeight: 24 },

  // Actions Section 9
  actionMainButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  actionMainText: { fontSize: 14, fontWeight: 'bold', color: '#4f8cff' },
  actionMainTextDark: { fontSize: 14, fontWeight: 'bold', color: '#2f3542' },
});
