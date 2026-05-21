import { DashboardPayload, Expense, Goal, Habit, StudyTask, UserProfile } from './types';
import { dashboard as mockDashboard } from './mock-data';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '';

if (typeof window !== 'undefined') {
  if (!rawApiUrl) {
    console.warn('[LifeOS Web] NEXT_PUBLIC_API_URL is not set. Configure it in Vercel.');
  } else {
    console.log('[LifeOS Web] API base URL:', apiBaseUrl);
  }
}

type AuthResponse = {
  token: string;
  user: UserProfile;
};

type ResourceListResponse<T> = { [key: string]: T[] };

type ResourceCreateResponse<T> = { [key: string]: T };

export type ApiError = {
  message: string;
  issues?: unknown;
};

export type InsightsResponse = {
  insights: string[];
  riskSignals: Array<{ area: string; score: number; message: string }>;
  recommendations: string[];
  finance?: { incomeTotal: number; expenseTotal: number; netTotal: number };
};

/**
 * Get stored auth token from localStorage.
 * Only works in browser context (useEffect, event handlers, etc.)
 */
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lifeos-token');
}

/**
 * Clear invalid token and stored user data
 */
function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lifeos-token');
  localStorage.removeItem('lifeos-user');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set. Configure it in the Vercel environment settings.');
  }
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  // Handle 401 - clear invalid token and redirect
  if (response.status === 401) {
    clearAuthState();
    // Redirect to login only in browser context
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Build auth header from provided token or stored token
 * Properly merges with existing headers
 */
function buildHeaders(token?: string, additionalHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders
  };

  const authToken = token || getStoredToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

export async function getGoals(token?: string) {
  return request<ResourceListResponse<Goal>>('/goals', { headers: buildHeaders(token) });
}

export async function getHabits(token?: string) {
  return request<ResourceListResponse<Habit>>('/habits', { headers: buildHeaders(token) });
}

export async function getExpenses(token?: string) {
  return request<ResourceListResponse<Expense>>('/expenses', { headers: buildHeaders(token) });
}

export async function getStudyTasks(token?: string) {
  return request<ResourceListResponse<StudyTask>>('/study', { headers: buildHeaders(token) });
}

export async function createGoal(token: string, payload: Omit<Goal, 'id'> & { milestones: Goal['milestones'] }) {
  return request<ResourceCreateResponse<Goal>>('/goals', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateGoal(token: string, id: string, payload: Partial<Omit<Goal, 'id'>>) {
  return request<ResourceCreateResponse<Goal>>(`/goals/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteGoal(token: string, id: string) {
  return request<void>(`/goals/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token)
  });
}

export async function createHabit(token: string, payload: Omit<Habit, 'id'>) {
  return request<ResourceCreateResponse<Habit>>('/habits', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateHabit(token: string, id: string, payload: Partial<Omit<Habit, 'id'>>) {
  return request<ResourceCreateResponse<Habit>>(`/habits/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteHabit(token: string, id: string) {
  return request<void>(`/habits/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token)
  });
}

export async function createExpense(token: string, payload: Omit<Expense, 'id'>) {
  return request<ResourceCreateResponse<Expense>>('/expenses', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateExpense(token: string, id: string, payload: Partial<Omit<Expense, 'id'>>) {
  return request<ResourceCreateResponse<Expense>>(`/expenses/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteExpense(token: string, id: string) {
  return request<void>(`/expenses/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token)
  });
}

export async function createStudyTask(token: string, payload: Omit<StudyTask, 'id'>) {
  return request<ResourceCreateResponse<StudyTask>>('/study', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateStudyTask(token: string, id: string, payload: Partial<Omit<StudyTask, 'id'>>) {
  return request<ResourceCreateResponse<StudyTask>>(`/study/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteStudyTask(token: string, id: string) {
  return request<void>(`/study/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token)
  });
}

export async function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function signup(name: string, email: string, password: string) {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function getDashboard(token?: string) {
  try {
    return await request<DashboardPayload>('/dashboard/summary', {
      headers: buildHeaders(token)
    });
  } catch {
    return mockDashboard;
  }
}

export async function getInsights(token?: string) {
  try {
    return await request<InsightsResponse>('/dashboard/insights', {
      headers: buildHeaders(token)
    });
  } catch {
    return {
      insights: mockDashboard.aiInsights,
      riskSignals: [
        { area: 'Goals', score: 0.31, message: 'One monthly goal is behind schedule.' },
        { area: 'Habits', score: 0.82, message: 'Your morning habits are stable.' },
        { area: 'Expenses', score: 0.58, message: 'Food spending is trending high.' }
      ],
      recommendations: [
        'Block two 45-minute goal sessions this week.',
        'Move one discretionary spend into a strict weekly budget.',
        'Attach study sessions to an existing habit to improve consistency.'
      ]
    };
  }
}

/**
 * Get current stored token (browser only)
 */
export function getCurrentToken(): string | null {
  return getStoredToken();
}

/**
 * Clear auth state and redirect to login
 */
export function logout(): void {
  clearAuthState();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}