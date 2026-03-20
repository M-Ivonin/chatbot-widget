export interface MessageItem {
  id: number;
  userId: string | null;
  type: string | null;
  messageType: string | null;
  content: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  timestamp: string | null;
  createdAt: string | null;
}

export interface ChatResponse {
  messages: MessageItem[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  messageType?: string;
  content?: Record<string, unknown> | null;
}

export interface GuestChatRequest {
  sessionId: string;
  message: string;
  locale?: string;
}

export class ChatApiService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  async sendMessage(
    sessionId: string,
    message: string,
    locale?: string,
  ): Promise<ChatMessage[]> {
    const payload: GuestChatRequest = { sessionId, message };

    if (locale) {
      payload.locale = locale;
    }

    const response = await fetch(`${this.apiUrl}/chat/guest-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || `Request failed (${response.status})`;
      throw new Error(errorMessage);
    }

    const data: ChatResponse = await response.json();

    return data.messages.map((msg) => ({
      role: msg.type === 'user' ? ('user' as const) : ('assistant' as const),
      text: this.extractText(msg.content),
      timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
      messageType: msg.messageType ?? undefined,
      content: msg.content,
    }));
  }

  private extractText(content: Record<string, unknown> | null): string {
    if (!content) return '';

    if (typeof content['text'] === 'string') {
      return content['text'];
    }

    if (typeof content['analysis'] === 'string') {
      return content['analysis'];
    }

    return JSON.stringify(content);
  }
}
