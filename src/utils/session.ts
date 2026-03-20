const SESSION_KEY = 'sirbro-chat-session';
const LEGACY_SESSION_KEY = 'sirbro-chat-session-id';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

type StoredSession = {
  id: string;
  createdAt: number;
};

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getSessionId(): string {
  const now = Date.now();

  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (rawSession) {
      const parsed = JSON.parse(rawSession) as Partial<StoredSession>;
      if (
        typeof parsed.id === 'string' &&
        typeof parsed.createdAt === 'number' &&
        now - parsed.createdAt < SESSION_TTL_MS
      ) {
        return parsed.id;
      }
    }

    const legacySessionId = localStorage.getItem(LEGACY_SESSION_KEY);
    if (legacySessionId) {
      const migratedSession: StoredSession = {
        id: legacySessionId,
        createdAt: now,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(migratedSession));
      localStorage.removeItem(LEGACY_SESSION_KEY);
      return migratedSession.id;
    }

    const nextSession: StoredSession = {
      id: generateUUID(),
      createdAt: now,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    localStorage.removeItem(LEGACY_SESSION_KEY);

    return nextSession.id;
  } catch {
    return generateUUID();
  }
}
