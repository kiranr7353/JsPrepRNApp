/**
 * JsPrepBackend API Integration Service
 * Base URL: https://jsprepbackend.onrender.com/api/v1
 * Project: jsprep-ed0c8 (Firebase Auth & Storage)
 */

import { auth, fetchFirestoreInterviewQA, fetchFirestoreProgrammingQA, fetchFirestoreCategories } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Category, Topic, QuestionAnswer, ProgrammingQuestion } from '../types';
import { CATEGORIES as FALLBACK_CATEGORIES, QUESTIONS_ANSWERS as FALLBACK_QA, PROGRAMMING_QUESTIONS as FALLBACK_PQA } from '../data/prepData';

export const API_BASE_URL = 'https://jsprepbackend.onrender.com/api/v1';

// Default candidate credentials for accessing the backend when not logged in with personal account
const DEFAULT_CANDIDATE_EMAIL = 'testcandidate9129@jsprep.dev';
const DEFAULT_CANDIDATE_PASS = 'TestCandidate@123!';

// In-memory token cache
let cachedToken: string | null = null;
let cachedTokenExpiry: number = 0;
let cachedUid: string | null = null;
let cachedEmail: string | null = null;

// Track API status for UI diagnostics
export interface BackendApiStatus {
  isConnected: boolean;
  isConnecting: boolean;
  lastSyncTime: string | null;
  categoriesCount: number;
  questionsCount: number;
  error: string | null;
}

let apiStatus: BackendApiStatus = {
  isConnected: false,
  isConnecting: false,
  lastSyncTime: null,
  categoriesCount: 0,
  questionsCount: 0,
  error: null,
};

const statusListeners: Array<(status: BackendApiStatus) => void> = [];

export function subscribeToApiStatus(listener: (status: BackendApiStatus) => void) {
  statusListeners.push(listener);
  listener({ ...apiStatus });
  return () => {
    const idx = statusListeners.indexOf(listener);
    if (idx !== -1) statusListeners.splice(idx, 1);
  };
}

function updateApiStatus(updates: Partial<BackendApiStatus>) {
  apiStatus = { ...apiStatus, ...updates };
  statusListeners.forEach((fn) => fn({ ...apiStatus }));
}

/**
 * Get a valid Firebase ID token for authentication with JsPrepBackend
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const now = Date.now();

  // If we already have a user in Firebase Auth
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(false);
      cachedToken = token;
      cachedTokenExpiry = now + 50 * 60 * 1000;
      cachedUid = auth.currentUser.uid;
      cachedEmail = auth.currentUser.email || DEFAULT_CANDIDATE_EMAIL;

      return {
        'Authorization': `Bearer ${token}`,
        'email': cachedEmail,
        'Login-Fullname': cachedEmail,
        'localId': cachedUid,
        'Content-Type': 'application/json',
      };
    } catch (e) {
      console.warn('Failed to refresh currentUser token:', e);
    }
  }

  // Use cached token if valid
  if (cachedToken && cachedTokenExpiry > now && cachedUid && cachedEmail) {
    return {
      'Authorization': `Bearer ${cachedToken}`,
      'email': cachedEmail,
      'Login-Fullname': cachedEmail,
      'localId': cachedUid,
      'Content-Type': 'application/json',
    };
  }

  // Otherwise sign in with candidate credentials
  try {
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, DEFAULT_CANDIDATE_EMAIL, DEFAULT_CANDIDATE_PASS);
    } catch (signInErr: any) {
      // If user does not exist, create it
      if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
        cred = await createUserWithEmailAndPassword(auth, DEFAULT_CANDIDATE_EMAIL, DEFAULT_CANDIDATE_PASS);
      } else {
        throw signInErr;
      }
    }

    const token = await cred.user.getIdToken();
    cachedToken = token;
    cachedTokenExpiry = now + 50 * 60 * 1000;
    cachedUid = cred.user.uid;
    cachedEmail = cred.user.email || DEFAULT_CANDIDATE_EMAIL;

    return {
      'Authorization': `Bearer ${token}`,
      'email': cachedEmail,
      'Login-Fullname': cachedEmail,
      'localId': cachedUid,
      'Content-Type': 'application/json',
    };
  } catch (err: any) {
    console.warn('Auth token acquisition fallback:', err);
    return {
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Generic API request wrapper with timeout and error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(errorText);
      } catch {
        parsed = { message: errorText };
      }
      throw new Error(parsed.detail || parsed.message || `API error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// In-memory cache for API data to ensure super snappy mobile performance
const memoryCache = {
  categories: null as Category[] | null,
  topicsByCategoryId: {} as Record<string, Topic[]>,
  conceptsByTopic: {} as Record<string, any[]>,
  qaByTopic: {} as Record<string, QuestionAnswer[]>,
  allQA: [] as QuestionAnswer[],
  allPQA: [] as ProgrammingQuestion[],
};

// Map backend icon strings to Lucide icons
const CATEGORY_ICONS: Record<string, { icon: string; color: string; badge: string }> = {
  javascript: { icon: 'Code2', color: 'from-amber-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30', badge: 'Core JS' },
  react: { icon: 'Atom', color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30', badge: 'Frontend' },
  node: { icon: 'Server', color: 'from-emerald-500/20 to-green-600/20 text-emerald-400 border-emerald-500/30', badge: 'Backend' },
  html5: { icon: 'FileCode', color: 'from-orange-500/20 to-amber-600/20 text-orange-400 border-orange-500/30', badge: 'Web UI' },
  css3: { icon: 'Palette', color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border-blue-500/30', badge: 'Styling' },
  next: { icon: 'Layers', color: 'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30', badge: 'SSR / Full-Stack' },
  aws: { icon: 'Cloud', color: 'from-amber-600/20 to-orange-700/20 text-amber-300 border-amber-500/30', badge: 'Cloud' },
  docker: { icon: 'Box', color: 'from-sky-500/20 to-blue-700/20 text-sky-400 border-sky-500/30', badge: 'Containers' },
  kubernetes: { icon: 'Cpu', color: 'from-indigo-500/20 to-violet-700/20 text-indigo-300 border-indigo-500/30', badge: 'Orchestration' },
  jenkins: { icon: 'Workflow', color: 'from-red-500/20 to-rose-700/20 text-red-400 border-red-500/30', badge: 'CI / CD' },
  terraform: { icon: 'Layers', color: 'from-violet-500/20 to-purple-700/20 text-violet-300 border-violet-500/30', badge: 'IaC' },
  ansible: { icon: 'Terminal', color: 'from-rose-500/20 to-red-700/20 text-rose-300 border-rose-500/30', badge: 'Automation' },
  mongodb: { icon: 'Server', color: 'from-emerald-600/20 to-teal-700/20 text-emerald-400 border-emerald-500/30', badge: 'NoSQL' },
  mysql: { icon: 'Server', color: 'from-blue-600/20 to-cyan-700/20 text-cyan-400 border-cyan-500/30', badge: 'SQL' },
  graphql: { icon: 'Layers', color: 'from-pink-500/20 to-rose-600/20 text-pink-400 border-pink-500/30', badge: 'API' },
  express: { icon: 'Server', color: 'from-slate-500/20 to-slate-700/20 text-slate-300 border-slate-500/30', badge: 'REST' },
};

/**
 * Fetch all categories from backend API
 */
export async function fetchCategoriesFromBackend(type = 'all'): Promise<Category[]> {
  if (memoryCache.categories && memoryCache.categories.length > 0) {
    return memoryCache.categories;
  }

  updateApiStatus({ isConnecting: true });

  try {
    const res = await apiRequest<{ success: boolean; categories: any[] }>(
      `/categories/getCategoriesFromList/${type}`,
      'GET'
    );

    if (res && res.categories && res.categories.length > 0) {
      const categories: Category[] = res.categories.map((c) => {
        const catId = (c.categoryId || c.id || '').toLowerCase();
        const iconConfig = CATEGORY_ICONS[catId] || {
          icon: 'Code2',
          color: 'from-slate-700/30 to-slate-800/30 text-slate-300 border-slate-700/40',
          badge: 'General',
        };

        // Find fallback to keep initial topics if topics not fetched yet
        const fallback = FALLBACK_CATEGORIES.find((fc) => fc.id === catId);

        return {
          id: catId,
          title: c.categoryName || c.title || catId,
          description: c.description || fallback?.description || `Master technical interview topics for ${c.categoryName}.`,
          iconName: iconConfig.icon,
          badge: iconConfig.badge,
          color: iconConfig.color,
          totalQuestions: fallback?.totalQuestions || 25,
          totalSnippets: fallback?.totalSnippets || 10,
          topics: fallback?.topics || [],
        };
      });

      memoryCache.categories = categories;
      updateApiStatus({
        isConnected: true,
        isConnecting: false,
        lastSyncTime: new Date().toLocaleTimeString(),
        categoriesCount: categories.length,
        error: null,
      });

      return categories;
    }
  } catch (err: any) {
    console.warn('fetchCategoriesFromBackend error, falling back to local curriculum:', err.message);
    updateApiStatus({
      isConnected: false,
      isConnecting: false,
      error: `Backend: ${err.message}`,
    });
  }

  // Fallback to local curriculum if backend is unreachable
  return FALLBACK_CATEGORIES;
}

/**
 * Fetch topics for a specific category from backend API
 */
export async function fetchTopicsFromBackend(categoryId: string): Promise<Topic[]> {
  const normCatId = categoryId.toLowerCase();
  if (memoryCache.topicsByCategoryId[normCatId]) {
    return memoryCache.topicsByCategoryId[normCatId];
  }

  try {
    const res = await apiRequest<{ success: boolean; topics: any[] }>(
      `/categories/getTopics/${normCatId}`,
      'GET'
    );

    if (res && res.topics && Array.isArray(res.topics)) {
      const mappedTopics: Topic[] = res.topics.map((t: any, idx: number) => {
        const rawTopicId = t.topicId || t.topic_id || t.topicRef || t.id;
        const topicReference = typeof rawTopicId === 'string'
          ? rawTopicId
          : rawTopicId?.path || rawTopicId?.name || rawTopicId?.id;
        const backendTopicId = topicReference?.split('/').filter(Boolean).pop();
        let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
        const name = (t.topicName || '').toLowerCase();
        if (name.includes('fundamental') || name.includes('basic')) level = 'Beginner';
        else if (name.includes('advanced') || name.includes('scenario') || name.includes('tricky')) level = 'Advanced';

        return {
          id: t.id || t.slug || backendTopicId || `topic-${idx}`,
          backendTopicId,
          title: t.topicName || 'Topic',
          summary: t.description || 'Comprehensive study modules and interview QA from backend.',
          level,
          subtopics: [
            'Core Fundamentals',
            'Interview Questions',
            'Best Practices',
            'Production Architecture',
          ],
        };
      });

      memoryCache.topicsByCategoryId[normCatId] = mappedTopics;

      // Update category topics in cache
      if (memoryCache.categories) {
        const cat = memoryCache.categories.find((c) => c.id === normCatId);
        if (cat) {
          cat.topics = mappedTopics;
        }
      }

      return mappedTopics;
    }
  } catch (err: any) {
    console.warn(`fetchTopicsFromBackend for ${categoryId} error:`, err.message);
  }

  // Fallback
  const fallbackCat = FALLBACK_CATEGORIES.find((c) => c.id === normCatId);
  return fallbackCat ? fallbackCat.topics : [];
}

/**
 * Fetch concepts and detailed notes for a topic from backend
 */
export async function fetchConceptsFromBackend(topicId: string, categoryId: string): Promise<any[]> {
  const cacheKey = `${categoryId}-${topicId}`;
  if (memoryCache.conceptsByTopic[cacheKey]) {
    return memoryCache.conceptsByTopic[cacheKey];
  }

  try {
    const res = await apiRequest<{ success: boolean; concepts: any[] }>(
      `/concepts/getConcepts/${encodeURIComponent(topicId)}/${encodeURIComponent(categoryId)}`,
      'GET'
    );

    if (res && res.concepts && Array.isArray(res.concepts)) {
      memoryCache.conceptsByTopic[cacheKey] = res.concepts;
      return res.concepts;
    }
  } catch (err: any) {
    console.warn(`fetchConceptsFromBackend error for ${topicId}/${categoryId}:`, err.message);
  }

  return [];
}

/**
 * Fetch Interview QA from Firestore collection /interviewQ&A with backend API fallback
 */
export async function fetchInterviewQAFromBackend(
  categoryId: string,
  topicId?: string,
  pageSize = 100,
  pageNumber = 1
): Promise<QuestionAnswer[]> {
  const normCat = categoryId.toLowerCase();

  // 1. Check if we already have this category's questions in memoryCache
  if (memoryCache.allQA && memoryCache.allQA.length > 0) {
    const matches = memoryCache.allQA.filter(q => q.categoryId.toLowerCase() === normCat);
    if (matches.length > 0) {
      if (topicId) {
        const topicMatches = matches.filter(q => q.topicId?.toLowerCase() === topicId.toLowerCase());
        if (topicMatches.length > 0) return topicMatches;
      }
      return matches;
    }
  }

  // 2. Fetch directly from Firestore collection 'interviewQ&A' (contains all 1320 questions)
  try {
    const firestoreQuestions = await fetchFirestoreInterviewQA();
    if (firestoreQuestions && firestoreQuestions.length > 0) {
      // Update memory cache
      memoryCache.allQA = firestoreQuestions;
      const matches = firestoreQuestions.filter(q => q.categoryId.toLowerCase() === normCat);
      if (matches.length > 0) {
        if (topicId) {
          const topicMatches = matches.filter(q => q.topicId?.toLowerCase() === topicId.toLowerCase());
          if (topicMatches.length > 0) return topicMatches;
        }
        return matches;
      }
    }
  } catch (e) {
    console.warn('Direct Firestore fetch attempt notice:', e);
  }

  // 3. Fallback: query Render backend API
  try {
    let targetTopicId = topicId;
    if (!targetTopicId) {
      const topics = await fetchTopicsFromBackend(categoryId);
      const qaTopic = topics.find((t) => t.id.toLowerCase().includes('interview') || t.id.toLowerCase().includes('qa'));
      targetTopicId = qaTopic ? qaTopic.id : (topics[0]?.id || `${categoryId}interviewQuestions`);
    }

    const res = await apiRequest<{ success: boolean; data: any[] }>(
      '/categories/getInterviewQA',
      'POST',
      {
        categoryId,
        topicId: targetTopicId,
        pageSize,
        pageNumber,
      }
    );

    if (res && res.data && Array.isArray(res.data)) {
      const mapped: QuestionAnswer[] = res.data.map((item: any, idx: number) => {
        let answerText = '';
        let codeSnippet = '';
        const points: string[] = [];

        if (Array.isArray(item.data)) {
          item.data.forEach((sub: any) => {
            if (sub.answer) {
              answerText += (answerText ? '\n\n' : '') + sub.answer;
            }
            if (sub.code) {
              codeSnippet = sub.code;
            }
            if (Array.isArray(sub.pointsData)) {
              sub.pointsData.forEach((p: any) => {
                if (typeof p === 'string') points.push(p);
                else if (p && p.data) points.push(p.data);
              });
            }
          });
        }

        return {
          id: item.questionId || `${categoryId}-${targetTopicId}-${idx}`,
          categoryId,
          topicId: targetTopicId,
          categoryName: categoryId.toUpperCase(),
          question: item.question || 'Interview Question',
          answer: answerText || 'Detailed answer explanation available in study section.',
          codeSnippet: codeSnippet || undefined,
          difficulty: 'Senior',
          tags: [categoryId, 'Interview', 'JsPrepBackend'],
          explanationPoints: points.length > 0 ? points : undefined,
        };
      });

      return mapped;
    }
  } catch (err: any) {
    console.warn(`fetchInterviewQAFromBackend error:`, err.message);
  }

  // Fallback to local questions matching category
  return FALLBACK_QA.filter((q) => q.categoryId === categoryId);
}

/**
 * Fetch programming challenges from backend
 */
export async function fetchProgrammingQAFromBackend(
  categoryId: string = 'javascript',
  topicId: string = 'jsProgrammingQA',
  pageSize = 20,
  pageNumber = 1
): Promise<ProgrammingQuestion[]> {
  try {
    const res = await apiRequest<{ success: boolean; data: any[] }>(
      '/programmingQA/getProgrammingQA',
      'POST',
      {
        categoryId,
        topicId,
        pageSize,
        pageNumber,
      }
    );

    if (res && res.data && Array.isArray(res.data)) {
      const mapped: ProgrammingQuestion[] = res.data.map((item: any, idx: number) => {
        let solution = '';
        let explanation = '';

        if (Array.isArray(item.data)) {
          item.data.forEach((d: any) => {
            if (d.note) explanation += d.note + ' ';
            if (Array.isArray(d.approachCode)) {
              d.approachCode.forEach((ac: any) => {
                if (ac.code) solution = ac.code;
              });
            }
          });
        }

        return {
          id: item.titleId || `pqa-${idx}`,
          title: item.title || 'Coding Challenge',
          difficulty: 'Medium',
          category: categoryId,
          description: explanation || item.title || 'Write an efficient JavaScript solution.',
          starterCode: '// Implement your solution below\nfunction solution() {\n  \n}',
          solutionCode: solution || '// Solution available\nfunction solution() {\n  return true;\n}',
          testCases: [
            { input: 'Sample Input 1', expected: 'Output 1' },
            { input: 'Sample Input 2', expected: 'Output 2' },
          ],
          explanation: explanation || 'Optimal solution utilizing algorithms.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
        };
      });

      return mapped;
    }
  } catch (err: any) {
    console.warn(`fetchProgrammingQAFromBackend error:`, err.message);
  }

  return FALLBACK_PQA;
}

/**
 * Comprehensive Initial Sync
 * Fetches all categories, their topics, and interview questions directly from JsPrepBackend
 */
export async function syncAllDataFromBackend(): Promise<{
  categories: Category[];
  questions: QuestionAnswer[];
  programming: ProgrammingQuestion[];
  isLive: boolean;
}> {
  updateApiStatus({ isConnecting: true });

  try {
    // 1. Fetch ALL 1320 Interview Questions from Firestore collection 'interviewQ&A'
    console.log('Initiating sync for 1320 Interview Q&A records from Firestore...');
    const firestoreQuestions = await fetchFirestoreInterviewQA(true);

    // 2. Fetch Programming Challenges from Firestore collection 'programmingQA'
    const firestoreProgQuestions = await fetchFirestoreProgrammingQA(true);

    // 3. Fetch Categories enriched with the exact question counts from the 1320 records
    const categories = await fetchFirestoreCategories(firestoreQuestions);

    // Make categories available before topic sync so API topic IDs are attached to them.
    memoryCache.categories = categories;

    // 4. In parallel, sync backend REST topics to enrich category syllabus outlines
    const priorityCategories = ['javascript', 'react', 'aws', 'html5', 'css3', 'docker', 'kubernetes', 'jenkins', 'ansible', 'terraform'];
    await Promise.allSettled(
      priorityCategories.map(async (catId) => {
        await fetchTopicsFromBackend(catId);
      })
    );

    const questions: QuestionAnswer[] = firestoreQuestions.length > 0 
      ? firestoreQuestions 
      : FALLBACK_QA;

    const programming: ProgrammingQuestion[] = firestoreProgQuestions.length > 0 
      ? firestoreProgQuestions 
      : FALLBACK_PQA;

    memoryCache.allQA = questions;
    memoryCache.allPQA = programming;
    updateApiStatus({
      isConnected: true,
      isConnecting: false,
      lastSyncTime: new Date().toLocaleTimeString(),
      categoriesCount: categories.length,
      questionsCount: questions.length,
      error: null,
    });

    console.log(`Synced ${questions.length} Interview Q&As across ${categories.length} categories.`);

    return {
      categories,
      questions,
      programming,
      isLive: true,
    };
  } catch (err: any) {
    console.error('syncAllDataFromBackend failed:', err);
    updateApiStatus({
      isConnected: false,
      isConnecting: false,
      error: err.message,
    });

    return {
      categories: FALLBACK_CATEGORIES,
      questions: FALLBACK_QA,
      programming: FALLBACK_PQA,
      isLive: false,
    };
  }
}
