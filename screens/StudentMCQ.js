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

export default function StudentMCQ({ sessionCode, onLeave, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- NEW: FETCH FROM SUPABASE ---
  useEffect(() => {
    fetchActiveQuiz();
  }, [sessionCode]);

  const fetchActiveQuiz = async () => {
    setIsLoading(true);
    // 1. Get Session ID
    const { data: sessionData } = await supabase.from('sessions').select('id').eq('code', sessionCode).single();
    
    if (sessionData) {
      // 2. Get Active Quizzes for this session
      const { data: quizData } = await supabase.from('quizzes').select('*').eq('session_id', sessionData.id).eq('is_active', true);
      if (quizData) {
        setQuestions(quizData);
      }
    }
    setIsLoading(false);
  };

  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isComplete = Object.keys(selectedAnswers).length === totalQuestions;

  const handleSelect = (qId, optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const handleNext = () => { if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex(prev => prev + 1); };
  const handlePrev = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); };

  // --- NEW: SUBMIT TO SUPABASE ---
  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    // Create an array of responses to insert
    const responses = Object.keys(selectedAnswers).map(quizId => ({
      quiz_id: quizId,
      student_id: 'anonymous-student', // Since there's no auth, we just track the submission
      selected_option: selectedAnswers[quizId]
    }));

    await supabase.from('quiz_responses').insert(responses);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_option) {
        score += 1;
      }
    });
    return score;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f8cff" />
        <Text style={{ marginTop: 20 }}>Loading Live Quiz...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#2f3542' }}>No active quiz found.</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 20 }}><Text style={{ color: '#4f8cff', fontWeight: 'bold' }}>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/logo.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
          <Text style={styles.headerAppName}>FearGo</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.8}>
            <View style={styles.backPill}>
              <Ionicons name="arrow-back" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.backPillText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isSubmitted ? (
          <NeumorphicView style={styles.resultCard}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={{ marginBottom: 20 }} />
            <Text style={styles.resultTitle}>Quiz Submitted Successfully!</Text>
            <Text style={styles.resultSubtitle}>You have completed this assessment.</Text>
            
            <NeumorphicView inset style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.scoreValue}>{calculateScore()} / {totalQuestions}</Text>
            </NeumorphicView>

            <TouchableOpacity style={{ marginTop: 40 }} onPress={onBack} activeOpacity={0.8}>
                <View style={styles.submitButton}>
                  <Ionicons name="arrow-back" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Return to Ask Doubts</Text>
                </View>
            </TouchableOpacity>
          </NeumorphicView>
        ) : (
          <>
            <NeumorphicView style={styles.card}>
              <Text style={styles.questionIndex}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
              <Text style={styles.questionText}>{currentQ.text}</Text>

              <View style={styles.optionsContainer}>
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === oIdx;
                  return (
                    <TouchableOpacity key={oIdx} onPress={() => handleSelect(currentQ.id, oIdx)} activeOpacity={0.8} style={{ marginBottom: 16 }}>
                      <NeumorphicView inset={isSelected} style={[styles.optionCard, isSelected && styles.optionCardSelected]}>
                        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                      </NeumorphicView>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.navigationRow}>
                <TouchableOpacity onPress={handlePrev} disabled={currentQuestionIndex === 0} activeOpacity={0.7} style={styles.navTouchWrapper}>
                  <NeumorphicView style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}>
                    <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? '#a0aab5' : '#4f8cff'} />
                    <Text style={[styles.navButtonText, currentQuestionIndex === 0 && { color: '#a0aab5' }]} numberOfLines={1} adjustsFontSizeToFit>Previous</Text>
                  </NeumorphicView>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext} disabled={currentQuestionIndex === totalQuestions - 1} activeOpacity={0.7} style={styles.navTouchWrapper}>
                  <NeumorphicView style={[styles.navButton, currentQuestionIndex === totalQuestions - 1 && styles.navButtonDisabled]}>
                    <Text style={[styles.navButtonText, currentQuestionIndex === totalQuestions - 1 && { color: '#a0aab5' }]} numberOfLines={1} adjustsFontSizeToFit>Next</Text>
                    <Ionicons name="chevron-forward" size={20} color={currentQuestionIndex === totalQuestions - 1 ? '#a0aab5' : '#4f8cff'} />
                  </NeumorphicView>
                </TouchableOpacity>
              </View>
            </NeumorphicView>

            <TouchableOpacity style={{ marginTop: 10, marginBottom: 40 }} disabled={!isComplete} activeOpacity={0.8} onPress={handleSubmit}>
              <View style={[styles.submitButton, { opacity: isComplete ? 1 : 0.45 }]}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.submitButtonText}>Submit Quiz</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e0e5ec' },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 12, paddingBottom: 14, backgroundColor: '#0ea5e9', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10, },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerAppName: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 8, letterSpacing: 0.5 },
  headerRight: { flex: 1, alignItems: 'flex-end' },
  backPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  backPillText: { fontSize: 13, fontWeight: 'bold', color: '#fff' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, width: '100%', maxWidth: 700, alignSelf: 'center', },
  pageTitleSection: { alignItems: 'center', marginBottom: 30 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#2f3542', marginBottom: 8 },
  pageSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', paddingHorizontal: 20 },
  card: { borderRadius: 20, padding: 16, marginBottom: 16 },
  questionIndex: { fontSize: 12, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  questionText: { fontSize: 16, fontWeight: '600', color: '#2f3542', marginBottom: 16, lineHeight: 22 },
  optionsContainer: { marginTop: 4 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#e0e5ec', },
  optionCardSelected: { backgroundColor: 'rgba(79, 140, 255, 0.08)', borderColor: '#4f8cff', borderWidth: 1, },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#a0aab5', alignItems: 'center', justifyContent: 'center', marginRight: 12, },
  radioCircleSelected: { borderColor: '#4f8cff', },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4f8cff', },
  optionText: { fontSize: 13, color: '#4b5563', flex: 1, fontWeight: '500' },
  optionTextSelected: { color: '#4f8cff', fontWeight: 'bold' },
  navigationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', gap: 12, },
  navTouchWrapper: { flex: 1, },
  navButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 10, borderRadius: 16, },
  navButtonDisabled: { opacity: 0.6, },
  navButtonText: { fontSize: 13, fontWeight: '700', color: '#4f8cff', marginHorizontal: 4, },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 28, backgroundColor: '#4f8cff', shadowColor: '#4f8cff', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8, },
  submitButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  resultCard: { borderRadius: 24, padding: 32, alignItems: 'center', marginTop: 20 },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: '#2f3542', marginBottom: 8, textAlign: 'center' },
  resultSubtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
  scoreBox: { padding: 24, borderRadius: 20, alignItems: 'center', width: '100%', maxWidth: 300, },
  scoreLabel: { fontSize: 14, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  scoreValue: { fontSize: 42, fontWeight: 'bold', color: '#0ea5e9' },
});