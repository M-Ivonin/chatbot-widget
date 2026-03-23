import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { chatTheme } from '../styles/theme.js';
import { IOS_STORE_URL, ANDROID_STORE_URL } from '../constants.js';

const GOOGLE_PLAY_ICON_PATH =
  'M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z';

const APPLE_ICON_PATH =
  'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z';

type SupportedLocale = 'en-US' | 'es-419' | 'pt-BR';

type PredictionLabels = {
  title: string;
  risky: string;
  odds: string;
  analysis: string;
  prediction: string;
  kickoff: string;
};

@customElement('sirbro-prediction-card')
export class PredictionCard extends LitElement {
  static styles = [
    chatTheme,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .card {
        overflow: hidden;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        color: #a5b4fc;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .header-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: rgba(99, 102, 241, 0.16);
        color: #818cf8;
      }

      .header-icon svg {
        width: 10px;
        height: 10px;
      }

      .spacer {
        flex: 1;
      }

      .risk-pill {
        border-radius: 999px;
        padding: 4px 8px;
        background: rgba(251, 191, 36, 0.12);
        color: #fcd34d;
        font-size: 10px;
        font-weight: 700;
        text-transform: none;
        letter-spacing: 0;
      }

      .hero {
        margin: 0 12px;
        padding: 14px;
        border-radius: 14px 14px 0 0;
        background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
        color: white;
      }

      .event-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .event-name {
        flex: 1;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.35;
      }

      .event-date {
        font-size: 11px;
        opacity: 0.88;
        white-space: nowrap;
      }

      .event-category {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.9;
      }

      .prediction-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-top: 14px;
      }

      .prediction-check {
        width: 18px;
        height: 18px;
        min-width: 18px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.22);
      }

      .prediction-check svg {
        width: 11px;
        height: 11px;
      }

      .prediction-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.03em;
        opacity: 0.9;
        text-transform: uppercase;
      }

      .prediction-value {
        font-size: 20px;
        font-weight: 800;
        line-height: 1.2;
        margin-top: 2px;
      }

      .prediction-type {
        margin-top: 2px;
        font-size: 12px;
        opacity: 0.88;
      }

      .metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1px;
        margin: 0 12px;
        background: rgba(255, 255, 255, 0.08);
      }

      .metric {
        padding: 14px;
        background: rgba(17, 24, 39, 0.88);
      }

      .metric-label {
        font-size: 11px;
        color: var(--sirbro-text-muted, rgba(240, 240, 245, 0.5));
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .metric-value {
        margin-top: 6px;
        font-size: 18px;
        font-weight: 800;
        color: var(--sirbro-text, #f0f0f5);
      }

      .analysis {
        padding: 14px;
        margin: 0 12px 12px;
        border-radius: 0 0 14px 14px;
        background: rgba(255, 255, 255, 0.03);
      }

      .analysis-title {
        font-size: 12px;
        font-weight: 800;
        color: var(--sirbro-text, #f0f0f5);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .analysis-text {
        margin-top: 8px;
        font-size: 13px;
        line-height: 1.55;
        color: var(--sirbro-text, #f0f0f5);
        white-space: pre-wrap;
      }

      .partner-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 10px 12px 12px;
        margin: 0 12px 12px;
        border-radius: 0 0 14px 14px;
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      .partner-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 38px;
        padding: 8px 10px;
        border-radius: 10px;
        border: none;
        font-family: var(--sirbro-font, system-ui, sans-serif);
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition: filter var(--sirbro-transition, 0.25s),
          transform var(--sirbro-transition, 0.25s);
      }

      .partner-btn:hover {
        filter: brightness(1.12);
        transform: translateY(-1px);
      }

      .partner-btn:active {
        transform: scale(0.96);
      }

      .partner-btn svg {
        width: 13px;
        height: 13px;
        flex-shrink: 0;
      }

      .partner-btn.bet {
        background: var(--sirbro-accent, #6366f1);
        color: #fff;
      }

      .partner-btn.download {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: var(--sirbro-text, #f0f0f5);
      }
    `,
  ];

  @property({ attribute: false }) content: Record<string, unknown> | null = null;
  @property({ type: String }) locale = 'en-US';
  @property({ type: Boolean }) partnerMode = false;
  @property({ type: String }) betUrl = '';

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

  private getLabels(locale: SupportedLocale): PredictionLabels {
    const labels: Record<SupportedLocale, PredictionLabels> = {
      'en-US': {
        title: 'Prediction',
        risky: 'Risky',
        odds: 'Odds',
        analysis: 'Analysis',
        prediction: 'Prediction',
        kickoff: 'Kickoff',
      },
      'es-419': {
        title: 'Predicción',
        risky: 'Arriesgada',
        odds: 'Cuota',
        analysis: 'Análisis',
        prediction: 'Predicción',
        kickoff: 'Inicio',
      },
      'pt-BR': {
        title: 'Palpite',
        risky: 'Arriscada',
        odds: 'Odds',
        analysis: 'Análise',
        prediction: 'Palpite',
        kickoff: 'Início',
      },
    };

    return labels[locale];
  }

  private asString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  render() {
    if (!this.content) {
      return html``;
    }

    const locale = this.normalizeLocale(this.locale);
    const labels = this.getLabels(locale);
    const eventName = this.asString(this.content['eventName']);
    const eventCategory = this.asString(this.content['eventCategory']);
    const eventDate = this.asString(this.content['eventDate']);
    const eventTime = this.asString(this.content['timestamp']);
    const predictionType = this.asString(this.content['predictionType']);
    const predictionValue = this.asString(this.content['predictionValue']);
    const odds = this.asString(this.content['odds']);
    const analysis = this.asString(this.content['analysis']);
    const isRisky =
      typeof this.content['isRisky'] === 'boolean'
        ? this.content['isRisky']
        : false;
    const kickoff = [eventDate, eventTime].filter(Boolean).join(' • ');

    return html`
      <div class="card">
        <div class="header">
          <span class="header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5z"></path>
            </svg>
          </span>
          <span>${labels.title}</span>
          <span class="spacer"></span>
          ${isRisky ? html`<span class="risk-pill">${labels.risky}</span>` : ''}
        </div>

        <div class="hero">
          <div class="event-row">
            <div class="event-name">${eventName || '-'}</div>
            ${kickoff ? html`<div class="event-date">${kickoff}</div>` : ''}
          </div>
          ${eventCategory
            ? html`<div class="event-category">${eventCategory}</div>`
            : ''}

          <div class="prediction-row">
            <span class="prediction-check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path>
              </svg>
            </span>
            <div>
              <div class="prediction-label">${labels.prediction}</div>
              <div class="prediction-value">${predictionValue || '-'}</div>
              ${predictionType
                ? html`<div class="prediction-type">${predictionType}</div>`
                : ''}
            </div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric">
            <div class="metric-label">${labels.odds}</div>
            <div class="metric-value">${odds || '-'}</div>
          </div>
          <div class="metric">
            <div class="metric-label">${labels.kickoff}</div>
            <div class="metric-value">${kickoff || '-'}</div>
          </div>
        </div>

        ${analysis && !this.partnerMode
          ? html`
              <div class="analysis">
                <div class="analysis-title">${labels.analysis}</div>
                <div class="analysis-text">${analysis}</div>
              </div>
            `
          : ''}

        ${this.partnerMode
          ? html`
              <div class="partner-actions">
                ${this.betUrl
                  ? html`
                      <a
                        class="partner-btn bet"
                        href=${this.betUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>
                        </svg>
                        Bet
                      </a>
                    `
                  : ''}
                <a
                  class="partner-btn download"
                  href=${IOS_STORE_URL || ANDROID_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download App
                </a>
              </div>
            `
         : ''}
     </div>
   `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sirbro-prediction-card': PredictionCard;
  }
}
