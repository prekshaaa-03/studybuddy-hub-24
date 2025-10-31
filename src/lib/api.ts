export type User = { UserID: number; Name: string; Email: string };
export type Goal = { GoalID: number; Title: string; Description: string; DueDate: string; UserID: number };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Users
  getUsers: () => http<User[]>('/users'),
  addUser: (payload: { Name: string; Email: string; Password: string }) =>
    http<User>('/add_user', { method: 'POST', body: JSON.stringify(payload) }),

  // Goals
  getGoals: (userId: number) => http<Goal[]>(`/goals?userId=${userId}`),
  addGoal: (payload: { Title: string; Description?: string; DueDate: string; UserID: number }) =>
    http<Goal>('/goals', { method: 'POST', body: JSON.stringify(payload) }),
  deleteGoal: (goalId: number) => http<{ ok: boolean }>(`/goals/${goalId}`, { method: 'DELETE' }),
};

export function getLocalUserId(): number {
  const stored = localStorage.getItem('localUserId');
  if (stored) return Number(stored);
  // Fallback to 1 if not set (adjust per your DB)
  return 1;
}
