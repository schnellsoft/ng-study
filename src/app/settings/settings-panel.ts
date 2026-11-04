import { Component, inject } from '@angular/core';
import { Icon } from '../shared/icon/icon';
import { ThemePreference } from '../core/saved-settings.model';
import { ThemeService } from '../core/theme.service';

interface ThemeOption {
  value: ThemePreference;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-settings-panel',
  imports: [Icon],
  template: `
    <dialog id="settings-panel" class="settings-panel" popover="auto" aria-labelledby="settings-title">
      <div class="settings-head">
        <h2 id="settings-title">Settings</h2>
        <button
          type="button"
          class="icon-btn"
          popovertarget="settings-panel"
          popovertargetaction="hide"
          aria-label="Close settings"
        >
          <app-icon name="close" />
        </button>
      </div>

      <fieldset class="theme-field">
        <legend>Theme</legend>
        <div class="theme-options" role="radiogroup" aria-label="Color theme">
          @for (option of themeOptions; track option.value) {
            <label class="theme-option" [class.active]="theme.preference() === option.value">
              <input
                type="radio"
                name="theme"
                [value]="option.value"
                [checked]="theme.preference() === option.value"
                (change)="onThemeChange(option.value)"
              />
              <app-icon [name]="option.icon" />
              <span>{{ option.label }}</span>
            </label>
          }
        </div>
      </fieldset>
    </dialog>
  `,
  styles: `
    .settings-panel {
      margin: 0;
      inset: auto 1rem auto auto;
      top: 4.25rem;
      width: min(20rem, calc(100vw - 2rem));
      padding: 0.9rem 1rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      color: var(--text);
      box-shadow: 0 0.75rem 2rem color-mix(in oklab, var(--text) 12%, transparent);
    }

    .settings-panel:popover-open {
      display: block;
    }

    .settings-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }

    .settings-head h2 {
      margin: 0;
      font-size: 1rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .icon-btn {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 0.35rem;
      background: transparent;
      color: var(--text);
      cursor: pointer;
    }

    .icon-btn:hover {
      border-color: color-mix(in oklab, var(--accent) 55%, var(--border));
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .theme-field {
      margin: 0;
      padding: 0;
      border: 0;
      min-inline-size: 0;
    }

    .theme-field legend {
      margin-bottom: 0.55rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--muted);
    }

    .theme-options {
      display: grid;
      gap: 0.4rem;
    }

    .theme-option {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto;
      align-items: center;
      column-gap: 0.65rem;
      padding: 0.55rem 0.65rem;
      border: 1px solid var(--border);
      border-radius: 0.4rem;
      cursor: pointer;
    }

    .theme-option app-icon {
      grid-row: 1;
      grid-column: 1;
    }

    .theme-option span {
      grid-row: 1;
      grid-column: 2;
    }

    .theme-option input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .theme-option:hover,
    .theme-option.active {
      border-color: color-mix(in oklab, var(--accent) 60%, var(--border));
      background: color-mix(in oklab, var(--accent) 10%, transparent);
    }

    .theme-option:focus-within {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
  `,
})
export class SettingsPanel {
  protected readonly theme = inject(ThemeService);

  protected readonly themeOptions: ThemeOption[] = [
    { value: 'dark', label: 'Dark', icon: 'theme-dark' },
    { value: 'light', label: 'Light', icon: 'theme-light' },
    { value: 'system', label: 'System', icon: 'theme-system' },
  ];

  protected onThemeChange(value: ThemePreference): void {
    this.theme.setPreference(value);
  }
}
