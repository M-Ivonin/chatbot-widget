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

export interface RateLimitPopupData {
  message: string;
  retryAfterMinutes?: number;
  iosStoreUrl?: string;
  androidStoreUrl?: string;
}

export interface GuestChatRequest {
  sessionId: string;
  message: string;
  locale?: string;
}

export class ChatApiError extends Error {
  status: number;
  code?: string;
  rateLimit?: RateLimitPopupData;

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    rateLimit?: RateLimitPopupData;
  }) {
    super(params.message);
    this.name = 'ChatApiError';
    this.status = params.status;
    this.code = params.code;
    this.rateLimit = params.rateLimit;
  }
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
      throw new ChatApiError({
        message: errorMessage,
        status: response.status,
        code: typeof errorData?.code === 'string' ? errorData.code : undefined,
        rateLimit:
          response.status === 429
            ? this.extractRateLimitPopupData(errorData)
            : undefined,
      });
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

  private extractRateLimitPopupData(
    errorData: unknown,
  ): RateLimitPopupData | undefined {
    if (!errorData || typeof errorData !== 'object') {
      return undefined;
    }

    const record = errorData as Record<string, unknown>;
    const stores =
      record['stores'] && typeof record['stores'] === 'object'
        ? (record['stores'] as Record<string, unknown>)
        : null;

    if (typeof record['message'] !== 'string') {
      return undefined;
    }

    return {
      message: record['message'],
      retryAfterMinutes:
        typeof record['retryAfterMinutes'] === 'number'
          ? record['retryAfterMinutes']
          : undefined,
      iosStoreUrl:
        stores && typeof stores['ios'] === 'string' ? stores['ios'] : undefined,
      androidStoreUrl:
        stores && typeof stores['android'] === 'string'
          ? stores['android']
          : undefined,
    };
  }
}
