import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
  ScrollView, Dimensions, Platform, StatusBar, Image, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NeumorphicView from '../components/NeumorphicView';
import { supabase } from '../utils/supabase';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function TeacherQuizResults({ session, onBack }) {
  const [results, setResults] = useState([]);
  const [totalStudentsAttempted, setTotalStudentsAttempted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.id) return;
    fetchResults();

    // REAL-TIME: Listen for new student submissions
    const responseSub = supabase.channel('public:quiz_responses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quiz_responses' }, 
        () => {
          // Re-fetch to recalculate the charts when a new answer drops
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(responseSub);
    };
  }, [session]);

  const fetchResults = async () => {
    // 1. Fetch the active quizzes for this session
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('*')
      .eq('session_id', session.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (!quizzes || quizzes.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // 2. Fetch all responses for these quizzes
    const quizIds = quizzes.map(q => q.id);
    const { data: responses } = await supabase
      .from('quiz_responses')
      .select('*')
      .in('quiz_id', quizIds);

    // Calculate unique students who attempted
    const uniqueStudents = new Set(responses?.map(r => r.student_id) || []).size;
    setTotalStudentsAttempted(uniqueStudents);

    // 3. Map the data to match your friend's UI structure
    const mappedResults = quizzes.map((q) => {
      const qResponses = responses?.filter(r => r.quiz_id === q.id) || [];
      const totalAnswers = qResponses.length;

      const optionsData = q.options.map((optLabel, index) => {
        const count = qResponses.filter(r => r.selected_option === index).length;
        return {
          label: optLabel,
          count: count,
          isCorrect: q.correct_option === index
        };
      });

      return {
        id: q.id,
        text: q.text,
        totalAnswers: totalAnswers,
        options: optionsData
      };
    });

    setResults(mappedResults);
    setIsLoading(false);
  };

  const getPercentage = (count, total) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f8cff" />
        <Text style={{ marginTop: 20 }}>Loading Live Results...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/logo.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
          <View style={{ marginLeft: 6 }}>
            <Text style={[styles.headerAppName, { marginLeft: 0 }]}>FearGo</Text>
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Ask Without Fear.Learn Without Doubt</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
          <View style={styles.backPill}>
            <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.backPillText}>Back</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* ── PAGE TITLE ── */}
        <View style={styles.pageTitleSection}>
          <Text style={styles.pageTitle}>Live Quiz Results</Text>
          <Text style={styles.pageSubtitle}>Monitor student responses in real time</Text>
        </View>

        {/* ── STATS CARD ── */}
        <NeumorphicView style={styles.statsCard}>
          <Ionicons name="people" size={32} color="#4f8cff" />
          <Text style={styles.statsTitle}>Students Participated</Text>
          <Text style={styles.statsNumber}>{totalStudentsAttempted}</Text>
          <Text style={styles.statsSubtitle}>Responses logged</Text>
        </NeumorphicView>

        {/* ── RESULTS LIST ── */}
        {results.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 20 }}>No active quiz data to display.</Text>
        ) : (
          results.map((q, qIndex) => (
            <NeumorphicView key={q.id} style={styles.resultCard}>
              <Text style={styles.questionIndex}>Question {qIndex + 1}</Text>
              <Text style={styles.questionText}>{q.text}</Text>

              <View style={styles.optionsContainer}>
                {q.options.map((opt, oIndex) => {
                  const percentage = getPercentage(opt.count, q.totalAnswers);
                  return (
                    <View key={oIndex} style={styles.optionRow}>
                      <View style={styles.optionHeader}>
                        <Text style={[styles.optionLabel, opt.isCorrect && styles.correctText]}>
                          {String.fromCharCode(65 + oIndex)}. {opt.label} {opt.isCorrect && '✓'}
                        </Text>
                        <Text style={styles.optionCount}>{opt.count} students ({percentage}%)</Text>
                      </View>

                      <NeumorphicView inset style={styles.progressBarContainer}>
                        <View style={[
                          styles.progressBarFill, 
                          { width: `${percentage}%` },
                          opt.isCorrect && { backgroundColor: '#4CAF50' }
                        ]} />
                      </NeumorphicView>
                    </View>
                  );
                })}
              </View>
            </NeumorphicView>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 12, paddingBottom: 14, backgroundColor: '#0ea5e9', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10, },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAppName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 8, letterSpacing: 0.5 },
  backPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  backPillText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, width: '100%', maxWidth: 700, alignSelf: 'center', },
  pageTitleSection: { alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#2f3542', marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center' },
  statsCard: { borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 24 },
  statsTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginTop: 12, marginBottom: 4 },
  statsNumber: { fontSize: 28, fontWeight: 'bold', color: '#4f8cff' },
  statsSubtitle: { fontSize: 12, color: '#2f3542', marginTop: 4 },
  resultCard: { borderRadius: 20, padding: 20, marginBottom: 20 },
  questionIndex: { fontSize: 12, fontWeight: 'bold', color: '#4f8cff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  questionText: { fontSize: 16, fontWeight: '600', color: '#2f3542', marginBottom: 20, lineHeight: 22 },
  optionsContainer: { gap: 16 },
  optionRow: { width: '100%' },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  optionLabel: { fontSize: 14, fontWeight: '600', color: '#4b5563', flex: 1 },
  correctText: { color: '#4CAF50', fontWeight: 'bold' },
  optionCount: { fontSize: 13, color: '#6b7280', fontWeight: 'bold' },
  progressBarContainer: { height: 14, borderRadius: 7, justifyContent: 'center', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4f8cff', borderRadius: 7 }
});