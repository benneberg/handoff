export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export type TransmitVenue = 'hn' | 'twitter' | 'reddit' | 'discord' | 'generic';
export interface SystemCard {
  id: string;
  projectName: string;
  oneLiner: string;
  targetUser: string;
  problem: string;
  solution: string;
  coreWorkflow: string;
  mvpBuildOrder: string;
  differentiation: string;
  monetization: string;
  nextExpansion: string;
  whatWorks: string[];
  whatDoesntWork: string[];
  handoffReadiness: number; // 1-10
  createdAt: number;
  updatedAt: number;
}
export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  preset: Partial<SystemCard>;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}