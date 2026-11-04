import { Injectable, afterNextRender, signal } from '@angular/core';
import { ThemePreference } from './saved-settings.model';

const STORAGE_KEY = 'color-scheme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly preference = signal<ThemePreference>('system');

  constructor() {
    afterNextRender(() => {
      this.preference.set(this.readStoredPreference());
      this.apply(this.preference());
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
    this.persist(preference);
    this.apply(preference);
  }

  private readStoredPreference(): ThemePreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      if (stored === 'light dark') {
        return 'system';
      }
    } catch {
      // Storage can be blocked; fall through to system.
    }
    return 'system';
  }

  private persist(preference: ThemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Persistence can fail when storage is blocked; theme still applies in-session.
    }
  }

  private apply(preference: ThemePreference): void {
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      return;
    }
    meta.setAttribute('content', preference === 'system' ? 'light dark' : preference);
  }
}
