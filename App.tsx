import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MainTab, Category, Topic, QuestionAnswer, ProgrammingQuestion, UserProfile } from './src/types';
import { MobileHeader } from './src/components/MobileHeader';
import { MobileBottomNav } from './src/components/MobileBottomNav';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { InterviewQAScreen } from './src/components/screens/InterviewQAScreen';
import { TopicsScreen } from './src/components/screens/TopicsScreen';
import { TopicDetailScreen } from './src/components/screens/TopicDetailScreen';
import { ConceptDetailScreen } from './src/components/screens/ConceptDetailScreen';
import { ProgrammingQAScreen } from './src/components/screens/ProgrammingQAScreen';
import { BookmarksScreen } from './src/components/screens/BookmarksScreen';
import { ReactNativeExportScreen } from './src/components/screens/ReactNativeExportScreen';
import { AuthModal } from './src/components/modals/AuthModal';
import { AICoachModal } from './src/components/modals/AICoachModal';
import {
  loadStoredUserData, getStoredUserData, saveStoredUserData, syncBookmarkToFirestore, auth,
} from './src/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CATEGORIES as DEFAULT_CATEGORIES, QUESTIONS_ANSWERS as DEFAULT_QA, PROGRAMMING_QUESTIONS as DEFAULT_PQA } from './src/data/prepData';
import { fetchFavoriteTopicsFromBackend, syncAllDataFromBackend, subscribeToApiStatus, BackendApiStatus } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isTopicsView, setIsTopicsView] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionAnswer | null>(null);

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [questions, setQuestions] = useState<QuestionAnswer[]>(DEFAULT_QA);
  const [programmingQuestions, setProgrammingQuestions] = useState<ProgrammingQuestion[]>(DEFAULT_PQA);
  const [favoriteTopics, setFavoriteTopics] = useState<Topic[]>([]);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const [user, setUser] = useState<UserProfile>(getStoredUserData());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [aiCoachPrompt, setAiCoachPrompt] = useState<string | undefined>(undefined);

  // Load persisted user data on mount
  useEffect(() => {
    loadStoredUserData().then((data) => setUser(data));
  }, []);

  // Backend sync
  useEffect(() => {
    const unsubStatus = subscribeToApiStatus((status) => setIsLiveApi(status.isConnected));

    async function init() {
      setIsSyncingApi(true);
      try {
        const data = await syncAllDataFromBackend();
        if (data.categories.length > 0) setCategories(data.categories);
        if (data.questions.length > 0) setQuestions(data.questions);
        if (data.programming.length > 0) setProgrammingQuestions(data.programming);
        setFavoriteTopics(await fetchFavoriteTopicsFromBackend());
        setIsLiveApi(data.isLive);
      } catch (e) {
        console.warn('Backend sync error:', e);
      } finally {
        setIsSyncingApi(false);
      }
    }

    init();
    return () => unsubStatus();
  }, []);

  const handleRefreshApiData = async () => {
    setIsSyncingApi(true);
    try {
      const data = await syncAllDataFromBackend();
      if (data.categories.length > 0) setCategories(data.categories);
      if (data.questions.length > 0) setQuestions(data.questions);
      if (data.programming.length > 0) setProgrammingQuestions(data.programming);
      setFavoriteTopics(await fetchFavoriteTopicsFromBackend());
      setIsLiveApi(data.isLive);
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setIsSyncingApi(false);
    }
  };

  // Firebase Auth listener
  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser((prev) => {
            const updated: UserProfile = {
              ...prev,
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              isGuest: false,
            };
            saveStoredUserData(updated);
            return updated;
          });
          fetchFavoriteTopicsFromBackend()
            .then(setFavoriteTopics)
            .catch((error) => console.warn('Favorite topics refresh error:', error));
        } else {
          setFavoriteTopics([]);
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firebase Auth listener fallback:', e);
    }
  }, []);

  const handleToggleBookmark = (id: string, type: 'qa' | 'pqa') => {
    setUser((prev) => {
      let updatedQA = [...prev.bookmarkedQAIds];
      let updatedPQA = [...prev.bookmarkedPQAIds];
      let isAdding = false;

      if (type === 'qa') {
        if (updatedQA.includes(id)) updatedQA = updatedQA.filter((i) => i !== id);
        else { updatedQA.push(id); isAdding = true; }
      } else {
        if (updatedPQA.includes(id)) updatedPQA = updatedPQA.filter((i) => i !== id);
        else { updatedPQA.push(id); isAdding = true; }
      }

      const updated: UserProfile = { ...prev, bookmarkedQAIds: updatedQA, bookmarkedPQAIds: updatedPQA };
      saveStoredUserData(updated);
      syncBookmarkToFirestore(prev.uid, id, type, isAdding);
      return updated;
    });
  };

  const getHeaderTitle = () => {
    if (selectedConcept) return selectedConcept.name || selectedConcept.title || 'Concept';
    if (selectedTopic) return selectedTopic.title;
    if (selectedCategory) return selectedCategory.title;
    switch (activeTab) {
      case 'home': return 'JsPrep Mobile';
      case 'qa': return 'Interview Q&A';
      case 'programming': return 'Coding Challenges';
      case 'bookmarks': return 'Saved Items';
      case 'export': return 'React Native Code';
      default: return 'JsPrep Mobile';
    }
  };

  const getHeaderSubtitle = () => {
    if (selectedTopic) return `${selectedCategory?.title} • ${selectedTopic.level}`;
    if (selectedCategory) return 'Track Curriculum';
    switch (activeTab) {
      case 'home': return 'Tech Interview Prep';
      case 'qa': return 'Senior & Mid level';
      case 'programming': return 'Algorithms & Polyfills';
      case 'bookmarks': return `${user.bookmarkedQAIds.length + user.bookmarkedPQAIds.length} Saved`;
      case 'export': return 'iOS & Android Project';
      default: return undefined;
    }
  };

  const navigateTab = (tab: MainTab) => {
    setSelectedCategory(null);
    setSelectedTopic(null);
    setSelectedConcept(null);
    setIsTopicsView(false);
    setActiveTab(tab);
  };

  const handleBack = () => {
    if (selectedConcept) {
      setSelectedConcept(null);
      return;
    }
    if (selectedTopic) {
      setSelectedTopic(null);
      return;
    }

    if (activeTab === 'qa' && selectedCategory && !isTopicsView) {
      setIsTopicsView(true);
      setSelectedQuestion(null);
      return;
    }

    setSelectedCategory(null);
    setSelectedQuestion(null);
    setIsTopicsView(false);
    setActiveTab('home');
  };

  const renderScreen = () => {
    if (activeTab === 'home') {
      return (
        <HomeScreen
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedTopic(null);
            setSelectedConcept(null);
            setSelectedQuestion(null);
            setIsTopicsView(true);
            setActiveTab('qa');
          }}
          onSelectTopic={(topic) => {
            const normalize = (value?: string) => value?.split('/').filter(Boolean).pop()?.toLowerCase();
            const topicId = normalize(topic.backendTopicId || topic.id);
            const categoryId = normalize(topic.categoryId);
            const category = categories.find((cat) => {
              const matchesCategory = !categoryId || normalize(cat.id) === categoryId;
              const matchesTopic = cat.topics.some((item) =>
                normalize(item.backendTopicId || item.id) === topicId || item.title.toLowerCase() === topic.title.toLowerCase()
              );
              return matchesCategory && matchesTopic;
            }) || categories.find((cat) => normalize(cat.id) === categoryId) || categories.find((cat) =>
              cat.topics.some((item) => normalize(item.backendTopicId || item.id) === topicId || item.title.toLowerCase() === topic.title.toLowerCase())
            );
            if (category) {
              setSelectedCategory(category);
              setSelectedTopic(topic);
              setSelectedConcept(null);
              setSelectedQuestion(null);
              setIsTopicsView(true);
              setActiveTab('qa');
            }
          }}
          onNavigateTab={navigateTab}
          onSelectQuestion={(q) => { setSelectedQuestion(q); setActiveTab('qa'); }}
          user={user}
          onOpenAICoach={() => { setAiCoachPrompt(undefined); setIsAICoachOpen(true); }}
          categories={categories}
          favoriteTopics={favoriteTopics}
          questions={questions}
          isLiveApi={isLiveApi}
          onRefreshApi={handleRefreshApiData}
          isSyncing={isSyncingApi}
        />
      );
    }
    if (activeTab === 'qa') {
      if (isTopicsView && selectedCategory) {
        if (selectedTopic) {
          if (selectedConcept) {
            return <ConceptDetailScreen category={selectedCategory} topic={selectedTopic} concept={selectedConcept} />;
          }
          return <TopicDetailScreen category={selectedCategory} topic={selectedTopic} onSelectConcept={setSelectedConcept} />;
        }
        return (
          <TopicsScreen
            category={selectedCategory}
            onOpenQuestions={() => setIsTopicsView(false)}
            onSelectTopic={(topic) => setSelectedTopic(topic)}
          />
        );
      }
      return (
        <InterviewQAScreen
          initialCategoryId={selectedCategory?.id || selectedQuestion?.categoryId}
          bookmarkedIds={user.bookmarkedQAIds}
          onToggleBookmark={handleToggleBookmark}
          selectedQuestion={selectedQuestion}
          categories={categories}
          questions={questions}
          onRefresh={handleRefreshApiData}
        />
      );
    }
    if (activeTab === 'programming') {
      return (
        <ProgrammingQAScreen
          bookmarkedIds={user.bookmarkedPQAIds}
          onToggleBookmark={handleToggleBookmark}
          problems={programmingQuestions}
        />
      );
    }
    if (activeTab === 'bookmarks') {
      return (
        <BookmarksScreen
          bookmarkedQAIds={user.bookmarkedQAIds}
          bookmarkedPQAIds={user.bookmarkedPQAIds}
          onToggleBookmark={handleToggleBookmark}
          onSelectQuestion={(q) => { setSelectedQuestion(q); setActiveTab('qa'); }}
          onNavigateTab={navigateTab}
          isFirebaseConnected={true}
        />
      );
    }
    if (activeTab === 'export') return <ReactNativeExportScreen />;
    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <View style={styles.container}>
        <MobileHeader
          title={getHeaderTitle()}
          subtitle={getHeaderSubtitle()}
          showBack={selectedConcept !== null || selectedTopic !== null || selectedCategory !== null || selectedQuestion !== null}
          onBack={handleBack}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onAIClick={() => { setAiCoachPrompt(undefined); setIsAICoachOpen(true); }}
          user={user}
        />

        <View style={styles.body}>{renderScreen()}</View>

        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={navigateTab}
          bookmarkCount={user.bookmarkedQAIds.length + user.bookmarkedPQAIds.length}
        />
      </View>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUserUpdated={setUser}
      />
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => { setIsAICoachOpen(false); setAiCoachPrompt(undefined); }}
        initialPrompt={aiCoachPrompt}
      />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  container: { flex: 1, backgroundColor: '#020617' },
  body: { flex: 1 },
});
