import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
  arrayUnion,
  arrayRemove,
  query,
  where,
  limit,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, QUESTIONS_ANSWERS, PROGRAMMING_QUESTIONS } from '../data/prepData';
import { Category, QuestionAnswer, ProgrammingQuestion, Topic } from '../types';

export const firebaseConfig = {
  apiKey: 'AIzaSyAcZjxtVxKuaNoeClWKeh8Luk8g2NMjhZ8',
  authDomain: 'jsprep-ed0c8.firebaseapp.com',
  projectId: 'jsprep-ed0c8',
  storageBucket: 'jsprep-ed0c8.appspot.com',
  messagingSenderId: '468010744164',
  appId: '1:468010744164:web:bd33dbd91caf136818a271',
  measurementId: 'G-X8SDKV7FCZ',
};

let app: FirebaseApp;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  app = initializeApp(firebaseConfig, 'jsprep-mobile');
}

export const auth = getAuth(app);
export const db = getFirestore(app);

const LOCAL_STORAGE_KEY = 'jsprep_user_data_v1';

export interface LocalUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  isGuest: boolean;
  bookmarkedQAIds: string[];
  bookmarkedPQAIds: string[];
  completedQuestions: string[];
}

const DEFAULT_USER: LocalUserData = {
  uid: 'guest-' + Math.random().toString(36).substring(2, 9),
  email: 'guest@jsprep.dev',
  displayName: 'Dev Candidate',
  isGuest: true,
  bookmarkedQAIds: ['js-1', 'react-1', 'aws-1'],
  bookmarkedPQAIds: ['p-1'],
  completedQuestions: ['js-1'],
};

// Synchronous in-memory cache so getStoredUserData() can remain sync
let _userCache: LocalUserData = DEFAULT_USER;

export async function loadStoredUserData(): Promise<LocalUserData> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      _userCache = JSON.parse(raw);
      return _userCache;
    }
  } catch (err) {
    console.warn('Could not read AsyncStorage:', err);
  }
  return _userCache;
}

export function getStoredUserData(): LocalUserData {
  return _userCache;
}

export async function saveStoredUserData(data: LocalUserData): Promise<void> {
  _userCache = data;
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save to AsyncStorage:', err);
  }
}

export async function syncBookmarkToFirestore(
  userId: string,
  id: string,
  type: 'qa' | 'pqa',
  add: boolean
) {
  if (!userId || userId.startsWith('guest-')) return;
  try {
    const userRef = doc(db, 'users', userId);
    const field = type === 'qa' ? 'bookmarkedQAIds' : 'bookmarkedPQAIds';
    await updateDoc(userRef, {
      [field]: add ? arrayUnion(id) : arrayRemove(id),
    });
  } catch (error) {
    console.log('Firestore sync notice (using local storage fallback):', error);
  }
}

export async function seedCurriculumToFirestore(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const cat of CATEGORIES) {
      const catRef = doc(db, 'categories', cat.id);
      batch.set(catRef, { ...cat, updatedAt: new Date().toISOString() }, { merge: true });
      count++;
    }
    for (const qa of QUESTIONS_ANSWERS) {
      const qaRef = doc(db, 'questions', qa.id);
      batch.set(qaRef, { ...qa, updatedAt: new Date().toISOString() }, { merge: true });
      count++;
    }
    for (const pqa of PROGRAMMING_QUESTIONS) {
      const pqaRef = doc(db, 'programming_challenges', pqa.id);
      batch.set(pqaRef, { ...pqa, updatedAt: new Date().toISOString() }, { merge: true });
      count++;
    }

    await batch.commit();
    return { success: true, count, message: `Successfully synchronized ${count} documents to Firestore.` };
  } catch (error: any) {
    return { success: false, count: 0, message: error?.message || 'Failed to sync with Firestore.' };
  }
}

const CATEGORY_NAMES: Record<string, string> = {
  javascript: 'JavaScript', react: 'React', aws: 'AWS Cloud', docker: 'Docker',
  kubernetes: 'Kubernetes', ansible: 'Ansible', jenkins: 'Jenkins', terraform: 'Terraform',
  css3: 'CSS3', html5: 'HTML5', node: 'Node.js', express: 'Express', mongodb: 'MongoDB',
  mysql: 'MySQL', azure: 'Microsoft Azure', linux: 'Linux', graphql: 'GraphQL',
  next: 'Next.js', reactNative: 'React Native', shellScripting: 'Shell Scripting',
};

let firestoreQACache: QuestionAnswer[] | null = null;
let firestorePQACache: ProgrammingQuestion[] | null = null;
let firestoreCategoriesCache: Category[] | null = null;

export function mapFirestoreQADoc(docId: string, data: any): QuestionAnswer {
  let answer = '';
  let codeSnippet = '';
  const explanationPoints: string[] = [];
  const snippets: { url?: string; imageUploaded?: boolean }[] = [];
  const pointsData: { pointHeader?: string; value?: string; code?: string }[] = [];

  if (Array.isArray(data.data)) {
    data.data.forEach((block: any) => {
      if (block.answer) answer += (answer ? '\n\n' : '') + block.answer.trim();
      if (block.code && !codeSnippet) codeSnippet = block.code;
      if (Array.isArray(block.pointsData)) {
        block.pointsData.forEach((pt: any) => {
          if (pt.value) {
            const header = pt.pointHeader ? `${pt.pointHeader}: ` : '';
            explanationPoints.push(`${header}${pt.value}`.trim());
            pointsData.push({ pointHeader: pt.pointHeader || '', value: pt.value || '', code: pt.code || '' });
          }
          if (pt.code && !codeSnippet) codeSnippet = pt.code;
          const ptSnips = pt.snippet || pt.snippets;
          if (Array.isArray(ptSnips)) {
            ptSnips.forEach((snip: any) => { if (snip?.url) snippets.push(snip); });
          }
        });
      }
      const blockSnips = block.snippet || block.snippets;
      if (Array.isArray(blockSnips)) {
        blockSnips.forEach((snip: any) => { if (snip?.url) snippets.push(snip); });
      }
    });
  } else if (typeof data.answer === 'string') {
    answer = data.answer;
  }

  const catId = (data.categoryId || 'javascript').toLowerCase();
  let difficulty: 'Junior' | 'Mid' | 'Senior' = 'Mid';
  const qLower = (data.question || '').toLowerCase();
  if (qLower.includes('architecture') || qLower.includes('optimize') || qLower.includes('advanced')) difficulty = 'Senior';
  else if (qLower.includes('what is') || qLower.includes('define') || qLower.includes('explain')) difficulty = 'Junior';

  return {
    id: data.questionId || docId,
    categoryId: catId,
    categoryName: CATEGORY_NAMES[catId] || catId.toUpperCase(),
    topicId: data.topicId,
    question: data.question || 'Untitled Question',
    answer: answer || 'Detailed explanation available below.',
    codeSnippet: codeSnippet || undefined,
    difficulty,
    tags: [CATEGORY_NAMES[catId] || catId].filter(Boolean),
    explanationPoints: explanationPoints.length > 0 ? explanationPoints : undefined,
    snippets: snippets.length > 0 ? snippets : undefined,
    pointsData: pointsData.length > 0 ? pointsData : undefined,
  };
}

export async function fetchFirestoreInterviewQA(forceRefresh = false): Promise<QuestionAnswer[]> {
  if (!forceRefresh && firestoreQACache && firestoreQACache.length > 0) return firestoreQACache;
  try {
    const collRef = collection(db, 'interviewQ&A');
    const snap = await getDocs(collRef);
    if (!snap.empty) {
      const results: QuestionAnswer[] = [];
      snap.forEach((docSnap) => results.push(mapFirestoreQADoc(docSnap.id, docSnap.data())));
      firestoreQACache = results;
      return results;
    }
  } catch (err) {
    console.warn('Error fetching from Firestore /interviewQ&A:', err);
  }
  return firestoreQACache || QUESTIONS_ANSWERS;
}

export async function fetchFirestoreProgrammingQA(forceRefresh = false): Promise<ProgrammingQuestion[]> {
  if (!forceRefresh && firestorePQACache && firestorePQACache.length > 0) return firestorePQACache;
  try {
    const collRef = collection(db, 'programmingQA');
    const snap = await getDocs(collRef);
    if (!snap.empty) {
      const results: ProgrammingQuestion[] = [];
      snap.forEach((d) => {
        const data = d.data();
        let solutionCode = '';
        let description = '';
        const snippets: { url?: string }[] = [];
        if (Array.isArray(data.data)) {
          data.data.forEach((block: any) => {
            if (block.approachExplain) description += (description ? '\n\n' : '') + block.approachExplain;
            if (Array.isArray(block.approachCode)) {
              block.approachCode.forEach((ac: any) => {
                if (ac.code && !solutionCode) solutionCode = ac.code;
                if (Array.isArray(ac.snippet)) ac.snippet.forEach((snip: any) => { if (snip?.url) snippets.push(snip); });
              });
            }
          });
        }
        results.push({
          id: data.titleId || d.id,
          title: data.title || 'Coding Challenge',
          difficulty: 'Medium',
          category: data.categoryId || 'javascript',
          description: description || `Implement an efficient solution for: ${data.title}`,
          starterCode: `// Implement your solution\nfunction solution() {\n  \n}`,
          solutionCode: solutionCode || '// Solution\nfunction solution() {\n  return true;\n}',
          testCases: [{ input: 'Sample Input', expected: 'Expected Output' }],
          explanation: data.approachHeader || 'Analyzed time and space complexity.',
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          snippets: snippets.length > 0 ? snippets : undefined,
        });
      });
      firestorePQACache = results;
      return results;
    }
  } catch (err) {
    console.warn('Error fetching from Firestore /programmingQA:', err);
  }
  return firestorePQACache || PROGRAMMING_QUESTIONS;
}

export async function fetchFirestoreCategories(questionsList?: QuestionAnswer[]): Promise<Category[]> {
  const qa = questionsList || firestoreQACache || QUESTIONS_ANSWERS;
  const countsPerCategory: Record<string, number> = {};
  qa.forEach((q) => {
    const c = q.categoryId.toLowerCase();
    countsPerCategory[c] = (countsPerCategory[c] || 0) + 1;
  });
  try {
    const collRef = collection(db, 'categories');
    const snap = await getDocs(collRef);
    if (!snap.empty) {
      const results: Category[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const catId = (data.categoryId || d.id).toLowerCase();
        const fallback = CATEGORIES.find((c) => c.id === catId);
        results.push({
          id: catId,
          title: data.categoryName || fallback?.title || CATEGORY_NAMES[catId] || catId,
          description: data.description || fallback?.description || `${CATEGORY_NAMES[catId] || catId} interview prep`,
          iconName: fallback?.iconName || 'Code2',
          badge: fallback?.badge || 'Track',
          color: fallback?.color || 'from-blue-600 to-indigo-600',
          totalQuestions: countsPerCategory[catId] || fallback?.totalQuestions || 10,
          totalSnippets: fallback?.totalSnippets || 12,
          topics: fallback?.topics || [],
        });
      });
      firestoreCategoriesCache = results;
      return results;
    }
  } catch (err) {
    console.warn('Error fetching Firestore categories:', err);
  }
  return CATEGORIES.map((cat) => ({ ...cat, totalQuestions: countsPerCategory[cat.id.toLowerCase()] || cat.totalQuestions }));
}

export async function fetchRemoteQuestions(): Promise<QuestionAnswer[]> {
  return fetchFirestoreInterviewQA();
}

function isAdminRole(data: any): boolean {
  return (
    data?.role === 'admin' ||
    data?.role === 'superAdmin' ||
    data?.isAdmin === true ||
    data?.userType === 'admin' ||
    data?.admin === true
  );
}

export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!uid || uid.startsWith('guest-')) return false;
  try {
    // Try 1: doc ID === uid (most common pattern)
    const directSnap = await getDoc(doc(db, 'users', uid));
    if (directSnap.exists()) {
      const result = isAdminRole(directSnap.data());
      console.log('[checkIsAdmin] direct hit, role:', directSnap.data()?.role, 'isAdmin:', result);
      return result;
    }

    // Try 2: uid stored as a field (auto-generated doc IDs)
    const q = query(collection(db, 'users'), where('uid', '==', uid), limit(1));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      const data = qSnap.docs[0].data();
      const result = isAdminRole(data);
      console.log('[checkIsAdmin] query hit, role:', data?.role, 'isAdmin:', result);
      return result;
    }

    console.log('[checkIsAdmin] no user doc found for uid:', uid);
  } catch (err) {
    console.warn('[checkIsAdmin] error:', err);
  }
  return false;
}
