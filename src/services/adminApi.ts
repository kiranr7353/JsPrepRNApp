import { apiRequest } from './api';

export interface DescriptionSnippet {
  url: string;
  imageUploaded: boolean;
}

export interface FormPoint {
  id: number;
  pointHeader: string;
  value: string;
  code: string;
  snippet: DescriptionSnippet[];
}

export interface FormTableColumn { value: string }
export interface FormTableRow { value1: string; value2: string }

export interface FormDescription {
  id: number;
  header: string;
  data: string;
  snippet: DescriptionSnippet[];
  imageUploaded: boolean;
  hasPoints: boolean;
  pointsData: FormPoint[];
  hasTable: boolean;
  tableColumns: FormTableColumn[];
  tableData: FormTableRow[];
  note?: string;
}

export interface AddConceptPayload {
  categoryId: string;
  topicId: string;
  id: number;
  title: string;
  data: FormDescription[];
}

export interface EditConceptPayload {
  currentTitle: string;
  changedTitle: string;
  categoryId: string;
  topicId: string;
}

export interface DeleteConceptPayload {
  title: string;
  categoryId: string;
  topicId: string;
}

export interface SectionDataWrapper {
  description: FormDescription[];
  sectionId: number;
}

export interface AddEditSectionPayload {
  sectionId: number;
  categoryId: string;
  title: string;
  topicId: string;
  data: SectionDataWrapper[];
}

export interface AddQAPayload {
  categoryId: string;
  topicId: string;
  questionId: string;
  question: string;
  type: 'add';
  data: FormQAAnswer[];
}

export interface EditQAPayload {
  categoryId: string;
  topicId: string;
  questionId: string;
  question: string;
  enabled: boolean;
  type: 'request';
  data: FormQAAnswer[];
}

export interface FormQAAnswer {
  id: number;
  answer: string;
  code: string;
  snippets: DescriptionSnippet[];
  hasPoints: boolean;
  pointsData: { id: number; pointHeader: string; value: string; code: string; snippets: DescriptionSnippet[] }[];
  hasTable: boolean;
  tableColumns: FormTableColumn[];
  tableData: FormTableRow[];
  hasNote: boolean;
  note: string;
}

export function emptyDescription(id = 1): FormDescription {
  return {
    id,
    header: '',
    data: '',
    snippet: [],
    imageUploaded: false,
    hasPoints: false,
    pointsData: [],
    hasTable: false,
    tableColumns: [{ value: '' }, { value: '' }],
    tableData: [{ value1: '', value2: '' }],
    note: '',
  };
}

export function emptyPoint(id = 1): FormPoint {
  return { id, pointHeader: '', value: '', code: '', snippet: [] };
}

export function emptyQAAnswer(id = 1): FormQAAnswer {
  return {
    id,
    answer: '',
    code: '',
    snippets: [],
    hasPoints: false,
    pointsData: [],
    hasTable: false,
    tableColumns: [{ value: '' }, { value: '' }],
    tableData: [{ value1: '', value2: '' }],
    hasNote: false,
    note: '',
  };
}

export async function addConcept(payload: AddConceptPayload): Promise<any> {
  return apiRequest('/concepts/addConcepts', 'POST', payload);
}

export async function editConcept(payload: EditConceptPayload): Promise<any> {
  return apiRequest('/concepts/editConcept', 'POST', payload);
}

export async function deleteConcept(payload: DeleteConceptPayload): Promise<any> {
  return apiRequest('/concepts/deleteConcept', 'POST', payload);
}

export async function addEditSection(payload: AddEditSectionPayload): Promise<any> {
  return apiRequest('/concepts/section/editDescription', 'POST', payload);
}

export async function addInterviewQA(payload: AddQAPayload): Promise<any> {
  return apiRequest('/categories/createInterviewQuestions', 'POST', payload);
}

export async function updateInterviewQA(payload: EditQAPayload): Promise<any> {
  return apiRequest('/categories/updateInterviewQuestion', 'POST', payload);
}
