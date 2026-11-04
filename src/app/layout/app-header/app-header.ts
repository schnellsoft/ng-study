import { Component, inject, input } from '@angular/core';
import { Icon } from '../../shared/icon/icon';
import { SavedSettingsService } from '../../core/saved-settings.service';
import { SettingsPanel } from '../../settings/settings-panel';

@Component({
  selector: 'app-header',
  imports: [Icon, SettingsPanel],
  template: `
    <header class="header">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <p class="brand-name">{{ title() }}</p>
          <p class="brand-tag">Study shell</p>
        </div>
      </div>

      <div class="toolbar" role="toolbar" aria-label="Workspace actions">
        @if (settings.status(); as status) {
          <p class="toolbar-status" aria-live="polite">{{ status }}</p>
        }

        <button
          type="button"
          class="tool-btn"
          aria-label="Save canvas settings"
          [disabled]="settings.busy()"
          (click)="settings.save()"
        >
          <app-icon name="save" />
          <span>Save</span>
        </button>

        <button
          type="button"
          class="tool-btn"
          aria-label="Load last saved canvas settings"
          [disabled]="settings.busy()"
          (click)="settings.load()"
        >
          <app-icon name="load" />
          <span>Load</span>
        </button>

        <button
          type="button"
          class="tool-btn"
          popovertarget="settings-panel"
          aria-label="Open settings"
        >
          <app-icon name="settings" />
          <span>Settings</span>
        </button>
      </div>

      <app-settings-panel />
    </header>
  `,
  styles: `
    :host {
      display: contents;
    }

    .header {
      grid-area: header;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      height: 5rem;
      padding: 0 1.25rem;
      border-bottom: 1px solid var(--border);
      background: color-mix(in oklab, var(--surface) 88%, transparent);
      backdrop-filter: blur(10px);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .brand-mark {
      width: 2rem;
      height: 2rem;
      flex: none;
      border: 1px solid var(--border);
      background:
        linear-gradient(145deg, color-mix(in oklab, var(--accent) 70%, white), transparent 60%),
        var(--surface);
    }

    .brand-name {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }

    .brand-tag {
      margin: 0.1rem 0 0;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--muted);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .toolbar-status {
      margin: 0 0.35rem 0 0;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--muted);
      max-width: 14rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tool-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      height: 2.25rem;
      padding: 0 0.7rem;
      border: 1px solid var(--border);
      border-radius: 0.4rem;
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
    }

    .tool-btn:hover:not(:disabled) {
      border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
    }

    .tool-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .tool-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    @media (max-width: 700px) {
      .tool-btn span {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .toolbar-status {
        display: none;
      }
    }
  `,
})
export class AppHeader {
  readonly title = input.required<string>();
  protected readonly settings = inject(SavedSettingsService);
}
