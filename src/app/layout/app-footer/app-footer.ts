import { Component, inject } from '@angular/core';
import { StatusBarService } from '../../core/status-bar.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="status-bar" aria-label="Status bar">
      <span class="status-app">a001</span>
      <p class="status-message" role="status" aria-live="polite">{{ status.message() }}</p>
      <span class="status-saved">{{ status.lastSavedLabel() }}</span>
    </footer>
  `,
  styles: `
    :host {
      display: contents;
    }

    .status-bar {
      grid-area: footer;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 1rem;
      min-height: 2.25rem;
      padding: 0.45rem 1.25rem;
      border-top: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }

    .status-app {
      color: var(--text);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .status-message {
      margin: 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-saved {
      justify-self: end;
      white-space: nowrap;
    }

    @media (max-width: 700px) {
      .status-bar {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 0.5rem 0.75rem;
      }

      .status-app {
        display: none;
      }
    }
  `,
})
export class AppFooter {
  protected readonly status = inject(StatusBarService);
}
