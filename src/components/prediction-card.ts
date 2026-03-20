import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { chatTheme } from '../styles/theme.js';

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
    `,
  ];

  @property({ attribute: false }) content: Record<string, unknown> | null = null;
  @property({ type: String }) locale = 'en-US';

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

        ${analysis
          ? html`
              <div class="analysis">
                <div class="analysis-title">${labels.analysis}</div>
                <div class="analysis-text">${analysis}</div>
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
