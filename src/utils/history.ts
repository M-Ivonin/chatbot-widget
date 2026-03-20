import type { ChatMessage } from '../services/api.js';

const HISTORY_KEY_PREFIX = 'sirbro-chat-history:';
const MAX_STORED_MESSAGES = 50;

type StoredChatMessage = Omit<ChatMessage, 'timestamp'> & {
  timestamp: string;
};

function getHistoryKey(sessionId: string): string {
  return `${HISTORY_KEY_PREFIX}${sessionId}`;
}

export function loadSessionMessages(sessionId: string): ChatMessage[] {
  try {
    const rawHistory = localStorage.getItem(getHistoryKey(sessionId));
    if (!rawHistory) {
      return [];
    }

    const parsed = JSON.parse(rawHistory) as StoredChatMessage[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }))
      .filter(
        (message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          Number.isFinite(message.timestamp.getTime()) &&
          typeof message.text === 'string',
      );
  } catch {
    return [];
  }
}

export function saveSessionMessages(
  sessionId: string,
  messages: ChatMessage[],
): void {
  try {
    const serializedMessages: StoredChatMessage[] = messages
      .slice(-MAX_STORED_MESSAGES)
      .map((message) => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      }));

    localStorage.setItem(
      getHistoryKey(sessionId),
      JSON.stringify(serializedMessages),
    );
  } catch {
    // Ignore storage failures to avoid blocking chat interactions.
  }
}
