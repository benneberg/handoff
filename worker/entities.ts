import { IndexedEntity } from "./core-utils";
import type { SystemCard, User, Chat, ChatMessage } from "@shared/types";
import { MOCK_SYSTEM_CARDS, MOCK_USERS, MOCK_CHATS, MOCK_CHAT_MESSAGES } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class SystemCardEntity extends IndexedEntity<SystemCard> {
  static readonly entityName = "system-card";
  static readonly indexName = "system-cards";
  static readonly initialState: SystemCard = {
    id: "",
    projectName: "",
    oneLiner: "",
    targetUser: "",
    problem: "",
    solution: "",
    coreWorkflow: "",
    mvpBuildOrder: "",
    differentiation: "",
    monetization: "",
    nextExpansion: "",
    whatWorks: [],
    whatDoesntWork: [],
    handoffReadiness: 1,
    createdAt: 0
  };
  static seedData = MOCK_SYSTEM_CARDS;
}
export class ChatBoardEntity extends IndexedEntity<{ id: string; title: string; messages: ChatMessage[] }> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState = { id: "", title: "", messages: [] };
  static seedData = MOCK_CHATS.map(c => ({ ...c, messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id) }));
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}