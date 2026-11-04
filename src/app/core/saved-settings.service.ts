import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CanvasStateService } from './canvas-state.service';
import {
  DEFAULT_SAVED_SETTINGS,
  SavedSettings,
  ThemePreference,
} from './saved-settings.model';
import { StatusBarService } from './status-bar.service';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class SavedSettingsService {
  private readonly http = inject(HttpClient);
  private readonly canvas = inject(CanvasStateService);
  private readonly theme = inject(ThemeService);
  private readonly statusBar = inject(StatusBarService);

  readonly busy = signal(false);

  async save(): Promise<void> {
    if (this.busy()) {
      return;
    }

    this.busy.set(true);
    this.statusBar.setMessage('Saving…');

    const payload: SavedSettings = {
      theme: this.theme.preference(),
      box: this.canvas.snapshot(),
      updatedAt: null,
    };

    try {
      const saved = await firstValueFrom(
        this.http.put<SavedSettings>('/api/settings', payload),
      );
      this.statusBar.setLastSavedAt(saved.updatedAt);
      this.statusBar.setMessage(
        saved.updatedAt ? `Saved at ${formatStamp(saved.updatedAt)}` : 'Saved',
      );
    } catch {
      this.statusBar.setMessage('Save failed — is the SSR API available?');
    } finally {
      this.busy.set(false);
    }
  }

  async load(): Promise<void> {
    if (this.busy()) {
      return;
    }

    this.busy.set(true);
    this.statusBar.setMessage('Loading…');

    try {
      const saved = await firstValueFrom(this.http.get<SavedSettings>('/api/settings'));
      this.applySettings(saved);
      this.statusBar.setLastSavedAt(saved.updatedAt);
      this.statusBar.setMessage(
        saved.updatedAt
          ? `Loaded save from ${formatStamp(saved.updatedAt)}`
          : 'Loaded defaults',
      );
    } catch {
      this.applySettings(DEFAULT_SAVED_SETTINGS);
      this.statusBar.setMessage('Load failed — applied built-in defaults');
    } finally {
      this.busy.set(false);
    }
  }

  private applySettings(settings: SavedSettings): void {
    const theme = normalizeTheme(settings.theme);
    this.theme.setPreference(theme);
    this.canvas.apply({
      width: clamp(settings.box?.width, 12, 48, DEFAULT_SAVED_SETTINGS.box.width),
      height: clamp(settings.box?.height, 8, 36, DEFAULT_SAVED_SETTINGS.box.height),
      left: Number.isFinite(settings.box?.left)
        ? settings.box.left
        : DEFAULT_SAVED_SETTINGS.box.left,
      top: Number.isFinite(settings.box?.top)
        ? settings.box.top
        : DEFAULT_SAVED_SETTINGS.box.top,
    });
  }
}

function normalizeTheme(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const next = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(next)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, next));
}

function formatStamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
