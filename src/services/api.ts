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

export interface AffiliateConfig {
  casino: string;
  url: string;
  bonus: string;
}

export interface GuestChatRequest {
  sessionId: string;
  message: string;
  locale?: string;
  partnerId?: string;
  faqLink?: string;
}

type SupportedLocale = 'en-US' | 'es-419' | 'pt-BR';

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
    partnerId?: string,
    faqLink?: string,
  ): Promise<ChatMessage[]> {
    const payload: GuestChatRequest = { sessionId, message };

    if (locale) {
      payload.locale = locale;
    }

    if (partnerId) {
      payload.partnerId = partnerId;
    }

    if (faqLink) {
      payload.faqLink = faqLink;
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

    return data.messages.map((msg) => {
      const messageType = this.resolveMessageType(msg);
      const content = msg.content ?? null;

      return {
        role: msg.type === 'user' ? ('user' as const) : ('assistant' as const),
        text: this.extractText(content, messageType, locale),
        timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
        messageType,
        content,
      };
    });
  }

  private extractText(
    content: Record<string, unknown> | null,
    messageType?: string,
    locale?: string,
  ): string {
    if (!content) return '';

    if (typeof content['text'] === 'string') {
      return content['text'];
    }

    if (
      messageType === 'prediction' ||
      this.isPredictionContent(content)
    ) {
      return this.formatPredictionMarkdown(content, locale);
    }

    if (typeof content['analysis'] === 'string') {
      return content['analysis'];
    }

    return JSON.stringify(content);
  }

  private resolveMessageType(message: MessageItem): string | undefined {
    if (typeof message.messageType === 'string' && message.messageType.length > 0) {
      return message.messageType;
    }

    if (this.isPredictionContent(message.content)) {
      return 'prediction';
    }

    return undefined;
  }

  private isPredictionContent(
    content: Record<string, unknown> | null,
  ): content is Record<string, unknown> {
    return (
      !!content &&
      typeof content['eventName'] === 'string' &&
      typeof content['predictionValue'] === 'string'
    );
  }

  private normalizeLocale(locale?: string): SupportedLocale {
    const normalized = locale?.toLowerCase().replace('_', '-');

    if (normalized?.startsWith('es')) {
      return 'es-419';
    }

    if (normalized?.startsWith('pt')) {
      return 'pt-BR';
    }

    return 'en-US';
  }

  private formatPredictionMarkdown(
    content: Record<string, unknown>,
    locale?: string,
  ): string {
    const normalizedLocale = this.normalizeLocale(locale);
    const labels: Record<
      SupportedLocale,
      {
        prediction: string;
        match: string;
        kickoff: string;
        odds: string;
        analysis: string;
      }
    > = {
      'en-US': {
        prediction: 'Prediction',
        match: 'Match',
        kickoff: 'Kickoff',
        odds: 'Odds',
        analysis: 'Analysis',
      },
      'es-419': {
        prediction: 'Prediccion',
        match: 'Partido',
        kickoff: 'Inicio',
        odds: 'Cuota',
        analysis: 'Analisis',
      },
      'pt-BR': {
        prediction: 'Palpite',
        match: 'Partida',
        kickoff: 'Inicio',
        odds: 'Odds',
        analysis: 'Analise',
      },
    };

    const safeString = (value: unknown): string =>
      typeof value === 'string' ? value.trim() : '';

    const eventName = safeString(content['eventName']);
    const eventDate = safeString(content['eventDate']);
    const eventTime = safeString(content['timestamp']);
    const predictionValue = safeString(content['predictionValue']);
    const predictionType = safeString(content['predictionType']);
    const odds = safeString(content['odds']);
    const analysis = safeString(content['analysis']);
    const kickoff = [eventDate, eventTime].filter(Boolean).join(' • ');
    const localizedLabels = labels[normalizedLocale];

    const lines = [
      predictionValue
        ? `**${localizedLabels.prediction}:** ${predictionValue}`
        : '',
      predictionType ? `*${predictionType}*` : '',
      eventName ? `**${localizedLabels.match}:** ${eventName}` : '',
      kickoff ? `**${localizedLabels.kickoff}:** ${kickoff}` : '',
      odds ? `**${localizedLabels.odds}:** ${odds}` : '',
      analysis ? `\n**${localizedLabels.analysis}:**\n${analysis}` : '',
    ].filter((line) => line.length > 0);

    return lines.join('\n');
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
